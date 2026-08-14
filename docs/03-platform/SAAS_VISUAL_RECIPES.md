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

## Recipe catalog

| Recipe | Canvas mode | Regions | Surface sequence | Default background | Density |
| --- | --- | --- | --- | --- | --- |
| `SuiteOverview` | `overview` | header, toolbar, content | canvas → surface | subtle-grid | comfortable |
| `DataWorkspace` | `data` | header, filters, table, pagination | canvas → surface | plain | compact |
| `SplitWorkspace` | `split` | list, divider, detail | canvas → surface → elevated | plain | compact |
| `RecordWorkspace` | `workspace` | header, tabs, record, inspector | canvas → surface → elevated | plain | comfortable |
| `BoardWorkspace` | `board` | header, toolbar, board | canvas → surface | technical-grid only when approved | comfortable |
| `ImmersiveWorkflow` | `full-bleed` | bounded workflow, actions | canvas → surface/overlay | immersive | comfortable |
| `CreativeEditor` | `full-bleed` | toolbar, assets, stage, timeline, inspector | canvas → surface/overlay | plain or immersive | comfortable |

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

## Governance

- A new recipe requires a platform-owned contract and reference composition.
- A suite may add an accent or domain component, but not a new surface taxonomy.
- A local CSS background is an exception and must include approval evidence.
- Recipes are reviewed for contrast, reduced motion, responsive behavior and
  portal/focus interaction before promotion.
