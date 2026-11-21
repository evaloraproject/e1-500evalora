import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/boas-vindas")({
  head: () => ({
    meta: [
      { title: "Bem-vindo à E-VALORA" },
      {
        name: "description",
        content:
          "Bem-vindo à E-VALORA: poupa sem stress, marca valores de 1 a 500 e chega aos 125.250 €.",
      },
      { property: "og:title", content: "Bem-vindo à E-VALORA" },
      {
        property: "og:description",
        content: "O teu assistente de poupança para o Desafio 1 → 500.",
      },
    ],
  }),
  component: BoasVindas,
});

function BoasVindas() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-sm flex-col items-center text-center animate-[rise_0.8s_ease-out_both] md:max-w-md">
        <video
          controls
          playsInline
          preload="metadata"
          src="/media/evalora-apresentacao.mp4"
          aria-label="Apresentação da app E-VALORA"
          className="aspect-[9/16] w-full max-w-72 rounded-2xl bg-black"
        />
        <Button asChild size="lg" className="mt-8 w-full max-w-xs rounded-full">
          <Link to="/app">
            COMEÇAR O DESAFIO
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
