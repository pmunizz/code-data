import type { Language, Snippet, SnippetDraft } from '../types'
import type { SnippetRepository } from './storage'
import { supabase } from './supabase'

interface SnippetRow {
  id: string
  title: string
  language: Language
  code: string
  pattern: string
  tags: string[]
  created_at: string
  updated_at: string
}

function toSnippet(row: SnippetRow): Snippet {
  return {
    id: row.id,
    title: row.title,
    language: row.language,
    code: row.code,
    pattern: row.pattern,
    tags: row.tags ?? [],
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(`Supabase: ${error.message}`)
}

export class SupabaseRepository implements SnippetRepository {
  async list(): Promise<Snippet[]> {
    const { data, error } = await supabase
      .from('snippets')
      .select('id, title, language, code, pattern, tags, created_at, updated_at')
      .order('updated_at', { ascending: false })

    throwIfError(error)
    return (data as SnippetRow[]).map(toSnippet)
  }

  async get(id: string): Promise<Snippet | null> {
    const { data, error } = await supabase
      .from('snippets')
      .select('id, title, language, code, pattern, tags, created_at, updated_at')
      .eq('id', id)
      .maybeSingle()

    throwIfError(error)
    return data ? toSnippet(data as SnippetRow) : null
  }

  async create(draft: SnippetDraft): Promise<Snippet> {
    const { data, error } = await supabase
      .from('snippets')
      .insert({
        title: draft.title,
        language: draft.language,
        code: draft.code,
        pattern: draft.pattern,
        tags: draft.tags,
      })
      .select('id, title, language, code, pattern, tags, created_at, updated_at')
      .single()

    throwIfError(error)
    return toSnippet(data as SnippetRow)
  }

  async update(id: string, patch: Partial<SnippetDraft>): Promise<Snippet> {
    const update = {
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.language !== undefined && { language: patch.language }),
      ...(patch.code !== undefined && { code: patch.code }),
      ...(patch.pattern !== undefined && { pattern: patch.pattern }),
      ...(patch.tags !== undefined && { tags: patch.tags }),
    }

    const { data, error } = await supabase
      .from('snippets')
      .update(update)
      .eq('id', id)
      .select('id, title, language, code, pattern, tags, created_at, updated_at')
      .single()

    throwIfError(error)
    return toSnippet(data as SnippetRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('snippets').delete().eq('id', id)
    throwIfError(error)
  }
}
