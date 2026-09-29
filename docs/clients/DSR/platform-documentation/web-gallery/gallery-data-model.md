# Gallery Data Model

## Purpose
Document the Dataverse entities that participate in DSR gallery configuration and runtime retrieval.

## Data model summary
The active gallery runtime is configuration-driven from hit_webgalleryconfig and slot metadata, then query-driven against source entities.

## Core entities

| Business name | Logical name | Purpose in gallery capability | Key columns evidenced in runtime | Key relationships evidenced | Read by runtime | Updated by runtime |
|---|---|---|---|---|---|---|
| Web Gallery Config | hit_webgalleryconfig | Defines gallery source, limits, routing, and behavior | hit_slug, hit_isactive, hit_gallerysourcetype, hit_maxitems, hit_targetpage, hit_idparametername, hit_offeringtype, hit_cardtemplate, hit_openinnewtab | Referenced by hit_platformpageslot.hit_webgalleryconfig; related via hit_webgallerytag | yes | no |
| Offering | hit_offering | Source records for offering gallery cards | hit_offeringid, hit_offeringname, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_slug, hit_weburl, hit_isactive, hit_webvisible, hit_offeringtype | consumed by offering adapter; related business journey to acceptance process outside gallery | yes | no |
| Program | hit_program | Source records for program cards | hit_programid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_isactive, hit_webvisible | consumed by programs adapter | yes | no |
| Persona | hit_persona | Source records for persona cards | hit_personaid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_isactive, hit_webvisible | consumed by personas adapter | yes | no |
| Featured Content | hit_featuredcontent | Source records for featured content cards | hit_featuredcontentid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_isactive, hit_webvisible | consumed by featured content adapter | yes | no |
| Article | hit_article | Source records for article cards | hit_articleid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_ispublished, hit_contenttype | consumed by article adapter | yes | no |
| Web Content | hit_webcontent | Source records for web content adapter file present in repo | hit_webcontentid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_isactive, hit_webvisible | adapter exists but not wired in active source dispatch | no in active dispatch | no |
| Impact Story | hit_impactstory | Source records for impact story adapter file present in repo | hit_impactstoryid, hit_name, hit_displaytitle, hit_summary, hit_imageurl, hit_typelabel, hit_weburl, hit_isactive, hit_webvisible | adapter exists but not wired in active source dispatch | no in active dispatch | no |
| Web Gallery Tag | hit_webgallerytag | Bridge between gallery config and segment tags | hit_webgallerytagid, hit_webgalleryconfig, hit_segmenttag | relationship to hit_segmenttag confirmed | no in active templates | no |
| Segment Tag | hit_segmenttag | Category taxonomy referenced by gallery tag bridge | hit_segmenttagid, hit_name | linked from hit_webgallerytag | no in active templates | no |

## Supporting portal metadata entities

| Business name | Logical name | Purpose in gallery capability | Runtime operation |
|---|---|---|---|
| Platform Page | hit_platformpage | Resolves page slug context | read |
| Platform Page Section | hit_platformpagesection | Resolves section composition | read |
| Platform Page Slot | hit_platformpageslot | Carries slot-level gallery controls and lookup | read |
| Platform Page Section Type | hit_platformpagesectiontype | Provides section template name sections--gallery | read |

## Option sets used by gallery

### Gallery source type (hit_gallerysourcetype)
- 815390000 Offerings
- 815390001 Personas
- 815390002 Programs
- 815390003 Featured Content
- 815390004 Articles
- 815390005 Other

### Gallery layout type (hit_gallerylayouttype)
- 815390000 Grid
- 815390001 Carousel
- 815390002 List

### Card template (hit_cardtemplate)
- 815390000 Standard
- 815390001 Compact
- 815390002 Featured

### Offering type (hit_offeringtype)
- 815390000 Donation
- 815390001 Event
- 815390002 Course Access
- 815390003 Membership
- 815390004 Volunteer Engagement
- 815390005 Resource Download
- 815390006 Sponsorship
- 815390007 Expression of Interest
- 815390008 Venue Booking

## Security model: who can read or update
Gallery runtime reads are enabled by table permissions assigned to two roles:
- 545d6359-a3a5-4d5d-b7fc-94cfcb291f99
- ffddf9fc-4327-4086-99c1-a8239e850ff8

These role ids correspond to Anonymous Users and Authenticated Users in portal role configuration.

Permission evidence for read access:
- hit_webgalleryconfig: read true
- hit_offering: read true
- hit_program: read true
- hit_persona: read true
- hit_featuredcontent: read true
- hit_article: read true
- hit_webcontent: read true
- hit_impactstory: read true

No gallery template performs record writes.

## Confirmed versus unconfirmed behavior
Confirmed:
- runtime uses config and source entities listed above
- active source dispatch includes offering/persona/program/featuredcontent/article
- tag bridge tables exist in schema

Unconfirmed in active templates:
- runtime consumption of hit_webgallerytag or hit_segmenttag for filtering
- runtime use of impact story or web content sources through active source-type branch

## Evidence sources
- power-pages/nfp-base/web-templates/pages--platform-renderer/pages--platform-renderer.webtemplate.source.html
- power-pages/nfp-base/web-templates/sections--gallery/sections--gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery/components--web-gallery.webtemplate.source.html
- power-pages/nfp-base/web-templates/components--web-gallery-source-*.webtemplate.source.html
- power-pages/nfp-base/table-permissions/*.tablepermission.yml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_WebGalleryConfig/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Offering/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Program/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Persona/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_FeaturedContent/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Article/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_WebContent/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_ImpactStory/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_WebGalleryTag/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_SegmentTag/Entity.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_gallerysourcetype.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_gallerylayouttype.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_cardtemplate.xml
- solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml
