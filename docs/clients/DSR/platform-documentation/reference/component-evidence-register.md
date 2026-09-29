# DSR Component Evidence Register

Evidence status scale:

- Confirmed: directly observed in repository artifacts.
- Partially confirmed: observed, but branch/runtime completeness not fully established.
- Unconfirmed: not evidenced in reviewed artifacts.

## 1. Acceptance Template Coverage

| Component | Repository path | Primary operations observed | Key entities/fields observed | Confidence |
|---|---|---|---|---|
| `sections--acceptance-router` | `power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html` | FetchXML read, state routing, polling trigger | `hit_offeringacceptance`, `hit_offering`, `hit_acceptancestatus`, `hit_paymentrequired`, `hit_stripepaymentintentid` | Confirmed |
| `sections--acceptance-donation` | `power-pages/nfp-base/web-templates/sections--acceptance-donation/sections--acceptance-donation.webtemplate.source.html` | FetchXML read, Web API PATCH | Acceptance contact/pricing/status fields | Confirmed |
| `sections--acceptance-event` | `power-pages/nfp-base/web-templates/sections--acceptance-event/sections--acceptance-event.webtemplate.source.html` | FetchXML read, Web API create | Offering event fields and acceptance create set | Confirmed |
| `sections--acceptance-course` | `power-pages/nfp-base/web-templates/sections--acceptance-course/sections--acceptance-course.webtemplate.source.html` | FetchXML read, Web API PATCH | Course access, redemption, contact, offering fields | Confirmed |
| `sections--acceptance-membership` | `power-pages/nfp-base/web-templates/sections--acceptance-membership/sections--acceptance-membership.webtemplate.source.html` | FetchXML read, Web API PATCH | Acceptance + offering form presentation fields | Confirmed |
| `sections--acceptance-volunteer` | `power-pages/nfp-base/web-templates/sections--acceptance-volunteer/sections--acceptance-volunteer.webtemplate.source.html` | FetchXML read, Web API PATCH | Contact/payment acceptance fields | Confirmed |
| `sections--acceptance-download` | `power-pages/nfp-base/web-templates/sections--acceptance-download/sections--acceptance-download.webtemplate.source.html` | FetchXML read, Web API PATCH | Acceptance contact and status fields | Confirmed |
| `sections--acceptance-sponsorship` | `power-pages/nfp-base/web-templates/sections--acceptance-sponsorship/sections--acceptance-sponsorship.webtemplate.source.html` | FetchXML read, Web API PATCH | Acceptance pricing/status fields | Confirmed |
| `sections--acceptance-eoi` | `power-pages/nfp-base/web-templates/sections--acceptance-eoi/sections--acceptance-eoi.webtemplate.source.html` | FetchXML read, Web API PATCH | `hit_dsreoirole`, org/contact role inputs, contact fields | Confirmed |
| `sections--acceptance-venue` | `power-pages/nfp-base/web-templates/sections--acceptance-venue/sections--acceptance-venue.webtemplate.source.html` | FetchXML read, Web API PATCH, related create with bind | Acceptance, offering, venue, booking, hold, blackout, inclusion entities | Confirmed |
| `sections--acceptance-form` | `power-pages/nfp-base/web-templates/sections--acceptance-form/sections--acceptance-form.webtemplate.source.html` | FetchXML read, Web API PATCH | Generic acceptance and linked offering fields | Confirmed |

## 2. Wrapper And Orchestration Components

| Component | Repository path | Role in process | Confidence |
|---|---|---|---|
| `pages--platform-renderer` | `power-pages/nfp-base/web-templates/pages--platform-renderer/pages--platform-renderer.webtemplate.source.html` | Detects slot template and includes `sections--acceptance-router` in app mode | Confirmed |
| `offering-acceptance---payment` | `power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html` | Payment intent/setup invocation surface using flow URLs and acceptance context | Confirmed |
| `offering-acceptance---complete` | `power-pages/nfp-base/web-templates/offering-acceptance---complete/Offering-Acceptance---Complete.webtemplate.source.html` | Post-payment completion API interactions | Partially confirmed |
| `offering-acceptance---resource` | `power-pages/nfp-base/web-templates/offering-acceptance---resource/Offering-Acceptance---Resource.webtemplate.source.html` | Resource-specific acceptance wrapper | Partially confirmed |
| `offering-acceptance---volunteer` | `power-pages/nfp-base/web-templates/offering-acceptance---volunteer/Offering-Acceptance---Volunteer.webtemplate.source.html` | Volunteer-specific acceptance wrapper | Partially confirmed |

## 3. Flow Evidence Register

| Flow | Repository path | Trigger type | Dataverse operations observed | Integration/API evidence | Confidence |
|---|---|---|---|---|---|
| `trigger_OfferingAcceptance-Orchestrator` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json` | Dataverse webhook (`hit_offeringacceptance`) | Read/update acceptance, read offering | None direct external in sampled section | Confirmed |
| `Http_AcceptanceStatusValidation` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json` | HTTP request | Get acceptance, status transition variables, response payload | Endpoint consumed by portal polling | Confirmed |
| `Stripe_CreatePaymentIntent` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Stripe_CreatePaymentIntent-A105C745-FF0A-F111-8342-000D3A7A0323.json` | HTTP request (`stripe/createpaymentintent`) | List/create/update `hit_paymenttransactions`, read acceptance | Calls `api.stripe.com/v1/payment_intents` | Confirmed |
| `StripeCreateCustomerSetupIntent` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeCreateCustomerSetupIntent-C849EAE9-5627-F111-88B4-000D3A7A0035.json` | HTTP/manual | Read/create `hit_stripecustomers`, read acceptance | Calls Stripe customers and setup_intents endpoints | Confirmed |
| `StripeWebhookHandler-PaymentIntentUpdateDataverse` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json` | HTTP webhook | Query/update payment transaction and stripe fields | Calls Stripe events endpoint | Confirmed |
| `StripeWebhookHandler-SetupIntentUpdateDataverse` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-SetupIntentUpdateDataverse-764A95CB-E427-F111-88B4-000D3A7A0CAB.json` | HTTP webhook | Query/update stripe customer/payment method tables | Calls Stripe payment methods endpoint | Confirmed |
| `trigger_OfferingFulfillment-Orchestrator` | `solutions/exports/unpacked/dsr/Automation/Workflows/trigger_OfferingFulfillment-Orchestrator-96A0E9A4-3C4F-F111-BEC6-6045BD3E3ADF.json` | Dataverse trigger | Fulfillment-linked operations | None direct external in sampled pass | Partially confirmed |
| `OfferingSpecificFulfillmentHandlerchild` | `solutions/exports/unpacked/dsr/Automation/Workflows/OfferingSpecificFulfillmentHandlerchild-D8C86757-D757-F111-A825-000D3A7A0CAB.json` | Child workflow | Fulfillment-linked operations | None direct external in sampled pass | Partially confirmed |
| `ApplySegmentTagschild` | `solutions/exports/unpacked/dsr/Automation/Workflows/ApplySegmentTagschild-180211A2-A455-F111-A825-000D3A7A0323.json` | Child/manual | Read acceptance, offering, and offering tag rules | None direct external | Confirmed |
| `TaggingEngine-AddNewContactSegmentTagChild` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/TaggingEngine-AddNewContactSegmentTagChild-4DDF577C-B567-F111-AB0E-6045BDE72793.json` | Child/manual | List/create/delete contact segment tag records | None direct external | Confirmed |
| `TaggingEngine-AddNewOrganisationSegmentTagChild` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/TaggingEngine-AddNewOrganisationSegmentTagChild-9CA03E8A-BE67-F111-AB0E-70A8A555B733.json` | Child/manual | Organisation segment tag operations | None direct external | Confirmed |
| `ETrainU-CreateorGetParticipantChild` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetParticipantChild-BC11FAA3-ED95-F111-B8DB-6045BDC2342F.json` | Child/manual | Read acceptance and regional area mappings | Calls `api.etrainu.com` | Confirmed |
| `ETrainU-CreateorGetOrganisationChild` | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/ETrainU-CreateorGetOrganisationChild-65769D76-0796-F111-B8DB-6045BDC2338C.json` | Child/manual | Read acceptance, account, course definitions | Calls `api.etrainu.com` | Confirmed |

## 4. Dataverse Table And Field Register

| Table | Representative fields observed | Primary component/flow usage | Confidence |
|---|---|---|---|
| `hit_offeringacceptance` | `hit_offeringacceptanceid`, `hit_acceptancestatus`, `hit_paymentrequired`, `hit_stripepaymentintentid`, `hit_firstname`, `hit_lastname`, `hit_email`, `hit_mobilephone`, `hit_courseaccessaudience`, `hit_courseaccessplan`, `hit_dsreoirole` | Router, all acceptance templates, acceptance/payment flows | Confirmed |
| `hit_offering` | `hit_offeringid`, `hit_offeringname`, `hit_offeringtype`, `hit_displaytitle`, `hit_formheadline`, `hit_formsummary`, `hit_formdescription` | Router, acceptance templates, orchestrator flow | Confirmed |
| `hit_paymenttransaction` | `hit_amount`, `hit_attemptnumber`, `hit_attemptstatus`, `hit_stripepaymentintentid`, `hit_stripeeventid`, `hit_stripechargeid` | Stripe payment and webhook flows | Confirmed |
| `hit_stripecustomer` | Stripe customer identifiers and lookup/bind fields | Setup intent and webhook flows | Confirmed |
| `hit_stripepaymentmethod` | Stripe payment method identifiers and customer bindings | Setup intent webhook flow | Confirmed |
| `hit_venuespacebookingrequest` | Acceptance bind and booking request payload fields | Venue acceptance template | Confirmed |
| `hit_venuespace` and related venue tables | Capacity, image, inclusion, booking, hold, blackout fields | Venue acceptance template | Confirmed |
| `hit_segmenttag`, `hit_contactsegmenttag`, `hit_accountsegmenttag` | Tag code/id and tag relationship fields | Tagging flows | Confirmed |

## 5. Security And Configuration Evidence

| Artifact | Repository path | Evidence | Confidence |
|---|---|---|---|
| Web API global enablement | `power-pages/nfp-base/sitesetting.yml` | `WebApi/Enabled`, `WebApi/EntityPermissionsEnabled` present | Confirmed |
| Acceptance API enablement and field scope | `power-pages/nfp-base/sitesetting.yml` | `Webapi/hit_offeringacceptance/enabled`, `Webapi/hit_offeringacceptance/fields` | Confirmed |
| Payment/setup flow URLs | `power-pages/nfp-base/sitesetting.yml` | `Flow/PaymentIntentUrl`, `Flow/SetupIntentUrl` | Confirmed |
| Acceptance table permission | `power-pages/nfp-base/table-permissions/Offering-Acceptance---Create.tablepermission.yml` | Read/create/write permissions configured | Confirmed |
| Offering table permission | `power-pages/nfp-base/table-permissions/Offerings---Public.tablepermission.yml` | Public read configured | Confirmed |
| Payment transaction permission | `power-pages/nfp-base/table-permissions/Payment-Transaction---Read.tablepermission.yml` | Read configured | Confirmed |
| Venue booking request permission | `power-pages/nfp-base/table-permissions/Venue-Space-Booking-Request---Create.tablepermission.yml` | Read/create/write configured | Confirmed |
| Web roles | `power-pages/nfp-base/webrole.yml` | Role GUIDs map to `Anonymous Users` and `Authenticated Users` | Confirmed |

## 6. External Integration Register

| Integration | Repository evidence | Confidence |
|---|---|---|
| Stripe | Stripe flow set + Stripe API endpoints in flow HTTP actions + Stripe secret env var definition | Confirmed |
| ETrainU | ETrainU flows and `api.etrainu.com` endpoints in flow HTTP actions | Confirmed |
| Customer Insights | CI event metadata datasets and CI entities in solution artifacts | Partially confirmed |

## 7. Partial And Unconfirmed Items

| Item | Status | Notes |
|---|---|---|
| `Flow/AcceptanceStatusValidation` setting key in portal settings export | Partially confirmed | Referenced in templates but not found in sampled `sitesetting.yml` entries. |
| Full branch-level field mutation map for fulfillment flows | Partially confirmed | Entry points identified; complete branch trace not yet extracted. |
| Exported live CI journey instance inventory | Unconfirmed | CI plumbing is present; journey runtime inventory not conclusively evidenced. |

## 8. Risk Note

- Unpacked flow JSON contains secret-like values and credential-like patterns. Treat as repository secret hygiene risk and review immediately.
