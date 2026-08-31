import { createFileRoute, Link } from "@tanstack/react-router";

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
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Link
        to="/boas-vindas"
        className="flex flex-col items-center animate-[rise_0.8s_ease-out_both]"
        aria-label="Entrar no desafio"
      >
        <img
          src={logo.url}
          alt="E-VALORA — Desafio 1 → 500"
          className="w-72 max-w-full md:w-96"
          width={960}
          height={1280}
        />
        <span className="mt-10 animate-pulse text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Toca para continuar
        </span>
      </Link>
    </main>
  );
}
