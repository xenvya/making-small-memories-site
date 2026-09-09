# QA and release record

Release date: September 8, 2026 (America/New_York).

Live gallery: https://making-small-memories-concepts.xenvya.workers.dev

Direct routes: `/concept-one`, `/concept-two`, `/concept-three`, `/concept-four`, `/concept-five`; shared privacy route `/privacy`; custom 404.

Cloudflare account: Terrance@xenvya.com's Account (`1ebe80039762616a77000dcc7f6b9bda`). Worker: `making-small-memories-concepts`. Final deployed version: `e4770fdb-cec8-430e-b4a7-3c6d8de12cec`. Static HTML/assets deployment succeeded. Public HTTPS routes and response headers verified. No custom-domain DNS or existing Worker was changed.

## Completed checks

- `npm ci`: clean lockfile install passed.
- `npm run lint`: pass.
- `npm run check`: pass; 0 errors, warnings or hints.
- `npm run build`: pass; 8 static HTML pages, no server runtime required.
- `npm run deploy:check`: pass.
- `npm audit`: 0 vulnerabilities (including development tooling).
- `npm test`: 42 local browser scenarios passed.
- `TEST_BASE_URL=https://making-small-memories-concepts.xenvya.workers.dev npm test`: 42 deployed browser scenarios passed.
- `npm run test:integrations`: 11 scenarios passed. Five concepts × 390/1440px verify full-payment and installment URL/package associations, actual Cal.com embed bootstrap with the appointment document intercepted, mobile modal sizing, Escape/close, focus containment and restoration. Additional blocked-script scenario verifies readable fallback and modal accessibility. Synthetic offers are confined to ignored `tmp/activation/`, not `dist/`.
- axe WCAG 2 A/AA and WCAG 2.1 AA audits passed on the gallery, all concepts and privacy at 390, 768 and 1440px. These automated audits supplement visual/keyboard review and are not a formal accessibility certification.
- Responsive screenshot and layout review at 390, 768 and 1440px. Additional overflow checks at 320, 1024 and 1920px. All sections, actual gallery screenshots, typography, navigation, form controls and footers reviewed.
- Real browser checks: mobile menus, Escape, skip link, focus visibility, FAQs, service detail disclosures, service explorer arrow/Home/End keys, field-guide active state, consultation draft feedback, telephone/email links and all internal links/anchors.
- Reduced motion and no-JavaScript content paths passed.
- Public release audit: no console/page errors, broken internal links, invalid section anchors or horizontal overflow. All expected routes return 200; unknown path returns 404.
- Scan found no private keys or credential patterns in site/source/handoff. `docs/`, `proposal/`, `.env`, `.dev.vars`, generated test reports and local screenshots are excluded from Git. Deployment directory contains no source PDFs, contracts, integration fixtures or photo placeholders.

## Performance observations

Detailed machine-readable results: `release-audit.json`. Final unthrottled desktop browser measurements: concept transfer sizes about 138–356 KB; gallery about 338 KB. Observed CLS below 0.01 on all seven audited pages. These are local-agent browser observations against Cloudflare, not Lighthouse scores or field Core Web Vitals data. No mobile-network performance claim is implied.

Golden Hour replaces The Next Chapter. Living Moments adds canvas particles, scroll-responsive portrait and lettering, animated headline entrance and a service range explorer. Tests verify the canvas changes during animation, Pause clears it, keyboard service selection works and reduced motion stops portrait transforms. Appointment and payment preview walkthroughs pass on all five concepts at 390 and 1440px, including modal axe checks, selection/review/back, Escape and focus restoration. Modal headings have explicit sizes to prevent theme display typography from overwhelming small screens.

## Scope and limitations

- Browser plugin discovery found no connected browser; standalone Playwright Chromium provided local and deployed QA. Physical iOS/Android devices, Safari/WebKit and Firefox were not tested.
- No production Stripe links, commercial terms or business-owned Cal.com event URL were supplied. Therefore no live payment, refund, notification, calendar availability or actual appointment was verified. These depend on client activation.
- No real message, charge or booking was sent during QA. The inquiry form opens a draft in the visitor's mail app; final email delivery depends on their mail client and requires them to send it.
- The user supplied and explicitly requested use of the portrait of John C. Small Jr. and Veronica Kouassi Small. Optimized 1118px and 600px WebP variants are published across all five concepts. No Facebook images were fetched or substituted. See IMAGERY.md for provenance.
- Booking dates/times are explicitly sample availability; payment previews collect no card details and create no charges. Production activation remains separate from these interactive demonstrations.
- The condensed privacy policy retains supplied substance while omitting an unrelated company name. Client confirmation of the policy's applicability remains necessary.

Local visual evidence is in the ignored `handoff/screenshots/` folder. Reproduce via `scripts/screenshots.mjs` or `scripts/release-audit.mjs`.
