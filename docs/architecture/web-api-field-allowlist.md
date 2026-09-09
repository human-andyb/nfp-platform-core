# Web API Field Allowlist

## Purpose

Define how portal Web API field allowlists are governed when acceptance templates read or update Dataverse rows.

Portal Web API enforces allowlist-based access at table level. Field writes that are not allowlisted fail at runtime.

## Scope

Applies to table-specific site settings in this pattern:

- `Webapi/<table logical name>/fields`

This document is focused on offering acceptance updates used by booking and acceptance templates.

## Venue Example

Current venue submit path updates the `hit_offeringacceptance` table and requires these amount fields:

- `hit_baseamount`
- `hit_gstamount`
- `hit_totalamounteffective`

Corresponding site setting:

- `Webapi/hit_offeringacceptance/fields`

When adding `hit_gstamount` to payload writes, the same field must be added to the allowlist setting before deployment completes.

## Change Process

1. Identify all fields read/written by the template payload.
2. Compare payload fields against current `Webapi/<table>/fields` allowlist.
3. Add only missing required fields (least-privilege approach).
4. Deploy and perform a full submit/readback validation in target environment.
5. Update architecture/decision docs if the change affects cross-template behavior.

## Validation Checklist

1. Submit flow succeeds with no Web API attribute allowlist errors.
2. Updated fields persist correctly in Dataverse.
3. No unrelated sensitive fields were added to allowlist.
4. Confirmation/readback paths can access required summary fields.

## Risks and Guardrails

- Over-allowlisting increases data exposure risk.
- Under-allowlisting causes runtime submission failures.
- Keep payload contract decisions separate from allowlist decisions:
- `hit_inputjson` contract stability is governed in offering contract docs.
- Allowlist governs runtime access permissions only.

## Related Documents

- [platform-architecture.md](platform-architecture.md)
- [../clients/CSE/venue-booking/08-architecture-decisions.md](../clients/CSE/venue-booking/08-architecture-decisions.md)
- [../clients/CSE/venue-booking/09-inputjson-contract.md](../clients/CSE/venue-booking/09-inputjson-contract.md)
