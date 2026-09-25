# Code Data

Um workspace de código estilo VS Code para guardar seus estudos de programação —
não só o código, mas o **padrão de pensamento** por trás dele. Feito em React + TypeScript + Vite.

## O que tem

- Layout inspirado no VS Code: barra de atividades, sidebar em árvore (agrupada por linguagem),
  abas, editor com realce de sintaxe e barra de status.
- Editor de código real (CodeMirror 6) com destaque de sintaxe para JavaScript, TypeScript,
  TSX, Python e CSS.
- Para cada estudo: título, linguagem, código, um campo de **"padrão de pensamento"** e tags.
- Busca por título, tag ou conteúdo do padrão.
- Autosave (debounced) enquanto você digita.
- Persistência no Supabase/Postgres usando a camada `SnippetRepository`.
- Modelo de escrita guiada para documentar problema, solução, uso, trade-offs e exemplo.
- Interface dark inspirada no Dracula Theme, com estados neon para seleção e interação.
- Overview com cards agrupados por linguagem e acesso direto ao estudo selecionado.
- Design system próprio com superfícies translúcidas, tokens de cor, estados de foco e uma
  paisagem em background com overlay para manter o conteúdo legível.

## Rodando localmente

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar no terminal (geralmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Configurando o Supabase

1. No SQL Editor do projeto Supabase, execute
   [`supabase/migrations/001_create_snippets.sql`](./supabase/migrations/001_create_snippets.sql).
2. Crie ou confira o arquivo `.env`:

   ```bash
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publishable
   ```

O cliente usa somente a chave publishable no navegador. As políticas da migração permitem
as operações do caderno sem autenticação; para dados privados, adicione autenticação e
restrinja as políticas por `user_id`.

## Estrutura

```text
src/
  types.ts               # modelo de dados (Snippet) e metadados de linguagem
  lib/
    storage.ts            # interface SnippetRepository
    supabase.ts           # cliente Supabase
    supabaseRepository.ts # implementação da persistência no Supabase
    repository.ts         # ponto único do repositório usado pela UI
    seed.ts               # exemplos iniciais
  components/
    ActivityBar.tsx
    Sidebar.tsx
    EditorTabs.tsx
    EditorPane.tsx
    CodeEditor.tsx
    StatusBar.tsx
  App.tsx
  main.tsx
```

Nenhum componente da UI conhece o Supabase diretamente — todos chamam `repository` (de
`src/lib/repository.ts`). Leitura, criação, edição e exclusão são persistidas no banco e
continuam disponíveis depois de recarregar a página.

## Modelo de escrita

Cada novo estudo começa com um roteiro editável no campo de anotações:

1. **O que este padrão resolve?** — descreva o problema.
2. **Como funciona?** — explique o raciocínio com suas palavras.
3. **Quando usar?** — registre os sinais para reconhecer o padrão.
4. **Cuidados e trade-offs** — anote limitações e alternativas.
5. **Exemplo prático** — conecte a explicação ao código.

O botão **Usar modelo** restaura esse roteiro em qualquer estudo sem impedir que o texto
seja substituído por uma explicação própria.

## Próximos passos sugeridos

- Autenticação de usuário para separar os cadernos por pessoa.
- Exportar/importar os estudos em JSON ou Markdown.
- Modo de revisão espaçada (repetição espaçada) para revisar padrões antigos.
