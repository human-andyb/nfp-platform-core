# Component Dependency Matrix

| Component | Depends On | Feeds Into | Data Owned | Notes |
|---|---|---|---|---|
| Navigation header | site settings, navigation records | page shell | menu labels and links | currently the active path is the custom header rendering branch |
| Page renderer | route resolution, page templates, section metadata | gallery, offering, acceptance pages | page composition state | central runtime shell for the platform |
| Web gallery | gallery config, offering/persona/program/article tables | offering detail or content detail | curated content selection | source adapters choose the record set |
| Offering detail | offering record, pricing model, public visibility | acceptance initiation | offering metadata | front door into the acceptance flow |
| Acceptance router | acceptance record, offering record, status validation endpoint | payment, confirmation, type-specific forms | acceptance state decision | state-first control point |
| Payment branch | acceptance state, payment intent data, Stripe config | webhook reconciliation, completion | payment transaction and intent ids | asynchronous webhook is the source of truth |
| Course branch | acceptance audience, regional lookup, course metadata | ETrainU provisioning | course definition / registration mapping | uses the same acceptance anchor as payment |
| ETrainU child flows | acceptance, contact, account, regional data | external LMS identities | external id mapping | create-or-get pattern reduces duplicates |
| Segment tag engine | segment tag definitions, contact/account state, import staging | downstream reporting, suppression, lifecycle state | tag membership rows | uses dimension exclusivity and duplicate prevention |
| PCP handoff | queue rows and segment filters | file exports and external processing | downstream export sets | repository shows the boundary, not the full downstream process |
| PCP export flows | `hit_segmenttag`, `hit_contactsegmenttag`, `hit_accountsegmenttag`, contact/account records | SharePoint staging and Logic App handoff | CSV export files | confirmed DSR-side handoff only |
