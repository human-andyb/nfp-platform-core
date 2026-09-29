# PCP Security and Privacy

## Purpose
Summarise the data-protection and operational-security considerations for the PCP export.

## Confirmed Data Exposed in the Export
- Supporter name.
- Phone numbers.
- Email address where present.
- CRM record URL.
- Queue classification and export bucket.

## Confirmed Controls
- Dataverse permissions and export logic constrain who can create and update the underlying records.
- SharePoint is used as the intermediate staging location.
- The Logic App is invoked through an HTTP trigger rather than direct file manipulation from the portal.

## Gaps and Risks
- No repository evidence confirms retention controls on the staged file.
- No repository evidence confirms downstream PCP encryption or archive handling.
- No repository evidence confirms that exported records are removed from the staging folder after transfer.

## Related Documents
- [File staging](pcp-file-staging.md)
- [Secure file transfer](pcp-secure-file-transfer.md)
- [Monitoring and reconciliation](pcp-monitoring-and-reconciliation.md)
