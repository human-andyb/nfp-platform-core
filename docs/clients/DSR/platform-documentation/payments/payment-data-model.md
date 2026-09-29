# Payment Data Model

## Primary entities

| Entity | Purpose | Key fields (payment-related) | Evidence |
|---|---|---|---|
| hit_offeringacceptance | Main acceptance record and user-facing payment context | hit_paymentrequired, hit_paymentstatus, hit_paymenttransaction, hit_stripeclientsecret, hit_stripepaymentintentid, hit_stripechargeid, hit_stripecustomerid, hit_stripepaymentmethodid, hit_recurringfrequency, hit_recurringstart, hit_recurringend, hit_ispaymentschedule | [hit_OfferingAcceptance/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L1755), [hit_OfferingAcceptance/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L2527) |
| hit_paymenttransaction | Attempt-level payment ledger linked to acceptance | hit_attemptnumber, hit_attemptstatus, hit_failurecode, hit_failuremessage, hit_paymentstatus, hit_stripepaymentintentid, hit_stripechargeid, hit_stripeeventid, hit_offeringacceptance | [hit_PaymentTransaction/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_PaymentTransaction/Entity.xml#L299), [hit_PaymentTransaction/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_PaymentTransaction/Entity.xml#L1114) |
| hit_paymentschedule | Recurring schedule record | hit_paymentschedulestatus, hit_recurringfrequency, hit_nextpaymentdate, hit_lastpaymentdate, hit_stripecustomerid, hit_stripepaymentmethodid | [hit_PaymentSchedule/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_PaymentSchedule/Entity.xml#L645), [hit_PaymentSchedule/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_PaymentSchedule/Entity.xml#L957) |
| hit_stripecustomer | Local projection of Stripe customer | hit_stripe_customerid, hit_stripecustomerid, contact lookup | [hit_StripeCustomer/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_StripeCustomer/Entity.xml#L392) |
| hit_stripepaymentmethod | Local projection of Stripe payment method | hit_paymentmethodid, hit_stripepaymentmethodid, hit_brand, hit_last4, hit_type, hit_stripecustomer lookup | [hit_StripePaymentMethod/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_StripePaymentMethod/Entity.xml#L296), [hit_StripePaymentMethod/Entity.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_StripePaymentMethod/Entity.xml#L374) |
| hit_acceptanceagreement | Recurring agreement linkage | hit_frequency, links to acceptance and stripe payment method | [StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json#L199) |

## Option sets used in payment workflows

| Option set | Values |
|---|---|
| hit_acceptancestatus | 0 Draft, 815390000 Pending Information, 815390001 Pending Payment, 815390002 Pending Approval, 815390003 Completed, 815390004 Failed, 815390005 Cancelled |
| hit_attemptstatus | 815390000 Created, 815390001 Processing, 815390002 Requires Action, 815390003 Succeeded, 815390004 Failed |
| hit_statusofpayment | 815390000 Succeeded, 815390001 Failed, 815390002 Requires Action |
| hit_paymentprovider | 815390000 Stripe |
| hit_recurringfrequency | 815390000 Monthly, 815390001 Annually |
| hit_paymentschedulestatus | 815390000 Active, 815390001 Paused, 815390002 Payment Method Required, 815390003 Cancelled |

Evidence:
- [hit_acceptancestatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L14)
- [hit_attemptstatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_attemptstatus.xml#L14)
- [hit_statusofpayment.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_statusofpayment.xml#L14)
- [hit_paymentprovider.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_paymentprovider.xml#L14)
- [hit_recurringfrequency.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_recurringfrequency.xml#L14)
- [hit_paymentschedulestatus.xml](../../../../../solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_paymentschedulestatus.xml#L14)

## Relationship summary
- One acceptance can map to multiple payment transaction attempts.
- Acceptance can link to one current payment transaction pointer.
- One acceptance can produce zero or one recurring payment schedule through setup-intent success path.
- Stripe customer and payment method entities provide stable references for recurring setup and subsequent debits.

## Web API exposure relevant to payment
- Web API is enabled and hit_offeringacceptance fields are exposed, including payment identifiers.

Evidence:
- [sitesetting.yml](../../../../../power-pages/nfp-base/sitesetting.yml#L13)
- [sitesetting.yml](../../../../../power-pages/nfp-base/sitesetting.yml#L244)
