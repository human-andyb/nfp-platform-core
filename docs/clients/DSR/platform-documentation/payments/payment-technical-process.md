# DSR Payment Technical Process

## Runtime architecture
- Portal rendering is template-driven through acceptance router and section includes.
- Payment intent lifecycle is controlled by Power Automate flows and Stripe API.
- Final state authority is asynchronous webhook processing, not client callback only.

## Detailed technical sequence

### 1) Router-driven UI composition
- Router selects payment sections when acceptance status is Pending Payment.
- If payment intent ID is missing, router includes payment-preparing section.
- If payment intent ID exists, router includes payment capture section.

Evidence:
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L220)
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L226)
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L235)

### 2) Intent provisioning
- Orchestrator triggers the payment-intent flow endpoint for pending-payment acceptances.
- Flow creates payment transaction rows and calls Stripe payment_intents.
- Acceptance receives client secret and payment intent ID.

Evidence:
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L567)
- [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L302)
- [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L338)
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L644)

### 3) Client-side capture and return
- Payment section loads Stripe.js and mounts Stripe Elements.
- One-off path calls confirmPayment with return_url.
- Recurring path calls confirmSetup with return_url.
- Return handling retrieves payment intent or setup intent and routes back to acceptance page.

Evidence:
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L246)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L846)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L884)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L763)

### 4) Recurring setup provisioning
- Setup-intent flow updates acceptance recurring fields and ensures contact/customer records.
- Flow calls Stripe customers and setup_intents endpoints.
- Client secret for setup intent is returned to portal.

Evidence:
- [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L264)
- [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L335)
- [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L454)
- [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L477)

### 5) Webhook reconciliation and state convergence
- Payment-intent webhook branches by event type and updates payment transaction attempt state.
- Successful payment event updates acceptance to Completed.
- Setup-intent webhook creates/updates payment method, acceptance agreement, payment schedule, and marks acceptance completed for recurring setup.

Evidence:
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L487)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L365)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L638)

## Technical caveats observed
- Router references Flow/AcceptanceStatusValidation setting key; this key is referenced in templates but not present in exported site settings file.
- Legacy template [Offering-Acceptance---Payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html) implements a similar but separate payment path and should be treated as a parallel pattern.
