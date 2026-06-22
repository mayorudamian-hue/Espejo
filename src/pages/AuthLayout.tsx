import type { ReactNode } from 'react'
import './AuthLayout.css'

interface Props {
  children: ReactNode
  tagline: string
}

export default function AuthLayout({ children, tagline }: Props) {
  return (
    <div className="auth-layout">
      <div className="auth-glass" aria-hidden="true">
        <div className="auth-glass-glow" />
        <div className="auth-glass-content">
          <span className="auth-glass-mark">Espejo</span>
          <p className="auth-glass-tagline">{tagline}</p>
        </div>
      </div>
      <div className="auth-form-side">{children}</div>
    </div>
  )
}
