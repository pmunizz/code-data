import { ArrowRight, Code2, FileCode2, Plus } from 'lucide-react'
import type { Language, Snippet } from '../types'
import { LANGUAGE_META, LANGUAGE_ORDER } from '../types'

interface OverviewProps {
  snippets: Snippet[]
  onOpenSnippet: (id: string) => void
  onNewSnippet: (language: Language) => void
  query?: string
}

export function Overview({ snippets, onOpenSnippet, onNewSnippet, query = '' }: OverviewProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const groups = LANGUAGE_ORDER.map((language) => ({
    language,
    snippets: snippets.filter(
      (snippet) =>
        snippet.language === language &&
        snippet.title.toLocaleLowerCase().includes(normalizedQuery),
    ),
  }))

  return (
    <section className="overview">
      <div className="overview__hero">
        <div>
          <span className="eyebrow">VISÃO GERAL DO WORKSPACE</span>
          <h1>Seu conhecimento, em contexto.</h1>
          <p>Explore seus padrões por linguagem e retome qualquer estudo em um clique.</p>
        </div>
        <div className="overview__metric">
          <Code2 size={18} />
          <strong>{snippets.length}</strong>
          <span>estudos salvos</span>
        </div>
      </div>

      <div className="overview-board">
        {groups.map(({ language, snippets: languageSnippets }) => {
            const meta = LANGUAGE_META[language]
            return (
              <section className="overview-column" key={language}>
                <div className="overview-group__header">
                  <div className="overview-group__title">
                    <span className="overview-group__swatch" style={{ background: meta.color }} />
                    <h2>{meta.label}</h2>
                    <span>{languageSnippets.length} {languageSnippets.length === 1 ? 'estudo' : 'estudos'}</span>
                  </div>
                  <span className="overview-group__extension">{meta.extension}</span>
                </div>
                <div className="overview-cards">
                  {languageSnippets.length === 0 && !normalizedQuery && (
                    <div className="overview-column__empty">
                      <FileCode2 size={17} />
                      <span>Nenhum estudo ainda</span>
                    </div>
                  )}
                  {languageSnippets.map((snippet) => (
                    <button
                      className="overview-card"
                      key={snippet.id}
                      onClick={() => onOpenSnippet(snippet.id)}
                    >
                      <div className="overview-card__top">
                        <span className="overview-card__icon" style={{ color: meta.color }}>
                          <FileCode2 size={16} />
                        </span>
                        <ArrowRight size={15} className="overview-card__arrow" />
                      </div>
                      <strong>{snippet.title}</strong>
                      <p>{snippet.pattern.split('\n').find((line) => line.trim() && !line.trim().startsWith('#')) || 'Sem descrição adicionada ainda.'}</p>
                      <div className="overview-card__tags">
                        {snippet.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
                      </div>
                    </button>
                  ))}
                </div>
                <button className="overview-column__add" onClick={() => onNewSnippet(language)}>
                  <Plus size={14} /> Adicionar estudo
                </button>
              </section>
            )
        })}
      </div>
      {normalizedQuery && !groups.some((group) => group.snippets.length > 0) && (
        <div className="overview__no-results">
          <strong>Nenhum estudo encontrado</strong>
          <span>Não há cards com “{query}” no nome.</span>
        </div>
      )}
    </section>
  )
}
