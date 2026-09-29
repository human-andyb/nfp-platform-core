# PCP Diagrams

## Purpose
Provide the main Mermaid diagrams for the PCP documentation set.

## Business Capability Context
```mermaid
flowchart LR
  DSR[DSR fundraising operations] --> DV[Dataverse]
  DV --> PA[Power Automate export flows]
  PA --> SP[SharePoint staging]
  SP --> LA[Logic App handoff]
  LA --> PCP[PCP boundary]
```

## File Lifecycle
```mermaid
flowchart LR
  G[Generated] --> S[Staged]
  S --> D[Detected by Logic App]
  D --> T[Transferred]
  T --> R[Received downstream]
  R --> A[Archived or retained]
  A --> C[Reconciled]
```

## Contact Export Lifecycle
```mermaid
stateDiagram-v2
  [*] --> Eligible
  Eligible --> Tagged
  Tagged --> Exported
  Exported --> Staged
  Staged --> LogicAppInvoked
  LogicAppInvoked --> UnconfirmedDownstream
```

## Related Documents
- [Overview](pcp-overview.md)
- [End-to-end technical process](pcp-end-to-end-technical-process.md)
