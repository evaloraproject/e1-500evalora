import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import mascote from "@/assets/e-valora-mascote.jpeg.asset.json";

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
        <img
          src={mascote.url}
          alt="Mascote E-VALORA a apontar para o desafio"
          className="w-56 max-w-full rounded-3xl md:w-72"
          width={928}
          height={1152}
        />
        <h1 className="mt-6 text-xl font-bold text-foreground md:text-2xl">Bem-vindo à E-VALORA</h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:max-w-sm">
          Eu acompanho-te nesta viagem: marca os valores de 1 a 500 €, um de cada vez, e vê o teu
          total crescer até aos 125.250 €. Sem pressa, sem stress.
        </p>
        <Button asChild size="lg" className="mt-8 w-full max-w-xs rounded-full">
          <Link to="/app">
            COMEÇAR O DESAFIO
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
