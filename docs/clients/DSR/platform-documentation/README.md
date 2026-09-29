# DSR Platform Documentation

## Purpose
This folder is the handover-ready documentation set for the DSR implementation in this repository. It is written for readers who may not know the codebase, Power Pages, or Power Platform internals, and it is ordered so a new team member can read the platform story before drilling into components.

## How to read this set
1. Start with [00-platform-overview.md](00-platform-overview.md).
2. Continue through [01-business-capability-model.md](01-business-capability-model.md), [02-solution-architecture.md](02-solution-architecture.md), and the process maps [03-end-to-end-process-map.md](03-end-to-end-process-map.md) to [06-system-walkthrough.md](06-system-walkthrough.md).
3. Use domain deep-dives when needed:
- [portal-rendering/portal-rendering.md](portal-rendering/portal-rendering.md)
- [navigation/navigation.md](navigation/navigation.md)
- [web-gallery/web-gallery.md](web-gallery/web-gallery.md)
- [offerings/offerings-acceptance.md](offerings/offerings-acceptance.md)
- [payments/payments-stripe.md](payments/payments-stripe.md)
- [etrainu/etrainu-integration.md](etrainu/etrainu-integration.md)
- [segment-tags/segment-tagging.md](segment-tags/segment-tagging.md)
- [pcp/README.md](pcp/README.md)
- [operations/operations-runbook.md](operations/operations-runbook.md)
4. Use the reference matrices for cross-process tracing:
- [reference/process-matrix.md](reference/process-matrix.md)
- [reference/table-matrix.md](reference/table-matrix.md)
- [reference/flow-matrix.md](reference/flow-matrix.md)
- [reference/web-template-matrix.md](reference/web-template-matrix.md)
- [reference/integration-matrix.md](reference/integration-matrix.md)
- [reference/status-transition-matrix.md](reference/status-transition-matrix.md)
- [reference/security-matrix.md](reference/security-matrix.md)
- [reference/component-dependency-matrix.md](reference/component-dependency-matrix.md)
5. Track unresolved items in [reference/evidence-gaps.md](reference/evidence-gaps.md) and [reference/documentation-quality-review.md](reference/documentation-quality-review.md).
6. Finish with [reference/final-documentation-validation.md](reference/final-documentation-validation.md) for the final pre-commit review summary.

## Scope and evidence standard
- Primary implementation evidence is from:
  - Power Pages templates under power-pages/nfp-base
  - Unpacked flows/entities under solutions/exports/unpacked/dsr
- Existing analysis references are reused where they align with source artifacts:
  - [../analysis/solution-inventory.md](../analysis/solution-inventory.md)
  - [../analysis/flow-catalogue.md](../analysis/flow-catalogue.md)
  - [../analysis/business-processes-from-flows.md](../analysis/business-processes-from-flows.md)
  - [../analysis/etrainu-integration-business-process.md](../analysis/etrainu-integration-business-process.md)
  - [../analysis/core-segment-tag-business-rules.md](../analysis/core-segment-tag-business-rules.md)
  - [../analysis/next-eligible-contact-date-business-rules.md](../analysis/next-eligible-contact-date-business-rules.md)
  - [../analysis/pcp-file-integration-business-process.md](../analysis/pcp-file-integration-business-process.md)

## Source path note
Earlier prompts in the repo refer to solutions/unpacked/DSR, but active evidence in this workspace is under solutions/exports/unpacked/dsr.

## Companion reference docs
- [reference/repository-discovery.md](reference/repository-discovery.md)
- [reference/component-evidence-register.md](reference/component-evidence-register.md)
- [reference/evidence-gaps.md](reference/evidence-gaps.md)
- [reference/final-documentation-validation.md](reference/final-documentation-validation.md)
