# DSR Flow Catalogue

This catalogue reviews the Power Automate flows discovered under the unpacked DSR solution set. The analysis is intentionally business-focused: it explains what each flow appears to achieve in support of the DSR fundraising, engagement, and constituent platform rather than describing the low-level JSON logic.

## Scope and method

The review covers the workflow metadata found under:

- `solutions/unpacked/DSR/Automation/Workflows`
- `solutions/unpacked/DSR/DSRCustomisations/Workflows`

Where the same flow appears in both solution folders, it is treated as the same process pattern and called out once as a duplicate package/scope instance rather than listed twice as a separate business capability.

---

## Executive summary

Across the DSR platform, the automation layer is built around a consistent business model:

- accept a donation or offer commitment
- validate and enrich the constituent record
- calculate pricing and payment requirements
- update fulfillment and outcome states
- assign segment tags and engagement status
- create receipts, invoices, and other operational documents
- update communication and contact preferences
- manage import quality and record matching

The platform is automating a broad fundraising and engagement lifecycle rather than a single isolated process.

---

## 1. Offering and fulfillment lifecycle automation

### 1. trigger_OfferingAcceptance-Orchestrator
- Flow name: `trigger_OfferingAcceptance-Orchestrator`
- Trigger: Dataverse row added, modified, or deleted on `hit_offeringacceptance`
- Tables referenced: `hit_offeringacceptance`, `hit_offering`, `hit_offerings`, `hit_paymenttransaction`, `hit_paymentschedule`
- Main actions performed: reads the related offer, calculates pricing and payment requirement, decides the next acceptance state, updates the offering acceptance record, ensures the commitment is ready for fulfillment/payment processing
- Child flows called: none evident in the core orchestrator; it acts as the primary decision engine
- Environment variables used: `new_baseWebUrl` is referenced in the workflow parameters, but the flow’s main purpose is operational state management rather than portal configuration
- Connection references used: `shared_commondataserviceforapps`
- Inputs: offering acceptance record and linked offer details
- Outputs: updated acceptance state, pricing, quantity, total amount, and payment-required flag
- Business purpose: manages the donor or supporter commitment lifecycle from initial acceptance through pricing and readiness for payment/fulfillment.

### 2. trigger_OfferingFulfillment-Orchestrator
- Flow name: `trigger_OfferingFulfillment-Orchestrator`
- Trigger: Dataverse change to `hit_offeringfulfillment`
- Tables referenced: `hit_offeringfulfillment`, `hit_offeringacceptance`, `hit_offering`, `contact`, `account`
- Main actions performed: loads the fulfillment record, linked acceptance and contact, determines the appropriate next stage, updates fulfillment progression and operational state
- Child flows called: likely delegates to fulfillment-specific handlers for stage-specific work
- Environment variables used: none obvious in the primary flow definition
- Connection references used: `shared_commondataserviceforapps`
- Inputs: fulfillment record and related context
- Outputs: updated fulfillment stage and downstream progression state
- Business purpose: moves a giving or support commitment through its fulfillment stages, ensuring completion or next-step action is tracked consistently.

### 3. trigger_OfferingFulfillmentCompleted-FulfillmentOu
- Flow name: `trigger_OfferingFulfillmentCompleted-FulfillmentOu`
- Trigger: Dataverse when a fulfillment outcome is created or updated
- Tables referenced: `hit_fulfillmentoutcome`, `contact`, `account`, `hit_offering`
- Main actions performed: reads the outcome, party records, and offer, then updates the contact’s last interaction and last outcome details
- Child flows called: no direct child workflow identified in the summary flow
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: fulfillment outcome and linked contact/relationship data
- Outputs: updated contact outcome history and last interaction timestamp
- Business purpose: records that a fulfillment outcome has happened and updates donor or supporter engagement history.

### 4. trigger_UpdateTagsonFulfillmentOutcome
- Flow name: `trigger_UpdateTagsonFulfillmentOutcome`
- Trigger: Dataverse on `hit_fulfillmentoutcome`
- Tables referenced: `hit_fulfillmentoutcome`, `contact`, `account`, `hit_offering`, `hit_segmenttag`
- Main actions performed: when an outcome is recorded, it updates the related contact or organisation state and applies relevant tags or segmentation changes
- Child flows called: likely calls tagging engine children for segment assignment
- Environment variables used: none obvious in the flow entry reviewed
- Connection references used: `shared_commondataserviceforapps`
- Inputs: outcome record and the related person/org entity
- Outputs: updated segment tags and engagement state
- Business purpose: converts a completed delivery or outcome into segmentation and prospecting updates so the supporter record reflects the latest engagement state.

### 5. OfferingSpecificFulfillmentHandlerchild
- Flow name: `OfferingSpecificFulfillmentHandlerchild`
- Trigger: typically invoked as a child workflow from a larger fulfillment flow
- Tables referenced: `hit_offeringfulfillment`, `hit_offeringacceptance`, `hit_offering`, `contact`, related fulfillment metadata
- Main actions performed: stage-specific fulfillment logic, often performing task-specific updates or state transitions for a given offer type
- Child flows called: likely none; acts as a reusable helper for fulfillment cases
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: fulfillment and offer-specific context
- Outputs: stage-specific fulfillment updates and next-step state changes
- Business purpose: handles offer-specific fulfillment variation without creating one huge monolithic process.

### 6. trigger_VenueSpaceBookingRequest-ApprovalStatus
- Flow name: `trigger_VenueSpaceBookingRequest-ApprovalStatus`
- Trigger: Dataverse on venue booking request approval status changes
- Tables referenced: venue booking request tables and related user/contact records
- Main actions performed: reacts to room or venue booking approval status changes and updates downstream state
- Child flows called: `VenueBookingHandlerchild`
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: booking request approval status and relevant booking context
- Outputs: approval-state updates and booking process progression
- Business purpose: manages internal/event logistics approval handling for venue and space requests.

### 7. VenueBookingHandlerchild
- Flow name: `VenueBookingHandlerchild`
- Trigger: child workflow called from a booking approval process
- Tables referenced: venue booking or event-related records; likely `hit_venuespacebookingrequest` and related user/contact records
- Main actions performed: performs reusable update logic for venue booking handling and state transitions
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: booking record context and approval outcome
- Outputs: booking status or related action result
- Business purpose: centralises venue booking-case handling so parent flows stay simpler.

---

## 2. Payment and Stripe automation

### 8. Stripe_CreatePaymentIntent
- Flow name: `Stripe_CreatePaymentIntent`
- Trigger: typically initiated manually or by a payment workflow when a donor/payment workflow needs a Stripe intent created
- Tables referenced: `hit_paymenttransaction`, `hit_offeringacceptance`, `hit_offering`, `hit_stripecustomer`, `contact`, `account`
- Main actions performed: creates a Stripe payment intent, stores payment metadata, links the payment intent to the relevant Dataverse records, and updates the transaction state
- Child flows called: usually the Stripe webhook handlers follow after payment events
- Environment variables used: `hit_StripeSecretKey`
- Connection references used: `shared_commondataserviceforapps`
- Inputs: payment amount, customer context, acceptance record, and offer details
- Outputs: Stripe payment intent and Dataverse payment transaction record updates
- Business purpose: starts a card payment flow so the system can collect money against a fundraising commitment.

### 9. StripeCreateCustomerSetupIntent
- Flow name: `StripeCreateCustomerSetupIntent`
- Trigger: payment onboarding/setup event associated with a supporter or customer record
- Tables referenced: `hit_stripecustomer`, `contact`, `account`, `hit_paymenttransaction`
- Main actions performed: creates a Stripe customer/setup intent and stores the resulting customer/payment setup metadata back in Dataverse
- Child flows called: later callback flows may update the Dataverse record after Stripe returns
- Environment variables used: `hit_StripeSecretKey`
- Connection references used: `shared_commondataserviceforapps`
- Inputs: constituent/customer context and payment setup request
- Outputs: Stripe customer setup record and supporting Dataverse record linkage
- Business purpose: establishes a donor/customer payment setup so future charges can be processed without repeated manual entry.

### 10. StripeWebhookHandler-PaymentIntentUpdateDataverse
- Flow name: `StripeWebhookHandler-PaymentIntentUpdateDataverse`
- Trigger: HTTP webhook from Stripe for payment events
- Tables referenced: `hit_paymenttransaction`, `hit_offeringacceptance`, `hit_offering`, `contact`, `account`, `hit_stripecustomer`
- Main actions performed: receives Stripe payment event, validates the payload, resolves payment intent and charge IDs, reads the matching Dataverse transaction, and updates the transaction state to reflect payment success, failure, or partial status
- Child flows called: none obvious; it acts as the transaction reconciliation entry point
- Environment variables used: `hit_StripeSecretKey`
- Connection references used: `shared_commondataserviceforapps`
- Inputs: Stripe event payload sent by Stripe webhook
- Outputs: updated payment transaction status and corresponding donor/order records
- Business purpose: synchronises Stripe payment status back into Dataverse so finance and fundraising records stay accurate.

### 11. StripeWebhookHandler-SetupIntentUpdateDataverse
- Flow name: `StripeWebhookHandler-SetupIntentUpdateDataverse`
- Trigger: HTTP webhook from Stripe for setup-intent events
- Tables referenced: `hit_stripecustomer`, `hit_paymenttransaction`, `contact`, `account`
- Main actions performed: listens for setup intent changes, resolves the relevant customer or record, and updates the Dataverse setup/payment metadata
- Child flows called: no major child flow visible from the reviewed metadata
- Environment variables used: `hit_StripeSecretKey`
- Connection references used: `shared_commondataserviceforapps`
- Inputs: Stripe setup event payload
- Outputs: updated customer payment setup status and associated record state
- Business purpose: ensures donor payment setup status is kept current as Stripe confirms setup completion or failure.

### 12. GenerateDonationInvoiceChild
- Flow name: `GenerateDonationInvoiceChild`
- Trigger: child flow invoked when an invoice needs producing
- Tables referenced: `hit_paymenttransaction`, `hit_offeringacceptance`, `contact`, `account`
- Main actions performed: creates invoice content and stores or triggers the invoice generation process for a donation or giving commitment
- Child flows called: likely calls the PDF generation child flow for invoice output
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: transaction and customer data
- Outputs: generated invoice record or PDF-output trigger
- Business purpose: turns a successful donation event into a formal invoice for the donor or internal processing.

### 13. SharePoint-GenerateDonationInvoicePDFChild
- Flow name: `SharePoint-GenerateDonationInvoicePDFChild`
- Trigger: child flow invoked to create a PDF invoice
- Tables referenced: `hit_paymenttransaction`, `hit_offeringacceptance`, contact/account records, SharePoint document storage
- Main actions performed: prepares invoice data, generates a PDF, and stores the output in SharePoint or related document storage
- Child flows called: none obvious
- Environment variables used: may use site base URL values indirectly via document storage configuration
- Connection references used: `shared_commondataserviceforapps`
- Inputs: invoice data and document destination
- Outputs: invoice PDF file or document record
- Business purpose: creates a printable and shareable invoice as part of donation administration.

### 14. Sharepoint-GenerateDonationReceiptPDFChild
- Flow name: `Sharepoint-GenerateDonationReceiptPDFChild`
- Trigger: child flow invoked after payment completion or donation acknowledgement
- Tables referenced: `hit_paymenttransaction`, `hit_offeringacceptance`, contact/account records
- Main actions performed: assembles a receipt payload and generates a PDF receipted output
- Child flows called: none obvious
- Environment variables used: may rely on portal or site configuration values
- Connection references used: `shared_commondataserviceforapps`
- Inputs: transaction and customer data
- Outputs: donation receipt PDF or stored file reference
- Business purpose: provides the donor with an acknowledgement and summary of payment received.

### 15. SharePoint-GenerateDonationCertificatePDFChild
- Flow name: `SharePoint-GenerateDonationCertificatePDFChild`
- Trigger: child flow invoked when a certificate is needed for a support commitment
- Tables referenced: donation/acceptance and supporter records
- Main actions performed: creates a certificate-style PDF document from the relevant transaction and constituent data
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: giving record and constituent data
- Outputs: certificate PDF or completed document record
- Business purpose: supports formal acknowledgment or donor recognition documents.

### 16. trigger_Contact_GenerateInvoice
- Flow name: `trigger_Contact_GenerateInvoice`
- Trigger: contact-based event or trigger linked to invoice generation
- Tables referenced: `contact`, `hit_paymenttransaction`, `hit_offeringacceptance`
- Main actions performed: resolves the contact and related donation record, then initiates invoice generation for that donor
- Child flows called: likely calls invoice-generation child flows
- Environment variables used: none obvious from the reviewed metadata
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact and transaction context
- Outputs: invoice generation request or generated invoice artifact
- Business purpose: turns a contact-driven event into a financial document for donor administration.

---

## 3. Tagging, segmentation, and engagement automation

### 17. ApplySegmentTagschild
- Flow name: `ApplySegmentTagschild`
- Trigger: child workflow invoked during segmentation processing
- Tables referenced: `hit_segmenttag`, `hit_accountsegmenttag`, `hit_contactsegmenttag`, `contact`, `account`
- Main actions performed: applies segment tags to a constituent or organisation record based on current rules and state
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: constituent/organisation and tag criteria
- Outputs: new or updated segment tag records
- Business purpose: keeps supporter segmentation and cohort membership aligned with the rules of the DSR platform.

### 18. TaggingEngine-AddNewContactSegmentTagChild
- Flow name: `TaggingEngine-AddNewContactSegmentTagChild`
- Trigger: child workflow called when a contact should receive a new segment tag
- Tables referenced: `contact`, `hit_contactsegmenttag`, `hit_segmenttag`
- Main actions performed: identifies the appropriate segment tag, creates the contact tag record, and updates the person’s segmentation state
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact record and tag definition
- Outputs: one or more `hit_contactsegmenttag` records
- Business purpose: ensures donor or supporter segmentation is updated whenever a new tag should be assigned.

### 19. TaggingEngine-AddNewOrganisationSegmentTagChild
- Flow name: `TaggingEngine-AddNewOrganisationSegmentTagChild`
- Trigger: child workflow called when an organisation should receive a new segment tag
- Tables referenced: `account`, `hit_accountsegmenttag`, `hit_segmenttag`
- Main actions performed: creates or updates the organisation tag relationship based on the current rule set
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: account/organisation and tag dimensions
- Outputs: `hit_accountsegmenttag` results
- Business purpose: applies segmentation to organisations and accounts in the donor network.

### 20. TaggingEngine-RecalcContactStateTagschild
- Flow name: `TaggingEngine-RecalcContactStateTagschild`
- Trigger: scheduled or event-driven recalculation of contact tags
- Tables referenced: `contact`, `hit_contactsegmenttag`, `hit_persona`, `hit_segmenttag`
- Main actions performed: recalculates all relevant contact tag states based on current engagement or lifecycle metrics
- Child flows called: likely reusable tag helpers and child calculation functions
- Environment variables used: `hit_EV_ENG_HIGH_DAYS`, `hit_EV_ENG_LOW_DAYS`, `hit_EV_ENG_MEDIUM_DAYS`, `hit_EV_LIF_ACTIVE_MONTHS`, `hit_EV_LIF_AT_RISK_MONTHS`, `hit_EV_VAL_HIGH_THRESHOLD`, `hit_EV_VAL_MID_THRESHOLD`
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact and current segmentation/engagement state
- Outputs: refreshed contact tags and recalculated state indicators
- Business purpose: nightly or event-driven recalculation of donor engagement and value segmentation.

### 21. TaggingEngine-RecalcOrganisationStateTagschild
- Flow name: `TaggingEngine-RecalcOrganisationStateTagschild`
- Trigger: scheduled or event-driven recalculation of organisation tags
- Tables referenced: `account`, `hit_accountsegmenttag`, `hit_segmenttag`
- Main actions performed: recalculates organisation-level segmentation based on current state and relevant scoring rules
- Child flows called: likely subordinate tag helpers
- Environment variables used: scoring thresholds and life-cycle window environment variables
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation and related segmentation context
- Outputs: updated organisation segment tags
- Business purpose: keeps account-level segmentation consistent with the same business rules used for constituent records.

### 22. TaggingEngine-PopulateDoNotContactTagsChild
- Flow name: `TaggingEngine-PopulateDoNotContactTagsChild`
- Trigger: child workflow for contact preference and suppression updates
- Tables referenced: `contact`, `hit_contactsegmenttag`, `hit_segmenttag`
- Main actions performed: populates suppression or do-not-contact tags when preference or compliance rules indicate the contact should be excluded from outreach
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact/state and preference data
- Outputs: updated do-not-contact tags or suppression records
- Business purpose: protects compliance and communication preferences, ensuring contacts can be excluded from outreach when needed.

### 23. trigger_ContactDoNotEmail
- Flow name: `trigger_ContactDoNotEmail`
- Trigger: Dataverse on contact changes related to email opt-out/status
- Tables referenced: `contact`, `hit_contactsegmenttag`, related communication tables
- Main actions performed: watches contact preferences and triggers updates or suppression actions when a Do Not Email or similar preference changes
- Child flows called: no major child flow identified from the flow name alone
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact preference update
- Outputs: updated communication status and/or tag state
- Business purpose: protects contact consent and communication compliance.

### 24. cxpTrigger_FlowAddContactTag
- Flow name: `cxpTrigger_FlowAddContactTag`
- Trigger: custom/trigger-based event for adding a contact tag
- Tables referenced: `contact`, `hit_contactsegmenttag`, `hit_segmenttag`
- Main actions performed: adds a contact tag when a trigger event says the contact should move into a segment or audience state
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact and business rule trigger
- Outputs: updated tag assignment on the contact
- Business purpose: supports marketing and engagement segmentation by adding contact tags when rule-based triggers fire.

### 25. cxpTrigger_FlowAddOrganisationTag
- Flow name: `cxpTrigger_FlowAddOrganisationTag`
- Trigger: organisation-level trigger for a new tag assignment
- Tables referenced: `account`, `hit_accountsegmenttag`, `hit_segmenttag`
- Main actions performed: adds an organisation-level segment tag based on a trigger or rule event
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation/account record and tag trigger
- Outputs: updated account tag state
- Business purpose: keeps organisational segmentation aligned with campaign or audience rules.

### 26. Audiencebuild-HighValue-Active
- Flow name: `Audiencebuild-HighValue-Active`
- Trigger: likely scheduled or event-driven audience build/run process
- Tables referenced: `contact`, `account`, `hit_segmenttag`, audience tables, related engagement data
- Main actions performed: builds a high-value and active audience segment by evaluating current contact or organisation signals and creating/updating audience membership
- Child flows called: may use tagging utilities
- Environment variables used: engagement scoring thresholds and life-cycle values
- Connection references used: `shared_commondataserviceforapps`
- Inputs: audience rules and current constituent data
- Outputs: audience allocation or segment-tag updates
- Business purpose: supports targeted high-value donor or active supporter segmentation for fundraising or marketing programs.

### 27. recurrence_BatchProcessContact-NextEligibleContact
- Flow name: `recurrence_BatchProcessContact-NextEligibleContact`
- Trigger: recurrence schedule
- Tables referenced: `contact`, `hit_segmenttag`, engagement-related records
- Main actions performed: identifies the next eligible contact for processing, calculates next contact date, and prepares the record for outreach or follow-up
- Child flows called: `SetNextEligibleContactDate-ContactChild`
- Environment variables used: likely engagement-timeframe thresholds
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact records and current scoring state
- Outputs: next eligible contact and next contact date updates
- Business purpose: regularises the next-touch cycle for fundraising or engagement outreach.

### 28. SetNextEligibleContactDate-ContactChild
- Flow name: `SetNextEligibleContactDate-ContactChild`
- Trigger: child workflow invoked by the recurrence flow
- Tables referenced: `contact`, engagement-state records
- Main actions performed: sets or updates the next suitable contact date based on rules, state, and outreach cadence
- Child flows called: none obvious
- Environment variables used: likely engagement/recurrence thresholds
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact and treatment context
- Outputs: updated next-eligible date
- Business purpose: ensures outreach is not sent too often and is recalculated based on donor/service-cycle rules.

### 29. recurrence_dailyPurgeStaleOutboundContacts
- Flow name: `recurrence_dailyPurgeStaleOutboundContacts`
- Trigger: daily recurrence schedule
- Tables referenced: contact/outbound and stale outreach records
- Main actions performed: cleans out stale outbound contact or queue records so the system does not keep dead or no-longer-relevant contacts in active processing
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: stale contact/outbound queue data
- Outputs: purge or cleanup of stale records
- Business purpose: maintains operational hygiene and prevents outdated contact records from being treated as active outreach candidates.

---

## 4. Import and constituent data quality automation

### 30. trigger_ImportContacts-ValidationProcess
- Flow name: `trigger_ImportContacts-ValidationProcess`
- Trigger: Dataverse row added/modified on `hit_importcontact`
- Tables referenced: `hit_importcontact`, `contact`, `account`, `hit_importtag`, `hit_segmenttag`
- Main actions performed: validates incoming contact import data, resolves or creates the correct contact/organisation record, enriches the data, and updates the import record or related entities
- Child flows called: `CreateorGetContactIDchild`, `CreateorGetContactOrgRelationshipIDchild`, possibly organisation/relationship helpers
- Environment variables used: none obvious in the reviewed entry
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact import row and field data
- Outputs: matched or created contact record, related organisation record, and updated import state
- Business purpose: cleans and normalises contact imports so internal records match the correct constituent identity before they are used operationally.

### 31. trigger_ImportOrganisations-ValidationProcess
- Flow name: `trigger_ImportOrganisations-ValidationProcess`
- Trigger: Dataverse row added/modified on `hit_importorganisation`
- Tables referenced: `hit_importorganisation`, `account`, `contact`, `hit_contactorganisation`
- Main actions performed: validates organisation imports, creates or matches the correct account record, and updates the relationship state between people and organisations
- Child flows called: `CreateorgetOrganisationIDChild` and related matching helpers
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation import row and company name / relationship data
- Outputs: matched or created account and linked constituent relationships
- Business purpose: prevents duplicate or poorly matched organisational records from entering the supporter database.

### 32. CreateorGetContactIDchild
- Flow name: `CreateorGetContactIDchild`
- Trigger: child workflow called by import or matching processes
- Tables referenced: `contact`, `hit_importcontact`, `account`
- Main actions performed: resolves whether the contact already exists; if not, creates the new contact record and returns the contact ID
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: name, email, phone, and other contact fields
- Outputs: contact GUID or created new contact record flag
- Business purpose: allows import and matching logic to reliably create or reuse the correct person record.

### 33. CreateorGetContactOrgRelationshipIDchild
- Flow name: `CreateorGetContactOrgRelationshipIDchild`
- Trigger: child workflow for relationship resolution
- Tables referenced: `contact`, `account`, `hit_contactorganisation`
- Main actions performed: ensures the correct relationship record exists between a person and their organisation and returns the relationship ID
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact ID and organisation context
- Outputs: relationship record or ID used to link the two entities
- Business purpose: keeps people and organisations tied together in a consistent and reusable way.

### 34. CreateorgetOrganisationIDChild
- Flow name: `CreateorgetOrganisationIDChild`
- Trigger: child workflow for organisation matching/creation
- Tables referenced: `account`, `hit_importorganisation`
- Main actions performed: resolves whether an organisation already exists and creates one if not
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation name or import details
- Outputs: organisation ID or created account record reference
- Business purpose: supports clean import matching for organisational records.

### 35. GetConstituentRecordfromIDChild
- Flow name: `GetConstituentRecordfromIDChild`
- Trigger: child workflow invoked when the system needs to retrieve a constituent record by ID
- Tables referenced: `contact`, `account`, or combined constituent records
- Main actions performed: finds and returns the correct constituent record from a contact or organisation ID
- Child flows called: no major child flow evident
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: constituent ID
- Outputs: constituent record payload
- Business purpose: reduces duplicate lookup logic and improves consistency across the UX and backend flows.

### 36. SyncCIContactPointConsentChild
- Flow name: `SyncCIContactPointConsentChild`
- Trigger: child flow triggered by consent or contact-point updates
- Tables referenced: `contact`, consent/contact-point records, maybe email or marketing preference data
- Main actions performed: syncs consent preferences and contact-point status so communication preferences are kept consistent
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact-point consent state and contact record
- Outputs: updated consent/contact-point record
- Business purpose: ensures contact preferences remain compliant and aligned between systems.

### 37. Http_AcceptanceStatusValidation
- Flow name: `Http_AcceptanceStatusValidation`
- Trigger: HTTP request endpoint or one-time validation trigger
- Tables referenced: acceptance-related and donor/offer records
- Main actions performed: validates acceptance status and checks whether a requested business state is valid before proceeding
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: acceptance status or validation request payload
- Outputs: validation result indicating whether the record state is valid or should be rejected or corrected
- Business purpose: prevents invalid acceptance or fulfillment states from moving through the process.

---

## 5. Communication, events, and operational follow-up

### 38. UpdateCommunicationEventDetailsChild
- Flow name: `UpdateCommunicationEventDetailsChild`
- Trigger: child flow invoked when communication event details need refreshing
- Tables referenced: `hit_communicationevent`, `contact`, `account`, related communication data
- Main actions performed: updates communication event details so each message or communication record is aligned with the latest customer and event data
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: communication event and related constituent data
- Outputs: updated communication event record
- Business purpose: ensures communications are fully traceable and based on the latest supporter data.

### 39. cxpTrigger_Flow-UpdateCommunicationEvent
- Flow name: `cxpTrigger_Flow-UpdateCommunicationEvent`
- Trigger: trigger-based communication update event
- Tables referenced: `hit_communicationevent`, `contact`, `account`
- Main actions performed: updates or enriches communication event data based on a trigger or campaign interaction
- Child flows called: likely delegates to the child update flow
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: event context and relevant party data
- Outputs: refreshed communication event details
- Business purpose: supports status tracking and event history for donor communication and campaign touchpoints.

### 40. ETrainU-CreateorGetOrganisationChild
- Flow name: `ETrainU-CreateorGetOrganisationChild`
- Trigger: child flow used in a specific organisation-matching scenario
- Tables referenced: `account`, related contact and organisation records
- Main actions performed: resolves the right organisation record and creates it if required
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation-related data
- Outputs: organisation record or reference ID
- Business purpose: ensures a specific engagement or training-related organisation is correctly matched and maintained.

### 41. ETrainU-CreateorGetParticipantChild
- Flow name: `ETrainU-CreateorGetParticipantChild`
- Trigger: child workflow for participant creation or lookup
- Tables referenced: `contact`, `account`, related participant data
- Main actions performed: creates or locates the relevant participant person record in support of training or engagement administration
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: participant identity data
- Outputs: participant record or ID
- Business purpose: supports participant management for education or training-related engagement activity.

### 42. PCPContactFileGeneration-EscalatetoPhoneQueueChild
- Flow name: `PCPContactFileGeneration-EscalatetoPhoneQueueChild`
- Trigger: child workflow for outbound contact file generation and escalation
- Tables referenced: `contact`, queue or file-generation records
- Main actions performed: prepares a file or queue item for contact outreach and escalates it to a phone or manual queue workflow
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: contact file or queue context
- Outputs: outbound file/queue item ready for phone follow-up or escalation
- Business purpose: operationalises contact follow-up for outreach teams or voice queues.

### 43. PCPOrganisationFileGeneration-EscalatetoPhoneQueue
- Flow name: `PCPOrganisationFileGeneration-EscalatetoPhoneQueue`
- Trigger: organisation-level file generation and escalation
- Tables referenced: `account`, contact relationships, queue or file-generation records
- Main actions performed: prepares an organisational file for phone queue escalation using the contact relationship data
- Child flows called: none obvious
- Environment variables used: none obvious
- Connection references used: `shared_commondataserviceforapps`
- Inputs: organisation and related contact context
- Outputs: outbound file or escalation queue item
- Business purpose: supports call-centre or outreach workflows for organisational supporters.

---

## Overall assessment of automated business processes

Across the platform, the automated processes fall into a few major business groups:

### Fundraising and donation lifecycle
The platform is clearly automating the journey from donor interest to final payment and confirmation. This includes acceptance records, pricing logic, fulfillment state management, and payment intent processing tied to Stripe.

### Contact and organisation stewardship
The system resolves and normalises contact and organisation records during data import and event processing. This prevents duplicates, links people to accounts, and keeps supporter data consistent.

### Engagement scoring and segmentation
The tagging engine and audience-building flows show a strong focus on audience intelligence. The flow names and environment variables suggest rules around high-value, active, at-risk, and engagement-based states. This is designed to support targeted fundraising and relationship management.

### Communication compliance
The Do Not Email, consent/contact-point sync, and communication-event flows show that the platform is actively protecting outreach compliance and keeping communication records aligned with current contact preferences.

### Finance and document generation
Payment outcomes generate financial events and document artifacts such as invoices, receipts, and certificates. This automation reduces manual administrative work and strengthens the operational consistency of donation administration.

### Outreach and queue management
The recurrence and phone-queue-related flows suggest operational scheduling for follow-up and outreach management. This implies the automation is not only around payments and records, but also around the next best action for staff or call teams.

### Overall conclusion

The DSR platform is highly automated around the supporter lifecycle: it manages offers, payments, fulfillment, contact quality, segmentation, compliance, and operational follow-up. The design is consistent with a mature fundraising and engagement platform that is trying to standardise both front-office donor experience and back-office processing in one Dataverse-centered ecosystem.
