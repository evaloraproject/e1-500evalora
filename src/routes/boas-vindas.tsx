import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

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
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <Link to="/" className="w-fit text-sm text-muted-foreground underline underline-offset-4">
        Voltar à capa
      </Link>

      <header className="mt-8 flex items-center gap-4">
        <img
          src="/brand/e-valora-logotipo-oficial.jpeg"
          alt=""
          width={64}
          height={64}
          className="size-16 rounded-2xl border border-border object-cover"
        />
        <div>
          <p className="text-sm font-medium text-primary">E-VALORA</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Desafio 1 → 500</h1>
        </div>
      </header>

      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Escolhe um número de 1 a 500 e regista quanto poupaste. O total é atualizado a cada registo.
      </p>

      <Button asChild size="lg" className="mt-6 h-12 w-full rounded-2xl text-base">
        <Link to="/app">
          Começar o desafio
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Link>
      </Button>

      <details className="group mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
            <Play className="size-4" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Ver guia rápido</span>
            <span className="block text-sm text-muted-foreground">18 segundos · sem som</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="border-t border-border px-4 pb-4 pt-4">
          <video
            controls
            playsInline
            preload="none"
            width={540}
            height={960}
            poster="/media/evalora-guia-poster.jpg"
            src="/media/evalora-guia.mp4"
            aria-label="Guia rápido do desafio E-VALORA"
            className="mx-auto aspect-[9/16] w-full max-w-[270px] rounded-2xl bg-black"
          />
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Toca em «Registar» ou escolhe um número na grelha.</li>
            <li>Confirma o montante e toca em «Guardar poupança».</li>
            <li>Consulta o novo total no topo do desafio.</li>
          </ol>
        </div>
      </details>

      <a
        href="/media/evalora-apresentacao.mp4"
        className="mt-5 w-fit text-sm text-muted-foreground underline underline-offset-4"
      >
        Ver a apresentação original
      </a>
    </main>
  );
}
