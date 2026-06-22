import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import EmotionTagPicker from './EmotionTagPicker'
import type { EmotionTag, ReflectionDraft } from '../types'
import './EntryEditor.css'

interface Props {
  initial?: ReflectionDraft
  onSave: (draft: ReflectionDraft) => Promise<void>
  saving: boolean
}

export default function EntryEditor({ initial, onSave, saving }: Props) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [tags, setTags] = useState<EmotionTag[]>(initial?.emotionTags ?? [])
  const [isPrivate, setIsPrivate] = useState(initial?.isPrivate ?? true)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('Escribí algo, aunque sea una frase. El espejo necesita una imagen para devolverte algo.')
      return
    }
    setError('')
    await onSave({ title: title.trim(), content: content.trim(), emotionTags: tags, isPrivate })
  }

  return (
    <form className="entry-editor card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Título (opcional)</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Un nombre para este momento"
          maxLength={120}
        />
      </div>

      <div className="field">
        <label htmlFor="content">¿Qué tenés para reflejar hoy?</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribí libremente. Nadie más lo va a leer salvo que vos decidas lo contrario."
          rows={9}
        />
      </div>

      <div className="field">
        <label>¿Cómo te sentís con esto?</label>
        <EmotionTagPicker selected={tags} onChange={setTags} />
      </div>

      <label className="entry-editor-privacy">
        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
        Mantener esta entrada privada
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="entry-editor-actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/diario')}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar reflexión'}
        </button>
      </div>
    </form>
  )
}
