import type { Snippet } from '../types'
import { LANGUAGE_META } from '../types'

interface EditorTabsProps {
  openSnippets: Snippet[]
  activeId: string | null
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

export function EditorTabs({ openSnippets, activeId, onSelect, onClose }: EditorTabsProps) {
  if (openSnippets.length === 0) return null

  return (
    <div className="tabs">
      {openSnippets.map((s) => {
        const meta = LANGUAGE_META[s.language]
        return (
          <div
            key={s.id}
            className={`tab ${activeId === s.id ? 'tab--active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="tab__dot" style={{ background: meta.color }} />
            <span>{s.title}</span>
            <button
              className="tab__close"
              onClick={(e) => {
                e.stopPropagation()
                onClose(s.id)
              }}
              title="Fechar aba"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
