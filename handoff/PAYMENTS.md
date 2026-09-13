# Invoice-first payment plan

Status: recommended future activation flow; no live payment method is configured by this document.

## Recommendation

Because the services do not yet have approved public prices, Making Small Memories should use an invoice-first flow instead of publishing open-ended payment handles on the homepage.

The homepage may state that cards, Cash App, Venmo and Zelle are accepted. A customer should receive the actual payment options only after the service, amount, deposit terms and cancellation policy have been agreed upon.

## Customer flow

1. The customer completes a consultation or requests a specific service.
2. Making Small Memories creates an invoice containing the service, exact amount due, due date, cancellation/refund terms and a unique reference such as `MSM-1042`.
3. The customer receives a business-owned payment page or invoice with these choices:
   - Card or Cash App Pay through hosted Stripe Checkout, when the Stripe account and business category are eligible.
   - Venmo through the verified Making Small Memories Venmo Business Profile.
   - Zelle through a Zelle-enabled business bank account.
4. Venmo and Zelle instructions repeat the exact amount, verified recipient name and invoice reference. The customer is asked to include only the reference in the payment memo.
5. A direct-transfer customer can report that payment was sent, but the business confirms payment only from the provider account or bank ledger. A screenshot is never treated as proof of payment.
6. Once funds are verified, Making Small Memories marks the invoice paid and sends its own receipt or confirmation.

## Website arrangement

- Keep one primary action: **Pay an invoice**.
- Show accepted-payment-method names near that action without exposing personal accounts.
- On the invoice payment page, make Stripe the primary hosted checkout and list Venmo Business and Zelle Business as alternatives.
- Present one verified QR code or provider link at a time, alongside the recipient's business display name, amount and reference.
- Clearly distinguish **Payment submitted** from **Payment confirmed**.
- Place cancellation, refund and contact information beside the payment choices.
- Preserve a readable fallback for customers who cannot scan a QR code.

The public site must never collect card or bank credentials directly. Stripe-hosted checkout remains responsible for card and eligible Cash App Pay details.

## Provider setup

### Stripe and Cash App Pay

Prefer enabling Cash App Pay within the existing Stripe-hosted Checkout or Payment Link flow. This keeps the amount, payment status, refunds and records in the same system as card payments.

Stripe currently lists financial services among the prohibited categories for Cash App Pay. Because this website describes retirement planning and investment education, Making Small Memories must obtain a clear eligibility determination from Stripe before Cash App Pay is enabled. A separate Cash App Business Account should be used only if Cash App approves the business and its use; it must not be used to bypass another provider's restriction.

Official references:

- [Stripe: Cash App Pay payments](https://docs.stripe.com/payments/cash-app-pay)
- [Cash App Business Terms](https://cash.app/us/en/legal/cash-payment-terms)

### Venmo

Create and verify a Venmo Business Profile for Making Small Memories. Use its business-profile URL and official business QR code; do not publish or accept commercial payments through a personal profile. Refunds should be initiated from the original Venmo business transaction so they remain associated with the payment.

Official references:

- [Venmo: Business Profiles FAQ](https://help.venmo.com/cs/articles/business-profiles-faq-vhel143)
- [Venmo: QR codes for Business Profiles](https://help.venmo.com/cs/articles/qr-codes-for-business-profiles-vhel305)
- [Venmo: Business Profile transaction fees](https://help.venmo.com/cs/articles/business-profile-transaction-fees-vhel221)

### Zelle

Confirm that the company's bank offers Zelle for its specific business account type. Use a dedicated business email address, business telephone number or eligible Zelle tag. The website should show the exact recipient name customers must verify before sending. Limits, fees and Zelle-tag availability are determined by the financial institution.

Official references:

- [Zelle: Small business FAQ](https://www.zellepay.com/faq/small-business-using-zelle)
- [Zelle: Tags for eligible small businesses](https://www.zellepay.com/faq/i-was-asked-send-money-zelle-tag-small-business)

## Reconciliation and safeguards

- Maintain one ledger entry per invoice: customer, service, amount, method, provider transaction ID, received date, fee, net amount and refund status.
- Verify every payment inside Stripe, Venmo or the business bank account—not through an email, text message or screenshot.
- Refund to the original payment method and original payer. Do not redirect an alleged overpayment to another account.
- Use a dedicated business email address and telephone number for public payment identifiers.
- Do not place account credentials, private banking details, API keys or personal account identifiers in the repository.
- Review provider fees, limits, terms, tax treatment and business eligibility at activation and periodically afterward because they can change.

## Information required before implementation

- Approved services, prices, deposit amounts, due dates and installment rules.
- Final cancellation and refund policy.
- Live Stripe Payment Links or Checkout configuration and Cash App Pay eligibility confirmation.
- Verified Venmo Business Profile URL, official QR export and exact business display name.
- Zelle-enabled business account confirmation, public business email/phone or Zelle tag, official bank-generated QR code if available, and exact recipient display name.
- The staff member or bookkeeping system responsible for reconciliation and receipts.

Only public payment destinations and approved QR assets should be shared for implementation. Login credentials, bank-account credentials and API secrets must not be sent or committed.
