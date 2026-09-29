# Enrolment Management

## Purpose
Describe how the DSR side records enrolment and keeps the learner-course relationship synchronized with ETrainU identifiers.

## Confirmed behavior
The repo shows enrolment as a `hit_CourseRegistration` row that is created or updated based on whether a matching contact registration already exists.

## Recorded enrolment data
- contact reference
- course definition reference
- ETrainU participant id
- region name
- postcode
- PWD stream flag
- organisation-member stream flag

## Enrolment semantics
- DSR does not appear to create a separate generic enrolment service.
- The course-registration row is the system of record on the DSR side.
- ETrainU remains the live LMS enrolment and access system.

## Evidence
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Other/Relationships.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/AppModules/new_DSRMVP/AppModule.xml`
