# PCP File Staging

## Purpose
Explain where the PCP export file is staged before the next integration step.

## Confirmed Staging Mechanism
- Storage technology: SharePoint document library.
- Folder: `/Shared Documents/PCP Files`.
- Creation component: Power Automate SharePoint `CreateFile` action.
- Downstream trigger: HTTP handoff to the Logic App endpoint after the file is created.

## Observed File Lifecycle
Generated in Power Automate -> written to SharePoint staging -> metadata sent to Logic App -> downstream handling not confirmed.

## What Is Not Confirmed
- Retention policy.
- Archive behaviour.
- Cleanup or overwrite rules.
- Locking or duplicate-file safeguards.

## Related Documents
- [CSV file specification](pcp-csv-file-specification.md)
- [Logic App transfer](pcp-logic-app-transfer.md)
- [Secure file transfer](pcp-secure-file-transfer.md)
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
