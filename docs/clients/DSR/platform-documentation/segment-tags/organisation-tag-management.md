# Organisation Tag Management

## Purpose
Explain how organisation Segment Tags are applied, refreshed, and removed.

## Confirmed behaviour
The organisation tagging child flow takes an organisation id, a tag code, a dimension, an exclusive flag, and an add/remove mode. It resolves the tag definition, checks for existing organisation-tag rows, and either creates or deletes rows accordingly.

## Relationship owner
The owning record for the relationship is `hit_accountsegmenttag`.

## Assignment paths
- manual assignment from the tagging engine child flow
- automated assignment from recalc flows
- import-driven assignment through import tag validation
- downstream population flows such as phone queue file generation can read segment tags for organisation inclusion

## Duplicate prevention
The flow checks `_hit_account_value` and `_hit_segmenttag_value` before inserting a new row.

## Exclusive-dimension handling
If the dimension is exclusive, the flow removes other organisation tags in the same dimension before creating the replacement row.

## Removal and active state
The entity exposes `hit_isactive`, `hit_removedon`, `hit_tagrule`, `hit_tagsource`, `statecode`, and `statuscode`, which makes organisation tag relationships suitable for both hard removal and status-based lifecycle control.

## Organisation summary field
The `account.hit_segmenttags` field is present as a flattened summary field, but the relationship row remains the source of truth.
