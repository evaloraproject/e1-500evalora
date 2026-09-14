import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

const SOCIAL_URLS: Record<string, string> = {
  facebook: "https://www.facebook.com/evalora.project/",
  instagram: "https://www.instagram.com/evaloraproject/",
  x: "https://x.com/EvaloraProject",
  tiktok: "https://www.tiktok.com/@evaloraproject",
  threads: "https://www.threads.net/@evaloraproject",
  signal: "https://signal.me/#eu/0H-aI9E5R91q8-Z5YGLR1-q6sYdhxdX0SNXMWjdrg005UF2kti1FiIb1PeDZp46s",
};

export const Route = createFileRoute("/social/$network")({
  head: () => ({
    meta: [
      { title: "Rede social | E-VALORA" },
      { name: "description", content: "Abrir a rede social oficial da E-VALORA." },
      { property: "og:title", content: "Rede social | E-VALORA" },
      { property: "og:description", content: "Abrir a rede social oficial da E-VALORA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SocialRedirect,
});

function SocialRedirect() {
  const { network } = Route.useParams();
  const destination = SOCIAL_URLS[network.toLowerCase()];

  useEffect(() => {
    if (destination) window.location.replace(destination);
  }, [destination]);

  if (!destination) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-foreground">Ligação indisponível</h1>
          <Link to="/recomendacoes" className="mt-4 inline-block text-sm font-semibold text-primary">
            Voltar às recomendações
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="text-xl font-bold text-foreground">A abrir {network}…</h1>
        <p className="mt-2 text-sm text-muted-foreground">Aguarda um momento.</p>
      </div>
    </main>
  );
}