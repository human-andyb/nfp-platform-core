# Security Matrix

| Process | Component | Web Role | Table Permission | Operation | Table | Scope | Evidence |
|---|---|---|---|---|---|---|---|
| Navigation and menu system | header rendering | Anonymous Users / Authenticated Users | web nav read permissions | read | navigation tables | published site scope | [navigation overview](../navigation/navigation-overview.md) |
| Page rendering | page templates and sections | Anonymous Users / Authenticated Users | page and section read permissions | read | page / section / slot records | portal site scope | [rendering overview](../portal-rendering/rendering-overview.md) |
| Web gallery configuration | gallery component | Anonymous Users / Authenticated Users | `Web Gallery Config - Read` and source-table permissions | read | gallery config and source tables | public gallery scope | [gallery overview](../web-gallery/gallery-overview.md) |
| Offering management | offering detail | Anonymous Users / Authenticated Users | `Offerings - Public` | read | `hit_offering` | public offering scope | [offering management](../offerings/offering-management.md) |
| Offering acceptance | acceptance forms | Anonymous Users / Authenticated Users | `Offering-Acceptance---Create` | create / update | `hit_offeringacceptance` | current acceptance record | [offerings acceptance](../offerings/offerings-acceptance.md) |
| Acceptance routing and validation | router and validation flow | portal user | acceptance read permissions | read | `hit_offeringacceptance`, `hit_offering` | current acceptance record | [acceptance router analysis](../offerings/acceptance-router-analysis.md) |
| Payment processing | payment templates and flows | portal user | `Payment-Transaction---Read` | create / read / update | `hit_paymenttransaction` | current transaction record | [payment overview](../payments/payment-overview.md) |
| Course management | course acceptance and fulfilment | portal user / flow identity | course and acceptance permissions | create / read / update | `hit_coursedefinition`, `hit_courseregistration` | current course record | [course management](../etrainu/course-management.md) |
| ETrainU integration | child flows | flow identity | flow-run permissions only | external API call | course mapping tables | system integration scope | [ETrainU integration](../etrainu/etrainu-integration.md) |
| Segment tag management | tag engine flows | flow identity / support role | membership table read/write permissions | create / read / update / delete | `hit_segmenttag`, `hit_contactsegmenttag`, `hit_accountsegmenttag`, `hit_importtag` | current record or same-dimension set | [segment tags](../segment-tags/segment-tagging.md) |
| PCP export handoff | PCP export flows | flow identity | SharePoint create file and HTTP invoke | create / read | `contact`, `account`, `hit_contactsegmenttag`, `hit_accountsegmenttag`, `hit_segmenttag` | outbound export slice | [PCP security and privacy](../pcp/pcp-security-and-privacy.md) |
