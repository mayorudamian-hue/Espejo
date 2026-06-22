import type { MemoryComment } from '../types'
import './ReviewCard.css'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface Props {
  comment: MemoryComment
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onRevert: (id: string) => void
  onDelete: (id: string) => void
}

export default function ReviewCard({ comment, onApprove, onReject, onRevert, onDelete }: Props) {
  return (
    <article className={`review-card card status-${comment.status}`}>
      <div className="review-card-top">
        <span className="review-card-question">{comment.question}</span>
        <span className={`review-card-badge badge-${comment.status}`}>
          {comment.status === 'pending' ? 'Pendiente' : comment.status === 'approved' ? 'Aprobado' : 'Rechazado'}
        </span>
      </div>

      <p className="review-card-content">{comment.content}</p>

      <div className="review-card-footer">
        <span className="review-card-author">
          {comment.isAnonymous ? 'Anónimo' : comment.authorName || 'Anónimo'} · {formatDate(comment.createdAt)}
        </span>

        <div className="review-card-actions">
          {comment.status === 'pending' && (
            <>
              <button className="btn btn-primary" onClick={() => onApprove(comment.id)}>
                Aprobar
              </button>
              <button className="btn btn-danger" onClick={() => onReject(comment.id)}>
                Rechazar
              </button>
            </>
          )}
          {comment.status !== 'pending' && (
            <>
              <button className="btn btn-ghost" onClick={() => onRevert(comment.id)}>
                Volver a pendiente
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(comment.id)}>
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
