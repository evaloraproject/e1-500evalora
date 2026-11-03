import { memo } from "react";
import type { Entry } from "@/lib/challenge";
import { getNumberGridCellView } from "@/lib/number-grid";
import { cn } from "@/lib/utils";

type Props = {
  numbers: number[];
  entries: Record<number, Entry>;
  justDone: number | null;
  onSelect: (n: number) => void;
};

function GridImpl({ numbers, entries, justDone, onSelect }: Props) {
  if (numbers.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">Nenhum número encontrado.</p>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12">
      {numbers.map((n) => {
        const entry = entries[n];
        const done = Boolean(entry);
        const cell = getNumberGridCellView(n, entry);

        return (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            aria-pressed={done}
            aria-label={cell.ariaLabel}
            title={cell.actual === null ? undefined : `Valor real poupado: ${cell.actual}`}
            className={cn(
              "aspect-square rounded-xl border text-sm font-semibold tabular-nums transition-all duration-200 active:scale-95",
              done
                ? "border-primary/40 bg-primary/15 text-primary shadow-[0_0_18px_-8px_var(--primary)]"
                : "border-border bg-secondary/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              justDone === n && "animate-[pop_0.45s_cubic-bezier(0.34,1.56,0.64,1)]",
            )}
          >
            {cell.actual === null ? (
              cell.number
            ) : (
              <span className="flex min-w-0 flex-col items-center justify-center gap-0.5 leading-none">
                <span className="text-[10px] font-medium opacity-70">{cell.number}</span>
                <span className="max-w-full truncate text-[9px] font-bold sm:text-[10px]">
                  {cell.actual}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const NumberGrid = memo(GridImpl);
