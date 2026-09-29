[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Technical Process

## Runtime choreography
The technical flow is a portal-first write followed by flow-driven state progression.

1. Portal creates acceptance record through Power Pages Web API.
2. Dataverse-triggered orchestrator evaluates status movement and business conditions.
3. For payment-required branches, flow obtains Stripe intent artifacts and updates acceptance.
4. Router page polls HTTP status-validation flow when waiting for payment propagation.
5. Router re-renders to payment, completion, failed, or cancelled branch.
6. Completion branch may invoke type-specific fulfillment processing.

## Key components
- UI orchestration entry: sections--acceptance-router
- Acceptance creation paths:
  - sections--offering-detail inline API call
  - acceptance-bootstrap.js event listener call
- Main flows:
  - trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json
  - Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json
- Supporting flows (observed):
  - OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json
  - Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json
  - StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json
  - StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json

## Technical branch behavior confirmed
- Router status constants are hardcoded and compared as strings for route selection.
- Pending payment branch checks payment intent presence to choose payment-preparing vs payment.
- Validation loop uses:
  - max retries: 20
  - delay per retry: 1250 ms
- HTTP status validation flow includes an internal until loop up to 40 iterations, with 2-minute timeout and 1-second delay cycle.

## Evidence
- Router + polling:
  - [router branch and poll settings](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L378)
- Acceptance creation JS:
  - [bootstrap Draft create and redirect](power-pages/nfp-base/web-files/acceptance-bootstrap.js#L21)
- Flow logic:
  - [orchestrator payment intent update path](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L567)
  - [status validation until loop limits](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L562)
