# Input JSON Contract

## Purpose

Define the canonical `hit_inputjson` structure for venue submission payloads captured via `hit_offeringacceptance`.

This contract is designed to be reusable across offering types with offering-specific fields added as needed.

---

## Field Storage Pattern

- Direct columns (for operational reporting/search):
- `hit_firstname`
- `hit_lastname`
- `hit_email`

- Canonical payload column:
- `hit_inputjson`

---

## Versioning

- `schemaVersion` is required.
- Current version: `1`.
- Backward-compatible additions are preferred.

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
- `dates` (array of date ranges)
- `schoolnfp` (boolean)

Optional keys:

- `mobile` (string)
- `layouttype` (string)
- `description` (string)

### Dates Structure

- `dates` is an array of objects.
- Each object includes:
- `startdate` (`YYYY-MM-DD`)
- `enddate` (`YYYY-MM-DD`)

Rules:

- Ranges are inclusive.
- Single-date booking is represented as one range where `startdate == enddate`.
- Multiple date ranges are represented as multiple entries.
- `enddate` must not be earlier than `startdate`.

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
      "startdate": "2026-09-14",
      "enddate": "2026-09-16"
    }
  ],
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

---

## Cross-Offering Reuse Guidance

When expanding to other offering types:

- Keep envelope keys (`schemaVersion`, `offeringtype`) consistent.
- Reuse core identity keys where relevant.
- Add offering-specific keys without removing existing keys unless version changes require it.
- Update `08-architecture-decisions.md` when contract behavior changes.
