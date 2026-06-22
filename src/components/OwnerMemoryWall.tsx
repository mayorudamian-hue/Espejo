import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeApprovedComments } from '../lib/comments'
import type { MemoryComment } from '../types'
import MemoryCard from './MemoryCard'

export default function OwnerMemoryWall() {
  const { user } = useAuth()
  const [comments, setComments] = useState<MemoryComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeApprovedComments(user.uid, (data) => {
      setComments(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  if (loading) return <p className="subtitle">Cargando…</p>

  if (comments.length === 0) {
    return (
      <div className="empty-state card">
        <h3>Tu muro todavía está vacío</h3>
        <p>Cuando apruebes un comentario en "Revisión", va a aparecer acá, en orden cronológico.</p>
      </div>
    )
  }

  return (
    <div className="memory-wall-list">
      {comments.map((comment) => (
        <MemoryCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
