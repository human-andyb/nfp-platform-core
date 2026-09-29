[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Diagrams

## 1) Offering capability context
```mermaid
flowchart LR
  User[Portal User] --> PP[Power Pages]
  PP --> OA[hit_offeringacceptance]
  PP --> O[hit_offering]
  PP --> Router[sections--acceptance-router]
  Router --> Flows[Power Automate Flows]
  Flows --> OA
  Flows --> Fulfill[hit_offeringfulfillment]
  Flows --> PayTxn[hit_paymenttransaction]
  Flows --> Stripe[Stripe]
```

## 2) Offering publication process
```mermaid
flowchart TD
  A[Configure hit_offering metadata] --> B[Set type, pricing, fulfillment]
  B --> C[Mark active/web-visible]
  C --> D[Renderer templates expose offering]
  D --> E[User opens offering detail]
```

## 3) User acceptance journey
```mermaid
flowchart TD
  U1[View offering detail] --> U2[Select option or continue]
  U2 --> U3[Acceptance record created]
  U3 --> U4[Redirect to acceptance router]
  U4 --> U5[Complete type-specific form]
  U5 --> U6{Payment required?}
  U6 -->|Yes| U7[Payment branch]
  U6 -->|No| U8[Non-payment completion branch]
  U7 --> U9[Confirmation]
  U8 --> U9
```

## 4) Acceptance orchestration sequence
```mermaid
sequenceDiagram
  participant User
  participant Page as sections--offering-detail
  participant API as Power Pages Web API
  participant DV as Dataverse
  participant OF as Trigger Orchestrator Flow
  participant RT as sections--acceptance-router

  User->>Page: Continue
  Page->>API: POST hit_offeringacceptances
  API->>DV: Create acceptance (Draft)
  DV-->>OF: Trigger on create/update
  User->>RT: Open with acceptanceid
  RT->>DV: Fetch acceptance + offering
  OF->>DV: Update status/payment fields
  RT->>DV: Re-read status (or via validation flow)
  RT-->>User: Render next branch
```

## 5) Acceptance router decision tree
```mermaid
flowchart TD
  A[Load acceptance and offering type] --> B{Status}
  B -->|Completed| C{Payment required}
  C -->|Yes| C1[sections--confirmation]
  C -->|No| C2[sections--confirmation-nonpayment]
  B -->|Pending Payment| D{Payment intent exists}
  D -->|No| D1[sections--payment-preparing]
  D -->|Yes| D2[sections--payment]
  B -->|Failed| E[Danger alert]
  B -->|Cancelled| F[Warning alert]
  B -->|Other| G{Offering Type}
  G --> G1[sections--acceptance-*]
```

## 6) Acceptance state diagram
```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> PendingInformation
  PendingInformation --> PendingPayment
  PendingInformation --> PendingApproval
  PendingInformation --> Completed
  PendingApproval --> PendingPayment
  PendingApproval --> Completed
  PendingPayment --> Completed
  PendingPayment --> Failed
  PendingPayment --> Cancelled
  Completed --> [*]
  Failed --> [*]
  Cancelled --> [*]
```

## 7) Payment-required branch
```mermaid
flowchart TD
  A[Pending Information or Pending Approval] --> B{hit_paymentrequired = true}
  B --> C[Set target/status to Pending Payment]
  C --> D[Create/retrieve Stripe payment intent]
  D --> E[Persist client secret + intent id]
  E --> F[Render payment or preparing template]
  F --> G[Webhook updates payment outcome]
  G --> H[Completed or Failed or Cancelled]
```

## 8) No-payment branch
```mermaid
flowchart TD
  A[Pending Information or Pending Approval] --> B{hit_paymentrequired = false}
  B --> C[Advance to Completed]
  C --> D[Render sections--confirmation-nonpayment]
  D --> E[Trigger fulfillment path if configured]
```

## 9) Type-specific fulfilment branch
```mermaid
flowchart TD
  A[Completed acceptance] --> B[OfferingSpecificFulfillmentHandler child flow]
  B --> C{Offering Type}
  C --> C1[Donation handling]
  C --> C2[Course access handling]
  C --> C3[Membership handling]
  C --> C4[Venue booking handling]
  C --> C5[Other type handlers]
  C1 --> D[Create/update fulfillment artifacts]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
```

## 10) HTTP status-validation sequence
```mermaid
sequenceDiagram
  participant RouterJS
  participant ValidationFlow as Http_AcceptanceStatusValidation
  participant DV as Dataverse

  RouterJS->>ValidationFlow: POST acceptanceId
  ValidationFlow->>DV: Get acceptance
  ValidationFlow->>ValidationFlow: Compute target status
  loop Until found or timeout
    ValidationFlow->>DV: Re-read acceptance
    ValidationFlow->>ValidationFlow: Check status/intent conditions
  end
  ValidationFlow-->>RouterJS: current/target status + payment artifacts
  RouterJS->>RouterJS: Redirect with flowstatus=completed when ready
```

## 11) Dataverse ERD
```mermaid
erDiagram
  hit_offering ||--o{ hit_offeringacceptance : has
  hit_offering ||--o{ hit_priceoption : has
  hit_offering ||--o{ hit_paymenttransaction : has
  hit_offering ||--o{ hit_offeringfulfillment : has
  hit_offeringacceptance ||--o{ hit_offeringfulfillment : drives
```

## 12) Exception and recovery routes
```mermaid
flowchart TD
  A[Router load] --> B{acceptanceid present?}
  B -->|No| B1[Show missing acceptance warning]
  B -->|Yes| C{Acceptance found?}
  C -->|No| C1[Show not-found warning path]
  C -->|Yes| D{Status branch}
  D -->|Pending Payment without intent| E[Render payment-preparing]
  E --> F[Poll validation flow]
  F -->|Ready| G[Redirect completed hint]
  F -->|Timeout| H[Remain on recoverable waiting/error state]
  D -->|Failed| I[Show payment failed alert]
  D -->|Cancelled| J[Show cancelled alert]
```

## Evidence
- [router status/type branch logic](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L202)
- [offering detail fetch and acceptance initiation](power-pages/nfp-base/web-templates/sections--offering-detail/sections--offering-detail.webtemplate.source.html#L557)
- [acceptance bootstrap create and redirect](power-pages/nfp-base/web-files/acceptance-bootstrap.js#L33)
- [orchestrator status/payment progression](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/trigger_OfferingAcceptance-Orchestrator-7510A0ED-7913-F111-8342-000D3A7A0323.json#L567)
- [HTTP validation loop and target transitions](solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/Http_AcceptanceStatusValidation-6EC587EA-F3AB-F111-AAAB-7CED8DD12657.json#L403)
