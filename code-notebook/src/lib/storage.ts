import type { Snippet, SnippetDraft } from '../types'

/**
 * Contract every storage backend must follow.
 *
 * Today `LocalStorageRepository` implements this against the browser's
 * localStorage. Later, an `ApiRepository` can implement the exact same
 * interface by calling a backend (Node/Express, Supabase, Firebase, etc.)
 * and the rest of the app won't need to change at all — only the single
 * line in `src/lib/repository.ts` that decides which implementation to use.
 */
export interface SnippetRepository {
  list(): Promise<Snippet[]>
  get(id: string): Promise<Snippet | null>
  create(draft: SnippetDraft): Promise<Snippet>
  update(id: string, patch: Partial<SnippetDraft>): Promise<Snippet>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'code-notebook:snippets'

function readAll(): Snippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Snippet[]
  } catch {
    return []
  }
}

function writeAll(snippets: Snippet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Simulated network latency so the UI code already behaves like it's async/remote. */
const delay = (ms = 60) => new Promise((res) => setTimeout(res, ms))

export class LocalStorageRepository implements SnippetRepository {
  async list(): Promise<Snippet[]> {
    await delay()
    return readAll().sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async get(id: string): Promise<Snippet | null> {
    await delay()
    return readAll().find((s) => s.id === id) ?? null
  }

  async create(draft: SnippetDraft): Promise<Snippet> {
    await delay()
    const now = Date.now()
    const snippet: Snippet = { ...draft, id: makeId(), createdAt: now, updatedAt: now }
    const all = readAll()
    all.push(snippet)
    writeAll(all)
    return snippet
  }

  async update(id: string, patch: Partial<SnippetDraft>): Promise<Snippet> {
    await delay()
    const all = readAll()
    const idx = all.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error(`Snippet ${id} not found`)
    const updated: Snippet = { ...all[idx], ...patch, updatedAt: Date.now() }
    all[idx] = updated
    writeAll(all)
    return updated
  }

  async remove(id: string): Promise<void> {
    await delay()
    writeAll(readAll().filter((s) => s.id !== id))
  }
}
