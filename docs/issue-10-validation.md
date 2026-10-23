# Issue 10 — validação de 23/10/2026

Estado: correção proposta; **não aprovada para publicação**.

## Diagnóstico antes de editar

- `main` inspecionado: `6d95d48fb4ba7b3f75e66380f92972276e02015e`.
- `src/routes/index.tsx` contém `<Navigate to="/app" replace />`: regressão confirmada no código, independentemente de sessão ou progresso.
- `/boas-vindas` e `/recomendacoes` continuam no repositório; faltava acesso no cabeçalho de `/app`.
- Branch existente `agent1/restore-entry-flow-issue-10`, commit `117c05c`, continha apenas o componente BookPage, ainda sem utilização nem CSS. Continuado esse trabalho, sem duplicar branch.
- URL do README aberta no navegador: https://e1-500evalora.lovable.app/ . Resultado observado: título `Project not found`, texto `No Lovable project found at this address.`. Não foi possível determinar o commit publicado nem reproduzir a navegação na versão pública.

## Correção

- Restaura a capa e metadados a partir do histórico anterior a `895da3b`, usando a mesma referência de imagem original.
- Percurso `/` → `/boas-vindas` → `/app`, com canto clicável e botão, animação de virar página e respeito por movimento reduzido.
- Acesso visível a Capa e Recomendações em `/app`, e recomendações na segunda página.
- Acesso direto a `/app` mantido; nenhuma migração, limpeza ou alteração do armazenamento.
- `src/lib/challenge.ts`, referências de imagens, cartões/links de recomendações e manifesto PWA permanecem iguais a main.

## Evidência e limitações

- `npm run build`: passou (Vite, cliente e servidor).
- `tsc --noEmit`: passou.
- `npm run lint`: falha com 357 erros e 6 avisos; execução num worktree limpo de `main` apresenta os mesmos 357 erros e 6 avisos. Sem aumento de contagem; dívida de lint preexistente, não corrigida em massa neste PR.
- Dependências instaladas com `npm install --ignore-scripts --no-package-lock`; o lock Bun não foi alterado. Repetir CI com o lock Bun antes de aprovar.
- `git diff --check`: passou.
- `node --check tests/entry-flow.cjs`: passou (sintaxe do teste, não comportamento da app).
- Teste E2E tentado: bloqueado antes de abrir a app, `Executable doesn't exist ... chromium_headless_shell-1234`.
- Instalação dos navegadores Playwright tentada: download inválido, `End of central directory record signature not found`.
- Não existem capturas antes/depois da app nem resultado PASSA em Safari/iPhone. A observação pública é apenas a página de projeto não encontrado.
- Os assets do repositório apontam para `/__l5e/assets-v1/...` no alojamento Lovable. Disponibilidade e correspondência visual dos originais ainda precisam de validação; não foram substituídos por imagens inventadas.

## Reproduzir testes num ambiente com navegadores

Instalar dependências da app (preferencialmente `bun install --frozen-lockfile`), Playwright e os navegadores Chromium/WebKit. Iniciar a app com `npm run dev -- --host 127.0.0.1 --port 5173`. Noutra consola:

```sh
node tests/entry-flow.cjs
```

Playwright deve estar resolúvel por Node (instalação local ou `NODE_PATH`). O teste usa apenas um contexto isolado local, com progresso sintético; não limpa dados de utilizadores. `TEST_BASE_URL` permite mudar o endereço do servidor de testes. As capturas são guardadas em `test-results/` (ignoradas por git).

O teste cobre sessão nova, canto de virar página, segunda página, recomendações, progresso anterior, recarregamento e acesso direto ao desafio. O perfil iPhone/WebKit é emulação, não um iPhone físico.

Antes de aprovação: repetir build/lint com o lock Bun, executar E2E, confirmar carregamento das imagens e links, anexar capturas, testar Safari num iPhone real (incluindo voltar/avançar e PWA existente) e confirmar o endereço/commit da publicação. Não fazer merge, deploy ou fechar a Issue 10 com base apenas na inspeção estática.
