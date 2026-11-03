import { describe, expect, test } from "bun:test";
import { formatEur } from "../src/lib/challenge";
import { getNumberGridCellView } from "../src/lib/number-grid";

describe("getNumberGridCellView", () => {
  test("keeps the planned number and has no saved amount for pending entries", () => {
    expect(getNumberGridCellView(127)).toEqual({
      number: "127",
      actual: null,
      ariaLabel: "127 euros — por concluir",
    });
  });

  test("shows the actual saved amount when it differs from the planned number", () => {
    const view = getNumberGridCellView(127, { n: 127, actual: 85, at: 1 });

    expect(view.number).toBe("127");
    expect(view.actual).toBe(formatEur(85));
    expect(view.ariaLabel).toContain("127 euros — concluído");
    expect(view.ariaLabel).toContain(`valor real poupado ${formatEur(85)}`);
  });

  test("formats cents using the Portuguese euro format", () => {
    const view = getNumberGridCellView(250, { n: 250, actual: 250.5, at: 1 });

    expect(view.actual).toBe(formatEur(250.5));
    expect(view.actual).toContain(",50");
    expect(view.ariaLabel).toContain(formatEur(250.5));
  });

  test("does not hide a valid zero-euro actual amount", () => {
    const view = getNumberGridCellView(1, { n: 1, actual: 0, at: 1 });

    expect(view.actual).toBe(formatEur(0));
    expect(view.ariaLabel).toContain(formatEur(0));
  });
});
