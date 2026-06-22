import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createInvite, setInviteActive, subscribeInvites } from '../lib/invites'
import type { Invite } from '../types'
import './InviteManager.css'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function inviteUrl(token: string) {
  return `${window.location.origin}${window.location.pathname}#/m/${token}`
}

export default function InviteManager() {
  const { user } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeInvites(user.uid, (data) => {
      setInvites(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function handleCreate() {
    if (!user) return
    setCreating(true)
    try {
      await createInvite(user.uid)
    } finally {
      setCreating(false)
    }
  }

  async function handleCopy(token: string) {
    const url = inviteUrl(token)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(token)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      prompt('Copiá el enlace:', url)
    }
  }

  return (
    <div>
      <div className="invite-intro">
        <p>
          Cada enlace abre una página pública limitada: muestra tu nombre, foto, biografía y frase, e invita a quien
          lo reciba a dejarte un recuerdo. Tu diario nunca aparece ahí.
        </p>
        <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
          {creating ? 'Generando…' : '+ Generar enlace de invitación'}
        </button>
      </div>

      {loading ? (
        <p className="subtitle">Cargando…</p>
      ) : invites.length === 0 ? (
        <div className="empty-state card">
          <h3>Todavía no generaste ningún enlace</h3>
          <p>Creá uno y compartilo con alguien para empezar tu muro de recuerdos.</p>
        </div>
      ) : (
        <ul className="invite-list">
          {invites.map((invite) => (
            <li key={invite.id} className={`invite-row card${invite.active ? '' : ' is-inactive'}`}>
              <div className="invite-row-info">
                <code className="invite-row-url">{inviteUrl(invite.id)}</code>
                <span className="invite-row-meta">
                  Creado el {formatDate(invite.createdAt)} · {invite.active ? 'Activo' : 'Desactivado'}
                </span>
              </div>
              <div className="invite-row-actions">
                <button className="btn btn-ghost" onClick={() => handleCopy(invite.id)}>
                  {copiedId === invite.id ? 'Copiado ✓' : 'Copiar'}
                </button>
                <button className="btn btn-ghost" onClick={() => setInviteActive(invite.id, !invite.active)}>
                  {invite.active ? 'Desactivar' : 'Reactivar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
