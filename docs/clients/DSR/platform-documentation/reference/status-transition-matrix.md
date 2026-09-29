# Status Transition Matrix

| Record Type | Status Before | Trigger | Processing Component | Conditions | Status After | Failure Status | Evidence |
|---|---|---|---|---|---|---|---|
| `hit_offeringacceptance` | Draft | visitor starts acceptance | acceptance form and router | valid offering and acceptance id | Pending Information or Pending Payment | Failed or remains Draft | [offerings/offerings-acceptance.md](../offerings/offerings-acceptance.md) |
| `hit_offeringacceptance` | Pending Payment | Stripe intent requested | orchestrator and payment branch | payment required | Pending Payment with client secret or intent id | Payment Failed | [payment technical process](../payments/payment-technical-process.md) |
| `hit_offeringacceptance` | Pending Payment | Stripe webhook success | webhook handler | successful payment event | Completed | Payment Failed | [payment overview](../payments/payment-overview.md) |
| `hit_offeringacceptance` | Pending Payment | validation polling | acceptance validation flow | intent or acceptance state returned | Completed or still Pending Payment | Failed | [acceptance router analysis](../offerings/acceptance-router-analysis.md) |
| `hit_paymenttransaction` | Created | payment intent created | Stripe payment flow | one-off payment branch | Pending / Authorised / Captured | Failed | [flow matrix](flow-matrix.md) |
| `hit_paymenttransaction` | Pending | Stripe webhook confirmation | webhook handler | event matches stored intent | Succeeded / Captured | Failed | [payment technical process](../payments/payment-technical-process.md) |
| `hit_courseregistration` | New | course fulfilment branch | ETrainU participant flow | course access branch selected | Provisioned / mapped | Provisioning error | [course management](../etrainu/course-management.md) |
| `hit_coursedefinition` | Unmapped | course organisation flow | ETrainU organisation flow | organisation or region known | Mapped to ETrainU location | Mapping error | [ETrainU integration](../etrainu/etrainu-integration.md) |
| `hit_contactsegmenttag` | Active | add or recalc flow | tagging engine | exact tag not already present | Active | Removed or unchanged | [segment-tag lifecycle](../segment-tags/segment-tag-lifecycle.md) |
| `hit_contactsegmenttag` | Active | remove flow or exclusive replacement | tagging engine | remove request or exclusive dimension | Inactive / removed | unchanged if not found | [segment tag business rules](../segment-tags/segment-tag-business-rules.md) |
| `hit_accountsegmenttag` | Active | add or recalc flow | tagging engine | exact tag not already present | Active | Removed or unchanged | [segment-tag lifecycle](../segment-tags/segment-tag-lifecycle.md) |
| `hit_importtag` | Staged | import validation | import validation flows | tag code resolves successfully | Applied or processed | Validation failed / staged | [segment-tag flow catalogue](../segment-tags/segment-tag-flow-catalogue.md) |
| PCP export file | Generated | SharePoint create file | PCP export flow | CSV rows produced successfully | Staged in SharePoint | Create file failed | [PCP file staging](../pcp/pcp-file-staging.md) |
