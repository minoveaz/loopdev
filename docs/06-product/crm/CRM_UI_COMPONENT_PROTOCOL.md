---
title: CRM UI component protocol
status: approved-for-foundation
owner: crm
reviewed_at: 2026-08-15
---

# CRM UI component protocol

This protocol defines how CRM UI components are classified, designed, created,
audited and promoted on top of the LoopDev composable Shell.

## Architectural position

CRM components render inside a platform-owned `SuiteCanvas` composition. They
must not replace or extend the Shell with private headers, sidebars, rails or
navigation primitives.

```text
SuiteRuntime + SuiteCanvas
  -> registered recipe and slot
  -> CRM widget
  -> CRM feature/entity components
  -> shared or domain view model
```

The platform owns layout recipes, slots, responsive behavior and Shell
contracts. CRM owns domain semantics, view models and module compositions.

The visual source of truth is not this document alone. Apply the documents in
this order:

1. [Visual Composition System](../../01-foundations/VISUAL_COMPOSITION_SYSTEM.md)
   for visual foundations and non-negotiable principles.
2. [Component Composition Protocol](../../02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md)
   for the component lifecycle, structure, tokens and quality gates.
3. [SaaS visual recipes](../../03-platform/SAAS_VISUAL_RECIPES.md) for Canvas
   recipes, surfaces, depth and density.
4. This protocol for CRM ownership, domain contracts and CRM-specific examples.

When two rules appear to conflict, do not solve the conflict inside a CRM
component. Record it as a platform/design-system decision and use the existing
token or recipe until that decision is resolved.

## Shared visual grammar

All CRM views must look like members of the same product because they share a
small set of visible invariants:

| Concern | Standard | CRM rule |
| --- | --- | --- |
| Page structure | registered Canvas recipe | choose recipe before JSX |
| Regions | recipe-defined slots | header, toolbar, content and contextual zones keep stable ownership |
| Surfaces | `TechnicalSurface` and visual recipes | no local panel/card CSS |
| Spacing | 4px base grid and token scale | use `--lpd-space-*`; do not invent local values |
| Typography | Inter for UI, JetBrains Mono for technical data | use tokenized type styles |
| Color | semantic role tokens | no hex, RGB or domain-specific ad hoc colors |
| Borders/radius | recipe and surface contract | no per-screen radius or shadow interpretation |
| Density | `compact`, `comfortable` or `spacious` | declare one density per region |
| States | common loading/empty/error/forbidden/read-only patterns | use shared state components and copy conventions |
| Responsive behavior | semantic transformations | preserve critical actions and information hierarchy |
| Motion/focus | functional motion and shared focus ring | respect reduced motion and keyboard navigation |

Visual consistency therefore comes from shared constraints, not from making
every CRM component identical. A contact table, a pipeline board and a record
header can have different compositions while still sharing the same tokens,
surface hierarchy, typography, states and interaction language.

## Standard screen anatomy

Unless the selected recipe explicitly changes it, a CRM screen follows this
anatomy:

```text
SuiteCanvas recipe
  -> page heading and context
  -> primary actions / toolbar
  -> filters or view controls
  -> main domain content
  -> contextual detail or inspector when applicable
  -> pagination, continuation or status feedback
```

Each region must have one owner and one visual responsibility. Do not place
business actions inside a decorative header, put filters inside table rows, or
use a widget to recreate a Shell region.

## Visual acceptance checklist

Before a CRM component or screen is accepted, verify:

- the selected recipe and regions are documented;
- the same component renders with the approved light and dark tokens;
- no local color, font size, spacing, border, radius or shadow values bypass
  the Design System;
- surface nesting follows `canvas -> surface -> elevated -> overlay`;
- density is intentional and consistent across sibling regions;
- the component has the shared loading, empty, error and access states that
  apply to its role;
- the responsive view transforms structure instead of merely shrinking it;
- keyboard focus, contrast and reduced-motion behavior are checked;
- a fixture or screenshot makes the visual contract reviewable.

## Component classes

| Class | Responsibility | Canonical location |
| --- | --- | --- |
| Platform primitive | Agnostic visual or interaction primitive | `ds/packages/ui/src/components/atoms` |
| Platform composite | Reusable composition with no CRM rule | `ds/packages/ui/src/components/composites` |
| CRM shared UI | CRM-wide visual utility without one entity rule | CRM `shared/` |
| CRM entity | Entity representation and local entity state | CRM `entities/` |
| CRM feature | User action or business flow | CRM `features/` |
| CRM widget | Section-level composition for a Canvas region | CRM `widgets/` |

Use the narrowest ownership layer. A CRM noun alone does not justify a new
platform component or a duplicate visual pattern.

## Public component contract

Every component must define an explicit public contract in `types.ts` or an
equivalent typed boundary. The contract should make these dimensions visible:

- required data and stable identifiers;
- callbacks and user actions;
- permitted slots or child content;
- loading, empty, error, forbidden and disabled states;
- responsive behavior and density where relevant;
- keyboard and focus behavior;
- theme/token inputs, never tenant-specific hardcoded colors;
- test fixtures and intended consumers.

Avoid leaking persistence clients, router internals or server authorization
details into presentational components. Pass capabilities and view models from
the owning feature or runtime boundary.

## Composition contract

Each CRM view must choose a registered recipe before components are created:

| CRM intent | Canvas recipe | Typical regions |
| --- | --- | --- |
| Contact or lead list | `DataWorkspace` | filters, content, pagination |
| Entity detail | `RecordWorkspace` | header, record, tabs, activity |
| List plus detail | `SplitWorkspace` | toolbar, list, detail |
| Pipeline | `BoardWorkspace` | toolbar, board, metrics |
| Create or focused workflow | `ImmersiveWorkflow` | workflow, actions, status |

Widgets must map to registered slots. They must not rely on arbitrary pixel
coordinates or invent a layout mode.

## Required states and evidence

The applicable states must be represented in fixtures and tests. At minimum,
review the state matrix for:

- loading or skeleton;
- empty result;
- recoverable error;
- forbidden or read-only access;
- disabled action;
- success or committed feedback;
- keyboard focus and responsive transformation.

Every new component needs ownership, intended consumers, references reviewed,
duplicate-review decision, tests, documentation and registry evidence. A
component stays CRM-owned until a second real suite consumer and an agnostic
contract justify promotion to `@loopdev/ui`.

## Creation workflow

```text
Inventory
  -> reference discovery
  -> duplicate review
  -> reuse / variant / compose / create decision
  -> ownership route
  -> typed contract and fixtures
  -> implementation
  -> focused tests
  -> registry entry
  -> validation and handoff
```

Creation is blocked when reference discovery or duplicate review is incomplete.
The active track must record rejected alternatives and why reuse, a variant or
composition was insufficient.

## CRM boundary

This protocol permits UI contracts, fixtures and compositions before data
integration. It does not authorize inventing persistence, RLS, server
capabilities, activity storage or Notes behavior. Those belong to the shared
CRM foundation and must enter UI through approved contracts and fixtures.