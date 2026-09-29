# Segment Tag Technical Design

## Architecture
The technical design uses Dataverse tables plus Power Automate child flows. Segment Tags are directly stored in Dataverse membership rows and are not computed only at runtime.

## Tables and ownership
- `hit_segmenttag` owns the tag definition and metadata.
- `hit_contactsegmenttag` owns contact membership.
- `hit_accountsegmenttag` owns organisation membership.
- `hit_contactorgsegmenttag` owns relationship-level tagging.
- `hit_importtag` stages tag import and migration operations.

## Tag source and category fields
Confirmed definition fields include:
- `hit_code`
- `hit_description`
- `hit_dimension`
- `hit_dimensionprefix`
- `hit_tagtype`
- `hit_issystemtag`

Confirmed membership fields include:
- `hit_dimension`
- `hit_appliedon`
- `hit_appliedbyflow`
- `hit_isactive`
- `hit_removedon`
- `hit_tagrule`
- `hit_tagsource`

## Status and effective/expiry fields
The reviewed solution shows active/inactive status and removal dates on the junction entities and staging entities. The repo does not show a dedicated expiry-table design for all tags, but it does show expiry-oriented fields on some relationship entities and import state control.

## Power Automate pattern
The flows use a common pattern:
1. identify the tag definition by code
2. query existing membership rows
3. remove same-dimension memberships if required
4. create the new row
5. return success to the caller

## Data source of truth
The membership rows are the source of truth. The Contact and Account `hit_segmenttags` fields are summary or convenience fields and should not be treated as the authoritative relationship store.

## Import and migration logic
`hit_importtag` is the migration/import anchor. The import validation flows query `hit_importtags` and then use the referenced `hit_segmenttag` row to apply or stage the correct tag relationship.
