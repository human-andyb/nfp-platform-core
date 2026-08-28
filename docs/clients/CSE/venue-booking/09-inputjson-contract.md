# Input JSON Contract

## Purpose

Define the canonical `hit_inputjson` structure for venue submissions captured via `hit_offeringacceptance`.

---

## Field Storage Pattern

- Direct acceptance columns (for operational reporting/search and downstream payment):
- `hit_firstname`
- `hit_lastname`
- `hit_email`
- `hit_baseamount`
- `hit_totalamount`
- `hit_totalamounteffective`

- Canonical payload column:
- `hit_inputjson`

---

## Versioning

- `schemaVersion` is required.
- Current version: `1`.
- This change is a backward-compatible shape extension to `dates[]` plus `totalbasefee`.

---

## Venue Payload Shape (v1)

Required keys:

- `schemaVersion` (number)
- `offeringtype` (string, value: `venue`)
- `firstname` (string)
- `lastname` (string)
- `email` (string)
- `organisation` (string)
- `role` (string, label value)
- `bookingtype` (string)
- `dates` (array of unique date entries)
- `totalbasefee` (number)
- `schoolnfp` (boolean)

Optional keys:

- `mobile` (string)
- `layouttype` (string)
- `description` (string)

### Dates Structure

- `dates` is an array of objects.
- Each object includes:
- `date` (`YYYY-MM-DD`)
- `sessionType` (`fullDay`, `morning`, `afternoon`)
- `layoutType` (string)
- `billingType` (`FullDay` or `HalfDay`)
- `baseFee` (number)

Rules:

- `dates` contains unique selected days after de-duplication.
- `billingType` is derived from `sessionType`:
- `fullDay` -> `FullDay`
- `morning` -> `HalfDay`
- `afternoon` -> `HalfDay`
- `baseFee` is the final daily fee after applying pricing rules.

---

## Pricing Rules (Current Release)

- Rate source fields on `hit_venuespace`:
- `hit_fulldayrate`
- `hit_halfdayrate`
- `hit_schoolnfpdiscountpercent`
- `hit_weekendsurchargepercent`
- `hit_holidaysurchargepercent`

- Daily calculation order:
1. Select base rate from `billingType`.
2. If `schoolnfp == true`, apply School/NFP discount percent.
3. If date is Saturday or Sunday, apply weekend surcharge percent.

- Explicit exclusion:
- Public holiday surcharge is not applied in this release, even though the field is loaded.

- Total amount:
- `totalbasefee` is the rounded sum of all `dates[].baseFee` values.

---

## Example Payload

```json
{
  "schemaVersion": 1,
  "offeringtype": "venue",
  "firstname": "Andy",
  "lastname": "Barker",
  "email": "andy.barker@example.org",
  "mobile": "0408123456",
  "organisation": "Example School",
  "role": "Coordinator",
  "bookingtype": "815390001",
  "dates": [
    {
      "date": "2026-09-14",
      "sessionType": "fullDay",
      "layoutType": "Boardroom",
      "billingType": "FullDay",
      "baseFee": 425
    },
    {
      "date": "2026-09-15",
      "sessionType": "fullDay",
      "layoutType": "Boardroom",
      "billingType": "FullDay",
      "baseFee": 425
    }
  ],
  "totalbasefee": 850,
  "layouttype": "Boardroom",
  "description": "Annual planning workshop.",
  "schoolnfp": true
}
```

---

## Normalization Rules

- Trim all user-entered strings.
- Persist `role` as label text, not integer code.
- Always emit `schoolnfp` explicitly as `true` or `false`.
- Preserve key names exactly as documented.
- Round currency outputs at 2 decimal places before summing totals.

---

## Cross-Offering Reuse Guidance

When expanding to other offering types:

- Keep envelope keys (`schemaVersion`, `offeringtype`) consistent.
- Reuse core identity keys where relevant.
- Add offering-specific keys without removing existing keys unless version changes require it.
- Update `08-architecture-decisions.md` when contract behavior changes.
