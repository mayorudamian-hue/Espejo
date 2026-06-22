import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'
import './AuthForm.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña necesita al menos 6 caracteres.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await register(email, password, name.trim())
      navigate('/')
    } catch (err) {
      setError('No pudimos crear tu cuenta. Probá con otro correo o revisá la contraseña.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout tagline="Cada reflexión que guardes hoy es algo que vas a poder mirar de nuevo más adelante.">
      <form className="auth-form card" onSubmit={handleSubmit}>
        <h1>Creá tu espejo</h1>
        <p className="auth-form-subtitle">Tus reflexiones son privadas por defecto. Vos decidís qué compartir.</p>

        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </div>

        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary auth-form-submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth-form-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
