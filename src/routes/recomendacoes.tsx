import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Gift,
  Handshake,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "@/components/SocialLinks";
import fpcLogo from "@/assets/fpc-automatismos-logo.jpg.asset.json";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Recomendações — DESAFIO 1 → 500" },
      {
        name: "description",
        content:
          "Descobre as apps, parcerias e produtos recomendados para te ajudar a completar o desafio 1 → 500 sem gastar dinheiro do teu bolso.",
      },
      { property: "og:title", content: "Recomendações — DESAFIO 1 → 500" },
      {
        property: "og:description",
        content:
          "Apps, parcerias e produtos recomendados para ganhar bónus e completar o desafio de poupança 1 → 500.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Recomendacoes,
});

function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

type Category = "vendas" | "parcerias" | "ganha-mais";

type Offer = {
  name: string;
  domain: string;
  description: string;
  url: string;
  whatsapp?: string;
  phone?: string;
  logo?: string;
  tag: string;
  category: Category;
};

const OFFERS: Offer[] = [
  // Vendas
  {
    name: "Cripto Sem Atalhos",
    domain: "hotmart.com",
    description:
      "Curso completo para aprenderes o mundo crypto sem atalhos. Investe no teu conhecimento e aproveita este preço especial.",
    url: "https://go.hotmart.com/A106493197I?dp=1&redirectionUrl=https%3A%2F%2Fhotmart.com%2Fpt-br%2Fmarketplace%2Fprodutos%2Fcripto-sem-atalhos%2FE103810532V",
    tag: "Curso",
    category: "vendas",
  },

  // Parcerias
  {
    name: "Montepio",
    domain: "montepio.pt",
    description:
      "🏠 O teu crédito habitação pode estar a custar-te mais do que devia. Já comparaste as condições do teu banco com o Montepio? Informa-te. Compara. Poupa.",
    url: "mailto:evalora.project@gmail.com",
    tag: "Habitação",
    category: "parcerias",
  },
  {
    name: "FPC Automatismos",
    domain: "fpcautomatismos.pt",
    description:
      "Automatismos, conforto e segurança para a tua casa ou empresa. Soluções inteligentes em portões, estores e sistemas de automação.",
    url: "mailto:geral.fpcautomatismos@gmail.com",
    phone: "tel:910978662",
    logo: fpcLogo.url,
    tag: "Parceria",
    category: "parcerias",
  },

  // Ganha Mais
  {
    name: "deshawai.com",
    domain: "deshawai.com",
    description: "Acede à plataforma através deste link de convite.",
    url: "https://deshawai.com/reg?tid=N2DXLR",
    tag: "Convite",
    category: "ganha-mais",
  },
  {
    name: "timihqs.com",
    domain: "timihqs.com",
    description: "Acede à plataforma através deste link de convite.",
    url: "https://timihqs.com/#/pages/login/registerView?code=dx4evu",
    tag: "Convite",
    category: "ganha-mais",
  },
  {
    name: "WeTradeX",
    domain: "wetradex.group",
    description: "Acede à plataforma através deste link de convite.",
    url: "https://wetradex.group/invite/boss004",
    tag: "Convite",
    category: "ganha-mais",
  },
  {
    name: "Scramble",
    domain: "scrambleup.com",
    description: "Acede à plataforma através deste link de convite.",
    url: "https://scrambleup.com/?ref=3d24a39b",
    tag: "Convite",
    category: "ganha-mais",
  },
  {
    name: "TradingView",
    domain: "tradingview.com",
    description: "Gráficos, alertas e ferramentas de análise de mercados. Consulta os planos através deste link.",
    url: "https://br.tradingview.com/pricing/?share_your_love=pacifiedUser16507",
    tag: "Trading",
    category: "ganha-mais",
  },
  {
    name: "Bybit",
    domain: "bybit.eu",
    description: "Trade crypto. Até $100 de bónus ao registares-te e fazeres trade.",
    url: "https://partner.bybit.eu/b/aff_59342_162579",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "Crypto.com",
    domain: "crypto.com",
    description: "Cartão, app de crypto e recompensas diárias.",
    url: "https://crypto.com/app/537dque64w",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "MEXC",
    domain: "mexc.com",
    description: "Exchange de crypto com bónus de referido.",
    url: "https://s.mexc.com/referral/Z55YgTiyy3",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "Krak",
    domain: "krak.app",
    description: "Pagamentos instantâneos. Usa a Kraktag @boss004 e ganhamos €10.",
    url: "https://krak.app/@boss004",
    tag: "Pagamentos",
    category: "ganha-mais",
  },
  {
    name: "Coinbase",
    domain: "coinbase.com",
    description: "Compra e vende crypto de forma simples e segura.",
    url: "https://coinbase.com/join/QAFD2LJ?src=ios-link",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "Interlink Labs",
    domain: "interlinklabs.ai",
    description: "Plataforma com código de referido 21798901.",
    url: "https://interlinklabs.ai/21798901",
    tag: "Outros",
    category: "ganha-mais",
  },
  {
    name: "Revolut",
    domain: "revolut.com",
    description: "Junta-te a mais de 75 milhões de utilizadores. Bónus ao registares-te.",
    url: "https://revolut.com/referral/?referral-code=andr90qci!AUG1-26-AR&geo-redirect",
    tag: "Banco",
    category: "ganha-mais",
  },
  {
    name: "Manie",
    domain: "manie.pt",
    description: "AutoSwitch para contratos de energia e telecom. Ativa com este link e ganha 3 meses de Boost grátis.",
    url: "https://manie.pt/referral/SDH5GQ5J",
    tag: "Poupança",
    category: "ganha-mais",
  },
  {
    name: "375go",
    domain: "375.ai",
    description: "Ganha recompensas por reportar a qualidade da rede. Código 4QJu47CA2fnXkNYWRGaeQd.",
    url: "https://app.375.ai/auth?invitation_code=4QJu47CA2fnXkNYWRGaeQd",
    tag: "Outros",
    category: "ganha-mais",
  },
  {
    name: "Robinhood",
    domain: "robinhood.com",
    description: "Recebe 10 € em crypto ao criares conta e depositares 10 €.",
    url: "https://join.robinhood.com/eu_crypto/andrea-ab661f0/",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "XTB",
    domain: "xtb.com",
    description: "Plataforma de trading com ações, ETFs e crypto. Abre conta com este link de referido.",
    url: "https://app.xtb.com/Q4np/raf?af_no_preview=1&pid=raf&deep_link_value=https%3A%2F%2Fxstation5.xtb.com%2F%23%2Fdeeplink%2FrafReceive%3Fc%3Draf%26code%3DUoCUJA6RXTJhpjMdIgMp8RyQP2s8ufF1",
    tag: "Trading",
    category: "ganha-mais",
  },
  {
    name: "Trade Republic",
    domain: "traderepublic.com",
    description: "A forma mais inteligente de investir, gastar e fazer transferências. Cria conta pelo link e garante o teu bónus de boas-vindas.",
    url: "https://refnocode.trade.re/r13nv0mf",
    tag: "Invest",
    category: "ganha-mais",
  },
  {
    name: "Coinvest",
    domain: "coinvest.liquid.trade",
    description: "Plataforma de trading e investimento. Abre conta com este link de referido.",
    url: "https://coinvest.liquid.trade",
    tag: "Trading",
    category: "ganha-mais",
  },
  {
    name: "CloudMineCrypto",
    domain: "cloudminecrypto.com",
    description:
      "Mineração de Bitcoin: coleta recompensas em BTC. Usa o código 4m9eLk41X3JRX1MN — os dois recebemos bónus de indicação.",
    url: "https://cloudminecrypto.com/?invite_code=4m9eLk41X3JRX1MN",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "MetaMask Rewards",
    domain: "metamask.io",
    description: "Carteira crypto com programa de recompensas. Código de referido 4RY7N1.",
    url: "https://link.metamask.io/rewards?referral=4RY7N1",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "Coinbase One",
    domain: "coinbase.com",
    description: "Subscreve o Coinbase One e ganha vantagens extra em crypto.",
    url: "https://coin.onelink.me/ePJg/h3mf96d7",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "DigiByte Generator Bot",
    domain: "digibyte.org",
    description: "Bot no Telegram para começares com DigiByte.",
    url: "https://t.me/digibytegeneratorbot?start=8236",
    tag: "Crypto",
    category: "ganha-mais",
  },
  {
    name: "DeNet Storage & Watcher Node",
    domain: "denet.app",
    description:
      "Protocolo de armazenamento descentralizado. Instala a app móvel DeNet Storage & Watcher Node, protege a rede com o teu telemóvel e ganha recompensas. Código de referido 0xa3d46a89790a3bd609f808170c16c17798477c02.",
    url: "https://links.denet.app/mobile?referrer=0xa3d46a89790a3bd609f808170c16c17798477c02",
    tag: "Outros",
    category: "ganha-mais",
  },
];

const TABS: { id: Category; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "ganha-mais",
    label: "Ganha Mais",
    icon: TrendingUp,
    description: "Links de convite onde podes receber bónus sem gastar.",
  },
  {
    id: "parcerias",
    label: "Parcerias",
    icon: Handshake,
    description: "Parceiros diretos para poupar ou resolver o que precisas.",
  },
  {
    id: "vendas",
    label: "Vendas",
    icon: ShoppingBag,
    description: "Produtos e cursos que recomendo.",
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  const logoSrc = offer.logo || logoUrl(offer.domain);
  const header = (
    <div className="flex items-center gap-3">
      <img
        src={logoSrc}
        alt={`Logotipo ${offer.name}`}
        className="size-8 rounded-lg bg-white/90 p-0.5"
        width={32}
        height={32}
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-semibold text-foreground">{offer.name}</span>
        <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {offer.tag}
        </span>
      </div>
    </div>
  );

  if (offer.whatsapp || offer.phone) {
    return (
      <div className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80">
        {header}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{offer.description}</p>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
            <a href={offer.url} target="_blank" rel="noopener noreferrer">
              <Mail className="mr-1.5 size-3.5" />
              Email
            </a>
          </Button>
          {offer.whatsapp ? (
            <Button asChild size="sm" className="flex-1 rounded-full">
              <a href={offer.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 size-3.5" />
                WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild size="sm" className="flex-1 rounded-full">
              <a href={offer.phone}>
                <Phone className="mr-1.5 size-3.5" />
                Ligar
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (offer.url.startsWith("mailto:")) {
    return (
      <div className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80">
        {header}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{offer.description}</p>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm" className="w-full rounded-full">
            <a href={offer.url} target="_blank" rel="noopener noreferrer">
              <Mail className="mr-1.5 size-3.5" />
              Email
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
    >
      <div className="min-w-0 flex-1">
        {header}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{offer.description}</p>
      </div>
      <ExternalLink className="ml-3 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </a>
  );
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function Recomendacoes() {
  const [activeTab, setActiveTab] = useState<Category>("ganha-mais");
  const [search, setSearch] = useState("");
  const searchTerm = normalizeSearch(search.trim());
  const activeOffers = OFFERS.filter(
    ({ category, name, description, tag }) =>
      category === activeTab && normalizeSearch(`${name} ${description} ${tag}`).includes(searchTerm),
  );
  const activeTabInfo = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6 md:max-w-3xl md:px-8 lg:max-w-5xl lg:px-10 safe-bottom">
      <Link
        to="/app"
        className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="mr-2 size-4" />
        Voltar ao desafio
      </Link>

      <header className="mt-5 text-center">
        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Recomendações
        </h1>
        <p className="mt-2 text-xl font-bold text-foreground md:text-2xl">
          Completa o desafio <span className="text-gradient-gold">sem gastar</span> o teu dinheiro
        </p>
      </header>

      <section className="mt-5 rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm leading-relaxed text-foreground">
        <p className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            A app é gratuita. Aqui encontras produtos, parceiros e plataformas que uso e recomendo.
            Ao usares estes links, podes receber bónus e eu também recebo uma pequena comissão — o
            que ajuda a manter o desafio sem custos para ti.
          </span>
        </p>
      </section>

      <section aria-label="Música recomendada" className="mt-6 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Música / Vídeo
            </p>
            <h2 className="mt-2 text-base font-bold text-foreground">Uma música para acompanhar o desafio</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Descobre este vídeo recomendado pela E-VALORA no YouTube. A reprodução só começa quando escolheres ouvir.
            </p>
          </div>
          <ExternalLink aria-hidden="true" className="size-5 shrink-0 text-primary" />
        </div>
        <Button asChild size="sm" className="mt-4 rounded-full">
          <a
            href="https://www.youtube.com/watch?v=uM8oI4hqw8o"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ouvir música recomendada no YouTube (abre numa nova janela)"
          >
            Ouvir no YouTube
            <ExternalLink className="ml-2 size-3.5" aria-hidden="true" />
          </a>
        </Button>
      </section>

      <div className="relative mt-6">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Pesquisar recomendações na categoria selecionada"
          placeholder="Pesquisar nesta categoria…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-12 rounded-2xl pl-11"
        />
      </div>

      <section aria-label="Categorias de recomendações" className="mt-6 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </section>

      <section className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {activeTabInfo?.description ?? "Explora as oportunidades disponíveis."}
        </p>
      </section>

      <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
        {activeOffers.length} recomendações nesta seleção
      </p>
      {activeOffers.length === 0 && (
        <div className="mt-4 rounded-3xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Não encontrámos recomendações com esse nome nesta categoria.
          </p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => setSearch("")}>
            Limpar pesquisa
          </Button>
        </div>
      )}
      <section className="mt-4 grid gap-3 md:grid-cols-2">
        {activeOffers.map((offer) => (
          <OfferCard key={offer.url} offer={offer} />
        ))}
      </section>

      <section className="mt-8 border-t border-border pt-7 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Segue a E-VALORA
        </p>
        <SocialLinks className="mt-4" />
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
