[Top: Documentation Home](../README.md) | [Navigation Configuration](navigation-configuration.md) | [Navigation Technical Design](navigation-technical-design.md)

# DSR Navigation Overview

## Purpose
This overview explains, in plain language, how navigation is set up and what visitors currently experience on the DSR site.

## Executive summary for non-technical readers
The repository contains three navigation models:
1. Standard Power Pages menu model using Web Link Sets.
2. A custom NFP Data Platform menu model using custom Dataverse tables.
3. A temporary DSR-specific hardcoded menu.

At the moment, the active runtime menu is the temporary hardcoded version, which renders one link: DSR Home.

## What administrators can configure
Administrators can configure navigation records in Dataverse in two different ways:
1. Standard model:
- Web Link Set records.
- Web Link records (with display order, labels, parent-child links, and page bindings).
2. Custom model:
- Web Nav Menu records.
- Web Nav Menu Item records.
- Optional Platform Route records.

The repository shows both configuration sets, but only one is active in runtime output today.

## What visitors currently see
Active header rendering calls a custom component that is currently hardcoded to output:
- one menu item pointing to https://www.dsr.org.au/

That means normal menu configuration changes in either Web Link Sets or custom Web Nav Menu tables do not currently change the visitor-facing header until the temporary code is replaced.

## Standard vs custom vs DSR-specific behavior
- Standard Power Pages behavior:
  - Web Link Sets resolved via weblinks object.
  - Profile and search marker behavior.
  - Breadcrumb generation via page.breadcrumbs.
  - Content snippets for reusable header/footer text.
- Custom NFP Data Platform behavior:
  - hit_webnavmenu and hit_webnavmenuitem table model.
  - URL resolution precedence route -> explicit URL -> webpage partial URL.
  - custom active-state computation and submenu rendering.
- DSR-specific current behavior:
  - temporary hardcoded single-link menu in components--web-nav-header.

## How menu data is represented
Two hierarchy models exist:
1. Standard model hierarchy:
- adx_parentweblinkid on Web Link records.
- adx_displayorder for ordering.
- page references on adx_pageid.
2. Custom model hierarchy:
- hit_parentmenuitem lookup on hit_webnavmenuitem.
- hit_sortorder for ordering.

## Mobile and desktop behavior in the active path
- Active custom header path:
  - desktop and mobile both render the same static list.
  - CSS attempts responsive wrapping, but no active mobile drawer/toggler is implemented.
- Legacy standard header path (currently not active):
  - has bootstrap-style collapsible mobile navigation with toggler and snippets.

## Multilingual handling
- Repository includes one portal language (English).
- Localized content-page records exist (en-US form).
- MultiLanguage settings are present but current language set does not evidence active multilingual navigation labels.

## Security visibility at a glance
- Custom nav tables have read table permissions for both Anonymous Users and Authenticated Users.
- Standard Web Link visibility is governed through standard portal mechanisms (page visibility, publishing, and access rules), but this path is not currently active in header output.

## Related references
- [navigation-configuration.md](navigation-configuration.md)
- [navigation-technical-design.md](navigation-technical-design.md)
- [navigation-security.md](navigation-security.md)
- [navigation-diagrams.md](navigation-diagrams.md)
- [../reference/evidence-gaps.md](../reference/evidence-gaps.md)

[Bottom: Next](navigation-configuration.md)
