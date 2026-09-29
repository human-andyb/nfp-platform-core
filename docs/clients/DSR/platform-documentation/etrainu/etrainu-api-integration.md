# ETrainU API Integration

## Purpose
Document the external HTTP contract used by the DSR ETrainU flows.

## Authentication pattern
The flows authenticate to `https://api.etrainu.com/lms/v3/authenticate`, receive an ID token, and send that token as a bearer token on subsequent calls. The unpacked flow artifacts contain inline credential material, so this document intentionally omits the literal values.

## Confirmed endpoints
- `POST /lms/v3/authenticate`
- `GET /lms/v3/locations?region=...`
- `POST /lms/v3/locations`
- `POST /lms/v3/participants/search`
- `POST /lms/v3/participants`
- `PUT /lms/v3/participants/{id}`

## Observed headers
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <token>`
- `x-api-key: <redacted>`

## Integration characteristics
- Power Automate HTTP actions are used directly.
- Create-or-get semantics are used to avoid duplicate LMS records.
- The Dataverse connection remains the orchestration anchor.

## Evidence
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
