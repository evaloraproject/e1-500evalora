import { createFileRoute } from "@tanstack/react-router";
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
import { Download, RotateCcw, Search, Share2, Trash2, Upload } from "lucide-react";

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
import { GOAL, TOTAL_NUMBERS, formatEur, useChallenge } from "@/lib/challenge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DESAFIO 1 → 500 — Poupança até 125.250 €" },
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

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
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
    setActual(String(state.entries[n]?.actual ?? n));
  };

  const confirm = () => {
    if (selected === null) return;
    const value = Number(actual.replace(",", "."));
    complete(selected, Number.isFinite(value) && value >= 0 ? value : selected);
    setJustDone(selected);
    window.setTimeout(() => setJustDone(null), 600);
    toast.success(`${selected} marcado`, { description: `+ ${formatEur(value || selected)}` });
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
    const text = `Desafio 1 → 500: poupa até 125.250 €. Já vou em ${formatEur(stats.accumulated)}!`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "DESAFIO 1 → 500", text, url });
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
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 pt-10 safe-bottom">
      <header className="text-center">
        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Desafio 1 <span className="text-primary">→</span> 500
        </h1>
      </header>

      <section className="relative mt-8 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={stats.progress} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Total acumulado
            </span>
            <span className="mt-2 text-4xl font-bold tabular-nums text-gradient-gold">
              {hydrated ? formatEur(stats.accumulated) : "—"}
            </span>
            <span className="mt-2 text-sm tabular-nums text-muted-foreground">
              {stats.progress.toFixed(1)}% de {formatEur(GOAL)}
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm tabular-nums text-foreground">
          <span className="font-semibold text-primary">{stats.doneCount}</span> / {TOTAL_NUMBERS}{" "}
          concluídos
        </p>
        <p className="mt-1 text-sm tabular-nums text-muted-foreground">
          Faltam {formatEur(stats.remaining)}
        </p>

        <Button size="lg" className="mt-6 w-full max-w-xs rounded-full" onClick={markNext}>
          MARCAR VALOR
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mt-3 w-full max-w-xs rounded-full"
          onClick={share}
        >
          <Share2 className="mr-2 size-4" />
          PARTILHAR APP
        </Button>
      </section>


      {stats.finished && (
        <section className="mt-8 animate-[rise_0.5s_ease-out_both] rounded-3xl border border-primary/40 bg-primary/10 p-6 text-center">
          <p className="text-lg font-bold text-primary">DESAFIO CONCLUÍDO 🎯</p>
          <p className="mt-1 text-sm text-foreground">1 → 500</p>
          <p className="mt-1 text-sm text-muted-foreground">125.250 € acumulados.</p>
        </section>
      )}

      <section className="mt-10 grid grid-cols-2 gap-3">
        <Stat label="💰 Acumulado" value={formatEur(stats.accumulated)} accent />
        <Stat label="🎯 Objetivo" value={formatEur(GOAL)} />
        <Stat label="📊 Progresso" value={`${stats.progress.toFixed(1)}%`} accent />
        <Stat label="⏳ Restantes" value={`${stats.remainingCount}`} />
        <Stat label="✅ Concluídos" value={`${stats.doneCount}`} />
        <Stat label="Falta" value={formatEur(stats.remaining)} />
      </section>

      <section className="mt-6 rounded-3xl border border-border bg-card p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Evolução
        </p>
        <div className="mt-3 h-44 w-full">
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

      <section className="mt-8 grid grid-cols-2 gap-2 pb-4">
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

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDone
                ? `${selected} já está concluído`
                : `Marcar ${selected} € como concluído?`}
            </DialogTitle>
            <DialogDescription>
              Valor previsto: {selected !== null ? formatEur(selected) : ""}
            </DialogDescription>
          </DialogHeader>

          {!selectedDone && (
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
