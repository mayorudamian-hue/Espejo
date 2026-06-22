import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

export default function Profile() {
  const { profile, saveProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [quote, setQuote] = useState(profile?.quote ?? '')
  const [photoURL, setPhotoURL] = useState(profile?.photoURL ?? '')
  const [saving, setSaving] = useState(false)
  const [savedJustNow, setSavedJustNow] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveProfile({ displayName: displayName.trim(), bio: bio.trim(), quote: quote.trim(), photoURL: photoURL.trim() || null })
      setSavedJustNow(true)
      setTimeout(() => setSavedJustNow(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Perfil</span>
        <h1>Quién eres en este espejo</h1>
        <p className="subtitle">Esta información es tuya. Más adelante podrás decidir qué parte compartir.</p>
      </div>

      <form className="profile-form card" onSubmit={handleSubmit}>
        <div className="profile-avatar-row">
          <div className="profile-avatar-preview">
            {photoURL ? (
              <img src={photoURL} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <span>{(displayName || '?').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="photoURL">URL de foto (opcional)</label>
            <input
              id="photoURL"
              value={photoURL ?? ''}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="displayName">Nombre</label>
          <input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="bio">Biografía</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Contá brevemente quién eres."
          />
        </div>

        <div className="field">
          <label htmlFor="quote">Tu frase personal</label>
          <input
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Algo que te represente"
            maxLength={140}
          />
        </div>

        <div className="profile-form-footer">
          {savedJustNow && <span className="profile-saved">Guardado</span>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
