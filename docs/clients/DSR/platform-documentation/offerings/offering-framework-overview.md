[Top: Platform Docs Home](../README.md)

# DSR Offering and Acceptance Framework Overview

## Scope and objective
This document describes the implemented offering and acceptance framework as exported in the DSR solution and Power Pages site.

## Confirmed architecture (source-backed)
- Offerings are stored in Dataverse table hit_offering and exposed to portal users through Web API and table permissions.
- Acceptance records are created in hit_offeringacceptance from portal JavaScript and then orchestrated by flows.
- The router template sections--acceptance-router is the runtime decision point for status-based rendering.
- Status orchestration is split across:
  - Dataverse trigger flow trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json
  - HTTP validation flow Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json

## Capability context
- Business capability: publish offerings and collect participant acceptance.
- Channel: Power Pages portal.
- System of record: Dataverse.
- Process control: Power Automate.
- External integration: Stripe (payment intents and webhooks), plus offering-specific downstream fulfillment integrations.

## Core runtime path
1. Offering detail section resolves an offering id and loads offering + price options.
2. Portal creates hit_offeringacceptance (status Draft = 0) through /_api/hit_offeringacceptances.
3. Router loads acceptance and offering type, then routes by acceptance status and offering type.
4. Orchestrator and webhook flows update status and payment fields.
5. Router transitions to payment, confirmation, failure, or cancellation views.

## Confirmed option sets in use
- Offering Type (global hit_offeringtype): Donation, Event, Course Access, Membership, Volunteer Engagement, Resource Download, Sponsorship, Expression of Interest, Venue Booking.
- Acceptance Status (global hit_acceptancestatus): Draft, Pending Information, Pending Payment, Pending Approval, Completed, Failed, Cancelled.
- Fulfillment Mode (global hit_fulfillmentmode): Instant, Approval Required, External Process.

## Evidence register
- Router and state routing:
  - [router status constants and branches](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L22)
- Acceptance creation (event-based bootstrap):
  - [bootstrap acceptance create and redirect](power-pages/nfp-base/web-files/acceptance-bootstrap.js#L21)
- Offering detail acceptance creation path:
  - [offering detail active filter and acceptance POST](power-pages/nfp-base/web-templates/sections--offering-detail/sections--offering-detail.webtemplate.source.html#L70)
- Offering and acceptance option sets:
  - [offering type option set](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml#L2)
  - [acceptance status option set](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L17)
- Core flow definitions:
  - [orchestrator progression and Stripe update path](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L1098)
  - [HTTP validation loop and target status handling](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L403)

## Known implementation observations
- Router supports all nine offering types, but only some states have dedicated visual branches (Completed, Pending Payment, Failed, Cancelled). Other statuses route to type templates.
- Active web-page exports in this snapshot are renderer-driven; historical offering pages also exist in deleted/inactive artifacts.

## Discrepancies vs legacy offerings document
Compared with offerings-acceptance.md in this folder:
- Legacy doc is concept-level and does not capture the current router status branching details (payment-preparing/payment/confirmation split).
- Legacy doc does not document HTTP validation polling mechanics and flowstatus completion hint behavior.
- Legacy doc does not include the full nine-type router mapping by offeringtype option-set IDs.
- Legacy doc does not include explicit progression guard behavior via hit_lastprocessedstatus in orchestration.

## Related docs
- offering-management.md
- offering-types.md
- acceptance-business-process.md
- acceptance-technical-process.md
- acceptance-router-analysis.md
- acceptance-data-model.md
- acceptance-state-model.md
- acceptance-error-handling.md
- acceptance-diagrams.md
