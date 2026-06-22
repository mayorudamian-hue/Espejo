import { Link } from 'react-router-dom'
import type { ReflectionEntry } from '../types'
import './EntryCard.css'

interface Props {
  entry: ReflectionEntry
  onDelete: (id: string) => void
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function excerpt(text: string, max = 160) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function EntryCard({ entry, onDelete }: Props) {
  return (
    <article className="entry-card card">
      <div className="entry-card-top">
        <time className="entry-card-date">{formatDate(entry.createdAt)}</time>
        {entry.isPrivate && <span className="entry-card-private">Privada</span>}
      </div>

      <h3 className="entry-card-title">{entry.title || 'Sin título'}</h3>
      <p className="entry-card-excerpt">{excerpt(entry.content)}</p>

      {entry.emotionTags.length > 0 && (
        <div className="entry-card-tags">
          {entry.emotionTags.map((tag) => (
            <span key={tag} className="entry-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="entry-card-actions">
        <Link to={`/diario/${entry.id}/editar`} className="btn btn-ghost">
          Editar
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(entry.id)}>
          Eliminar
        </button>
      </div>
    </article>
  )
}
