# Production domain migration

Verified September 17, 2026 (America/New_York; September 18 UTC).

## Cause and correction

The public domain was delegated to `magali.ns.cloudflare.com` and `ruben.ns.cloudflare.com`, which serve John's active zone. The website's custom domains had instead been attached to an inactive duplicate zone in the Xenvya account, assigned `josh.ns.cloudflare.com` and `rayne.ns.cloudflare.com`. Those nameservers were never authoritative for the registered domain.

The website is now deployed in `Johncurtis.small324@gmail.com's Account` (`e84c719847d85d55e25931925c7c4703`). Both custom domains point to the active zone `81068587767e3cb99e0204aeb3b51d4d` and Worker `making-small-memories-concepts`. The deployment version is `b739ff16-6498-45c0-aec9-ed58f2c5f0ce`.

Registration and public nameservers were not changed. The two obsolete Worker domain attachments were detached from the inactive Xenvya zone (`dc6e5e7bd50d6ffcf54f032fc54ce4ff`). The original Xenvya Worker and unrelated sites were preserved; the inactive zone itself was not deleted.

The account, explicit zone IDs and both custom domains are saved in `wrangler.jsonc`. The default build URL is now `https://makingsmallmemories.com`. A small Worker redirects HTTP and `www` requests permanently to the HTTPS main address, preserving paths and query parameters, then delegates ordinary requests to the static assets binding.

## Verification

- Public DNS resolves the main domain to Cloudflare edge addresses.
- `https://makingsmallmemories.com` returns HTTP 200 with successful certificate verification.
- `https://www.makingsmallmemories.com/privacy?source=domain-check` returns HTTP 301 to `https://makingsmallmemories.com/privacy?source=domain-check`, with a valid certificate.
- Live automated checks also verify HTTP redirects for both hostnames, preserved URL encoding and multiple query parameters, and correct canonical/Open Graph/organization URLs on the homepage and privacy page.
- Lint, Astro checks (zero errors/warnings/hints), production build and Wrangler dry run passed.
- Local browser checks: 22 passed; one public-domain redirect check intentionally skipped on the local Astro preview.
- Production browser checks: all 23 passed, including mobile/tablet/desktop accessibility, logo assets, navigation, travel gallery, booking preview, payment instructions, legacy URLs and 404 behavior.
- The extended production audit found no broken images, bad links, missing anchors or overflow at 320, 390, 768, 1024 and 1920 pixels. Reduced motion was enabled for that audit. Recorded layout shift was below 0.01 on both pages.

## Hosting setting still requiring dashboard access

Cloudflare automatically injects a Web Analytics beacon on the new domain. The existing Content Security Policy blocks that extra script, producing a console error. This does not prevent page rendering, payments inquiries or the consultation preview, but the extended console audit remains failing until the automatic injection is disabled. The policy has not been widened to allow additional tracking.

The deployment OAuth connection can manage Workers and their custom domains, but the Web Analytics API returns HTTP 403. The available browser sessions currently require Cloudflare sign-in.

To finish this hosting-only setting, sign in to John's account in the Cloudflare dashboard, open **Web Analytics**, select **Manage site** for `makingsmallmemories.com`, and set automatic setup to **Disable**. Then rerun `TEST_BASE_URL=https://makingsmallmemories.com node scripts/release-audit.mjs`. No website rebuild is needed for that dashboard setting.

References: [Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Worker-first asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/), [Web Analytics setup](https://developers.cloudflare.com/web-analytics/get-started/).
