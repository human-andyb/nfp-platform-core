[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Router Analysis

## Router purpose
sections--acceptance-router is the UI orchestrator that resolves acceptance context and selects the correct user experience branch.

## Input contract
- Query inputs:
  - acceptanceid (required)
  - waitforpayment (optional polling trigger)
  - flowstatus (optional completion hint)
- Missing acceptanceid returns visible warning.

## Data retrieval
Router fetches:
- hit_offeringacceptance:
  - hit_acceptancestatus
  - hit_paymentrequired
  - hit_stripeclientsecret
  - hit_stripepaymentintentid
- Linked hit_offering:
  - hit_offeringid
  - hit_offeringname
  - hit_offeringtype

## Status constants (router)
- 0 Draft
- 815390000 Pending Information
- 815390001 Pending Payment
- 815390002 Pending Approval
- 815390003 Completed
- 815390004 Failed
- 815390005 Cancelled

## Branching logic
- Completed:
  - payment required true => sections--confirmation
  - payment required false => sections--confirmation-nonpayment
- Pending Payment:
  - payment required and no payment intent => sections--payment-preparing
  - otherwise => sections--payment
- Failed => inline danger alert
- Cancelled => inline warning alert
- All other statuses => offering-type switch to sections--acceptance-* templates

## Polling behavior
When waitforpayment=1:
- JS calls site setting Flow/AcceptanceStatusValidation endpoint.
- Posts acceptanceId to flow endpoint.
- Retries until completed signal or max retries reached.
- On completion: redirects with flowstatus=completed.

## Design implications
- Router is state-first, not page-first.
- Status and payment intent presence jointly control payment branch UX.
- Type templates are only selected when not in terminal/payment-status views.

## Evidence
- Router source:
  - [status constants and state branching](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L22)
  - [type switch mapping for all offering types](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L264)
  - [polling endpoint + status checks](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L378)
- Validation endpoint configuration:
  - [Flow/AcceptanceStatusValidation site setting](power-pages/nfp-base/sitesetting.yml#L244)
- Validation flow behavior:
  - [target-status branch + until loop](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L339)
