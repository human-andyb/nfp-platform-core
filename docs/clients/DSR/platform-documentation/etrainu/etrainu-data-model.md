# ETrainU Data Model

## Purpose
Describe the Dataverse entities and the ETrainU data exchange pattern used by the course-management capability.

## Core Dataverse entities
- `hit_OfferingAcceptance`
- `hit_CourseDefinition`
- `hit_CourseRegistration`
- `hit_RegionalArea`
- `hit_VicPostcodes`
- `account`
- `contact`

## Data-mapping table
| DSR field or row | ETrainU concept | Usage |
| --- | --- | --- |
| `hit_CourseDefinition.hit_courseid` | ETrainU location id | stores the organisation or location identity |
| `hit_CourseDefinition.hit_Organisation` | organisation account | links the course definition back to the DSR account |
| `hit_CourseDefinition.hit_PrimaryContact` | primary contact | anchors the organisation contact in DSR |
| `hit_CourseRegistration.hit_etrainuid` | participant id | stores the ETrainU learner identifier |
| `hit_CourseRegistration.hit_CourseDefinition` | course definition | links enrolment to the organisation/location mapping |
| `hit_CourseRegistration.hit_Contact` | contact | links the learner to the DSR person record |
| `hit_CourseRegistration.hit_etrainuregionname` | region name | stores the resolved region for access |
| `hit_CourseRegistration.hit_pwdstream1` | PWD stream | flags individual access routing |
| `hit_CourseRegistration.hit_orgmemberstream2` | org-member stream | flags member-based access routing |
| `hit_OfferingAcceptance.hit_courseaccessaudience` | audience | drives the provisioning branch |
| `hit_OfferingAcceptance.hit_courseaccessplan` | plan | drives the portal form shape |

## Relationship summary
- `hit_CourseRegistration` points to `hit_CourseDefinition`.
- `hit_CourseDefinition` points to `account` and `contact`.
- The portal reads acceptance and offering data, but does not write ETrainU identifiers directly.

## Ownership model
- Dataverse owns the business record and audit trail.
- ETrainU owns the operational LMS identity.
- The integration keeps both sides aligned by storing the ETrainU ids back in Dataverse.
