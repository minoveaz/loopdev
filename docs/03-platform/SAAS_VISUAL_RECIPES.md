---
title: SaaS visual recipes
status: phase-0-proposed-contract
owner: platform
reviewed_at: 2026-08-14
---

# SaaS visual recipes

Recipes combine an existing `SuiteCanvas` structural mode with approved
surfaces, density, states and interaction rules. A recipe is not a new Canvas
mode and must not create a suite-specific shell.

## Canonical surface taxonomy

| Surface | Purpose | Default treatment | Restrictions |
| --- | --- | --- | --- |
| `canvas` | Page-level working area | `--lpd-shell-canvas`, plain background | Owns page scroll and global context |
| `surface` | Standard panel/card | `--lpd-shell-surface`, flat border | Primary data container |
| `elevated` | Inspector, focused panel | elevated background and depth | Use sparingly; must preserve hierarchy |
| `overlay` | Dialog, portal, transient menu | overlay depth and strong contrast | Never changes layout dimensions |
| `glass` | Focused immersive treatment | translucent surface with backdrop blur | Requires contrast and performance evidence |

## Background variants

| Variant | Approved use | Default density |
| --- | --- | --- |
| `plain` | Tables, forms, dense operational data | any |
| `subtle-grid` | Canvas, dashboard header, empty state | comfortable |
| `technical-grid` | Technical board or approved workflow | comfortable |
| `dot-grid` | Neural/visual monitoring context | comfortable |
| `immersive` | Full-bleed workflow with explicit approval | comfortable |

Technical backgrounds are decorative context. They must never reduce table
legibility, replace a state treatment or carry meaning that is only visual.

## Surface appearance contract

Surface appearance is configured through `TechnicalSurface`; recipes must not
recreate its background, border or radius rules with local CSS. The approved
defaults are:

| Concern | Contract | Default |
| --- | --- | --- |
| Radius | `none`, `sm`, `md`, `lg`, `xl` | `xl` for backwards compatibility |
| Border tone | `subtle`, `technical`, `strong` | `subtle` |
| Border width | `thin`, `medium` | `thin` |
| Grid | `withGrid` boolean | `false` |

Use `withGrid` only for canvas, dashboard, technical board or approved
immersive workflow context. Standard surfaces, tables, forms, panels and
feedback states remain plain unless a certification fixture records an
exception. Radius communicates hierarchy: structural canvases stay near-square,
working surfaces use moderate rounding, overlays use stronger rounding, and
badges use their own full-radius component treatment.

## Surface stacking and nesting rules

Surface combinations must declare and visibly preserve their depth order. A
child surface must not be visually indistinguishable from its parent.

Canonical order:

```text
canvas
  -> surface
    -> elevated
      -> overlay
```

Rules:

- Each nested layer must differ through at least two signals from its parent:
  background, border, shadow, opacity or blur.
- `canvas` must retain visible inset space or a boundary when used as the outer
  layer of a certification example; it must not disappear into the page background.
- `surface` is the default content container and should not be nested merely for
  decoration.
- `elevated` must use a stronger depth signal than `surface`.
- `overlay` must use a stronger boundary and shadow than `elevated` and must not
  change layout dimensions.
- `glass` is an effect applied to an approved layer, not a replacement for the
  depth order; it requires a visible border and contrast evidence.
- Never rely on color alone to communicate depth.
- Never allow a child and parent to resolve to the same effective background,
  border and shadow treatment.
- Certification fixtures must show the layer name and the complete nesting path.

Minimum evidence for a new combination:

```text
parent layer visible
child layer visible
two or more depth signals differ
text and border contrast pass in light and dark
no accidental overflow or clipping
```

If a combination cannot meet these rules, record an exception with owner,
rationale, approval, review date and removal plan before using it in a product view.

## Recipe catalog

| Recipe | Canvas mode | Regions | Surface sequence | Default background | Density |
| --- | --- | --- | --- | --- | --- |
| `SuiteOverview` | `overview` | header, toolbar, content | canvas → surface | subtle-grid | comfortable |
| `DataWorkspace` | `data` | header, filters, table, pagination | canvas → surface | plain | compact |
| `SplitWorkspace` | `split` | list, divider, detail | canvas → surface → elevated | plain | compact |
| `RecordWorkspace` | `workspace` | header, tabs, record, inspector | canvas → surface → elevated | plain | comfortable |
| `BoardWorkspace` | `board` | header, toolbar, board | canvas → surface | technical-grid only when approved | comfortable |
| `ImmersiveWorkflow` | `full-bleed` | bounded workflow, actions | canvas → surface/overlay | immersive | comfortable |
| `CreativeEditor` | `full-bleed` | context assets, stage, transport, timeline, inspector | canvas → surface/overlay | plain or immersive | comfortable |

## Required recipe contract

Every consumer must declare:

- Canvas mode and recipe;
- regions and ownership;
- surfaces and background variant;
- density and spacing;
- loading, empty, error, forbidden, read-only and offline states;
- responsive transformation;
- keyboard/focus behavior;
- permission requirements and active-route fallback;
- localization and data-formatting needs;
- telemetry and performance constraints.

## Production content versus showcase labels

Architectural markers such as `{PlatformHeader}`, `{SuiteCanvas}` and
`{ModuleContextSidebar}` are inspection aids for `shell-showcase` only. They
must not appear in production module views or user-facing recipe content.

Production views use functional labels and semantic design tokens:

- Use the real content name, such as `Media Library`, as the visible heading.
- Use semantic typography and color utilities from the platform token system.
- Do not introduce local font scales, arbitrary color values or technical zone
  names as user-facing copy.
- Keep zone ownership in the shell configuration and keep content ownership in
  the module or recipe.

The showcase may display an architectural marker beside a functional label so
design and platform reviews can map the rendered area back to its contract.

## Governance

- A new recipe requires a platform-owned contract and reference composition.
- A suite may add an accent or domain component, but not a new surface taxonomy.
- A local CSS background is an exception and must include approval evidence.
- Recipes are reviewed for contrast, reduced motion, responsive behavior and
  portal/focus interaction before promotion.
