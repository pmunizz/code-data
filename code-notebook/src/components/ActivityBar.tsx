import { BookOpen, LayoutDashboard, Search, Settings } from 'lucide-react'

interface ActivityBarProps {
  view: 'overview' | 'studies'
  onViewChange: (view: 'overview' | 'studies') => void
  onSearch: () => void
}

export function ActivityBar({ view, onViewChange, onSearch }: ActivityBarProps) {
  return (
    <div className="activity-bar">
      <button className={`activity-bar__icon ${view === 'overview' ? 'activity-bar__icon--active' : ''}`} title="Overview" onClick={() => onViewChange('overview')}>
        <LayoutDashboard size={19} strokeWidth={1.8} />
      </button>
      <button className={`activity-bar__icon ${view === 'studies' ? 'activity-bar__icon--active' : ''}`} title="Meus estudos" onClick={() => onViewChange('studies')}>
        <BookOpen size={19} strokeWidth={1.8} />
      </button>
      <button className="activity-bar__icon" title="Pesquisar estudos" onClick={onSearch}>
        <Search size={19} strokeWidth={1.8} />
      </button>
      <button className="activity-bar__icon" title="Sobre">
        <Settings size={19} strokeWidth={1.8} />
      </button>
    </div>
  )
}
