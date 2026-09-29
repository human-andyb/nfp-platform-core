[Top: Documentation Home](../README.md) | [Integration Landscape](../05-integration-landscape.md) | [Operations](../operations/operations-runbook.md)

# ETrainU Integration

This page is the entry point for the DSR course-management and ETrainU documentation set.

The implemented pattern is:
1. a course-access acceptance is created in Dataverse,
2. the course-specific portal branch collects registration details,
3. a Power Automate parent flow calls the ETrainU child flows,
4. the child flows create or resolve the ETrainU organisation and participant records,
5. Dataverse stores the returned IDs on `hit_CourseDefinition` and `hit_CourseRegistration`.

## Read next
- [Overview](etrainu-overview.md)
- [Course management](course-management.md)
- [Course publication and acceptance](course-publication-and-acceptance.md)
- [Participant management](participant-management.md)
- [Course provisioning](course-provisioning.md)
- [Enrolment management](enrolment-management.md)
- [Completion processing](completion-processing.md)
- [API integration](etrainu-api-integration.md)
- [Flow catalogue](etrainu-flow-catalogue.md)
- [Data model](etrainu-data-model.md)
- [Error handling](etrainu-error-handling.md)
- [Diagrams](etrainu-diagrams.md)

## Confirmed implementation surface
- Portal branch: `power-pages/nfp-base/web-templates/sections--acceptance-course/sections--acceptance-course.webtemplate.source.html`
- Parent orchestrator: `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json`
- Organisation child flow: `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
- Participant child flow: `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- Dataverse tables: `hit_offeringacceptance`, `hit_coursedefinition`, `hit_courseregistration`, `hit_regionalarea`, `hit_vicpostcodes`, `account`, `contact`

## Evidence-safe note
The unpacked flow artifacts contain inline authentication material. This documentation intentionally omits those values and describes only the authentication pattern and API surfaces.

[Next: Course Management](course-management.md)
