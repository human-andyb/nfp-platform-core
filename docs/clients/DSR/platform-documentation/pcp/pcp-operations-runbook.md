# PCP Operations Runbook

## Purpose
Provide the support steps that are supported by the repository evidence.

## Common Support Checks
1. Confirm the eligibility flow ran for the expected date.
2. Confirm the PCP export flow produced the CSV file.
3. Confirm the file exists in the SharePoint PCP folder.
4. Confirm the Logic App call was made.
5. Review the export bucket and segment-tag membership if the wrong supporters were selected.

## Boundary Notes
- PCP-side import and fundraiser handling require PCP administrator confirmation.
- The runbook only covers the DSR-side handoff that is visible in source.

## Related Documents
- [Error handling and recovery](pcp-error-handling-and-recovery.md)
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
- [Evidence gaps](pcp-evidence-gaps.md)
