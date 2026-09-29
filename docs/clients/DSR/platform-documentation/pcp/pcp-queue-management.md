# PCP Queue Management

## Purpose
Explain how queue assignment is represented in the current evidence.

## Confirmed Queue Logic
- `ESC__PHONE_QUEUE` is the confirmed outbound phone queue tag used by the PCP export flows.
- `JRN__CONTACT_DUE` is a separate confirmed queue/tag outcome for email-capable contacts in the upstream eligibility flow.

## Queue Assignment Decision
1. Evaluate contact eligibility.
2. If email is allowed and an email address exists, assign the contact to the JRN queue path.
3. If a mobile number exists and do-not-phone is false, assign the contact to `ESC__PHONE_QUEUE`.
4. The PCP export selects only the tagged rows for the outbound phone queue.

## What Is Not Confirmed
- PCP-side queue naming beyond the export tag.
- PCP-side queue allocation rules.
- Any queue priorities such as high value renewal or lapsed re-engagement.

## Related Documents
- [Contact selection](pcp-contact-selection.md)
- [Power Automate processing](pcp-power-automate-processing.md)
- [Import and queue processing](pcp-import-and-queue-processing.md)
- [Current and future state](pcp-current-and-future-state.md)
