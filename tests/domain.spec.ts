import { expect, test } from "@playwright/test";

const origin = "https://makingsmallmemories.com";

for (const path of ["/", "/privacy"]) {
  test(`${path}: metadata uses the production domain`, async ({ page }) => {
    await page.goto(path);
    const canonical = new URL(path, origin).href;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${origin}/images/social.jpg`,
    );
    const organization = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(JSON.parse(organization || "{}").url).toMatch(
      /^https:\/\/makingsmallmemories\.com\/?$/,
    );
  });
}

test("public domain redirects preserve paths and query parameters", async ({
  request,
  baseURL,
}) => {
  test.skip(
    new URL(baseURL || "http://localhost").hostname !==
      "makingsmallmemories.com",
    "Runs against the deployed domain, where the Cloudflare Worker executes.",
  );
  for (const address of [
    "https://www.makingsmallmemories.com/",
    "https://www.makingsmallmemories.com/privacy?source=domain-check&name=John%20Small",
    "http://makingsmallmemories.com/privacy?source=domain-check",
    "http://www.makingsmallmemories.com/privacy?source=domain-check",
  ]) {
    const incoming = new URL(address);
    const response = await request.get(address, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(
      `${origin}${incoming.pathname}${incoming.search}`,
    );
  }
});
