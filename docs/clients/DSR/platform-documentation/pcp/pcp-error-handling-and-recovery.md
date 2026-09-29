# PCP Error Handling and Recovery

## Purpose
Capture the failure points visible in the repository and the recovery actions that can be supported from source.

## Confirmed Failure Points
- No eligible contacts.
- Dataverse query failure.
- SharePoint file creation failure.
- Logic App call failure.
- Stale outbound queue cleanup failure.

## Recovery Pattern
- Check the flow run history.
- Verify the Dataverse selection criteria.
- Confirm that the SharePoint PCP folder contains the expected file.
- Re-run the export flow if the source record set is still valid.

## Unconfirmed Failure Points
- PCP import rejection.
- PCP queue-mapping failure.
- PCP-side notification failure.
- PCP reconciliation failure.

## Related Documents
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
- [Operations runbook](pcp-operations-runbook.md)
- [Evidence gaps](pcp-evidence-gaps.md)
