[Top: Framework Overview](./offering-framework-overview.md)

# Acceptance Template Catalogue

## Catalogue scope
This catalogue lists acceptance-related templates physically present in the Power Pages export and how they participate in routing.

## Router-selected templates
| Template | Purpose | Routed by |
|---|---|---|
| sections--acceptance-donation | Donation acceptance capture | offering type 815390000 |
| sections--acceptance-event | Event acceptance capture | offering type 815390001 |
| sections--acceptance-course | Course access acceptance capture | offering type 815390002 |
| sections--acceptance-membership | Membership acceptance capture | offering type 815390003 |
| sections--acceptance-volunteer | Volunteer acceptance capture | offering type 815390004 |
| sections--acceptance-download | Resource download acceptance capture | offering type 815390005 |
| sections--acceptance-sponsorship | Sponsorship acceptance capture | offering type 815390006 |
| sections--acceptance-eoi | Expression-of-interest acceptance capture | offering type 815390007 |
| sections--acceptance-venue | Venue booking acceptance capture | offering type 815390008 |

## Status-driven templates
| Template | Purpose | Routed by |
|---|---|---|
| sections--payment-preparing | Interim waiting view while payment artifacts are not ready | status Pending Payment and missing payment intent |
| sections--payment | Payment execution view | status Pending Payment |
| sections--confirmation | Completion confirmation for payment-required path | status Completed + payment required |
| sections--confirmation-nonpayment | Completion confirmation for non-payment path | status Completed + no payment required |

## Generic acceptance helper
| Template | Purpose |
|---|---|
| sections--acceptance-form | Shared form structure/helper (present in repository) |

## Data fields exposed for acceptance Web API
Configured site setting exposes key acceptance fields including:
- identity/contact fields
- selected price option and pricing fields
- payment-required/status/payment-intent fields

Source:
- [Webapi/hit_offeringacceptance fields setting](power-pages/nfp-base/sitesetting.yml#L244)

## Evidence
- Template inventory:
  - [web templates root](power-pages/nfp-base/web-templates)
- Router include/case statements:
  - [router include mapping for acceptance templates](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L264)
