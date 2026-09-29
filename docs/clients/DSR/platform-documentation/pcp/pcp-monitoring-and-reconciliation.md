# PCP Monitoring and Reconciliation

## Purpose
Describe how the current repository supports monitoring and reconciliation.

## Confirmed Monitoring Points
- Power Automate run history.
- SharePoint file creation.
- Logic App trigger invocation from the export flow.
- Dataverse status changes in the eligibility flow.

## Unconfirmed Monitoring Points
- PCP import logs.
- PCP rejection reports.
- PCP queue reports.
- Closed-loop outcomes back into Dataverse.

## Current Reconciliation State
The repository does not show a closed-loop acknowledgement from PCP back to DSR. Reconciliation is therefore partial and requires PCP-side confirmation.

## Related Documents
- [Error handling and recovery](pcp-error-handling-and-recovery.md)
- [Operations runbook](pcp-operations-runbook.md)
- [Evidence gaps](pcp-evidence-gaps.md)
