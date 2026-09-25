import type { SnippetDraft } from '../types'

export const SEED_SNIPPETS: SnippetDraft[] = [
  {
    title: 'Early return em vez de else aninhado',
    language: 'javascript',
    tags: ['padrão', 'clean-code'],
    pattern:
      'Quando uma função tem várias condições de saída, validar as condições ruins primeiro e sair cedo (return) deixa o "caminho feliz" no final, sem indentação. É mais fácil de ler que if/else aninhados.',
    code: `function getDiscount(user) {
  if (!user) return 0
  if (!user.isActive) return 0
  if (user.purchases < 3) return 0

  // a partir daqui, já sabemos que o usuário é válido
  return user.purchases > 10 ? 0.2 : 0.1
}`,
  },
  {
    title: 'List comprehension em vez de loop + append',
    language: 'python',
    tags: ['padrão', 'idiomático'],
    pattern:
      'Sempre que um loop existe só para transformar ou filtrar uma lista item a item, uma list comprehension expressa a mesma ideia em uma linha e deixa a intenção (transformar / filtrar) explícita.',
    code: `# em vez de:
# result = []
# for n in numbers:
#     if n % 2 == 0:
#         result.append(n * n)

result = [n * n for n in numbers if n % 2 == 0]`,
  },
  {
    title: 'Levantar estado (lifting state up)',
    language: 'tsx',
    tags: ['padrão', 'react', 'estado'],
    pattern:
      'Quando dois componentes precisam compartilhar ou reagir ao mesmo dado, o estado sobe para o ancestral comum mais próximo, que passa o valor e uma função de atualização para baixo via props. Isso evita duas fontes de verdade divergentes.',
    code: `function Parent() {
  const [query, setQuery] = useState('')

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <ResultsList query={query} />
    </>
  )
}`,
  },
  {
    title: 'Type genérico para função reutilizável',
    language: 'typescript',
    tags: ['padrão', 'tipos'],
    pattern:
      'Quando uma função faz a mesma coisa para qualquer tipo de dado (ex: pegar o primeiro item), um generic <T> evita duplicar a função para cada tipo e mantém a segurança de tipos no retorno.',
    code: `function first<T>(items: T[]): T | undefined {
  return items[0]
}

const n = first([1, 2, 3])       // number | undefined
const s = first(['a', 'b'])      // string | undefined`,
  },
  {
    title: 'Variáveis de tema com custom properties',
    language: 'css',
    tags: ['padrão', 'design-system'],
    pattern:
      'Em vez de repetir os mesmos valores de cor/espaçamento em cada seletor, declarar tudo como custom properties em :root cria um único lugar de verdade — trocar o tema vira trocar os valores, não caçar cada ocorrência.',
    code: `:root {
  --color-bg: #1e1e1e;
  --color-accent: #4a9eff;
  --space-md: 16px;
}

.card {
  background: var(--color-bg);
  padding: var(--space-md);
  border: 1px solid var(--color-accent);
}`,
  },
  {
    title: 'HTML semântico em vez de div genérica',
    language: 'html',
    tags: ['padrão', 'semântica', 'acessibilidade'],
    pattern:
      'Usar a tag que descreve o papel do conteúdo (nav, main, article, aside) em vez de <div> para tudo ajuda leitores de tela, SEO e também quem lê o código depois — a estrutura já conta a história da página.',
    code: `<body>
  <nav>...</nav>
  <main>
    <article>
      <h1>Título do post</h1>
      <p>Conteúdo...</p>
    </article>
    <aside>Links relacionados</aside>
  </main>
</body>`,
  },
]
