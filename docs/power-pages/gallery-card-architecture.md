# Gallery and Card Architecture

See also:

- [page-builder.md](page-builder.md) for the upstream page, section, and slot composition model
- [section-layout-framework.md](section-layout-framework.md) for the 1-5 column layout contract and slot-index rules
- [gallery-framework.md](gallery-framework.md) for gallery resolution, source routing, and troubleshooting

## Overview

This repository contains two gallery systems:

- **Modern web gallery framework**
  - `components--web-gallery`
  - `sections--gallery`
  - `components--web-gallery-source-*`
  - `components--web-gallery-card-*`

- **Legacy offerings gallery**
  - `components--offering-gallery`
  - `components--offering-card`

The modern gallery framework is the primary architecture for configurable gallery pages and slot-driven sections. The legacy offerings gallery is a separate, simpler pathway used for an older offering-specific grid.

---

## 1. Gallery Sources

### Modern source adapter

`power-pages/dsr-prod/nfp-base---nfp-base/web-templates/components--web-gallery/components--web-gallery.webtemplate.source.html`

- Inputs:
  - `gallerySlug`
  - `gallery`
  - `allowQueryOverride`
  - `displayStyle`
  - `displayVariant`
  - `maxColumns`
  - `maxRows`
- Resolves the gallery configuration record by slug or slot-provided gallery record.
- Chooses a source adapter to render item data.
- Supports primary sources:
  - Offerings
  - Personas
  - Programs
  - Featured Content
  - Articles
  - Web Content
  - Impact Stories

### Source adapters

Each `components--web-gallery-source-*` adapter:
- fetches records from the corresponding entity
- normalizes item metadata and target URLs
- computes gallery wrapper classes for display style and variant
- delegates item output to a card template

Source adapters:
- `components--web-gallery-source-offering`
- `components--web-gallery-source-programs`
- `components--web-gallery-source-personas`
- `components--web-gallery-source-featuredcontent`
- `components--web-gallery-source-article`
- `components--web-gallery-source-webcontent`
- `components--web-gallery-source-impactstory`

### Legacy source

`components--offering-gallery/components--offering-gallery.webtemplate.source.html`

- Executes a FetchXML query for active offerings.
- Builds cards with the legacy `components--offering-card` template.
- Renders a simple grid of offering cards.
- Not part of the modern `components--web-gallery` pipeline.

---

## 2. Gallery Renderers

### Core modern renderer

`components--web-gallery`

- Inputs:
  - `gallerySlug`
  - `gallery` record
  - `allowQueryOverride`
  - `displayStyle`
  - `displayVariant`
  - `maxColumns`
  - `maxRows`
- Resolution rules:
  - Query string `?gallery=slug` wins when allowed.
  - Otherwise, uses slot-provided gallery config.
  - Hard fail if override slug does not resolve.
- Outputs a gallery shell with CSS classes and includes the source-specific renderer.

### Section-level renderer

`sections--gallery`

- Reads slot configuration from `hit_platformpageslot`.
- Resolves gallery slug from either:
  - query parameter override
  - slot `hit_webgalleryconfig`
- Passes resolved values into `components--web-gallery`.
- Central entrypoint for section-based galleries on pages.

### Offerings-specific modern renderer

`components-offerings-gallery`

- Loads offerings gallery configuration by slug.
- Maps gallery layout to CSS classes:
  - grid
  - carousel
  - list
- Dispatches to card templates via `components--offering-card`.
- Appears as a separate offering-only component outside the general `components--web-gallery` pipeline.

---

## 3. Card Templates

### Modern gallery cards

- `components--web-gallery-card-standard`
- `components--web-gallery-card-compact`
- `components--web-gallery-card-featured`

These are the reusable visual card templates used by modern web galleries.

### Legacy offering card

- `components--offering-card`

This legacy card template is used only by `components--offering-gallery`.

### Responsibilities

Modern card templates:
- accept data such as `title`, `summary`, `imageUrl`, `href`, `targetAttr`, `typeLabel`, and `ctaLabel`
- render consistent markup with CSS utility classes
- support whole-card or CTA button navigation behavior

---

## 4. Display Styles

Modern gallery wrappers choose one of these display styles and map them to CSS classes:

- `STYLE_GRID` → `hit-gallery--grid`
- `STYLE_CAROUSEL` → `hit-gallery--carousel`
- `STYLE_TILES` → `hit-gallery--tiles`
- `STYLE_ACTIONS` → `hit-gallery--actions`
- `STYLE_MASONRY` → `hit-gallery--masonry`
- `STYLE_MEDIA` → `hit-gallery--media`

These styles are selected in `components--web-gallery` and in individual source adapters based on gallery configuration and display overrides.

---

## 5. Display Variants

Modern galleries use display variants to select card rendering and wrapper variant classes.

Variant mapping:
- `VARIANT_COMPACT` → `components--web-gallery-card-compact`
- `VARIANT_FEATURED` → `components--web-gallery-card-featured`
- other variants → `components--web-gallery-card-standard`

Fallbacks:
- `VARIANT_MINIMAL` currently falls back to `components--web-gallery-card-standard`
- `VARIANT_PROMINENT` currently falls back to `components--web-gallery-card-standard`

Wrapper classes:
- `hit-gallery--variant-standard`
- `hit-gallery--variant-compact`
- `hit-gallery--variant-featured`

---

## 6. Data Flow

### High-level flow

1. `sections--gallery` or a direct include requests a gallery.
2. The gallery slug is resolved from query override or slot config.
3. `components--web-gallery` loads the `hit_webgalleryconfig` record.
4. The gallery configuration determines:
   - source type
   - layout style
   - card variant
   - max items, columns, rows
   - target page and URL parameters
   - open-in-new-tab behavior
5. The appropriate `components--web-gallery-source-*` adapter fetches entity items.
6. Each item’s href is normalized using either:
   - item-specific `hit_weburl`
   - gallery target page + id parameter
   - passthrough `?gallery=` if configured
7. The source adapter selects a card template based on display variant.
8. The gallery wrapper emits the final HTML structure.

### Key data dependencies

Entities involved:
- `hit_webgalleryconfig`
- `hit_offering`
- `hit_program`
- `hit_persona`
- `hit_featuredcontent`
- `hit_article`
- `hit_webcontent`
- `hit_impactstory`
- `hit_platformpage`
- `hit_platformpagesection`
- `hit_platformpageslot`
- `hit_platformsectionlayout`

---

## 7. Key Dependencies

### Templates
- `components--web-gallery`
- `components--web-gallery-source-*`
- `components--web-gallery-card-*`
- `sections--gallery`
- `components-offerings-gallery`
- `components--offering-card`
- `pages--platform-renderer`

### CSS contract
- `.hit-gallery`
- `.hit-gallery--*`
- `.hit-card`
- `.hit-card--*`
- `.hit-card__*`
- `.hit-button`
- `.hit-card__stretchedLink`

---

## 8. Practical Notes

- `components--web-gallery` is the modern configurable gallery entrypoint.
- `sections--gallery` is the section wrapper that resolves gallery config for page slots.
- `components--web-gallery-source-*` adapters are source-specific data loaders and orchestrators.
- `components--web-gallery-card-*` templates are the reusable visual card components.
- `components--offering-gallery` is a separate legacy offering gallery solution.

If this repository needs more detail, the next step is to add a diagram showing the control flow from `sections--gallery` through `components--web-gallery` into source adapters and card templates.
