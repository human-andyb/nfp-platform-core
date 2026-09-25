# DSR Solution Inventory

This document summarises the DSR solution set as discovered from the unpacked solution metadata under `solutions/exports/unpacked/dsr` and the associated workflow JSON metadata. The review was based on the solution manifests and component metadata rather than a live environment.

## Scope and evidence

The DSR area is structured as a three-solution stack:

1. `BaseSchema` — foundational Dataverse schema and shared platform entities
2. `Automation` — orchestration and workflow processing
3. `DSRCustomisations` — DSR-specific app, content, payment, and operational customisation

The key solution manifests reviewed were:

- `solutions/exports/unpacked/dsr/BaseSchema/Other/Solution.xml`
- `solutions/exports/unpacked/dsr/Automation/Other/Solution.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Other/Solution.xml`

## Executive summary

The DSR implementation is organised as a layered platform:

- foundational data model
- workflow and automation layer
- business-facing DSR customisation layer

This is a clear separation of concerns. The platform appears designed to keep the stable schema, process logic, and user experience in different solution boundaries. The overall domain looks like a fundraising, constituent engagement, and payment processing capability with segmentation, content, and portal configuration built around it.

## Solution inventory

| Solution | Unique name | Primary purpose | Main pattern |
| --- | --- | --- | --- |
| BaseSchema | `NFPDataBase` | Shared platform schema | foundational data model |
| Automation | `NFPDataPlatformAutomation` | Orchestration and lifecycle automation | process layer |
| DSRCustomisations | `DSRCustomisationsNFPDataPlatform` | DSR-specific apps, flows, and configuration | business-facing customisation layer |

---

## 1) BaseSchema — `NFPDataBase`

### Purpose

This is the shared Data Platform schema layer. It defines the canonical entities used by the rest of the DSR implementation and acts as the baseline model for fundraising, relationship management, payment activity, engagement, and content configuration.

### Evidence

- `solutions/exports/unpacked/dsr/BaseSchema/Other/Solution.xml`

### Typical entity groups found

Offering and donation lifecycle:

- `hit_offering`
- `hit_offeringacceptance`
- `hit_offeringfulfillment`
- `hit_paymentschedule`
- `hit_paymenttransaction`
- `hit_stripecustomer`

Constituent and relationship model:

- `account`
- `contact`
- `hit_contactorganisation`
- `hit_contactorgsegmenttag`
- `hit_contactsegmenttag`

Engagement, audience, and content:

- `hit_audience`
- `hit_persona`
- `hit_program`
- `hit_article`
- `hit_communicationevent`
- `hit_featuredcontent`

Platform configuration:

- `hit_platformpage`
- `hit_platformroute`
- `hit_brandsettings`
- `hit_webnavmenuitem`

### Business capability

This solution provides the core foundation for DSR as a fundraising and engagement platform. It is not primarily a user-facing app; it is the shared domain model that everything else depends on.

### Assessment

This is the root layer of the DSR architecture. It contains the long-lived domain model and should be treated as the stable platform foundation that the automation and customisation solutions extend.

---

## 2) Automation — `NFPDataPlatformAutomation`

### Purpose

This solution provides process automation and workflow orchestration. It contains the logic that reacts to changes in the donation and engagement lifecycle and turns events into operational actions such as pricing updates, payment processing, fulfillment actions, and tag assignment.

### Evidence

- `solutions/exports/unpacked/dsr/Automation/Other/Solution.xml`
- Example workflow metadata: `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json`

### Workflow and automation themes

The automation layer is concentrated around:

- offering acceptance processing
- offer pricing and payment requirements
- fulfillment progression
- tagging and segmentation updates
- import validation
- Stripe webhook processing
- event-driven data changes

### Key entities used by automation

- `hit_offeringacceptance`
- `hit_paymenttransaction`
- `hit_offering`
- `hit_offeringfulfillment`
- `hit_segmenttag`
- `hit_accountsegmenttag`
- `hit_contactsegmenttag`
- `hit_stripecustomer`
- `hit_paymentschedule`

### Example observed workflow behaviour

The offering acceptance orchestrator uses Dataverse webhook triggers against `hit_offeringacceptance` and reads the related offering record. It then evaluates acceptance status and calculates pricing values, quantity, and payment requirement. This is not simply a notification flow; it is a business rules and state-management workflow.

### Business capability

This solution handles the operational engine for the fundraising lifecycle. It transforms incoming events into decisions and data updates that advance the donor journey, payment obligations, and fulfillment state.

### Assessment

This is the process layer of the platform. It sits between the stable schema and the DSR-specific user experience and provides the runtime logic that keeps the domain operational.

---

## 3) DSRCustomisations — `DSRCustomisationsNFPDataPlatform`

### Purpose

This is the DSR-specific customisation layer and the most business-facing solution in the stack. It contains app modules, canvas apps, import tooling, content configuration, payment experience, segmentation logic, and DSR-specific workflows.

### Evidence

- `solutions/exports/unpacked/dsr/DSRCustomisations/Other/Solution.xml`
- App module metadata: `.../AppModules/new_DSRMVP/AppModule.xml` and `.../AppModules/hit_DSRFundraiser/AppModule.xml`

### App modules and model-driven app structure

The solution contains multiple app modules including:

- `new_DSRMVP`
- `hit_DSRFundraiser`
- `hit_DSRContent`
- `new_NFPPlatformSetup`

The `new_DSRMVP` app module includes a broad set of entities such as:

- `account`
- `contact`
- `hit_accountsegmenttag`
- `hit_article`
- `hit_audience`
- `hit_communicationevent`
- `hit_offering`
- `hit_offeringacceptance`
- `hit_offeringfulfillment`
- `hit_paymentschedule`
- `hit_paymenttransaction`
- `hit_persona`
- `hit_program`
- `hit_segmenttag`
- `new_australiapostcode`

The `hit_DSRFundraiser` app module focuses more directly on:

- `account`
- `contact`
- `hit_constituentstaging`
- `hit_importcontact`
- `hit_importorganisation`
- `hit_importtag`
- `hit_segmenttag`

### Business-facing tables and capabilities

This customisation layer extends the core model with DSR-specific operational and import objects, including:

- `hit_constituentstaging`
- `hit_importcontact`
- `hit_importorganisation`
- `hit_importtag`
- `hit_accountsegmenttag`
- `hit_contactsegmenttag`
- `hit_platformpage`
- `hit_platformpagesection`
- `hit_platformpagesectiontype`
- `hit_platformpageslot`
- `hit_platformroute`
- `hit_regionalarea`
- `hit_webnavmenuitem`
- `hit_stripecustomer`

### Canvas apps and custom pages

The solution includes canvas apps:

- `hit_offerings_b6fa0`
- `hit_processpaymentform_3a67f`
- `hit_webconfiguration_1f8d2`

This strongly indicates a front-end experience for:

- offering selection and presentation
- payment form capture
- portal/site configuration

A web resource named `hit_paymentDialogForm` is also included, suggesting additional UI augmentation around payment flows.

### Power Automate flows and business process coverage

The DSR customisations solution contains many workflow definitions, including patterns for:

- offering acceptance orchestration
- offering fulfillment orchestration
- fulfillment outcome events
- updating tags after fulfillment outcome
- Stripe customer setup and payment integration
- Stripe webhook state updates to Dataverse
- contact and organisation import validation
- communication event updates
- tagging engine operations for contacts and organisations

Examples observed include:

- `trigger_Offering Acceptance - Orchestrator`
- `trigger_Offering Fulfillment - Orchestrator`
- `trigger_Offering Fulfillment Completed - Fulfillment Outcome`
- `trigger_Update Tags on Fulfillment Outcome`
- `Stripe Create Customer SetupIntent`
- `Stripe Webhook Handler - PaymentIntent Update Dataverse`
- `Stripe Webhook Handler - SetupIntent Update Dataverse`
- `trigger_Import Contacts - Validation Process`
- `trigger_Import Organisations - Validation Process`
- `Tagging Engine - Add New Contact Segment Tag (Child)`
- `Tagging Engine - Add New Organisation Segment Tag (Child)`

### Environment variables

The customisation layer also includes environment variables for configuration and scoring thresholds, including:

- `hit_baseurl`
- `hit_StripeSecretKey`
- `hit_EV_ENG_HIGH_DAYS`
- `hit_EV_ENG_LOW_DAYS`
- `hit_EV_ENG_MEDIUM_DAYS`
- `hit_EV_LIF_ACTIVE_MONTHS`
- `hit_EV_LIF_AT_RISK_MONTHS`
- `hit_EV_VAL_HIGH_THRESHOLD`
- `hit_EV_VAL_MID_THRESHOLD`
- `new_baseWebUrl`

These indicate configuration around web endpoints, engagement scoring, lifecycle thresholds, and payment-sensitive settings.

### Connection references

The solution uses Dataverse shared connection references, notably:

- `shared_commondataserviceforapps`
- `hit_sharedcommondataserviceforapps_23a36`
- `hit_sharedcommondataserviceforapps_2d19c`

This is consistent with workflows built directly around Dataverse entity operations.

### Business capability

This is the primary DSR business solution. It combines the operational platform with the customer-facing experience for fundraising, donor management, import handling, segmentation, payment capture, content, and site configuration.

### Assessment

This solution is the most user-centric and domain-specific layer. It is the place where the DSR product experience and business operations are assembled and packaged for use.

---

## High-level solution structure assessment

The DSR architecture appears to be intentionally layered:

1. BaseSchema
   - stable shared platform model
   - canonical business entities and domain data

2. Automation
   - orchestration and runtime logic
   - event-driven state transitions and operational processing

3. DSRCustomisations
   - DSR-specific process and experience design
   - apps, UI, import tooling, configuration, and workflow assembly

This pattern is well-suited to a fundraising and engagement platform because it separates the lower-risk foundational model from the more volatile operational and customer-facing behaviour.

## Overall interpretation

The DSR solution set appears to support:

- donor and constituent management
- offering and payment lifecycle management
- fulfillment tracking
- engagement and segmentation
- content and page configuration
- import validation and stewardship operations
- automation of fundraising processes

In practical terms, DSR is not a single monolithic customisation; it is a platform-style implementation with a shared base schema, a workflow-driven process engine, and a DSR-specific experience layer sitting on top.
