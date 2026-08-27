# Current State Assessment

## Objective

Provide a consolidated view of where the Venue Booking project currently stands.

---

## Information Sources

- Venue Booking Requirements Workbook
- Venue Booking Profitability Model
- Discovery Workshops
- Email Correspondence
- Board Demonstration Prototype
- CSE Website Planning Sessions

---

## What Exists

### Business Requirements

Status: Complete

A comprehensive requirements workbook exists containing:

- Venue information
- Pricing structures
- Booking journeys
- Functional requirements
- Future enhancements

---

### Visual Assets

Status: Available

Assets include:

- Venue photography
- Branding assets
- Website content
- Brochure content

---

### Platform Foundations

Status: Available

Existing platform services include:

- Dataverse
- Power Pages
- Stripe Integration Framework
- Customer Insights Journeys
- Offering Acceptance Pattern
- Payment Processing Framework

---

## Current Risks

### Stripe Production Access

Production Stripe account setup pending.

### Scope Inflation

Requirements document contains MVP through to future-state requirements.

### Availability Logic

Availability management approach not yet finalised.

### Pricing Governance

Pricing ownership and configuration management requires confirmation.

---

## Immediate Priority

Deliver launch-ready venue booking capability for 3 September 2026.

---

## Latest Architecture Decisions (August 2026)

### Implemented

1. Submission persistence pattern changed to acceptance-first.

- Venue form submission now updates `hit_offeringacceptance`.
- Direct booking creation to `hit_venuespacebookingrequest` from the page has been removed.

2. Identity fields are mirrored directly for operational visibility.

- `hit_firstname`
- `hit_lastname`
- `hit_email`

3. Canonical form snapshot is persisted to `hit_inputjson`.

- Venue form data is serialized and written as JSON.
- This pattern is intended to become consistent across offering types.

4. Availability blackout behavior is active.

- Blackout data is sourced from `hit_venuespaceblackout`.
- Date ranges are applied inclusively from `hit_startdatetime` to `hit_enddatetime`.
- Blackout days are rendered unavailable and not selectable.

5. Availability legend is live with agreed labels and colors.

- Blackout
- Full Day
- AM Only
- PM Only

### Approved / In Progress

1. Add School/NFP indicator under Organisation Name.

- Label: concise and professional
- Stored in `hit_inputjson` as `schoolnfp` boolean
- Default: `false`

2. Strengthen required-field validation.

- Organisation Name
- Role
- First Name
- Last Name
- Email

3. Filter preferred layout options dynamically.

- Source: `hit_venuespaceconfiguration`
- Filters by selected booking type and session type using boolean flags.

4. Split booked day display logic.

- Full day
- Morning only
- Afternoon only

### Key Risk Update

Availability state logic is partially complete.

- Blackout handling is implemented.
- Booked full-day/morning/afternoon state derivation rules are still to be finalized and implemented.