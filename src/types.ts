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
