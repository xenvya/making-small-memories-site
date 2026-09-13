# Client activation

## Current website experience

The selected Keepsake website exposes Payments and Book a consultation in navigation. With live links absent, the booking section opens an interactive sample calendar with service/day/time choices and review; the payments section opens a Stripe-style visual walkthrough with full-payment/installment selection and service association. These are expressly labeled previews. No sensitive data is collected, notification sent, real appointment reserved, price invented, or payment made. Contact links remain available for real inquiries. Supplying the live configuration below activates the existing real Cal.com and hosted-payment paths.

The supplied `docs/john.jpg` portrait has been incorporated on the user’s explicit instruction; personal-photo acquisition is no longer a blocker.

The public site is usable now through John’s verified phone/email. Calendar and payment activation require business-owned links and approved terms. No private API keys are needed for this static site.

## 1. Booking

1. Create/sign in to the business's Cal.com account; connect the appropriate calendar.
2. Create one consultation event. The client must set its actual duration, availability, time zone, location/video method and booking questions. No duration or free-session promise is assumed by the site.
3. Provide its `username/event-slug`. Set `PUBLIC_CAL_LINK` in a local ignored `.env` or the build environment, then rebuild and deploy.

The website then shows a native, keyboard-accessible modal containing Cal.com's inline embed. It loads only after “View appointments” is selected. An ordinary Cal.com link and phone link remain available if the embed is blocked. Escape, close-button and focus restoration are supported. Without configuration, the request form prepares an email draft and explicitly tells visitors that they must send it; it does not pretend to book an appointment or submit an inquiry to a server.

Reference: https://cal.com/help/embedding/embed-instructions

## 2. Payments and packages

The PDF has **no offers or pricing**. Supply for every approved offer:

- Public package name and exact service scope.
- Applicable service ID: `travel`, `coaching`, `benefits`, `retirement` or `investment`.
- Currency, total price and approved displayed payment-in-full label.
- A finalized Stripe-hosted payment-in-full link.
- If installments apply: total owed, amount and count of payments, frequency, first-payment timing, any fees, and approved displayed installment label.
- A finalized Stripe-hosted installment URL whose underlying billing arrangement matches those finite terms.

Configure `PUBLIC_OFFERS_JSON` as a JSON array at build time. Field schema is in `src/data/offers.ts`:

```json
[
  {
    "id": "client-approved-offer-id",
    "name": "CLIENT APPROVED PACKAGE NAME",
    "serviceId": "travel",
    "description": "CLIENT APPROVED SCOPE",
    "fullPriceLabel": "CLIENT APPROVED CURRENCY AND TOTAL",
    "fullPaymentUrl": "",
    "installmentLabel": "CLIENT APPROVED COMPLETE INSTALLMENT TERMS",
    "installmentUrl": ""
  }
]
```

This is a schema illustration, not a business offer; never publish the uppercase instruction text. Empty production configuration is intentional. Omit installment fields entirely where no plan is offered. Once approved content is added, it appears in the Working Together section. Full-payment and installment CTAs are associated with the same package. If a package is approved before its link is ready, its CTA routes to an inquiry; no dead payment button appears.

Only HTTPS links on `buy.stripe.com` and `checkout.stripe.com` are accepted. Invalid configured payment destinations fail the build. Stripe collects payment details on its own hosted pages; the site has no card form, checkout backend, API secrets, webhook storage or payment-success claim. Do not paste secret keys or private session data into public configuration.

Use durable Payment Links for approved one-time offers. A generic recurring subscription Payment Link is **not** automatically a finite installment plan. The client's Stripe setup must enforce the approved end/count; an ephemeral Checkout Session URL also needs a service that issues fresh sessions rather than being permanently reused. Until the business supplies a finalized arrangement, keep the installment URL empty and use the inquiry fallback. No unapproved recurring billing is created by this site.

Reference: https://docs.stripe.com/payment-links

## 3. Donations

Supply an approved donation purpose and business-owned Stripe Payment Link. Set `PUBLIC_STRIPE_DONATION_URL`, rebuild, and deploy. Confirm donor-facing receipts/wording in Stripe. The current experience offers a direct donation inquiry and makes no nonprofit or tax deduction claim.

## 4. Personal story and imagery

Supply an approved short biography, approved testimonials with attribution/permission, and any additional photographs specified in `IMAGERY.md`. Veronica Kouassi Small's preferred public name was supplied after the source PDF and is used with the approved couple's photograph on the selected homepage. Approve the business identity and insurance/healthcare language in the privacy policy before final public launch.

## 5. Build and deployment

```sh
cp .env.example .env
# Enter public approved values in .env.
npm ci
npm run check
npm run lint
npm run build
npm test
npm run deploy:check
npm run deploy
```

The account is `Terrance@xenvya.com's Account`, Worker `making-small-memories-concepts`. Static assets are built into `dist/`; no client source PDFs, contracts, handoff documents or test fixtures are served. Existing unrelated Workers are untouched. An invalid inherited `CLOUDFLARE_API_TOKEN` masked a working local OAuth session during setup; when that situation applies, use:

```sh
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_API_KEY npm run deploy
```

Use a valid scoped token for unattended CI instead. Do not commit it. `PUBLIC_SITE_URL` can change canonical/social URLs when the final domain is selected. Configuration changes require a rebuild because the site is static. No custom-domain DNS was changed.
