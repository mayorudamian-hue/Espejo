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
import type { CommentStatus, MemoryComment, MemoryCommentDraft } from '../types'

const COLLECTION = 'comments'

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'number') return value
  return Date.now()
}

function fromDoc(id: string, data: Record<string, unknown>): MemoryComment {
  return {
    id,
    ownerUid: data.ownerUid as string,
    inviteId: (data.inviteId as string) ?? null,
    question: data.question as MemoryComment['question'],
    content: data.content as string,
    authorName: (data.authorName as string) ?? null,
    isAnonymous: Boolean(data.isAnonymous),
    status: (data.status as CommentStatus) ?? 'pending',
    createdAt: toMillis(data.createdAt),
  }
}

/** Cualquiera puede dejar un recuerdo: queda pendiente hasta que el dueño lo modere. */
export async function createComment(draft: MemoryCommentDraft) {
  await addDoc(collection(db, COLLECTION), {
    ...draft,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

/** Todos los comentarios del dueño (cualquier estado), para la bandeja de revisión. */
export function subscribeOwnerComments(ownerUid: string, callback: (comments: MemoryComment[]) => void) {
  const q = query(collection(db, COLLECTION), where('ownerUid', '==', ownerUid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => fromDoc(d.id, d.data())))
  })
}

/**
 * Muro de recuerdos: solo comentarios aprobados, en orden cronológico
 * (del más antiguo al más nuevo — como una pared que se va llenando con el tiempo).
 */
export function subscribeApprovedComments(ownerUid: string, callback: (comments: MemoryComment[]) => void) {
  const q = query(
    collection(db, COLLECTION),
    where('ownerUid', '==', ownerUid),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'asc'),
  )
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => fromDoc(d.id, d.data())))
  })
}

export async function setCommentStatus(id: string, status: CommentStatus) {
  await updateDoc(doc(db, COLLECTION, id), { status })
}

export async function deleteComment(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}
