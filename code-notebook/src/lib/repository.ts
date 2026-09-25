import { SupabaseRepository } from './supabaseRepository'
import type { SnippetRepository } from './storage'

export const repository: SnippetRepository = new SupabaseRepository()
