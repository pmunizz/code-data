import { useMemo } from 'react'
import { BookOpen, FilePlus2, LayoutDashboard } from 'lucide-react'
import type { Language, Snippet } from '../types'
import { LANGUAGE_META, LANGUAGE_ORDER } from '../types'

interface SidebarProps {
  snippets: Snippet[]
  activeId: string | null
  onOpen: (id: string) => void
  onNew: () => void
  view: 'overview' | 'studies'
  onViewChange: (view: 'overview' | 'studies') => void
  query: string
}

export function Sidebar({ snippets, activeId, onOpen, onNew, view, onViewChange, query }: SidebarProps) {
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? snippets.filter((s) => s.title.toLowerCase().includes(q)) : snippets

    const map = new Map<Language, Snippet[]>()
    for (const lang of LANGUAGE_ORDER) map.set(lang, [])
    for (const s of filtered) map.get(s.language)?.push(s)
    return map
  }, [snippets, query])

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="brand-mark">CD</span>
          <div>
            <strong>CODE DATA</strong>
            <span>workspace pessoal</span>
          </div>
        </div>
        <button className="sidebar__new-btn" title="Novo estudo" onClick={() => onNew()} aria-label="Novo estudo">
          <FilePlus2 size={16} />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        <button className={view === 'overview' ? 'sidebar__nav-item sidebar__nav-item--active' : 'sidebar__nav-item'} onClick={() => onViewChange('overview')}>
          <LayoutDashboard size={15} /> Overview
        </button>
        <button className={view === 'studies' ? 'sidebar__nav-item sidebar__nav-item--active' : 'sidebar__nav-item'} onClick={() => onViewChange('studies')}>
          <BookOpen size={15} /> Meus estudos
          <span>{snippets.length}</span>
        </button>
      </nav>

      <div className="sidebar__tree">
        {snippets.length === 0 ? (
          <div className="sidebar__empty">
            Nenhum estudo ainda. Use o botão <strong>novo</strong> para registrar seu primeiro padrão.
          </div>
        ) : grouped && !Array.from(grouped.values()).some((items) => items.length > 0) ? (
          <div className="sidebar__empty">
            Nenhum estudo encontrado para <strong>“{query}”</strong>.
          </div>
        ) : (
          LANGUAGE_ORDER.map((lang) => {
            const items = grouped.get(lang) ?? []
            if (items.length === 0) return null
            const meta = LANGUAGE_META[lang]
            return (
              <div key={lang}>
                <div className="tree-group__label">
                  <span className="tree-group__swatch" style={{ background: meta.color }} />
                  {meta.label.toUpperCase()} · {items.length}
                </div>
                {items.map((s) => (
                  <button
                    key={s.id}
                    className={`tree-item ${activeId === s.id ? 'tree-item--active' : ''}`}
                    onClick={() => onOpen(s.id)}
                    title={s.title}
                  >
                    <span className="tree-item__name">{s.title}</span>
                    <span className="tree-item__ext">{meta.extension}</span>
                  </button>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
