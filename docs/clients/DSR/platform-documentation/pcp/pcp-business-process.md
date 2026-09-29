# PCP Business Process

## Purpose
Describe the fundraising process behind the PCP export in plain language.

## Business Context
The DSR fundraising team needs a way to identify supporters who should be called, prepare those records for a downstream phone-queue system, and keep the process controlled so the same supporter is not repeatedly exported without reason. The repository shows that this is implemented as a segment-tag-driven export pipeline.

## Business Flow
1. A supporter becomes eligible for outbound contact in Dataverse.
2. Supporter records are tagged for the outbound phone queue.
3. Power Automate selects the tagged records.
4. The flow separates supporters into Active and Prospect export buckets.
5. CSV files are written to SharePoint.
6. A Logic App endpoint is notified with the file details.
7. The PCP-side call-list process is expected to consume the file, but that side is not present in the repository.

## Representative Journey
A supporter with outbound eligibility and the phone-queue tag is selected by the export flow. The flow reads the contact record, buckets it as Active or Prospect, writes the row into the correct CSV file, stores the file in the SharePoint PCP folder, and hands the file metadata to the Logic App. The downstream PCP import and fundraiser allocation are not confirmed in source.

## Business Rules Confirmed in Source
- `ESC__PHONE_QUEUE` is the confirmed outbound phone-queue tag.
- `hit_nexteligiblecontactdate` and `hit_allowoutbound` are used in the eligibility flow upstream.
- `donotphone` and `mobilephone` control whether a contact receives the phone-queue tag.
- `donotemail` and `donotbulkemail` control the email branch that uses `JRN__CONTACT_DUE` instead of the phone queue.
- `hit_dlfcode = DLF__PROSPECT` is used to split records into prospect and active buckets.

## What Remains Unconfirmed
- PCP-side queue allocation rules.
- PCP import profile behaviour.
- Fundraiser screen behaviour.
- Outcome synchronisation back to Dataverse.

## Related Documents
- [Overview](pcp-overview.md)
- [End-to-end technical process](pcp-end-to-end-technical-process.md)
- [Contact selection](pcp-contact-selection.md)
- [Queue management](pcp-queue-management.md)
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
