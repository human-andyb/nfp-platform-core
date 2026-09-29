# PCP End-to-End Technical Process

## Purpose
Show the technical path from Dataverse selection to SharePoint staging and Logic App handoff.

## Technical Sequence
```mermaid
sequenceDiagram
  actor Admin as Fundraising Administrator
  participant DV as Dataverse
  participant PA as Power Automate
  participant SP as SharePoint staging
  participant LA as Azure Logic App endpoint

  Admin->>DV: Maintain supporter eligibility and queue tags
  PA->>DV: Read eligible tagged records
  DV-->>PA: Return selected contacts or organisations
  PA->>PA: Split into Active and Prospect buckets
  PA->>PA: Build CSV rows
  PA->>SP: Create PCP export file
  PA->>LA: Send file name and file path
```

## Confirmed Technical Components
- Dataverse connector: `shared_commondataserviceforapps`
- SharePoint connector: `shared_sharepointonline`
- SharePoint site: the site configured in the export flow
- SharePoint folder: `/Shared Documents/PCP Files`
- Logic App trigger: HTTP request received

## What the Repository Confirms
- Two export flows exist: one for contacts and one for organisations.
- Both flows query `hit_segmenttags` for `ESC__PHONE_QUEUE`.
- Both flows create CSV files in the same SharePoint folder.
- Both flows call the same Logic App endpoint with `fileName` and `filePath`.

## What the Repository Does Not Confirm
- The Logic App workflow logic.
- Any SFTP transfer after the Logic App.
- PCP import rules or queue allocation logic.

## Related Documents
- [Overview](pcp-overview.md)
- [File staging](pcp-file-staging.md)
- [Logic App transfer](pcp-logic-app-transfer.md)
- [Secure file transfer](pcp-secure-file-transfer.md)
- [Evidence gaps](pcp-evidence-gaps.md)
