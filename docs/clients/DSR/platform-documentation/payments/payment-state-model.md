# Payment State Model

## Acceptance state machine (payment-relevant)

| Acceptance status | Code | Entry condition | Exit condition |
|---|---:|---|---|
| Draft | 0 | Initial acceptance creation | Orchestrator evaluates and moves forward |
| Pending Information | 815390000 | Required information not complete yet | Info complete and fulfillment/payment rules evaluated |
| Pending Payment | 815390001 | Payment required branch selected | Payment success to Completed; payment failure to Failed |
| Pending Approval | 815390002 | Approval-required branch | Payment-required approvals can route to Pending Payment |
| Completed | 815390003 | Successful payment or non-payment completion | Terminal for payment flow |
| Failed | 815390004 | Payment failure webhook branch | Retry/new attempt process outside current state branch |
| Cancelled | 815390005 | Cancel branch | Terminal |

Evidence:
- [hit_acceptancestatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L14)
- [trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L559)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L540)

## Payment transaction attempt state machine

| Attempt state | Code | Trigger |
|---|---:|---|
| Created | 815390000 | Attempt row created before Stripe call |
| Processing | 815390001 | Intent created / processing webhook |
| Requires Action | 815390002 | payment_intent.requires_action webhook |
| Succeeded | 815390003 | payment_intent.succeeded webhook |
| Failed | 815390004 | payment_intent.payment_failed webhook |

Evidence:
- [hit_attemptstatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_attemptstatus.xml#L14)
- [Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json#L306)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L619)

## Payment schedule state model (recurring)

| Schedule status | Code | Meaning |
|---|---:|---|
| Active | 815390000 | Ready for recurring collection process |
| Paused | 815390001 | Temporarily halted |
| Payment Method Required | 815390002 | Collection blocked pending method |
| Cancelled | 815390003 | Ended schedule |

Evidence:
- [hit_paymentschedulestatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_paymentschedulestatus.xml#L14)
- [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L645)
