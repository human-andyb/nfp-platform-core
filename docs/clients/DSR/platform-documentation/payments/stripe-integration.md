# Stripe Integration

## Integration surfaces

| Surface | Direction | Purpose | Evidence |
|---|---|---|---|
| Stripe Payment Intents API | Outbound | Create one-off payment intents | [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L338) |
| Stripe Customers API | Outbound | Create Stripe customer for recurring setup | [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L335) |
| Stripe Setup Intents API | Outbound | Create setup intent for recurring payment method capture | [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L454) |
| Stripe Payment Methods API | Outbound | Enrich payment method details after setup_intent.succeeded | [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L133) |
| Stripe Events API | Outbound verification | Retrieve event payload by event ID in payment-intent webhook flow | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L139) |
| Stripe webhook receiver (payment intent) | Inbound | Receive payment_intent lifecycle events | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L46) |
| Stripe webhook receiver (setup intent) | Inbound | Receive setup_intent.succeeded for recurring setup finalization | [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L94) |

## Stripe metadata usage
Payment intent metadata includes acceptance and attempt context:
- acceptanceId
- clientToken
- attemptNumber

Evidence:
- [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L428)

Setup intent metadata includes:
- acceptanceId
- frequency

Evidence:
- [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L459)

## Status/event handling matrix

| Event | Dataverse transaction update | Dataverse acceptance update | Evidence |
|---|---|---|---|
| payment_intent.succeeded | hit_attemptstatus -> Succeeded, stores stripe charge/event IDs | hit_acceptancestatus -> Completed | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L487), [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L531) |
| payment_intent.payment_failed | hit_attemptstatus -> Failed, failure code/message set | hit_acceptancestatus -> Failed | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540), [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L584) |
| payment_intent.requires_action | hit_attemptstatus -> Requires Action | No explicit acceptance status transition in that branch | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L593) |
| payment_intent.processing | hit_attemptstatus -> Processing | No explicit acceptance status transition in that branch | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L619) |
| setup_intent.succeeded | Payment method/customer records upserted | acceptance marked completed for recurring setup + schedule flags | [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L676) |

## Configuration dependencies
- Portal site settings:
  - Flow/PaymentIntentUrl
  - Flow/SetupIntentUrl
  - Stripe/PublishableKey (used in templates)
- Flow parameter:
  - Stripe Secret Key from environment variable schema hit_StripeSecretKey

Evidence:
- [sitesetting.yml](../../../../../power-pages/nfp-base/sitesetting.yml#L84)
- [sitesetting.yml](../../../../../power-pages/nfp-base/sitesetting.yml#L126)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L14)
- [environmentvariabledefinition.xml](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/environmentvariabledefinitions/hit_StripeSecretKey/environmentvariabledefinition.xml#L1)

## Secret-safe notes
- Endpoint URLs, signatures, and keys are intentionally redacted from this documentation.
- Secret key defaults are present in exported flow/environment files and should be treated as sensitive operational debt.
