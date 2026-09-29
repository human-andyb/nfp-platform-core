# Evidence Gaps Register

## Purpose
Track unresolved documentation uncertainties that require verification beyond current repository evidence.

## Gap register

### Gap 1
- process:
  - Acceptance status validation endpoint configuration.
- missing information:
  - definitive site setting entry for Flow/AcceptanceStatusValidation in current portal settings export.
- files and components reviewed:
  - power-pages/nfp-base/sitesetting.yml
  - sections--acceptance-router template references
  - repository discovery and component evidence register docs
- why the gap matters:
  - router polling behavior depends on endpoint resolution; environment drift can break state transitions.
- recommended verification method:
  - inspect live environment site settings and compare to managed solution config values.

### Gap 2
- process:
  - Offering fulfillment branch logic.
- missing information:
  - complete field mutation and branch outcomes across trigger_OfferingFulfillment-Orchestrator and OfferingSpecificFulfillmentHandlerchild paths.
- files and components reviewed:
  - solutions/exports/unpacked/dsr/Automation/Workflows/trigger_OfferingFulfillment-Orchestrator-*.json
  - solutions/exports/unpacked/dsr/Automation/Workflows/OfferingSpecificFulfillmentHandlerchild-*.json
- why the gap matters:
  - support teams need exact post-payment behavior to diagnose stuck fulfillment states.
- recommended verification method:
  - produce branch-by-branch flow trace matrix from full workflow JSON and sample run histories.

### Gap 3
- process:
  - Customer Insights journeys runtime coverage.
- missing information:
  - definitive list of active journeys and their direct invocation points from DSR acceptance/process states.
- files and components reviewed:
  - solutions/exports/unpacked/dsr/* containing msdynmkt_* metadata and event datasets
  - analysis docs referencing CI artifacts
- why the gap matters:
  - marketing and lifecycle automations may be under-documented, affecting campaign support and governance.
- recommended verification method:
  - cross-check Dataverse CI objects and live CI environment journey inventory, then map trigger events to DSR state transitions.

### Gap 4
- process:
  - Navigation production parity.
- missing information:
  - intended release state for dynamic header navigation versus temporary static hardcoded menu.
- files and components reviewed:
  - components--web-nav-header template
  - components--web-nav-header-node template
- why the gap matters:
  - hardcoded navigation can block expected discoverability and section rollout.
- recommended verification method:
  - confirm deployment decision with product owner and compare against release branch template version.

### Gap 5
- process:
  - PCP downstream lifecycle after handoff.
- missing information:
  - post-Logic-App processing details: transport, import validation, acknowledgment, and reconciliation back to Dataverse.
- files and components reviewed:
  - PCP file generation flows
  - recurrence_BatchProcessContact-NextEligibleContact flow
  - analysis/pcp-file-integration-business-process.md
- why the gap matters:
  - incident handling currently stops at handoff boundary and cannot confirm end-to-end success.
- recommended verification method:
  - review Azure Logic App definition and downstream PCP process documentation, then add a closed-loop status model.

### Gap 6
- process:
  - Navigation runtime model selection.
- missing information:
  - authoritative decision for when runtime should use temporary static header nav versus standard Web Link Set model versus custom hit_webnavmenu model.
- files and components reviewed:
  - power-pages/nfp-base/website.yml
  - power-pages/nfp-base/web-templates/header/Header.webtemplate.source.html
  - power-pages/nfp-base/web-templates/layout--header/layout--header.webtemplate.source.html
  - power-pages/nfp-base/web-templates/components--web-nav-header/components--web-nav-header.webtemplate.source.html
  - power-pages/nfp-base/web-templates/header-legacy/Header-legacy.webtemplate.source.html
- why the gap matters:
  - administrators may update menu configuration records that are not connected to active runtime output.
- recommended verification method:
  - confirm release intent with product owner and deployment branch owner, then enforce one active nav model and remove dormant conflicting paths.

### Gap 7
- process:
  - Navigation visibility filtering expectations.
- missing information:
  - whether web-role-specific filtering is expected in current DSR header path once temporary code is removed.
- files and components reviewed:
  - power-pages/nfp-base/web-templates/components--web-nav-header/components--web-nav-header.webtemplate.source.html
  - power-pages/nfp-base/web-templates/components--web-nav-header-node/components--web-nav-header-node.webtemplate.source.html
  - power-pages/nfp-base/web-templates/header-legacy/Header-legacy.webtemplate.source.html
  - power-pages/nfp-base/table-permissions/Web-Nav-Menu---Read.tablepermission.yml
  - power-pages/nfp-base/table-permissions/Web-Nav-Menu-Item---Read.tablepermission.yml
  - power-pages/nfp-base/table-permissions/Platform-Route---Read.tablepermission.yml
- why the gap matters:
  - security review and UX expectations can diverge if teams assume filtering exists without active evidence.
- recommended verification method:
  - execute authenticated and anonymous runtime tests in target environment after selecting final nav model, then capture expected role-visibility matrix.

### Gap 8
- process:
  - Desktop versus mobile navigation behavior parity.
- missing information:
  - final intended mobile interaction model for the active custom header path (drawer/toggle behavior versus CSS-only wrapping).
- files and components reviewed:
  - power-pages/nfp-base/web-templates/components--web-nav-header/components--web-nav-header.webtemplate.source.html
  - power-pages/nfp-base/web-templates/header-legacy/Header-legacy.webtemplate.source.html
  - power-pages/nfp-base/web-files/css--site.css
- why the gap matters:
  - inconsistent behavior between desktop and mobile can affect discoverability and accessibility.
- recommended verification method:
  - validate current production mobile UX and align template implementation with agreed responsive interaction pattern.

## Related references
- [repository-discovery.md](repository-discovery.md)
- [component-evidence-register.md](component-evidence-register.md)
