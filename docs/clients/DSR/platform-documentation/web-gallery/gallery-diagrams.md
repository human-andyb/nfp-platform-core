# Gallery Diagrams

## 1) Business context diagram
```mermaid
flowchart LR
  U[Site Visitor] --> P[Power Pages Route]
  P --> R[Platform Renderer]
  R --> G[Gallery Section]
  G --> C[Gallery Config]
  C --> S[Source Records]
  S --> K[Card Render]
  K --> N[Next Process Route]
  A[Administrator] --> C
```

## 2) Configuration process diagram
```mermaid
flowchart TD
  A[Configure Web Gallery Config record] --> B[Set source and behavior fields]
  B --> C[Bind config to platform page slot]
  C --> D[Publish active records]
  D --> E[Slot allows optional query override]
  E --> F[Runtime selects effective gallery slug]
```

## 3) Runtime rendering sequence diagram
```mermaid
sequenceDiagram
  participant B as Browser
  participant PR as Platform Renderer
  participant SG as sections--gallery
  participant WG as components--web-gallery
  participant SA as source adapter
  participant DV as Dataverse

  B->>PR: request page
  PR->>DV: query page section slot metadata
  DV-->>PR: metadata
  PR->>SG: include sections--gallery
  SG->>WG: include components--web-gallery with slug
  WG->>DV: query active gallery config
  DV-->>WG: config row
  WG->>SA: include source adapter by source type
  SA->>DV: fetch source rows with filters and sort
  DV-->>SA: result rows
  SA-->>B: rendered cards
```

## 4) Data model diagram
```mermaid
erDiagram
  hit_webgalleryconfig ||--o{ hit_webgallerytag : tagged_by
  hit_segmenttag ||--o{ hit_webgallerytag : categorizes
  hit_webgalleryconfig ||--o{ hit_platformpageslot : selected_by_slot

  hit_webgalleryconfig {
    guid hit_webgalleryconfigid
    string hit_slug
    int hit_gallerysourcetype
    int hit_maxitems
    string hit_targetpage
    string hit_idparametername
  }

  hit_offering {
    guid hit_offeringid
    string hit_offeringname
    string hit_displaytitle
    bool hit_isactive
    bool hit_webvisible
  }

  hit_program {
    guid hit_programid
    string hit_name
    bool hit_isactive
    bool hit_webvisible
  }

  hit_persona {
    guid hit_personaid
    string hit_name
    bool hit_isactive
    bool hit_webvisible
  }

  hit_featuredcontent {
    guid hit_featuredcontentid
    string hit_name
    bool hit_isactive
    bool hit_webvisible
  }

  hit_article {
    guid hit_articleid
    string hit_name
    bool hit_ispublished
    int hit_contenttype
  }
```

## 5) Filtering decision flow diagram
```mermaid
flowchart TD
  A[Source adapter selected] --> B{Source type}
  B -->|Offerings| C[Filter active and visible]
  C --> D{offering type configured}
  D -->|yes| E[Apply offering type filter]
  D -->|no| F[Skip offering type filter]
  E --> G[Sort and limit]
  F --> G
  B -->|Programs Personas Featured| H[Filter active and visible]
  H --> G
  B -->|Articles| I[Filter published and content type]
  I --> G
  B -->|Unsupported| J[Render unsupported source]
```

## 6) Item selection and routing diagram
```mermaid
flowchart TD
  A[Row mapped to card model] --> B{hit_weburl present}
  B -->|yes| C[Use item web url]
  B -->|no| D[Build target page + id parameter]
  D --> E{gallery query exists on request}
  E -->|yes| F[Append gallery passthrough if missing]
  E -->|no| G[No passthrough append]
  C --> H[Render href]
  F --> H
  G --> H
```

## 7) Gallery to offering acceptance relationship diagram
```mermaid
flowchart LR
  A[Gallery Offerings Source] --> B[Offering Card]
  B --> C[Offering Detail Page]
  C --> D[Offering Acceptance Creation]
  D --> E[Acceptance Router]
  E --> F[Payment or Completion]
```

## Notes on evidence boundaries
- Tag relationship entities are represented in schema diagrams because relationships exist in metadata.
- No active gallery template evidence confirms runtime filtering by segment tags.
- Impact story and web content entities are excluded from active routing diagrams because source dispatch branch does not route to those adapters in active components--web-gallery.
