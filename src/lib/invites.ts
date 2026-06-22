import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Invite } from '../types'
import { generateToken } from './token'

const COLLECTION = 'invites'

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'number') return value
  return Date.now()
}

/** Crea un enlace de invitación nuevo y devuelve su token. */
export async function createInvite(ownerUid: string): Promise<string> {
  const token = generateToken()
  await setDoc(doc(db, COLLECTION, token), {
    ownerUid,
    active: true,
    createdAt: serverTimestamp(),
  })
  return token
}

export function subscribeInvites(ownerUid: string, callback: (invites: Invite[]) => void) {
  const q = query(collection(db, COLLECTION), where('ownerUid', '==', ownerUid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ownerUid: data.ownerUid,
          active: data.active ?? true,
          createdAt: toMillis(data.createdAt),
        }
      }),
    )
  })
}

export async function setInviteActive(token: string, active: boolean) {
  await updateDoc(doc(db, COLLECTION, token), { active })
}

/** Usado por la página pública para validar el enlace. Devuelve null si no existe. */
export async function getInvite(token: string): Promise<Invite | null> {
  const snap = await getDoc(doc(db, COLLECTION, token))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    ownerUid: data.ownerUid,
    active: data.active ?? true,
    createdAt: toMillis(data.createdAt),
  }
}
