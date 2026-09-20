import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
await fs.mkdir("handoff/screenshots", { recursive: true });
for (const [name, path] of [
  ["home", "/"],
  ["privacy", "/privacy"],
]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1060 },
    reducedMotion: "reduce",
  });
  await page.goto(`${base}${path}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `handoff/screenshots/${name}-desktop.png`,
    fullPage: true,
  });
  if (name === "home") {
    await page
      .locator("#donations")
      .screenshot({ path: "handoff/screenshots/donations-desktop.png" });
  }
  for (const width of [768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    if (name === "home") {
      await page
        .locator("#donations")
        .screenshot({ path: `handoff/screenshots/donations-${width}.png` });
    }
    await page.screenshot({
      path: `handoff/screenshots/${name}-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();
}
await browser.close();
