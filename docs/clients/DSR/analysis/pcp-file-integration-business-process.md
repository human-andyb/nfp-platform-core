# PCP file integration business process

## Scope and evidence base

This document reconstructs the DSR-to-PCP integration process from the repository evidence only. It is based on the workflow definitions under the unpacked DSR solution, especially the PCP file-generation child flows and the supporting segment-tag logic used to select records for escalation.

The key evidence reviewed is:

- PCPContactFileGeneration-EscalatetoPhoneQueueChild-B3817FEA-F87F-F111-AB0F-70A8A555B733.json
- PCPOrganisationFileGeneration-EscalatetoPhoneQueue-63220083-7898-F111-B8DB-6045BDC2338C.json
- recurrence_BatchProcessContact-NextEligibleContact-258D5C80-B98F-F111-B8DA-7CED8DA2B423.json
- recurrence_dailyPurgeStaleOutboundContacts-9B846598-1995-F111-B8DB-6045BDC2338C.json

This document separates what is confirmed in the repository from what is inferred about the downstream PCP-side process.

---

## 1. Business purpose

The repository shows that DSR is actively constructing outbound contact files for a "phone queue" or PCP-style escalation path.

The core business intent is:

- identify supporters who are eligible for outbound contact,
- attach them to the `ESC__PHONE_QUEUE` segment tag,
- build a contact list in a transportable CSV format,
- place the file in a SharePoint location used as the integration handoff point,
- invoke an Azure Logic App endpoint that appears to be the next stage in the PCP integration process.

This is not a pure internal CRM operation. It is a handoff pipeline from Dataverse to an external call-center or dialer workflow.

---

## 2. Architecture and integration pattern

The repository evidence shows a clear pattern:

1. Dataverse selects records from segment-tag tables.
2. The flow loads the corresponding Contact or Account records.
3. The flow classifies each item as Active or Prospect based on `hit_dlfcode`.
4. It builds arrays of CRM records with phone and email values.
5. It converts the arrays into CSV tables.
6. It creates physical CSV files in a SharePoint folder.
7. It calls an Azure Logic App URL with the file name and file path.

### Confirmed technical components

- Dataverse connector: `shared_commondataserviceforapps`
- SharePoint connector: `shared_sharepointonline`
- SharePoint site: `https://disabilitysportrecreation.sharepoint.com/sites/DSRD365Assests`
- SharePoint folder: `/Shared Documents/PCP Files`
- Azure endpoint: `https://prod-11.australiaeast.logic.azure.com/.../workflows/.../When_an_HTTP_request_is_received/paths/invoke`

### Confirmed repository boundary

The repository confirms the DSR-side "prepare and hand off the file" stage. It does not confirm:

- PCP file import processing,
- SFTP transfer mechanics,
- PCP-side validation or deduplication,
- downstream queue ingestion,
- final call-center assignment,
- reconciled status updates coming back to Dataverse.

The downstream Azure Logic App is clearly part of the process, but the actual implementation of that Logic App is not present in this repo.

---

## 3. Queue selection logic

The first step in both PCP child flows is to locate the segment tag for the outbound phone queue.

### Segment-tag selection

The flow performs a Dataverse query on `hit_segmenttags` with:

- `hit_code eq 'ESC__PHONE_QUEUE'`

It reads the matching `hit_segmenttagid` and stores it in a variable named `sEscPhoneTagID`.

### Contact queue membership

The flow then queries `hit_contactsegmenttags` with:

- `_hit_segmenttag_value eq '@{variables('sEscPhoneTagID')}'`

This identifies all contact-to-segment-tag relationships whose segment tag is the phone queue.

### Organisation queue membership

The equivalent organisation flow queries `hit_accountsegmenttags` with:

- `_hit_segmenttag_value eq '@{variables('sEscPhoneTagID')}'`

This identifies all account-to-segment-tag relationships assigned to the same queue.

### Interpretation

This means the queue is not determined by a direct status field or a guessed file list. It is driven by Dataverse segment-tag assignment, which is then used to select the records that should be exported.

---

## 4. Record extraction and classification

After selecting the relevant junction records, each flow opens the corresponding contact or account record and builds an export row.

### Contact flow logic

For each tagged contact, the flow gets the Contact record by `contactid` and classifies it as:

- Prospect if `hit_dlfcode == 'DLF__PROSPECT'`
- Active otherwise

The flow appends a row to arrays such as:

- `arDSR_ActiveContacts`
- `arDSR_ProspectContacts`

### Organisation flow logic

For each tagged organisation, the flow gets the Account record by `accountid` and again classifies it as:

- Prospect if `hit_dlfcode == 'DLF__PROSPECT'`
- Active otherwise

It appends rows to arrays such as:

- `arDSR_ActiveOrganisations`
- `arDSR_ProspectOrganisations`

### Contact-name preparation for organisation flow

The organisation flow resolves the primary contact when present and stores that contact’s full name in `sContactName`. If no primary contact exists, it sets the contact name blank.

This indicates the export file deliberately includes a person name even when the export record is really an organisation record.

---

## 5. Field mapping used in CSV files

The CSV rows are built with a consistent schema for both contact and organisation exports.

The fields used are:

- `ConstituentID`
- `Organisation`
- `FullName`
- `Phone1`
- `Phone2`
- `Phone3`
- `Email`
- `Location`
- `CRMUrl`

### Field mapping details

For contact records:

- `ConstituentID` = `hit_constituentid`
- `Organisation` = blank
- `FullName` = `fullname`
- `Phone1` = `mobilephone` (with spaces removed)
- `Phone2` = `telephone2` (spaces removed)
- `Phone3` = `telephone1` (spaces removed)
- `Email` = `emailaddress1`
- `Location` = `VIC`
- `CRMUrl` = `dsr-prod.crm6.dynamics.com/main.aspx?...&id={contactid}`

For organisation records:

- `ConstituentID` = `accountnumber`
- `Organisation` = `name`
- `FullName` = resolved primary contact full name, or blank
- `Phone1` = `telephone1` (spaces removed)
- `Phone2` = `telephone2` (spaces removed)
- `Phone3` = `telephone3` (spaces removed)
- `Email` = `emailaddress1`
- `Location` = `VIC`
- `CRMUrl` = `dsr-prod.crm6.dynamics.com/main.aspx?...&id={accountid}`

### Data hygiene applied

The flow strips spaces from phone numbers using:

- `replace(coalesce(...),' ','')`

This is a direct field-normalisation step for outbound contact export.

---

## 6. File creation and naming

The flow creates a date-stamp prefix using:

- `@formatDateTime(utcNow(),'yyyyMMdd')`

It then names files as:

- `YYYYMMDD_DSR_ActiveContacts.csv`
- `YYYYMMDD_DSR_ProspectContacts.csv`
- `YYYYMMDD_DSR_ActiveOrganisations.csv`
- `YYYYMMDD_DSR_ProspectOrganisations.csv`

### SharePoint output path

Each file is created in:

- `https://disabilitysportrecreation.sharepoint.com/sites/DSRD365Assests`
- folder: `/Shared Documents/PCP Files`

The logic app writes the actual CSV content using the `Table` action over the relevant array, and then uses the SharePoint `CreateFile` action to store it.

---

## 7. Outbound handoff to Azure Logic App

After each file is created, the flow posts an HTTP request to a single Azure Logic App endpoint.

The payload sent is:

- `fileName`
- `filePath`

This is the handoff point from DSR to the next integration stage.

### Observed HTTP call pattern

The call uses:

- method: `POST`
- URI: Azure Logic App invoke endpoint
- body:
  - `fileName`: from `Create_Active_File` or `Create_Prospect_File`
  - `filePath`: from SharePoint file metadata

This shows that the DSR flow is intentionally handing off a file as a discrete integration artifact rather than directly updating PCP in-line.

### Important limitation

The repository does not contain the Logic App definition behind that HTTP URL. The repo therefore confirms the handoff, but not the downstream processing that receives or imports the file.

---

## 8. End-to-end processing flow

The business process implemented in the repo is therefore:

1. A Contact or Account is assigned the `ESC__PHONE_QUEUE` segment tag.
2. The PCP flow searches for all matching contact/account tag records.
3. The system retrieves the related Contact or Account details.
4. The values are normalised for outbound telephony, including phone stripping and CRM link generation.
5. The record is split into Active vs Prospect buckets based on `hit_dlfcode`.
6. Each bucket is converted to a CSV table and written to a SharePoint file.
7. The created file is uploaded to `/Shared Documents/PCP Files`.
8. The flow calls the Azure Logic App with the file name and path as the handoff payload.
9. The downstream PCP or call-center process is expected to read, validate, and process that file outside the repository.

---

## 9. What is confirmed versus inferred

### Confirmed in repo

- DSR uses the `ESC__PHONE_QUEUE` tag to select records for phone-queue export.
- Records are segmented into active/prospect groups.
- Contact and organisation records are exported as CSV files.
- Files are written to SharePoint in a dedicated PCP folder.
- File metadata is posted to an Azure Logic App endpoint.
- Export rows contain names, phone numbers, email, location, and CRM links.

### Not confirmed in repo

- Whether PCP reads SharePoint directly or via an API.
- Whether the Azure Logic App moves files via SFTP, email, or a network share.
- Whether PCP validates record IDs, deduplicates rows, or rejects malformed data.
- Whether the import is successful or failing after handoff.
- Whether there is a downstream status update back to Dataverse.

The safest interpretation is: the repository confirms an outbound file-generation and integration handoff, not the full external PCP processing lifecycle.

---

## 10. Operational risk and governance observations

Several characteristics show the process is operationally sensitive:

- It exports personal contact information (phone, name, email, CRM URL).
- It hardcodes `Location = VIC` rather than deriving from each record.
- It strips spaces but does not apply deeper validation or formatting on phone patterns.
- It performs no explicit reconciliation, acknowledgement, or retry loop on the Dataverse side after the HTTP invoke.
- The file is created in a shared folder before the next stage is engaged.

This means the DSR solution is responsible for preparing the outbound payload, but the receiving system and its downstream result handling are outside the reviewed repository scope.

---

## Conclusion

The DSR solution implements a real outbound file export for PCP-style phone queue processing. The repository provides clear evidence that DSR identifies tagged records, builds structured contact and organisation files, stores them in SharePoint, and invokes an Azure Logic App with the output metadata.

What it does not provide is the final PCP-side import and processing behaviour. In effect, this repo covers the DSR preparation and handoff stage, not the complete end-to-end PCP operational lifecycle.
