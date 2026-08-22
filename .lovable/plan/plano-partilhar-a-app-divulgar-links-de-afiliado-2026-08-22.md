# Plano: Partilhar a app + divulgar links de afiliado

## Visão geral
Transformar a app numa "loja de recomendações" gratuita: o botão "Partilhar" envia o link da app (convite ao desafio 1 → 500), e dentro da app existe um ecrã "Recomendações" com os links de afiliado (Bybit, Crypto.com, Revolut, etc.) e uma explicação de como usá-los para completar o desafio sem gastar dinheiro do próprio bolso.

O modelo fica gratuito — remove-se o desbloqueio pago de 2 €.

## O que vou alterar

1. **Remover paywall e desbloqueio pago**
   - Apagar ou desativar `src/lib/access.ts` e `src/components/Paywall.tsx`.
   - Garantir que a app abre diretamente sem pedir pagamento.

2. **Nova página de recomendações/afiliados**
   - Criar `src/routes/recomendacoes.tsx`.
   - Mostrar uma lista com os links de afiliado que partilhaste:
     - Bybit
     - Crypto.com
     - Mexc
     - Krak
     - Coinbase
     - Interlink Labs
     - Revolut
     - 375go
     - Robinhood
     - DigiByte Generator Bot
   - Cada item: nome, pequena descrição, botão "Ver oferta" (link externo).
   - Incluir explicação: "Completa o desafio sem gastar o teu dinheiro: ao usares estes links, recebes bónus e eu também recebo uma pequena comissão."

3. **Atualizar o ecrã principal (`src/routes/index.tsx`)**
   - Botão "PARTILHAR APP" continua a enviar o link da app (já existe).
   - Adicionar botão "RECOMENDAÇÕES" que navega para a nova página.
   - Pequena secção no topo explicando o conceito: app gratuita + links de afiliado.

4. **Atualizar a partilha nativa**
   - Incluir mensagem mais orientada: "Experimenta esta app para poupar e aproveita as recomendações para ganhar bónus sem gastar dinheiro."

5. **Navegação e PWA**
   - Garantir que a nova rota está no PWA e funciona offline.
   - Adicionar link no menu/botão de navegação (se necessário, uma simples barra inferior ou link no topo).

6. **SEO/metadados**
   - Adicionar `head()` na nova rota `recomendacoes.tsx` com título e descrição.

## Notas técnicas
- Tudo continua client-side: localStorage para progresso, sem backend necessário para afiliados.
- Links abrem em nova aba (`target="_blank" rel="noopener noreferrer"`).
- Mantém o design existente: fundo escuro, dourado/laranja, tipografia Manrope.
- Não requer autenticação nem pagamento.

## Links de afiliado a incluir (fornecidos pelo utilizador)
- Bybit: https://partner.bybit.eu/b/aff_59342_162579
- Crypto.com: https://crypto.com/app/537dque64w
- Mexc: https://s.mexc.com/referral/Z55YgTiyy3
- Krak: https://krak.app/@boss004
- Coinbase: https://coinbase.com/join/QAFD2LJ?src=ios-link
- Interlink Labs: https://interlinklabs.ai/21798901
- Revolut: https://revolut.com/referral/?referral-code=andr90qci!AUG1-26-AR&geo-redirect
- 375go: https://app.375.ai/auth?invitation_code=4QJu47CA2fnXkNYWRGaeQd
- Robinhood: https://join.robinhood.com/eu_crypto/andrea-ab661f0/
- Telegram DigiByte Bot: https://t.me/digibytegeneratorbot?start=8236

## O que não está incluído
- Nenhuma integração de pagamento real ou simulada.
- Nenhum backend ou base de dados para convites.
- Nenhum registo de utilizadores.
