[Top: Framework Overview](./offering-framework-overview.md)

# Offering Management

## What is implemented
Offering management in this export is metadata-driven via hit_offering and related tables, then rendered through reusable web templates.

## Offering publication controls (confirmed)
- Primary visibility flags used by portal queries:
  - hit_isactive (active check in offering detail fetch)
  - hit_webvisible (present in exposed Web API field list)
- Offering classification and behavior drivers:
  - hit_offeringtype
  - hit_pricingmodel
  - hit_fulfillmentmode
  - hit_allowrecurring
  - hit_subscriptionfrequency

## Pricing model options on hit_offering
- Free
- Fixed (One-off)
- Price Options (One-off)
- Configurable (One-off)
- Fixed (Subscription)
- Price Options (Subscription)
- Deposit + Balance (Split)

## Publication process (implementation view)
1. Offering metadata and pricing configuration are maintained in Dataverse.
2. Portal rendering uses renderer templates and section templates to display offering details.
3. User action creates acceptance records rather than directly creating payment/fulfillment records.
4. Orchestration flow processes acceptance and decides payment/approval/completion transitions.

## Security and exposure
- Offerings table permission (Offerings - Public) grants read access for both Anonymous Users and Authenticated Users web roles.
- Web API is enabled and scoped field lists exist for hit_offering and hit_offeringacceptance.

## Evidence
- Offering attributes and pricing model options:
  - [hit_pricingmodel attribute and options](solutions/exports/unpacked/dsr/BaseSchema/Entities/hit_Offering/Entity.xml#L1482)
- Offering permission:
  - [Offerings - Public permission record](power-pages/nfp-base/table-permissions/Offerings---Public.tablepermission.yml#L8)
- Web API settings:
  - [Webapi/hit_offering fields and enabled](power-pages/nfp-base/sitesetting.yml#L118)
- Active renderer page template id mapping:
  - [Platform Renderer template mapping](power-pages/nfp-base/page-templates/Platform-Renderer.pagetemplate.yml#L1)

## Notes and constraints
- In this export, offering page routing appears renderer-first rather than dedicated legacy offering pages.
- Publication status field msevtmgt_publishstatus exists on entity metadata, but portal runtime in analyzed templates relies on active/id checks and section rendering context.
