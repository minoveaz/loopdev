---
title: Brand Hub Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/brand-hub/BRAND_HUB_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/142
---

# Brand Hub Component Audit

## Canvas composition

```text
App Router
  -> SuiteRuntime
    -> SuiteCanvas mode=overview|data|record|split|focus
      -> BrandHub widgets
        -> Brand Hub features
          -> Brand and BrandVersion entities
            -> shared contracts and UI primitives
```

Shell and Canvas remain generic: neither receives Brand Hub repositories, mutations or domain rules.

## Surface inventory

| Surface or component | Layer | Decision |
| --- | --- | --- |
| AppShell, SuiteShell, SuiteRuntime, SuiteCanvas | Platform Shell | Reuse. |
| Header, toolbar, tabs, inputs, selects, buttons, icon buttons, dialogs, badges and states | `@loopdev/ui` | Reuse or compose after availability audit. |
| Table, filters, pagination and record inspector | `@loopdev/ui` | Reuse or compose; certify the selected primitives for this workflow. |
| `BrandHubOverviewWidget` | Widget | Module feature to compose status, active brand and review work. |
| `BrandListWidget` and `BrandFilters` | Widget / feature | Module feature over authorized Brand Hub queries. |
| `BrandRecordView` and `BrandVersionTimeline` | Widget | Module feature that reads brand/version models. |
| `BrandVersionEditor` | Feature | Module feature for draft inputs and validation. |
| `BrandReviewPanel` and `PublishBrandVersion` | Feature | Module features that invoke authorized commands and show audit outcome. |
| `AssetReferenceField` | Feature adapter | Compose an Asset Library selector contract; it does not manage binary uploads. |
| `Brand` and `BrandVersion` | Entity | Define module entity and public API only after contract approval. |

## Ownership rules

- `@loopdev/ui` stays free of Brand Hub lifecycle and permissions.
- Widgets compose features and entities but do not call Supabase or provider APIs directly.
- Features use application contracts and display server-authorized results.
- Brand Hub keeps references to assets; Asset Library owns asset selection, metadata and Storage.
- A component is promoted to shared UI only after a second real consumer and component certification.

## States and readiness

The implementation must maintain stable layout for loading, empty, error, forbidden and success.
Desktop, tablet and mobile behavior follows the UX specification; `split` degrades to a single
controlled region on narrow screens.

No new shared component is justified by this proposed package. Any gap discovered during delivery
must be audited separately before adding a primitive to `@loopdev/ui`.
