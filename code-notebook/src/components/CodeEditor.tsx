import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { css } from '@codemirror/lang-css'
import type { Extension } from '@codemirror/state'
import type { Language } from '../types'

function extensionsFor(language: Language): Extension[] {
  switch (language) {
    case 'javascript':
      return [javascript({ jsx: false, typescript: false })]
    case 'typescript':
      return [javascript({ jsx: false, typescript: true })]
    case 'tsx':
      return [javascript({ jsx: true, typescript: true })]
    case 'python':
      return [python()]
    case 'css':
      return [css()]
    default:
      return []
  }
}

interface CodeEditorProps {
  language: Language
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={vscodeDark}
      extensions={extensionsFor(language)}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: true,
        tabSize: 2,
      }}
    />
  )
}
