# Segment Tag Data Model

## Core entities
- `hit_segmenttag`
- `hit_contactsegmenttag`
- `hit_accountsegmenttag`
- `hit_contactorgsegmenttag`
- `hit_importtag`

## Relationship summary
| Entity | Role | Key fields or links |
| --- | --- | --- |
| `hit_segmenttag` | tag definition | `hit_code`, `hit_tagtype`, `hit_dimension`, `hit_dimensionprefix`, `hit_issystemtag`, `hit_description` |
| `hit_contactsegmenttag` | contact membership | contact lookup, segment tag lookup, `hit_dimension`, `hit_addedon`, `hit_isactive`, `hit_removedon` |
| `hit_accountsegmenttag` | organisation membership | account lookup, segment tag lookup, `hit_dimension`, `hit_appliedon`, `hit_appliedbyflow`, `hit_isactive`, `hit_removedon`, `hit_tagrule`, `hit_tagsource` |
| `hit_contactorgsegmenttag` | relationship membership | contact-organisation lookup, segment tag lookup, `hit_dimension`, `hit_expireson`, `hit_tagsource` |
| `hit_importtag` | migration/import staging | `hit_isactive`, statecode, statuscode, segment tag lookup |

## Contact vs organisation differences
- Contact tags use `hit_contactsegmenttag` and are driven by contact and communication state.
- Organisation tags use `hit_accountsegmenttag` and are driven by account-level state and donor/engagement logic.
- Both use the same `hit_segmenttag` definition table.

## History table check
No dedicated historical tag-event table was identified in the reviewed solution exports. The closest lifecycle controls are the active/inactive, removed-on, and staging/import fields on the membership and import entities.

## Summary fields
- `contact.hit_segmenttags`
- `account.hit_segmenttags`

These appear to be convenience fields for display and reporting, not the authoritative storage for the relationship.

## Views and reporting objects
The solution includes saved views such as Contact Tags, Organisation Tags, Contact Segment Tag views, and Active Tagged Contacts. These are downstream consumers of the membership model.
