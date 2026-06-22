import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { ReflectionDraft, ReflectionEntry } from '../types'

const COLLECTION = 'entries'

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'number') return value
  return Date.now()
}

/** Se suscribe en tiempo real a las entradas del usuario, más recientes primero. */
export function subscribeEntries(uid: string, callback: (entries: ReflectionEntry[]) => void) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (snapshot) => {
    const entries: ReflectionEntry[] = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        uid: data.uid,
        title: data.title ?? '',
        content: data.content ?? '',
        emotionTags: data.emotionTags ?? [],
        isPrivate: data.isPrivate ?? true,
        createdAt: toMillis(data.createdAt),
        updatedAt: toMillis(data.updatedAt),
      }
    })
    callback(entries)
  })
}

export async function createEntry(uid: string, draft: ReflectionDraft) {
  await addDoc(collection(db, COLLECTION), {
    uid,
    ...draft,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateEntry(id: string, draft: ReflectionDraft) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...draft,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEntry(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}
