# ETrainU Overview

## Purpose
Summarize the course-management capability and explain why DSR uses ETrainU at all.

## Business context
DSR uses ETrainU as the external learning platform for course access, participant identity, organisation/location identity, and access assignment. Dataverse remains the system of record for acceptance, registration, and mapping data, while ETrainU remains the system of record for the live LMS records.

## What is managed where
- Dataverse manages acceptance, course-definition rows, course-registration rows, regional lookups, and portal state.
- ETrainU manages the actual learner and organisation records used by the LMS.
- Power Automate bridges the two systems.
- Power Pages captures the course-access user journey.

## Confirmed implementation path
1. course access is selected in the portal
2. acceptance values are written back to Dataverse
3. a parent flow chooses the correct course-access branch
4. the organisation child flow creates or resolves the ETrainU location record
5. the participant child flow creates or resolves the ETrainU learner record
6. Dataverse stores the returned ids on the course records

## Boundary notes
- The repository does not show a full completion-import pipeline from ETrainU back to Dataverse.
- The unpacked flow exports include inline credential material, but this documentation intentionally redacts those values.

## Entry points
- [Course management](course-management.md)
- [API integration](etrainu-api-integration.md)
- [Flow catalogue](etrainu-flow-catalogue.md)
- [Data model](etrainu-data-model.md)
