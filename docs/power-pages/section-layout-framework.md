# Section Layout Framework

## Purpose

This document defines the current 1-5 column section-layout system, explains why it is brittle today, and captures the strengthened contract future implementation work should converge on.

Use this document with [page-builder.md](page-builder.md) when working on:

- layout template behavior
- slot cardinality and slot indexing
- content-mode rendering defects
- responsive section layout behavior
- future layout additions or refactors

## Layout Family

The current layout family consists of five templates:

- [layouts--1-column](../../power-pages/nfp-base/web-templates/layouts--1-column/layouts--1-column.webtemplate.source.html)
- [layouts--2-column](../../power-pages/nfp-base/web-templates/layouts--2-column/layouts--2-column.webtemplate.source.html)
- [layouts--3-column](../../power-pages/nfp-base/web-templates/layouts--3-column/layouts--3-column.webtemplate.source.html)
- [layouts--4-column](../../power-pages/nfp-base/web-templates/layouts--4-column/layouts--4-column.webtemplate.source.html)
- [layouts--5-column](../../power-pages/nfp-base/web-templates/layouts--5-column/layouts--5-column.webtemplate.source.html)

Shared grid styling currently lives in [css--site.css](../../power-pages/nfp-base/web-files/css--site.css).

## Current Contract

### Slot index model

Current effective behavior assumes slot indexes are:

1. 1-based
2. sequential
3. layout-specific

Expected slot indexes by layout:

| Layout | Expected Slot Indexes | Required Slot Count |
| --- | --- | --- |
| 1-column | 1 | 1 |
| 2-column | 1, 2 | 2 |
| 3-column | 1, 2, 3 | 3 |
| 4-column | 1, 2, 3, 4 | 4 |
| 5-column | 1, 2, 3, 4, 5 | 5 |

This contract is real in practice even though it is not currently formalized in code or documentation elsewhere.

### Current resolution patterns

The current implementation now uses shared helpers for slot state, slot discovery, and slot rendering, but still has two structural layers to be aware of.

| Layer | Layouts | Behavior |
| --- | --- | --- |
| slot state | 1-column, 2-column, 3-column, 4-column, 5-column | validates expected count, missing slot indexes, and unexpected slot indexes through `helpers--layout-slot-state` |
| slot discovery | 1-column, 2-column, 3-column, 4-column, 5-column | resolves a slot by index through `helpers--layout-slot-discovery` |
| slot rendering | 1-column, 2-column, 3-column, 4-column, 5-column | delegates rendering to `helpers--layout-slot-render` |

This is stronger than the previous state, because missing-slot, invalid-cardinality, and missing-template behavior are now shared. The remaining brittleness is in the layout design itself, especially one-column specialization and the assumption that sequential slot indexes are always the right model.

## One-Column Specialization

The 1-column layout currently has additional behavior not shared by the other layouts:

1. content width is derived from slot 1
2. horizontal alignment is derived from slot 1
3. slot 1 is resolved more than once in the template

This means the 1-column template is not just a one-slot version of the multi-column family. It behaves like a specialized layout variant with its own presentation settings.

Design implication:

- layout-specific behavior must either be elevated into a clear shared contract or remain explicitly documented as a one-column-only specialization

## Current Failure Modes

The current layout family can fail or degrade in different ways depending on which template is involved.

Common failure classes:

1. missing required slot for the selected layout
2. slot exists but has no `stype.hit_templatename`
3. section layout record points to an unexpected or missing template
4. non-sequential slot indexes leave blank columns in loop-driven layouts
5. one-column-only width and alignment settings do not map cleanly to multi-column layouts
6. debug output is present but not consistent between layouts

Operational impact:

- maintainers must currently understand individual template behavior instead of relying on one clear section-layout contract

## Hardened Target Contract

The strengthened section-layout design should converge on the following rules.

### Slot rules

1. slot indexes are 1-based and sequential
2. each layout has an explicit required slot count
3. any missing required slot is a configuration error
4. every rendered slot must resolve to a valid section-type template

### Resolution rules

1. all layout templates should use one shared slot-resolution approach
2. all layout templates should emit consistent debug and error messages
3. all layout templates should make slot cardinality expectations explicit

### Presentation rules

1. section heading and intro behavior should remain consistent across layouts
2. responsive collapse behavior should be documented for each layout variant
3. one-column-only presentation settings should either become a shared pattern or remain clearly documented as a specialization

## Recommended Layout Matrix

The following matrix should be the working target for maintainers and future hardening work.

| Layout | Current Behavior | Current Weakness | Target State |
| --- | --- | --- | --- |
| 1-column | shared slot state, shared slot discovery, shared slot rendering, special width/alignment handling | special-case layout logic remains | preserve shared helper contract, keep special settings explicit |
| 2-column | shared slot state, shared slot discovery, shared slot rendering | assumes no slot gaps | explicit slot validation and cardinality checks |
| 3-column | shared slot state, shared slot discovery, shared slot rendering | assumes no slot gaps | explicit slot validation and cardinality checks |
| 4-column | shared slot state, shared slot discovery, shared slot rendering | assumes no slot gaps | explicit slot validation and cardinality checks |
| 5-column | shared slot state, shared slot discovery, shared slot rendering | assumes no slot gaps | explicit slot validation and cardinality checks |

## Responsive Behavior

Current grid behavior is centralized in shared CSS. That is good for consistency, but it means layout behavior is only partly visible in Liquid and only partly visible in documentation unless called out explicitly.

Documentation target:

1. define how each layout collapses on tablet and mobile
2. define whether column collapse is symmetrical or priority-based
3. define whether slot order remains source-order or can become responsive-order aware

If implementation later introduces layout metadata for responsive behavior, this document should become the contract reference for that model.

## Spacing and Sticky Behavior Notes

Recent implementation work intentionally kept vertical rhythm and sticky improvements in scoped CSS rather than in layout-template architecture.

Current approach:

1. normalize section-level vertical spacing through shared wrapper CSS and token-driven values where possible
2. avoid per-section spacing property expansion unless a documented exception is needed
3. keep offering-detail sticky CTA behavior scoped to `.hit-offering__capture` at tablet and desktop breakpoints
4. keep mobile behavior in normal flow for the same component
5. keep rich-text list alignment fixes scoped to `.hit-offering__description`

Design intent:

- improve professionalism and consistency without altering slot contracts or layout cardinality semantics

## Guidance For Future Implementation

When strengthening the section-layout system, prioritize the owning contract rather than patching individual layouts in isolation.

Recommended order:

1. formalize slot cardinality and slot-index rules in documentation
2. preserve and reuse `helpers--layout-slot-state`, `helpers--layout-slot-discovery`, and `helpers--layout-slot-render` as the shared helper contract
3. make one-column specialization intentional and explicit
4. align CSS and layout semantics where they currently drift apart
5. decide whether future layout variants should continue the sequential slot-index contract or move to richer layout metadata

## Debug And Verification

When testing a section-layout issue, verify:

1. the section resolves the expected layout template
2. the expected number of slots exist
3. slot indexes are sequential and match the selected layout
4. every required slot has a valid section-type template
5. debug mode shows the same structural expectations across every layout variant

Use `?debug=1` on the page route and inspect:

1. resolved page slug
2. section id
3. layout template
4. slot count
5. slot-level debug or alerts inside the selected layout

## Related Documents

- [page-builder.md](page-builder.md)
- [gallery-framework.md](gallery-framework.md)
- [gallery-card-architecture.md](gallery-card-architecture.md)