# DSR Payment Business Process

## Business objective
Convert a payment-required offering acceptance into a completed acceptance with auditable payment records and downstream fulfillment.

## Actors
- Donor/member (portal user)
- Power Pages acceptance router and payment UI
- Power Automate orchestration and Stripe integration flows
- Stripe payment platform
- Dataverse as system of record

## Business process by phase

### Phase 1: Acceptance enters payment-required path
1. Acceptance is evaluated by orchestrator for fulfillment mode and payment requirement.
2. If payment is required, target status is set to Pending Payment.
3. Acceptance is updated with payment-required indicators.

Evidence:
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L234)
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L559)

### Phase 2: Payment session preparation
1. Orchestrator calls Stripe payment-intent flow.
2. Payment transaction attempt record is created.
3. Payment intent and client secret are returned.
4. Acceptance is updated with intent identifiers and link to payment transaction.

Evidence:
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L567)
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L622)

### Phase 3: User payment interaction
1. Router presents payment-preparing if intent not ready.
2. Router presents payment form when intent exists.
3. User confirms payment for one-off or confirms setup for recurring.

Evidence:
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L226)
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L235)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L846)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L884)

### Phase 4: Asynchronous confirmation and reconciliation
1. Stripe sends webhook events for payment_intent or setup_intent results.
2. Payment transaction and acceptance status are updated.
3. For recurring setup, payment method/customer records, acceptance agreement, and payment schedule are created/updated.

Evidence:
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L487)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L713)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L638)

### Phase 5: Completion and fulfillment handoff
1. Acceptance moves to Completed.
2. Orchestrator creates/links offering fulfillment records.
3. Confirmation UI is displayed.

Evidence:
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L730)
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L204)

## Business decision points
- Payment required or not required determines whether payment journey is entered.
- One-off vs recurring setup determines confirmPayment vs confirmSetup path.
- Webhook event type determines success/failure/processing/requires-action outcomes.
