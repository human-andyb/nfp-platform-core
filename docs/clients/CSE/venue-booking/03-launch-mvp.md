# Launch MVP

## Purpose

Defines functionality required for launch.

Anything not listed here is outside MVP.

---

# Included

## Public Venue Information

- Hero banner
- Venue overview
- Gallery
- Configurations
- Capacity
- Accessibility
- Pricing summary
- FAQs

---

## Booking Request

User can:

- Select room
- Select booking type
- Select date
- Enter number of guests
- Enter event information
- Review estimated pricing

Persistence approach for current MVP:

- Submission updates the existing `hit_offeringacceptance` record.
- Core contact fields are mirrored directly for reporting/search (`hit_firstname`, `hit_lastname`, `hit_email`).
- Full captured form input is serialized to `hit_inputjson`.
- Direct create to `hit_venuespacebookingrequest` from the venue page is not part of the current MVP flow.

---

## Payment

User can:

- Pay booking deposit
- Receive payment confirmation

---

## Communications

System sends:

- Booking received
- Booking confirmed
- Payment confirmation

---

## Administration

Staff can:

- View bookings
- View customer details
- View payment status
- Approve bookings
- Reject bookings

---

# Excluded

## Phase 2+

- Waitlists
- Event RSVP management
- Co-working
- Referral program
- Membership discounts
- Self-service portal
- Advanced reporting
- Event management
- Survey functionality
