[Top: Framework Overview](./offering-framework-overview.md)

# Offering Types

## Source of truth
Offering types are defined in global option set hit_offeringtype and consumed by sections--acceptance-router case routing.

## Type map
| Value | Label | Router Include Template |
|---|---|---|
| 815390000 | Donation | sections--acceptance-donation |
| 815390001 | Event | sections--acceptance-event |
| 815390002 | Course Access | sections--acceptance-course |
| 815390003 | Membership | sections--acceptance-membership |
| 815390004 | Volunteer Engagement | sections--acceptance-volunteer |
| 815390005 | Resource Download | sections--acceptance-download |
| 815390006 | Sponsorship | sections--acceptance-sponsorship |
| 815390007 | Expression of Interest | sections--acceptance-eoi |
| 815390008 | Venue Booking | sections--acceptance-venue |

## Type-specific processing pattern
- Common behavior:
  - Acceptance is created with status Draft.
  - Router loads acceptance + linked offering and resolves status/type.
  - Type template captures details and/or drives next transition.
- Divergence points:
  - Payment-required branch routes to payment templates when status is Pending Payment.
  - Non-payment branch routes toward completion without payment intent dependency.
  - Fulfillment and integrations depend on flow logic and specific offering type.

## Template coverage inventory
Confirmed templates in repository:
- sections--acceptance-donation
- sections--acceptance-event
- sections--acceptance-course
- sections--acceptance-membership
- sections--acceptance-volunteer
- sections--acceptance-download
- sections--acceptance-sponsorship
- sections--acceptance-eoi
- sections--acceptance-venue
- sections--acceptance-form

## Evidence
- Option set labels and IDs:
  - [offering type option-set definition](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml#L2)
  - [Course Access label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml#L33)
  - [Venue Booking label](solutions/exports/unpacked/dsr/BaseSchema/OptionSets/hit_offeringtype.xml#L81)
- Router case mapping:
  - [router type switch starts](power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L264)
- Template inventory:
  - [web templates root](power-pages/nfp-base/web-templates)

## Implementation caution
- The router default path raises a runtime warning if no template is configured for an offering type; this is an explicit fail-visible behavior rather than silent fallback.
