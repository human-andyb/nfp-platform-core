# DSR Payment Processing Capability Overview

## Scope
This document summarizes the implemented DSR payment capability from payment-required acceptance through completion, recurring setup, and fulfillment handoff.

## Confirmed implementation patterns

| Pattern | Status | Evidence |
|---|---|---|
| One-off Stripe PaymentIntent creation and capture | Confirmed | [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L72), [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L338), [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L846) |
| Recurring setup via Stripe SetupIntent | Confirmed | [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L173), [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json#L442), [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L884) |
| PaymentIntent webhook reconciliation to Dataverse | Confirmed | [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L487), [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540) |
| SetupIntent webhook reconciliation to Dataverse and schedule creation | Confirmed | [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L713), [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L638) |
| Client-side payment session wait/poll before render | Confirmed | [sections--payment-preparing.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html#L80), [sections--payment-preparing.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html#L121) |
| Acceptance router state-based template routing | Confirmed | [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L220), [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L235) |

## Patterns not evidenced in this export

| Pattern | Status | Notes |
|---|---|---|
| Stripe Checkout Sessions | Not evidenced | No flow/template call to `/v1/checkout/sessions` found. |
| Refund orchestration | Not evidenced | No payment refund flow or refund API call found. |
| Dispute/chargeback handling | Not evidenced | No webhook branch for dispute events found. |
| Dedicated webhook signature verification step | Partially evidenced | PaymentIntent webhook re-reads event by ID; explicit Stripe-Signature validation step is not visible in flow JSON. |

## End-to-end process summary
1. Offering acceptance transitions to Pending Payment via orchestrator when payment is required.
2. Orchestrator calls Stripe payment-intent flow and updates acceptance with client secret, payment intent ID, and payment transaction link.
3. Router loads payment-preparing when intent absent, then payment section when intent is available.
4. User confirms one-off payment (confirmPayment) or recurring setup (confirmSetup) through Stripe Elements.
5. Stripe sends webhook events; flows update payment transaction state and acceptance status.
6. Completed acceptance triggers fulfillment in orchestrator (offering fulfillment linkage and downstream recalculations).

## Core dependencies
- Portal runtime templates and sections:
  - [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html)
  - [sections--payment-preparing.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html)
  - [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html)
  - [sections--confirmation.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--confirmation/sections--confirmation.webtemplate.source.html)
- Key flows:
  - [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json)
  - [Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json)
  - [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json)
  - [StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json)
  - [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json)
  - [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json)
