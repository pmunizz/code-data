import { useEffect, useRef, useState } from 'react'
import type { Snippet, SnippetDraft } from './types'
import { repository } from './lib/repository'
import { SEED_SNIPPETS } from './lib/seed'
import { ActivityBar } from './components/ActivityBar'
import { Sidebar } from './components/Sidebar'
import { EditorTabs } from './components/EditorTabs'
import { EditorPane } from './components/EditorPane'
import { StatusBar } from './components/StatusBar'
import { Code2, Plus, Search, X } from 'lucide-react'
import { Overview } from './components/Overview'
import { WelcomeScreen } from './components/WelcomeScreen'

const DEFAULT_PATTERN = `## O que este padrão resolve?

Descreva o problema ou situação em que este padrão é útil.

## Como funciona?

Explique a ideia com suas próprias palavras e o raciocínio por trás da solução.

## Quando usar?

Liste os sinais que ajudam a reconhecer este padrão em um projeto real.

## Cuidados e trade-offs

O que pode dar errado? Existe uma alternativa melhor em algum cenário?

## Exemplo prático

Descreva o resultado esperado e conecte a explicação ao código acima.`

export default function App() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [openIds, setOpenIds] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'overview' | 'studies'>('overview')
  const [hasEntered, setHasEntered] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const hasBootstrapped = useRef(false)

  useEffect(() => {
    async function bootstrap() {
      if (hasBootstrapped.current) return
      hasBootstrapped.current = true
      try {
        let list = await repository.list()
        if (list.length === 0) {
          for (const draft of SEED_SNIPPETS) {
            await repository.create(draft)
          }
          list = await repository.list()
        }
        setSnippets(list)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Não foi possível carregar os snippets.'
        setError(
          message.includes("Could not find the table 'public.snippets'")
            ? `${message}. Execute o arquivo supabase/migrations/001_create_snippets.sql no SQL Editor do Supabase.`
            : message,
        )
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  function openSnippet(id: string) {
    setView('studies')
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setActiveId(id)
  }

  function focusSearch() {
    searchRef.current?.focus()
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  function closeTab(id: string) {
    setOpenIds((prev) => {
      const next = prev.filter((x) => x !== id)
      if (activeId === id) {
        setActiveId(next.length > 0 ? next[next.length - 1] : null)
      }
      return next
    })
  }

  async function handleNew(language: Snippet['language'] = 'javascript') {
    try {
      const created = await repository.create({
        title: 'Novo estudo',
        language,
        code: '// comece a escrever aqui\n',
        pattern: DEFAULT_PATTERN,
        tags: [],
      })
      setSnippets((prev) => [created, ...prev])
      openSnippet(created.id)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o snippet.')
    }
  }

  async function handleUpdate(id: string, patch: Partial<SnippetDraft>) {
    try {
      const updated = await repository.update(id, patch)
      setSnippets((prev) => prev.map((s) => (s.id === id ? updated : s)))
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar o snippet.')
    }
  }

  async function handleDelete(id: string) {
    try {
      await repository.remove(id)
      setSnippets((prev) => prev.filter((s) => s.id !== id))
      closeTab(id)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível apagar o snippet.')
    }
  }

  const openSnippets = openIds
    .map((id) => snippets.find((s) => s.id === id))
    .filter((s): s is Snippet => Boolean(s))

  const activeSnippet = snippets.find((s) => s.id === activeId) ?? null

  if (loading) {
    return (
      <div className="app-shell">
        <div style={{ gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Carregando o Code Data...
        </div>
      </div>
    )
  }

  if (!hasEntered) {
    return <WelcomeScreen onEnter={() => setHasEntered(true)} />
  }

  return (
    <div className="app-shell">
      {error && (
        <div role="alert" style={{ position: 'fixed', top: 12, right: 12, zIndex: 10, maxWidth: 420, padding: '10px 14px', color: '#ffd7d7', background: '#5a2525', border: '1px solid #a84b4b', borderRadius: 4 }}>
          {error}
        </div>
      )}
      <ActivityBar view={view} onViewChange={setView} onSearch={focusSearch} />
      <Sidebar
        snippets={snippets}
        activeId={activeId}
        onOpen={openSnippet}
        onNew={handleNew}
        view={view}
        onViewChange={setView}
        query={query}
      />

      <div className="main">
        <div className="global-search">
          <Search size={16} />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar estudos pelo nome..."
            aria-label="Pesquisar estudos pelo nome"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpar pesquisa">
              <X size={15} />
            </button>
          ) : (
            <kbd>⌘ K</kbd>
          )}
        </div>
        {view === 'overview' ? (
          <Overview snippets={snippets} onOpenSnippet={openSnippet} onNewSnippet={handleNew} query={query} />
        ) : (
          <>
            <EditorTabs
              openSnippets={openSnippets}
              activeId={activeId}
              onSelect={setActiveId}
              onClose={closeTab}
            />
            {activeSnippet ? (
              <EditorPane
                key={activeSnippet.id}
                snippet={activeSnippet}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onSaved={setSavedAt}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-state__logo"><Code2 size={34} /></div>
                <span className="eyebrow">SEU WORKSPACE DE CONHECIMENTO</span>
                <h2>Transforme código em conhecimento</h2>
                <p>Escolha um estudo na barra lateral ou crie um novo registro para organizar padrões, decisões e aprendizados técnicos.</p>
                <button className="empty-state__cta" onClick={() => handleNew()}><Plus size={16} /> Novo estudo</button>
              </div>
            )}
          </>
        )}
      </div>

      <StatusBar total={snippets.length} activeLanguage={activeSnippet?.language ?? null} savedAt={savedAt} />
    </div>
  )
}
