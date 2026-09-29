# PCP Import and Queue Processing

## Purpose
Record what the repository confirms about PCP-side import and queue processing.

## Confirmed Repository Evidence
- PCP-side import logic is not present in the repository.
- The DSR flows only hand off file name and file path to the Logic App.
- Queue assignment on the DSR side is driven by the `ESC__PHONE_QUEUE` segment tag.

## Unconfirmed PCP Behaviour
- File-pattern matching inside PCP.
- Import profile selection.
- Queue allocation rules inside PCP.
- Rejection handling and re-import behaviour.

## Support Note
If PCP administrators maintain the downstream import, they must confirm the actual import profile and queue allocation rules before the process can be documented as current-state behaviour.

## Related Documents
- [Queue management](pcp-queue-management.md)
- [Fundraiser workflow](pcp-fundraiser-workflow.md)
- [Evidence gaps](pcp-evidence-gaps.md)
