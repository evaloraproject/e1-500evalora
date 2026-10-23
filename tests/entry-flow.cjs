// Run against a local dev server: NODE_PATH=<playwright install>/node_modules node tests/entry-flow.cjs
// Requires Playwright and its Chromium/WebKit browsers. Never targets production by default.
const { chromium, webkit, devices } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const baseURL = process.env.TEST_BASE_URL || "http://localhost:5173";
const key = "desafio-1-500:v1";
const saved = { entries: { 7: { n: 7, actual: 5.25, at: 1700000000000 } }, order: [7] };
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
      await page.screenshot({ path: `test-results/${name}-cover.png`, fullPage: true });
      await page.getByRole("button", { name: "Virar a página", exact: true }).click();
      await page.getByRole("heading", { name: "Bem-vindo à E-VALORA" }).waitFor();
      await page.screenshot({ path: `test-results/${name}-welcome.png`, fullPage: true });
      await page.getByRole("button", { name: "COMEÇAR O DESAFIO" }).click();
      await page.waitForURL("**/app");
      await page.getByRole("link", { name: "Recomendações", exact: true }).click();
      await page.waitForURL("**/recomendacoes");
      assert.ok(await page.locator('a[href^="https://"]').count());
      // Seed existing progress in this isolated test context only.
      await page.evaluate(({ key, saved }) => localStorage.setItem(key, JSON.stringify(saved)), {
        key,
        saved,
      });
      await page.goto("/");
      await page.getByRole("button", { name: "CONTINUAR" }).click();
      await page.getByRole("button", { name: "COMEÇAR O DESAFIO" }).click();
      await page.waitForURL("**/app");
      await page.getByText("5,25", { exact: false }).first().waitFor();
      await page.reload();
      await page.getByText("5,25", { exact: false }).first().waitFor();
      assert.deepEqual(
        await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key),
        saved,
      );
      await page.screenshot({ path: `test-results/${name}-progress.png`, fullPage: true });
      await page.goto("/app");
      await page.getByRole("link", { name: "Capa", exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, "/app");
      await context.close();
      console.log(
        `PASS ${name}: fresh entry, corner turn, welcome, recommendations, saved progress, reload, direct /app`,
      );
    } finally {
      await browser.close();
    }
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
