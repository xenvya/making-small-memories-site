# QA and release record

Release date: September 13, 2026 (America/New_York).

Live website: https://making-small-memories-concepts.xenvya.workers.dev

Direct routes: selected Keepsake homepage `/`, privacy route `/privacy`, and custom 404. The retired `/concept-one` through `/concept-five` routes permanently redirect to `/`.

Cloudflare account: Terrance@xenvya.com's Account (`1ebe80039762616a77000dcc7f6b9bda`). Worker: `making-small-memories-concepts`. Static HTML/assets deployment targets the existing Worker. No custom-domain DNS or unrelated Worker is changed.

## Completed checks

- `npm ci`: clean lockfile install passed.
- `npm run lint`: pass.
- `npm run check`: pass; 0 errors, warnings or hints.
- `npm run build`: pass; 3 content pages plus 5 redirect documents, no server runtime required.
- `npm run deploy:check`: pass.
- `npm audit`: 0 vulnerabilities (including development tooling).
- `npm test`: 20 local browser scenarios passed, covering the selected homepage and privacy route, the 33-photo travel gallery and keyboard lightbox, five legacy redirects, brand lockup, approved external links, and booking/payment walkthroughs.
- `npm run test:integrations`: 3 scenarios passed. The selected homepage at 390/1440px verifies full-payment and installment URL/package associations, actual Cal.com embed bootstrap with the appointment document intercepted, modal sizing, Escape/close, focus containment and restoration. The additional blocked-script scenario verifies readable fallback and modal accessibility. Synthetic offers are confined to ignored `tmp/activation/`, not `dist/`.
- axe WCAG 2 A/AA and WCAG 2.1 AA audits passed on the homepage and privacy route at 390, 768 and 1440px. These automated audits supplement visual/keyboard review and are not a formal accessibility certification.
- Responsive screenshot and layout review at 390, 768 and 1440px. Additional overflow checks at 320, 1024 and 1920px. All homepage sections, typography, navigation, form controls and footers were reviewed.
- Real browser checks: mobile menu, Escape, skip link, focus visibility, FAQs, service detail disclosures, travel-gallery expansion and focus restoration, consultation draft feedback, telephone/email/Facebook/VA.org links and all internal links/anchors.
- Reduced motion and no-JavaScript content paths passed.
- Public release audit: no console/page errors, broken images, broken internal links, invalid section anchors or horizontal overflow. All expected routes return 200; unknown path returns 404. All 33 gallery thumbnails were expanded, loaded and decoded during the audit.
- Scan found no private keys or credential patterns in site/source/handoff. `docs/`, `proposal/`, `.env`, `.dev.vars`, generated test reports and local screenshots are excluded from Git. Deployment directory contains no source PDFs, contracts, integration fixtures or photo placeholders.

## Performance observations

Detailed machine-readable results are stored in `release-audit.json`. The final local unthrottled audit measured approximately 2.3 MB transferred for the homepage after deliberately expanding and loading all 33 gallery thumbnails, and 39 KB for privacy, with observed CLS below 0.008. Normal initial loading defers photographs outside the opening eight. These are local-agent browser observations, not Lighthouse scores or field Core Web Vitals data. No mobile-network performance claim is implied.

## Scope and limitations

- Browser plugin discovery found no connected browser; standalone Playwright Chromium provided local and deployed QA. Physical iOS/Android devices, Safari/WebKit and Firefox were not tested.
- No production Stripe links, commercial terms or business-owned Cal.com event URL were supplied. Therefore no live payment, refund, notification, calendar availability or actual appointment was verified. These depend on client activation.
- No real message, charge or booking was sent during QA. The inquiry form opens a draft in the visitor's mail app; final email delivery depends on their mail client and requires them to send it.
- The user supplied and explicitly requested use of the portrait of John C. Small Jr. and Veronica Kouassi Small. Optimized transparent 1086px and 600px WebP variants are published on the selected homepage. No Facebook images were fetched or substituted. See IMAGERY.md for provenance.
- The user supplied and explicitly requested publication of all 33 photographs under `docs/images-to-use/`. The gallery publishes 66 responsive WebP exports with no EXIF, IPTC or XMP metadata; the original files remain excluded from deployment.
- Booking dates/times are explicitly sample availability; payment previews collect no card details and create no charges. Production activation remains separate from these interactive demonstrations.
- The condensed privacy policy retains supplied substance while omitting an unrelated company name. Client confirmation of the policy's applicability remains necessary.

Local visual evidence is in the ignored `handoff/screenshots/` folder. Reproduce via `scripts/screenshots.mjs` or `scripts/release-audit.mjs`.

## Payment methods update — September 17, 2026

Replaced the payment preview and hosted checkout configuration with Cash App, Venmo, and Zelle method cards and an email action requesting payment instructions. Package inquiries and donations also route through John. This supersedes the earlier payment-preview and hosted-payment activation notes above.

Validation: Astro check (zero diagnostics), production build, formatting, 20 browser tests, 3 integration scenarios, deployment dry run, and visual review of desktop and 390px payment-section screenshots all passed. No live transfers were attempted; recipient details are shared directly by John.
