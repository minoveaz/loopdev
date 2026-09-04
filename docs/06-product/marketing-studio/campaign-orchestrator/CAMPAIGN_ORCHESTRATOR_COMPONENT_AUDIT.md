---
title: Campaign Orchestrator Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/campaign-orchestrator/CAMPAIGN_ORCHESTRATOR_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/148
---

# Campaign Orchestrator Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas mode=overview|data|board|record|split
  -> Campaign widgets -> features -> Campaign and CampaignItem entities -> shared
```

| Surface or component | Layer | Decision |
| --- | --- | --- |
| AppShell, SuiteShell, SuiteRuntime, SuiteCanvas | Platform Shell | Reuse. |
| Headers, toolbars, tables, filters, dialogs, states and accessible controls | `@loopdev/ui` | Reuse or compose after availability audit. |
| `CampaignOverviewWidget`, `CampaignListWidget`, `CampaignRecordView` | Widget | Module composition over authorized queries. |
| `CampaignCalendarBoard`, `CampaignItemInspector` | Widget | Module composition in generic `board`/`split` recipes. |
| `CampaignForm`, `CampaignItemForm`, `AttachApprovedContent` | Feature | Module implementation using Content Engine read models. |
| `DeliveryEvidenceSummary`, `CrmAttributionSummary` | Feature adapters | Read-only adapters over future owned contracts. |
| `Campaign`, `CampaignItem`, `CampaignObjective` | Entity | Module entities after contract approval. |

No publishing, CRM or transport logic is promoted into shared UI or Canvas.
