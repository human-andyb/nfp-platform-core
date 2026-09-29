# Contact Tag Management

## Purpose
Explain how contact Segment Tags are applied, refreshed, and removed.

## Confirmed behaviour
The contact tagging child flow takes a contact id, a tag code, a dimension, an exclusive flag, and an add/remove mode. It looks up the segment tag and then reads any existing contact-tag rows for the same contact and same tag.

## Relationship owner
The owning record for the relationship is `hit_contactsegmenttag`.

## Assignment paths
- manual assignment from the tagging engine child flow
- automated assignment from recalc flows
- compliance assignment from contactability triggers
- import-driven assignment via tag import validation

## Duplicate prevention
The flow checks `_hit_contact_value` and `_hit_segmenttag_value` before creating a new row. If a row already exists, it returns success instead of inserting a duplicate.

## Exclusive-dimension handling
When the requested dimension is exclusive, the flow removes any existing contact tags in the same dimension before creating the new membership row.

## Removal
Remove mode deletes the matching `hit_contactsegmenttag` row. This is the clearest removal pattern in the reviewed implementation.

## Contact summary field
The `contact.hit_segmenttags` field is present as a flattened summary field, but the relationship row is the source of truth.
