# Making Small Memories — five website concepts

A complete static Astro project with five deliberately different single-page creative directions, a screenshot-based concept gallery, shared verified business content, configurable Stripe-hosted payment links, and an on-demand Cal.com booking modal.

**Live gallery:** https://making-small-memories-concepts.xenvya.workers.dev

| Route | Direction | Strategy |
| --- | --- | --- |
| `/concept-one` | The Keepsake | Warm literary editorial, a collected-paper composition, intimate tone for individuals and families |
| `/concept-two` | Open Horizon | Ocean blue, original scenic artwork, keyboard-accessible service explorer, restrained scenic depth |
| `/concept-three` | Field Notes | Olive and parchment, original topographic drawing, sticky service guide with scroll-aware location |
| `/concept-four` | Golden Hour | Aubergine, gold, arched portraiture, animated linework and interactive life-direction choices |
| `/concept-five` | Living Moments | Responsive canvas, headline entrance, scroll-driven typography/photo movement, and a draggable service journey |

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

`npm test` runs 42 browser scenarios, including WCAG A/AA checks at mobile/tablet/desktop sizes, navigation, inquiries, FAQs, service-tab keyboard controls, the field guide, reduced motion and no-JavaScript fallback. `TEST_BASE_URL` switches the same suite to the deployed site. The integration harness builds synthetic offers/calendar data only into ignored `tmp/activation/`, checks the real Cal.com embed bootstrap with the appointment page intercepted, checks package/payment associations and modal keyboard behavior, and tests blocked-embed fallback. It never creates a real booking or charge and cannot publish its fixtures through the production `dist/` target.

```sh
TEST_BASE_URL=https://making-small-memories-concepts.xenvya.workers.dev npm test
TEST_BASE_URL=https://making-small-memories-concepts.xenvya.workers.dev node scripts/release-audit.mjs
```

The release audit checks all internal links and section anchors, console errors, five additional viewport widths, and records unthrottled browser LCP/CLS/transfer measurements in `handoff/release-audit.json`. These are observed measurements, not a Lighthouse score. `node scripts/screenshots.mjs` captures full responsive screenshots and updates the gallery preview images. Full QA screenshots are local, ignored artifacts.

## Architecture

- `src/data/business.ts`: source-backed mission, audience, services, contact, FAQs and concept rationales.
- `src/data/offers.ts`: typed offer configuration and hosted-URL validation; no invented offers.
- `src/pages/concept-*.astro`: five separately composed creative proposals.
- `src/components/`: shared semantic navigation, services, process, FAQs, payments, booking and footer.
- `src/styles/`: shared accessible foundations and independent creative systems.
- `src/scripts/site.ts`: progressive enhancement with no front-end framework runtime.
- `public/`: only public web assets, response headers and crawl instructions.
- `wrangler.jsonc`: Cloudflare Workers Static Assets deployment; no dynamic backend or database.

Fonts are self-hosted. The generated coastal image is responsive WebP. Each route is prerendered HTML and remains readable without JavaScript. Booking loads no third-party code until the visitor opens the calendar. No analytics, browser-storage tracking, or card collection code has been added.

## Client activation and evidence

- [Activation instructions](handoff/ACTIVATION.md)
- [Source audit and missing material](handoff/CONTENT-AUDIT.md)
- [Photography requirements and artwork provenance](handoff/IMAGERY.md)
- [QA and deployment record](handoff/QA.md)

The six-page source PDF contains no package prices, installment terms, testimonials, biography or booking URL. The user subsequently supplied and authorized the portrait now used in all five designs. The live experience offers verified services, contact and pricing inquiries, plus explicitly labeled interactive appointment and payment previews. It intentionally does not show invented offers, testimonials or disguised portrait substitutes. Personal-photo layout placeholders are documented in `handoff/images/`, outside the public assets.

The local client `docs/` and `proposal/` directories are excluded from Git and never deployed. No pre-existing code, Git history, dependency conventions or deployment existed when this work began; the GitHub repository was confirmed empty before initialization. Existing local documents were preserved.

## Deployment

```sh
npm run build
npm run deploy
```

Cloudflare account: `1ebe80039762616a77000dcc7f6b9bda`; Worker: `making-small-memories-concepts`. This publishes only `dist/`. No custom domain or unrelated Worker is changed. Build configuration is described in `.env.example`; all `PUBLIC_*` values are public and must never contain secrets. Proposal routes intentionally have `noindex, follow` until a final site/design is selected.

The `sharp` override ensures the Wrangler/Miniflare dependency uses the patched 0.35.4+ image library. The production site is static and has no image-processing endpoint. Keep the lockfile committed for reproducible installs.
