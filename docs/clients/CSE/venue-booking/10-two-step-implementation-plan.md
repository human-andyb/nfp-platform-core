# Two-Step Booking Panel Implementation Plan

## Purpose

Define the implementation sequence for the guided two-step venue booking form in the persistent right panel.

---

## Approved Interaction Model

- Step 1: Contact Details
- Step 2: Booking Details
- Step indicators are tab-style headers for orientation.
- Progression is controlled with Next and Back actions.
- Booking Details is gated until Contact Details validates.
- Final submit action is available only on Step 2.
- Final CTA label: Request Booking.

---

## Scope

Included:

- Right-panel two-step interaction model
- Step-scoped validation behavior
- CTA copy update to Request Booking
- Accessibility semantics for step state and focus transitions
- Documentation alignment

Excluded:

- New Dataverse tables
- Intermediate autosave endpoint
- Payment workflow redesign

---

## Implementation Phases

### Phase 1 - Documentation and Decision Alignment

1. Update interface and UI docs to reflect step model.
2. Record architecture decisions for two-step progression and CTA label.
3. Confirm role remains optional and update prior mandatory-field references.

Deliverable:

- Updated documents in 05, 06, 07, and 08 series.

### Phase 2 - Markup Structure

1. Split right-panel form into two step panels in sections--acceptance-venue template.
2. Add step header controls:
   - Contact Details
   - Booking Details
3. Place Contact fields in Step 1:
   - Organisation + School/NFP
   - First Name + Last Name
   - Email
   - Mobile
   - Role
4. Place booking fields and selection summary in Step 2.
5. Keep one form element and one final submit endpoint.

Deliverable:

- Static step layout rendered correctly in panel.

### Phase 3 - Client-Side Step Controller

1. Add state management for active step and unlocked state.
2. Implement Next action:
   - Validate Step 1 fields
   - Focus first invalid field on failure
   - Unlock and show Step 2 on success
3. Implement Back action from Step 2 to Step 1.
4. Preserve entered values when moving between steps.
5. Keep existing booking calculations and calendar logic unchanged.

Deliverable:

- Step transitions and gating behavior working end-to-end.

### Phase 4 - Validation and Submission

1. Keep required fields for Step 1:
   - Organisation
   - First Name
   - Last Name
   - Email
2. Keep Mobile and Role optional.
3. Keep existing Step 2 booking validations.
4. Keep final PATCH to hit_offeringacceptance only on Request Booking click.
5. Verify payload contract remains compatible with 09-inputjson-contract.

Deliverable:

- Functional submit with no contract regressions.

### Phase 5 - Accessibility and Responsive QA

1. Add ARIA semantics for active/inactive step headers and panels.
2. Ensure hidden step panel is removed from tab order.
3. Ensure keyboard users can navigate step controls.
4. Ensure mobile layout does not clip School/NFP control and keeps controls readable.

Deliverable:

- Accessibility baseline and responsive stability.

---

## Technical Notes

- Maintain acceptance-first architecture decision (D-001).
- Do not introduce incremental server writes between steps.
- Keep selection summary and pricing logic in Step 2.
- Keep left-side venue content tabs independent from right-panel step flow.

---

## Verification Checklist

1. Contact Details appears as default active step.
2. Booking Details is inaccessible until Contact Details passes validation.
3. Next and Back preserve all entered values.
4. Request Booking appears only on Step 2.
5. Submit still patches acceptance with expected JSON structure.
6. Role may be blank without blocking submit.
7. No regressions in calendar state colors and layout filtering.
8. No clipping for School/NFP on mobile.

---

## Rollout Suggestion

1. Implement behind a temporary feature flag variable in template.
2. Validate with sponsor/UAT using 2-step flow.
3. Remove flag once approved and stable.
