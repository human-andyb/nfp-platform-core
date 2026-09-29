[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Data Model

## Core entities
- hit_offering
- hit_offeringacceptance
- hit_priceoption
- hit_offeringfulfillment
- hit_paymenttransaction

## Key relationship chain
- hit_offering (1) -> (N) hit_offeringacceptance
- hit_offering (1) -> (N) hit_priceoption
- hit_offering (1) -> (N) hit_paymenttransaction
- hit_offering (1) -> (N) hit_offeringfulfillment
- hit_offeringacceptance (1) -> (N) hit_offeringfulfillment

## Key acceptance attributes (confirmed)
- Process/status:
  - hit_acceptancestatus
  - hit_lastprocessedstatus
- Payment control:
  - hit_paymentrequired
  - hit_paymentprovider
  - hit_paymentmethodtype
  - hit_paymentretrycount
  - hit_lastpaymentattempton
- Stripe identifiers:
  - hit_stripeclientsecret
  - hit_stripepaymentintentid
  - hit_stripechargeid
  - hit_stripepaymentmethodid
  - hit_stripecustomerid
- Monetary values:
  - hit_baseamount
  - hit_totalamountcommitted
  - hit_totalamounteffective

## Key offering attributes (confirmed)
- Classification and behavior:
  - hit_offeringtype
  - hit_pricingmodel
  - hit_fulfillmentmode
  - hit_allowrecurring
  - hit_subscriptionfrequency
- Visibility:
  - hit_isactive
  - hit_webvisible

## Option-set references
- hit_offeringtype (global)
- hit_acceptancestatus (global)
- hit_fulfillmentmode (global)
- hit_recurringfrequency (global)

## Evidence
- Offering entity metadata:
  - [pricing model attribute and options](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Offering/Entity.xml#L1482)
- Acceptance entity metadata:
  - [last processed status attribute](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L1117)
  - [payment required bit attribute](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L1753)
  - [Stripe client secret attribute](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L2525)
  - [Stripe payment intent attribute](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_OfferingAcceptance/Entity.xml#L2605)
- Offering relationships:
  - [offering to acceptance relationship](solutions/exports/unpacked/dsr/BaseSchema/Other/Relationships/hit_Offering.xml#L39)
- Acceptance relationships:
  - [acceptance to fulfillment relationship](solutions/exports/unpacked/dsr/BaseSchema/Other/Relationships/hit_OfferingAcceptance.xml#L240)
- Option sets:
  - [offering type labels](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml#L9)
  - [acceptance status labels](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L9)
  - [fulfillment mode labels](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_fulfillmentmode.xml#L9)
  - [recurring frequency labels](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_recurringfrequency.xml#L9)
