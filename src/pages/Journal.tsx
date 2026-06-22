import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { subscribeEntries, deleteEntry } from '../lib/entries'
import type { EmotionTag, ReflectionEntry } from '../types'
import { EMOTION_TAGS } from '../types'
import EntryCard from '../components/EntryCard'
import '../components/EmotionTagPicker.css'
import './Journal.css'

export default function Journal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<ReflectionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EmotionTag | 'todas'>('todas')

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeEntries(user.uid, (data) => {
      setEntries(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function handleDelete(id: string) {
    if (confirm('¿Eliminar esta reflexión? No se puede deshacer.')) {
      await deleteEntry(id)
    }
  }

  const visible = filter === 'todas' ? entries : entries.filter((e) => e.emotionTags.includes(filter))
  const usedTags = Array.from(new Set(entries.flatMap((e) => e.emotionTags))).filter((t) =>
    EMOTION_TAGS.includes(t),
  )

  return (
    <div>
      <div className="page-header journal-header">
        <div>
          <span className="eyebrow">Diario de reflexión</span>
          <h1>Tu diario</h1>
          <p className="subtitle">Un registro privado de cómo vas cambiando.</p>
        </div>
        <Link to="/diario/nueva" className="btn btn-primary">
          + Nueva reflexión
        </Link>
      </div>

      {usedTags.length > 0 && (
        <div className="journal-filters">
          <button
            className={`tag-chip${filter === 'todas' ? ' is-selected' : ''}`}
            onClick={() => setFilter('todas')}
          >
            Todas
          </button>
          {usedTags.map((tag) => (
            <button
              key={tag}
              className={`tag-chip${filter === tag ? ' is-selected' : ''}`}
              onClick={() => setFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="subtitle">Cargando…</p>
      ) : visible.length === 0 ? (
        <div className="empty-state card">
          <h3>{entries.length === 0 ? 'Todavía no hay reflexiones' : 'Nada con esa etiqueta'}</h3>
          <p>
            {entries.length === 0
              ? 'Tu primera entrada puede ser tan simple como "hoy me sentí…"'
              : 'Probá con otra etiqueta o mirá todas tus reflexiones.'}
          </p>
        </div>
      ) : (
        <div className="journal-list">
          {visible.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
