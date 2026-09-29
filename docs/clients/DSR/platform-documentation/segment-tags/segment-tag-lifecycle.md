# Segment Tag Lifecycle

## Lifecycle events confirmed in the implementation
- tag definition creation
- tag assignment
- automated assignment
- manual assignment
- import assignment
- tag refresh
- tag expiry / removal
- duplicate prevention
- reassignment within a dimension
- contact merge impact not evidenced directly
- organisation merge impact not evidenced directly
- downstream consumption

## Lifecycle flow
1. A tag definition is created in `hit_segmenttag`.
2. A flow resolves the definition by `hit_code`.
3. The flow checks whether the target already has the tag.
4. If the dimension is exclusive, conflicting memberships are removed.
5. A new membership row is created in `hit_contactsegmenttag` or `hit_accountsegmenttag`.
6. The membership row may update a summary field or feed downstream views and reporting.

## Tag refresh
Refresh is implemented as a recalculation or re-application event. The contact and organisation recalc child flows re-evaluate the current state and then call the add/remove logic as required.

## Tag removal or expiry
- direct remove mode deletes the membership row
- exclusive-dimension refresh removes the prior row before adding the new one
- `hit_removedon` and `statecode/statuscode` are available on the junction entities, but the reviewed flows primarily show hard-delete removal rather than a soft-delete pattern

## Merge impact
The repo does not show an explicit contact-merge or organisation-merge handler for Segment Tags. Because the membership rows are tied directly to the record id, a merge would need to preserve or remap those relationships somewhere else in the solution; that behavior was not evidenced in the reviewed exports.
