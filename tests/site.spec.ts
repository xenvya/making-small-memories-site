import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/privacy"];

for (const width of [390, 768, 1440])
  for (const path of paths)
    test(`${path} at ${width}px: structure, images, overflow and accessibility`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      const brokenImages = await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter(
              (image) =>
                image.hasAttribute("src") &&
                (image as HTMLImageElement).complete &&
                !(image as HTMLImageElement).naturalWidth,
            )
            .map((image) => (image as HTMLImageElement).src),
        );
      expect(brokenImages).toEqual([]);
      expect(errors).toEqual([]);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(axe.violations).toEqual([]);

      if (path === "/") {
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

test("homepage mobile navigation, FAQ, inquiry and keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
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
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeInViewport();
});

test("homepage exposes the approved external resources", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", {
      name: "Visit VA.org (opens in a new tab)",
    }),
  ).toHaveAttribute("href", "https://va.org");
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveAttribute(
    "href",
    "https://www.facebook.com/johncsmalljr",
  );
});

test("travel gallery exposes all photographs and keyboard lightbox navigation", async ({
  page,
}) => {
  await page.goto("/");
  const gallery = page.locator("[data-travel-gallery]");
  const items = gallery.locator("[data-gallery-index]");
  await expect(gallery).toBeVisible();
  await expect(items).toHaveCount(33);
  await expect(items.nth(7)).toBeVisible();
  await expect(items.nth(8)).toBeHidden();

  const more = gallery.locator("[data-gallery-more]");
  await expect(more).toHaveAccessibleName("View all 33 photographs");
  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  await expect(items.last()).toBeVisible();

  await items.first().click();
  const lightbox = gallery.locator("[data-travel-lightbox]");
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator("[data-lightbox-count]")).toHaveText(
    "Travel memory 1 of 33",
  );
  await expect(lightbox.locator("[data-lightbox-image]")).toHaveAttribute(
    "src",
    "/images/travel/travel-memory-01.webp",
  );

  await page.keyboard.press("ArrowRight");
  await expect(lightbox.locator("[data-lightbox-count]")).toHaveText(
    "Travel memory 2 of 33",
  );
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(items.first()).toBeFocused();
});

for (const path of [
  "/concept-one",
  "/concept-two",
  "/concept-three",
  "/concept-four",
  "/concept-five",
])
  test(`${path} redirects to the selected homepage`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: /A life well lived/i }),
    ).toBeVisible();
  });

test("No JavaScript preserves service and contact content", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByText("Investment options & strategies", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("#booking")).toBeAttached();
  await expect(page.locator("[data-gallery-index]")).toHaveCount(33);
  await expect(page.locator("[data-gallery-index]").last()).toBeVisible();
  await context.close();
});

test("Unknown URLs return the custom 404", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "A small detour." }),
  ).toBeVisible();
});

for (const width of [390, 1440])
  test(`homepage ${width}: booking and Stripe preview walkthroughs`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
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
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
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

    await page.getByRole("button", { name: "Preview Stripe payment" }).click();
    const payment = page.locator("#payment-demo");
    await expect(payment).toBeVisible();
    await page.locator("#payment-service").selectOption("Retirement planning");
    await page.locator('[data-pay-mode="installments"]').click();
    await expect(page.locator("[data-checkout-service]")).toHaveText(
      "Retirement planning",
    );
    await expect(page.locator("[data-checkout-mode]")).toContainText(
      "Installment plan",
    );
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Finish payment preview" }).click();
    await expect(payment).toContainText("No payment was made.");
    await expect(payment.locator("input")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Explore another payment option" })
      .click();
    await page.locator('[data-pay-mode="full"]').click();
    await expect(page.locator("[data-checkout-mode]")).toContainText(
      "One-time payment",
    );
    await page.getByRole("button", { name: "Close payment preview" }).click();
    await expect(payment).not.toBeVisible();
  });
