# Production domain migration

Verified September 17, 2026 (America/New_York; September 18 UTC).

## Cause and correction

The public domain was delegated to `magali.ns.cloudflare.com` and `ruben.ns.cloudflare.com`, which serve John's active zone. The website's custom domains had instead been attached to an inactive duplicate zone in the Xenvya account, assigned `josh.ns.cloudflare.com` and `rayne.ns.cloudflare.com`. Those nameservers were never authoritative for the registered domain.

The website is now deployed in `Johncurtis.small324@gmail.com's Account` (`e84c719847d85d55e25931925c7c4703`). Both custom domains point to the active zone `81068587767e3cb99e0204aeb3b51d4d` and Worker `making-small-memories-concepts`. The current customer-domain deployment version is `581b3b3c-4b01-4b68-ace4-ac77760d1c51`.

The review mirror at `https://making-small-memories-concepts.xenvya.workers.dev` is also active at version `97d9c613-0f45-408f-918d-fddfc4e16a5c`. It uses the Xenvya account and a separate route-free configuration in `wrangler.xenvya.jsonc`, so updating the review mirror cannot change John's custom domains.

Registration and public nameservers were not changed. The two obsolete Worker domain attachments were detached from the inactive Xenvya zone (`dc6e5e7bd50d6ffcf54f032fc54ce4ff`). The original Xenvya Worker and unrelated sites were preserved; the inactive zone itself was not deleted.

The account, explicit zone IDs and both custom domains are saved in `wrangler.jsonc`. The default build URL is now `https://makingsmallmemories.com`. A small Worker redirects HTTP and `www` requests permanently to the HTTPS main address, preserving paths and query parameters, then delegates ordinary requests to the static assets binding.

## Verification

- Public DNS resolves the main domain to Cloudflare edge addresses.
- `https://makingsmallmemories.com` returns HTTP 200 with successful certificate verification.
- `https://www.makingsmallmemories.com/privacy?source=domain-check` returns HTTP 301 to `https://makingsmallmemories.com/privacy?source=domain-check`, with a valid certificate.
- Live automated checks also verify HTTP redirects for both hostnames, preserved URL encoding and multiple query parameters, and correct canonical/Open Graph/organization URLs on the homepage and privacy page.
- Lint, Astro checks (zero errors/warnings/hints), production build and Wrangler dry run passed.
- Local browser checks: 22 passed; one public-domain redirect check intentionally skipped on the local Astro preview.
- Production browser checks: all 23 passed, including mobile/tablet/desktop accessibility, logo assets, navigation, travel gallery, live booking, donations, invoice-billing guidance, legacy URLs and 404 behavior.
- The final extended production audit passed with no console errors, broken images, bad links, missing anchors or overflow at 320, 390, 768, 1024 and 1920 pixels. Reduced motion was enabled for that audit. Recorded layout shift was below 0.01 on both pages. Current results are saved in `handoff/release-audit.json`.

## Hosting performance monitoring

Cloudflare's free-plan Real User Measurements (RUM) automatically injected a performance beacon on the new domain. The existing Content Security Policy blocked that extra script, producing a console error. Automatic RUM was disabled for this zone in John's dashboard under **Speed → Real user monitoring → Disable completely**, and the dashboard confirmed **RUM is currently disabled for this zone**. The security policy was preserved.

After the hosting configuration propagated, public HTML no longer contained the beacon and the repeated production audit confirmed clean browser consoles on both pages. No domain activation steps remain.

The deployment OAuth connection can manage Workers and their custom domains, but the Web Analytics API returns HTTP 403. The client signed in to the dashboard through the invited `terrance@xenvya.com` user, whose accepted membership in John's account was independently verified through the Cloudflare API. No permissions or credentials were changed.

This hosting setting does not require a rebuild and can be re-enabled in the same dashboard. The Worker Logs and Traces settings remain enabled in `wrangler.jsonc`; visitor performance measurement is separate from server-side operational logging.

References: [Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Worker-first asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/), [Web Analytics setup](https://developers.cloudflare.com/web-analytics/get-started/).
