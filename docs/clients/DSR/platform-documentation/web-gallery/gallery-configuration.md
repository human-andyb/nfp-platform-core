# Gallery Configuration

## Purpose
Describe how a gallery instance is configured and which configuration dimensions influence rendering.

## Configuration objects

### 1. Gallery config record
Primary record: hit_webgalleryconfig

Fields used directly by active templates:
- hit_slug
- hit_isactive
- hit_maxitems
- hit_gallerysourcetype
- hit_offeringtype
- hit_cardtemplate
- hit_gallerytitle
- hit_gallerysubtitle
- hit_targetpage
- hit_idparametername
- hit_openinnewtab

### 2. Slot display configuration
Primary record: hit_platformpageslot

Fields used in active gallery path:
- hit_allowqueryoverride
- hit_displaystyle
- hit_displayvariant
- hit_maxcolumns
- hit_maxrows
- hit_webgalleryconfig

## How gallery instance selection works
Resolution order in active sections--gallery path:
1. If slot allows query override and request has gallery parameter, use query slug.
2. Else if slot has hit_webgalleryconfig lookup, load hit_slug from that record id.
3. If no slug resolved, gallery does not render.

Resolution in components--web-gallery:
1. If allowQueryOverride and effective slug exists, query hit_webgalleryconfig by slug and hit_isactive=1.
2. Else fallback to passed gallery record.
3. If override slug not resolved, emit hard fail message.

## How source content is chosen
Source type option set controls adapter dispatch.
Option set values (hit_gallerysourcetype):
- 815390000 Offerings
- 815390001 Personas
- 815390002 Programs
- 815390003 Featured Content
- 815390004 Articles
- 815390005 Other

Active routing branch handles values 000 through 004 explicitly.
Value 005 falls to unsupported source message in current components--web-gallery branch.

## How display style and variant are chosen
Display style in active path is passed from slot, not loaded from gallery config.

Display style values used by templates:
- 815390000 grid
- 815390001 carousel
- 815390002 tiles
- 815390003 actions
- 815390004 masonry
- 815390005 media

Display variant values used by source adapters:
- 815390000 standard
- 815390001 featured
- 815390002 compact
- 815390003 minimal
- 815390004 prominent

## Card template mapping behavior
In modern source adapters:
- compact routes to components--web-gallery-card-compact
- featured routes to components--web-gallery-card-featured
- minimal routes to components--web-gallery-card-minimal where implemented
- prominent routes to components--web-gallery-card-prominent in offering source
- default routes to components--web-gallery-card-standard

Repository caveat:
- components--web-gallery-card-prominent template file is not present in current export, so prominent variant in offering source can fail at include time.

## Categories, filters, and sorting

### Category assignment
Confirmed runtime category-like controls:
- offering type filter from hit_webgalleryconfig.hit_offeringtype in offering source
- source type selection by hit_gallerysourcetype

Schema-level category/tag relationships exist:
- hit_webgallerytag -> hit_segmenttag
But no active template query reads hit_webgallerytag or segment-tag assignments.

### Filters
Active filters by source:
- offering/program/persona/featuredcontent: hit_isactive=1 and hit_webvisible=1
- article: hit_ispublished=1 and hit_contenttype=815390000
- offering only: optional hit_offeringtype equality

No client-side filter controls were found in gallery templates or gallery JS files.

### Sorting
- modern adapters: createdon descending (offering/program/persona/featuredcontent/article)
- legacy offerings-gallery: offering name ascending
- impactstory/webcontent adapters: displaytitle/name ascending

## Published or active selection rules
Current selected record criteria by source are hard-coded in FetchXML and can be adjusted by template changes, not by site settings.

## Content snippets, site settings, and flows
- No gallery-specific content snippet keys were found.
- No gallery-specific site setting keys were found.
- No gallery runtime flow calls were found.

Only adjacent site setting influence observed:
- Web API field allowlist for hit_offering includes hit_imageurlcardgallery and related display fields, relevant when those fields are read through API on other pages.

## Evidence sources
- power-pages/nfp-base/web-templates/sections--gallery/sections--gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery/components--web-gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-offering/components--web-gallery-source-offering.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-programs/components--web-gallery-source-programs.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-personas/components--web-gallery-source-personas.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-featuredcontent/components--web-gallery-source-featuredcontent.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-article/components--web-gallery-source-article.webtemplate.source.html
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_gallerysourcetype.xml
- solutions/exports/unpacked/dsr/BaseSchema/Other/Relationships/hit_WebGalleryConfig.xml
- solutions/exports/unpacked/dsr/BaseSchema/Other/Relationships/hit_SegmentTag.xml
