import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { deleteComment, setCommentStatus, subscribeOwnerComments } from '../lib/comments'
import type { CommentStatus, MemoryComment } from '../types'
import ReviewCard from './ReviewCard'
import './ReviewInbox.css'

const TABS: Array<{ key: CommentStatus; label: string }> = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'approved', label: 'Aprobados' },
  { key: 'rejected', label: 'Rechazados' },
]

export default function ReviewInbox() {
  const { user } = useAuth()
  const [comments, setComments] = useState<MemoryComment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<CommentStatus>('pending')

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeOwnerComments(user.uid, (data) => {
      setComments(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 }
    for (const comment of comments) c[comment.status]++
    return c
  }, [comments])

  const visible = comments.filter((c) => c.status === tab)

  return (
    <div>
      <div className="review-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`review-tab${tab === key ? ' is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
            <span className="review-tab-count">{counts[key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="subtitle">Cargando…</p>
      ) : visible.length === 0 ? (
        <div className="empty-state card">
          <h3>
            {tab === 'pending' ? 'No hay nada esperando revisión' : `No hay comentarios ${tab === 'approved' ? 'aprobados' : 'rechazados'}`}
          </h3>
          <p>
            {tab === 'pending'
              ? 'Cuando alguien responda a tu invitación, va a aparecer aquí antes de mostrarse en tu muro.'
              : 'Volvé a esta pestaña cuando modere algo.'}
          </p>
        </div>
      ) : (
        <div className="review-list">
          {visible.map((comment) => (
            <ReviewCard
              key={comment.id}
              comment={comment}
              onApprove={(id) => setCommentStatus(id, 'approved')}
              onReject={(id) => setCommentStatus(id, 'rejected')}
              onRevert={(id) => setCommentStatus(id, 'pending')}
              onDelete={(id) => {
                if (confirm('¿Eliminar este comentario definitivamente?')) deleteComment(id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
