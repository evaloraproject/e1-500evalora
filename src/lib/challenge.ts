import { useCallback, useEffect, useMemo, useState } from "react";

export const TOTAL_NUMBERS = 500;
export const GOAL = (TOTAL_NUMBERS * (TOTAL_NUMBERS + 1)) / 2; // 125250

export type Entry = {
  /** valor previsto (o próprio número) */
  n: number;
  /** valor realmente poupado */
  actual: number;
  /** timestamp */
  at: number;
};

export type ChallengeState = {
  entries: Record<number, Entry>;
  order: number[];
};

const STORAGE_KEY = "desafio-1-500:v1";

const empty: ChallengeState = { entries: {}, order: [] };

function load(): ChallengeState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as ChallengeState;
    if (!parsed || typeof parsed !== "object" || !parsed.entries) return empty;
    return { entries: parsed.entries, order: parsed.order ?? [] };
  } catch {
    return empty;
  }
}

export function formatEur(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function useChallenge() {
  const [state, setState] = useState<ChallengeState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage cheio ou indisponível */
    }
  }, [state, hydrated]);

  const complete = useCallback((n: number, actual?: number) => {
    setState((prev) => {
      if (prev.entries[n]) return prev;
      return {
        entries: { ...prev.entries, [n]: { n, actual: actual ?? n, at: Date.now() } },
        order: [...prev.order, n],
      };
    });
  }, []);

  const uncomplete = useCallback((n: number) => {
    setState((prev) => {
      if (!prev.entries[n]) return prev;
      const entries = { ...prev.entries };
      delete entries[n];
      return { entries, order: prev.order.filter((x) => x !== n) };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      const last = prev.order[prev.order.length - 1];
      if (last === undefined) return prev;
      const entries = { ...prev.entries };
      delete entries[last];
      return { entries, order: prev.order.slice(0, -1) };
    });
  }, []);

  const reset = useCallback(() => setState({ entries: {}, order: [] }), []);

  const importState = useCallback((raw: string) => {
    const parsed = JSON.parse(raw) as Partial<ChallengeState>;
    if (!parsed || typeof parsed !== "object" || !parsed.entries) {
      throw new Error("Ficheiro inválido");
    }
    const entries: Record<number, Entry> = {};
    for (const [k, v] of Object.entries(parsed.entries)) {
      const n = Number(k);
      if (!Number.isInteger(n) || n < 1 || n > TOTAL_NUMBERS) continue;
      const e = v as Entry;
      entries[n] = { n, actual: Number(e?.actual ?? n), at: Number(e?.at ?? Date.now()) };
    }
    const order = (parsed.order ?? [])
      .map(Number)
      .filter((n) => entries[n] !== undefined);
    for (const n of Object.keys(entries).map(Number)) {
      if (!order.includes(n)) order.push(n);
    }
    setState({ entries, order });
  }, []);

  const stats = useMemo(() => {
    const list = state.order
      .map((n) => state.entries[n])
      .filter((e): e is Entry => Boolean(e));
    const accumulated = list.reduce((s, e) => s + e.actual, 0);
    const doneCount = list.length;
    const plannedDone = list.reduce((s, e) => s + e.n, 0);
    return {
      accumulated,
      doneCount,
      remainingCount: TOTAL_NUMBERS - doneCount,
      remaining: Math.max(GOAL - plannedDone, 0),
      progress: (plannedDone / GOAL) * 100,
      finished: doneCount === TOTAL_NUMBERS,
    };
  }, [state]);

  const series = useMemo(() => {
    let acc = 0;
    return state.order.map((n, i) => {
      acc += state.entries[n]?.actual ?? 0;
      return { step: i + 1, total: acc, n };
    });
  }, [state]);

  return { state, hydrated, stats, series, complete, uncomplete, undo, reset, importState };
}
