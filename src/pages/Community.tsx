import { useState } from 'react'
import InviteManager from '../components/InviteManager'
import ReviewInbox from '../components/ReviewInbox'
import OwnerMemoryWall from '../components/OwnerMemoryWall'
import './Community.css'

type Tab = 'invitar' | 'revision' | 'muro'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'invitar', label: 'Invitar' },
  { key: 'revision', label: 'Revisión' },
  { key: 'muro', label: 'Muro de recuerdos' },
]

export default function Community() {
  const [tab, setTab] = useState<Tab>('invitar')

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Comunidad</span>
        <h1>Lo que otros ven en vos</h1>
        <p className="subtitle">
          Invitá a alguien a contarte cómo te ve. Vos decidís qué recuerdo se queda en tu muro.
        </p>
      </div>

      <div className="community-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`community-tab${tab === key ? ' is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="community-panel">
        {tab === 'invitar' && <InviteManager />}
        {tab === 'revision' && <ReviewInbox />}
        {tab === 'muro' && <OwnerMemoryWall />}
      </div>
    </div>
  )
}
