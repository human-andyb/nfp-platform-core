# ETrainU integration business process and technical trace

## Executive summary

The DSR solution does integrate with ETrainU, and the integration is implemented as a Power Automate orchestration layer in Dataverse rather than as custom code in a .NET or JavaScript service.

The confirmed pattern is:

1. A course access acceptance is created or fulfilled in Dataverse (`hit_offeringacceptance` / `hit_offeringfulfillment`).
2. A parent orchestration flow branches on the audience (`Individual`, `Organisation`, `Organisation Member`) and calls an ETrainU child workflow.
3. The child workflow authenticates to the ETrainU LMS API, resolves or creates the ETrainU organisation/location record, and resolves or creates the participant record.
4. Dataverse then writes the returned ETrainU identifiers and mapping state back into the DSR records (`hit_coursedefinitions`, `hit_courseregistrations`, related contact/account mappings).
5. The organisation/member experience is then completed through the redemption code / region / stream logic.

This is a real, production-style LMS provisioning flow, not a stub or demo.

> Important: the repo contains the integration logic and the connector usage, but it does not contain the ETrainU application-side business rules or the remote system’s internal data model. Anything beyond the HTTP contract and the Dataverse writes should be treated as inferred or externally managed.

---

## Evidence base used

The implementation is directly evidenced in the unpacked solution exports:

- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_OfferingAcceptance/Entity.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_CourseRegistration/Entity.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_CourseDefinition/Entity.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/hit_RegionalArea/Entity.xml`

The integration is not a custom C# or JavaScript implementation; it is an HTTP-based integration inside Power Automate flows.

---

## 1. Why ETrainU is used

ETrainU is used as the learning management / learner access provider for DSR course access. The evidence shows that DSR is not trying to manage all course access itself inside Dataverse; it delegates the actual learner and location identity to ETrainU and then records the resulting identifiers back into Dataverse.

The repo makes that clear in several ways:

- The child flow names are explicitly `ETrainU - Create or Get Organisation (Child)` and `ETrainU - Create or Get Participant (Child)`.
- The HTTP calls target `https://api.etrainu.com/lms/v3/...`.
- The integration stores ETrainU IDs in Dataverse attributes such as `hit_courseid`, `hit_etrainuid`, `hit_etrainuregionname`, and related course registration fields.
- The workflow logic assigns audience-specific access paths, including PWD access, organisation membership, and redemption-code driven access.

In business terms, ETrainU is the system of record for:

- course locations / organisations / sub-organisations
- learner participant identities
- access assignment and member grouping
- region-based access mapping
- learner login / access credentials for the training environment

---

## 2. Which business processes depend on ETrainU

The ETrainU integration is tied to the course-access part of the DSR offering lifecycle, not to generic fundraising or payment processing.

### 2.1 Course access fulfillment

The main orchestrator is the fulfillment handler:

- `OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json`

This workflow reads an `hit_offeringfulfillment`, resolves the related offering and acceptance, then switches on `hit_courseaccessaudience` and triggers ETrainU provisioning.

The branch logic is:

- `Individual - PWD` => calls the participant flow
- `Organisation` => calls the organisation flow
- `Organisation Member` => calls the participant flow for org-member access

### 2.2 Organisation-based learning access

The organisation flow creates or finds the ETrainU organisation/location mapping for the customer account and stores the resulting ETrainU organisation identifier into a `hit_coursedefinition` record.

This is the path used when an organisation is being set up as a training location or sub-org in ETrainU.

### 2.3 Individual learner provisioning

The participant flow creates or finds an ETrainU participant based on learner email and contact identity, and then records the participant mapping in a `hit_courseregistration` record.

This covers PWD individual access and organisation-member access cases.

### 2.4 Redemption-code access for organisation members

The participant flow specifically reads `hit_redemptioncode` and uses the org-member access route. This indicates that some learners are not directly created under a DSR organisation record; instead they are granted access through a code-based organisation stream and then mapped back to the same course registration structure.

---

## 3. How the integration is wired in Dynamics 365

The flow pattern is deterministic and concrete:

1. A Power Automate child workflow is invoked from the fulfillment handler.
2. The child workflow reads the `hit_offeringacceptance` record by ID.
3. It reads related `account`, `contact`, and regional / offering metadata from Dataverse.
4. It authenticates to ETrainU using the HTTP connector.
5. It calls the ETrainU LMS API using `x-api-key` + Bearer token authentication.
6. It resolves or creates the required place / participant record in ETrainU.
7. It writes back the returned ETrainU IDs into Dataverse records.

This is a classic Dataverse-to-external-system integration pattern using Power Automate child flows as the orchestration layer. The Microsoft Dataverse connection is `shared_commondataserviceforapps` and the actions are standard `GetItem`, `ListRecords`, `CreateRecord`, and `UpdateOnlyRecord` requests.

---

## 4. Record exchange between Dataverse and ETrainU

### 4.1 Dataverse records read and used to drive provisioning

The key Dataverse objects and fields are:

- `hit_offeringacceptance`
  - `hit_offeringacceptanceid`
  - `_hit_contact_value`
  - `_hit_organisation_value`
  - `hit_email`
  - `hit_postcode`
  - `hit_redemptioncode`
  - `hit_courseaccessaudience`
  - `hit_courseaccessplan`
  - `hit_organisationinput`
  - `hit_contactroleinput`
- `contact`
  - `contactid`
  - `firstname`
  - `lastname`
  - `emailaddress1`
  - `address1_postalcode`
  - `hit_constituentid`
  - `fullname`
- `account`
  - `accountid`
  - `name`
  - `accountnumber`
- `hit_regionalarea`
  - `hit_etrainuid`
  - `hit_etrainuname`
  - `_hit_regionalarea_value` from the postcode lookup
- `hit_vicpostcodes`
  - matched using the learner postcode and then linked to regional area
- `hit_coursedefinitions`
  - `hit_courseid` stores the ETrainU organisation/location ID
  - `hit_name`
  - `hit_Organisation` lookup
  - `hit_PrimaryContact`
  - `hit_expirydate`
  - `hit_maxmembers`
- `hit_courseregistrations`
  - `hit_etrainuid`
  - `hit_etrainuregionname`
  - `hit_orgmemberstream2`
  - `hit_pwdstream1`
  - `hit_postcode`
  - `hit_CourseDefinition`
  - `hit_Contact`

### 4.2 ETrainU record types used

The flows clearly call:

- `locations`
  - used as the organisation or sub-organisation record in ETrainU
- `participants`
  - used as the learner identity in ETrainU
- `participants/search`
  - used to find an existing participant by email

The organisation flow creates or finds a location based on region and name. The participant flow creates or updates an ETrainU participant with `externalId`, `firstName`, `lastName`, `email`, `postcode`, `subOrgId`, and username.

---

## 5. How learners are provisioned

The participant provisioning workflow is the clearest evidence of the learner lifecycle.

### 5.1 Decision path

The child workflow starts by reading the `OfferingAcceptance` and the contact, then initialises variables such as:

- `sLocationID`
- `sRegionID`
- `sRegionName`
- `sETrainUParticipantID`
- `sParticipantGuid`
- `bAddParticipant`
- `bAddStream2`
- `bIsPWD`

It then switches on `hit_courseaccessaudience`:

- `Individual - PWD` => sets region and location based on postcode / regional area
- `Organisation Member` => uses `hit_redemptioncode` for org member assignments
- `Organisation` => sets the organisation route separately

### 5.2 Search for existing participant

When `bAddParticipant` is true, the workflow posts to:

- `POST https://api.etrainu.com/lms/v3/participants/search`

with:

- `email: @{outputs('OfferingAcceptance')?['body/hit_email']}`

If a matching participant is found, the response is parsed and the first matching record’s `id` is assigned to `sETrainUParticipantID`.

### 5.3 Create new participant

If no existing ETrainU participant is found, it calls:

- `POST https://api.etrainu.com/lms/v3/participants`

with payload fields including:

- `externalId`: `contact.hit_constituentid`
- `firstName`: `contact.firstname`
- `lastName`: `contact.lastname`
- `email`: `contact.emailaddress1`
- `postCode`: `contact.address1_postalcode`
- `subOrgId`: `sLocationID`
- `username`: `contact.emailaddress1`

The response is parsed and the created participant `id` is captured to the variable `sETrainUParticipantID`.

### 5.4 Update existing participant

If the participant already exists, the flow calls:

- `PUT https://api.etrainu.com/lms/v3/participants/{id}`

and updates at least:

- `externalId`
- `subOrgId`

This ensures the participant is associated with the correct sub-organisation / training region.

---

## 6. How enrolments are managed

The enrolment is represented in Dataverse as a `hit_courseregistration` record. The flow creates or updates this record based on whether the learner already has a registration for the contact.

The logic is:

- query `hit_courseregistrations` for records matching `_hit_contact_value == contactid`
- if a record exists, update it
- otherwise create a new `hit_courseregistrations` row

The created/updated record includes:

- `hit_Contact@odata.bind` to the `contact`
- `hit_etrainuid` = ETrainU participant ID
- `hit_etrainuregionname` = mapped region name
- `hit_orgmemberstream2` = boolean stream designation for org members
- `hit_pwdstream1` = boolean stream designation for PWD access
- `hit_postcode` = learner postcode
- `hit_CourseDefinition@odata.bind` = linked `hit_coursedefinition` when a course definition exists

This means Dataverse acts as the DSR-side tracking layer, while ETrainU remains the live LMS user/access layer.

---

## 7. How courses are assigned

Course assignment is not done by a separate course catalog at the flows’ layer. Instead, the system assigns a course/location definition and then binds the learner registration to that definition.

### 7.1 Organisation / course definition mapping

The organisation flow searches `hit_coursedefinitions` for an existing record where:

- `_hit_organisation_value` equals the account
- or `hit_courseid` equals the ETrainU location ID

If an ETrainU organisation is missing, it creates a location via:

- `POST https://api.etrainu.com/lms/v3/locations`

with:

- `name = account.name`
- `externalId = account.accountnumber`
- `region = 185701`

The returned location `id` is then stored in Dataverse as `hit_courseid` on the `hit_coursedefinition` row.

### 7.2 Mapping the registration to a course definition

When an organisation member or org-based participant is found, the flow sets:

- `hit_CourseDefinition@odata.bind = /hit_coursedefinitions(<guid>)`

This effectively links the learner’s course registration to the ETrainU organisation/course definition row. The exact course catalog is therefore represented in Dataverse as a course definition record that stores the ETrainU system identifier.

---

## 8. How training access is granted

Training access is granted by setting the learner’s `subOrgId` and by assigning the appropriate region / location / stream value.

### 8.1 Region and location resolution

The participant flow resolves the correct ETrainU location using a mix of:

- postcode lookup to `hit_vicpostcodes`
- `hit_regionalareas`
- the mapped `hit_etrainuid` and `hit_etrainuname`
- default fallback values such as `185820` / `Gippsland`

This establishes the correct ETrainU site / region for the learner.

### 8.2 PWD access

For the `PWD` path, the flow sets:

- `sRegionID = 185700`
- `sLocationID` = region’s ETrainU location ID or a default location
- `bIsPWD = true`

### 8.3 Organisation access

For the `Organisation` flow, the location is pulled from the organisation record and then stored in the ETrainU organisation definition.

### 8.4 Organisation member access

For `Organisation Member`, the flow uses:

- `hit_redemptioncode` as the location ID for the membership stream
- `subOrgId = <redemption code value>`
- optional `bAddStream2 = true`

This suggests the ETrainU side differentiates member access by a separate sub-org membership stream or redemption path.

---

## 9. How training completion is captured

The repository does not show a completed end-to-end “mark learner complete in ETrainU and push completion back into Dataverse” flow.

What is clearly present is:

- participant creation/update
- course registration tracking
- region assignment
- stream flags
- `hit_etrainuid` and related mapping values

What is not clearly present in the reviewed repo is a direct ETrainU completion callback or an API call such as:

- `GET /participants/{id}/completions`
- `POST /completion` or equivalent
- webhook ingestion from ETrainU back into Dataverse

The repo evidence shows that DSR stores ETrainU participant IDs and registration metadata, but not a full completion synchronization contract. In other words, the integration is strong on provisioning and access, and weaker or absent in the repo for result/result import automation.

That should be treated as a real gap in the visible implementation, not as proof that ETrainU does not capture completions externally.

---

## 10. How results are returned

Result return is not fully visible in the repo.

The workflows do not show:

- a result polling job
- an ETrainU webhook listener
- a parsing flow for completion, score, certificate, or module results

The only returning information from ETrainU that is explicitly persisted in Dataverse is:

- `hit_etrainuid`
- `hit_etrainuregionname`
- `hit_courseid`
- participant and course definition mapping metadata

So the repo evidence supports the idea that ETrainU provides access identity and course membership, but not that DSR currently ingests learner completion results or assessment scores from ETrainU into Dataverse in the reviewed implementation.

---

## 11. Which automation supports the process

The main automation objects are:

### 11.1 Parent fulfillment orchestrator

- `OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json`

This determines whether the offering is a donation, event, or course access item and then runs the ETrainU child workflow as appropriate.

### 11.2 Organisation provisioning flow

- `ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json`

This flow:

- reads `OfferingAcceptance`
- resolves the account / organisation
- queries existing `hit_coursedefinitions`
- authenticates to ETrainU
- lists locations for the region
- matches or creates the organisation/location
- stores the returned ETrainU ID back to Dataverse

### 11.3 Participant provisioning flow

- `ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json`

This flow:

- reads the acceptance and contact
- resolves region and location by postcode / region / redemption code
- authenticates to ETrainU
- searches for an existing participant by email
- creates or updates the participant
- updates or creates the `hit_courseregistrations` record
- stores access flags and mapping data in Dataverse

---

## 12. Dataverse tables that participate in the integration

The confirmed Dataverse tables involved are:

- `hit_offeringacceptance`
  - source of the acceptance data and audience values
- `hit_offeringfulfillment`
  - parent triggering record for course fulfillment events
- `hit_offering`
  - linked offer metadata including audience and access configuration
- `account`
  - organisation/customer record used in ETrainU org provisioning
- `contact`
  - learner record used in participant provisioning
- `hit_regionalarea`
  - maps postcode and region to ETrainU region metadata
- `hit_vicpostcodes`
  - postcode mapping into region / area
- `hit_coursedefinition`
  - stores the ETrainU organisation/location identity (`hit_courseid`)
- `hit_courseregistration`
  - stores the ETrainU participant ID and access metadata
- `hit_communicationevents`
  - records confirmations and communication events for the access lifecycle

---

## 13. API surface used by the integration

The flows use the following ETrainU API pattern.

### 13.1 Authentication

- `POST https://api.etrainu.com/lms/v3/authenticate`
- Headers include:
  - `x-api-key: <key>`
  - `Content-Type: application/json`
- Body includes:
  - `username`
  - `password`
- Result stores `idtoken` and uses it as bearer token for subsequent requests

### 13.2 Organisation/location management

- `GET https://api.etrainu.com/lms/v3/locations?region=185701`
- `POST https://api.etrainu.com/lms/v3/locations`

The organisation flow retrieves the list of locations for a region and then creates a location if no match is found.

### 13.3 Participant management

- `POST https://api.etrainu.com/lms/v3/participants/search`
- `POST https://api.etrainu.com/lms/v3/participants`
- `PUT https://api.etrainu.com/lms/v3/participants/{id}`

These endpoints are used to find, create, and update learner records in ETrainU.

---

## 14. Which manual processes still exist

The repo does not show a fully automated end-to-end ETrainU admin workflow. Several manual or externally managed tasks are still implied:

- learner registration or access may still require a user to visit the external ETrainU portal or accept access instructions
- organisation administrators may need to share a redemption code
- the ETrainU system itself likely manages the user experience inside the LMS
- if completion or results are tracked externally, that interaction is not visible in the repo and therefore must be manually managed or handled outside of the DSR solution package

The integration is clearly not purely manual, but it is also not fully self-contained: the ETrainU application side still holds part of the operational process outside Dataverse.

---

## 15. Practical interpretation of the process

The most defensible business summary is:

- DSR uses ETrainU as the training access platform for learner and organisation provisioning.
- An offering acceptance is the trigger for provisioning.
- Dataverse decides whether the learner is an individual, organisation, or organisation member and then calls the appropriate ETrainU API route.
- ETrainU returns IDs and access metadata that DSR persists back into Dataverse.
- Dataverse then represents the learner/course relationship with `hit_courseregistrations` and the course definition with `hit_coursedefinitions`.
- Manual or external ETrainU-side workflows still exist for the actual course experience and likely for results reporting, because the repository does not show a complete completion ingestion job.

---

## 16. Traceability matrix

| Concern | Evidence in repo |
| --- | --- |
| Parent ETrainU trigger | `OfferingSpecificFulfillmentHandlerchild...json` |
| Org provisioning flow | `ETrainU-CreateorGetOrganisationChild-...json` |
| Participant provisioning flow | `ETrainU-CreateorGetParticipantChild-...json` |
| Audience branching | `hit_courseaccessaudience` switch in `OfferingSpecificFulfillmentHandlerchild...json` |
| Region mapping | `hit_vicpostcodes`, `hit_regionalareas`, `hit_etrainuid`, `hit_etrainuname` |
| Organisation record creation | `POST /lms/v3/locations` |
| Participant record creation | `POST /lms/v3/participants` |
| Participant lookup | `POST /lms/v3/participants/search` |
| Dataverse org mapping | `hit_coursedefinitions.hit_courseid` |
| Dataverse participant mapping | `hit_courseregistrations.hit_etrainuid` |
| Access flags | `hit_pwdstream1`, `hit_orgmemberstream2` |
| External auth | `POST /lms/v3/authenticate` |
| Missing completion import | No explicit ETrainU completion API or webhook shown in repo |

---

## Closing assessment

The exact Dynamics 365 integration pattern is: Dataverse-owned process orchestration in Power Automate, external LMS interaction via HTTP to ETrainU, and Dataverse persistence of the identifiers and access metadata that are required to keep the DSR operational model in sync with ETrainU.

The integration is therefore real and operationally important, especially for:

- training access creation
- organisation / course definition mapping
- learner provisioning
- group membership and access routing
- redemption-code / region-based member access

It is not fully visible in the repo for completion-result capture, which suggests that the external ETrainU system still owns some of the user-facing learning lifecycle beyond the provisioning and access layer.
