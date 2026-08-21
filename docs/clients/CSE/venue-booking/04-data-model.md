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