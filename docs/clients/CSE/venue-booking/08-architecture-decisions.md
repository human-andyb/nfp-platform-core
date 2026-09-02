# Architecture Decisions

## Purpose

Track architecture decisions for CSE Venue Booking with clear status and implementation impact.

---

## Decision Log

### D-001: Acceptance-First Submission Pattern

- Date: 2026-08-27
- Status: Implemented

Decision:

- Venue form submission writes to `hit_offeringacceptance`.
- Direct page create to `hit_venuespacebookingrequest` is removed from the current flow.

Rationale:

- Aligns with established offering acceptance architecture.
- Reduces coupling between UI and downstream booking/payment orchestration.
- Creates a reusable pattern across offering types.

Impact:

- UI patch target is stable and consistent with platform workflows.
- Downstream processing can evolve without page contract churn.

---

### D-002: Dual Persistence Strategy for Form Data

- Date: 2026-08-27
- Status: Implemented

Decision:

- Mirror key identity fields directly to acceptance columns:
- `hit_firstname`
- `hit_lastname`
- `hit_email`
- Persist complete submission payload to `hit_inputjson`.

Rationale:

- Direct fields support simple reporting/search scenarios.
- JSON payload preserves full user context without frequent schema changes.

Impact:

- Better flexibility for iterative form changes.
- Requires a stable and versioned JSON contract.

---

### D-003: Input JSON Contract as Canonical Submission Envelope

- Date: 2026-08-27
- Status: Implemented (venue baseline), Ongoing (cross-offering rollout)

Decision:

- `hit_inputjson` is the canonical submission envelope for venue.
- Contract is versioned and documented in `09-inputjson-contract.md`.

Rationale:

- Supports configurable offering forms with varying fields.
- Provides structured payload to downstream automation.

Impact:

- Any form changes must be reflected in contract documentation.
- Contract compatibility must be maintained over time.

---

### D-004: Blackout Date Precedence and Selection Blocking

- Date: 2026-08-27
- Status: Implemented

Decision:

- Blackout dates sourced from `hit_venuespaceblackout` are applied as inclusive ranges.
- Blackout state has highest visual precedence and is non-selectable.

Rationale:

- Prevents accidental selection of explicitly unavailable dates.
- Matches operator expectations for blackout windows.

Impact:

- Calendar logic checks blackout before other date states.

---

### D-005: Availability Legend Vocabulary and Color Mapping

- Date: 2026-08-27
- Status: Implemented

Decision:

- Legend labels:
- Blackout
- Full Day
- AM Only
- PM Only
- Palette:
- Blackout: `#1f3261`
- Full Day: `#5e95ab`
- AM Only: `#f99829`
- PM Only: `#dd503a`

Rationale:

- Ensures visual consistency and readiness for booked state split rules.

Impact:

- Booked state derivation logic must map to this legend.

---

### D-006: School/NFP Toggle and Mandatory Field Rules

- Date: 2026-08-28
- Status: Superseded

Decision:

- Add checkbox under Organisation Name with concise professional label.
- Persist as `schoolnfp` boolean in `hit_inputjson`, default `false`.
- Make mandatory:
- Organisation Name
- First Name
- Last Name
- Email
- Role is optional.

Rationale:

- Supports compliance/reporting segmentation and improves data completeness.

Impact:

- Validation and JSON construction updates required in venue form.

Superseded by:

- D-009 for guided two-step interaction and step-gated validation behavior.

---

### D-007: Configuration-Driven Layout Filtering Matrix

- Date: 2026-08-28
- Status: Implemented

Decision:

- Preferred layout cards are filtered using configuration booleans by selected booking and session type.
- Booking filters:
- `hit_singledateallowed`
- `hit_daterangeallowed`
- `hit_multidateallowed`
- Session filters:
- `hit_allowfullday`
- `hit_allowmorning`
- `hit_allowafternoon`

Rationale:

- Ensures users only see valid layouts for selected conditions.

Impact:

- Layout selection logic and card rendering state need enhancement.

---

### D-008: Venue Pricing from VenueSpace Rates with Selection Summary

- Date: 2026-08-28
- Status: Implemented

Decision:

- Venue booking pricing is calculated client-side from `hit_venuespace` fields:
- `hit_fulldayrate`
- `hit_halfdayrate`
- `hit_schoolnfpdiscountpercent`
- `hit_weekendsurchargepercent`
- `hit_holidaysurchargepercent`
- Add a form-level Selection Summary showing:
- Total Dates (unique selected dates)
- Total Amount (calculated total)
- Persist pricing into both:
- `hit_inputjson` (`totalbasefee`, `dates[].billingType`, `dates[].baseFee`)
- Acceptance amount columns (`hit_baseamount`, `hit_totalamount`, `hit_totalamounteffective`)

Rules:

1. Select base rate from session-derived billing type (`FullDay` or `HalfDay`).
2. Apply School/NFP discount if selected.
3. Apply weekend surcharge for Saturday/Sunday bookings.

Explicit scope decision:

- Public holiday surcharge is excluded in this release, even though `hit_holidaysurchargepercent` is loaded.

Rationale:

- Keeps pricing transparent and auditable at date level.
- Reuses existing acceptance/payment amount consumption without new downstream plumbing.
- Delivers requested total visibility to users before submit.

Impact:

- Venue template now owns deterministic date-level fee construction.
- Contract documentation must remain synchronized with pricing metadata keys.
- Future holiday support can be added as a separate decision once a holiday data source is defined.

---

## Change Control Notes

- If any decision changes status from Approved to Implemented, update this file and related docs in the same change.
- Keep `09-inputjson-contract.md` synchronized with any payload shape updates.

---

### D-009: Guided Two-Step Booking Form in Persistent Panel

- Date: 2026-08-31
- Status: Approved

Decision:

- Replace the always-expanded booking form with a guided 2-step in-panel flow:
- Step 1: `Contact Details`
- Step 2: `Booking Details`
- Use tab-style step headers for orientation and `Next`/`Back` controls for progression.
- Gate Step 2 access on successful Step 1 validation.
- Keep final submission on Step 2 only.

Rationale:

- Reduces form length and perceived complexity.
- Keeps booking controls visually aligned with availability and layout choices.
- Preserves user orientation while improving completion flow.

Impact:

- Template markup requires step panels and navigation controls.
- Client-side validation must split into step-scoped checks.
- Existing acceptance PATCH behavior remains single-submit on final action.

---

### D-010: Final CTA Label Standardization for Venue Booking

- Date: 2026-08-31
- Status: Approved

Decision:

- Rename final submission button from `Reserve Booking` to `Request Booking`.

Rationale:

- Better matches current workflow semantics (request captured, downstream processing follows).
- Aligns wording with approval-oriented booking journey.

Impact:

- UI copy update in venue template and references in design/spec docs.

---

### D-011: Unified Offering inputJSON Contract (SchemaVersion 2)

- Date: 2026-08-31
- Status: Approved

Decision:

- Standardize `hit_inputjson` across Venue, EOI, and Donation using `schemaVersion: 2`.
- Keep shared top-level keys identical across all offering types:
- `schemaVersion`, `offeringtype`, `firstname`, `lastname`, `email`, `mobile`, `organisation`, `role`, `totalbaseamount`, `offering`.
- Move only genuinely offering-specific fields into `offering` object by type.
- For Donation, store the monetary value only in top-level `totalbaseamount` and keep `offering` limited to `type`.

Rationale:

- Enables a single orchestration parse model across all offering types.
- Reduces conditional logic and schema drift in downstream flows.
- Preserves compatibility by allowing orchestrator fallback handling for historical `schemaVersion: 1` records.

Impact:

- Acceptance templates for Venue, EOI, and Donation must emit `schemaVersion: 2` payloads.
- Existing direct acceptance column writes remain in place during migration.
- Orchestrator must support dual-read behavior during transition window.
- Power Automate Parse JSON schemas must allow nullable shared contact fields and must not require removed Donation nested fields.

---

### D-012: Venue Submission Redirect to Physical Confirmation Route

- Date: 2026-09-02
- Status: Implemented

Decision:

- After successful venue submission, redirect to the physical page route `/venue-booking-submitted` with `acceptanceid`.
- Do not depend on the platform renderer `?page=` slug resolution for this venue confirmation path.

Rationale:

- Improves reliability for post-submit navigation when platform page slug configuration is incomplete.
- Allows venue-specific confirmation messaging and structure without widening acceptance router complexity.

Impact:

- Venue confirmation flow now resolves through a dedicated page endpoint.
- Acceptance continuity remains key-based through `acceptanceid`.

---

### D-013: Confirmation Rendering Source Precedence

- Date: 2026-09-02
- Status: Implemented

Decision:

- Venue confirmation renders `hit_inputsummary` first when present.
- If `hit_inputsummary` is absent, venue confirmation falls back to parsing `hit_inputjson`.
- Web API field allowlist includes `hit_inputsummary` for acceptance reads.

Rationale:

- Supports asynchronous enrichment while still showing immediate user-facing confirmation details.
- Preserves compatibility for submissions where summary generation has not completed yet.

Impact:

- Confirmation templates must preserve deterministic fallback behavior.
- Payload contract stability for `hit_inputjson` remains required.

---

### D-014: Non-Pricing Offering CTA Field Binding

- Date: 2026-09-02
- Status: Implemented

Decision:

- In offering detail non-pricing mode:
- CTA title binds from `hit_typelabel` with safe fallback copy.
- CTA description binds from `hit_summary` with safe fallback copy.
- CTA button label binds from `hit_ctalabel` with safe fallback copy.
- Pricing option flows remain unchanged.

Rationale:

- Moves non-pricing call-to-action content into Dataverse-configurable fields.
- Preserves behavior for priced offerings and avoids regression in payment-linked journeys.

Impact:

- Offering detail fetch and rendering now depend on these additional content fields.
- Existing pricing acceptance behavior remains stable.

---

### D-015: Scoped CSS Spacing and Sticky Polish for Offering Detail

- Date: 2026-09-02
- Status: Implemented

Decision:

- Apply CSS-only refinements for offering detail vertical rhythm and right-column behavior.
- Keep sticky behavior on `.hit-offering__capture` for tablet and desktop (`>= 768px`) with header-aware top offset.
- Normalize rich-text list spacing and marker alignment under `.hit-offering__description`.
- Keep mobile layout in normal flow (`< 768px`).

Rationale:

- Resolves visible professionalism issues without changing template architecture.
- Uses scoped selectors to minimize cross-page regression risk.

Impact:

- Offering detail readability and CTA persistence improve on longer pages.
- No Liquid, router, or data-contract changes were required for this polish pass.
