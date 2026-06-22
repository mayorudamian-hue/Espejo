import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getInvite } from '../lib/invites'
import { getPublicProfile } from '../lib/publicProfile'
import { createComment, subscribeApprovedComments } from '../lib/comments'
import { MEMORY_QUESTIONS, type MemoryComment, type MemoryQuestion, type PublicProfile } from '../types'
import MemoryCard from '../components/MemoryCard'
import './PublicMemoryPage.css'

type LoadState = 'loading' | 'invalid' | 'ready'

export default function PublicMemoryPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<LoadState>('loading')
  const [ownerUid, setOwnerUid] = useState<string | null>(null)
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [wall, setWall] = useState<MemoryComment[]>([])

  const [question, setQuestion] = useState<MemoryQuestion | ''>('')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [honeypot, setHoneypot] = useState('') // campo trampa para bots, debe quedar vacío
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!token) return
    let active = true
    ;(async () => {
      const invite = await getInvite(token)
      if (!active) return
      if (!invite || !invite.active) {
        setState('invalid')
        return
      }
      const publicProfile = await getPublicProfile(invite.ownerUid)
      if (!active) return
      if (!publicProfile) {
        setState('invalid')
        return
      }
      setOwnerUid(invite.ownerUid)
      setProfile(publicProfile)
      setState('ready')
    })()
    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    if (!ownerUid) return
    return subscribeApprovedComments(ownerUid, setWall)
  }, [ownerUid])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot) {
      // Un bot llenó el campo trampa: simulamos éxito sin guardar nada.
      setSubmitted(true)
      return
    }
    if (!question) {
      setError('Elegí una pregunta para responder.')
      return
    }
    if (content.trim().length < 3) {
      setError('Contame un poco más — al menos unas palabras.')
      return
    }
    if (!isAnonymous && !authorName.trim()) {
      setError('Escribí tu nombre o marcá "Prefiero ser anónimo/a".')
      return
    }
    if (!ownerUid || !token) return

    setError('')
    setSubmitting(true)
    try {
      await createComment({
        ownerUid,
        inviteId: token,
        question,
        content: content.trim(),
        authorName: isAnonymous ? null : authorName.trim(),
        isAnonymous,
      })
      setSubmitted(true)
    } catch {
      setError('No pudimos guardar tu recuerdo. Probá de nuevo en un momento.')
    } finally {
      setSubmitting(false)
    }
  }

  function leaveAnother() {
    setSubmitted(false)
    setQuestion('')
    setContent('')
    setAuthorName('')
    setIsAnonymous(false)
  }

  if (state === 'loading') {
    return <div className="public-state">Abriendo el espejo…</div>
  }

  if (state === 'invalid') {
    return (
      <div className="public-state">
        <h1>Este enlace ya no está disponible</h1>
        <p>Puede que haya sido desactivado o que el link tenga un error. Pedile a quien te lo envió uno nuevo.</p>
        <Link to="/" className="btn btn-ghost">
          Ir a Espejo
        </Link>
      </div>
    )
  }

  return (
    <div className="public-page">
      <header className="public-hero">
        <div className="public-hero-avatar">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" />
          ) : (
            <span>{(profile?.displayName || '?').charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h1>{profile?.displayName}</h1>
        {profile?.quote && <p className="public-hero-quote">"{profile.quote}"</p>}
        {profile?.bio && <p className="public-hero-bio">{profile.bio}</p>}
      </header>

      <main className="public-main">
        {submitted ? (
          <section className="public-thanks card">
            <h2>Gracias por dejar tu recuerdo</h2>
            <p>
              {profile?.displayName} va a revisarlo antes de que aparezca en el muro. No hace falta que hagas nada
              más.
            </p>
            <button className="btn btn-ghost" onClick={leaveAnother}>
              Dejar otro recuerdo
            </button>
          </section>
        ) : (
          <form className="public-form card" onSubmit={handleSubmit}>
            <h2>Dejale un recuerdo a {profile?.displayName?.split(' ')[0]}</h2>

            <div className="field">
              <label>Elegí una pregunta</label>
              <div className="public-question-list">
                {MEMORY_QUESTIONS.map((q) => (
                  <label key={q} className={`public-question-option${question === q ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="question"
                      value={q}
                      checked={question === q}
                      onChange={() => setQuestion(q)}
                    />
                    {q}
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="content">Tu respuesta</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Escribí con tranquilidad, esto puede significar mucho."
              />
            </div>

            <label className="public-anonymous-toggle">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Prefiero ser anónimo/a
            </label>

            {!isAnonymous && (
              <div className="field">
                <label htmlFor="authorName">Tu nombre</label>
                <input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="¿Cómo querés firmar?"
                />
              </div>
            )}

            {/* Campo trampa para bots: invisible para personas, oculto del flujo de tabulación. */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="public-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enviando…' : 'Enviar recuerdo'}
            </button>
          </form>
        )}

        <section className="public-wall">
          <h2 className="public-wall-title">Muro de recuerdos</h2>
          {wall.length === 0 ? (
            <p className="subtitle">Todavía no hay recuerdos aprobados. ¡Sé la primera persona en dejar uno!</p>
          ) : (
            <div className="public-wall-list">
              {wall.map((comment) => (
                <MemoryCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="public-footer">
        Hecho con <Link to="/">Espejo</Link>
      </footer>
    </div>
  )
}
