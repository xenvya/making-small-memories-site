# Making Small Memories

A complete static Astro website with an editorial single-page experience, verified business content, Cash App, Venmo, and Zelle payment instructions, and an on-demand Cal.com booking modal.

**Live website:** https://making-small-memories-concepts.xenvya.workers.dev

The selected Keepsake direction is served directly at `/`. Legacy concept URLs permanently redirect to the homepage.

## Run

Use Node 22.12+ or 24+ and npm.

```sh
npm ci
npm run dev
```

## Validate

```sh
npx playwright install chromium
npm run lint
npm run check
npm run build
npm test
npm run test:integrations
npm run deploy:check
npm audit
```

`npm test` runs browser scenarios including WCAG A/AA checks at mobile/tablet/desktop sizes, navigation, the 33-photo travel gallery and keyboard lightbox, inquiries, FAQs, approved external resources, legacy redirects, and no-JavaScript fallback. `TEST_BASE_URL` switches the same suite to the deployed site. The integration harness builds synthetic offers/calendar data only into ignored `tmp/activation/`, checks the real Cal.com embed bootstrap with the appointment page intercepted, checks package/payment associations and modal keyboard behavior, and tests blocked-embed fallback. It never creates a real booking or charge and cannot publish its fixtures through the production `dist/` target.

```sh
TEST_BASE_URL=https://making-small-memories-concepts.xenvya.workers.dev npm test
TEST_BASE_URL=https://making-small-memories-concepts.xenvya.workers.dev node scripts/release-audit.mjs
```

The release audit checks all internal links and section anchors, console errors, five additional viewport widths, and records unthrottled browser LCP/CLS/transfer measurements in `handoff/release-audit.json`. These are observed measurements, not a Lighthouse score. `node scripts/screenshots.mjs` captures full responsive homepage and privacy-page screenshots. Full QA screenshots are local, ignored artifacts.

## Architecture

- `src/data/business.ts`: source-backed mission, audience, services, contact and FAQs.
- `src/data/travelPhotos.json`: ordered source manifest and accessible descriptions for the travel gallery.
- `src/data/offers.ts`: typed offer configuration; no invented offers.
- `src/pages/index.astro`: the selected Keepsake homepage.
- `src/components/`: shared semantic navigation, services, process, FAQs, payments, booking and footer.
- `src/styles/`: shared accessible foundations and independent creative systems.
- `src/scripts/site.ts`: progressive enhancement with no front-end framework runtime.
- `public/`: only public web assets, response headers and crawl instructions.
- `wrangler.jsonc`: Cloudflare Workers Static Assets deployment; no dynamic backend or database.

Fonts are self-hosted. The homepage portrait and travel gallery are delivered as optimized, metadata-free WebP assets; rerun `npm run images:travel` after changing the gallery source manifest or files. Each route is prerendered HTML and remains readable without JavaScript. Booking loads no third-party code until the visitor opens the calendar. No analytics, browser-storage tracking, or card collection code has been added.

## Client activation and evidence

- [Activation instructions](handoff/ACTIVATION.md)
- [Invoice-first payment plan](handoff/PAYMENTS.md)
- [Source audit and missing material](handoff/CONTENT-AUDIT.md)
- [Photography requirements and artwork provenance](handoff/IMAGERY.md)
- [QA and deployment record](handoff/QA.md)

The six-page source PDF contains no package prices, installment terms, testimonials, biography or booking URL. The user subsequently supplied and authorized the portrait used on the homepage. The live experience offers verified services, contact and pricing inquiries, accepted payment methods, plus an explicitly labeled interactive appointment preview. It intentionally does not show invented offers or testimonials. Personal-photo layout references are documented in `handoff/images/`, outside the public assets.

The local client `docs/` and `proposal/` directories are excluded from Git and never deployed. No pre-existing code, Git history, dependency conventions or deployment existed when this work began; the GitHub repository was confirmed empty before initialization. Existing local documents were preserved.

## Deployment

```sh
npm run build
npm run deploy
```

Cloudflare account: `1ebe80039762616a77000dcc7f6b9bda`; Worker: `making-small-memories-concepts`. This publishes only `dist/`. No custom domain or unrelated Worker is changed. Build configuration is described in `.env.example`; all `PUBLIC_*` values are public and must never contain secrets. The selected homepage uses `index, follow`; the custom 404 remains `noindex, follow`.

The `sharp` override ensures the Wrangler/Miniflare dependency uses the patched 0.35.4+ image library. The production site is static and has no image-processing endpoint. Keep the lockfile committed for reproducible installs.
