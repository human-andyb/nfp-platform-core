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
- Status: Approved (pending implementation)

Decision:

- Add checkbox under Organisation Name with concise professional label.
- Persist as `schoolnfp` boolean in `hit_inputjson`, default `false`.
- Make mandatory:
- Organisation Name
- Role
- First Name
- Last Name
- Email

Rationale:

- Supports compliance/reporting segmentation and improves data completeness.

Impact:

- Validation and JSON construction updates required in venue form.

---

### D-007: Configuration-Driven Layout Filtering Matrix

- Date: 2026-08-28
- Status: Approved (pending implementation)

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

## Change Control Notes

- If any decision changes status from Approved to Implemented, update this file and related docs in the same change.
- Keep `09-inputjson-contract.md` synchronized with any payload shape updates.
