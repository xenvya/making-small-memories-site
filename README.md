# Making Small Memories

A complete static Astro website with an editorial single-page experience, verified business content, Cash App donations, invoice-first service billing, and an on-demand Cal.com booking modal.

**Live website:** https://makingsmallmemories.com

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
npm run deploy:concept:check
npm audit
```

`npm test` runs browser scenarios including WCAG A/AA checks at mobile/tablet/desktop sizes, navigation, the live Cal.com booking entry and fallback, the donation and invoice-billing journey, the 33-photo travel gallery and keyboard lightbox, FAQs, approved external resources, legacy redirects, and no-JavaScript fallback. `TEST_BASE_URL` switches the same suite to the deployed site. The integration harness builds synthetic offers/calendar data only into ignored `tmp/activation/`, checks the real Cal.com embed bootstrap with the appointment page intercepted, checks package/invoice inquiry associations and modal keyboard behavior, and tests blocked-embed fallback. It never creates a real booking, invoice, donation, or charge and cannot publish its fixtures through the production `dist/` target.

```sh
TEST_BASE_URL=https://makingsmallmemories.com npm test
TEST_BASE_URL=https://makingsmallmemories.com node scripts/release-audit.mjs
```

The release audit checks all internal links and section anchors, console errors, five additional viewport widths, and records unthrottled browser LCP/CLS/transfer measurements in `handoff/release-audit.json`. These are observed measurements, not a Lighthouse score. `node scripts/screenshots.mjs` captures full responsive homepage and privacy-page screenshots. Full QA screenshots are local, ignored artifacts.

## Architecture

- `src/data/business.ts`: source-backed mission, audience, services, contact and FAQs.
- `src/data/travelPhotos.json`: ordered source manifest and accessible descriptions for the travel gallery.
- `src/data/offers.ts`: typed offer configuration; no invented offers.
- `src/pages/index.astro`: the selected Keepsake homepage.
- `src/components/`: shared semantic navigation, services, process, FAQs, donations, booking and footer.
- `src/styles/`: shared accessible foundations and independent creative systems.
- `src/scripts/site.ts`: progressive enhancement with no front-end framework runtime.
- `public/`: only public web assets, response headers and crawl instructions.
- `wrangler.jsonc`: Cloudflare Workers deployment to John's account and active domain zone.
- `worker/main.mjs`: permanent HTTPS and `www` redirects, preserving paths and query parameters, followed by static asset serving. No database or form backend.

Fonts are self-hosted. The homepage portrait and travel gallery are delivered as optimized, metadata-free WebP assets; rerun `npm run images:travel` after changing the gallery source manifest or files. Each route is prerendered HTML and remains readable without JavaScript. Booking loads no third-party code until the visitor opens the calendar. No analytics, browser-storage tracking, or card collection code has been added.

## Client activation and evidence

- [Activation instructions](handoff/ACTIVATION.md)
- [Invoices and donations](handoff/PAYMENTS.md)
- [Source audit and missing material](handoff/CONTENT-AUDIT.md)
- [Photography requirements and artwork provenance](handoff/IMAGERY.md)
- [QA and deployment record](handoff/QA.md)
- [Production domain migration and verification](handoff/DOMAIN-MIGRATION.md)

The six-page source PDF contains no package prices, installment terms, testimonials, biography or booking URL. The user subsequently supplied and authorized the portrait used on the homepage, the Cal.com event at `making-small-memories-llc/15min`, and the Cash App donation profile at `$MSMllcJCSVKS`. The live experience offers verified services, contact and pricing inquiries, invoice-first service billing, voluntary donations, and a live appointment calendar. It intentionally does not show invented offers or testimonials. Personal-photo layout references are documented in `handoff/images/`, outside the public assets.

The local client `docs/` and `proposal/` directories are excluded from Git and never deployed. No pre-existing code, Git history, dependency conventions or deployment existed when this work began; the GitHub repository was confirmed empty before initialization. Existing local documents were preserved.

## Deployment

```sh
npm run build
npm run deploy
```

Cloudflare account: `Johncurtis.small324@gmail.com's Account` (`e84c719847d85d55e25931925c7c4703`); Worker: `making-small-memories-concepts`. Both `makingsmallmemories.com` and `www.makingsmallmemories.com` are declared as custom domains in the active zone `81068587767e3cb99e0204aeb3b51d4d`. Its public nameservers are `magali.ns.cloudflare.com` and `ruben.ns.cloudflare.com`. Registration and nameservers remain in John's account. The customer-facing deployment uses `wrangler.jsonc`.

The same production build is mirrored at `https://making-small-memories-concepts.xenvya.workers.dev` in the Xenvya account for review. That hostname displays a compact concept-preview notice linking to the live customer website and applies its own blue color system; both stay inactive on the customer domain. The mirror deployment uses `wrangler.xenvya.jsonc` and has no custom-domain routes. Run `npm run deploy:concept` after the customer-domain deployment whenever both public addresses should remain synchronized.

Only `dist/` and the small redirect Worker are published. The main address is `https://makingsmallmemories.com`; `www` and HTTP requests redirect permanently to HTTPS on that address. Build configuration is described in `.env.example`; all `PUBLIC_*` values are public and must never contain secrets. The default `PUBLIC_SITE_URL` now uses the custom domain for canonical, Open Graph and structured-data URLs. The selected homepage uses `index, follow`; the custom 404 remains `noindex, follow`. Unrelated Workers are untouched.

The `sharp` override ensures the Wrangler/Miniflare dependency uses the patched 0.35.4+ image library. The production site is static and has no image-processing endpoint. Keep the lockfile committed for reproducible installs.
