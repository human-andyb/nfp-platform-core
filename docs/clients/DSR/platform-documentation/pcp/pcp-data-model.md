# PCP Data Model

## Purpose
Summarise the Dataverse data structures used by the PCP export.

## Confirmed Tables and Columns
| Business Name | Logical Name | PCP Purpose | Read By | Updated By | Key Columns | Relationships | Security |
|---|---|---|---|---|---|---|---|
| Contact | `contact` | supporter export source | eligibility flow, PCP contact export | eligibility flow | `hit_nexteligiblecontactdate`, `hit_allowoutbound`, `mobilephone`, `donotphone`, `donotemail`, `donotbulkemail`, `hit_dlfcode`, `hit_constituentid` | tagged by contact segment tags | Dataverse role and table permissions |
| Account | `account` | organisation export source | PCP organisation export | queue/tagging and content admins | `accountnumber`, `name`, `telephone1`, `telephone2`, `telephone3`, `emailaddress1`, `hit_dlfcode` | tagged by account segment tags | Dataverse role and table permissions |
| Segment Tag | `hit_segmenttag` | queue definition source | export flows | admins and tagging flows | `hit_code`, `hit_segmenttagid` | linked to contact/account tags | export-only via flow |
| Contact Segment Tag | `hit_contactsegmenttag` | contact queue membership | PCP contact export | tagging flows | `_hit_contact_value`, `_hit_segmenttag_value` | contact to segment tag | flow-managed |
| Account Segment Tag | `hit_accountsegmenttag` | organisation queue membership | PCP organisation export | tagging flows | `_hit_account_value`, `_hit_segmenttag_value` | account to segment tag | flow-managed |

## Data-Model Notes
- The contact and account membership tables are the source of truth for queue membership.
- The `ESC__PHONE_QUEUE` tag is the queue anchor used by the PCP export.
- The CSV export adds a derived CRM URL and a fixed location value.

## Related Documents
- [Contact selection](pcp-contact-selection.md)
- [CSV file specification](pcp-csv-file-specification.md)
- [Status model](pcp-status-model.md)
