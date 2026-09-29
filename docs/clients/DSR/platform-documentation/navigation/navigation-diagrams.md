[Top: Documentation Home](../README.md) | [Navigation Security](navigation-security.md)

# Navigation Diagrams

## Purpose
Provide visual architecture and behavior diagrams for the DSR navigation system using current repository evidence.

## 1) Navigation context diagram
```mermaid
flowchart LR
  Visitor[Visitor Browser] --> Renderer[Page Renderer Template]
  Renderer --> Header[layout--header]
  Header --> ActiveNav[components--web-nav-header active]

  ActiveNav --> StaticMenu[Hardcoded DSR Home Link]

  LegacyNav[Header-legacy available] --> OOBMenu[Web Link Sets Default and Profile Navigation]
  CustomNav[Custom Nav Logic disabled] --> CustomTables[hit_webnavmenu and hit_webnavmenuitem]
  CustomTables --> Routes[hit_platformroute optional]
  CustomTables --> Pages[mspp_webpage optional]

  Renderer --> Footer[layout--footer]
```

## 2) Menu configuration flow
```mermaid
flowchart TD
  A[Admin decides nav model] --> B{Model selected}
  B -->|Standard| C[Update Web Link Set and Web Link records]
  B -->|Custom| D[Update hit_webnavmenu and hit_webnavmenuitem records]
  B -->|Temporary static| E[Edit components--web-nav-header template code]

  C --> F[Publish]
  D --> F
  E --> F

  F --> G[Runtime header render]
  G --> H{Active implementation}
  H -->|Current| I[Hardcoded single link output]
  H -->|If switched| J[Dynamic data-driven menu output]
```

## 3) Runtime rendering sequence
```mermaid
sequenceDiagram
  participant U as User Browser
  participant R as Renderer Layout
  participant H as layout--header
  participant N as components--web-nav-header
  participant N2 as components--web-nav-header-node
  participant D as Dataverse nav tables

  U->>R: Request page
  R->>H: Include header
  H->>N: Include active nav component

  alt Current runtime
    N-->>U: Render hardcoded DSR Home link
  else Intended dynamic mode (disabled)
    N->>D: Query menu group and items
    D-->>N: Return nav dataset
    loop For each root item
      N->>N2: Render item and children
      N2-->>N: Return menu HTML fragment
    end
    N-->>U: Render assembled dynamic menu
  end

  R-->>U: Return full page with footer
```

## 4) Role-based visibility decision diagram
```mermaid
flowchart TD
  A[Request to render navigation] --> B{Active header path}
  B -->|Current static| C[Return fixed link set]
  C --> D[No runtime role-conditioned menu filtering in template path]

  B -->|Standard legacy path| E[Resolve weblinks by set]
  E --> F[Apply page-level access constraints]
  F --> G[Render visible links]

  B -->|Custom dynamic path| H[Read custom nav tables]
  H --> I{Table permissions allow read?}
  I -->|No| J[No menu data]
  I -->|Yes| K[Build links from route/URL/page]
  K --> L[Render menu]
```

## 5) Desktop and mobile rendering distinction
```mermaid
flowchart LR
  A[Header template chosen] --> B{Header implementation}
  B -->|components--web-nav-header current| C[Shared static nav markup]
  C --> D[Desktop rendered via CSS]
  C --> E[Mobile rendered via CSS wrap behavior]

  B -->|Header-legacy| F[Bootstrap navbar markup]
  F --> G[Desktop inline nav]
  F --> H[Mobile collapsible toggle menu]
```

## Notes on interpretation
- These diagrams separate current behavior from available but inactive behavior.
- They do not assume role filtering is currently active in the live header path unless evidenced in template execution.

## Related references
- [navigation-overview.md](navigation-overview.md)
- [navigation-configuration.md](navigation-configuration.md)
- [navigation-technical-design.md](navigation-technical-design.md)
- [navigation-security.md](navigation-security.md)
- [../reference/evidence-gaps.md](../reference/evidence-gaps.md)

[Bottom: Back](navigation-security.md)
