# PCP Fundraiser Workflow

## Purpose
Describe the fundraiser experience that PCP is expected to support.

## Current Evidence Level
The repository does not contain the PCP user interface or the fundraiser operational screens. The workflow below is therefore a support model, not a confirmed implementation.

## Likely Work Pattern
1. Fundraiser opens a queue or call list in PCP.
2. Fundraiser views the supporter details included in the export.
3. Fundraiser places or records the call outcome.
4. Follow-up activity is handled in PCP or a connected CRM process.
5. DSR-side re-export or suppression logic may respond to changed eligibility later, but that loop is not confirmed.

## Confirmed Support Boundary
- DSR exports the call-list data.
- PCP-side call handling is not represented in the repository.

## Related Documents
- [Import and queue processing](pcp-import-and-queue-processing.md)
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
- [Current and future state](pcp-current-and-future-state.md)
