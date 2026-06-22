import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'
import './AuthForm.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('No pudimos iniciar sesión. Revisá tu correo y contraseña.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout tagline="Un espacio tranquilo para volver a vos, las veces que quieras.">
      <form className="auth-form card" onSubmit={handleSubmit}>
        <h1>Bienvenido de nuevo</h1>
        <p className="auth-form-subtitle">Iniciá sesión para continuar tu reflexión.</p>

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
            autoComplete="current-password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary auth-form-submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>

        <p className="auth-form-footer">
          ¿Todavía no tenés cuenta? <Link to="/registro">Creá una</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
