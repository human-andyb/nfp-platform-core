[Top: Documentation Home](../README.md) | [Navigation Overview](navigation-overview.md) | [Navigation Technical Design](navigation-technical-design.md)

# Navigation Configuration

## Purpose
Explain how an authorized administrator maintains menu groups, menu entries, hierarchy, display order, labels, URLs, and visibility rules.

## Administrator configuration models

### Model A: Standard Power Pages navigation (Web Link Sets)
Menu groups are Web Link Sets:
- Default
- Profile Navigation
- Default_A8CCF500

Menu entries are Web Link records linked to a Web Link Set. Important fields include:
- adx_name (label)
- adx_displayorder (order)
- adx_parentweblinkid (parent-child hierarchy)
- adx_pageid (internal page target)
- adx_openinnewwindow (new tab behavior)
- adx_displaypagechildlinks (include child page links)

### Model B: Custom NFP navigation (Web Nav Menu)
Menu groups are hit_webnavmenu records (for example header menu location).

Menu entries are hit_webnavmenuitem records. Important fields include:
- hit_name and hit_displaylabel
- hit_sortorder
- hit_parentmenuitem
- hit_url
- hit_platformroute
- hit_webpage

This model supports richer URL resolution by joining to route and webpage records.

## Current runtime caveat
The active header component currently bypasses both models and outputs a hardcoded DSR Home link. Configuration changes in Web Link Sets or hit_webnavmenu tables will not affect runtime until temporary code is removed.

## How authorized admins maintain each requirement

### Menu groups
- Standard:
  - maintain adx_weblinkset records.
- Custom:
  - maintain hit_webnavmenu records by location.

### Menu entries
- Standard:
  - create/update adx_weblink records.
- Custom:
  - create/update hit_webnavmenuitem records.

### Page relationships
- Web page hierarchy:
  - adx_parentpageid on webpage records.
- Menu hierarchy:
  - standard: adx_parentweblinkid
  - custom: hit_parentmenuitem

### Display order
- standard: adx_displayorder
- custom: hit_sortorder

### Labels
- standard: adx_name
- custom: hit_displaylabel with fallback to hit_name in renderer

### URLs
- standard:
  - typically bound via adx_pageid and resolved by platform URL model.
- custom:
  - precedence route path, then explicit URL, then webpage partial URL fallback.

### Visibility rules
- page-level:
  - publishing state, hidden-from-sitemap, and page access rules.
- table-access level for custom nav model:
  - table permissions grant read to Anonymous and Authenticated roles.

## Configuration records and source paths
| Component | Type | Path | Purpose |
|---|---|---|---|
| Default Web Link Set | Dataverse export | power-pages/nfp-base/weblink-sets/default/Default.en-US.weblinkset.yml | Standard main menu group |
| Default Web Links | Dataverse export | power-pages/nfp-base/weblink-sets/default/Default.en-US.weblinkset.weblink.yml | Standard menu entries |
| Profile Navigation Web Link Set | Dataverse export | power-pages/nfp-base/weblink-sets/profile-navigation/Profile-Navigation.en-US.weblinkset.yml | User profile dropdown links |
| Profile Navigation Web Links | Dataverse export | power-pages/nfp-base/weblink-sets/profile-navigation/Profile-Navigation.en-US.weblinkset.weblink.yml | Profile menu items |
| Site markers | Dataverse export | power-pages/nfp-base/sitemarker.yml | Home/Search/Profile route markers |
| Site settings | Dataverse export | power-pages/nfp-base/sitesetting.yml | Header profile behavior, caching, multilingual settings |
| Web role definitions | Dataverse export | power-pages/nfp-base/webrole.yml | Anonymous/Auth/Admin roles |
| Custom nav table permissions | Dataverse export | power-pages/nfp-base/table-permissions/Web-Nav-Menu---Read.tablepermission.yml and power-pages/nfp-base/table-permissions/Web-Nav-Menu-Item---Read.tablepermission.yml | Grants read access for nav tables |

## Maintenance workflow recommendations
1. Confirm intended nav model for current release (standard, custom, or temporary static).
2. Update menu group and entries in that model only.
3. Validate parent-child structure and ordering.
4. Validate internal page targets and external URLs.
5. Validate anonymous vs authenticated visibility.
6. Publish and validate desktop and mobile rendering.

## Known operational warning
Because the active component is hardcoded, administrators may believe they updated menus correctly but still see no change. This is expected until runtime component logic is switched back to dynamic mode.

## Related references
- [navigation-overview.md](navigation-overview.md)
- [navigation-technical-design.md](navigation-technical-design.md)
- [navigation-security.md](navigation-security.md)

[Bottom: Back](navigation-overview.md) | [Next](navigation-technical-design.md)
