# ETrainU Flow Catalogue

## Purpose
List the implemented flows and show how they interact with Dataverse and ETrainU.

## Flow catalogue
| Flow | Role | Main inputs | Main outputs | External calls | Dataverse touchpoints |
| --- | --- | --- | --- | --- | --- |
| OfferingSpecificFulfillmentHandlerchild | Parent orchestrator | acceptance, fulfillment, audience | branch decision | none directly in the reviewed slice | reads acceptance and dispatches child flows |
| ETrainU-CreateorGetOrganisationChild | Organisation provisioning | acceptance, account, expiry date | ETrainU organisation id | authenticate, list locations, create location | reads `hit_CourseDefinition`, creates/updates `hit_CourseDefinition` |
| ETrainU-CreateorGetParticipantChild | Participant provisioning | acceptance, contact, postcode, region | ETrainU participant id | authenticate, search participants, create/update participant | creates/updates `hit_CourseRegistration` |

## Process-component matrix
| Process | Portal | Power Automate | Dataverse | ETrainU |
| --- | --- | --- | --- | --- |
| course acceptance | course acceptance template | parent orchestration | `hit_OfferingAcceptance` | none yet |
| organisation provisioning | acceptance form inputs | organisation child flow | `hit_CourseDefinition` | locations |
| participant provisioning | acceptance form inputs | participant child flow | `hit_CourseRegistration` | participants |
| enrolment tracking | read-only confirmation | same provisioning flow | registration row + mappings | participant identity |

## Notes
- The flow catalogue intentionally mirrors the repository evidence rather than assuming additional hidden jobs.
- Completion processing is not represented as an implemented flow in the reviewed exports.
