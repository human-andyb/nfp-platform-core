# PCP Overview

## Purpose
Explain what PCP is in the DSR context and where it fits in the fundraising operating model.

## Business Context
DSR uses a file-based export to prepare outbound calling lists for a downstream phone-queue process referred to in the repository as PCP. DSR remains the system that selects records, prepares the file, stages it, and invokes the next integration step. PCP-side import, queue assignment, and call handling are only partly evidenced.

## What PCP Does
- Receives outbound call-list files prepared by DSR.
- Supports fundraising contact-centre activity.
- Appears to consume phone-queue or call-list exports rather than acting as the source of truth for donor data.

## Systems and Roles
- Dataverse stores supporter data, eligibility state, segment tags, and export-driving records.
- Power Automate creates the CSV export and drives the handoff.
- SharePoint is the confirmed staging location.
- A Logic App endpoint is the confirmed next hop.
- PCP-side import and fundraiser use are inferred but not fully evidenced.

## Confirmed Data Sent Out of DSR
- Contact and organisation identity data.
- Phone numbers.
- Email address where present.
- CRM URL for the originating record.
- Queue classification derived from segment tags and export bucket logic.

## Current State Versus Future State
- Current state: DSR exports files for a PCP-style outbound calling process.
- Future state: no implemented PCP redesign is evidenced in the repository.

## Related Documents
- [Business process](pcp-business-process.md)
- [Contact selection](pcp-contact-selection.md)
- [Queue management](pcp-queue-management.md)
- [Flow processing](pcp-power-automate-processing.md)
- [Evidence gaps](pcp-evidence-gaps.md)
