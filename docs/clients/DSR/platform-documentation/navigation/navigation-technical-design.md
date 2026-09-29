[Top: Documentation Home](../README.md) | [Navigation Configuration](navigation-configuration.md) | [Navigation Security](navigation-security.md)

# Navigation Technical Design

## Purpose
Describe end-to-end runtime behavior from header template invocation to final HTML, including data retrieval strategy, URL resolution, active-state logic, breadcrumb behavior, and responsive rendering.

## Runtime composition path
The active page renderer includes:
1. layout--header
2. components--web-nav-header
3. content
4. layout--footer

This means menu output is controlled primarily by components--web-nav-header behavior.

## Active implementation state
In components--web-nav-header:
- dynamic custom-nav query logic exists but is commented out.
- active runtime list is hardcoded with one nav item (DSR Home).

## Intended dynamic custom-nav algorithm (currently disabled)
If uncommented, the flow is:
1. Resolve website id.
2. Query hit_webnavmenu for active menu by website and location.
3. Query hit_webnavmenuitem joined with hit_platformroute and mspp_webpage.
4. Build root item list where no parent is defined.
5. Include components--web-nav-header-node for recursive-like child rendering.

## Node renderer behavior
The components--web-nav-header-node template applies:
1. URL precedence:
- route path from hit_platformroute
- fallback to hit_url
- fallback to mspp_partialurl on linked page
2. Query cleanup:
- normalize malformed trailing ? or &
3. Active-state detection:
- compare normalized current request path to resolved nav URL path
4. Child detection:
- select items where hit_parentmenuitem equals current item id
5. CSS class assignment:
- is-active, has-children, hit-nav__submenu classes

## Standard legacy behavior (available but not active)
Header-legacy template performs:
1. primary_nav = weblinks["Default"]
2. profile_nav = weblinks["Profile Navigation"]
3. optional profile filtering based on Header/ShowAllProfileNavigationLinks setting and authentication state
4. bootstrap mobile collapse controls and search/profile blocks

This is standard Power Pages/OOB style behavior but not currently wired as website header template.

## Template and page dependencies

### Core templates
- Header runtime include: layout--header
- Active nav component: components--web-nav-header
- Dynamic nav node renderer: components--web-nav-header-node
- Legacy nav component: Header-legacy
- Breadcrumb templates: Breadcrumbs and Pages Breadcrumb

### Page template reuse pattern
Observed page template usage count from repository exports:
- Platform Renderer template id used by 66 webpage records.
- Default studio template id used by 12 webpage records.
- Strategy Renderer, Search, Profile template ids used by smaller page groups.

This confirms a strongly centralized template architecture where one renderer drives most page experiences.

## Breadcrumb behavior
- OOB breadcrumb rendering template exists and iterates page.breadcrumbs.
- Current active header component does not include breadcrumb logic directly.
- Breadcrumb visibility depends on where Breadcrumbs template is included by page templates/layouts.

## Mobile rendering behavior
- CSS includes responsive nav classes for custom header and submenu behavior.
- Active header markup does not include a JS/mobile toggle controller.
- Legacy header has explicit mobile collapse trigger and navigation region.

## Caching notes
Site settings include header/footer output cache toggles. Current repository evidence does not prove active cache state in deployed environment, only that settings exist.

## Failure and fallback behaviors
- Intended dynamic path:
  - if menu group query returns none, renderer can produce empty menu.
  - if item URL sources are absent, output can become non-clickable text.
- Current static path:
  - deterministic output, no data query failure risk, but limited functionality.

## Related references
- [navigation-overview.md](navigation-overview.md)
- [navigation-configuration.md](navigation-configuration.md)
- [navigation-security.md](navigation-security.md)
- [navigation-diagrams.md](navigation-diagrams.md)

[Bottom: Back](navigation-configuration.md) | [Next](navigation-security.md)
