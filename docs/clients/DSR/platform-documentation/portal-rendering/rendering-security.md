[Top: Documentation Home](../README.md) | [Client Side Processing](client-side-processing.md) | [Rendering Dependency Map](rendering-dependency-map.md)

# Rendering Security

## Purpose
Describe rendering-related security controls and boundaries for DSR portal pages.

## Authentication context during rendering
- Active custom acceptance and payment templates primarily use request parameters (acceptanceid, page, waitforpayment) and table permissions.
- Direct Liquid checks against user context are not used in active acceptance/payment templates.
- Legacy Header-legacy template includes authenticated user checks for profile and login/logout navigation.

## Web roles evidenced
- Administrators
- Anonymous Users
- Authenticated Users

## Table permission model relevant to rendering
- Global read permissions for many rendering tables, including:
  - hit_platformpage
  - hit_platformpagesection
  - hit_platformpageslot
  - hit_offering
  - hit_webgalleryconfig
- Write-enabled permissions where user journeys require mutation:
  - hit_offeringacceptance (create/read/write)
  - hit_venuespacebookingrequest (create/read/write)
- Read permission for payment transaction table:
  - hit_paymenttransaction (read)

## Web API security settings
- Webapi/Enabled = true
- WebApi/EntityPermissionsEnabled = true
- Entity-specific field allowlists are configured for key entities such as hit_offeringacceptance and hit_offering.

## CSRF and anti-forgery handling
- Client write operations retrieve and send request verification tokens.
- Observed token retrieval methods:
  - GET /_layout/tokenhtml and parse __RequestVerificationToken
  - POST /_api/GetAccessToken in venue path

## Column permissions
- No column-permission artifact files were found in exported repository structure.
- Effective behavior is determined by table permissions plus site-setting field allowlists for Web API entities.

## Content snippets and site marker security relevance
- Active custom header path does not use snippet-driven navigation decisions.
- Legacy header path uses snippets and site markers (Search, Profile) and includes user-aware menu logic.

## Security boundary between repository code and runtime
- Repository code controls form validation, request payloads, retry behavior, and redirects.
- Power Pages runtime controls:
  - authentication/session context
  - Web API authorization enforcement
  - table-permission gating
  - rewrite templates for standard pages such as Profile/Search

## Security caveats from current evidence
- Acceptance routes appear operable for anonymous and authenticated roles based on table permissions.
- Absence of column-permission artifacts means no repository evidence of field-level deny rules.
- settings keys referenced for flow and stripe setup are not fully present in exported sitesetting.yml; environment-level configuration may differ.

## Source references
- power-pages/nfp-base/webrole.yml
- power-pages/nfp-base/websiteaccess.yml
- power-pages/nfp-base/table-permissions/Offering-Acceptance---Create.tablepermission.yml
- power-pages/nfp-base/table-permissions/Venue-Space-Booking-Request---Create.tablepermission.yml
- power-pages/nfp-base/table-permissions/Offerings---Public.tablepermission.yml
- power-pages/nfp-base/table-permissions/Platform-Page---Read.tablepermission.yml
- power-pages/nfp-base/sitesetting.yml
- power-pages/nfp-base/web-templates/header-legacy/Header-legacy.webtemplate.source.html

[Bottom: Back](client-side-processing.md) | [Next](rendering-dependency-map.md)
