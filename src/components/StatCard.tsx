import './StatCard.css'

interface Props {
  label: string
  value: string | number
  hint?: string
  accent?: 'brass' | 'plum' | 'sage'
}

export default function StatCard({ label, value, hint, accent = 'brass' }: Props) {
  return (
    <div className={`stat-card stat-card--${accent} card`}>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
      {hint && <span className="stat-card-hint">{hint}</span>}
    </div>
  )
}
