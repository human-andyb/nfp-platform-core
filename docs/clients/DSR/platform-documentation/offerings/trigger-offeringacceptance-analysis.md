[Top: Framework Overview](./offering-framework-overview.md)

# Trigger OfferingAcceptance Orchestrator Analysis

## Flow under analysis
- trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json

## Trigger intent
Respond to acceptance record changes and advance state only when status has progressed beyond last processed status.

## Confirmed control variables
- iLastStatusId initialized from hit_lastprocessedstatus with fallback -1.
- Condition compares current acceptance status against iLastStatusId.
- Branches execute only on forward progression.

## Confirmed operational themes
- Pulls acceptance record context, including contact/org/payment fields.
- Determines next status based on acceptance data and offering characteristics.
- Contains payment-intent HTTP invocation path for Stripe.
- Contains venue booking/type-specific branches (for example 815390008 route markers observed).
- Updates Stripe client secret/payment intent IDs on acceptance when generated.

## Confirmed status progression pattern
Observed from orchestration + validation interplay:
- Draft / Pending Information as input states.
- Pending Payment when payment is required.
- Pending Approval for approval-gated fulfillment.
- Completed for immediate/no-payment or post-payment completion.

## Integration touchpoints in this flow
- HTTP call to create payment intent (Power Automate endpoint).
- Child fulfillment handler invocations for post-completion processing.

## Risks and caveats
- Some type-specific branch internals require full-file tracing to enumerate every field mutation; this document stays with confirmed observed paths only.
- Status transition correctness depends on synchronization with webhook-driven payment updates.

## Evidence
- Primary flow:
  - [iLastStatusId initialization and progression guard](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L1098)
  - [Stripe payment-intent branch](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L567)
  - [acceptance Stripe fields update](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L644)
  - [venue-specific branch marker](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L898)
- Related payment flow:
  - [Stripe payment intent flow file](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json)
- Related fulfillment flow:
  - [type-specific fulfillment handler flow file](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json)
