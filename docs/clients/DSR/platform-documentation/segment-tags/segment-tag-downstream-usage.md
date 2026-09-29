# Segment Tag Downstream Usage

## Purpose
Explain how Segment Tags are consumed after assignment.

## Downstream usage confirmed in the repo
- supporter and organisation segmentation views
- active tagged contact views
- export or queue preparation flows
- import validation and migration processes
- contactability and suppression rules
- reporting dependencies through related views and saved queries

## Customer Insights and journey usage
The solution metadata shows dependencies on `msdyncrm_customerjourney`, `msdynmkt_journey`, `msdynmkt_segment`, and related marketing solution components. However, the reviewed exports do not include the actual Customer Insights segment or journey definitions. Because of that, the repository only supports a limited conclusion: Segment Tags are likely used as one of the data inputs or dependencies for Customer Insights and journey logic, but the exact segment/journey configuration is not exposed here.

## Reporting dependencies
The solution contains views for active tagged contacts, contact tags, organisation tags, and other tag-based lists. Those views indicate reporting and operational screens depend on the tag relationships remaining current.

## Processes that depend on tag continuity
- communication suppression
- audience targeting
- donor and supporter lifecycle reporting
- outbound queue preparation
- import reconciliation

## Tag rule matrix
| Tag or Tag Category | Applies To | Trigger | Conditions | Flow | Source Data | Relationship Created or Updated | Removal Rule | Downstream Usage | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CON` suppression tags | Contact | contactability trigger | opt-out or do-not-contact state | `TaggingEngine-PopulateDoNotContactTagsChild`, `trigger_ContactDoNotEmail` | contact preferences | `hit_contactsegmenttag` | remove on opt-in / remove mode | communication exclusion | [flow catalogue](segment-tag-flow-catalogue.md) |
| `ENG` engagement tags | Contact and Organisation | recalc | engagement recency / frequency thresholds | `TaggingEngine-RecalcContactStateTagschild`, `TaggingEngine-RecalcOrganisationStateTagschild` | engagement metrics, dates | `hit_contactsegmenttag`, `hit_accountsegmenttag` | replace same-dimension tag | engagement reporting, campaign targeting | [core rules](../../analysis/core-segment-tag-business-rules.md) |
| `VAL` value tags | Contact and Organisation | recalc | lifetime value thresholds | `TaggingEngine-RecalcContactStateTagschild`, `TaggingEngine-RecalcOrganisationStateTagschild` | giving totals | `hit_contactsegmenttag`, `hit_accountsegmenttag` | replace same-dimension tag | fundraising prioritisation | [core rules](../../analysis/core-segment-tag-business-rules.md) |
| `LIF` lifecycle tags | Contact and Organisation | recalc | lifecycle month windows | `TaggingEngine-RecalcContactStateTagschild`, `TaggingEngine-RecalcOrganisationStateTagschild` | recency and giving history | `hit_contactsegmenttag`, `hit_accountsegmenttag` | replace same-dimension tag | stewardship and lifecycle reporting | [core rules](../../analysis/core-segment-tag-business-rules.md) |
| `DLF` donor lifecycle tags | Contact and Organisation | recalc | donor frequency / lifecycle state | `TaggingEngine-RecalcContactStateTagschild`, `TaggingEngine-RecalcOrganisationStateTagschild` | donation counts and dates | `hit_contactsegmenttag`, `hit_accountsegmenttag` | replace same-dimension tag | fundraising lifecycle views | [core rules](../../analysis/core-segment-tag-business-rules.md) |
| import tags | Contact and Organisation | import validation | `hit_applyimporttags` and stage records | `trigger_ImportContacts-ValidationProcess`, `trigger_ImportOrganisations-ValidationProcess` | `hit_importcontact`, `hit_importorganisation`, `hit_importtag` | `hit_contactsegmenttag`, `hit_accountsegmenttag` | import row state / stale row cleanup | migration and transition control | [solution inventory](../../analysis/solution-inventory.md) |
