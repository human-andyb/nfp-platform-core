# Course Provisioning

## Purpose
Explain how DSR provisions the ETrainU organisation or location record that represents the course-access container.

## Confirmed provisioning path
The organisation child flow reads the acceptance, resolves the related account, checks whether a course-definition record already exists, authenticates to ETrainU, searches locations, and creates a new location only when no existing record matches.

## Data model behavior
- `hit_CourseDefinition` stores the ETrainU location identifier in `hit_courseid`
- the course definition also stores the related organisation and primary contact
- the flow uses a fixed region value in the captured implementation

## ETrainU location endpoints
- `POST /lms/v3/authenticate`
- `GET /lms/v3/locations?region=...`
- `POST /lms/v3/locations`

## What the flow does when no record exists
1. create a location in ETrainU
2. capture the returned location id
3. create a `hit_CourseDefinition` row in Dataverse
4. bind it to the related account and contact

## Evidence
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_CourseDefinition/Entity.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Other/Relationships.xml`
