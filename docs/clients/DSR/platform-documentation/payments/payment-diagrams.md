# Payment Diagrams

## 1. Capability Context Diagram
```mermaid
flowchart LR
  U[Donor / Member] --> PP[Power Pages Acceptance Router]
  PP --> PF[Payment Sections]
  PF --> PA[Power Automate Flows]
  PA --> ST[Stripe API + Webhooks]
  PA --> DV[(Dataverse)]
  DV --> FF[Fulfillment Processes]
```

## 2. End-to-End Sequence Diagram
```mermaid
sequenceDiagram
  participant User
  participant Router as Acceptance Router
  participant Orchestrator as Orchestrator Flow
  participant PIF as PaymentIntent Flow
  participant Stripe
  participant WebhookPI as PI Webhook Flow
  participant DV as Dataverse

  User->>Router: Open acceptance page
  Router->>DV: Read acceptance status
  Router->>Orchestrator: status-triggered lifecycle
  Orchestrator->>PIF: Create payment intent request
  PIF->>DV: Create payment transaction attempt
  PIF->>Stripe: POST payment_intents
  Stripe-->>PIF: intent id + client secret
  PIF->>DV: Update attempt (processing)
  Orchestrator->>DV: Update acceptance (intent refs)
  Router-->>User: Render payment form
  User->>Stripe: confirmPayment via Stripe Elements
  Stripe->>WebhookPI: payment_intent.* event
  WebhookPI->>DV: Update attempt + acceptance
  Router->>DV: Re-read state
  Router-->>User: Show confirmation
```

## 3. Session / Intent Creation Diagram
```mermaid
flowchart TD
  A[Acceptance Pending Payment] --> B[Orchestrator HTTP call]
  B --> C[Stripe_CreatePaymentIntent Flow]
  C --> D[Load acceptance + existing attempts]
  D --> E[Create new payment transaction attempt]
  E --> F[POST Stripe payment_intents]
  F --> G[Persist intent id and attempt status]
  G --> H[Return client secret + intent id + transaction id]
  H --> I[Orchestrator updates acceptance refs]
```

## 4. Browser, Pages, Flows, Dataverse, Stripe Interaction Diagram
```mermaid
flowchart LR
  Browser --> Router[sections--acceptance-router]
  Router --> Prep[sections--payment-preparing]
  Router --> Pay[sections--payment]
  Pay --> StripeJS[Stripe.js / Elements]
  StripeJS --> Stripe
  Router --> Validation[AcceptanceStatusValidation Flow]
  Router --> DV[(Dataverse)]
  Orchestrator --> DV
  Orchestrator --> PIFlow[Stripe_CreatePaymentIntent]
  PIFlow --> Stripe
  PIFlow --> DV
```

## 5. Webhook Processing Diagram
```mermaid
flowchart TD
  StripeEvt[Stripe Event] --> PIWH[PaymentIntent Webhook Flow]
  StripeEvt --> SIWH[SetupIntent Webhook Flow]

  PIWH --> PIGet[GET /v1/events/{id}]
  PIGet --> PISwitch{Event Type}
  PISwitch -->|succeeded| PIUpdS[Attempt Succeeded + Acceptance Completed]
  PISwitch -->|payment_failed| PIUpdF[Attempt Failed + Acceptance Failed]
  PISwitch -->|requires_action| PIUpdR[Attempt Requires Action]
  PISwitch -->|processing| PIUpdP[Attempt Processing]

  SIWH --> PMGet[GET /v1/payment_methods/{id}]
  PMGet --> UpsertPM[Upsert Stripe Payment Method]
  UpsertPM --> CreateAgr[Create Acceptance Agreement]
  CreateAgr --> CreateSched[Create Payment Schedule]
  CreateSched --> UpdAcc[Mark Acceptance Completed + recurring flags]
```

## 6. Status State Machine Diagram
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
  Failed --> PendingPayment
  Completed --> [*]
  Cancelled --> [*]
```

## 7. Success to Fulfillment Diagram
```mermaid
flowchart TD
  PI_SUCCESS[payment_intent.succeeded] --> TxnSuccess[Transaction attempt status = Succeeded]
  TxnSuccess --> AccComplete[Acceptance status = Completed]
  AccComplete --> OrchComplete[Orchestrator Completed branch]
  OrchComplete --> FulfillRec[Create/Link Offering Fulfillment]
  FulfillRec --> Tags[Recalc contact/org tags]
  Tags --> ConfirmUI[Render confirmation section]
```

## 8. Failure and Retry Diagram
```mermaid
flowchart TD
  PI_FAIL[payment_intent.payment_failed] --> TxnFail[Attempt status = Failed]
  TxnFail --> AccFail[Acceptance status = Failed]
  AccFail --> UserRetry[User retries payment path]
  UserRetry --> NewAttempt[New payment transaction attempt number]
  NewAttempt --> NewPI[Create new payment intent]
  NewPI --> Pending[Back to Pending Payment flow]
```

## 9. Payment Data Model Diagram
```mermaid
erDiagram
  HIT_OFFERINGACCEPTANCE ||--o{ HIT_PAYMENTTRANSACTION : has_attempts
  HIT_OFFERINGACCEPTANCE ||--o| HIT_PAYMENTSCHEDULE : may_create
  HIT_OFFERINGACCEPTANCE ||--o{ HIT_ACCEPTANCEAGREEMENT : may_create
  HIT_STRIPECUSTOMER ||--o{ HIT_STRIPEPAYMENTMETHOD : owns
  HIT_STRIPECUSTOMER ||--o{ HIT_PAYMENTSCHEDULE : used_by
  HIT_STRIPEPAYMENTMETHOD ||--o{ HIT_ACCEPTANCEAGREEMENT : linked_in
  HIT_PAYMENTTRANSACTION }o--|| HIT_OFFERINGACCEPTANCE : belongs_to

  HIT_OFFERINGACCEPTANCE {
    string hit_offeringacceptanceid
    int hit_acceptancestatus
    bool hit_paymentrequired
    string hit_stripepaymentintentid
    string hit_stripeclientsecret
    string hit_stripechargeid
  }
  HIT_PAYMENTTRANSACTION {
    string hit_paymenttransactionid
    int hit_attemptnumber
    int hit_attemptstatus
    string hit_stripepaymentintentid
    string hit_stripeeventid
    string hit_failurecode
  }
```

## 10. Security Boundary Diagram
```mermaid
flowchart LR
  subgraph Browser[User Browser]
    UI[Payment UI + Stripe Elements]
  end

  subgraph Portal[Power Pages]
    Router[Acceptance Router]
    WebAPI[Portal Web API]
  end

  subgraph Automate[Power Automate]
    Orch[Orchestrator]
    PIF[PaymentIntent Flow]
    SIF[SetupIntent Flow]
    PIWH[PI Webhook Flow]
    SIWH[SI Webhook Flow]
  end

  subgraph Stripe[Stripe]
    API[Stripe REST API]
    WH[Webhook Events]
  end

  subgraph Data[Dataverse]
    ACC[Acceptance]
    TXN[PaymentTransaction]
    SCH[PaymentSchedule]
    SCM[StripeCustomer]
    SPM[StripePaymentMethod]
  end

  UI --> Router
  Router --> WebAPI
  Router --> Orch
  PIF --> API
  SIF --> API
  WH --> PIWH
  WH --> SIWH
  Orch --> ACC
  PIF --> TXN
  PIWH --> TXN
  PIWH --> ACC
  SIWH --> SCH
  SIWH --> SCM
  SIWH --> SPM
```
