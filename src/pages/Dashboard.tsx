import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { subscribeEntries, deleteEntry } from '../lib/entries'
import type { ReflectionEntry } from '../types'
import EntryCard from '../components/EntryCard'
import StatCard from '../components/StatCard'
import ActivityCalendar from '../components/ActivityCalendar'
import './Dashboard.css'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [entries, setEntries] = useState<ReflectionEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeEntries(user.uid, (data) => {
      setEntries(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = entries.filter((e) => {
      const d = new Date(e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const tagCount = new Map<string, number>()
    for (const e of entries) {
      for (const t of e.emotionTags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1)
    }
    let topTag = '—'
    let topCount = 0
    for (const [tag, count] of tagCount) {
      if (count > topCount) {
        topTag = tag
        topCount = count
      }
    }

    return { total: entries.length, thisMonth: thisMonth.length, topTag }
  }, [entries])

  async function handleDelete(id: string) {
    if (confirm('¿Eliminar esta reflexión? No se puede deshacer.')) {
      await deleteEntry(id)
    }
  }

  const recent = entries.slice(0, 3)

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Panel</span>
        <h1>Hola, {profile?.displayName?.split(' ')[0] ?? ''}</h1>
        <p className="subtitle">Esto es lo que tu espejo está reflejando últimamente.</p>
      </div>

      <div className="dashboard-stats">
        <StatCard label="Reflexiones totales" value={stats.total} accent="brass" />
        <StatCard label="Este mes" value={stats.thisMonth} accent="plum" />
        <StatCard label="Emoción frecuente" value={stats.topTag} accent="sage" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-recent">
          <div className="dashboard-section-header">
            <h2>Últimas reflexiones</h2>
            <Link to="/diario/nueva" className="btn btn-primary">
              + Nueva reflexión
            </Link>
          </div>

          {loading ? (
            <p className="subtitle">Cargando…</p>
          ) : recent.length === 0 ? (
            <div className="empty-state card">
              <h3>Todavía no escribiste nada</h3>
              <p>Empezá con una sola frase sobre cómo llegaste hoy hasta acá.</p>
            </div>
          ) : (
            <div className="dashboard-recent-list">
              {recent.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <aside>
          <ActivityCalendar entries={entries} />
        </aside>
      </div>
    </div>
  )
}
