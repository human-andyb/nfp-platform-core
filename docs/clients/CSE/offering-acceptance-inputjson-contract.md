# Offering Acceptance inputJSON Contract

## Purpose

Define one consistent inputJSON payload contract across acceptance templates so orchestration can process Venue, EOI, and Donation with one shared parsing model.

## Scope

Applies to:

- sections--acceptance-venue
- sections--acceptance-eoi
- sections--acceptance-donation

Stored in:

- hit_offeringacceptance.hit_inputjson

## Common Contract (schemaVersion 2)

The following top-level keys are required for all offering types:

- schemaVersion (number)
- offeringtype (string)
- firstname (string)
- lastname (string)
- email (string)
- mobile (string or null)
- organisation (string or null)
- role (string or null)
- totalbaseamount (number or null)
- offering (object)

Rules:

- All listed keys must always exist.
- mobile, organisation, and role use null when not supplied.
- totalbaseamount uses null when not applicable for the offering type.
- All user-entered strings are trimmed before serialization.

## Offering-Specific Object

### Venue

offeringtype: venue

offering object:

- type: venue
- bookingtype: string
- dates: array
- layouttype: string or null
- description: string or null
- schoolnfp: boolean

Each dates item includes:

- date: string (YYYY-MM-DD)
- sessionType: string
- layoutType: string
- billingType: string
- baseFee: number

### EOI

offeringtype: eoi

offering object:

- type: eoi
- actingonbehalfoforganisation: boolean

### Donation

offeringtype: donation

offering object:

- type: donation

Donation amount is stored only in top-level totalbaseamount.

## Backward Compatibility

- Existing direct acceptance column writes remain in place.
- Orchestrator parses hit_inputjson first.
- For schemaVersion 1 or missing hit_inputjson records, orchestrator falls back to legacy parsing/direct columns.

## Confirmation Rendering Precedence

For venue confirmation rendering:

- `hit_inputsummary` is the primary source when available.
- `hit_inputjson` is the fallback source when summary is missing or not yet populated.

Operational note:

- `hit_inputsummary` may be populated asynchronously after submit by downstream automation.
- Fallback to `hit_inputjson` is therefore intentional and required for immediate confirmation rendering.

## Example: Venue

{
  "schemaVersion": 2,
  "offeringtype": "venue",
  "firstname": "Andy",
  "lastname": "Barker",
  "email": "andy@example.org",
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

## Example: EOI

{
  "schemaVersion": 2,
  "offeringtype": "eoi",
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane@example.org",
  "mobile": null,
  "organisation": "Example Org",
  "role": "Program Manager",
  "totalbaseamount": null,
  "offering": {
    "type": "eoi",
    "actingonbehalfoforganisation": true
  }
}

## Example: Donation

{
  "schemaVersion": 2,
  "offeringtype": "donation",
  "firstname": "Sam",
  "lastname": "Lee",
  "email": "sam@example.org",
  "mobile": null,
  "organisation": null,
  "role": null,
  "totalbaseamount": 120,
  "offering": {
    "type": "donation"
  }
}
