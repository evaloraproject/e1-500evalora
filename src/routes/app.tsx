import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { ArrowRight, Download, Gift, RotateCcw, Search, Share2, Trash2, Trophy, Upload } from "lucide-react";

import { NumberGrid } from "@/components/NumberGrid";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { GOAL, TOTAL_NUMBERS, formatEur, useChallenge } from "@/lib/challenge";
import { usePlayersCount, useRankingSync } from "@/lib/ranking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "E-VALORA — DESAFIO 1 → 500 — Poupança até 125.250 €" },
      {
        name: "description",
        content:
          "Marca os números de 1 a 500, acompanha o total acumulado, o progresso e quanto falta para os 125.250 €.",
      },
      { property: "og:title", content: "DESAFIO 1 → 500" },
      {
        property: "og:description",
        content: "Desafio de poupança de 1 a 500. Acumula até 125.250 € e acompanha o progresso.",
      },
    ],
  }),
  component: Index,
});

type Filter = "all" | "done" | "todo";

const ALL = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);

function Index() {
  const { state, hydrated, stats, series, complete, uncomplete, undo, reset, importState } =
    useChallenge();
  const { user } = useAuth();
  useRankingSync(user?.id ?? null, stats, hydrated);
  const playersCount = usePlayersCount();
  const isMobile = useIsMobile();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedInput, setSelectedInput] = useState("");
  const [actual, setActual] = useState("");
  const [justDone, setJustDone] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const numbers = useMemo(() => {
    const q = query.trim();
    return ALL.filter((n) => {
      if (filter === "done" && !state.entries[n]) return false;
      if (filter === "todo" && state.entries[n]) return false;
      if (q && !String(n).includes(q)) return false;
      return true;
    });
  }, [filter, query, state.entries]);

  const openNumber = (n: number) => {
    setSelected(n);
    setSelectedInput(String(n));
    setActual(String(state.entries[n]?.actual ?? n));
  };

  const confirm = () => {
    if (selected === null) return;
    const target = Number(selectedInput.trim());
    if (!Number.isInteger(target) || target < 1 || target > TOTAL_NUMBERS) {
      toast.error("Valor inválido", {
        description: `Escolhe um número inteiro entre 1 e ${TOTAL_NUMBERS}.`,
      });
      return;
    }
    if (state.entries[target]) {
      toast.error(`O valor ${target} já está ocupado`, {
        description: "Escolhe outro valor.",
      });
      return;
    }
    const value = Number(actual.replace(",", "."));
    complete(target, Number.isFinite(value) && value >= 0 ? value : target);
    setJustDone(target);
    window.setTimeout(() => setJustDone(null), 600);
    toast.success(`${target} marcado`, { description: `+ ${formatEur(value || target)}` });
    setSelected(null);
  };

  const markNext = () => {
    const next = ALL.find((n) => !state.entries[n]);
    if (next) openNumber(next);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `desafio-1-500-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    try {
      importState(await file.text());
      toast.success("Dados importados");
    } catch {
      toast.error("Não foi possível importar este ficheiro");
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text = `Desafio 1 → 500: poupa até 125.250 € sem stress. Já vou em ${formatEur(stats.accumulated)}! Vê também as recomendações dentro da app.`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "E-VALORA — DESAFIO 1 → 500", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast.success("Link copiado");
    } catch {
      /* partilha cancelada */
    }
  };

  const selectedDone = selected !== null && Boolean(state.entries[selected]);


  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pt-8 md:max-w-3xl md:px-8 lg:max-w-6xl lg:px-10 lg:pt-12 safe-bottom">
      <header className="text-center">
        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Desafio 1 <span className="text-primary">→</span> 500
        </h1>
      </header>

      <section className="mt-3 flex justify-center">
        <Link
          to="/recomendacoes"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Gift className="size-3.5" />
          Ganha bónus sem gastar dinheiro
          <ArrowRight className="size-3.5" />
        </Link>
      </section>

      <div className="mt-4 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="lg:sticky lg:top-8">

      <section className="relative mt-4 flex flex-col items-center">
        <div className="relative flex w-full max-w-[280px] items-center justify-center md:max-w-[300px]">
          <ProgressRing progress={stats.progress} size={isMobile ? 220 : 260} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Total acumulado
            </span>
            <span className="mt-1 text-3xl font-bold tabular-nums text-gradient-gold md:text-4xl">
              {hydrated ? formatEur(stats.accumulated) : "—"}
            </span>
            <span className="mt-1 text-sm tabular-nums text-muted-foreground">
              {stats.progress.toFixed(1)}% de {formatEur(GOAL)}
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm tabular-nums text-foreground">
          <span className="font-semibold text-primary">{stats.doneCount}</span> / {TOTAL_NUMBERS}{" "}
          concluídos
        </p>
        <p className="mt-1 text-sm tabular-nums text-muted-foreground">
          Faltam {formatEur(stats.remaining)}
        </p>

        <Button size="lg" className="mt-5 w-full max-w-[16rem] rounded-full" onClick={markNext}>
          MARCAR VALOR
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mt-2.5 w-full max-w-[16rem] rounded-full"
          onClick={share}
        >
          <Share2 className="mr-2 size-4" />
          PARTILHAR APP
        </Button>

        <Button
          asChild
          variant="secondary"
          size="lg"
          className="mt-2.5 w-full max-w-[16rem] rounded-full"
        >
          <Link to="/recomendacoes">
            <Gift className="mr-2 size-4" />
            RECOMENDAÇÕES
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="mt-2.5 w-full max-w-[16rem] rounded-full"
        >
          <Link to="/ranking">
            <Trophy className="mr-2 size-4" />
            RANKING
          </Link>
        </Button>

        {playersCount !== null && (
          <p className="mt-3 text-xs tabular-nums text-muted-foreground">
            {playersCount === 0
              ? "Sê o primeiro jogador no ranking"
              : playersCount === 1
                ? "1 jogador registado no ranking"
                : `${playersCount} jogadores registados no ranking`}
          </p>
        )}
      </section>


      {stats.finished && (
        <section className="mt-6 animate-[rise_0.5s_ease-out_both] rounded-3xl border border-primary/40 bg-primary/10 p-5 text-center">
          <p className="text-lg font-bold text-primary">DESAFIO CONCLUÍDO 🎯</p>
          <p className="mt-1 text-sm text-foreground">1 → 500</p>
          <p className="mt-1 text-sm text-muted-foreground">125.250 € acumulados.</p>
        </section>
      )}

      </div>

      <div>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-3">
        <Stat label="💰 Acumulado" value={formatEur(stats.accumulated)} accent />
        <Stat label="🎯 Objetivo" value={formatEur(GOAL)} />
        <Stat label="📊 Progresso" value={`${stats.progress.toFixed(1)}%`} accent />
        <Stat label="⏳ Restantes" value={`${stats.remainingCount}`} />
        <Stat label="✅ Concluídos" value={`${stats.doneCount}`} />
        <Stat label="Falta" value={formatEur(stats.remaining)} />
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Evolução
        </p>
        <div className="mt-3 h-40 w-full">
          {series.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="step" hide />
                <YAxis hide domain={[0, "dataMax"]} />
                <ReTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [formatEur(v), "Acumulado"]}
                  labelFormatter={(l) => `Marcação ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#fillGold)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Marca valores para veres a evolução.
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            inputMode="numeric"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar número"
            className="h-12 rounded-2xl pl-10"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["all", "Todos"],
              ["done", "Concluídos"],
              ["todo", "Por concluir"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border py-2 text-xs font-semibold transition-colors",
                filter === key
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <NumberGrid
            numbers={numbers}
            entries={state.entries}
            justDone={justDone}
            onSelect={openNumber}
          />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-2 pb-4 sm:grid-cols-4">
        <Button variant="secondary" className="rounded-2xl" onClick={undo}>
          <RotateCcw className="size-4" /> Desfazer
        </Button>
        <Button variant="secondary" className="rounded-2xl" onClick={exportData}>
          <Download className="size-4" /> Exportar
        </Button>
        <Button variant="secondary" className="rounded-2xl" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" /> Importar
        </Button>
        <Button
          variant="secondary"
          className="rounded-2xl text-destructive"
          onClick={() => setConfirmReset(true)}
        >
          <Trash2 className="size-4" /> Repor
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImport(f);
            e.target.value = "";
          }}
        />
      </section>

      </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDone
                ? `${selected} já está concluído`
                : `Marcar ${selectedInput || selected} € como concluído?`}
            </DialogTitle>
            <DialogDescription>
              Valor previsto: {formatEur(Number(selectedInput) || selected || 0)}
            </DialogDescription>
          </DialogHeader>

          {!selectedDone && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Número (1 – {TOTAL_NUMBERS})
                </label>
                <Input
                  inputMode="numeric"
                  value={selectedInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setSelectedInput(v);
                    setActual(v);
                  }}
                  className="h-12 rounded-2xl text-lg tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Valor realizado
                </label>
                <Input
                  inputMode="decimal"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  className="h-12 rounded-2xl text-lg tabular-nums"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="secondary" className="rounded-full" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            {selectedDone ? (
              <Button
                variant="destructive"
                className="rounded-full"
                onClick={() => {
                  if (selected !== null) uncomplete(selected);
                  setSelected(null);
                }}
              >
                Desmarcar
              </Button>
            ) : (
              <Button className="rounded-full" onClick={confirm}>
                Confirmar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Repor todo o progresso?</DialogTitle>
            <DialogDescription>
              Todos os números concluídos serão apagados. Esta ação não pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => setConfirmReset(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => {
                reset();
                setConfirmReset(false);
                toast.success("Progresso reposto");
              }}
            >
              Apagar tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-bold tabular-nums",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}
