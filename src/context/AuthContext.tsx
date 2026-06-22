import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { UserProfile } from '../types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  register: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  saveProfile: (data: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'bio' | 'quote'>>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(uid: string) {
    const snap = await getDoc(doc(db, 'profiles', uid))
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await loadProfile(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function register(email: string, password: string, displayName: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateAuthProfile(credential.user, { displayName })

    const newProfile: UserProfile = {
      uid: credential.user.uid,
      displayName,
      photoURL: null,
      bio: '',
      quote: '',
      createdAt: Date.now(),
    }
    await setDoc(doc(db, 'profiles', credential.user.uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
    })
    setProfile(newProfile)
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.uid)
  }

  async function saveProfile(data: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'bio' | 'quote'>>) {
    if (!user) return
    await updateDoc(doc(db, 'profiles', user.uid), data)
    if (data.displayName) {
      await updateAuthProfile(user, { displayName: data.displayName })
    }
    setProfile((prev) => (prev ? { ...prev, ...data } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, refreshProfile, saveProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
