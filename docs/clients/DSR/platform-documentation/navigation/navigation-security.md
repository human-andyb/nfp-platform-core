[Top: Documentation Home](../README.md) | [Navigation Technical Design](navigation-technical-design.md) | [Navigation Diagrams](navigation-diagrams.md)

# Navigation Security

## Purpose
Document access controls and visibility behavior for navigation artifacts, separating proven behavior from assumptions.

## Security scope
Navigation security spans:
1. CMS/configuration administration permissions.
2. Runtime data-read permissions for custom nav tables.
3. Page-level access constraints that can affect whether a linked destination is reachable.

## Proven role model in repository
Defined web roles include:
- Administrators
- Anonymous Users
- Authenticated Users

Website access rules grant administrators management permissions over key website metadata including web link sets, snippets, and site markers.

## Custom navigation table permissions
Repository includes explicit table permissions for:
- hit_webnavmenu (read)
- hit_webnavmenuitem (read)
- hit_platformroute (read)

These are linked to both Anonymous Users and Authenticated Users in exported artifacts.

## Standard navigation model security behavior
Standard Web Link Set rendering normally depends on:
- menu item definition and publish state
- linked page visibility/access configuration
- user authentication state (for profile paths)

Repository contains settings influencing profile link visibility (for example Header/ShowAllProfileNavigationLinks), but current active header does not invoke this logic.

## Current DSR runtime impact
Because active header output is hardcoded:
- runtime menu visibility is not currently driven by either custom nav table permissions or standard weblink visibility logic.
- users get the same single visible top-level menu link from template HTML.

## Risk assessment
1. Configuration drift risk:
- admins can update menu data that is never rendered, creating false confidence.
2. Security expectation mismatch:
- teams may assume role-conditioned menu behavior is active when it is not.
3. Future regression risk:
- when dynamic nav is re-enabled, role/table/page visibility interactions may change sharply.

## Verification checklist before enabling dynamic nav
1. Validate table permissions for anonymous and authenticated users in target environment.
2. Validate linked page access for each menu destination.
3. Validate profile and search links for authenticated and anonymous sessions.
4. Validate behavior for unpublished/deleted/historical links still present in exported data.
5. Confirm whether caching can delay navigation permission updates.

## Evidence boundaries
- No repository evidence proves active web-role-based filtering in current runtime header output.
- No claim is made that desktop and mobile apply different security policies; only rendering structure differs by template path.

## Related references
- [navigation-technical-design.md](navigation-technical-design.md)
- [navigation-diagrams.md](navigation-diagrams.md)
- [../reference/evidence-gaps.md](../reference/evidence-gaps.md)

[Bottom: Back](navigation-technical-design.md) | [Next](navigation-diagrams.md)
