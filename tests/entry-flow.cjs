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
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "CONTINUAR" }).waitFor();
      assert.equal(new URL(page.url()).pathname, "/");
      await assertImageLoaded(page, "E-VALORA — Desafio 1 → 500");
      await page.screenshot({ path: `test-results/${name}-cover.png`, fullPage: true });

      await page.getByRole("button", { name: "Virar a página", exact: true }).click();
      await page.waitForURL("**/boas-vindas");
      const start = page.getByRole("link", { name: "Começar o desafio" });
      const startBox = await start.boundingBox();
      assert(startBox && startBox.y + startBox.height < 500, "A entrada deve estar visível antes do vídeo");
      const video = page.getByLabel("Guia rápido do desafio E-VALORA");
      assert.equal(await video.isVisible(), false, "O guia deve ser opcional");
      await page.getByText("Ver guia rápido", { exact: true }).click();
      await video.waitFor({ state: "visible" });
      const videoUrl = await video.getAttribute("src");
      assert.equal(videoUrl, "/media/evalora-guia.mp4");
      const videoResponse = await page.request.get(videoUrl, { headers: { Range: "bytes=0-63" } });
      assert.equal(videoResponse.ok(), true);
      assert.match(videoResponse.headers()["content-type"] || "", /video\/mp4/);
      await page.screenshot({ path: `test-results/${name}-welcome.png`, fullPage: true });

      await page.getByRole("link", { name: "Começar o desafio" }).click();
      await page.waitForURL("**/app");
      await page.getByRole("link", { name: "Recomendações", exact: true }).click();
      await page.waitForURL("**/recomendacoes");
      await page.getByRole("heading", { name: "Recomendações" }).waitFor();
      const music = page.getByRole("link", { name: /Ouvir música recomendada no YouTube/i });
      await music.waitFor();
      assert.equal(await music.getAttribute("href"), "https://www.youtube.com/watch?v=uM8oI4hqw8o");

      const search = page.getByRole("textbox", { name: /Pesquisar recomendações/i });
      await search.fill("WeTradeX");
      await page.locator('a[href="https://wetradex.group/invite/boss004"]').waitFor();
      await page.getByText("1 recomendações nesta seleção", { exact: true }).waitFor();
      await search.clear();

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
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "CONTINUAR" }).click();
      await page.getByRole("link", { name: "Começar o desafio" }).click();
      await page.waitForURL("**/app");
      await page.getByText("5,25", { exact: false }).first().waitFor();
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.getByText("5,25", { exact: false }).first().waitFor();
      assert.deepEqual(
        await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), key),
        saved,
      );
      await page.screenshot({ path: `test-results/${name}-progress.png`, fullPage: true });

      await page.close();
      const directApp = await context.newPage();
      await directApp.goto("/app", { waitUntil: "domcontentloaded" });
      await directApp.getByRole("link", { name: "Capa", exact: true }).waitFor();
      await directApp.getByRole("button", { name: "Registar 1 €" }).click();
      const savingsForm = directApp.getByRole("dialog", { name: "Registar poupança" });
      const amount = savingsForm.getByLabel("Quanto poupaste?");
      assert.equal(await amount.inputValue(), "1");
      await amount.fill("1,555");
      await savingsForm.getByRole("button", { name: "Guardar poupança" }).click();
      await savingsForm.getByRole("alert").getByText(/até duas casas decimais/).waitFor();
      await amount.fill("1,50");
      await savingsForm.getByRole("button", { name: "Guardar poupança" }).click();
      await directApp.getByText("6,75", { exact: false }).first().waitFor();
      await directApp.reload({ waitUntil: "domcontentloaded" });
      await directApp.getByText("6,75", { exact: false }).first().waitFor();
      const gridSearch = directApp.getByRole("textbox", { name: "Procurar número" });
      await gridSearch.fill("500");
      await directApp.getByRole("button", { name: "500 euros — por concluir" }).waitFor();
      assert.equal(new URL(directApp.url()).pathname, "/app");
      await context.close();
      console.log(
        `PASS ${name}: capa/imagem, boas-vindas/vídeo e ligação da música, recomendações/categorias, link Bybit, progresso preservado, reload e acesso direto /app`,
      );
    } finally {
      await browser.close();
    }
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
