# Data Model

## Venue

Represents a physical venue.

### Core Fields

- Name
- Description
- Status

---

## Venue Space

Represents a bookable area.

### Examples

- Entire Venue
- Workshop Space
- Board Room

---

## Venue Configuration

Defines layout options.

### Examples

- Theatre
- Boardroom
- Standing
- Workshop
- U-Shape

### Current Filtering Fields

Booking-type booleans:

- `hit_singledateallowed`
- `hit_daterangeallowed`
- `hit_multidateallowed`

Session-type booleans:

- `hit_allowfullday`
- `hit_allowmorning`
- `hit_allowafternoon`

---

## Booking

Represents a booking request.

### Fields

- Booking Number
- Venue
- Space
- Booking Date
- Start Time
- End Time
- Organisation
- Contact
- Status

### Current Note

`hit_venuespacebookingrequest` remains part of the broader booking model, but it is not the current direct page write target for the venue form submission path.

---

## Offering Acceptance (Current Submission Target)

Represents the active per-user transaction envelope for venue booking capture.

### Directly Updated Fields

- `hit_firstname`
- `hit_lastname`
- `hit_email`

### JSON Snapshot Field

- `hit_inputjson`

`hit_inputjson` stores the canonical form submission payload for venue and is versioned via schema metadata inside the JSON object.

---

## Booking Pricing

Stores pricing breakdown.

### Fields

- Category
- Quantity
- Amount
- Tax
- Total

---

## Payment

Uses existing platform payment architecture.

Associated with:

- Booking
- Offering Acceptance
- Stripe Payment Intent

---

## Relationship Overview

Venue
    -> Venue Space
    -> Venue Configuration

Booking
    -> Venue
    -> Account
    -> Contact
    -> Pricing
    -> Payment

Current submission sequence (venue):

Offering Acceptance
    -> captures user-entered venue booking payload in `hit_inputjson`
    -> mirrors key identity fields
    -> routes to downstream workflow and payment orchestration