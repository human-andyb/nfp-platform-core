## Rich Text Bullet Standardization Plan (CSE First)

### Purpose
Apply a consistent list style for rich-text description content so:
1. Bullet markers stay outside.
2. Wrapped lines align with the first text line (hanging indent).
3. Markers are moderate size and use the primary brand color.

### Scope
Templates in scope:
1. sections--offering-detail
2. sections--acceptance-eoi
3. sections--acceptance-course
4. sections--acceptance-donation
5. sections--acceptance-membership (requested as sections--acceptance-member)

Out of scope:
1. Router/flow/payment logic
2. Dataverse schema/content migration
3. Non-description layout refactoring

### Template Selector Map
1. power-pages/nfp-base/web-templates/sections--offering-detail/sections--offering-detail.webtemplate.source.html
- description container: .hit-offering__description

2. power-pages/nfp-base/web-templates/sections--acceptance-eoi/sections--acceptance-eoi.webtemplate.source.html
- description container: .hit-acceptance__lead

3. power-pages/nfp-base/web-templates/sections--acceptance-course/sections--acceptance-course.webtemplate.source.html
- description container: .hit-acceptance__description

4. power-pages/nfp-base/web-templates/sections--acceptance-donation/sections--acceptance-donation.webtemplate.source.html
- description container: .hit-donation-summary__description

5. power-pages/nfp-base/web-templates/sections--acceptance-membership/sections--acceptance-membership.webtemplate.source.html
- description container: .hit-membership-summary__description

### Shared CSS Contract
Add one reusable class in power-pages/nfp-base/web-files/css--site.css and apply it to all containers above.

Required behavior:
1. ul/ol
- list-style-position: outside
- stable left padding for hanging indent
- consistent list margin

2. li
- text-indent: 0
- no extra left padding that offsets wraps incorrectly
- readable vertical spacing
- normal wrap behavior

3. li > p
- normalize to inline with zero margins to avoid marker/text line separation from rich-text HTML

4. ::marker
- color uses primary brand token (var(--hit-primary))
- moderate size (about 1.05em)

### Rollout Sequence
1. Add shared class rules in css--site.css.
2. Add shared class to all five description containers.
3. Remove conflicting duplicated local ul/ol/li rules from acceptance template embedded styles.
4. Validate visuals on desktop and mobile.

### Verification Checklist
1. DevTools computed style on first list item in each template:
- list-style-position: outside
- li text-indent: 0
- marker color resolves to primary token

2. Visual checks:
- wrapped lines align under first text line
- marker size is consistent and moderate

3. Content checks:
- ul/li markup present where bullets are expected
- if typed bullets are used in paragraphs, convert content to true list markup

4. Regression checks:
- paragraph/headline rendering unchanged outside lists
- no behavioral impact to forms, router, or flows

### CSE Branch Notes
1. Verify selector names are identical on CSE before applying.
2. If brand token names differ, map marker color token accordingly.
3. Capture before/after screenshots of one long bullet list for sign-off.
