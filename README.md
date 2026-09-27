# 1 to 500 Progress

Cria uma aplicação web/mobile pessoal chamada “DESAFIO 1 → 500”.

OBJETIVO:

A aplicação serve para controlar um desafio de poupança/acumulação em que devo completar os valores de 1 até 500.

A lógica é:

- Existem 500 valores: 1, 2, 3, 4, 5 ... até 500.

- Cada valor só pode ser marcado uma vez.

- Quando marco um valor como concluído, esse valor é automaticamente acrescentado ao total acumulado.

- O valor máximo possível é 125.250 €.

- A aplicação deve mostrar sempre:

  1. Total já acumulado

  2. Total que ainda falta

  3. Quantidade de números concluídos

  4. Quantidade de números restantes

  5. Percentagem de progresso

EXEMPLO:

Se eu marcar 1, 2, 3, 10 e 500:

Total acumulado = 516 €

Números concluídos = 5

Números restantes = 495

Falta = 124.734 €

INTERFACE:

Criar uma interface premium, extremamente simples e visualmente apelativa.

Ecrã principal:

- Título: “DESAFIO 1 → 500”

- Grande número no centro: “TOTAL ACUMULADO”

- Valor em euros em destaque.

- Barra circular ou barra de progresso.

- “X / 500 concluídos”

- “Faltam X €”

- Botão “MARCAR VALOR”

ABAIXO:

Mostrar uma grelha com os números de 1 a 500.

Cada número deve ser um pequeno cartão/botão:

- Disponível = preto/cinza

- Concluído = laranja/dourado

- Ao tocar num número, aparece confirmação:

  “Marcar 127 € como concluído?”

- Botões: “Confirmar” e “Cancelar”.

FUNÇÃO IMPORTANTE:

Permitir procurar rapidamente um número.

Adicionar filtros:

- Todos

- Concluídos

- Por concluir

CRIAR TAMBÉM:

Um campo para inserir manualmente o valor que realmente coloquei/poupei.

Exemplo:

Número 250 → valor previsto 250 €

Valor realizado → 250 €

Estado → concluído

DASHBOARD:

Mostrar:

💰 Acumulado

🎯 Objetivo: 125.250 €

📊 Progresso %

✅ Concluídos

⏳ Restantes

CRIAR UM GRÁFICO:

Mostrar visualmente a evolução do total acumulado ao longo do desafio.

PERSISTÊNCIA:

Os dados devem ficar guardados automaticamente no dispositivo.

Se fechar a aplicação e voltar mais tarde, tudo deve continuar exatamente onde estava.

CRIAR:

- botão “Desfazer”

- botão “Repor progresso”

- confirmação antes de apagar tudo

- exportação dos dados

- importação dos dados

DESIGN:

- Fundo preto

- Branco para texto

- Laranja/dourado para valores e progresso

- Design minimalista e premium

- Grandes números

- Pouco texto

- Animações suaves quando um número é concluído

- Totalmente responsivo para iPhone

- Experiência semelhante a uma app nativa

IMPORTANTE:

A aplicação deve funcionar sem necessidade de login.

Deve funcionar offline depois de carregada.

Não quero uma app complicada.

Quero algo rápido, simples e viciante de usar diariamente.

NO FINAL:

Mostrar uma mensagem quando os 500 valores forem concluídos:

“DESAFIO CONCLUÍDO 🎯

1 → 500

125.250 € acumulados.”

Criar a aplicação completa, funcional e pronta para ser instalada/adicionada ao ecrã inicial do iPhone como PWA.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://e1-500evalora.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f36c769-52ec-45f4-87b3-58a836ca07d5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
