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
- `hit_gstamount`
- `hit_totalamounteffective`

- Canonical payload column:
- `hit_inputjson`

---

## Versioning

- `schemaVersion` is required.
- Current version: `2`.
- Venue now follows the shared cross-offering contract with common top-level keys and a venue-specific `offering` object.

---

## Venue Payload Shape (v2)

Required keys:

- `schemaVersion` (number)
- `offeringtype` (string, value: `venue`)
- `firstname` (string)
- `lastname` (string)
- `email` (string)
- `mobile` (string or null)
- `organisation` (string or null)
- `role` (string or null, label value)
- `totalbaseamount` (number)
- `offering` (object)

Required venue offering keys:

- `type` (string, value: `venue`)
- `bookingtype` (string)
- `dates` (array of unique date entries)
- `schoolnfp` (boolean)

Optional venue offering keys:

- `layouttype` (string or null)
- `description` (string or null)

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

- Daily base-fee calculation order:
1. Select configured gross rate from `billingType`.
2. If `schoolnfp == true`, convert gross to base using divisor model: `gross / (1 + schoolNfpPercent/100)`.
3. If date is Saturday or Sunday, apply weekend surcharge percent to the calculated base fee.

- GST and totals:
1. `totalbaseamount` is the rounded sum of all `offering.dates[].baseFee` values.
2. GST is calculated as fixed 10% of `totalbaseamount`.
3. Total effective amount is `totalbaseamount + gst`.
4. GST and total-effective values persist to direct acceptance fields, not into new `hit_inputjson` keys for this release.

- Explicit exclusion:
- Public holiday surcharge is not applied in this release, even though the field is loaded.

- Persistence note:
- `hit_totalamount` may remain populated by legacy or downstream flows; venue submit path in this release writes `hit_baseamount`, `hit_gstamount`, and `hit_totalamounteffective`.

---

## Example Payload

```json
{
  "schemaVersion": 2,
  "offeringtype": "venue",
  "firstname": "Andy",
  "lastname": "Barker",
  "email": "andy.barker@example.org",
  "mobile": "0408123456",
  "organisation": "Example School",
  "role": "Coordinator",
  "totalbaseamount": 850,
  "offering": {
    "type": "venue",
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
    "layouttype": "Boardroom",
    "description": "Annual planning workshop.",
    "schoolnfp": true
  }
}
```

---

## Normalization Rules

- Trim all user-entered strings.
- Persist `role` as label text, not integer code.
- Always emit `offering.schoolnfp` explicitly as `true` or `false`.
- Preserve key names exactly as documented.
- Round currency outputs at 2 decimal places before summing totals.

---

## Cross-Offering Reuse Guidance

When expanding to other offering types:

- Keep the shared top-level keys identical across offerings.
- Place only genuinely offering-specific fields inside `offering`.
- For Donation, keep the amount only in top-level `totalbaseamount` and keep `offering` limited to `type`.
- Update `08-architecture-decisions.md` when contract behavior changes.

---

## Confirmation Rendering Usage

Venue confirmation route:

- `/venue-booking-submitted?acceptanceid=<guid>`

Rendering precedence:

- Use `hit_inputsummary` when present.
- Fall back to `hit_inputjson` when summary content is not yet available.

Operational note:

- `hit_inputsummary` may be populated asynchronously by downstream automation after submission.
- Maintaining stable `hit_inputjson` keys is required to keep fallback rendering deterministic.
