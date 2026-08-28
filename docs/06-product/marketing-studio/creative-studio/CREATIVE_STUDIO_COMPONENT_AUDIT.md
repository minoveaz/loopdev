---
title: Creative Studio Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/creative-studio/CREATIVE_STUDIO_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/144
---

# Creative Studio Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas
  -> Creative Studio widgets -> features -> CreativeProject entities -> shared
  -> Image Studio or Video Studio workspace inside focus Canvas
```

| Surface or component | Layer | Decision |
| --- | --- | --- |
| AppShell, SuiteShell, SuiteRuntime, SuiteCanvas | Platform Shell | Reuse. |
| Headers, toolbars, table, filters, dialog, tabs, inspector and states | `@loopdev/ui` | Reuse or compose after availability audit. |
| `CreativeOverviewWidget`, `ProjectListWidget`, `ProjectRecordView` | Widget | Module composition over authorized project queries. |
| `ProjectForm`, `ProjectVersionTimeline`, `VariantManager` | Feature | Module implementation through approved commands. |
| `BrandContextSummary`, `AssetReferenceSummary` | Feature adapter | Read published Brand Hub context and Asset Library references. |
| `VerticalWorkspaceHost` | Widget | Mount declared vertical workspace; does not contain editor business logic. |
| `CreativeProject`, `CreativeVersion`, `CreativeVariant` | Entity | Module entities after contract approval. |

## Boundaries

- Shell and Canvas contain no repositories, project mutations, editor state or Storage clients.
- Vertical editors remain in Image Studio and Video Studio; Creative Studio supplies project context.
- Asset Library owns binary metadata/references and Brand Hub owns published identity.
- Shared UI promotion requires a second real consumer and component certification.
