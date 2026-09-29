# PCP Documentation

## Purpose
Explain the current DSR-to-PCP phone-queue handoff using repository evidence only.

## Intended Audience
Support consultants, fundraising operations, integration engineers, Power Platform developers, and analysts who need to understand the export and handoff process without prior DSR context.

## PCP Definition
In this repository, PCP is the downstream phone-queue or call-list handoff process used by DSR fundraising operations. The repository confirms the DSR-side preparation, file staging, and Logic App handoff, but not the full PCP-side import lifecycle.

## Process Summary
1. Contacts or organisations are marked for outbound calling through segment-tag logic.
2. Power Automate selects eligible Dataverse records.
3. The selected records are transformed into CSV export files.
4. The files are written to SharePoint staging.
5. A Logic App endpoint is invoked with the file name and file path.
6. PCP-side import and queue allocation are referenced by the design, but are not fully evidenced in this repository.

## Current-State Warning
This documentation separates confirmed implementation from inferred downstream behaviour. Anything beyond the DSR export boundary is labelled clearly as inferred or unconfirmed.

## Evidence Conventions
- Confirmed means the behaviour is directly shown in source.
- Partially confirmed means only part of the behaviour is shown.
- Inferred means the behaviour is strongly suggested but not directly demonstrated.
- Unconfirmed means the repository does not contain the needed evidence.

## Recommended Reading Order
1. [pcp-overview.md](pcp-overview.md)
2. [pcp-business-process.md](pcp-business-process.md)
3. [pcp-end-to-end-technical-process.md](pcp-end-to-end-technical-process.md)
4. [pcp-contact-selection.md](pcp-contact-selection.md)
5. [pcp-queue-management.md](pcp-queue-management.md)
6. [pcp-power-automate-processing.md](pcp-power-automate-processing.md)
7. [pcp-csv-file-specification.md](pcp-csv-file-specification.md)
8. [pcp-file-staging.md](pcp-file-staging.md)
9. [pcp-logic-app-transfer.md](pcp-logic-app-transfer.md)
10. [pcp-secure-file-transfer.md](pcp-secure-file-transfer.md)
11. [pcp-import-and-queue-processing.md](pcp-import-and-queue-processing.md)
12. [pcp-fundraiser-workflow.md](pcp-fundraiser-workflow.md)
13. [pcp-data-model.md](pcp-data-model.md)
14. [pcp-status-model.md](pcp-status-model.md)
15. [pcp-security-and-privacy.md](pcp-security-and-privacy.md)
16. [pcp-monitoring-and-reconciliation.md](pcp-monitoring-and-reconciliation.md)
17. [pcp-error-handling-and-recovery.md](pcp-error-handling-and-recovery.md)
18. [pcp-operations-runbook.md](pcp-operations-runbook.md)
19. [pcp-current-and-future-state.md](pcp-current-and-future-state.md)
20. [pcp-diagrams.md](pcp-diagrams.md)
21. [pcp-component-catalogue.md](pcp-component-catalogue.md)
22. [pcp-evidence-register.md](pcp-evidence-register.md)
23. [pcp-evidence-gaps.md](pcp-evidence-gaps.md)

## Related DSR Documentation
- [Platform overview](../00-platform-overview.md)
- [Process map](../03-end-to-end-process-map.md)
- [Dataverse process map](../04-dataverse-process-map.md)
- [Integration landscape](../05-integration-landscape.md)
- [System walkthrough](../06-system-walkthrough.md)
- [PCP analysis source note](../../analysis/pcp-file-integration-business-process.md)
