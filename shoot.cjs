// Take screenshots at 375, 768, 1280, 1440 widths
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const widths = [
  { w: 375, name: "mobile-375" },
  { w: 768, name: "tablet-768" },
  { w: 1280, name: "desktop-1280" },
  { w: 1440, name: "desktop-1440" },
];

(async () => {
  const outDir = path.join(__dirname, "_shots");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const { w, name } of widths) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    page.on("pageerror", (err) => console.error(`[${name}] PAGE ERROR:`, err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.error(`[${name}] CONSOLE ERROR:`, msg.text());
    });
    const res = await page.goto("http://localhost:3001/", { waitUntil: "networkidle", timeout: 60000 });
    console.log(`[${name}] status=${res?.status()}`);
    await page.waitForTimeout(2500);
    const file = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`[${name}] wrote ${file}`);
    await ctx.close();
  }
  await browser.close();
})();