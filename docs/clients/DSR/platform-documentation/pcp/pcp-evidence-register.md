# PCP Evidence Register

## Purpose
Record the main conclusions and the evidence behind them.

## Evidence Register
| Conclusion | Evidence Type | Component | Repository Path | Evidence Summary | Confidence | Gap |
|---|---|---|---|---|---|---|
| PCP export is segment-tag driven | flow definition | PCP export flows | `solutions/exports/unpacked/dsr/DSRCustomisations/Workflows/*.json` | the flows query `hit_segmenttags` for `ESC__PHONE_QUEUE` | Confirmed | none |
| SharePoint is the staging location | flow definition | PCP export flows | same as above | the flows create CSV files in `/Shared Documents/PCP Files` | Confirmed | none |
| A Logic App is the next handoff point | flow definition | PCP export flows | same as above | the flows POST file name and path to an HTTP trigger | Partially confirmed | Logic App source missing |
| PCP-side import exists but is not evidenced | absence of source | downstream PCP process | no repository path | the repository stops at the DSR handoff boundary | Unconfirmed | PCP export/import source absent |

## Related Documents
- [Evidence gaps](pcp-evidence-gaps.md)
- [Current and future state](pcp-current-and-future-state.md)
