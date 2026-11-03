// Run against a local dev server: NODE_PATH=<playwright install>/node_modules node tests/entry-flow.cjs
// Requires Playwright and its Chromium/WebKit browsers. Never targets production by default.
const { chromium, webkit, devices } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const baseURL = process.env.TEST_BASE_URL || "http://localhost:5173";
const key = "desafio-1-500:v1";
const saved = { entries: { 7: { n: 7, actual: 5.25, at: 1700000000000 } }, order: [7] };

async function assertImageLoaded(page, alt) {
  const image = page.locator(`img[alt=${JSON.stringify(alt)}]`);
  await image.waitFor({ state: "visible" });
  await image.evaluate(async (element) => {
    const imageElement = element;
    try {
      await imageElement.decode();
    } catch {
      throw new Error(`Imagem não carregada: ${imageElement.currentSrc || imageElement.src}`);
    }
    if (imageElement.naturalWidth <= 0 || imageElement.naturalHeight <= 0) {
      throw new Error(`Imagem sem dimensões válidas: ${imageElement.currentSrc || imageElement.src}`);
    }
  });
}

(async () => {
  await fs.mkdir("test-results", { recursive: true });
  for (const [name, engine, options] of [
    ["chromium", chromium, {}],
    ["iphone-webkit", webkit, devices["iPhone 13"]],
  ]) {
    const browser = await engine.launch();
    try {
      const context = await browser.newContext({ ...options, baseURL });
      const page = await context.newPage();
      await page.goto("/");
      await page.getByRole("button", { name: "CONTINUAR" }).waitFor();
      assert.equal(new URL(page.url()).pathname, "/");
      await assertImageLoaded(page, "E-VALORA — Desafio 1 → 500");
      await page.screenshot({ path: `test-results/${name}-cover.png`, fullPage: true });

      await page.getByRole("button", { name: "Virar a página", exact: true }).click();
      await page.getByRole("heading", { name: "Bem-vindo à E-VALORA" }).waitFor();
      await assertImageLoaded(page, "Mascote E-VALORA a apontar para o desafio");
      await page.screenshot({ path: `test-results/${name}-welcome.png`, fullPage: true });

      await page.getByRole("button", { name: "COMEÇAR O DESAFIO" }).click();
      await page.waitForURL("**/app");
      await page.getByRole("link", { name: "Recomendações", exact: true }).click();
      await page.waitForURL("**/recomendacoes");
      await page.getByRole("heading", { name: "Recomendações" }).waitFor();

      await page.getByRole("button", { name: "Parcerias" }).click();
      await page.getByText("FPC Automatismos", { exact: true }).waitFor();
      await assertImageLoaded(page, "Logotipo FPC Automatismos");

      await page.getByRole("button", { name: "Vendas" }).click();
      await page.getByText("Cripto Sem Atalhos", { exact: true }).waitFor();

      await page.getByRole("button", { name: "Ganha Mais" }).click();
      const bybit = page.locator('a[href="https://partner.bybit.eu/b/aff_59342_162579"]');
      await bybit.waitFor({ state: "visible" });
      assert.equal(await bybit.getAttribute("target"), "_blank");
      const rel = await bybit.getAttribute("rel");
      assert.match(rel || "", /noopener/);
      assert.match(rel || "", /noreferrer/);

      // Seed existing progress in this isolated test context only.
      await page.evaluate(
        ({ key, saved }) => localStorage.setItem(key, JSON.stringify(saved)),
        { key, saved },
      );
      await page.goto("/");
      await page.getByRole("button", { name: "CONTINUAR" }).click();
      await page.getByRole("button", { name: "COMEÇAR O DESAFIO" }).click();
      await page.waitForURL("**/app");
      await page.getByText("5,25", { exact: false }).first().waitFor();
      await page.reload();
      await page.getByText("5,25", { exact: false }).first().waitFor();
      assert.deepEqual(
        await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), key),
        saved,
      );
      await page.screenshot({ path: `test-results/${name}-progress.png`, fullPage: true });

      await page.goto("/app");
      await page.getByRole("link", { name: "Capa", exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, "/app");
      await context.close();
      console.log(
        `PASS ${name}: capa/imagem, boas-vindas/mascote, recomendações/categorias, link Bybit, progresso preservado, reload e acesso direto /app`,
      );
    } finally {
      await browser.close();
    }
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
