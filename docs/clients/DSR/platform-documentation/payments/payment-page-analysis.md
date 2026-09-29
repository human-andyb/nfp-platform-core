# Payment Page Analysis

## Active payment rendering path
The active payment UI is section-based under acceptance router:
- Router section decides whether to render payment-preparing or payment capture sections.
- Payment section reads acceptance + offering data and runs Stripe.js confirm flow.

Evidence:
- [sections--acceptance-router.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html#L220)
- [sections--payment-preparing.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html#L80)
- [sections--payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html#L34)

## Legacy/parallel payment template
The template [Offering-Acceptance---Payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html) implements a standalone payment route pattern using Flow/PaymentIntentUrl and Flow/SetupIntentUrl with token validation. It appears as a parallel implementation rather than the currently routed section path.

Evidence:
- [Offering-Acceptance---Payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html#L15)
- [Offering-Acceptance---Payment.webtemplate.source.html](../../../../../power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html#L91)

## Template-by-template breakdown

| Template/Page | Path | Purpose | Inputs | Outputs | Dataverse reads | Dataverse writes | Stripe calls | Status effects | Failure handling | Upstream | Downstream |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Acceptance router section | power-pages/nfp-base/web-templates/sections--acceptance-router/sections--acceptance-router.webtemplate.source.html | State-based composition for acceptance and payment sections | acceptanceid, waitforpayment, flowstatus | rendered payment or confirmation section | acceptance + offering | none direct | none direct | chooses payment path by status | retry loop can stop when validation URL absent | offering detail acceptance creation | payment-preparing/payment/confirmation sections |
| Payment preparing section | power-pages/nfp-base/web-templates/sections--payment-preparing/sections--payment-preparing.webtemplate.source.html | Poll until payment intent becomes available | acceptanceid | redirect to acceptance router | acceptance hit_stripepaymentintentid via Web API | none | none | none direct | timeout panel and refresh action | router includes section | router reloads to payment section |
| Payment section | power-pages/nfp-base/web-templates/sections--payment/sections--payment.webtemplate.source.html | Stripe Elements capture for one-off and recurring setup | acceptanceid, Stripe publishable key, optional setup intent URL | confirmPayment/confirmSetup result and redirect | acceptance + offering fetchxml | acceptance PATCH on success path helper | Stripe.js confirmPayment/confirmSetup; retrievePaymentIntent/retrieveSetupIntent | success triggers router reload; recurring waits webhook convergence | UI error summary, disabled button, validation | router/status branch | webhook-driven state transitions + confirmation section |
| Confirmation section | power-pages/nfp-base/web-templates/sections--confirmation/sections--confirmation.webtemplate.source.html | Render final success summary | acceptanceid | confirmation UI | acceptance + offering | none | none | display only | not found warning | router completed status | end of user flow |
| Legacy payment template | power-pages/nfp-base/web-templates/offering-acceptance---payment/Offering-Acceptance---Payment.webtemplate.source.html | Legacy/parallel token-validated payment page | acceptanceid, token | redirect to /Donate/Complete path | acceptance + offering | none direct (flow side handles writes) | Stripe.js confirmPayment/confirmSetup | depends on flow/webhook updates | token mismatch blocks session | direct URL route | complete page |

## Page-template and route context
- Donate page maps to Platform Renderer template.

Evidence:
- [Donate.webpage.yml](../../../../../power-pages/nfp-base/web-pages/donate/Donate.webpage.yml#L1)
- [Platform-Renderer.pagetemplate.yml](../../../../../power-pages/nfp-base/page-templates/Platform-Renderer.pagetemplate.yml#L1)

## Key observations
- Primary route is acceptance router plus sections pattern.
- Polling behavior exists both in payment-preparing section and acceptance router validation loop.
- Two different setup-intent setting keys appear in templates:
  - Stripe/CreateCustomerSetupIntentUrl in active section payment template.
  - Flow/SetupIntentUrl in legacy payment template.
