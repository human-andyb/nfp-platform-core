# Next Eligible Contact Date business rules

## Scope and evidence base

This document reconstructs the business and technical rules for the DSR `hit_nexteligiblecontactdate` field from the unpacked solution metadata and automation. The primary evidence is:

- `solutions/exports/unpacked/dsr/BaseSchema/Entities/Contact/Entity.xml`
- `solutions/exports/unpacked/dsr/BaseSchema/Entities/Account/Entity.xml`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/SetNextEligibleContactDate-ContactChild-97367A17-2395-F111-B8DB-7CED8DA2B423.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/recurrence_BatchProcessContact-NextEligibleContact-258D5C80-B98F-F111-B8DA-7CED8DA2B423.json`
- `solutions/exports/unpacked/dsr/DSRCustomisations/Entities/Contact/FormXml/...` and `Account/FormXml/...`

This is a reverse-engineered interpretation of implemented logic, anchored to the actual flow JSON and Dataverse schema definitions.

---

## 1. What the field is for

The field name and display label are explicit:

- `hit_nexteligiblecontactdate` on Contact
- `hit_nexteligiblecontactdate` on Account
- display name: `Next Eligible Contact Date`

The field is not a “last contacted” date. It is a scheduled threshold date used to decide when a record becomes eligible for outbound engagement again. The recurrence flow literally selects records where the field is on or before today and `hit_allowoutbound` is true.

The batch query is:

- `$filter = "(hit_nexteligiblecontactdate le '@{outputs('todayDate')}') and (hit_allowoutbound eq true)"`
- `$orderby = "hit_nexteligiblecontactdate desc"`

That proves the date is treated as a gating value for outbound availability and cadence.

---

## 2. Contact and organisation parity

### Contact

The Contact schema metadata shows:

- field: `hit_nexteligiblecontactdate`
- logical name: `hit_nexteligiblecontactdate`
- display name: `Next Eligible Contact Date`
- field type: date/time

The Contact form metadata also exposes this value in the outbound engagement section and marks it read-only.

### Account / Organisation

The Account schema metadata includes the same field and label with the same purpose. It is therefore a parallel organisation-level scheduling field with the same operational semantics.

The evidence is strong that the platform expects both Contact and Account records to hold a next eligible contact date. However, in the actual reviewed automation, the concrete child flow and batch logic are for the Contact path. The Account path is structurally present in the metadata, but the audited logic is materially stronger for Contact than for Organisation.

The safest conclusion is:

- `Contact` is confirmed operationally
- `Account` is confirmed structurally and likely participates in the same engagement model
- any Account-specific business rule beyond parallel field definition is inferred, not directly executed in the reviewed automation set

---

## 3. Related cadence field: Contact Frequency per Year

The companion field is:

- `hit_contactfrequencyperyear`

This is a picklist on both Contact and Account, with option values:

- `1` = Annual
- `2` = Semi-Annual
- `4` = Quarterly
- `12` = Monthly

This is a direct input into the next-date calculation. In the child flow, the logic is:

- `iFrequency = int(coalesce(contact.hit_contactfrequencyperyear, 4))`
- default is `4` if the value is empty

That means a blank or missing frequency defaults to a quarterly cadence unless the flow can infer a preference-based or explicit frequency rule.

---

## 4. How the date is calculated

The core flow is `SetNextEligibleContactDate-ContactChild`.

### 4.1 Initial values

The flow loads the current Contact record and then sets:

- `varNextEligibleDate` from `contact.hit_nexteligiblecontactdate` if present
- otherwise from `utcNow()` formatted as `yyyy-MM-dd`

This means the flow starts from the existing scheduled date if one already exists; if no date exists it creates a baseline from today.

### 4.2 Frequency and interval calculation

The flow reads `hit_contactfrequencyperyear` and converts it to `iFrequency`.

Then it maps frequency to a monthly interval:

- annual (1) => `12` months
- semi-annual (2) => `6` months
- quarterly (4) => `3` months
- monthly (12) => default path that still resolves to the next future date using the same until loop
- unknown / blank => `3` months (default via `default` case)

So the scheduling engine is effectively month-based and frequency becomes an interval model that drives recurrence.

### 4.3 Preferred month logic

For annual and semi-annual contact preferences, the flow looks at variables such as:

- `varPreferenceMonth1`
- `varPreferenceMonth2`

and builds a preferred month date (`YYYY-MM-01`) for the target month. It compares the preferred month date against the current candidate date using `ticks()` to determine whether to keep the preferred month in the current year or move it to the next year.

The effect is:

- annual contact: choose the next upcoming month 1 preference after the current date
- semi-annual: choose the earlier of month 1 and month 2 preferences for the next timeframe
- if no preferred month exists, fall back to the interval-based schedule

This demonstrates that the system supports both a general cadence and a preferred contact month calendar, especially for annual or semi-annual donor outreach.

### 4.4 The until loop

After the interval is selected, the flow executes an `Until` loop:

- expression: `@greater(variables('varNextEligibleDate'), utcNow())`
- it repeatedly does `addToTime(varNextEligibleDate, varIntervalMonths, 'Month')`

This is key: the system is not “setting the date to exactly X months in the future” once. It keeps moving the candidate date forward until the calculated date is in the future relative to `utcNow()`, and then stops.

This means the effective rule is:

- start from today or current candidate date
- add the relevant interval until the next date is after today
- store that future date as the new `hit_nexteligiblecontactdate`

In plain business terms, the system calculates the next future date on which the person becomes eligible for outbound contact again.

---

## 5. When the field is cleared or disabled

The workflow contains explicit nulling logic. The date and frequency are reset to null in cases like:

- no outbound contact allowed
- no contact method available
- do not contact / no outbound outcome conditions
- contact suppression states

Example actions include:

- `item/hit_allowoutbound`: false
- `item/hit_nexteligiblecontactdate`: `@null`
- `item/hit_outboundactive`: false
- `item/hit_contactfrequencyperyear`: `@null`

This proves that the field is intentionally cleared when the contact is not eligible for outbound outreach, rather than merely left stale.

In the “do not contact” branch, the flow explicitly writes:

- `hit_lastoutcome = "No Outbound Contact"`
- `hit_allowoutbound = false`
- `hit_nexteligiblecontactdate = null`
- `hit_contactfrequencyperyear = null`

This is strong evidence that the next-date field is treated as a dynamic scheduling gate, not a historical record.

---

## 6. Final update path

Once the flow resolves the next date, it updates the Contact record with:

- `hit_lastoutcome = sLastOutcome`
- `hit_nexteligiblecontactdate = varNextEligibleDate`
- `hit_contactfrequencyperyear = iFrequency`

This is the definitive write-back step that sets the final state after the calculation and any eligibility checks.

---

## 7. Batch selection and downstream usage

The recurrence flow (`recurrence_Batch Process Contact - Next Eligible Contact`) is the operational consumer of this date.

It does:

- fetch `contacts`
- filter: `hit_nexteligiblecontactdate le todayDate` and `hit_allowoutbound eq true`
- order by `hit_nexteligiblecontactdate desc`

That means the system identifies all people whose next eligible date has arrived or passed and who are currently allowed to receive outbound contact.

For each due Contact, the flow then:

- sets `hit_lastoutboundcontactdate = todayDate`
- sets `hit_outboundactive = true`
- adds `JRN__CONTACT_DUE` tag or chooses an outbound route based on contact method
- may switch to email or phone queue paths
- may add `ESC__PHONE_QUEUE` when phone outreach is the valid channel

This establishes a clear end-to-end business process:

1. compute next eligible date
2. wait until it is due
3. select due contacts in a recurrence batch
4. activate outbound processing
5. mark last outbound contact and route to an outreach mechanism

---

## 8. Business interpretation of the rule

The business logic in plain English is:

- each Contact or Account has a scheduled date when they can next be contacted
- the date is recalculated using a contact frequency cadence (annual, semi-annual, quarterly, monthly)
- if contact preferences or suppression constraints apply, the date is reset or suppressed
- when the date is reached, an automated batch selects the due records and marks them outbound active
- the system intentionally keeps the field current rather than historical

This is an eligibility engine, not just a reporting field.

---

## 9. Confirmed vs inferred

### Confirmed

- `hit_nexteligiblecontactdate` exists on Contact and Account
- it is a date field used for next outbound eligibility
- the recurrence flow selects records by `hit_nexteligiblecontactdate <= today` and `hit_allowoutbound = true`
- the child flow recalculates the date based on frequency and preferred months
- the field is cleared/nullified when outbound contact is disabled or the contact is suppressed
- the final update writes the computed date back to the Contact record

### Inferred but strongly supported

- the same operational model is intended for Account / Organisation records
- preferred month logic is intended to schedule annual or semi-annual contact windows based on donor preference
- the system is designed to keep a “next outgoing touch” schedule aligned to a campaign or fundraising cadence

---

## 10. Rule summary

The operational summary is:

- if no next eligible date exists, start from today
- derive frequency from `hit_contactfrequencyperyear` with a fallback of quarterly
- convert the frequency into a monthly step size
- advance the candidate date until it lands in the future
- if the person is not eligible for outbound contact, set the date to null and suppress outbound
- when the date is due, the recurrence batch activates outreach and records the outbound touch date

This is the business rule that actually drives DSR outbound eligibility in the reviewed solution.
