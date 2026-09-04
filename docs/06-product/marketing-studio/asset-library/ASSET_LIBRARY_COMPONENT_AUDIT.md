---
title: Asset Library Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/asset-library/ASSET_LIBRARY_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/143
---

# Asset Library Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas
  -> Asset Library widgets -> features -> Asset and AssetVersion entities -> shared
```

Shell and Canvas remain generic. They do not receive Storage clients, asset repositories, binary
payloads, lifecycle rules or mutations.

| Surface or component | Layer | Decision |
| --- | --- | --- |
| AppShell, SuiteShell, SuiteRuntime, SuiteCanvas | Platform Shell | Reuse. |
| Headers, toolbar, filters, table/grid, dialog, inputs, badges and states | `@loopdev/ui` | Reuse or compose after availability audit. |
| `AssetLibraryOverviewWidget` | Widget | Module composition of authorized summary queries. |
| `AssetCollectionWidget`, `AssetFilters`, `AssetInspector` | Widget / feature | Module implementation over authorized list and detail models. |
| `AssetIngestWorkspace`, `AssetMetadataForm`, `AssetVersionTimeline` | Widget / feature | Module implementation; client submits commands, never direct Storage authority. |
| `AssetReviewPanel`, `ArchiveAsset`, `RestoreAsset` | Feature | Module implementation with server-authorized commands and audit results. |
| `AssetReferencePicker` | Feature adapter | Reusable only after a second real consumer; returns opaque authorized references. |
| `Asset`, `AssetVersion`, `AssetUsage` | Entity | Module domain models with a public API after contract approval. |

## Ownership rules

- `@loopdev/ui` does not contain asset lifecycle, rights or tenant logic.
- Asset Library owns references and metadata; Platform Storage owns object storage mechanics.
- Brand Hub, Creative Studio, Image Studio and Video Studio consume authorized references.
- Widgets do not access Supabase, object storage or providers directly.
- Shared promotion requires a second consumer and component certification.

The implementation must cover loading, empty, error, forbidden and success without layout shifts;
the `split` inspector becomes a controlled single region on mobile.
