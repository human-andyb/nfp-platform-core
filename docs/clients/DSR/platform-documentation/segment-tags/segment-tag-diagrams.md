# Segment Tag Diagrams

## 1. Segment Tag capability context
```mermaid
flowchart TD
  A[Business rules] --> B[hit_segmenttag]
  B --> C[hit_contactsegmenttag]
  B --> D[hit_accountsegmenttag]
  B --> E[hit_contactorgsegmenttag]
  F[Import staging] --> B
  C --> G[Reporting and suppression]
  D --> G
  C --> H[Customer Insights and journeys dependencies]
  D --> H
```

## 2. Tag assignment process
```mermaid
flowchart TD
  A[Tag request] --> B[Lookup tag by code]
  B --> C{Already assigned?}
  C -- yes --> D[Return success]
  C -- no --> E{Exclusive dimension?}
  E -- yes --> F[Remove same-dimension rows]
  E -- no --> G[Keep existing rows]
  F --> H[Create membership row]
  G --> H
```

## 3. Tag refresh process
```mermaid
flowchart TD
  A[Recalc trigger] --> B[Read latest state]
  B --> C[Derive target tag code]
  C --> D[Query existing membership]
  D --> E{Current tag matches target?}
  E -- yes --> F[No change]
  E -- no --> G[Remove old row if needed]
  G --> H[Create or update row]
```

## 4. Tag removal or expiry process
```mermaid
flowchart TD
  A[Remove request or expiry rule] --> B[Locate membership row]
  B --> C{Soft or hard removal?}
  C -- hard --> D[Delete row]
  C -- soft --> E[Set inactive / removed on]
  D --> F[Downstream views update]
  E --> F
```

## 5. Contact Tag entity relationship diagram
```mermaid
erDiagram
  CONTACT ||--o{ HIT_CONTACTSEGMENTTAG : has
  HIT_SEGMENTTAG ||--o{ HIT_CONTACTSEGMENTTAG : defines
  CONTACT ||--o{ HIT_CONTACTORGSEGMENTTAG : may relate
  HIT_SEGMENTTAG ||--o{ HIT_CONTACTORGSEGMENTTAG : defines
```

## 6. Organisation Tag entity relationship diagram
```mermaid
erDiagram
  ACCOUNT ||--o{ HIT_ACCOUNTSEGMENTTAG : has
  HIT_SEGMENTTAG ||--o{ HIT_ACCOUNTSEGMENTTAG : defines
```

## 7. Tag consumption by Customer Insights and journeys
```mermaid
flowchart LR
  A[Segment Tag rows] --> B[Saved views / lists]
  A --> C[Reporting]
  A --> D[Customer Insights solution dependencies]
  D --> E[Segments]
  D --> F[Journeys]
```

## 8. Import and migration tag process
```mermaid
flowchart TD
  A[Import contact / organisation] --> B[hit_importtag]
  B --> C[Validate tag code]
  C --> D[Resolve hit_segmenttag]
  D --> E[Create membership row]
  E --> F[Mark import processed]
```

## 9. Duplicate-prevention decision flow
```mermaid
flowchart TD
  A[Incoming assignment] --> B[Query existing rows]
  B --> C{Found exact same tag?}
  C -- yes --> D[Do not insert duplicate]
  C -- no --> E{Exclusive dimension?}
  E -- yes --> F[Remove conflicting rows]
  E -- no --> G[Insert new row]
```

## 10. Tag lifecycle state diagram
```mermaid
stateDiagram-v2
  [*] --> Defined
  Defined --> Assigned
  Assigned --> Refreshed
  Assigned --> Removed
  Assigned --> Expired
  Refreshed --> Assigned
  Removed --> [*]
  Expired --> [*]
```