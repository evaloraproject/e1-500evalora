import { formatEur, type Entry } from "./challenge";

export type NumberGridCellView = {
  number: string;
  actual: string | null;
  ariaLabel: string;
};

/**
 * Builds the visible and accessible content for one savings-grid cell.
 * Completed cells keep the planned number visible and add the saved amount.
 */
export function getNumberGridCellView(n: number, entry?: Entry): NumberGridCellView {
  const number = String(n);

  if (!entry) {
    return {
      number,
      actual: null,
      ariaLabel: `${n} euros — por concluir`,
    };
  }

  const actual = formatEur(entry.actual);

  return {
    number,
    actual,
    ariaLabel: `${n} euros — concluído; valor real poupado ${actual}`,
  };
}
