# Participant Management

## Purpose
Document how DSR creates, resolves, updates, and tracks ETrainU participants.

## Confirmed participant flow
The participant child flow authenticates to ETrainU, searches for an existing participant by email, creates a participant when none is found, or updates the existing participant when one already exists.

## Data used to build the participant request
- contact first name and last name
- email address
- postcode
- external constituent identifier
- region or sub-organisation identifier

## ETrainU participant endpoints
- `POST /lms/v3/participants/search`
- `POST /lms/v3/participants`
- `PUT /lms/v3/participants/{id}`

## Dataverse writes
- `hit_CourseRegistration.hit_etrainuid`
- `hit_CourseRegistration.hit_Contact`
- `hit_CourseRegistration.hit_CourseDefinition`
- stream and region flags used by the portal and reporting model

## Branch behavior
- PWD access resolves a region and location using postcode and regional-area data.
- Organisation-member access uses the redemption-code path when a location is available.
- The flow keeps create-or-get semantics to avoid duplicate ETrainU participants.

## Evidence
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_CourseRegistration/Entity.xml`
