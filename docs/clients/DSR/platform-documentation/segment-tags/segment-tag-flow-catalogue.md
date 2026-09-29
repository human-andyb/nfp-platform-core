# Segment Tag Flow Catalogue

## Purpose
List the confirmed flows that create, remove, refresh, or stage Segment Tags.

## Flow catalogue
| Flow | Role | Trigger | Tables | Outcome |
| --- | --- | --- | --- | --- |
| ApplySegmentTagschild | General tag application | child flow | `hit_segmenttag`, `hit_contactsegmenttag`, `hit_accountsegmenttag`, `contact`, `account` | applies tags for a constituent or organisation |
| TaggingEngine-AddNewContactSegmentTagChild | Contact tag add/remove | child flow | `hit_segmenttag`, `hit_contactsegmenttag`, `contact` | creates or removes contact membership rows |
| TaggingEngine-AddNewOrganisationSegmentTagChild | Organisation tag add/remove | child flow | `hit_segmenttag`, `hit_accountsegmenttag`, `account` | creates or removes organisation membership rows |
| TaggingEngine-RecalcContactStateTagschild | Contact recalculation | recalculation flow | `contact`, `hit_contactsegmenttag`, `hit_segmenttag` | refreshes contact dimension tags |
| TaggingEngine-RecalcOrganisationStateTagschild | Organisation recalculation | recalculation flow | `account`, `hit_accountsegmenttag`, `hit_segmenttag` | refreshes organisation dimension tags |
| TaggingEngine-PopulateDoNotContactTagsChild | Suppression tagging | trigger child flow | `contact`, `hit_contactsegmenttag`, `hit_segmenttag` | applies or removes suppression tags |
| trigger_ContactDoNotEmail | Opt-out trigger | Dataverse trigger | `contact`, `hit_contactsegmenttag` | updates do-not-email handling |
| trigger_ImportContacts-ValidationProcess | Contact import staging | Dataverse trigger | `hit_importcontact`, `hit_importtag`, `hit_segmenttag` | applies imported tag rows to contact records |
| trigger_ImportOrganisations-ValidationProcess | Organisation import staging | Dataverse trigger | `hit_importorganisation`, `hit_importtags`, `hit_segmenttag` | applies imported tag rows to organisation records |
| PCPContactFileGeneration-EscalatetoPhoneQueueChild | Reporting / queue preparation | flow child | `hit_segmenttags`, `hit_contactsegmenttags` | reads segment tags for queueing |
| PCPOrganisationFileGeneration-EscalatetoPhoneQueue | Reporting / queue preparation | flow | `hit_segmenttags`, `hit_accountsegmenttags` | reads segment tags for organisation queueing |

## Notes
- The import flows reference `hit_importtags` and the live tag definition table, which shows the migration path is not separate from the tagging model.
- The evaluated PCP flows use segment tags as filter inputs, which makes them downstream consumers rather than tag creators.
