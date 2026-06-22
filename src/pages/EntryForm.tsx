import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { createEntry, updateEntry } from '../lib/entries'
import EntryEditor from '../components/EntryEditor'
import type { ReflectionDraft } from '../types'

export default function EntryForm() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [initial, setInitial] = useState<ReflectionDraft | undefined>(undefined)
  const [loadingEntry, setLoadingEntry] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, 'entries', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setInitial({
          title: data.title ?? '',
          content: data.content ?? '',
          emotionTags: data.emotionTags ?? [],
          isPrivate: data.isPrivate ?? true,
        })
      }
      setLoadingEntry(false)
    })
  }, [id])

  async function handleSave(draft: ReflectionDraft) {
    if (!user) return
    setSaving(true)
    try {
      if (isEditing && id) {
        await updateEntry(id, draft)
      } else {
        await createEntry(user.uid, draft)
      }
      navigate('/diario')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">{isEditing ? 'Editar' : 'Nueva entrada'}</span>
        <h1>{isEditing ? 'Editar reflexión' : 'Una nueva reflexión'}</h1>
      </div>

      {loadingEntry ? (
        <p className="subtitle">Cargando…</p>
      ) : (
        <EntryEditor initial={initial} onSave={handleSave} saving={saving} />
      )}
    </div>
  )
}
