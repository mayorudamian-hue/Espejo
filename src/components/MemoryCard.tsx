import type { MemoryComment } from '../types'
import './MemoryCard.css'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MemoryCard({ comment }: { comment: MemoryComment }) {
  return (
    <article className="memory-card card">
      <span className="memory-card-question">{comment.question}</span>
      <p className="memory-card-content">{comment.content}</p>
      <div className="memory-card-footer">
        <span className="memory-card-author">{comment.isAnonymous ? 'Anónimo' : comment.authorName || 'Anónimo'}</span>
        <time className="memory-card-date">{formatDate(comment.createdAt)}</time>
      </div>
    </article>
  )
}
