# Payment instructions

The business accepts **Cash App, Venmo, and Zelle only**, as requested by the owner. Card checkout and Stripe are removed.

## Live website

The Payments section displays the three accepted methods in responsive cards. “Request payment instructions” opens an email draft addressed to John. The FAQ repeats the same payment policy. Customers agree on the service and amount, then receive recipient details directly from John before sending payment.

No payment handles, QR codes, or bank identifiers have been supplied. The public contact email and phone are not assumed to be payment destinations. The site does not collect payment credentials or claim a transfer has been received.

## Business workflow

1. Agree on the service, scope, amount, and any payment schedule with the customer.
2. Share the chosen Cash App, Venmo, or Zelle recipient details and the exact amount.
3. Ask the customer to confirm the recipient before sending.
4. Confirm receipt in the relevant payment account before acknowledging payment.

Approved packages can still be configured through `PUBLIC_OFFERS_JSON`; their actions request arrangements with John. The former hosted checkout URLs and donation URL setting are no longer used.
