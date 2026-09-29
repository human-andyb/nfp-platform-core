# Course Publication and Acceptance

## Purpose
Explain how a course offer becomes available in the portal and how the acceptance record feeds the ETrainU provisioning path.

## Portal behavior
The course branch is implemented by `sections--acceptance-course`, and the router includes it when the offering resolves to the course path. The template reads `hit_courseaccessaudience` and `hit_courseaccessplan` from the offering and uses those values to shape the form.

## Confirmed acceptance inputs
- first name
- last name
- email address
- mobile number
- postcode
- organisation input
- contact role input
- redemption code

## Acceptance outputs
- a populated `hit_OfferingAcceptance` row
- audience and plan values copied onto the acceptance where needed
- routing back to the parent fulfillment flow

## Business rules confirmed in the repo
- course access is driven by offering metadata, not by a standalone course catalog UI
- audience defaults determine which fields are shown
- organisation-member access can use redemption-code routing
- the acceptance template does not write ETrainU IDs directly; that is done by the child flows

## Evidence
- `power-pages/nfp-base/web-templates/sections--acceptance-course/sections--acceptance-course.webtemplate.source.html`
- `power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html`
- `power-pages/nfp-base/web-templates/offering-detail/Offering-Detail.webtemplate.source.html`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Other/Relationships.xml`
