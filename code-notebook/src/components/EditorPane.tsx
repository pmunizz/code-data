import { useEffect, useRef, useState } from 'react'
import type { Language, Snippet, SnippetDraft } from '../types'
import { LANGUAGE_META, LANGUAGE_ORDER } from '../types'
import { CodeEditor } from './CodeEditor'
import { Trash2 } from 'lucide-react'
import { WandSparkles } from 'lucide-react'

const WRITING_TEMPLATE = `## O que este padrão resolve?

Descreva o problema ou situação em que este padrão é útil.

## Como funciona?

Explique a ideia com suas próprias palavras e o raciocínio por trás da solução.

## Quando usar?

Liste os sinais que ajudam a reconhecer este padrão em um projeto real.

## Cuidados e trade-offs

O que pode dar errado? Existe uma alternativa melhor em algum cenário?

## Exemplo prático

Descreva o resultado esperado e conecte a explicação ao código acima.`

interface EditorPaneProps {
  snippet: Snippet
  onUpdate: (id: string, patch: Partial<SnippetDraft>) => void
  onDelete: (id: string) => void
  onSaved: (timestamp: number) => void
}

export function EditorPane({ snippet, onUpdate, onDelete, onSaved }: EditorPaneProps) {
  const [title, setTitle] = useState(snippet.title)
  const [language, setLanguage] = useState<Language>(snippet.language)
  const [code, setCode] = useState(snippet.code)
  const [pattern, setPattern] = useState(snippet.pattern || WRITING_TEMPLATE)
  const [tagsText, setTagsText] = useState(snippet.tags.join(', '))

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const patternRef = useRef<HTMLTextAreaElement>(null)

  // Reset local editing state whenever the user switches to a different snippet.
  useEffect(() => {
    setTitle(snippet.title)
    setLanguage(snippet.language)
    setCode(snippet.code)
    setPattern(snippet.pattern || WRITING_TEMPLATE)
    setTagsText(snippet.tags.join(', '))
  }, [snippet.id])

  function scheduleSave(patch: Partial<SnippetDraft>) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      onUpdate(snippet.id, patch)
      onSaved(Date.now())
    }, 400)
  }

  function applyWritingTemplate() {
    setPattern(WRITING_TEMPLATE)
    scheduleSave({ pattern: WRITING_TEMPLATE })
    onSaved(Date.now())
  }

  return (
    <div className="editor-pane">
      <div className="editor-toolbar">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            scheduleSave({ title: e.target.value })
          }}
          placeholder="Título do estudo..."
        />
        <select
          className="lang-select"
          value={language}
          onChange={(e) => {
            const next = e.target.value as Language
            setLanguage(next)
            scheduleSave({ language: next })
          }}
        >
          {LANGUAGE_ORDER.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_META[lang].label}
            </option>
          ))}
        </select>
        <button
          className="icon-btn icon-btn--danger"
          onClick={() => {
            if (confirm(`Apagar "${snippet.title}"?`)) onDelete(snippet.id)
          }}
        >
          <Trash2 size={14} /> Apagar
        </button>
      </div>

      <div className="editor-split">
        <div className="editor-split__code">
          <CodeEditor
            language={language}
            value={code}
            onChange={(next) => {
              setCode(next)
              scheduleSave({ code: next })
            }}
          />
        </div>

        <div className="editor-split__notes">
          <div className="notes-heading">
            <label>Padrão de pensamento / anotações</label>
            <button className="template-btn" type="button" onClick={applyWritingTemplate}>
              <WandSparkles size={13} />
              Usar modelo
            </button>
          </div>
          <textarea
            ref={patternRef}
            value={pattern}
            onFocus={(event) => {
              if (!snippet.pattern) {
                requestAnimationFrame(() => {
                  event.currentTarget.select()
                })
              }
            }}
            onChange={(e) => {
              setPattern(e.target.value)
              scheduleSave({ pattern: e.target.value })
            }}
            placeholder="Descreva o padrão, o raciocínio e quando usá-lo..."
          />

          <div className="tags-field">
            <label>Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => {
                setTagsText(e.target.value)
                const tags = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                scheduleSave({ tags })
              }}
              placeholder="padrão, react, estado..."
            />
            <div className="tags-row">
              {tagsText
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <span className="tag-pill" key={t}>
                    #{t}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
