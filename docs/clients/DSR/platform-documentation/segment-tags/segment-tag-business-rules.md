# Segment Tag Business Rules

## Business model
The repository shows a dimensioned tagging engine, not a free-form tagging note field. Tags are grouped by tag type and dimension, with some dimensions treated as exclusive.

## Confirmed rules
1. The source-of-truth for membership is the junction table, not the Contact or Account summary field.
2. A tag definition is looked up by `hit_code`.
3. The engine checks for an existing contact or organisation membership before creating a row.
4. Exclusive dimensions remove competing tags before the new tag is added.
5. Derived tags are recalculated from engagement or fundraising state.
6. Import rows can stage tag application and link back to the definition table.

## Tag categories observed in the repo
- `CON` for contactability / suppression
- `ENG` for engagement state
- `VAL` for value tier
- `LIF` for lifecycle
- `DLF` for donor lifecycle / donation frequency

## What triggers assignment
- manual add or remove requests from the tagging engine child flows
- recalculation flows for contact and organisation state tags
- contactability triggers such as Do Not Email handling
- import and migration processes via `hit_importtag`

## How existing tag relationships are found
The flows query the membership table with both the target record id and the target segment tag id. For example, the contact flow checks `_hit_contact_value` and `_hit_segmenttag_value`; the organisation flow checks `_hit_account_value` and `_hit_segmenttag_value`.

## How duplicates are prevented
The engine first checks whether the target already has the selected tag. If the tag exists, it returns success without creating another row. For exclusive dimensions it also removes conflicting rows in the same dimension before creating a new row.

## How invalid or obsolete tags are handled
- stale tag rows are removed through explicit delete actions in the flows
- inactive import rows are present in the staging model
- `hit_removedon`, `statecode`, and `statuscode` provide lifecycle controls on the junction entities and staging entities

## Limitations
The repo does not expose the full tag catalog or every business rule row in a separate configuration export, so some tag meanings must be inferred from the flow and view names.
