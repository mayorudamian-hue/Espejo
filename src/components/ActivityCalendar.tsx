import { useMemo } from 'react'
import type { ReflectionEntry } from '../types'
import './ActivityCalendar.css'

interface Props {
  entries: ReflectionEntry[]
}

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function ActivityCalendar({ entries }: Props) {
  const { cells, monthLabel } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const countByDay = new Map<number, number>()
    for (const entry of entries) {
      const d = new Date(entry.createdAt)
      if (d.getFullYear() === year && d.getMonth() === month) {
        countByDay.set(d.getDate(), (countByDay.get(d.getDate()) ?? 0) + 1)
      }
    }

    const firstOfMonth = new Date(year, month, 1)
    // Lunes = 0 ... Domingo = 6
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<{ day: number | null; count: number; isToday: boolean }> = []
    for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null, count: 0, isToday: false })
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, count: countByDay.get(day) ?? 0, isToday: day === now.getDate() })
    }

    const monthLabel = now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    return { cells, monthLabel }
  }, [entries])

  function intensity(count: number) {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count === 2) return 2
    return 3
  }

  return (
    <div className="activity-calendar card">
      <div className="activity-calendar-header">
        <h3>Actividad de {monthLabel}</h3>
      </div>
      <div className="activity-calendar-weekdays">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="activity-calendar-grid">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`activity-cell${cell.day ? '' : ' is-blank'}${cell.isToday ? ' is-today' : ''}`}
            data-intensity={intensity(cell.count)}
            title={cell.day ? `${cell.count} reflexión(es)` : undefined}
          >
            {cell.day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}
