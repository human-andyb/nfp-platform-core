[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance State Model

## State source
The acceptance state model is defined by global option set hit_acceptancestatus and consumed directly by router and orchestration flows.

## States
- 0 Draft
- 815390000 Pending Information
- 815390001 Pending Payment
- 815390002 Pending Approval
- 815390003 Completed
- 815390004 Failed
- 815390005 Cancelled

## Transition model (observed)
- Draft -> Pending Information (template/process dependent)
- Pending Information -> Pending Payment when payment is required
- Pending Information -> Pending Approval when approval path applies
- Pending Information -> Completed when no payment/approval gate remains
- Pending Approval -> Pending Payment (if payment required)
- Pending Approval -> Completed (if no payment required)
- Pending Payment -> Completed (payment success)
- Pending Payment -> Failed (payment failure)
- Pending Payment -> Cancelled (user/system cancellation)

## Processing guard
Orchestrator compares current status against hit_lastprocessedstatus to prevent duplicate backward/sideways processing.

## UI mapping highlights
- Pending Payment maps to payment template branch.
- Completed maps to confirmation templates.
- Failed/Cancelled map to inline alert states in router.
- Other non-terminal states map to type-specific acceptance templates.

## Evidence
- State labels:
  - [Draft label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L17)
  - [Pending Payment label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L33)
  - [Pending Approval label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L65)
  - [Completed label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L41)
  - [Cancelled label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_acceptancestatus.xml#L57)
- Router branch behavior:
  - [status constants and branch entry points](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L22)
- Flow transition logic:
  - [orchestrator last-processed guard](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L1098)
  - [validation flow target-status transitions](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L339)
