import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, extname } from "node:path";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
// Synthetic commercial data is built only into ignored tmp/, never production dist/.
const fixture = [
  {
    id: "qa-offer",
    name: "QA fixture only",
    serviceId: "travel",
    description: "Synthetic integration test. Not a real business offer.",
    fullPriceLabel: "$120 (test fixture)",
    fullPaymentUrl: "https://buy.stripe.com/test_full_fixture",
    installmentLabel: "3 payments of $40 (test fixture)",
    installmentUrl: "https://buy.stripe.com/test_installment_fixture",
  },
];
execFileSync(
  "node",
  ["node_modules/.bin/astro", "build", "--outDir", "tmp/activation"],
  {
    env: {
      ...process.env,
      PUBLIC_CAL_LINK: "qa-fixture/consultation",
      PUBLIC_OFFERS_JSON: JSON.stringify(fixture),
    },
    stdio: "pipe",
  },
);
const assetRoot = resolve("tmp/activation");
const csp = (await fs.readFile("public/_headers", "utf8"))
  .split("\n")
  .find((line) => line.trim().startsWith("Content-Security-Policy:"))
  .split("Content-Security-Policy:")[1]
  .trim();
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const asset = resolve(
    assetRoot,
    "." + (pathname === "/" ? "/index.html" : pathname),
  );
  if (!asset.startsWith(assetRoot + "/")) {
    res.writeHead(403);
    res.end();
    return;
  }
  const file = extname(asset) ? asset : asset + ".html";
  try {
    const bytes = await fs.readFile(file);
    const mime =
      {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".jpg": "image/jpeg",
      }[extname(file)] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Security-Policy": csp,
    });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(4322, resolve));
let browser;
try {
  browser = await chromium.launch();
  let passed = 0;
  for (const slug of ["one", "two", "three", "four"])
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      // Exercise the real embed bootstrap, while intercepting the booker's iframe.
      await page.route("https://cal.com/qa-fixture/**", (r) =>
        r.fulfill({
          contentType: "text/html",
          body: '<!doctype html><html lang="en"><title>Calendar fixture</title><body><h1>Test calendar</h1><button>Choose a test time</button></body></html>',
        }),
      );
      await page.goto(`http://localhost:4322/concept-${slug}`);
      await expect(
        page.getByRole("link", { name: "Pay in full", exact: true }),
      ).toHaveAttribute("href", fixture[0].fullPaymentUrl);
      await expect(
        page.getByRole("link", {
          name: "Choose installment plan",
          exact: true,
        }),
      ).toHaveAttribute("href", fixture[0].installmentUrl);
      await expect(
        page.getByText(fixture[0].installmentLabel, { exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "View appointments" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.locator("#cal-inline iframe")).toHaveAttribute(
        "src",
        /qa-fixture\/consultation/,
        { timeout: 20000 },
      );
      await expect(
        page.getByRole("link", { name: "Open Cal.com in a new tab" }),
      ).toHaveAttribute("href", "https://cal.com/qa-fixture/consultation");
      // Keep focus inside the native modal, including when tabbing backwards.
      await page
        .getByRole("button", { name: "Close appointment calendar" })
        .focus();
      await page.keyboard.press("Shift+Tab");
      expect(
        await page.evaluate(() =>
          Boolean(document.activeElement?.closest("dialog")),
        ),
      ).toBeTruthy();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "View appointments" }),
      ).toBeFocused();
      await page.getByRole("button", { name: "View appointments" }).click();
      await page
        .getByRole("button", { name: "Close appointment calendar" })
        .click();
      expect(errors).toEqual([]);
      await page.close();
      passed++;
    }
  const fallbackContext = await browser.newContext();
  const page = await fallbackContext.newPage();
  await page.route("https://app.cal.com/embed/embed.js", (r) => r.abort());
  await page.goto("http://localhost:4322/concept-one");
  await page.getByRole("button", { name: "View appointments" }).click();
  await expect(page.locator("#cal-inline")).toContainText(
    "Please use the calendar link below",
  );
  await expect(
    page.getByRole("link", { name: "Open Cal.com in a new tab" }),
  ).toBeVisible();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  passed++;
  const fixtureFiles = await fs.readFile("dist/concept-one.html", "utf8");
  expect(fixtureFiles).not.toContain("QA fixture");
  expect(fixtureFiles).not.toContain("qa-fixture");
  console.log(
    `${passed} integration scenarios passed: four themes × mobile/desktop, full and installment payment links, real Cal.com embed bootstrap with intercepted appointment page, modal keyboard/focus, blocked-embed fallback. No live booking or charge made.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
