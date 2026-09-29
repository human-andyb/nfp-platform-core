# DSR Web Gallery Overview

## Purpose
Document how DSR gallery pages are configured, populated, filtered, routed, and secured in the exported Power Pages and Dataverse solution artifacts.

## Business reason for the gallery
The gallery capability is a reusable discovery layer that allows DSR administrators to present curated record lists (for example offerings, programs, personas, and featured content) without changing template code.

Business outcomes enabled by current implementation:
- show relevant content sets by page or slot context
- route visitors from list cards to detail or next-step pages
- support offering acceptance journey entry by driving users to offering detail routes

## Active runtime architecture
Current active pipeline:
1. Web Page route resolves to Platform Renderer page template for most site pages.
2. Platform Renderer loads platform page/section/slot metadata.
3. Slot template resolves to sections--gallery when configured in hit_platformpagesectiontype.
4. sections--gallery resolves effective gallery slug.
5. components--web-gallery loads active hit_webgalleryconfig.
6. components--web-gallery routes to a source adapter by gallery source type.
7. Source adapter queries records using FetchXML, builds href, and routes each item to a card template.
8. Card template renders final clickable UI.

## Web pages and page templates associated
Confirmed active page template used by gallery-capable pages:
- Platform Renderer page template id: 665a986d-1a3a-f111-bec6-000d3a7a0cab

Confirmed active web pages using that page template include:
- Home
- Donate
- Get involved
- Page Not Found
- Persona
- Resources
- The Hub
- What we do
- Who we are

Confirmed gallery-specific direct include pages in exported content are historical deleted pages under web-pages/*-deleted/content-pages/*.webpage.copy.html.

## Content types that can appear
Supported by current components--web-gallery source routing:
- Offerings (hit_offering)
- Personas (hit_persona)
- Programs (hit_program)
- Featured Content (hit_featuredcontent)
- Articles (hit_article)

Additional source templates exist in repository but are not selected by current source-type routing branch:
- components--web-gallery-source-impactstory
- components--web-gallery-source-webcontent

## How configuration affects rendering without code changes
Runtime behavior changes from Dataverse configuration values and slot metadata:
- hit_webgalleryconfig.hit_slug
- hit_webgalleryconfig.hit_gallerysourcetype
- hit_webgalleryconfig.hit_offeringtype
- hit_webgalleryconfig.hit_targetpage
- hit_webgalleryconfig.hit_idparametername
- hit_webgalleryconfig.hit_openinnewtab
- hit_platformpageslot.hit_allowqueryoverride
- hit_platformpageslot.hit_displaystyle
- hit_platformpageslot.hit_displayvariant
- hit_platformpageslot.hit_maxcolumns
- hit_platformpageslot.hit_maxrows

These values alter:
- which records are queried
- how many records are shown
- card variant and gallery style classes
- destination route and querystring format
- whether links open in new tab

## Filtering and sorting at a glance
Filtering is server-side in FetchXML inside source adapters.
No client-side filter UI logic was found in gallery templates.

Observed record eligibility filters:
- offering/program/persona/featuredcontent: hit_isactive = 1 and hit_webvisible = 1
- article: hit_ispublished = 1 and hit_contenttype = 815390000
- offering source only: optional hit_offeringtype = gallery-configured value

Observed sorting:
- offering/program/persona/featuredcontent/article adapters: createdon descending
- legacy components-offerings-gallery: hit_offeringname ascending
- impactstory/webcontent adapters: title/name ascending

## Images and display fields
Modern source adapters map fields per record into common card input contract:
- title: hit_displaytitle fallback to hit_name/offeringname
- summary: hit_summary
- imageUrl: hit_imageurl (modern source adapters)
- typeLabel: hit_typelabel fallback static label

Legacy offering-card templates use richer image fallback:
- hit_imageurldetail
- hit_imageurlcardgallery
- hit_imageurl

## Routing to detail and acceptance
Card click route generation priority:
1. use item-level hit_weburl when present
2. otherwise compose target route from gallery target page plus id parameter
3. append current gallery query parameter when not already present

Offering path relationship to acceptance:
- offering gallery item routes to offering detail page pattern
- offering detail templates create acceptance records and continue to acceptance/payment flow

## Missing or invalid configuration handling
Confirmed handling in active path:
- unresolved override slug in components--web-gallery: hard fail message Gallery slug not found
- unresolved slug in sections--gallery: no gallery render block and optional debug error
- unsupported source type branch in components--web-gallery: Unsupported source type message
- empty query result in source adapter: No [type] found message

Known implementation risk from repository evidence:
- components--web-gallery-source-offering routes prominent variant to components--web-gallery-card-prominent, but that template file is absent in power-pages export.

## Web API and flow usage
No gallery template uses Power Pages Web API endpoints.
No gallery runtime call to Power Automate flows was found in web gallery templates.

## Security controls used by gallery runtime
Gallery data visibility is controlled by:
- table permissions for anonymous and authenticated roles
- published/active field conditions in FetchXML
- query routing through server-side Liquid, not open client data calls

Key read permissions present:
- Web Gallery Config - Read
- Offerings - Public
- Program - Read
- Persona - Read
- Featured Content - Read
- Article - Read
- Web Content - read
- Impact Story - Read

## Evidence sources
- power-pages/nfp-base/page-templates/Platform-Renderer.pagetemplate.yml
- power-pages/nfp-base/web-templates/pages--platform-renderer/pages--platform-renderer.webtemplate.source.html
- power-pages/nfp-base/web-templates/sections--gallery/sections--gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery/components--web-gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-*.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-card-*.webtemplate.source.html
- power-pages/nfp-base/web-pages/**/*.webpage.yml
- power-pages/nfp-base/table-permissions/*.tablepermission.yml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_gallerysourcetype.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_gallerylayouttype.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_cardtemplate.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml
