[Top: Framework Overview](./offering-framework-overview.md)

# HTTP Acceptance Status Validation

## Flow under analysis
- Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json

## Purpose
Provide a polling-safe API endpoint so the portal can validate when an acceptance has reached the expected next status and retrieve payment intent artifacts when needed.

## Confirmed behavior
- Accepts acceptanceId payload.
- Reads current acceptance and computes target status based on current status and payment-required logic.
- For Pending Payment target:
  - waits until payment intent exists
  - captures hit_stripeclientsecret and hit_stripepaymentintentid
- Uses an Until loop with controlled limits:
  - count: 40
  - timeout: PT2M
- Includes short delay cycle while waiting (1 second in inner wait branch).
- Returns values used by router-side polling redirect logic.

## Status-target examples seen in flow
- Pending Approval with payment required => target Pending Payment.
- Pending Approval without payment required => target Completed.
- Payment completion path can target Completed.

## Portal integration
- Router JS obtains endpoint URL from site setting Flow/AcceptanceStatusValidation.
- Router loop retries and redirects with flowstatus=completed when flow response indicates completion.

## Evidence
- Validation flow:
  - [approval branch target-status updates](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L339)
  - [until loop and timeout controls](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L562)
  - [Stripe artifact capture variables](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L441)
- Router polling implementation:
  - [router polling endpoint and status checks](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L378)
- Site setting endpoint source:
  - [Flow/AcceptanceStatusValidation and acceptance Web API settings](power-pages/nfp-base/sitesetting.yml#L244)
