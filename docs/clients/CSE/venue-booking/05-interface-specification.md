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
- Role
- First Name
- Last Name
- Email

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

The Venue Booking capability uses a persistent booking sidebar pattern.

Layout:

+----------------------+----------------------+
|                      |                      |
| Venue Content        | Booking Panel        |
|                      |                      |
| Tabs                 | Organisation         |
| Gallery              | Contact              |
| Availability         | Booking Details      |
| Inclusions           | Submit Booking       |
|                      |                      |
+----------------------+----------------------+

Principles

- Single page experience
- Persistent booking panel
- Tab-based venue exploration
- Mobile responsive
- Component based

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