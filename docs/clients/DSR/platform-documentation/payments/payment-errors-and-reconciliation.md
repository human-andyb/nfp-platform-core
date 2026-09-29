# Payment Errors and Reconciliation

## Error sources

| Layer | Error type | Handling pattern | Evidence |
|---|---|---|---|
| Payment intent creation flow | Invalid provider | Returns HTTP 400 with error payload | [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L463) |
| Client payment UI | confirmPayment/confirmSetup errors | Displays error summary; keeps user on page | [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L846), [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L884) |
| Payment webhook | payment_intent.payment_failed | Updates attempt failure details and acceptance status Failed | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540) |
| Router/polling | Session readiness delay | Time-bounded polling with timeout panel | [sections--payment-preparing.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html#L80) |

## Reconciliation mechanisms

### PaymentIntent branch
- Uses Stripe event ID and payment intent ID to locate local transaction records.
- Uses event-type switch to set canonical attempt statuses.
- Writes event ID to transaction to reduce duplicate processing.

Evidence:
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L429)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L507)

### SetupIntent branch
- On setup_intent.succeeded, retrieves payment method details from Stripe.
- Upserts stripe payment method and links to customer/contact.
- Creates acceptance agreement and payment schedule, then marks acceptance complete for recurring setup.

Evidence:
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L133)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L638)

## Retry and idempotency behavior
- Attempt numbers increment based on existing transaction rows for acceptance.
- Duplicate event guard exists for payment webhook via event ID lookup.
- Status validation flow uses bounded until-loop to wait for converged state.

Evidence:
- [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L305)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L429)
- [Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L501)

## Reconciliation gaps to address
- No explicit refund/dispute reconciliation flows found.
- No explicit webhook dead-letter workflow found in exported flows.
- Setup-intent webhook relies on event type check but does not visibly re-fetch event by ID for verification.
