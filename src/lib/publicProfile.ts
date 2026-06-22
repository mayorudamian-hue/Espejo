import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { PublicProfile } from '../types'

const COLLECTION = 'publicProfiles'

/**
 * Copia deliberadamente limitada del perfil. Se llama cada vez que el perfil
 * se guarda (ver Profile.tsx) para que la página pública nunca lea del
 * perfil privado completo ni, mucho menos, del diario.
 */
export async function syncPublicProfile(uid: string, data: PublicProfile) {
  await setDoc(doc(db, COLLECTION, uid), data)
}

export async function getPublicProfile(uid: string): Promise<PublicProfile | null> {
  const snap = await getDoc(doc(db, COLLECTION, uid))
  if (!snap.exists()) return null
  return snap.data() as PublicProfile
}
