# PCP Logic App Transfer

## Purpose
Document the confirmed Logic App handoff that follows file staging.

## Confirmed Behaviour
- The PCP export flows call an HTTP-triggered Azure Logic App after each CSV file is created.
- The request body contains the file name and file path.
- The Logic App workflow source is not present in the repository.

## What the Repository Does Not Confirm
- The Logic App actions.
- Whether the Logic App uses SFTP or another downstream transfer mechanism.
- Whether the Logic App archives the staged file.
- Whether the Logic App reports success or failure back to Dataverse.

## Evidence Gap
The missing Logic App export is the main limitation in the PCP handoff chain. The source repository shows the trigger point but not the downstream implementation.

## Related Documents
- [File staging](pcp-file-staging.md)
- [Secure file transfer](pcp-secure-file-transfer.md)
- [Evidence gaps](pcp-evidence-gaps.md)
