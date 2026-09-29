# PCP Component Catalogue

## Purpose
List the components that are directly evidenced in the PCP handoff.

## Catalogue
| Component | Type | Path | Role | Evidence Status |
|---|---|---|---|---|
| `PCPContactFileGeneration-EscalatetoPhoneQueueChild` | Power Automate flow | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/PCPContactFileGeneration-EscalatetoPhoneQueueChild-B3817FEA-F87F-F111-AB0F-70A8A555B733.json` | export contact phone-queue rows | Confirmed |
| `PCPOrganisationFileGeneration-EscalatetoPhoneQueue` | Power Automate flow | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/PCPOrganisationFileGeneration-EscalatetoPhoneQueue-63220083-7898-F111-B8DB-6045BDC2338C.json` | export organisation phone-queue rows | Confirmed |
| `recurrence_BatchProcessContact-NextEligibleContact` | Power Automate flow | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/recurrence_BatchProcessContact-NextEligibleContact-258D5C80-B98F-F111-B8DA-7CED8DA2B423.json` | tag eligible contacts for outbound calling | Confirmed |
| SharePoint PCP folder | staging location | SharePoint PCP files folder | holds exported CSV files | Confirmed |
| Logic App endpoint | Azure integration boundary | HTTP trigger referenced from flow | receives file name and path | Partially confirmed |

## Related Documents
- [Flow processing](pcp-power-automate-processing.md)
- [Evidence register](pcp-evidence-register.md)
