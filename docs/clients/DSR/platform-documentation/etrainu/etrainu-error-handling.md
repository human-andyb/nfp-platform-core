# ETrainU Error Handling

## Purpose
Document the failure patterns that are visible in the repository and the boundaries that are not visible.

## Confirmed handling patterns
- create-or-get logic reduces duplicate participant and organisation creation
- child flows can branch on existing records and update rather than always insert
- the orchestration remains in Power Automate, so failures surface as flow failures rather than silent portal-only errors

## Visible gaps
- no explicit retry policy is documented in the unpacked flows
- no completion reprocessor is visible
- no dead-letter queue or compensating transaction layer is present in the reviewed artifacts

## Practical operational risks
- API authentication failure
- participant search returning no match when one is expected
- location lookup mismatch for the region or redemption code
- Dataverse write failure after ETrainU succeeds

## Recommended response model
- record the acceptance and flow run id
- retry only if the failure is transient and idempotent
- reconcile the Dataverse row to the ETrainU id after recovery

## Evidence
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
