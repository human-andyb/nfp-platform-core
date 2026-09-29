# Payment Security

## Control surfaces

### Portal-side controls
- Acceptance/payment pages use anti-forgery token retrieval before Web API PATCH/POST.
- Payment template never stores raw card data in Dataverse; Stripe Elements handles card/bank capture.
- Token-based acceptance link validation exists in legacy payment template.

Evidence:
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L471)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L227)
- [Offering-Acceptance---Payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html#L8)

### Flow-side controls
- Stripe secret key is parameterized through hit_StripeSecretKey environment variable schema.
- Payment webhook flow fetches event by ID from Stripe before applying updates.
- Duplicate event suppression uses hit_stripeeventid lookup on payment transactions.

Evidence:
- [environmentvariabledefinition.xml](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/environmentvariabledefinitions/hit_StripeSecretKey/environmentvariabledefinition.xml#L1)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L139)
- [StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json](../../../../../solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/StripeWebhookHandler-PaymentIntentUpdateDataverse-24BFB433-800B-F111-8342-000D3A7A0CAB.json#L429)

### Permission model
- Offering acceptance create/read/write permission exists for configured web roles.
- Payment transaction read permission exists for configured web roles.
- Contact create permission exists to support contact creation path.

Evidence:
- [Offering-Acceptance---Create.tablepermission.yml](../../../../../power-pages/nfp-base/table-permissions/Offering-Acceptance---Create.tablepermission.yml#L1)
- [Payment-Transaction---Read.tablepermission.yml](../../../../../power-pages/nfp-base/table-permissions/Payment-Transaction---Read.tablepermission.yml#L1)
- [Contact---Create.tablepermission.yml](../../../../../power-pages/nfp-base/table-permissions/Contact---Create.tablepermission.yml#L1)

## Risk observations

| Risk | Current evidence | Impact | Mitigation direction |
|---|---|---|---|
| Secret material in solution exports | Secret defaults visible in some BaseSchema artifacts | High if repo is broadly accessible | Move to secure secret store and purge historic plaintext defaults |
| Webhook signature verification not explicit | No explicit Stripe-Signature validation step visible in flow JSON | Medium-High | Add explicit signature validation step or validated gateway proxy |
| Publicly callable flow endpoints in site settings | Payment/setup URLs held in site settings and consumed client side | Medium | Restrict endpoint trust boundary by additional request validation and short-lived token checks |
| Inconsistent setup-intent setting keys across templates | Active and legacy templates reference different keys | Medium | Consolidate to one key and deprecate legacy path |

## Sensitive data handling policy for docs
- Do not publish full endpoint URLs, signatures, or secret values.
- Only reference key names and architecture patterns.
