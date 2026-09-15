import { expect, test } from "@playwright/test";

const routes = ["/", "/privacy"];

for (const route of routes) {
  test(`${route}: presents the selected Signature Serif logo`, async ({
    page,
  }) => {
    await page.goto(route);
    const lockup = page
      .getByRole("link", { name: "Making Small Memories home" })
      .first();
    await expect(lockup).toBeVisible();
    const logo = lockup.locator(".brand-signature");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("src", "/brand/msm-signature-serif.png");
    await expect(logo).toHaveJSProperty("complete", true);
  });
}
