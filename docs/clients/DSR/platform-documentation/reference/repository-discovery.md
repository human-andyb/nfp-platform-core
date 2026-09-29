# DSR Repository Discovery

## 1. Objective

This document records evidence-based discovery of the DSR implementation found in this repository. Findings are based on observed source artifacts only.

## 2. Scope

Primary source areas reviewed:

- `power-pages/nfp-base`
- `solutions/exports/unpacked/dsr`
- `docs/clients/DSR/analysis`

Path resolution note:

- `solutions/unpacked/DSR/DSRCustomisations` is empty in this workspace.
- Active unpacked solution content is under `solutions/exports/unpacked/dsr/...`.

## 3. Discovery Objective Coverage Matrix

| Objective | Evidence status | Primary evidence |
|---|---|---|
| 1. Identify major business capabilities | Confirmed | Acceptance/router templates, payment/stripe flows, tagging and fulfillment flows |
| 2. Identify major end-to-end processes | Confirmed | Acceptance to payment to completion chain in templates and flows |
| 3. Identify sub-processes per major process | Confirmed | Router state branches, template-specific acceptance variants, webhook/reconciliation branches |
| 4. Identify participating components | Confirmed | Component register covers templates, flows, tables, settings, and permissions |
| 5. Trace Power Pages/Dataverse/Flow dependencies | Confirmed | Router/template API calls and flow triggers on acceptance/payment entities |
| 6. Identify external integrations (Stripe/ETrainU) | Confirmed | Stripe and ETrainU API endpoints present in flow JSON |
| 7. Identify Dataverse CRUD locations | Confirmed | FetchXML + Web API in templates, Dataverse operations in flow definitions |
| 8. Identify invoked/associated flows | Confirmed | Workflow inventory under `Automation/Workflows` and `DSRCustomisations/Workflows` |
| 9. Identify security/access controls | Confirmed | Web API settings, table permissions, web role bindings |
| 10. Evidence confidence tagging | Confirmed | Confirmed / Partially confirmed / Unconfirmed classification applied |

## 4. Major Business Capabilities

| Capability | Evidence | Confidence |
|---|---|---|
| Acceptance orchestration and route control | `power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html` | Confirmed |
| Offering-specific acceptance UX | `sections--acceptance-donation`, `event`, `course`, `membership`, `volunteer`, `download`, `sponsorship`, `eoi`, `venue`, `form` | Confirmed |
| Payment initiation and reconciliation | `offering-acceptance---payment` + Stripe flows/webhooks in `solutions/exports/unpacked/dsr/.../Workflows` | Confirmed |
| Fulfillment lifecycle handling | `trigger_OfferingFulfillment-Orchestrator-...json`, `OfferingSpecificFulfillmentHandlerchild-...json` | Partially confirmed |
| Segmentation/tagging automation | `ApplySegmentTagschild-...json`, `TaggingEngine-*` child flows | Confirmed |
| ETrainU participant/organisation provisioning | `ETrainU-CreateorGetParticipantChild-...json`, `ETrainU-CreateorGetOrganisationChild-...json` | Confirmed |
| CI/Journeys custom event plumbing | `msdynmkt_eventmetadataset/*/msdynmkt_eventmetadata.xml` | Partially confirmed |

## 5. End-To-End Process Map

| Process | Sub-processes | Participating components | Confidence |
|---|---|---|---|
| Acceptance initiation and routing | Load acceptance, resolve status, route by offering type | `sections--acceptance-router`, `pages--platform-renderer`, `hit_offeringacceptance`, `hit_offering` | Confirmed |
| Acceptance data capture | Template-specific input capture and PATCH | All `sections--acceptance-*` templates and `/_api/hit_offeringacceptances(...)` calls | Confirmed |
| Pending payment validation | Poll status endpoint and retry routing | Router JavaScript + `Http_AcceptanceStatusValidation-...json` | Confirmed |
| Stripe payment creation | Create payment transaction, create payment intent, persist identifiers | `offering-acceptance---payment`, `Stripe_CreatePaymentIntent-...json`, `hit_paymenttransactions` | Confirmed |
| Stripe webhook reconciliation | Event verification and Dataverse state update | `StripeWebhookHandler-PaymentIntentUpdateDataverse-...json`, `StripeWebhookHandler-SetupIntentUpdateDataverse-...json` | Confirmed |
| Fulfillment progression | Orchestrated and specialized fulfillment handling | `trigger_OfferingFulfillment-Orchestrator-...json`, `OfferingSpecificFulfillmentHandlerchild-...json` | Partially confirmed |
| Segmentation updates | Rules-based contact/organisation tag updates | `ApplySegmentTagschild-...json`, `TaggingEngine-*` flows | Confirmed |
| External training integration | Create/get participant and organisation records via API | ETrainU child flows | Confirmed |

## 6. Cross-Component Dependency Chain

1. `pages--platform-renderer` includes `sections--acceptance-router` for acceptance app-mode sections.
2. Router FetchXML reads acceptance and offering context.
3. Router selects `sections--acceptance-*` template by offering type and status.
4. Acceptance template performs Web API create/update on acceptance and related tables.
5. Payment template uses `Flow/PaymentIntentUrl` and `Flow/SetupIntentUrl` from site settings.
6. Flow layer creates/updates payment transactions and Stripe identifiers.
7. Router polling calls status validation flow for transition from pending payment.

## 7. Dataverse CRUD Evidence Summary

Portal evidence:

- Read: FetchXML on `hit_offeringacceptance`, `hit_offering`, and template-specific entities.
- Create: acceptance creation path in `sections--acceptance-event`.
- Update: acceptance PATCH operations across acceptance templates.
- Related create/update: venue acceptance flow uses `hit_OfferingAcceptance@odata.bind` for related record creation.

Flow evidence:

- `trigger_OfferingAcceptance-Orchestrator`: read/update acceptance, read offering.
- `Http_AcceptanceStatusValidation`: read acceptance and compute state outcomes.
- `Stripe_CreatePaymentIntent`: list/create/update payment transaction records.
- Stripe webhooks: update transaction and Stripe-related entities.

## 8. Security And Access Control Evidence

- Web API settings enabled: `WebApi/Enabled`, `WebApi/EntityPermissionsEnabled`.
- Acceptance API explicitly enabled and field-scoped: `Webapi/hit_offeringacceptance/enabled`, `Webapi/hit_offeringacceptance/fields`.
- Table permissions observed for acceptance, offerings, payment transaction, and venue booking request.
- Web role GUID mappings resolve to `Anonymous Users` and `Authenticated Users`.

## 9. Integration Evidence

| Integration | Evidence | Confidence |
|---|---|---|
| Stripe | Flow endpoints in site settings, Stripe flows/webhooks, `hit_StripeSecretKey` env var definition | Confirmed |
| ETrainU | ETrainU child flows with `api.etrainu.com` calls | Confirmed |
| Customer Insights Journeys | CI entities and custom event metadata present | Partially confirmed |

## 10. Confidence Summary

| Area | Status |
|---|---|
| Acceptance routing, template branching, and portal CRUD | Confirmed |
| Stripe payment intent/setup/webhook architecture | Confirmed |
| ETrainU integration flow presence and API usage | Confirmed |
| Fulfillment branch-level behavior completeness | Partially confirmed |
| CI journey runtime inventory in this export | Partially confirmed |
| Full flow-branch field mutation map | Partially confirmed |

## 11. Evidence Gaps

- `Flow/AcceptanceStatusValidation` is referenced by templates but was not found in `power-pages/nfp-base/sitesetting.yml` during this pass.
- Full branch-level mutation mapping for fulfillment child flows remains incomplete.
- Exported CI journey runtime artifacts were not conclusively identified in reviewed unpacked content.

## 12. Risk Signals

- Unpacked flow JSON includes secret-like credential values. Treat as repository secret hygiene risk and review source-control and environment variable practices.
