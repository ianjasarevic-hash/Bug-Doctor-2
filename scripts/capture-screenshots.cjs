// Visual probe: capture screenshots at the four key frames of the
// choreography: idle, mid-zoom-in, mid-HOLD (with scroll in flight),
// and after. Compare the scroll positions visually to confirm the
// scroll is happening WHILE the page is held at scale 1.4.

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SHOT_DIR = "C:/Users/ianja/AppData/Local/Temp/vacuum-viz";

(async () => {
  if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  page.on("pageerror", (e) => console.log("ERR:", e.message));

  await page.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await page.waitForTimeout(200);

  // baseline: top of page
  await page.screenshot({ path: path.join(SHOT_DIR, "00-baseline.png") });

  // Click FAQ. Capture at staggered times.
  await page.evaluate(() => {
    const a = document.querySelector('header a[href="#faq"]');
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  // ~50ms — early zoom-in
  await page.waitForTimeout(50);
  await page.screenshot({ path: path.join(SHOT_DIR, "01-zoom-in-early.png") });
  let s = await page.evaluate(() => ({ sy: window.scrollY, tr: document.getElementById("page-content").style.transform }));
  console.log("t≈50ms:", s);

  // ~190ms — late zoom-in
  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(SHOT_DIR, "02-zoom-in-late.png") });
  s = await page.evaluate(() => ({ sy: window.scrollY, tr: document.getElementById("page-content").style.transform }));
  console.log("t≈190ms:", s);

  // ~700ms — mid scroll (page held at scale 1.4, scroll partway)
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOT_DIR, "03-hold-mid-scroll.png") });
  s = await page.evaluate(() => ({ sy: window.scrollY, tr: document.getElementById("page-content").style.transform }));
  console.log("t≈700ms:", s);

  // ~1500ms — after zoom-out, scroll complete
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SHOT_DIR, "04-after.png") });
  s = await page.evaluate(() => ({ sy: window.scrollY, tr: document.getElementById("page-content").style.transform }));
  console.log("t≈1500ms:", s);

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
