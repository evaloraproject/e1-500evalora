import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Download, RotateCcw, Search, Trash2, Upload } from "lucide-react";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { GOAL, TOTAL_NUMBERS, formatEur, useChallenge } from "@/lib/challenge";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Filter = "all" | "done" | "todo";

const ALL = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
const GRID_PAGE_SIZE = 50;

function Index() {
  const { state, hydrated, stats, series, complete, uncomplete, undo, reset, importState } =
    useChallenge();
  const isMobile = useIsMobile();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedInput, setSelectedInput] = useState("");
  const [actual, setActual] = useState("");
  const [formError, setFormError] = useState("");
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

  const nextNumber = ALL.find((n) => !state.entries[n]);

  const openNumber = (n: number) => {
    if (!hydrated) return;
    setFormError("");
    setSelected(n);
    setSelectedInput(String(n));
    setActual(String(state.entries[n]?.actual ?? n));
  };

  const confirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected === null) return;
    const target = Number(selectedInput.trim());
    if (!Number.isInteger(target) || target < 1 || target > TOTAL_NUMBERS) {
      setFormError(`Escolhe um número inteiro entre 1 e ${TOTAL_NUMBERS}.`);
      return;
    }
    if (state.entries[target]) {
      setFormError(`O número ${target} já está concluído. Escolhe outro número.`);
      return;
    }
    const normalizedActual = actual.trim().replace(",", ".");
    const value = Number(normalizedActual);
    const validMoney = /^\d+(?:\.\d{1,2})?$/.test(normalizedActual);
    if (!validMoney || !Number.isFinite(value) || value < 0) {
      setFormError("Introduz um montante com até duas casas decimais.");
      return;
    }
    complete(target, value);
    setJustDone(target);
    window.setTimeout(() => setJustDone(null), 600);
    toast.success(`${target} marcado`, { description: `+ ${formatEur(value)}` });
    setSelected(null);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `desafio-1-500-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onImport = async (file: File) => {
    try {
      if (!window.confirm("Importar este ficheiro e substituir o progresso atual?")) return;
      importState(await file.text());
      toast.success("Dados importados");
    } catch {
      toast.error("Não foi possível importar este ficheiro");
    }
  };

  const selectedDone = selected !== null && Boolean(state.entries[selected]);


  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pt-8 md:max-w-3xl md:px-8 lg:max-w-6xl lg:px-10 lg:pt-12 safe-bottom">
      <header className="text-center">
        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Desafio 1 <span className="text-primary">→</span> 500
        </h1>
        <nav
          aria-label="Navegação principal"
          className="mt-4 flex flex-wrap justify-center gap-4 text-sm"
        >
          <Link to="/" className="text-primary underline underline-offset-4">
            Capa
          </Link>
          <Link to="/boas-vindas" className="text-primary underline underline-offset-4">
            Como funciona
          </Link>
          <Link to="/recomendacoes" className="text-primary underline underline-offset-4">
            Recomendações
          </Link>
        </nav>
      </header>

      <div className="mt-4 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="lg:sticky lg:top-8">

      <section className="relative mt-4 flex flex-col items-center">
        <div className="relative flex w-full max-w-[280px] items-center justify-center md:max-w-[300px]">
          <ProgressRing progress={stats.progress} size={isMobile ? 200 : 260} />
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

        {nextNumber !== undefined && (
          <Button
            size="lg"
            className="mt-5 h-12 w-full max-w-xs rounded-2xl text-base"
            disabled={!hydrated}
            onClick={() => openNumber(nextNumber)}
          >
            {hydrated ? `Registar ${formatEur(nextNumber)}` : "A carregar progresso…"}
          </Button>
        )}

      </section>


      {stats.finished && (
        <section className="mt-6 animate-[rise_0.5s_ease-out_both] rounded-3xl border border-primary/40 bg-primary/10 p-5 text-center">
          <p className="text-lg font-bold text-primary">DESAFIO CONCLUÍDO 🎯</p>
          <p className="mt-1 text-sm text-foreground">1 → 500</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatEur(stats.accumulated)} acumulados.</p>
        </section>
      )}

      </div>

      <div>

      <section aria-labelledby="numbers-heading">
        <h2 id="numbers-heading" className="text-xl font-semibold">Números do desafio</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            inputMode="numeric"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(GRID_PAGE_SIZE);
            }}
            aria-label="Procurar número"
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
              aria-pressed={filter === key}
              onClick={() => {
                setFilter(key);
                setVisibleCount(GRID_PAGE_SIZE);
              }}
              className={cn(
                "min-h-11 rounded-full border py-2 text-xs font-semibold transition-colors",
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
            numbers={numbers.slice(0, visibleCount)}
            entries={state.entries}
            justDone={justDone}
            onSelect={openNumber}
          />
        </div>

        {visibleCount < numbers.length && (
          <Button
            variant="outline"
            className="mt-4 w-full rounded-xl"
            onClick={() => setVisibleCount((count) => count + GRID_PAGE_SIZE)}
          >
            Mostrar mais números ({Math.min(visibleCount, numbers.length)} de {numbers.length})
          </Button>
        )}
      </section>

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

      <section className="mt-8 grid grid-cols-2 gap-2 pb-4 sm:grid-cols-4">
        <Button variant="secondary" className="rounded-2xl" onClick={undo} disabled={!state.order.length}>
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
          <form onSubmit={confirm} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>
                {selectedDone ? `Número ${selected} concluído` : "Registar poupança"}
              </DialogTitle>
              <DialogDescription>
                {selectedDone && selected !== null
                  ? `Poupaste ${formatEur(state.entries[selected].actual)} neste número.`
                  : `Número do desafio: ${selectedInput || selected} de ${TOTAL_NUMBERS}.`}
              </DialogDescription>
            </DialogHeader>

            {!selectedDone && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="saving-amount" className="block text-sm font-semibold">
                    Quanto poupaste?
                  </label>
                  <div className="relative">
                    <Input
                      id="saving-amount"
                      inputMode="decimal"
                      value={actual}
                      onChange={(event) => {
                        setActual(event.target.value);
                        setFormError("");
                      }}
                      className="h-12 rounded-2xl pr-10 text-lg tabular-nums"
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                  </div>
                </div>

                <details>
                  <summary className="w-fit cursor-pointer rounded text-sm text-primary underline underline-offset-4">
                    Escolher outro número
                  </summary>
                  <label htmlFor="saving-number" className="mt-3 block text-sm font-semibold">
                    Número do desafio
                  </label>
                  <Input
                    id="saving-number"
                    inputMode="numeric"
                    value={selectedInput}
                    onChange={(event) => {
                      const nextInput = event.target.value.replace(/\D/g, "");
                      if (actual === selectedInput) setActual(nextInput);
                      setSelectedInput(nextInput);
                      setFormError("");
                    }}
                    className="mt-2 h-12 rounded-2xl text-lg tabular-nums"
                  />
                </details>

                {formError && (
                  <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm">
                    {formError}
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="secondary" className="rounded-full" onClick={() => setSelected(null)}>
                Cancelar
              </Button>
              {selectedDone ? (
                <Button
                  type="button"
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
                <Button type="submit" className="rounded-full">
                  Guardar poupança
                </Button>
              )}
            </DialogFooter>
          </form>
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
    <div className="rounded-2xl border border-border bg-card px-3 py-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1.5 text-base font-bold tabular-nums md:text-lg",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}
