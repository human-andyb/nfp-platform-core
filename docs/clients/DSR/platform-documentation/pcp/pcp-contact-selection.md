# PCP Contact Selection

## Purpose
Explain how the export flows decide which records enter the PCP handoff.

## Confirmed Selection Rules
| Rule | Business Purpose | Dataverse Source | Column | Condition | Include or Exclude | Processing Component | Evidence |
|---|---|---|---|---|---|---|---|
| Outbound eligibility | Only contactable supporters should be exported | Contact | `hit_nexteligiblecontactdate` | date is on or before today | Include | `recurrence_BatchProcessContact-NextEligibleContact` | Confirmed |
| Outbound permission | Exclude contacts who cannot be called | Contact | `hit_allowoutbound` | equals true | Include | `recurrence_BatchProcessContact-NextEligibleContact` | Confirmed |
| Email branch | Send email-capable contacts to email queue instead of phone queue | Contact | `donotemail`, `donotbulkemail`, `emailaddress1` | email allowed and email present | Include in JRN branch | `recurrence_BatchProcessContact-NextEligibleContact` | Confirmed |
| Phone branch | Send phone-capable contacts to PCP phone queue | Contact | `mobilephone`, `donotphone` | mobile phone present and do-not-phone is false | Include in `ESC__PHONE_QUEUE` | `recurrence_BatchProcessContact-NextEligibleContact` | Confirmed |
| Queue export selection | Export only phone-queue members | Contact segment tag | `hit_segmenttagid` | segment tag code = `ESC__PHONE_QUEUE` | Include | PCP contact export flow | Confirmed |
| Queue export selection | Export organisation queue members | Account segment tag | `hit_segmenttagid` | segment tag code = `ESC__PHONE_QUEUE` | Include | PCP organisation export flow | Confirmed |
| Prospect bucket | Separate prospect records for downstream handling | Contact or account | `hit_dlfcode` | equals `DLF__PROSPECT` | Include in prospect file | PCP export flows | Confirmed |

## Selection Logic in Plain Language
The upstream eligibility flow decides whether a supporter is contactable. If the supporter can be contacted and has a mobile number, the record is tagged for the outbound phone queue. The PCP export then uses that queue tag to select the final export set.

## Related Documents
- [Overview](pcp-overview.md)
- [Queue management](pcp-queue-management.md)
- [Data model](pcp-data-model.md)
- [Evidence register](pcp-evidence-register.md)
