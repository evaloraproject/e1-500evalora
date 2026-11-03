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

## Evidência e limitações anteriores

- `npm run build`: passou (Vite, cliente e servidor).
- `tsc --noEmit`: passou.
- `npm run lint`: falha com 357 erros e 6 avisos; execução num worktree limpo de `main` apresenta os mesmos 357 erros e 6 avisos. Sem aumento de contagem; dívida de lint preexistente, não corrigida em massa neste PR.
- Dependências instaladas com `npm install --ignore-scripts --no-package-lock`; o lock Bun não foi alterado. Repetir CI com o lock Bun antes de aprovar.
- `git diff --check`: passou.
- `node --check tests/entry-flow.cjs`: passou (sintaxe do teste, não comportamento da app).
- Teste E2E anterior: bloqueado antes de abrir a app, `Executable doesn't exist ... chromium_headless_shell-1234`.
- Instalação dos navegadores Playwright anterior: download inválido, `End of central directory record signature not found`.
- Não existem capturas antes/depois da app nem resultado PASSA em Safari/iPhone físico. A observação pública anterior é apenas a página de projeto não encontrado.
- Os assets do repositório apontam para `/__l5e/assets-v1/...` no alojamento Lovable. Disponibilidade e correspondência visual dos originais ainda precisam de validação; não foram substituídos por imagens inventadas.

## Incremento de validação automatizada — 03/11/2026

Foi reforçado o teste E2E existente e acrescentado o workflow `.github/workflows/entry-flow-e2e.yml` na branch deste PR.

O teste `tests/entry-flow.cjs` verifica agora, em Chromium e WebKit com perfil iPhone 13 emulado:

1. Capa inicial e descodificação real da imagem original.
2. Virar a página, chegada à segunda página e descodificação da imagem da mascote.
3. Acesso às recomendações e presença das três categorias.
4. Logótipo local de FPC Automatismos carregado.
5. Link de afiliado Bybit exato, aberto em novo separador com `noopener noreferrer`.
6. Progresso sintético preexistente preservado após navegação e recarregamento.
7. Acesso direto a `/app` continua disponível.

O workflow:
- instala a aplicação com `bun install --frozen-lockfile`;
- executa `bun run build`;
- instala Playwright `1.56.1` fora das dependências/lockfile da aplicação;
- instala apenas Chromium e WebKit nos runners GitHub Actions;
- inicia servidor Vite local, sem apontar à produção;
- executa o teste e carrega capturas/log como artefactos de CI com retenção de 7 dias;
- usa `permissions: contents: read`, sem segredos, publicação, deploy ou escrita em dados da app.

**A validação remota desta alteração só pode ser declarada depois de observar o resultado do GitHub Actions no commit do workflow.** Se as imagens Lovable `/__l5e/assets-v1/...` não estiverem disponíveis no servidor local, o teste falhará explicitamente e identificará o URL em falta; isso é um bloqueio de assets a resolver, não motivo para substituir as imagens por placeholders.

## Reprodução manual

Instalar dependências da app (preferencialmente `bun install --frozen-lockfile`), Playwright e os navegadores Chromium/WebKit. Iniciar a app com `bun run dev -- --host 127.0.0.1 --port 5173`. Noutra consola:

```sh
NODE_PATH=<playwright-install>/node_modules TEST_BASE_URL=http://127.0.0.1:5173 node tests/entry-flow.cjs
```

O teste usa apenas um contexto isolado local, com progresso sintético; não limpa dados de utilizadores. `TEST_BASE_URL` permite mudar o endereço do servidor de testes. As capturas são guardadas em `test-results/` (ignoradas por git).

**Limite:** WebKit em CI é uma aproximação automatizada do motor Safari, não um iPhone físico. Antes de aprovação final continuam necessários: inspeção visual humana das capturas, teste Safari num iPhone real (incluindo voltar/avançar e PWA existente) e confirmação do endereço/commit efetivamente publicado. Não fazer merge, deploy ou fechar a Issue 10 com base apenas em inspeção estática ou emulação.
