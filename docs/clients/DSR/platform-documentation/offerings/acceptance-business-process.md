[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Business Process

## Business purpose
Capture user intent to engage with an offering, collect required participant data, and progress to the correct fulfillment path with controlled state transitions.

## Process summary
1. User views an offering and chooses continue.
2. System creates an acceptance shell record.
3. User is routed to type-specific acceptance experience.
4. Status transitions to one of: pending information, pending payment, pending approval, completed, failed, cancelled.
5. Completion branch shows confirmation (payment or non-payment variant).

## Process matrix
| Process Step | Business Purpose | Web Page | Web Template | JavaScript | Dataverse Tables | Flow | External System | Status Before | Status After | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| View offering details | Present offering proposition and available pricing/options | Renderer-driven offering page | sections--offering-detail | Inline script in template | hit_offering, hit_priceoption | None | None | N/A | N/A | [sections--offering-detail active/id filters](power-pages/nfp-base/web-templates/sections--offering-detail/sections--offering-detail.webtemplate.source.html#L70) |
| Initiate acceptance | Create process envelope for user action | Same as above | sections--offering-detail and/or scripts--acceptance-bootstrap | acceptance-bootstrap.js and template POST logic | hit_offeringacceptance | Trigger flow subscribes post-create/update | None | None | Draft (0) | [acceptance-bootstrap create + draft](power-pages/nfp-base/web-files/acceptance-bootstrap.js#L21) |
| Route to acceptance UI | Show correct type/status experience | accept page route with acceptanceid | sections--acceptance-router | Polling script for status validation | hit_offeringacceptance, hit_offering | Http_AcceptanceStatusValidation | Optional Stripe dependency signaled by fields | Draft or pending statuses | Branch dependent | [router status branch entry](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L202) |
| Collect type-specific details | Gather required information for selected offering type | Router-selected | sections--acceptance-* | Template-specific scripts | hit_offeringacceptance (+ related tables) | trigger_OfferingAcceptance-Orchestrator | Type dependent | Draft/Pending Information | Pending Payment or Pending Approval or Completed | [orchestrator progression guard seed](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L1098) |
| Execute payment branch | Handle monetary completion path | Router-selected payment screen | sections--payment or sections--payment-preparing | Router polling + payment scripts | hit_offeringacceptance, hit_paymenttransaction | Orchestrator + Stripe flows + webhook handler | Stripe | Pending Payment | Completed or Failed or Cancelled | [payment intent persisted to acceptance](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L644) |
| Confirm completion | Close loop with confirmation UX | Router-selected confirmation view | sections--confirmation or sections--confirmation-nonpayment | Router include logic | hit_offeringacceptance, hit_offeringfulfillment | Fulfillment child flows | Type-dependent | Completed | Completed | [completed confirmation branches](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L202) |

## Per-offering-type matrix
| Process Step | Business Purpose | Web Page | Web Template | JavaScript | Dataverse Tables | Flow | External System | Status Before | Status After | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Donation acceptance | Capture donation intent and amount context | accept route | sections--acceptance-donation | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + payment/fulfillment as applicable | Stripe (if paid) | Draft/Pending Information | Pending Payment or Completed | [router donation include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L264) |
| Event acceptance | Capture event participant acceptance | accept route | sections--acceptance-event | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + type fulfillment | Type dependent | Draft/Pending Information | Pending Payment/Pending Approval/Completed | [router event include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L272) |
| Course acceptance | Capture course access acceptance | accept route | sections--acceptance-course | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + fulfillment child | Type dependent | Draft/Pending Information | Pending Approval or Completed | [router course include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L280) |
| Membership acceptance | Capture membership acceptance | accept route | sections--acceptance-membership | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + payment/fulfillment | Stripe/type dependent | Draft/Pending Information | Pending Payment/Pending Approval/Completed | [router membership include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L288) |
| Volunteer acceptance | Capture volunteer engagement intent | accept route | sections--acceptance-volunteer | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + fulfillment | Type dependent | Draft/Pending Information | Pending Approval or Completed | [router volunteer include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L296) |
| Download acceptance | Capture resource download acceptance | accept route | sections--acceptance-download | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + fulfillment | Type dependent | Draft/Pending Information | Completed (or pending intermediate states) | [router download include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L304) |
| Sponsorship acceptance | Capture sponsorship acceptance intent | accept route | sections--acceptance-sponsorship | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + fulfillment | Type dependent | Draft/Pending Information | Pending Approval/Completed | [router sponsorship include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L312) |
| EOI acceptance | Capture expression of interest details | accept route | sections--acceptance-eoi | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + fulfillment | Type dependent | Draft/Pending Information | Pending Approval/Completed | [router eoi include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L320) |
| Venue acceptance | Capture venue booking request details | accept route | sections--acceptance-venue | Router include logic | hit_offeringacceptance, hit_offering | Trigger orchestrator + venue-specific handling | Venue systems/type-specific | Draft/Pending Information | Pending Approval/Pending Payment/Completed | [router venue include](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L328) |

## Security model used in process
- Anonymous and authenticated roles both have read on offerings and create/write/read on offering acceptance according to exported permission YAML.
- Payment transaction table permission grants read access in portal role mappings.

## Evidence
- Roles:
  - [Anonymous + Authenticated roles](power-pages/nfp-base/webrole.yml#L7)
- Permissions:
  - [Offerings public read](power-pages/nfp-base/table-permissions/Offerings---Public.tablepermission.yml#L8)
  - [Offering acceptance create/write](power-pages/nfp-base/table-permissions/Offering-Acceptance---Create.tablepermission.yml#L5)
  - [Payment transaction read](power-pages/nfp-base/table-permissions/Payment-Transaction---Read.tablepermission.yml#L8)
- Web API scope:
  - [offering and acceptance Web API site settings](power-pages/nfp-base/sitesetting.yml#L118)
