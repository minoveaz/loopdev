---
title: SaaS reference compositions
status: phase-1-reference-baseline
owner: platform
reviewed_at: 2026-08-14
---

# SaaS reference compositions

The supplied reference screenshots confirm that LoopDev should support many
compositions while keeping a stable shell and a small number of layout
recipes. These are pattern references, not instructions to copy another
product's branding or visual assets.

## Repeated patterns

### 1. Persistent platform shell

- Global identity and tenant/context switcher remain stable.
- Suite navigation is persistent and permission-filtered.
- Utility actions (search, help, notifications, account) remain predictable.
- The main workspace changes without rebuilding the shell.

### 2. Context header

- Breadcrumb/context line.
- Resource or workspace title.
- Status badge and key metadata.
- Primary action and secondary utility actions.
- Optional time range, environment or filter control.

### 3. Overview composition

Use `SuiteOverview` for:

- a summary block;
- health/status or KPI cards;
- recent activity;
- quick actions;
- an optional visual canvas/diagram;
- a lower metrics or activity grid.

The overview must support variable card counts without changing the shell
geometry. Cards should be semantic children of a shared grid, not hardcoded
screen coordinates.

### 4. Data/log composition

Use `DataWorkspace` for:

- page title and context;
- search/filter toolbar;
- saved views or time range;
- result count and status summary;
- table/list with row actions;
- pagination or cursor loading.

Dense data defaults to a plain canvas and uses technical grids only in bounded
empty, header or monitoring regions.

### 5. Split list/detail composition

Use `SplitWorkspace` for:

- persistent result list;
- selected item state;
- detail panel;
- URL-backed selection;
- responsive conversion to list then detail on small screens.

### 6. Board/diagram composition

Use `BoardWorkspace` for:

- bounded board or diagram canvas;
- zoom/fit and view controls;
- keyboard alternative to drag interactions;
- contextual cards or nodes;
- a lower or side metrics strip.

Technical grids are appropriate only when they improve spatial orientation.

## Composition rules

1. Structure is chosen by Canvas mode; appearance by a visual recipe.
2. Regions are optional slots, not arbitrary page-level divs.
3. Content can vary; spacing, hierarchy, states and interaction contracts do
   not vary without an explicit recipe variant.
4. Every composition must degrade to a usable empty/error/forbidden state.
5. The shell never becomes part of a suite-specific composition.
6. Cards, lists and panels must use shared surfaces and tokenized spacing.
7. Visual density is chosen by data complexity, not by suite preference.

## Reference set for implementation

The next reference compositions should be implemented as neutral showcase
fixtures, not domain screens:

- `SuiteOverview`;
- `DataWorkspace`;
- `SplitWorkspace`;
- `RecordWorkspace`;
- `BoardWorkspace`;
- `ImmersiveWorkflow`.

Each fixture should demonstrate optional regions, all required states and
responsive transformations before CRM adopts the recipe.
