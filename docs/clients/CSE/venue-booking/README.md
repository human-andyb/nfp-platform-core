# CSE Venue Booking

## Overview

The CSE Venue Booking capability enables organisations and individuals to discover, enquire about, book, and pay for venue hire at the Centre for Strategic Education (CSE) facility in Abbotsford.

The capability is being built as a reusable component of the NFP Platform rather than a standalone CSE-only implementation.

Objectives:

- Generate new revenue streams
- Reduce manual administration
- Improve customer experience
- Centralise bookings and payments
- Capture organisation and contact information within Dataverse
- Reuse existing NFP Platform payment and communication capabilities

## Current Architecture Status

Implemented now:

- Venue submit flow writes to `hit_offeringacceptance` (acceptance-first pattern).
- Direct field mirroring is used for `hit_firstname`, `hit_lastname`, and `hit_email`.
- Full user submission payload is stored in `hit_inputjson`.
- Availability calendar blackout ranges are rendered and blackout dates are non-selectable.
- Availability legend is in place with agreed state colors.

Approved and planned next:

- School/NFP toggle in Organisation Details (`schoolnfp` in `hit_inputjson`).
- Mandatory validation expansion (organisation, role, first name, last name, email).
- Dynamic venue layout card filtering based on configuration booleans and selected booking/session type.
- Booked state split logic for full day, morning, and afternoon rendering.

## Key Stakeholders

| Role | Person |
|--------|---------|
| Sponsor | Simon Le Plastrier |
| Business Lead | Hattie Knutton |
| Requirements | Varsha Dudhwewala |
| Solution Architecture | Andy Barker |
| CRM & CI Configuration | Joshua Clark |

## Launch Target

3 September 2026

## Documentation Index

- 01-current-state.md
- 02-product-definition.md
- 03-launch-mvp.md
- 04-data-model.md
- 05-interface-specification.md
- 06-copilot-build-instructions.md
- 07-ui-reference.md
- 08-architecture-decisions.md
- 09-inputjson-contract.md
- 99-future-backlog.md