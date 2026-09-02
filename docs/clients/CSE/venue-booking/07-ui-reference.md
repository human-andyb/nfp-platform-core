# Venue Booking UI Reference

## Purpose

This document captures the original Venue Booking prototype used during discovery and validation with CSE.

The screenshots represent the intended customer experience and visual design direction.

They should not be treated as technical specifications.

Architecture, Dataverse schema and workflow implementation are defined separately.

---

# Overall Layout

The page uses a two-column design.

## Left Column

Venue information area.

Contains:

- Tab navigation
- Space details
- Availability calendar
- Inclusions listing
- Image gallery

## Right Column

Persistent booking panel.

Contains:

- Step 1: Contact Details
- Step 2: Booking Details
- Layout selection
- Booking submission (`Request Booking`)

The booking panel remains visible regardless of selected venue tab, while form content is guided by step progression.

Behavior note:

- On tablet and desktop breakpoints, the right panel uses sticky behavior to remain visible while the left content scrolls.
- On mobile breakpoints, the panel returns to normal flow for readability and usable scrolling.

---

# Design Principles

## Principle 1

Allow venue exploration without leaving the booking page, while guiding completion through two booking steps.

## Principle 2

Allow booking request submission only after required Contact Details are complete and Booking Details is active.

## Principle 3

Minimise page navigation by using in-panel steps with `Next`/`Back` controls.

## Principle 4

Present all critical booking information on a single screen with progressive disclosure to reduce cognitive load.

---

# Step Interaction Model

- Step headers: `Contact Details` and `Booking Details`.
- Step 1 fields: Organisation (+ School/NFP), First Name, Last Name, Email, Mobile, Role.
- Step 2 fields: booking type/date/session/layout/notes and selection summary.
- Validation gate: Step 2 remains locked until Step 1 mandatory fields pass validation.
- Final submission action appears only in Step 2 with button label `Request Booking`.

---

# Post-Submission Confirmation

After successful submission, the user is redirected to:

- `/venue-booking-submitted?acceptanceid=<guid>`

The confirmation page must:

- clearly state that the request has been submitted and will be reviewed
- render summary content from `hit_inputsummary` when available
- fall back to `hit_inputjson` to ensure immediate confirmation details are shown