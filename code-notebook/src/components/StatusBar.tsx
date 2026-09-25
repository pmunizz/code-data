import type { Language } from '../types'
import { LANGUAGE_META } from '../types'
import { CheckCircle2, Database } from 'lucide-react'

interface StatusBarProps {
  total: number
  activeLanguage: Language | null
  savedAt: number | null
}

export function StatusBar({ total, activeLanguage, savedAt }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar__left">
        <span><Database size={13} /> {total} estudo{total === 1 ? '' : 's'} salvo{total === 1 ? '' : 's'}</span>
      </div>
      <div className="status-bar__right">
        {savedAt && <span className="status-saved"><CheckCircle2 size={13} /> Salvo às {new Date(savedAt).toLocaleTimeString('pt-BR')}</span>}
        {activeLanguage && <span>{LANGUAGE_META[activeLanguage].label}</span>}
        <span>UTF-8</span>
      </div>
    </div>
  )
}
