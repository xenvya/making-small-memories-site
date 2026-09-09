import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import sharp from "sharp";
const base = process.env.TEST_BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
const names = ["keepsake", "horizon", "fieldnotes", "chapter"];
await fs.mkdir("handoff/screenshots", { recursive: true });
for (const [i, name] of names.entries()) {
  const slug = ["one", "two", "three", "four"][i];
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1060 },
    reducedMotion: "reduce",
  });
  await page.goto(`${base}/concept-${slug}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `handoff/screenshots/${name}-desktop.png`,
    fullPage: true,
  });
  const preview = await page.screenshot();
  await sharp(preview)
    .resize(1000)
    .webp({ quality: 84 })
    .toFile(`public/images/preview-${name}.webp`);
  for (const width of [768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: `handoff/screenshots/${name}-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();
}
await browser.close();
