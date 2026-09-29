# Segment Tag Overview

## Purpose
Explain the DSR Segment Tag capability and what business problem it solves.

## Business purpose
Segment Tags provide a structured audience classification layer for DSR. They are used to classify contacts and organisations for fundraising, engagement, course participation, program participation, communications eligibility, exclusions, reporting, migration, and Customer Insights dependencies.

## Confirmed implementation shape
- `hit_segmenttag` defines the tag.
- `hit_contactsegmenttag` stores contact membership.
- `hit_accountsegmenttag` stores organisation membership.
- `hit_contactorgsegmenttag` stores contact-organisation relationship tagging when a relationship-level tag is needed.
- `hit_importtag` stages tag import or migration work.

## What the engine does
The tagging engine resolves a tag by code, checks whether the target already has the tag, removes conflicting tags when the dimension is exclusive, and then creates the membership row.

## What the engine does not show
- no direct Power Pages authoring surface was found for tag management
- no explicit segment/journey configuration export was found for Customer Insights
- no dedicated tag-history table was identified in the reviewed solution

## Evidence
- [core segment-tag business rules](../../analysis/core-segment-tag-business-rules.md)
- [solution inventory](../../analysis/solution-inventory.md)
- [TaggingEngine-AddNewContactSegmentTagChild](../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/TaggingEngine-AddNewContactSegmentTagChild-4DDF577C-B567-F111-AB0E-6045BDE72793.json)
- [TaggingEngine-AddNewOrganisationSegmentTagChild](../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/TaggingEngine-AddNewOrganisationSegmentTagChild-9CA03E8A-BE67-F111-AB0E-70A8A555B733.json)
