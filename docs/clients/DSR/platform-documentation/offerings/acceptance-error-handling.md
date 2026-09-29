[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Error Handling

## Error surfaces
1. Portal input and routing errors
2. API creation failures
3. Payment intent provisioning delays/failures
4. Webhook timing/race conditions
5. Fulfillment downstream exceptions

## Confirmed implemented protections
- Missing acceptanceid in router shows explicit warning message.
- Router has explicit Failed and Cancelled branches with user-visible alerts.
- Router has payment-preparing branch for pending payment without payment intent.
- Router includes polling retries with capped attempts and delay.
- HTTP validation flow includes until-loop limits (count and timeout).
- Orchestrator progression guard compares current status to last processed status.

## Recovery routes (observed)
- Pending payment without intent -> payment-preparing + poll
- Pending payment with intent -> payment template
- Completed signaled through flow status hint -> forced completed route in router
- Failed/cancelled -> terminal user messaging

## Potential residual risks
- If status stalls before terminal branch and retries are exhausted, user may remain on non-terminal view.
- If webhook updates are delayed beyond flow timeouts, portal polling may not converge immediately.
- Some type-specific exception handling relies on child flows not fully enumerated in this document.

## Evidence
- Router error and branch handling:
  - [missing acceptance warning and status branches](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L37)
- Bootstrap/API creation path:
  - [acceptance create call and redirect handling](power-pages/nfp-base/web-files/acceptance-bootstrap.js#L33)
- Validation timeout/loop behavior:
  - [Do_until loop count and timeout](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L562)
- Progression guard and orchestration:
  - [last processed status guard initialization](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L1098)
