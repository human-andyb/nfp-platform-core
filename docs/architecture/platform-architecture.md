# Platform Architecture

## Purpose

This document describes the high-level runtime architecture for platform-rendered Power Pages experiences and the core ownership boundaries between page composition, acceptance capture, and lifecycle routing.

## Core Runtime Boundaries

1. `pages--platform-renderer` owns page/section/layout/slot composition.
2. section-type templates own slot-level experience rendering.
3. `sections--offering-detail` owns offer selection/capture and acceptance creation initiation.
4. `sections--acceptance-router` owns acceptance lifecycle routing by status and offering type.
5. acceptance templates own form collection and acceptance updates for their domain.

## Acceptance Lifecycle Contract

Current acceptance flow is acceptance-id-first:

1. create `hit_offeringacceptance`
2. redirect to router with `acceptanceid`
3. router loads acceptance record and resolves:
	- status (`draft`, `pending payment`, `completed`, and other lifecycle states)
	- offering type (which acceptance template should render)
4. downstream acceptance templates update existing acceptance records

Canonical route contract:

- `?page=offering-acceptance&acceptanceid=<guid>`

### Venue Confirmation Route Extension

Venue booking now uses a supported post-submit physical confirmation endpoint:

- `/venue-booking-submitted?acceptanceid=<guid>`

This does not replace the canonical acceptance-router model. It is a bounded reliability and UX extension for venue confirmation so submitted state and summary content can render without dependency on platform page slug composition.

Contract continuity rule:

- `acceptanceid` remains the continuity key across router-based and physical-route confirmation flows.

## Offering Autoload Extension

The `hit_offering.hit_autoloadtemplate` flag enables a controlled extension of the existing acceptance-first model.

Current rollout rule:

1. autoload only applies when `hit_autoloadtemplate = true` and the offering has no pricing options
2. offering detail auto-creates acceptance on load
3. redirect still goes through acceptance router using the canonical `acceptanceid` query contract

This keeps router and acceptance-template contracts stable while enabling reduced-friction entry for no-pricing offerings.

## Design Guardrails

1. do not bypass acceptance router by deep-linking directly to specific acceptance templates
2. avoid changing acceptance templates to create-on-submit unless a full cross-template migration plan is approved
3. treat paid-autoload as a separate design decision requiring explicit amount-source rules
4. keep acceptance creation idempotency protections where auto-create is used

## Related Documents

- [../power-pages/page-builder.md](../power-pages/page-builder.md)
- [../power-pages/section-layout-framework.md](../power-pages/section-layout-framework.md)
- [../power-pages/gallery-framework.md](../power-pages/gallery-framework.md)
