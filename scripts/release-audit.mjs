import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
const report = [];
await fs.mkdir("handoff/screenshots", { recursive: true });
for (const path of ["/", "/privacy"]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() => {
    window.__metrics = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) =>
      list.getEntries().forEach((e) => {
        if (!e.hadRecentInput) window.__metrics.cls += e.value;
      }),
    ).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) =>
      list.getEntries().forEach((e) => (window.__metrics.lcp = e.startTime)),
    ).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const response = await page.goto(base + path);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      Promise.all(imgs.map((i) => i.decode().catch(() => {}))),
    );
  await page.evaluate(() => scrollTo(0, 0));
  const invalidAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute("href"))
        .filter((h) => !document.getElementById(h.slice(1))),
    );
  const metrics = await page.evaluate(() => ({
    ...window.__metrics,
    bytes: performance
      .getEntriesByType("resource")
      .reduce((n, e) => n + e.transferSize, 0),
    requests: performance.getEntriesByType("resource").length,
  }));
  await page.screenshot({
    path: `handoff/screenshots/live-${path === "/" ? "home" : path.slice(1)}-desktop.png`,
    fullPage: true,
  });
  const widths = [];
  for (const width of [320, 390, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    widths.push({
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
    if (width === 390 || width === 768)
      await page.screenshot({
        path: `handoff/screenshots/live-${path === "/" ? "home" : path.slice(1)}-${width}.png`,
        fullPage: true,
      });
  }
  const links = [
    ...new Set(
      await page
        .locator('a[href^="/"]')
        .evaluateAll((els) =>
          els
            .map((a) => a.getAttribute("href"))
            .filter((h) => !h.startsWith("//")),
        ),
    ),
  ];
  const linkResults = await Promise.all(
    links.map(async (href) => {
      const r = await page.request.get(base + href);
      return { href, status: r.status() };
    }),
  );
  report.push({
    path,
    status: response.status(),
    metrics,
    invalidAnchors,
    errors,
    widths,
    internalLinks: linkResults,
  });
  await page.close();
}
await browser.close();
await fs.writeFile(
  "handoff/release-audit.json",
  JSON.stringify(
    {
      base,
      checkedAt: new Date().toISOString(),
      note: "Observed browser load measurements, not a throttled Lighthouse benchmark.",
      pages: report,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    report.map((r) => ({
      path: r.path,
      status: r.status,
      cls: r.metrics.cls,
      lcpMs: Math.round(r.metrics.lcp),
      transferKB: Math.round(r.metrics.bytes / 1024),
      errors: r.errors,
      invalidAnchors: r.invalidAnchors,
      overflow: r.widths.filter((w) => w.overflow),
      badLinks: r.internalLinks.filter((l) => l.status !== 200),
    })),
    null,
    2,
  ),
);
if (
  report.some(
    (r) =>
      r.errors.length ||
      r.invalidAnchors.length ||
      r.widths.some((w) => w.overflow) ||
      r.internalLinks.some((l) => l.status !== 200),
  )
)
  process.exitCode = 1;
