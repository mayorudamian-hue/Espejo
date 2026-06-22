// Etiquetas emocionales disponibles para las entradas del diario.
// Pensadas para fase 2/3: estas mismas etiquetas alimentarán el
// "Mapa de Identidad" y el dashboard de tendencias más adelante.
export const EMOTION_TAGS = [
  'calma',
  'alegría',
  'gratitud',
  'tristeza',
  'ansiedad',
  'enojo',
  'esperanza',
  'confusión',
  'orgullo',
  'cansancio',
] as const

export type EmotionTag = (typeof EMOTION_TAGS)[number]

export interface UserProfile {
  uid: string
  displayName: string
  photoURL: string | null
  bio: string
  quote: string
  createdAt: number
}

export interface ReflectionEntry {
  id: string
  uid: string
  title: string
  content: string
  emotionTags: EmotionTag[]
  isPrivate: boolean
  createdAt: number
  updatedAt: number
}

// Forma de los datos tal como se editan en el formulario,
// antes de tener id / timestamps asignados por Firestore.
export type ReflectionDraft = Pick<ReflectionEntry, 'title' | 'content' | 'emotionTags' | 'isPrivate'>

// ===== Fase 2: invitaciones, página pública y muro de recuerdos =====

export interface Invite {
  id: string // el token también es el id del documento
  ownerUid: string
  createdAt: number
  active: boolean
}

// Versión deliberadamente limitada del perfil, pensada para ser pública.
// Se sincroniza desde Profile.tsx cada vez que el perfil se guarda.
export interface PublicProfile {
  displayName: string
  photoURL: string | null
  bio: string
  quote: string
}

// Las únicas preguntas que un/a invitado/a puede responder.
// Mantenerlas como lista cerrada es a propósito: guía la reflexión
// del invitado y evita comentarios genéricos o fuera de tono.
export const MEMORY_QUESTIONS = [
  '¿Cómo describirías a esta persona?',
  '¿Cuál es su mayor fortaleza?',
  '¿Qué recuerdo gracioso tienes con ella?',
  '¿Qué valor aporta a quienes la rodean?',
  '¿Qué debería recordar cuando se sienta perdido?',
] as const

export type MemoryQuestion = (typeof MEMORY_QUESTIONS)[number]

export type CommentStatus = 'pending' | 'approved' | 'rejected'

export interface MemoryComment {
  id: string
  ownerUid: string
  inviteId: string | null
  question: MemoryQuestion
  content: string
  authorName: string | null
  isAnonymous: boolean
  status: CommentStatus
  createdAt: number
}

export type MemoryCommentDraft = Pick<
  MemoryComment,
  'ownerUid' | 'inviteId' | 'question' | 'content' | 'authorName' | 'isAnonymous'
>
