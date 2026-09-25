export type Language =
  | 'javascript'
  | 'typescript'
  | 'tsx'
  | 'python'
  | 'css'

export interface Snippet {
  id: string
  title: string
  language: Language
  code: string
  /** The "pattern of thinking" behind the code: what problem it solves, why it works this way */
  pattern: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type SnippetDraft = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>

export const LANGUAGE_META: Record<Language, { label: string; extension: string; color: string }> = {
  javascript: { label: 'JavaScript', extension: '.js', color: '#f2c94c' },
  typescript: { label: 'TypeScript', extension: '.ts', color: '#4a9eff' },
  tsx: { label: 'React (TSX)', extension: '.tsx', color: '#61dafb' },
  python: { label: 'Python', extension: '.py', color: '#3e9b4f' },
  css: { label: 'CSS', extension: '.css', color: '#a56ee2' },
}

export const LANGUAGE_ORDER: Language[] = [
  'javascript',
  'typescript',
  'tsx',
  'python',
  'css',
]
