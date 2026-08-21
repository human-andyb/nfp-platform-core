# GitHub Copilot Build Instructions

Act as a senior Power Platform solution architect.

Build a reusable Venue Booking capability for the NFP Platform.

Do not build a CSE-specific solution.

Use:

- Power Pages
- Dataverse
- Power Automate
- Stripe

Requirements:

1. All venue data configurable.
2. No pricing hardcoded.
3. No venue details hardcoded.
4. Support multiple future venues.
5. Reuse existing payment architecture.
6. Reuse Offering Acceptance architecture.
7. Follow platform naming standards.
8. Document all schema additions.

UI REQUIREMENT

Replicate the visual and interaction design contained within:

docs/clients/CSE/venue-booking/assets/prototype/

Specifically:

- Two-column layout
- Persistent booking sidebar
- Space, Availability, Inclusions and Images tabs
- Gallery modal interaction
- Card-based layout selection
- Booking submission panel

The implementation may differ technically but should preserve the customer experience.

Deliver:

- Dataverse schema
- Power Pages design
- Booking workflow
- Payment workflow
- Administration model
- Security design
- Deployment instructions

Do not generate code until architecture is approved.