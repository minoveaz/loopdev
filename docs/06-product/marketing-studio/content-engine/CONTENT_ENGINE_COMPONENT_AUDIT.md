---
title: Content Engine Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/content-engine/CONTENT_ENGINE_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/147
---

# Content Engine Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas
  -> Content Engine widgets -> features -> ContentItem and ContentVersion entities -> shared
```

| Surface or component | Layer | Decision |
| --- | --- | --- |
| AppShell, SuiteShell, SuiteRuntime, SuiteCanvas | Platform Shell | Reuse. |
| Headers, toolbars, table, filters, editor inputs, dialog, badges and states | `@loopdev/ui` | Reuse or compose after availability audit. |
| `ContentOverviewWidget`, `ContentListWidget`, `ContentRecordView` | Widget | Module composition over authorized read models. |
| `ContentVersionEditor`, `ContentMetadataForm`, `ContentAssetReferences` | Feature | Module implementation using contracts; asset selection stays an Asset Library adapter. |
| `ContentReviewPanel`, `RequestContentReview`, `DecideContentReview` | Feature | Module implementation with audit result. |
| `CampaignLinkSummary` | Feature adapter | Read campaign link only; no campaign planning logic. |
| `ContentItem`, `ContentVersion`, `ContentApproval` | Entity | Module entities after contract approval. |

Shell/Canvas contain no editorial repositories or mutations. Shared UI promotion requires a second
real consumer and certification; Content Engine receives no transport/provider component.
