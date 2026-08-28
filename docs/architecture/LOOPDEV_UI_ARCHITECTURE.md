---
title: LoopDev UI architecture
status: approved
owner: platform
reviewed_at: 2026-08-15
---

# LoopDev UI architecture

LoopDev uses a **contract-driven composable Shell** at the platform level and
domain-oriented UI inside each suite. The combination is:

```text
Platform contracts
  -> AppShell / SuiteShell / SuiteRuntime / SuiteCanvas
  -> registered composition recipes
  -> suite and domain components
  -> feature-sliced module UI
```

## Platform layer

Platform owns the reusable Shell, its contracts, layout recipes, slots,
navigation, access presentation and validation. Suites must configure the
platform Shell; they must not replace its primitives.

The primary inputs are:

- `SuiteConfig`: identity, navigation and access map.
- `NavigationSchema`: groups, modules, routes and stable priorities.
- `AccessMap`: visible access states for modules.
- `ViewComposition`: recipe, grid, regions, slots and responsive placement.

The authoritative implementation guidance is the
[`platform-shell` skill](../../.github/skills/platform-shell/SKILL.md). The
contract definitions live in
[`packages/contracts/src/platform`](../../packages/contracts/src/platform).

## Composition layer

`SuiteCanvas` renders module content through registered recipes. A module must
choose the canonical recipe that matches its interaction model:

| Intent | Recipe |
| --- | --- |
| Summary or dashboard | `SuiteOverview` |
| Table, filters and pagination | `DataWorkspace` |
| List plus detail | `SplitWorkspace` |
| Entity detail | `RecordWorkspace` |
| Pipeline or Kanban | `BoardWorkspace` |
| Focused creation or workflow | `ImmersiveWorkflow` |

Platform owns the recipe, slot and component registry. Suites declare the
composition and provide domain components. Pixel coordinates and arbitrary JSX
inside the navigation schema are not allowed.

See the [SaaS composition contract](../03-platform/SAAS_COMPOSITION_CONTRACT.md)
and the [approved SuiteRuntime/SuiteCanvas ADR](ADR-2026-08-13-suite-runtime-suite-canvas-fsd.md).

## Domain layer

Feature-sliced or domain-oriented structure organizes the content rendered
inside the Canvas:

```text
route -> SuiteRuntime / SuiteCanvas -> widgets -> features -> entities -> shared
```

The Shell must not import domain slices. Widgets compose features and entities;
features act through approved contracts and application APIs.

For CRM, examples include `ContactTable`, `ContactFilters`, `ContactRecord`,
`ActivityTimeline` and `PipelineBoard`. These are CRM-owned components mounted
inside platform-owned recipes; they do not become new Shell primitives.

## Ownership boundaries

| Layer | Owns | Must not own |
| --- | --- | --- |
| Platform Shell | layout, navigation, Canvas modes, slots, access presentation | CRM entities or business rules |
| UI foundation | reusable visual primitives, widgets, states and compositions | persistence or server authorization |
| Domain module | entities, features, widgets and view models | parallel Shell primitives |
| Shared foundation | contracts, RLS, permissions, pagination, audit and persistence | arbitrary module layout |

## Change rule

Before creating a component, follow the component-development inventory,
reference, duplicate-review and registry workflow. Before composing a module,
identify its Shell recipe and required zones. Before changing a platform contract,
update the relevant ADR, contract tests and platform-shell guidance.