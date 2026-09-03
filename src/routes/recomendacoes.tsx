import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Gift, Mail, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Recomendações — DESAFIO 1 → 500" },
      {
        name: "description",
        content:
          "Descobre as apps e serviços recomendados para te ajudar a completar o desafio 1 → 500 sem gastar dinheiro do teu bolso.",
      },
      { property: "og:title", content: "Recomendações — DESAFIO 1 → 500" },
      {
        property: "og:description",
        content:
          "Apps e serviços recomendados para ganhar bónus e completar o desafio de poupança 1 → 500.",
      },
    ],
  }),
  component: Recomendacoes,
});

function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

const OFFERS = [
  {
    name: "Montepio",
    domain: "montepio.pt",
    description:
      "🏠 O teu crédito habitação pode estar a custar-te mais do que devia. Já comparaste as condições do teu banco com o Montepio? Informa-te. Compara. Poupa.",
    url: "mailto:evalora.project@gmail.com",
    tag: "Habitação",
  },
  {
    name: "Bybit",
    domain: "bybit.eu",
    description: "Trade crypto. Até $100 de bónus ao registares-te e fazeres trade.",
    url: "https://partner.bybit.eu/b/aff_59342_162579",
    tag: "Crypto",
  },
  {
    name: "Crypto.com",
    domain: "crypto.com",
    description: "Cartão, app de crypto e recompensas diárias.",
    url: "https://crypto.com/app/537dque64w",
    tag: "Crypto",
  },
  {
    name: "MEXC",
    domain: "mexc.com",
    description: "Exchange de crypto com bónus de referido.",
    url: "https://s.mexc.com/referral/Z55YgTiyy3",
    tag: "Crypto",
  },
  {
    name: "Krak",
    domain: "krak.app",
    description: "Pagamentos instantâneos. Usa a Kraktag @boss004 e ganhamos €10.",
    url: "https://krak.app/@boss004",
    tag: "Pagamentos",
  },
  {
    name: "Coinbase",
    domain: "coinbase.com",
    description: "Compra e vende crypto de forma simples e segura.",
    url: "https://coinbase.com/join/QAFD2LJ?src=ios-link",
    tag: "Crypto",
  },
  {
    name: "Interlink Labs",
    domain: "interlinklabs.ai",
    description: "Plataforma com código de referido 21798901.",
    url: "https://interlinklabs.ai/21798901",
    tag: "Outros",
  },
  {
    name: "Revolut",
    domain: "revolut.com",
    description: "Junta-te a mais de 75 milhões de utilizadores. Bónus ao registares-te.",
    url: "https://revolut.com/referral/?referral-code=andr90qci!AUG1-26-AR&geo-redirect",
    tag: "Banco",
  },
  {
    name: "Manie",
    domain: "manie.pt",
    description: "AutoSwitch para contratos de energia e telecom. Ativa com este link e ganha 3 meses de Boost grátis.",
    url: "https://manie.pt/referral/SDH5GQ5J",
    tag: "Poupança",
  },
  {
    name: "375go",
    domain: "375.ai",
    description: "Ganha recompensas por reportar a qualidade da rede. Código 4QJu47CA2fnXkNYWRGaeQd.",
    url: "https://app.375.ai/auth?invitation_code=4QJu47CA2fnXkNYWRGaeQd",
    tag: "Outros",
  },
  {
    name: "Robinhood",
    domain: "robinhood.com",
    description: "Recebe 10 € em crypto ao criares conta e depositares 10 €.",
    url: "https://join.robinhood.com/eu_crypto/andrea-ab661f0/",
    tag: "Crypto",
  },
  {
    name: "XTB",
    domain: "xtb.com",
    description: "Plataforma de trading com ações, ETFs e crypto. Abre conta com este link de referido.",
    url: "https://app.xtb.com/Q4np/raf?af_no_preview=1&pid=raf&deep_link_value=https%3A%2F%2Fxstation5.xtb.com%2F%23%2Fdeeplink%2FrafReceive%3Fc%3Draf%26code%3DUoCUJA6RXTJhpjMdIgMp8RyQP2s8ufF1",
    tag: "Trading",
  },
  {
    name: "Trade Republic",
    domain: "traderepublic.com",
    description: "A forma mais inteligente de investir, gastar e fazer transferências. Cria conta pelo link e garante o teu bónus de boas-vindas.",
    url: "https://refnocode.trade.re/r13nv0mf",
    tag: "Invest",
  },
  {
    name: "CloudMineCrypto",
    domain: "cloudminecrypto.com",
    description:
      "Mineração de Bitcoin: coleta recompensas em BTC. Usa o código 4m9eLk41X3JRX1MN — os dois recebemos bónus de indicação.",
    url: "https://cloudminecrypto.com/?invite_code=4m9eLk41X3JRX1MN",
    tag: "Crypto",
  },
  {
    name: "MetaMask Rewards",
    domain: "metamask.io",
    description: "Carteira crypto com programa de recompensas. Código de referido 4RY7N1.",
    url: "https://link.metamask.io/rewards?referral=4RY7N1",
    tag: "Crypto",
  },
  {
    name: "Coinbase One",
    domain: "coinbase.com",
    description: "Subscreve o Coinbase One e ganha vantagens extra em crypto.",
    url: "https://coin.onelink.me/ePJg/h3mf96d7",
    tag: "Crypto",
  },
  {
    name: "DigiByte Generator Bot",
    domain: "digibyte.org",
    description: "Bot no Telegram para começares com DigiByte.",
    url: "https://t.me/digibytegeneratorbot?start=8236",
    tag: "Crypto",
  },
];

function Recomendacoes() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 py-8 md:max-w-3xl md:px-8 lg:max-w-5xl lg:px-10 safe-bottom">
      <Link
        to="/app"
        className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="mr-2 size-4" />
        Voltar ao desafio
      </Link>

      <header className="mt-6 text-center">
        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Recomendações
        </h1>
        <p className="mt-3 text-2xl font-bold text-foreground">
          Completa o desafio <span className="text-gradient-gold">sem gastar</span> o teu dinheiro
        </p>
      </header>

      <section className="mt-6 rounded-3xl border border-primary/30 bg-primary/10 p-5 text-sm leading-relaxed text-foreground">
        <p className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            A app é gratuita. Aqui encontras as plataformas que uso e recomendo. Ao usares estes
            links de convite, podes receber bónus e eu também recebo uma pequena comissão — o que
            ajuda a manter o desafio sem custos para ti.
          </span>
        </p>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {OFFERS.map((offer) =>
          offer.whatsapp ? (
            <div
              key={offer.url}
              className="rounded-3xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <div className="flex items-center gap-2">
                <img
                  src={logoUrl(offer.domain)}
                  alt={`Logotipo ${offer.name}`}
                  className="size-6 rounded-md bg-white/90 p-0.5"
                  width={24}
                  height={24}
                  loading="lazy"
                />
                <span className="text-sm font-semibold text-foreground">{offer.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {offer.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{offer.description}</p>
              <div className="mt-3 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                  <a href={offer.url} target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-1.5 size-3.5" />
                    Email
                  </a>
                </Button>
                <Button asChild size="sm" className="flex-1 rounded-full">
                  <a href={offer.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-1.5 size-3.5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <a
              key={offer.url}
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-3xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <img
                    src={logoUrl(offer.domain)}
                    alt={`Logotipo ${offer.name}`}
                    className="size-6 rounded-md bg-white/90 p-0.5"
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                  <span className="text-sm font-semibold text-foreground">{offer.name}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {offer.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{offer.description}</p>
              </div>
              <ExternalLink className="ml-3 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          )
        )}
      </section>

      <section className="mt-8 text-center">
        <Button asChild size="lg" className="rounded-full">
          <Link to="/app">
            <Gift className="mr-2 size-4" />
            Voltar ao desafio
          </Link>
        </Button>
      </section>
    </main>
  );
}
