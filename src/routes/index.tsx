import { createFileRoute } from "@tanstack/react-router";

import { BookPage } from "@/components/BookPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-VALORA — Desafio 1 → 500" },
      {
        name: "description",
        content:
          "E-VALORA: o desafio de poupança de 1 a 500. Acumula até 125.250 € e acompanha o teu progresso.",
      },
      { property: "og:title", content: "E-VALORA — Desafio 1 → 500" },
      {
        property: "og:description",
        content: "Poupa de 1 € a 500 €, um número de cada vez, até aos 125.250 €.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <BookPage
        src="/primeira-pagina.jpeg"
        alt="E-VALORA — Desafio 1 → 500"
        width={1092}
        height={1440}
        next="/boas-vindas"
        className="w-full max-w-sm text-center"
      >
        <h1 className="sr-only">E-VALORA — Desafio 1 → 500</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Um passo de cada vez até aos 125.250 €.
        </p>
      </BookPage>
    </main>
  );
}
