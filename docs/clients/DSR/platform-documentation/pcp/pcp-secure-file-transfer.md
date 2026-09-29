# PCP Secure File Transfer

## Purpose
Capture what is and is not evidenced about secure transfer to PCP.

## Confirmed
- The DSR export uses an HTTP request to a Logic App endpoint after the file is staged.
- SharePoint access is handled through the Power Automate SharePoint connector.

## Not Confirmed
- SFTP, FTPS, or API transfer to PCP.
- Host key handling.
- PCP destination path.
- PCP-side authentication.
- Partial transfer handling.

## Interpretation
The repository confirms a secure DSR-side handoff into an Azure integration boundary, but it does not prove the last-mile transport into PCP.

## Related Documents
- [Logic App transfer](pcp-logic-app-transfer.md)
- [Import and queue processing](pcp-import-and-queue-processing.md)
- [Security and privacy](pcp-security-and-privacy.md)
