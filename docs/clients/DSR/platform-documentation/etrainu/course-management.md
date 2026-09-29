# Course Management

## Purpose
Describe the DSR course-access lifecycle from offering setup through learner access provisioning and downstream record keeping.

## Business context
DSR does not manage course identity entirely inside Dataverse. It uses Dataverse for acceptance, registration, and relationship tracking, while ETrainU acts as the external training platform for organisations, participants, and access assignment.

## Confirmed lifecycle
1. An offering is marked as course-access enabled.
2. A learner or organisation opens the course acceptance path in Power Pages.
3. The acceptance record captures audience and access-plan values.
4. A parent Power Automate flow chooses the correct provisioning branch.
5. ETrainU receives organisation or participant create-or-get requests.
6. Dataverse stores the returned ETrainU identifiers on the course records.

## Core record types
- `hit_OfferingAcceptance` stores course-acceptance context.
- `hit_CourseDefinition` stores the ETrainU organisation or location mapping.
- `hit_CourseRegistration` stores the ETrainU participant mapping and access flags.
- `hit_RegionalArea` and `hit_VicPostcodes` provide regional routing for PWD access.

## Course audiences
- Individual / PWD access
- Organisation access
- Organisation member access

## What Dataverse owns
- acceptance and routing state
- contact and organisation references
- registration and mapping records
- regional lookup data

## What ETrainU owns
- learner identity
- organisation/location identity
- access assignment in the LMS
- the live training experience

## Supporting evidence
- `power-pages/nfp-base/web-templates/sections--acceptance-course/sections--acceptance-course.webtemplate.source.html`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
