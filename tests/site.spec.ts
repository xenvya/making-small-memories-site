import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const paths = [
  "/",
  "/concept-one",
  "/concept-two",
  "/concept-three",
  "/concept-four",
  "/concept-five",
  "/privacy",
];
for (const width of [390, 768, 1440])
  for (const path of paths)
    test(`${path} at ${width}px: structure, images, overflow and accessibility`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter(
              (i) =>
                !(i as HTMLImageElement).complete ||
                !(i as HTMLImageElement).naturalWidth,
            )
            .map((i) => (i as HTMLImageElement).src),
        );
      expect(broken).toEqual([]);
      expect(errors).toEqual([]);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
      if (path.includes("concept-")) {
        for (const id of [
          "about",
          "services",
          "process",
          "payments",
          "faq",
          "booking",
        ])
          await expect(page.locator(`#${id}`)).toBeAttached();
        await expect(
          page
            .getByRole("link", { name: "757-232-7664", exact: false })
            .first(),
        ).toHaveAttribute("href", "tel:+17572327664");
      }
    });
for (const path of paths.filter((p) => p.includes("concept-")))
  test(`${path}: mobile navigation, FAQ, inquiry and keyboard`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("#main-nav")).toBeVisible();
    await page.locator('#main-nav a[href="#services"]').click();
    await expect(page.locator("#main-nav")).not.toBeVisible();
    await page.locator("#faq summary").first().click();
    await expect(page.locator("#faq details").first()).toHaveAttribute(
      "open",
      "",
    );
    await page.locator("#interest").selectOption("Retirement planning");
    await page.locator("#first-name").fill("QA visitor");
    await page.getByRole("button", { name: "Request a consultation" }).click();
    await expect(page.locator("#email-status")).toContainText("email app");
    await page.goto(path);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeInViewport();
  });
test("Open Horizon service explorer supports keyboard and accurate panels", async ({
  page,
}) => {
  await page.goto("/concept-two");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Life coaching");
  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Investment options & strategies",
  );
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel")).toContainText("Travel services");
});
test("Field Notes updates location while exploring services", async ({
  page,
}) => {
  await page.goto("/concept-three");
  await page.locator("#service-retirement").scrollIntoViewIfNeeded();
  await expect(
    page.locator('[data-guide-link][href="#service-retirement"]'),
  ).toHaveAttribute("aria-current", "location");
});
test("Reduced motion disables scenic movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/concept-two");
  await page.locator("#services").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator(".horizon-landscape img")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("No JavaScript preserves service and contact content", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/concept-two");
  await expect(
    page.getByText("Investment options & strategies", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("#booking")).toBeAttached();
  await context.close();
});
test("Unknown URLs return the custom 404", async ({ page }) => {
  const res = await page.goto("/missing-page");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "A small detour." }),
  ).toBeVisible();
});

for (const concept of ["one", "two", "three", "four", "five"])
  for (const width of [390, 1440])
    test(`${concept} ${width}: booking and Stripe preview walkthroughs`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/concept-${concept}`);
      await page
        .getByRole("button", { name: "Book a consultation", exact: true })
        .click();
      const booking = page.getByRole("dialog", {
        name: "A conversation with John.",
      });
      await expect(booking).toBeVisible();
      await expect(page.locator("[data-booking-review]")).toBeDisabled();
      await page.locator(".demo-days button").nth(2).click();
      await page.getByRole("button", { name: "1:00 PM", exact: true }).click();
      await page.locator("#demo-service").selectOption("Life coaching");
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.getByRole("button", { name: "Review appointment" }).click();
      await expect(page.locator("[data-review-service]")).toHaveText(
        "Life coaching",
      );
      await expect(booking).toContainText("No appointment has been booked");
      await page.getByRole("button", { name: "Choose another time" }).click();
      await page.keyboard.press("Escape");
      await expect(booking).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "Book a consultation", exact: true }),
      ).toBeFocused();
      await page
        .getByRole("button", { name: "Preview Stripe payment" })
        .click();
      const payment = page.locator("#payment-demo");
      await expect(payment).toBeVisible();
      await page
        .locator("#payment-service")
        .selectOption("Retirement planning");
      await page.locator('[data-pay-mode="installments"]').click();
      await expect(page.locator("[data-checkout-service]")).toHaveText(
        "Retirement planning",
      );
      await expect(page.locator("[data-checkout-mode]")).toContainText(
        "Installment plan",
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page
        .getByRole("button", { name: "Finish payment preview" })
        .click();
      await expect(payment).toContainText("No payment was made.");
      await expect(payment.locator("input")).toHaveCount(0);
      await page
        .getByRole("button", { name: "Explore another payment option" })
        .click();
      await page.locator('[data-pay-mode="full"]').click();
      await expect(page.locator("[data-checkout-mode]")).toHaveText(
        "One-time payment",
      );
      await page.getByRole("button", { name: "Close payment preview" }).click();
      await expect(payment).not.toBeVisible();
    });
test("Golden Hour and Living Moments journey controls", async ({ page }) => {
  await page.goto("/concept-four");
  await page.getByRole("button", { name: "Navigate", exact: false }).click();
  await expect(page.locator("[data-direction-title]")).toContainText(
    "benefits",
  );
  await page.goto("/concept-five");
  const field = page.locator(".moment-field");
  const initial = await field.evaluate((el) =>
    (el as HTMLCanvasElement).toDataURL(),
  );
  await expect
    .poll(() => field.evaluate((el) => (el as HTMLCanvasElement).toDataURL()))
    .not.toBe(initial);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await field.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      return c
        .getContext("2d")!
        .getImageData(0, 0, c.width, c.height)
        .data.some((x) => x !== 0);
    }),
  ).toBe(false);
  await page.getByRole("button", { name: "Resume motion" }).click();
  const range = page.getByRole("slider", { name: "Choose your direction" });
  await range.focus();
  await page.keyboard.press("End");
  await expect(range).toHaveAttribute(
    "aria-valuetext",
    "Investment options & strategies",
  );
  await expect(page.locator("[data-journey-label]")).toHaveText(
    "Investment options & strategies",
  );
  await page.keyboard.press("Home");
  await expect(page.locator("[data-journey-label]")).toHaveText(
    "Travel services",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#about").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator(".kinetic-photo")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
});
