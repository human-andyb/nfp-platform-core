# Business processes reverse-engineered from the DSR flow set

This document reconstructs the operating business processes implied by the Power Automate flows in the DSR solution set. It is based on the workflow names, triggers, Dataverse entity usage, and connection references found under the unpacked DSR exports. It intentionally stays at the business-process layer rather than describing raw JSON implementation details.

## Scope and method

The review covers the DSR automation layer found under the unpacked solution packages, especially:

- Automation/Workflows
- DSRCustomisations/Workflows

The analysis is a repository-based reconstruction. It does not rely on live runtime execution or a connected environment, so some integration details remain inferred rather than confirmed.

---

## 1. Donation process

### Process: Donation intake and pledge conversion

- Trigger:
  - A new or updated `hit_offeringacceptance` record
  - A related payment intent or donation acceptance event from the fundraising front end
- Process steps:
  1. A supporter chooses or accepts an offering or donation commitment.
  2. The offering acceptance flow reads the related offering, computes pricing and totals, and determines whether payment is required.
  3. The system resolves the supporting constituent/contact record and associated organisation if applicable.
  4. The process creates or updates the underlying payment transaction and prepares the Stripe or card payment flow.
  5. Once payment is cleared, the offering fulfillment lifecycle advances and supporting documents are generated.
- Dataverse tables involved:
  - `hit_offering`
  - `hit_offeringacceptance`
  - `hit_offeringfulfillment`
  - `hit_paymenttransaction`
  - `hit_paymentschedule`
  - `contact`
  - `account`
  - `hit_stripecustomer`
- External systems involved:
  - Stripe payment APIs
  - SharePoint document storage for generated PDFs
  - Portal or web configuration values
- Expected outcome:
  - A donor commitment is converted into a valid payment-ready offering acceptance, with linked transaction and fulfillment data, and with downstream documents and updates created automatically.

### Process: Donation acknowledgment and certificate generation

- Trigger:
  - Payment success or donation completion event
- Process steps:
  1. A successful payment or commitment completion is detected.
  2. The system gathers transaction and constituent context.
  3. Child flows generate an invoice, receipt, or certificate PDF.
  4. The system stores the generated document and records its completion back to Dataverse.
- Dataverse tables involved:
  - `hit_paymenttransaction`
  - `hit_offeringacceptance`
  - `contact`
  - `account`
- External systems involved:
  - SharePoint document store
  - PDF generation/document creation logic
- Expected outcome:
  - The supporter receives a formal acknowledgment, payment receipt, or certificate as part of donation administration.

---

## 2. Stripe processing

### Process: Stripe customer setup and payment intent creation

- Trigger:
  - Initiation of a payment or setup flow for a supporter/customer
- Process steps:
  1. The platform resolves the constituent and associated offer or acceptance context.
  2. It creates or locates the Stripe customer record and setup intent.
  3. It passes metadata back to Dataverse, including the acceptance ID and customer contact details.
  4. The payment setup is prepared for subsequent charge or subscription processing.
- Dataverse tables involved:
  - `hit_stripecustomer`
  - `hit_paymenttransaction`
  - `hit_offeringacceptance`
  - `contact`
  - `account`
- External systems involved:
  - Stripe API
  - Stripe webhooks
- Expected outcome:
  - A payment-ready Stripe customer/setup record exists for the supporter, allowing a future payment or direct charge to be processed without re-entering donor details.

### Process: Stripe webhook reconciliation

- Trigger:
  - HTTP callback from Stripe for `PaymentIntent` and `SetupIntent` events
- Process steps:
  1. Stripe sends a webhook event when a payment or setup changes status.
  2. The system validates the event and extracts the related payment intent or setup intent details.
  3. It matches the event to the relevant Dataverse payment transaction and supporting acceptance record.
  4. It updates the payment state, charge status, customer setup status, and any downstream records.
- Dataverse tables involved:
  - `hit_paymenttransaction`
  - `hit_offeringacceptance`
  - `hit_offering`
  - `hit_stripecustomer`
  - `contact`
  - `account`
- External systems involved:
  - Stripe webhook endpoint and Stripe API
- Expected outcome:
  - Dataverse reflects the real payment lifecycle: pending, succeeded, failed, or setup-completed, so finance and fundraising operations remain aligned with the actual card processing state.

---

## 3. Offering acceptance lifecycle

### Process: Offer acceptance and commitment management

- Trigger:
  - A new or modified `hit_offeringacceptance` record
- Process steps:
  1. The acceptance record is created or changed by the donor-facing experience or a back-office process.
  2. The orchestrator reads the linked offering and acceptance data.
  3. The system calculates totals, pricing, and any payment schedule requirements.
  4. It updates the acceptance state and prepares the record for fulfillment or payment processing.
  5. It may validate acceptance status and prepare downstream workflows.
- Dataverse tables involved:
  - `hit_offeringacceptance`
  - `hit_offering`
  - `hit_paymentschedule`
  - `hit_paymenttransaction`
  - `contact`
  - `account`
- External systems involved:
  - Dataverse-only orchestration in the reviewed flows
  - Stripe if payment is initiated as part of the same journey
- Expected outcome:
  - A supporter’s offer acceptance is converted into a governable, trackable commitment with correct pricing, payment status, and readiness for fulfillment.

### Process: Fulfillment progression and outcome recording

- Trigger:
  - A change to `hit_offeringfulfillment` or a fulfillment outcome record
- Process steps:
  1. The fulfillment record is read along with its related acceptance and constituent context.
  2. The process determines the next stage or completion state.
  3. The system updates the fulfillment record and the supporting contact or organisation outcome details.
  4. Tags and engagement data are recalculated based on the completion outcome.
- Dataverse tables involved:
  - `hit_offeringfulfillment`
  - `hit_offeringacceptance`
  - `hit_offering`
  - `contact`
  - `account`
  - `hit_fulfillmentoutcome`
  - `hit_segmenttag`
- External systems involved:
  - Dataverse workflow orchestration
- Expected outcome:
  - A giving or support commitment is moved through its operational lifecycle and becomes visible in donor engagement and segmentation records.

---

## 4. Xero integration

### Process: Finance reconciliation or accounting export

- Trigger:
  - Likely triggered by payment or document-generation workflows, but no direct Xero connector naming was identified in the reviewed flow corpus
- Process steps:
  1. A transaction or donation record is completed and validated.
  2. A finance or invoice process prepares accounting data.
  3. The accounting export would normally be posted to Xero if configured.
- Dataverse tables involved:
  - `hit_paymenttransaction`
  - `hit_offeringacceptance`
  - `contact`
  - `account`
- External systems involved:
  - Xero (not explicitly confirmed in the reviewed flow names or connectors)
- Expected outcome:
  - A formal accounting record or invoice would be created in Xero, enabling finance reconciliation.

### Assessment

- The repository evidence does not show an explicit Xero connector, Xero trigger name, or Xero-specific workflow in the reviewed DSR flow set.
- This means the platform may either:
  - not yet implement Xero integration in the reviewed codebase,
  - implement it outside the unpacked DSR automation files,
  - or use custom logic or another package that is not visible in this solution subset.

---

## 5. Customer Insights Journeys and marketing orchestration

### Process: Journey-driven contact tagging and audience membership

- Trigger:
  - A customer journey or business event from the marketing stack, as signalled by `msdynmkt_*` action triggers
- Process steps:
  1. The platform receives a Customer Insights Journey event or custom action.
  2. The flow resolves the relevant contact or organisation profile.
  3. It applies the specified tag or audience change to the record.
  4. The relevant segmentation or state tag logic then recalculates the contact/organisation’s due or active status.
- Dataverse tables involved:
  - `contact`
  - `account`
  - `hit_segmenttag`
  - `hit_contactsegmenttag`
  - `hit_accountsegmenttag`
  - `msdynmkt_journey`
  - `msdynmkt_email`
- External systems involved:
  - Dynamics / Customer Insights marketing components
  - Custom journey actions exposed through `msdynmkt_catalog` and `msdynmkt_custom`
- Expected outcome:
  - A contact or organisation is updated with the correct journey-induced segment, audience membership, or contactability state.

### Assessment

- The schema includes `msdynmkt_journey`, `msdynmkt_email`, and related marketing tables, and the flow names include custom event triggers such as `cxpTrigger_FlowAddContactTag` and `cxpTrigger_FlowAddOrganisationTag`.
- That indicates a real Customer Insights / journey-aware tagging model is present.
- However, the reviewed workflow set does not show a full end-to-end named journey campaign process like “send email journey” or “journey enrollment flow” in a human-readable business sense. The evidence is strongest for journey-triggered tagging and segmentation, not for a complete external marketing automation process.

---

## 6. Email communications and contactability

### Process: Do-not-email enforcement

- Trigger:
  - A change to a contact’s `donotemail` or `donotbulkemail` values
- Process steps:
  1. The contact record is updated.
  2. The workflow evaluates whether the contact should be treated as no-email or no-bulk-email.
  3. It adds or removes the `CON__DO_NOT_EMAIL` segment tag accordingly.
  4. The resulting tagging state is used by downstream contact preference logic.
- Dataverse tables involved:
  - `contact`
  - `hit_segmenttag`
  - `hit_contactsegmenttag`
- External systems involved:
  - Dataverse contact management and tagging rules
- Expected outcome:
  - Contact preference changes are reflected in the segmentation model and used to suppress unwanted communications.

### Process: Communication event status update

- Trigger:
  - A manual request passing a `hit_communicationevent` ID
- Process steps:
  1. The workflow reads the communication event record.
  2. It updates the communication event `hit_eventstatus` to sent.
  3. It stamps the send time using `utcNow()`.
  4. It returns a success response to the calling app or flow.
- Dataverse tables involved:
  - `hit_communicationevents`
- External systems involved:
  - Power Automate request/response flow and any downstream messaging system that uses the event record
- Expected outcome:
  - Communication events are marked as sent and timestamped, giving a clear operational audit trail.

### Process: Consent/contact point sync

- Trigger:
  - Marketing or contact point update events
- Process steps:
  1. A contact point or marketing consent event is raised.
  2. The flow resolves the contact data and updates the relevant consent or contactability state.
  3. It keeps the profile aligned with the marketing and consent system.
- Dataverse tables involved:
  - `contact`
  - `hit_communicationevents`
  - `property` records tied to consent/contact-point management
- External systems involved:
  - Dynamics marketing consent stack and related marketing components
- Expected outcome:
  - Contact preferences and consent are kept consistent across the fundraising and engagement platform.

---

## 7. Contact management

### Process: Contact import and matching

- Trigger:
  - Insert or update of a `hit_importcontact` record
- Process steps:
  1. An import record is received.
  2. The process normalizes names and email/mobile values.
  3. It resolves or creates the matching `contact` record.
  4. It stamps the contact’s address and phone details where appropriate.
  5. It resolves or creates the related organisation and attaches the contact to it.
  6. It records the relationship and updates the attribute values.
- Dataverse tables involved:
  - `hit_importcontact`
  - `contact`
  - `account`
  - `hit_organisationrelationship` / contact-account linkage patterns
- External systems involved:
  - Dataverse-only workflow matching and enrichment
- Expected outcome:
  - Imported supporter data is cleaned, matched, and linked to the correct person and organisation record without manual rekeying.

### Process: Contact state recalculation

- Trigger:
  - Nightly or scheduled recalculation of active contacts
- Process steps:
  1. The flow lists active contacts.
  2. It iterates over each contact record.
  3. It invokes the contact state recalculation child flow.
  4. The child flow recalculates the contact’s state tags and related engagement state.
- Dataverse tables involved:
  - `contact`
  - `hit_segmenttag`
  - `hit_contactsegmenttag`
- External systems involved:
  - Dataverse scheduled automation
- Expected outcome:
  - Contact segmentation and engagement state stay current without manual maintenance.

---

## 8. Constituent management

### Process: Constituent import and organisation resolution

- Trigger:
  - Insert or update of `hit_importcontact` or `hit_importorganisation`
- Process steps:
  1. The import record is validated.
  2. The process resolves the organisation or constituent record using name and email matching rules.
  3. It creates missing records where necessary.
  4. It links the constituent to the organisation, contact, or account hierarchy.
  5. It updates essential profile fields and relationship metadata.
- Dataverse tables involved:
  - `hit_importcontact`
  - `hit_importorganisation`
  - `contact`
  - `account`
  - `hit_contactsegmenttag`
  - `hit_accountsegmenttag`
- External systems involved:
  - Import processing, no direct external system identified beyond Dataverse
- Expected outcome:
  - Supporter and organisational structure is normalized so fundraising, engagement, and tagging operate on a consistent constituent model.

### Process: Constituent record retrieval and ID resolution

- Trigger:
  - A workflow needs to find a constituent or organisation by name, email, or record identifier
- Process steps:
  1. The process receives the input key (for example name or email).
  2. It looks up or creates the matching constituent record.
  3. It returns the resolved ID back to the calling workflow.
- Dataverse tables involved:
  - `contact`
  - `account`
  - `hit_importcontact`
  - `hit_importorganisation`
- External systems involved:
  - None beyond the Dataverse APIs used by the flow
- Expected outcome:
  - Downstream automation can reliably reference a constituent or organisation record without manual duplication or duplicate record creation.

---

## 9. Payment processing

### Process: Payment scheduling and transaction governance

- Trigger:
  - A commitment or offering acceptance requiring payment allocation, or a payment schedule event
- Process steps:
  1. The platform identifies the required payment schedule or transaction.
  2. It creates or updates the payment transaction and links it to the acceptance and customer records.
  3. It may trigger a Stripe create-payment-intent step or invoice generation based on state.
  4. After settlement, it updates the transaction and fulfillment state.
- Dataverse tables involved:
  - `hit_paymentschedule`
  - `hit_paymenttransaction`
  - `hit_offeringacceptance`
  - `hit_offering`
  - `contact`
  - `account`
- External systems involved:
  - Stripe
  - SharePoint for document outputs
- Expected outcome:
  - Payments are tracked from acceptance to settlement and linked to the donor’s commitment and any generated financial documents.

---

## 10. Additional identifiable process families

### Process: Venue or space booking approval handling

- Trigger:
  - A change in venue booking approval status
- Process steps:
  1. The approval status is observed.
  2. The related booking record is loaded.
  3. The workflow applies the handling logic and updates the booking to its next state.
- Dataverse tables involved:
  - venue booking or space request entities (naming suggests operational/event records)
  - related contact or user records
- External systems involved:
  - Dataverse workflow automation
- Expected outcome:
  - Booking approval and downstream operational state are managed consistently.

### Process: Segmentation and state tag recalculation

- Trigger:
  - Outcome update, nightly recalculation, or journey-generated action
- Process steps:
  1. The system identifies the relevant contact or organisation.
  2. A tag calculation child flow re-evaluates active state and segment membership.
  3. New tags are added or existing ones removed.
- Dataverse tables involved:
  - `contact`
  - `account`
  - `hit_segmenttag`
  - `hit_contactsegmenttag`
  - `hit_accountsegmenttag`
- External systems involved:
  - Dataverse marketing/segmentation logic
- Expected outcome:
  - The supporter profile stays aligned with the latest segmentation and engagement rules.

### Process: Import validation and record quality oversight

- Trigger:
  - New `hit_importcontact` or `hit_importorganisation` data
- Process steps:
  1. Data is validated using email, name, and related values.
  2. It resolves duplicates or creates missing parent records.
  3. It records the post-validation state and updates the linked contact or organisation.
- Dataverse tables involved:
  - `hit_importcontact`
  - `hit_importorganisation`
  - `contact`
  - `account`
- External systems involved:
  - Dataverse and import processing pipelines
- Expected outcome:
  - Poor-quality or duplicate constituent data is reduced before it reaches the operational records of the DSR platform.

---

## High-level operating model

The flows show a single, coherent fundraising and engagement operating model:

1. A supporter or constituent record is created, imported, or updated.
2. An offer or acceptance is created and priced.
3. A payment workflow is initiated and reconciled to Stripe.
4. Fulfillment is completed and tracked.
5. A segment, state, or contactability tag is recalculated.
6. Communication, invoice, or receipt artifacts are generated.
7. The result is a supporter record that is both operationally complete and marketing-ready.

This is a classic constituent-management and fundraising automation pattern rather than a simple transaction processing system.

---

## Lifecycle trace: single Contact from first donation to renewal, lapse, reactivation and outbound engagement

This scenario follows one Contact across the full DSR fundraising and outbound cycle and marks every place where the system may update `hit_nexteligiblecontactdate`.

### 1. Initial donor creation and first gift

- Trigger: a new or imported Contact, or a first `hit_offeringacceptance` / payment event linked to that Contact.
- Early state:
  - The Contact may have no current `hit_nexteligiblecontactdate` value.
  - `hit_contactfrequencyperyear` may be blank or unset.
  - `hit_allowoutbound` may be true or false depending on contact preferences and tags.
- Donation effect:
  - The offering/payment flow records the gift and updates the Contact’s giving and engagement context.
  - The DSR segment/tag recalculation child flow resolves donor value and engagement state (`VAL`, `ENG`, `LIF`, `DLF`).
  - This is where the donor moves from prospective to active, and where the support profile starts to drive outreach cadence.
- `Next Eligible Contact Date` update point A:
  - If the flow later evaluates the Contact as outbound-eligible, `SetNextEligibleContactDate-ContactChild` can initialise `varNextEligibleDate` from `utcNow()` when the current value is empty.
  - It then resolves the cadence and writes the computed future date back to `hit_nexteligiblecontactdate`.

### 2. Renewal window and cadence assignment

- Trigger: the donor is active and the system must schedule the next contact based on engagement cadence.
- Cadence model:
  - `hit_contactfrequencyperyear` = `1`, `2`, `4`, or `12` (Annual / Semi-Annual / Quarterly / Monthly).
  - The child flow converts that to a monthly interval and advances the candidate date until it is in the future.
- Decision logic:
  - If the Contact has a preferred month, the flow chooses a preferred month in the next due year and sets `varNextEligibleDate` to that month.
  - Otherwise it uses the cadence interval to add months until the created date is after `utcNow()`.
- `Next Eligible Contact Date` update point B:
  - The final update in `SetNextEligibleContactDate-ContactChild` writes:
    - `item/hit_nexteligiblecontactdate = @variables('varNextEligibleDate')`
    - `item/hit_contactfrequencyperyear = @variables('iFrequency')`
  - This is the standard “renewal / next touch scheduled” update.

### 3. Donation-driven re-qualification and value shift

- Trigger: a new gift, a recurring acceptance, or a fulfillment completion.
- Process:
  - The donor receives a successful donation or acceptance completion.
  - The segment engine recalculates value and lifecycle status (`VAL__HIGH`, `VAL__MID`, `VAL__LOW`, `LIF__ACTIVE`, `DLF__ACTIVE`, etc.).
  - The donor may move between prospect, first-time, repeat, active, at-risk, and lapsed states.
- Effect on outbound eligibility:
  - If the donor remains eligible and contactable, the flow can keep or adjust the cadence and schedule the next outreach date.
  - If the donor is suppressed or relationship status changes, the date can be cleared.
- `Next Eligible Contact Date` update point C:
  - Any later invocation of `SetNextEligibleContactDate-ContactChild` can overwrite the date using the latest donor state and cadence.
  - This is the main “renewal” recalculation path after a successful giving event.

### 4. Lapse and suppression path

The solution explicitly defines several ways that a Contact can become ineligible for further outbound contact.

#### 4.1 Contact preference or do-not-contact state

- Trigger: a Contact is marked as `do not contact`, `do not email`, `do not bulk email`, or otherwise no outbound contact is allowed.
- Result:
  - the flow executes the `do_not_contact` path
  - `hit_allowoutbound` is set to `false`
  - `hit_outboundactive` is set to `false`
  - `hit_lastoutcome` is set to `No Outbound Contact`
  - `hit_nexteligiblecontactdate` is set to `@null`
  - `hit_contactfrequencyperyear` is set to `@null`
- `Next Eligible Contact Date` update point D:
  - This is an explicit date reset to null, meaning the donor is not eligible for outbound contact until a later reactivation rule resets the state.

#### 4.2 No contact method available

- Trigger: the Contact has no email, mobile, or telephone method and therefore cannot be contacted by outbound methods.
- Result:
  - `hit_allowoutbound = false`
  - `hit_nexteligiblecontactdate = @null`
  - `hit_outboundactive = false`
  - `hit_contactfrequencyperyear = @null`
- `Next Eligible Contact Date` update point E:
  - The date is again cleared, confirming that the system suppresses outreach scheduling when no valid channel exists.

### 5. Recurrence batch: due contacts are activated for outreach

- Trigger: the scheduled recurrence flow runs daily or on a timer.
- Filter:
  - `hit_nexteligiblecontactdate <= today`
  - `hit_allowoutbound = true`
- Result:
  - the batch selects all due Contacts and updates the outreach state.
  - `hit_lastoutboundcontactdate` is set to `todayDate`
  - `hit_outboundactive` is set to `true`
  - the system may add a JRN / queue tag depending on preferred contact channel.
- Important nuance:
  - this recurrence flow does not itself compute a new next date in the reviewed JSON; it activates the current due Contact for outbound processing.
  - The next scheduled date is usually set by the child calculation flow during the donor’s requalification or renewal process, not by the batch selection itself.

### 6. Re-engagement and reactivation

- Trigger: a donor who has lapsed or been suppressed becomes eligible again.
- Recovery conditions may include:
  - a new donation or acceptance
  - a preferred contact state restored after a `do not contact` removal
  - a valid contact method returned
  - tag rules removing the suppression tag and allowing outbound again
- Process:
  - the Contact rejoins the outbound-engagement model
  - the flow removes any `CON__DO_NOT_CONTACT` or similar suppression tag
  - the `SetNextEligibleContactDate-ContactChild` logic runs again with a fresh date calculation
- `Next Eligible Contact Date` update point F:
  - Because the child flow uses `if(empty(contact.hit_nexteligiblecontactdate), today, current date)` and then advances until future, a reactivated record gets a new future scheduled date once eligible again.
  - This is the practical reactivation point where the next contact date becomes active again after lapse/suppression.

### 7. Contact becomes due again after outreach

- Trigger: the donor was previously active and has now been processed through outbound engagement.
- Process:
  - the recurrence batch marks them as contacted and activates the outbound route
  - the donor enters the next cycle of cadence evaluation
  - the system calculates the next future date according to their frequency preference and any preferred month rules
- `Next Eligible Contact Date` update point G:
  - The child flow again writes a future date, advancing the schedule to the next renewal or due window.
  - This is the normal renewal loop: outreach -> recalc -> next date -> wait -> due again.

---

## Lifecycle summary in sequence

1. First donation / first offering acceptance creates donor value and engagement context.
2. Segment recalculation upgrades the donor from prospect to active / repeat / high-value state.
3. The Contact is evaluated by `SetNextEligibleContactDate-ContactChild` and assigned a future `hit_nexteligiblecontactdate`.
4. The donor remains active until their date is reached.
5. The recurrence batch selects due records where `hit_nexteligiblecontactdate <= today` and `hit_allowoutbound = true`.
6. The donor is marked outbound-active and receives the outreach channel (email or phone queue).
7. A new donation, re-engagement, or reclassification can move the donor back into a valid cadence window.
8. A do-not-contact, no-method, or suppression state sets `hit_nexteligiblecontactdate = null` and blocks outbound activity.
9. Reactivation removes the suppression and triggers a fresh next-date calculation.
10. The cycle repeats as a donor moves through active, lapsed, reactivated, and renewed states.

## The core rule to remember

The `hit_nexteligiblecontactdate` field is the scheduler for outbound eligibility. It is set when the donor becomes eligible, cleared when they become ineligible, and recalculated whenever donor state, cadence, or suppression rules change. In other words, it is the operational heartbeat of the DSR contact-engagement lifecycle.

---

## Assumptions and uncertainties

1. Xero integration is not confirmed by the reviewed workflow set.
   - The platform appears finance-aware, but there is no explicit Xero connector or workflow name in the files examined.
2. Customer Insights Journeys are strongly implied by the schema and marketing-related triggers, but the reviewed flows do not show a full external journey execution narrative.
3. Some child flows and orchestration patterns may represent reusable operations rather than standalone end-to-end business processes.
4. Duplicate flows found in both automation and customisation solution packages likely represent the same functional process packaged in two solution contexts, rather than two different business processes.
5. The document is based on static repository artifacts, not a live Power Platform environment, so some external integration boundaries remain inferred.

## Conclusion

The DSR automation layer implements a donor-supporter lifecycle that spans:

- fundraising offer acceptance
- payment processing through Stripe
- fulfillment and outcome tracking
- contact and constituent import matching
- audience and segment tagging
- consent and communication management
- invoice and receipt generation

This is a complete constituent operations pattern for a fundraising and engagement platform, and the flow corpus strongly supports a business-process model centred on managing supporter commitments from acceptance through payment, fulfillment, and ongoing engagement.
