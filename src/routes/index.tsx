import { createFileRoute } from "@tanstack/react-router";

import { BookPage } from "@/components/BookPage";

import logo from "@/assets/e-valora-logo.png.asset.json";

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
        src={logo.url}
        alt="E-VALORA — Desafio 1 → 500"
        width={960}
        height={1280}
        next="/boas-vindas"
        className="w-56 max-w-full md:w-64"
      />
    </main>
  );
}
