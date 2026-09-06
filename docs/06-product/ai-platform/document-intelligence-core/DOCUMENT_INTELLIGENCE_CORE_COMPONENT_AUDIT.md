---
title: Document Intelligence Core Component Audit
status: approved
version: 0.1
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/active/ai-platform/2026-09-06-document-intelligence-core-definition.md
ux_spec: DOCUMENT_INTELLIGENCE_CORE_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/198
related_issues: [199, 200, 204, 202, 205, 201, 203, 176]
---

# Document Intelligence Core Component Audit

## Formal approval

This document is formally approved as part of the Document Intelligence Core package for the
authorized #199 implementation slice. No individual approver attribution is recorded.

## Boundary

```text
App Router -> SuiteRuntime/SuiteCanvas
  -> widgets -> features -> entities -> shared
```

Platform Shell remains the owner of `AppShell`, `PlatformHeader`, `SuiteSidebar`,
`PlatformContextPanel` and `SuiteCanvas`. Canvas never receives domain mutations, repositories,
Storage clients, provider credentials or RLS decisions.

## Reuse / compose / module / entity classification

| Surface                                                                                                | Classification                                     | Decision and ownership                                                                       |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `AppShell`, `SuiteRuntime`, `SuiteCanvas`, `SuiteSidebar`                                              | Reuse from `@loopdev/ui`/platform                  | Reuse existing contracts; no parallel shell.                                                 |
| `PlatformHeader`, `PlatformContextPanel`, `ModuleHeader`, `ModuleContextPanel`                         | Reuse                                              | Configure slots declaratively; context panel is not second navigation.                       |
| `ResponsiveTable`, `DataWorkspace` primitives, filters, pagination, dialogs, inputs, badges and states | Reuse from `@loopdev/ui`                           | Reuse after availability/accessibility audit.                                                |
| `DocumentHistoryWidget`                                                                                | Compose inside suite widget                        | Organization-scoped query, filters, cursor and empty/error/forbidden states.                 |
| `HistoryFilters`, `VersionActions`, `ReopenExtraction`, `RetentionStatus`                              | Implement as module features                       | Features dispatch authorized commands; no direct persistence.                                |
| Existing `DocumentIntelligenceWorkbench` / `RecordWorkspace`                                           | Implement as module evolution                      | Add version/history context without changing shell ownership or creating a new route family. |
| `Document`, `DocumentVersion`, `Extraction`, `ValidationResult`, `RetentionRecord`                     | Implement as domain entities                       | Models and adapters are defined by the Core contract.                                        |
| `AuditTimeline`                                                                                        | Implement as module feature over entity            | Read-only, redacted, append-only evidence; not a generic activity feed.                      |
| `ProviderStatus` / `UsageCostSummary`                                                                  | Implement as module feature                        | Render safe aggregates; provider adapter remains server-side.                                |
| Generic `ValidationRuleEditor` or `DocumentReferencePicker`                                            | Promote to shared only with a second real consumer | First consumer is not sufficient; require certification and ownership review.                |

## Component rules

- Reuse semantic tokens and certified primitives; do not hardcode tenant colors or create local
  overlay/rail geometry.
- Widgets request read models through typed services; features own user intent; entities own
  domain shape, never Supabase clients.
- `RecordWorkspace` is an evolution of the existing Document Intelligence module, not a new
  shared component or a reopened POC track.
- Any proposed promotion to `@loopdev/ui` requires a second real consumer, a UI/UX spec, registry
  evidence and visual/accessibility certification.
- Loading, empty, error, forbidden, conflict, retention and success states must be tested without
  layout shifts and with accessible names.

## Audit gaps and approvals

The availability of a certified cursor table, history filters, retention badge and validation-rule
editor must be confirmed during implementation planning. No new shared primitive is approved by this
audit; UI/UX certification remains an implementation gate.
