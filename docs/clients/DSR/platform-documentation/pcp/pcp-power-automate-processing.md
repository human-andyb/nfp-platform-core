# PCP Power Automate Processing

## Purpose
Catalog the flows that participate in the PCP export path.

## Flow Catalogue
| Flow | Trigger | Business Purpose | Reads | Writes | Produces | Calls | Error Handling | Repository Path |
|---|---|---|---|---|---|---|---|---|
| `recurrence_BatchProcessContact-NextEligibleContact` | scheduled/recurrence | Finds eligible outbound contacts and assigns queue tags | `contacts` | contact status fields, queue tag updates | queue-tagged contacts | child workflow calls | conditional branches, no confirmed alerting | [JSON](../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/recurrence_BatchProcessContact-NextEligibleContact-258D5C80-B98F-F111-B8DA-7CED8DA2B423.json) |
| `recurrence_dailyPurgeStaleOutboundContacts` | scheduled/recurrence | Removes stale outbound queue tags | contact and segment-tag rows | tag removals | cleanup outcome | child workflow calls | not fully evidenced | repository evidence referenced in analysis docs |
| `PCPContactFileGeneration-EscalatetoPhoneQueueChild` | manual/child workflow | Exports contact phone-queue rows to CSV and SharePoint | `hit_segmenttags`, `hit_contactsegmenttags`, `contacts` | none directly in Dataverse from the export slice | Active and Prospect contact CSV files | SharePoint create file, HTTP Logic App invoke | conditional branch and flow failure handling | [JSON](../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/PCPContactFileGeneration-EscalatetoPhoneQueueChild-B3817FEA-F87F-F111-AB0F-70A8A555B733.json) |
| `PCPOrganisationFileGeneration-EscalatetoPhoneQueue` | manual/child workflow | Exports organisation phone-queue rows to CSV and SharePoint | `hit_segmenttags`, `hit_accountsegmenttags`, `accounts` | none directly in Dataverse from the export slice | Active and Prospect organisation CSV files | SharePoint create file, HTTP Logic App invoke | conditional branch and flow failure handling | [JSON](../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/PCPOrganisationFileGeneration-EscalatetoPhoneQueue-63220083-7898-F111-B8DB-6045BDC2338C.json) |

## Flow Trace Summary
The export flows are DSR-side exporters, not PCP-side importers. They build CSV files from tagged Dataverse rows and then hand the file metadata to a Logic App endpoint.

## Related Documents
- [Contact selection](pcp-contact-selection.md)
- [CSV file specification](pcp-csv-file-specification.md)
- [File staging](pcp-file-staging.md)
- [Logic App transfer](pcp-logic-app-transfer.md)
