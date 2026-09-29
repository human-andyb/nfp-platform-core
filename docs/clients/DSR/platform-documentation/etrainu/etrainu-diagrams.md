# ETrainU Diagrams

## 1. End-to-end course access
```mermaid
flowchart TD
  A[Offering published] --> B[Course acceptance opened]
  B --> C[Acceptance saved in Dataverse]
  C --> D[Parent fulfillment flow]
  D --> E[ETrainU organisation flow]
  D --> F[ETrainU participant flow]
  E --> G[CourseDefinition updated]
  F --> H[CourseRegistration updated]
```

## 2. Acceptance to course branch
```mermaid
flowchart TD
  A[sections--acceptance-router] --> B{offering type = course?}
  B -- yes --> C[sections--acceptance-course]
  B -- no --> D[other branch]
  C --> E[Capture audience and plan]
  E --> F[PATCH acceptance]
```

## 3. Organisation provisioning
```mermaid
flowchart TD
  A[Acceptance] --> B[Load account]
  B --> C[Authenticate]
  C --> D[List locations]
  D --> E{Location exists?}
  E -- yes --> F[Store existing ETrainU org id]
  E -- no --> G[Create location]
  G --> H[Create CourseDefinition]
```

## 4. Participant provisioning
```mermaid
flowchart TD
  A[Acceptance + contact] --> B[Authenticate]
  B --> C[Search participant by email]
  C --> D{Found?}
  D -- yes --> E[Update participant]
  D -- no --> F[Create participant]
  E --> G[Store participant id]
  F --> G
  G --> H[Create or update CourseRegistration]
```

## 5. Enrolment sync
```mermaid
stateDiagram-v2
  [*] --> NotRegistered
  NotRegistered --> Registering
  Registering --> Registered
  Registering --> RegistrationFailed
  Registered --> AccessAdjusted
```

## 6. Data ownership
```mermaid
erDiagram
  hit_OfferingAcceptance ||--o{ hit_CourseRegistration : drives
  hit_CourseDefinition ||--o{ hit_CourseRegistration : groups
  account ||--o{ hit_CourseDefinition : owns
  contact ||--o{ hit_CourseRegistration : learns
```

## 7. API interaction
```mermaid
sequenceDiagram
  participant P as Power Automate
  participant E as ETrainU API
  P->>E: POST /authenticate
  E-->>P: token
  P->>E: GET /locations or POST /participants/search
  E-->>P: existing or new record
  P->>E: POST or PUT follow-up
```

## 8. Error path
```mermaid
flowchart TD
  A[API or Dataverse failure] --> B{Transient?}
  B -- yes --> C[Retry the flow]
  B -- no --> D[Surface flow failure]
  C --> E[Reconcile ids]
  D --> E
```

## 9. Process-component matrix
```mermaid
flowchart LR
  A[Portal] --> B[Power Automate]
  B --> C[Dataverse]
  B --> D[ETrainU]
  C --> D
```

## 10. Responsibility split
```mermaid
flowchart TD
  A[DSR] --> B[Acceptance and registration]
  A --> C[Identity mapping]
  D[ETrainU] --> E[Participant and location records]
  D --> F[LMS access]
```