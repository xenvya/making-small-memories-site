# Client activation

## Current website experience

The selected Keepsake website exposes Payments and Book a consultation in navigation. Payments are collected only through Cash App, Venmo, and Zelle. The payment section names these methods and opens an email draft to request instructions from John. The booking section retains its clearly labeled sample calendar until a live Cal.com link is supplied. No payment is processed or marked complete on the website.

The supplied `docs/john.jpg` portrait has been incorporated on the user’s explicit instruction; personal-photo acquisition is no longer a blocker.

The public site is usable now through John’s verified phone/email. Calendar activation requires a business-owned link. Payment instructions are shared directly after service and amount are agreed. No private API keys are needed for this static site.

## 1. Booking

1. Create/sign in to the business's Cal.com account; connect the appropriate calendar.
2. Create one consultation event. The client must set its actual duration, availability, time zone, location/video method and booking questions. No duration or free-session promise is assumed by the site.
3. Provide its `username/event-slug`. Set `PUBLIC_CAL_LINK` in a local ignored `.env` or the build environment, then rebuild and deploy.

The website then shows a native, keyboard-accessible modal containing Cal.com's inline embed. It loads only after “View appointments” is selected. An ordinary Cal.com link and phone link remain available if the embed is blocked. Escape, close-button and focus restoration are supported. Without configuration, the request form prepares an email draft and explicitly tells visitors that they must send it; it does not pretend to book an appointment or submit an inquiry to a server.

Reference: https://cal.com/help/embedding/embed-instructions

## 2. Payments and packages

Only Cash App, Venmo, and Zelle are accepted. See [Payment instructions](PAYMENTS.md). No recipient handles or QR codes have been supplied; the site does not invent them or treat the contact email/phone as a payment destination.

The PDF has no offers or pricing. Configure `PUBLIC_OFFERS_JSON` only with approved public package names, service scope, service ID, and price labels. Optional installment labels must contain approved terms. All package actions lead to an inquiry with John; payment URLs are no longer part of the schema.

```json
[
  {
    "id": "client-approved-offer-id",
    "name": "CLIENT APPROVED PACKAGE NAME",
    "serviceId": "travel",
    "description": "CLIENT APPROVED SCOPE",
    "fullPriceLabel": "CLIENT APPROVED CURRENCY AND TOTAL"
  }
]
```

This illustrates the schema; do not publish placeholder content. Leave production offers empty until approved.

## 3. Donations

The donation action opens an inquiry with John. Any agreed contribution uses Cash App, Venmo, or Zelle. No nonprofit or tax deduction claim is made.

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
