# Interface Specification

## Page 1

Venue Landing Page

### Components

- Hero Image
- Venue Overview
- Gallery
- Features
- Capacity
- Pricing Summary
- CTA Button

Button:
Book Venue

---

## Page 2

Availability & Booking

### Components

- Calendar
- Space Selection
- Guest Count
- Event Details

### Availability States

- Blackout
- Full Day
- AM Only
- PM Only

State color map:

- Blackout: dark blue (`#1f3261`)
- Full Day: teal (`#5e95ab`)
- AM Only: orange (`#f99829`)
- PM Only: red (`#dd503a`)

Blackout behavior:

- Data source: `hit_venuespaceblackout`
- Matching rule: inclusive date range from `hit_startdatetime` to `hit_enddatetime`
- Scope: records matching current venue space (`hit_venuespace`)
- Interaction: blackout days are not selectable

### Booking Panel Validation (Current + Approved)

Required fields (approved for immediate implementation):

- Organisation Name
- First Name
- Last Name
- Email

Optional fields:

- Role
- Mobile

Additional approved control:

- School/NFP checkbox under Organisation Name
- JSON key: `schoolnfp`
- Default: `false`

---

## Page 3

Pricing Summary

### Components

- Booking Summary
- Pricing Breakdown
- Terms Acceptance

---

## Page 4

Payment

### Components

- Stripe Payment Form
- Payment Confirmation

---

## Page 5

Success Page

### Components

- Confirmation Message
- Booking Reference
- Email Reminder

## Interface Style

Reference:

/assets/prototype/

The Venue Booking capability uses a persistent booking sidebar with a guided 2-step form pattern.

Layout:

+----------------------+----------------------+
|                      |                      |
| Venue Content        | Booking Panel        |
|                      |                      |
| Tabs                 | Organisation         |
| Gallery              | Step 1: Contact      |
| Availability         | Step 2: Booking      |
| Inclusions           | Request Booking      |
|                      |                      |
+----------------------+----------------------+

Principles

- Single page, guided 2-step experience
- Persistent booking panel
- Tab-based venue exploration
- Mobile responsive
- Component based

### Booking Panel Interaction Pattern

- Step headers: Contact Details and Booking Details.
- Navigation: Next and Back controls with tab-style step indicators.
- Step 1 validation gates Step 2 access.
- Final submission is available only on Booking Details.
- Final CTA label is `Request Booking`.

### Preferred Venue Layout Behavior

Preferred Venue Layout is rendered as selectable cards using `hit_venuespaceconfiguration`.

Cards are filtered by selected:

- Booking Type
- Session Type

Booking-type filter flags:

- `hit_singledateallowed`
- `hit_daterangeallowed`
- `hit_multidateallowed`

Session-type filter flags:

- `hit_allowfullday`
- `hit_allowmorning`
- `hit_allowafternoon`