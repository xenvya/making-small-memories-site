import { expect, test } from "@playwright/test";

const routes = ["/", "/privacy"];

for (const route of routes) {
  test(`${route}: presents the complete brand lockup`, async ({ page }) => {
    await page.goto(route);
    const lockup = page
      .getByRole("link", { name: "Making Small Memories home" })
      .first();
    await expect(lockup).toBeVisible();
    await expect(lockup.locator(".brand-symbol")).toBeVisible();
    await expect(lockup.locator(".brand-name")).toContainText(
      "Making SmallMemories.",
    );
  });
}
