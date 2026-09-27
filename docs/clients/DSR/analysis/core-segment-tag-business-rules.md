# Core segment tag business rules

## Scope and evidence base

This document explains how the DSR core segment-tagging engine appears to work in the repo, based on the unpacked DSR solution metadata and the automation flows under:

- `solutions/exports/unpacked/dsr/BaseSchema`
- `solutions/exports/unpacked/dsr/Automation`
- `solutions/exports/unpacked/dsr/DSRCustomisations`

The strongest evidence is in:

- `BaseSchema/Other/Relationships.xml`
- `BaseSchema/Entities/Contact/Entity.xml`
- `BaseSchema/Entities/Account/Entity.xml`
- `Automation/Workflows/TaggingEngine-AddNewContactSegmentTagChild-...json`
- `Automation/Workflows/TaggingEngine-AddNewOrganisationSegmentTagChild-...json`
- `Automation/Workflows/TaggingEngine-RecalcContactStateTagschild-...json`
- `Automation/Workflows/TaggingEngine-RecalcOrganisationStateTagschild-...json`
- `Automation/Workflows/trigger_ContactDoNotEmail-...json`

This is a business and technical reconstruction, not a live runtime audit.

---

## 1. What the segment-tag model actually is

The DSR solution does not appear to rely on a single flat text field as the only source of truth.

The authoritative pattern is:

1. `hit_segmenttag` defines the tag itself (for example `ENG__HIGH`, `VAL__MID`, `DLF__ACTIVE`, `CON__DO_NOT_EMAIL`).
2. `hit_contactsegmenttag` stores the contact-to-tag membership record.
3. `hit_accountsegmenttag` stores the organisation-to-tag membership record.
4. `hit_contactorgsegmenttag` is a contact/organisation relationship tagging pattern, suggesting some tags can be applied at the relationship level as well as a direct account/contact record.
5. `Contact.hit_segmenttags` and `Account.hit_segmenttags` are flattened summary fields used for UI/display convenience, but the real membership logic is stored in the junction records and the tag definition table.

This is supported by the relationships in `Relationships.xml`, which include:

- `hit_contactsegmenttag_Contact_contact`
- `hit_contactsegmenttag_SegmentTag_hit_segmenttag`
- `hit_accountsegmenttag_Account_account`
- `hit_accountsegmenttag_SegmentTag_hit_segmenttag`
- `hit_contactorgsegmenttag_ContactOrganisation_hit_contactorganisation`
- `hit_contactorgsegmenttag_SegmentTag_hit_segmenttag`

The `hit_segmenttags` field on Contact/Account strongly suggests a denormalised display field, while the actual tagging rules are enforced through membership records and child flow logic.

---

## 2. Core assignment flow behaviour

The engine exposes reusable child flows named like:

- `TaggingEngine-AddNewContactSegmentTagChild-*`
- `TaggingEngine-AddNewOrganisationSegmentTagChild-*`
- `ApplySegmentTagschild-*`

The add-tag child flow typically follows this pattern:

1. Look up the `hit_segmenttag` row by `hit_code`.
2. Read any existing tag membership rows for the same record and same tag.
3. If the tag is already present, return success without duplication.
4. If the tag is not present:
   - determine whether the requested dimension is `exclusive`
   - if so, remove any existing tags in the same dimension before adding the new one
   - create a new membership record in `hit_contactsegmenttags` or `hit_accountsegmenttags`
   - bind the membership row to the correct `Contact`/`Account` and the selected `SegmentTag`
5. Return success.

This means the engine is a dimensioned tag system rather than a free-form tagging model. The `boolean_1` input in the child flow appears to represent whether the tag is exclusive within its dimension (`exclusive = true`), and the `text_2` input seems to carry the dimension code such as `CON`, `DLF`, `ENG`, `VAL`, or `LIF`.

### Business meaning of the exclusive behaviour

When exclusive is true, the system ensures only one tag in a given dimension can be active at once. Example logic:

- if `ENG` dimension is exclusive, then a contact can only have one active engagement state tag at a time
- `ENG__HIGH`, `ENG__MEDIUM`, `ENG__LOW`, `ENG__INACTIVE` are mutually exclusive
- the same pattern applies to `VAL` and `DLF` and likely `LIF`

This is important because the recalc flows set a target code and then call the add flow with `exclusive = true`; that is the mechanism that keeps one current state tag per dimension.

---

## 3. Tag naming conventions

The tag codes show a clear convention with a dimension prefix and a state label.

### Contact preference / contactability tags

Examples include:

- `CON__DO_NOT_EMAIL`
- `CON__DO_NOT_CALL`
- `CON__DO_NOT_CONTACT`

These are not calculated from donation or engagement metrics; they are operational contactability-state tags. The trigger flow `trigger_ContactDoNotEmail` shows the same code being added or removed when either `donotemail` or `donotbulkemail` is set to true.

This means the overall model supports both:

- derived behavioural tags (ENG, VAL, LIF, DLF)
- manual/operational preference tags (CON)

### Derived state tags

The recalculation flows define tag codes like:

- `ENG__HIGH`
- `ENG__MEDIUM`
- `ENG__LOW`
- `ENG__INACTIVE`
- `VAL__HIGH`
- `VAL__MID`
- `VAL__LOW`
- `VAL__PROSPECT`
- `LIF__ACTIVE`
- `LIF__AT_RISK`
- `LIF__LAPSED`
- `LIF__PROSPECT`
- `DLF__PROSPECT`
- `DLF__FIRST_TIME`
- `DLF__REPEAT`
- `DLF__ACTIVE`
- `DLF__AT_RISK`
- `DLF__LAPSED`

The exact `LIF__...` names are not always visible in the snippet we have, but the logic strongly resembles lifecycle / donor status tags derived from giving behaviour and recency.

---

## 4. Contact recalculation engine

The flow `TaggingEngine-RecalcContactStateTagschild-*` is the clearest example of the derived-state engine. It initialises variables for:

- donation count
- donation count in last 12 months
- lifetime value
- last donation date
- last engagement date
- engagement count
- last interaction age in days
- the target codes for `LIF`, `VAL`, `ENG`, and `DLF`

### 4.1 Lifetime value (`VAL`)

The value tag is derived from lifetime value, using environment variables:

- `hit_EV_VAL_HIGH_THRESHOLD` = default 500
- `hit_EV_VAL_MID_THRESHOLD` = default 100

The logic is effectively:

- if lifetime value >= 500 => `VAL__HIGH`
- else if lifetime value >= 100 => `VAL__MID`
- else if lifetime value > 0 => `VAL__LOW`
- else => `VAL__PROSPECT`

This is a classic donor-value segmentation. It distinguishes high-value supporters from low-value or prospective supporters without requiring a separate scoring table.

### 4.2 Engagement (`ENG`)

The engagement tag uses:

- `hit_EV_ENG_HIGH_DAYS` = default 365
- `hit_EV_ENG_MEDIUM_DAYS` = default 547
- `hit_EV_ENG_LOW_DAYS` = default 740

The logic is effectively:

- if days since last engagement <= 365 and engagement count >= 3 => `ENG__HIGH`
- else if days since last engagement <= 547 and engagement count >= 2 => `ENG__MEDIUM`
- else if days since last engagement <= 740 and engagement count >= 1 => `ENG__LOW`
- else => `ENG__INACTIVE`

This creates a simple recency-and-frequency model. It rewards recent and repeated engagement, and demotes a contact to inactive when they have not engaged recently enough or have no active engagement history.

### 4.3 Donation / lifecycle (`LIF` and `DLF`)

The lifecycle rules use:

- `hit_EV_LIF_ACTIVE_MONTHS` = default 12
- `hit_EV_LIF_AT_RISK_MONTHS` = default 24

The flow pattern implies:

- no donations => `DLF__PROSPECT` or `LIF__PROSPECT`
- one donation => `DLF__FIRST_TIME`
- two or more donations in the last 12 months => `DLF__REPEAT` or `DLF__ACTIVE`
- donation recency within active window => `DLF__ACTIVE`
- donation recency within at-risk window => `DLF__AT_RISK`
- beyond the at-risk window => `DLF__LAPSED`

The logic is tightly coupled with the same months-based thresholds used for `LIF`:

- `<= EV_LIF_ACTIVE_MONTHS` => active
- `<= EV_LIF_AT_RISK_MONTHS` => at risk
- otherwise => lapsed

The exact labels differ slightly by dimension, but the meaning is consistent: recent donors are active; donors who have drifted but have not fully dropped off are at risk; donors who have been inactive for too long are lapsed.

### 4.4 Contact state updates

After the tag resolution, the flow updates the Contact record with:

- `hit_lastgiftdate`
- `hit_lastinteractiondate`

This confirms the tag engine is also an enrichment engine: it calculates the current state and writes summary dates back to the core Contact record for use elsewhere in the app.

---

## 5. Organisation recalculation engine

The organisation equivalent, `TaggingEngine-RecalcOrganisationStateTagschild-*`, uses the same pattern and thresholds as the contact flow. It reads organisational engagement, value, and lifecycle variables and then sets a target tag in the same dimensions.

The environment variables referenced are the same core set:

- `hit_EV_VAL_HIGH_THRESHOLD`
- `hit_EV_VAL_MID_THRESHOLD`
- `hit_EV_ENG_HIGH_DAYS`
- `hit_EV_ENG_MEDIUM_DAYS`
- `hit_EV_ENG_LOW_DAYS`
- `hit_EV_LIF_ACTIVE_MONTHS`
- `hit_EV_LIF_AT_RISK_MONTHS`

This strongly suggests the entire DSR audience segmentation model is designed to work for both individuals and organisations, with the same business logic applied to a different entity type.

---

## 6. Source-of-truth and removal logic

The add-tag child flows do more than just create membership rows. They also check for existing dimension membership and remove conflicting tags before creating the new row.

The relevant pattern is:

- `existingTags` query by `recordId` and `SegmentTag`
- `Apply to each` over existing membership records
- `Delete a row` for same-dimension conflicting tag records when `exclusive` is true
- then create the new row with the correct `hit_segmenttag` lookup

This is the key rule that ensures the current state is maintained correctly. It prevents the same dimension from accumulating contradictory tags such as both `ENG__HIGH` and `ENG__LOW` at the same time.

The `Trigger_ContactDoNotEmail` example confirms the same pattern in practice:

- when `donotemail` or `donotbulkemail` is true, call `AddNewContactSegmentTagChild` with `CON__DO_NOT_EMAIL` and `mode = Add`
- when false, call the same child with `mode = Remove`

This confirms that the “tag system” is operational, not just analytical.

---

## 7. Business interpretation of the dimensions

### `CON` dimension

Operational do-not-contact traits.

Examples:

- `CON__DO_NOT_EMAIL`
- `CON__DO_NOT_CALL`
- `CON__DO_NOT_CONTACT`

These are direct contact preference / opt-out states. They usually reflect compliance and communication policy rather than engagement value or life-cycle stage.

### `ENG` dimension

How recently and how often the constituent has interacted.

This is behaviour-based and recency-sensitive.

### `VAL` dimension

How much value the contact or account has contributed over time.

The threshold model is obviously a simple monetary segmentation for fundraising and supporter management.

### `LIF` dimension

Observed lifetime giving / lifecycle status. This is the long-term contribution maturity state.

### `DLF` dimension

Donation frequency / donor loyalty progression.

This distinguishes first-time, repeat, active, at-risk, and lapsed donor states, which is typical of fundraising CRM logic.

---

## 8. Operational conclusion

The DSR segment-tag engine is a state-machine style segmentation layer built on top of Dataverse. The data model is not just a list of labels; it is a structured membership engine with:

- tag definitions (`hit_segmenttag`)
- tag membership records (`hit_contactsegmenttag`, `hit_accountsegmenttag`)
- exclusive dimension enforcement
- recalculation flows for derived states
- operational preference tags for compliance/comms
- summary fields on Contact and Account for streamlined display

The practical business effect is that each contact or organisation can be maintained in a current segmentation state according to:

- current communication preferences
- donor value tier
- engagement recency/frequency
- donor lifecycle status
- giving behaviour progression

This gives the fundraising platform a single segmentation vocabulary for customer targeting, campaign eligibility, and relationship management.

---

## 9. Assumptions and uncertainties

The exact tag definitions in the master `hit_segmenttag` table are not fully enumerated in the repo excerpt reviewed here, so the following points are business interpretation rather than definitive schema truth:

- Some exact `LIF__...` and `DLF__...` label names may vary by record data or be controlled in addition to the flow logic.
- The repo shows the thresholds and structure clearly, but the specific business definitions for every tag may still be maintained in configuration records rather than code alone.
- The summary fields `hit_segmenttags` look authoritative in forms, but the relationship model indicates the real source of truth is the tagging junction records.
- The presence of `hit_contactorgsegmenttag` suggests additional relationship-level logic may exist beyond the direct contact/account flow patterns reviewed here.

Even with those caveats, the flow logic and entity model are clear enough to say that the DSR engine is a structured, exclusive, dimensioned audience-tagging model with explicit recalc rules driven by environment variables and Dataverse membership records.
