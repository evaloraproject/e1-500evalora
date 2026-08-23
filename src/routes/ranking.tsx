import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fetchRanking } from "@/lib/ranking";
import { formatEur } from "@/lib/challenge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking universal — DESAFIO 1 → 500" },
      {
        name: "description",
        content:
          "Vê o ranking de quem está a poupar no desafio 1 → 500: alcunha, total acumulado, números concluídos e progresso.",
      },
      { property: "og:title", content: "Ranking do DESAFIO 1 → 500" },
      {
        property: "og:description",
        content: "Compara o teu progresso com os outros participantes do desafio de poupança.",
      },
    ],
  }),
  component: RankingPage,
});

function RankingPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ranking"],
    queryFn: fetchRanking,
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pt-10 md:max-w-2xl md:px-8 safe-bottom">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" /> Voltar
      </Link>

      <h1 className="mt-6 flex items-center gap-2 text-2xl font-bold text-foreground">
        <Trophy className="size-6 text-primary" /> Ranking universal
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Top 100 por total acumulado. Entra com conta para apareceres aqui.
      </p>

      {!user && (
        <Button asChild className="mt-4 w-full rounded-full">
          <Link to="/auth">Entrar no ranking</Link>
        </Button>
      )}

      <section className="mt-6 space-y-2 pb-10">
        {isLoading && <p className="text-sm text-muted-foreground">A carregar…</p>}
        {error && <p className="text-sm text-destructive">Não foi possível carregar o ranking.</p>}
        {data?.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda ninguém no ranking. Sê o primeiro!</p>
        )}
        {data?.map((row, i) => (
          <div
            key={row.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3",
              row.id === user?.id && "border-primary/60 bg-primary/10",
            )}
          >
            <span className="w-7 text-sm font-bold tabular-nums text-primary">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{row.nickname}</p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {row.done_count}/500 · {Number(row.progress).toFixed(1)}%
              </p>
            </div>
            <span className="text-sm font-bold tabular-nums text-primary">
              {formatEur(Number(row.accumulated))}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
