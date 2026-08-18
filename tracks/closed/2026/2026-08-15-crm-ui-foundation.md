---
id: crm-ui-foundation
title: CRM UI foundation and composition
status: closed
created: 2026-08-15
updated: 2026-08-18
closed: 2026-08-18
owner: crm
lead: User
branch: feature/crm-ui-foundation
branches: []
phase: 1
pull_requests: [108]
issues: [69]
packages: []
release: not-required
areas: [crm, platform]
dependencies: [crm-component-inventory, platform-shell-mode-inventory]
blocked_by: []
supersedes: []
---

# CRM UI foundation and composition

## Estado actual del track

**Fase cerrada:** `Phase 1 — reusable UI foundation`
**Estado:** `closed / visual, responsive and accessibility gates certified`
**Último cierre:** certificación de las cinco composiciones CRM de datos
(`EntityTable`, `DenseOperationalTable`, `QuantitativeTable`, `ActivityTable` y
`SelectionTable`).
**Siguiente gate:** completar las brechas CRM explícitas antes de la entrada en
Phase 2; el contrato de navegación móvil y geometría del Shell ya está cerrado.

La certificación de tablas y de las composiciones responsive cierra el alcance de este track.
Las composiciones posteriores de CRM y la entrada en Phase 2 pertenecen a los tracks de módulos y
siguen bloqueadas por G0; no forman parte de esta foundation.

### Actualización 2026-08-18: shell y panel contextual de plataforma

Se completó la revisión de regresiones de la superficie compartida que consume
CRM: `AppShell`, `SuiteShell`, `SuiteRuntime`, `SuiteCanvas`,
`ModuleContextSidebar`, `ModuleContextPanel`, `ModuleHeader`, `ModuleToolbar`,
`SuiteSidebar` y `PlatformHeader`. El panel contextual global queda unificado
con un único nombre e implementación: `PlatformContextPanel`, montado mediante
`AppShell.contextSlot`.

La revisión añadió y verificó:

- ownership único de geometría, backdrop, prioridad, foco y responsive en
  `AppShell`;
- ausencia de API desktop para inyectar identidad o acciones en `SidebarFooter`;
- rutas E2E de avatar -> perfil en `shell-showcase` y
  `composition-showcase`;
- cobertura Axe para `ModuleHeader`, `ModuleToolbar` y
  `PlatformContextPanel`;
- contratos documentales para no montar paneles globales page-owned ni un
  segundo overlay manager;
- rename físico, tipado y export público de `GlobalContextPanel` a
  `PlatformContextPanel`, sin alias duplicado.

**Evidencia local:** los nueve grupos de componentes del shell pasan `92/92`
tests; `scripts/check-shell.mjs` pasa `39/39` tests funcionales. El check
global de tipos mantiene cuatro errores preexistentes en `Select` y
`SuiteSidebar`, fuera del alcance de este slice.

**Certificación browser 2026-08-18:** la matriz Playwright de
`shell-showcase` y `composition-showcase` pasa `19/19` en desktop, mobile y
mobile-compact. Quedan cubiertos overflow horizontal, breakpoint de
navegación, modos de canvas, panel contextual, foco y estados de composición.
La fase de geometría del Shell queda certificada; este track CRM no se marca
completo porque conserva trabajo de estandarización profunda de
`ActivityTable` y composiciones posteriores.

**Cierre de la entrega publicada:** PR #108 fue mergeado en `develop` el
2026-08-18 mediante `76e9a340`. Este merge certifica la foundation UI y la
superficie responsive; no certifica persistencia CRM, RLS, aislamiento tenant,
staging ni UAT. El track permanece activo para las composiciones posteriores.

## Outcome

Define and implement the reusable UI foundation and view compositions required
by the CRM pilot on top of the validated LoopDev Shell and SuiteCanvas
contracts.

The governing architecture is documented in the
[LoopDev UI architecture guide](../../../docs/architecture/LOOPDEV_UI_ARCHITECTURE.md).
The component-specific rules are defined in the
[CRM UI component protocol](../../../docs/06-product/crm/CRM_UI_COMPONENT_PROTOCOL.md).

## Context

The CRM component inventory and the platform Shell/SuiteCanvas contracts are
the starting boundary for this track. Before implementation, the inventory,
registry, visual rules and current UI code must be reconciled so that the track
distinguishes the target architecture from legacy behavior.

## Included

- Audit existing UI components against Shell, SuiteRuntime and SuiteCanvas.
- Apply the CRM UI component protocol before classifying or creating components.
- Implement reusable CRM UI primitives and widgets.
- Define compositions for `data`, `record`, `split`, `board` and `focus` views.
- Define loading, empty, error, forbidden and responsive states.
- Define accessibility and keyboard behavior for CRM compositions.
- Produce typed view-model boundaries and fixtures for later CRM modules.
- Register components only when their reuse and ownership are evidenced.

## Excluded

- CRM persistence contracts, RLS, capabilities and server authorization.
- Notes, activity read models and audit persistence.
- Production route wiring for Contacts, Leads, Pipeline or Tasks.
- Tenant-specific navigation rules.
- Changes to Shell or SuiteCanvas contracts.
- Final data-bound module behavior before `crm-shared-foundation` fixtures are
  available.

## Fases

### Phase 0A: alignment baseline

Before auditing CRM components or creating new ones, complete this eight-point
alignment baseline:

1. Add a `Current implementation status` section to the component protocol,
   separating `target`, `implemented`, `legacy` and `migration required`.
2. Reconcile the visual-document versions, especially the `v3.8`/`v3.9`
   inconsistency in `VISUAL_COMPOSITION_SYSTEM` and its references.
3. Reconcile the physical UI component inventory with
   `docs/registries/frontend-components.json`, documenting components that are
   legacy, product-specific, excluded or missing from the registry.
4. Correct certification/status claims when contracts, tests, documentation or
   visual evidence are missing; `stable` and `certified` must be evidence-based.
5. Separate valid technical exceptions from visual violations, and define the
   migration policy for inline styles, hardcoded colors and local visual rules.
6. Map current components to the actual Shell/SuiteCanvas paths and recipes,
   identifying the legacy `ModuleWorkspace`/suite-home path versus the current
   `SuiteCanvas` composition path.
7. Define which visual behavior is enforced by runtime/components and which is
   only documented as a contract, especially surfaces, density, states and
   responsive transformations.
8. Produce a component alignment matrix covering ownership, consumers, recipe,
   tokens, states, responsive behavior, visual debt and destination.

The baseline is complete only when the matrix and the documented exceptions
are reviewed and the resulting gaps are assigned to reuse, adaptation,
replacement, retirement or platform follow-up.

### Phase 0A result

The initial alignment baseline is documented in the
[component alignment matrix](../../../docs/02-frontend/COMPONENT_ALIGNMENT_MATRIX.md).
It confirms the current component families, the registry gap, the legacy
`ModuleWorkspace`/suite-home path and the current `SuiteCanvas` path. The
physical-to-registry reconciliation is now complete: unregistered physical
components and stale registry-only paths have explicit destinations in the
matrix. This closes the Phase 0A alignment gap; registry promotion,
certification and platform cleanup remain follow-up work and do not reopen the
baseline.

### Phase 0B: scope and audit

- Map inventory entries to atoms, widgets, features and entities.
- Identify legacy components to reuse, adapt or retire.
- Confirm each CRM composition against the validated Shell modes.
- Audit the reusable foundation block: `Typography`, `Heading`, `LpdText`,
  `Icon`, `Divider`, `ScrollArea`, `TechnicalSurface` and `TechnicalTooltip`.
- Audit the control block: `Button`, `IconButton`, `Input`, `Select`,
  `FilterDropdown`, `CommandBarTrigger` and `TrailingControl`.
- Audit the state and feedback block: `EmptyState`, `LoadingState`, `Skeleton`,
  `Toast`, `Spinner`, `SystemStatus` and `TechnicalStatusBadge`.
- Audit the data block: `ResponsiveTable`, `KanbanBoard`, `MetricCard`,
  `ActivityFeed` and any selection/bulk-action primitive.
- Audit the orientation block: `IndustrialBreadcrumbs` and `ContextPath`,
  selecting one canonical internal-orientation contract.
- Audit the surface/overlay block: `TechnicalDialog`, `TechnicalDropdown`,
  `TechnicalMenuItem` and `TechnicalTooltip`, including focus and portal rules.
- Audit identity/status primitives: `UserAvatar`, `Badge`, `TechnicalLabel` and
  `TechnicalStatusBadge`, preventing overlapping status semantics.
- Record excluded references explicitly: `trading/*`, `ModuleWorkspace`,
  `ModuleHeader`, `ModuleToolbar`, `SuiteHomeLayout` and `ModuleCard`.

For every audited candidate, record ownership, consumers, typed contract,
tokens, states, accessibility, responsive behavior, recipe compatibility,
duplicate review, evidence gaps and destination in the alignment matrix.
Audit order is foundation, controls, states, data, orientation, overlays and
identity. A block is not reusable for CRM until its applicable states and
evidence are reviewed.

### Phase 0B result and closure

- Reuse `SuiteCanvas`, Shell slots and `TechnicalSurface` as platform boundaries.
- Audit `PageHeader`, `SectionHeader` and `ResponsiveTable` before CRM adoption.
- Adapt `TechnicalCard` before using it as a CRM surface.
- Reuse `PageHeader` and `SectionHeader` only as content regions inside a
  selected recipe; they must not recreate Shell ownership.
- Adapt `ResponsiveTable` with loading, error, forbidden, read-only, selection
  and semantic mobile states before using it for CRM data views.
- Treat `TechnicalSurface` as the only surface boundary; document its existing
  texture and hover exceptions before adding CRM visual variants.
- Exclude `ModuleWorkspace`, `ModuleHeader`, `ModuleToolbar`, `SuiteHomeLayout`
  and `ModuleCard` from CRM. They have active non-CRM consumers, so physical
  archiving belongs to a separate platform migration and must not be done from
  this CRM track.
- Exclude product-specific `trading` components from CRM precedent.
- Do not create CRM components until the selected reuse candidates pass their
  focused contract, state, responsive and visual evidence review.
- The seven-block audit is complete as a scope and ownership decision and is
  recorded in the [component alignment matrix](../../../docs/02-frontend/COMPONENT_ALIGNMENT_MATRIX.md).
- No block is rejected wholesale; each block has a Phase 1 handoff, while CRM
  adoption remains gated per candidate by contract, state, accessibility,
  responsive and visual evidence.
- The first Phase 1 slice is foundations, controls and states. Data recipes
  remain blocked until `ResponsiveTable` and `KanbanBoard` gaps are resolved.

**Phase 0B status: complete as audit baseline.** Component certification and
CRM adoption are intentionally not implied by this closure; they are Phase 1
implementation and evidence gates.

### Phase 1A: TechnicalSurface and TechnicalCard design audit

**Audit status: re-audit complete; the three shared components are certified for their current contracts.**

This audit applies the component-development design process to the shared
surface foundation. `TechnicalSurface` is the primary subject, `TechnicalCard`
is the dependent composition, and `SuiteCanvas` is the owning composition
boundary. The audit does not approve new CRM-specific surface variants.

#### 1. Current-state inventory

| Component          | Ownership                               | Current consumers                                                                           | Current evidence                                                                               | Finding                                                                            |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `TechnicalSurface` | Shared atom: `atoms/surfaces`           | `DataTable`, shell/sidebar, dialogs, visualizations, utilities and legacy/trading consumers | Public types, focused tests and README exist; cross-suite visual evidence is incomplete        | Keep as the only shared surface boundary; document or remove visual exceptions     |
| `TechnicalCard`    | Shared atom wrapping `TechnicalSurface` | Legacy workspace cards, suite-home cards and other card-like consumers                      | Public types and focused tests exist; variant semantics and responsive evidence are incomplete | Keep as a thin wrapper; adapt variants without adding a second surface system      |
| `SuiteCanvas`      | Workspace composition boundary          | Suite runtime and composition showcase recipes                                              | Mode/geometry types and focused tests exist                                                    | Keep as the canvas owner; surface components must not recreate its canvas or slots |

Current `TechnicalSurface` owns variant, depth, radius, border, border width,
interaction and overflow classes. It also renders an optional grid layer, an
optional hover aura and a relative content layer. The current implementation
uses token-like Tailwind classes but still contains undocumented texture,
blur, opacity, shadow and interaction choices. It forwards only click and
mouse-enter/leave behavior rather than the complete `HTMLAttributes` event
contract.

Current `TechnicalCard` delegates the boundary to `TechnicalSurface`, but its
`flat`, `interactive`, `warning` and `disabled` variants mix surface state,
semantic status and interaction policy. `warning` currently contributes a
non-token class and `disabled` removes pointer events without declaring an
accessible disabled/read-only contract.

#### 2. Cross-platform contract

- Supported consumers use pointer, touch and keyboard input; a static surface
  must remain a neutral container and an interactive surface must expose a
  keyboard-operable contract when it is actionable.
- Surface geometry must be stable across overview, data, workspace, split,
  board and full-bleed canvas modes. Overflow belongs to the component that
  owns the content boundary, not to an arbitrary parent card.
- `TechnicalSurface` owns visual surface tokens only: variant, depth, radius,
  border, density hooks and interaction affordance. It does not own domain
  status, permissions, selection, loading or business actions.
- `TechnicalCard` may express container-level interactive, disabled or
  read-only behavior, but must not encode CRM status, entity semantics or
  suite-specific copy.
- Theme and tenant changes must work through semantic tokens. No hardcoded
  colors, arbitrary shadows, blur values or local radii may be introduced in
  the CRM path without an explicit documented exception.
- Reduced motion must suppress non-essential transitions and aura effects.
- Focus must remain visible and distinct from hover, active context and
  selection. A visual surface must not imply clickability unless it is actually
  actionable.

#### 3. Suite boundary matrix

| Consumer         | May configure                                                          | Must not leak into shared surfaces                            |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| CRM              | recipe placement, density choice, entity content and permitted actions | CRM statuses, permissions, data fetching and route behavior   |
| Marketing Studio | editor/workspace composition and suite content                         | campaign rules, editor state semantics and local colors       |
| Operations       | operational content and suite-level density                            | operational permissions, alerts and domain status meanings    |
| `SuiteCanvas`    | mode, slots, geometry and canvas overflow                              | card variants, surface backgrounds and nested Shell ownership |

#### 4. Composition and visual standard

The canonical composition is:

```text
SuiteCanvas
└── transparent content composition
    └── TechnicalSurface or TechnicalCard
        └── content owned by the consuming recipe
```

`SuiteCanvas` owns `bg-shell-canvas`, mode geometry, slots and the primary
content overflow boundary. A transparent composition wrapper may establish
layout spacing, but it must not draw a border, background or shadow.
`TechnicalSurface` owns one surface plane. `TechnicalCard` may provide a
convenience composition over that plane, never a second outer surface.

Reading order is canvas context, content heading/actions, surface content and
contextual footer/actions. Depth and border communicate hierarchy; grid and
hover effects are optional only when they improve orientation and do not
compete with content. Nested outer cards, suite-local color classes, arbitrary
shadows, duplicated toolbar actions and showcase-only surface CSS are
prohibited.

#### 5. Functional UX model

| Capability           | User intent                     | Visual affordance                                             | Interaction                                              | States                                   | Accessibility                                                                     |
| -------------------- | ------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Static surface       | Read grouped content            | Stable plane with semantic border/depth                       | Pointer and keyboard pass through to content             | normal, loading, empty, error, read-only | No interactive role added by the surface                                          |
| Interactive card     | Open or act on grouped content  | Hover/focus distinction and stable active affordance          | Pointer, keyboard and touch activate the declared action | normal, hover, focus, active, disabled   | Actionable element or explicit keyboard contract; visible focus                   |
| Disabled card        | Understand unavailable content  | Muted presentation without implying enabled action            | No activation                                            | disabled                                 | Disabled semantics belong to the actionable control; do not rely on opacity alone |
| Read-only card       | Inspect without mutation        | Normal readable surface with mutation actions absent/disabled | Navigation may remain available                          | read-only                                | Preserve reading and focus order; announce unavailable mutations where present    |
| Grid/aura decoration | Orient or reinforce interaction | Low-contrast texture or transient aura                        | No independent interaction                               | reduced-motion and theme variants        | Decorative layers are hidden from assistive technology                            |

#### 6. Decision record

| Concern            | Decision                                                                                           | Rejected alternative                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Surface ownership  | Keep `TechnicalSurface` as the single shared surface boundary                                      | Creating CRM-specific surface wrappers would duplicate tokens and ownership   |
| Card ownership     | Keep `TechnicalCard` as a thin composition over `TechnicalSurface`                                 | Replacing it with a second card implementation would fragment consumers       |
| `warning` variant  | Adapt to a semantic state/tone contract or move warning semantics to the consuming state component | Keep the current `border-strong` class; it is undocumented and not token-safe |
| `disabled` variant | Adapt with explicit actionable/read-only semantics; visual muting alone is insufficient            | Treat `pointer-events-none` and opacity as an accessibility contract          |
| `withGrid`         | Retain only as an explicit decorative option after token/theme/reduced-motion evidence             | Allow recipes to reproduce grid CSS locally                                   |
| `withHoverAura`    | Keep pending visual review; it is not part of the baseline CRM surface contract                    | Promote the aura as a default interaction treatment                           |
| HTML attributes    | Preserve the public DOM contract and forward supported attributes/events consistently              | Continue forwarding only a subset of `HTMLAttributes`                         |
| Suite boundary     | Keep canvas ownership in `SuiteCanvas`                                                             | Let cards recreate canvas background, geometry or Shell slots                 |

#### 6.1 Concrete action inventory

| Action    | Owner / location                                          | Current behavior                                                                                                                                              | Concrete change                                                                                                                                                                  | Acceptance evidence                                                                                 |
| --------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `keep`    | `SuiteCanvas` / workspace boundary                        | Owns canvas background, mode geometry, slots and content overflow                                                                                             | Preserve this ownership; do not move canvas visuals into surfaces or cards                                                                                                       | Existing mode/geometry tests plus overview, data and split fixture review                           |
| `keep`    | `TechnicalSurface` / public API                           | Provides shared variant, depth, radius, border and overflow controls                                                                                          | Preserve the API shape while documenting approved values and semantic roles                                                                                                      | Public type review and token mapping review                                                         |
| `correct` | `TechnicalSurface/index.tsx` and `useTechnicalSurface.ts` | Forwards only click and mouse enter/leave and drops other HTML attributes                                                                                     | Forward the supported DOM attributes and event contract consistently, preserving the internal content layer                                                                      | DOM attribute test, keyboard/pointer behavior and type review                                       |
| `adapt`   | `TechnicalSurface/types.ts` and implementation            | `interaction="interactive"` implies cursor and pointer scale but not a complete action contract                                                               | Define when interaction is visual-only versus actionable; require the consuming action to own keyboard semantics                                                                 | Focus/keyboard evidence and no false affordance review                                              |
| `compose` | `TechnicalSurface` grid layer and `TechnicalCanvas`       | `withGrid` renders its own inline gradient and fixed `20px` texture values, while `TechnicalCanvas` already provides a registered configurable grid primitive | Do not create a parallel `TechnicalGrid`; make `TechnicalCanvas` the canonical grid layer and have `TechnicalSurface withGrid` compose it with an explicit compatibility mapping | Shared primitive audit, token/contrast review, reduced-motion check and no-duplicate-rendering test |
| `defer`   | `TechnicalSurface` hover aura                             | `withHoverAura` adds a blur and primary-colored aura                                                                                                          | Do not promote to the CRM baseline; decide after visual evidence whether to retain, redesign or remove                                                                           | Explicit visual decision in showcase; unblock condition is fixture review                           |
| `remove`  | `TechnicalCard` warning variant                           | Adds undocumented `border-strong` class and mixes status with surface styling                                                                                 | Remove the local class behavior; move warning semantics to a status/state component or a tokenized surface contract                                                              | No hardcoded/local class audit and semantic status review                                           |
| `adapt`   | `TechnicalCard` disabled variant                          | Uses `pointer-events-none`, opacity and grayscale as the complete disabled behavior                                                                           | Separate disabled actionable semantics from read-only presentation; keep visual muting only as a consequence of the contract                                                     | Role/state accessibility review and keyboard test                                                   |
| `adapt`   | `TechnicalCard` interactive variant                       | Adds local hover border, shadow and active scale through inherited surface behavior                                                                           | Keep the convenience variant but map hover/focus/active to approved tokens and avoid duplicate surface effects                                                                   | Pointer/keyboard visual review and token audit                                                      |
| `compose` | `TechnicalCard` consumers                                 | Legacy cards may use the card as a generic status or product card                                                                                             | Keep domain/status content in the consuming recipe; use the card only for container composition                                                                                  | CRM/Marketing Studio/Operations portability review                                                  |
| `remove`  | CRM consumers and showcase fixtures                       | Recipes can add outer surfaces, local spacing or duplicate card styling around the shared components                                                          | Remove any duplicate outer surface or local visual override from CRM fixtures                                                                                                    | Showcase source review and visual no-nesting criterion                                              |
| `defer`   | Registry/documentation promotion                          | Components have partial tests and documentation but incomplete cross-suite evidence                                                                           | Do not mark certified or promote until all preceding actions have evidence                                                                                                       | Registry diff after contract, a11y, responsive and visual gates pass                                |

`TechnicalCanvas` is the canonical candidate for the technical grid action. It
is already implemented and registered, but its current contract still needs
an audit: the implementation contains hardcoded blueprint color/opacity,
inline background styles, an animation without explicit reduced-motion
handling and no focused test file. `SimpleLineChart` owns a chart-specific
plot grid and is outside this migration until its visualization audit proves
that it can consume the shared primitive without losing chart semantics.

The two deferred actions are intentional and bounded: the aura requires a
visual decision, and registry promotion waits for the implementation evidence.
Neither blocks contract work, but neither may be silently treated as complete.

#### 6.1.1 Technical grid re-audit snapshot

The implementation re-audit verifies the canonical grid composition:

| Action                                                       | Re-audit status | Evidence                                                                                 |
| ------------------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------- |
| `compose` `TechnicalCanvas` from `TechnicalSurface withGrid` | `verified`      | `TechnicalSurface.test.tsx`; no local grid renderer remains in `TechnicalSurface`        |
| Token-backed variant color and configurable geometry         | `verified`      | `TechnicalCanvas.test.tsx`; semantic variant color with `currentColor` renderer          |
| Decorative semantics and reduced motion                      | `verified`      | `TechnicalCanvas.test.tsx`; `aria-hidden` and `motion-reduce` classes                    |
| Focused primitive coverage                                   | `verified`      | 3 `TechnicalCanvas` tests and 6 `TechnicalSurface` tests pass                            |
| Theme, contrast and responsive visual evidence               | `verified`      | Approved light/dark showcase review across the supported split canvas                    |
| Registry certification update                                | `verified`      | `frontend-components.json` updated with dimensional certification and zero evidence gaps |

This snapshot is the completed implementation re-audit for `TechnicalCanvas`.
The component is certified for its current shared contract; new consumers,
states or responsibilities reopen the applicable audit gates.

#### 6.2 Required post-implementation re-audit

After implementing the actions above, Phase 1A must be audited again using the
same action inventory as its baseline. The re-audit must inspect the code diff,
public exports, fixtures, registry metadata and validation evidence, and assign
one status to every action:

| Status           | Meaning                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `verified`       | Contract and acceptance evidence are present                        |
| `partial`        | The behavior exists but evidence or part of the contract is missing |
| `failed`         | The action is absent or violates ownership/composition rules        |
| `still-deferred` | The bounded defer decision remains valid                            |

Phase 1A cannot be certified or promoted while any action is `partial` or
`failed`. The re-audit must also check for regressions in nested surfaces,
local styling, keyboard behavior, responsive overflow, theme portability and
future-suite compatibility. Unit tests alone are not sufficient for this gate.

#### 7. Implementation handoff

1. **Contract and tokens** — owner: `@loopdev/ui`; update `TechnicalSurface`
   types and token mappings; define approved variants, depth, radius, border,
   overflow and interaction semantics. Evidence: type-level API review and
   token audit.
2. **Primitive reuse** — owner: `@loopdev/ui`; keep `TechnicalCard` delegating
   to `TechnicalSurface`; remove non-token `warning` behavior and define the
   disabled/read-only distinction. Evidence: focused component tests.
3. **Structural composition** — owner: workspace/design-system; verify
   `SuiteCanvas` remains the only canvas boundary and transparent wrappers do
   not draw surfaces. Evidence: representative overview, data and split
   fixtures.
4. **States and interaction** — owner: `@loopdev/ui`; define static,
   interactive, disabled and read-only behavior, including focus and reduced
   motion. Evidence: keyboard and accessibility checks.
5. **Responsive behavior** — owner: workspace/design-system; verify stable
   geometry, overflow and surface readability across supported canvas modes.
   Evidence: desktop, narrow and mobile viewport review.
6. **Future consumers** — owner: platform; verify CRM, Marketing Studio and
   Operations can configure composition without leaking suite semantics.
   Evidence: fixture portability review.
7. **Promotion** — owner: track maintainer; update registry and documentation
   only after visual, functional, accessibility and responsive evidence exists.

#### 8. Showcase approval criteria

The audit is not visually approved yet. The declarative showcase fixture must
demonstrate static, interactive, disabled and read-only cards inside
`SuiteCanvas`, plus grid/aura and theme/reduced-motion cases where supported.
Approval requires clear surface hierarchy, no nested outer card, visible
keyboard focus, distinct hover versus active behavior, usable narrow layouts,
no overflow leaks and no local visual CSS in the fixture.

#### 8.1 TechnicalCard post-implementation re-audit

| Action                                               | Status     | Evidence                                                                                                 |
| ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| Keep `TechnicalSurface` as the only surface boundary | `verified` | `TechnicalCard/index.tsx` delegates all rendering to `TechnicalSurface`; no nested surface is introduced |
| Adapt interactive variant to shared surface behavior | `verified` | Local hover border/shadow removed; focused TechnicalCard tests pass                                      |
| Remove warning surface styling                       | `verified` | `warning` no longer emits `border-strong`; warning meaning is shown by consuming content                 |
| Adapt disabled semantics                             | `verified` | `aria-disabled="true"` and `opacity-60`; no `pointer-events-none` accessibility shortcut                 |
| Preserve read-only reading behavior                  | `verified` | Showcase fixture renders `aria-readonly="true"` with readable content and no mutation action             |
| Forward public DOM contract                          | `verified` | Attribute and keyboard-event forwarding test passes                                                      |
| Accessibility and test coverage                      | `verified` | 7 TechnicalCard tests pass, including Axe                                                                |
| Documentation and registry path                      | `verified` | TechnicalCard README is linked from `frontend-components.json`                                           |
| Light/dark visual hierarchy                          | `verified` | User-approved showcase review of all five states in light and dark themes                                |
| Responsive narrow-layout evidence                    | `verified` | Approved mobile review confirms stable card geometry, readable content and no overflow leak              |

#### 8.2 TechnicalSurface post-implementation re-audit

| Action                                                        | Status     | Evidence                                                                                          |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| Keep `TechnicalSurface` as the single shared surface boundary | `verified` | Public implementation and `TechnicalCard` delegation preserve one surface owner                   |
| Forward public DOM contract                                   | `verified` | Focused `TechnicalSurface` tests cover DOM attributes and interaction events                      |
| Preserve token-backed visual contract                         | `verified` | Variant, depth, radius, border and overflow use approved shared classes                           |
| Theme and responsive behavior                                 | `verified` | Approved light/dark and mobile showcase review confirms readable, stable surfaces                 |
| Accessibility and test coverage                               | `verified` | Focused surface tests pass with decorative layers excluded from assistive technology              |
| Grid composition ownership                                    | `verified` | `TechnicalCanvas` is the canonical decorative grid primitive; no duplicate local renderer remains |

#### 8.3 TechnicalCanvas post-implementation re-audit

| Action                                      | Status     | Evidence                                                                               |
| ------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| Own the technical grid composition          | `verified` | `TechnicalCanvas` provides the registered configurable grid primitive                  |
| Token-backed geometry and variants          | `verified` | Focused tests cover semantic color, configurable geometry and `currentColor` rendering |
| Decorative accessibility and reduced motion | `verified` | `aria-hidden` and `motion-reduce` behavior are covered by focused tests                |
| Theme, responsive and showcase evidence     | `verified` | Approved light/dark and mobile review confirms stable rendering without overflow leaks |
| Registry and documentation                  | `verified` | Registry entry, README, fixture and focused tests are present with no evidence gaps    |

`TechnicalCard` is implementation-certified for its current contract and
visually approved for the reviewed light/dark desktop fixture. Full registry
promotion remains deferred until responsive evidence is captured.

### Phase 1: reusable UI foundation

#### Registry consumption gate

The canonical frontend registry is the source of truth for approved shared and
CRM consumption. A component may be physically present and usable by legacy
code without being approved as a new CRM precedent.

For each Phase 1 candidate, the track must verify:

- a unique entry in `docs/registries/frontend-components.json`;
- lifecycle status compatible with the intended use;
- applicable certification for the component's consumer and contract;
- no unresolved evidence gap covering the requested behavior;
- implementation, public contract, documentation and validation paths that
  match the registry entry.

Missing registration blocks new shared/CRM consumption. Missing or stale
certification blocks promotion. Legacy exceptions must name the current
consumer, owner and migration destination and must not be copied into new
recipes.

Phase 0 is closed. Phase 1 starts with the following ordered work items; a
later item must not silently bypass the evidence gate of an earlier one:

8. **Contracts and tokens for `TechnicalSurface`**: define the approved
   surface variants, depth, radius, border, overflow, density and interaction
   contract. Keep dynamic layout styles as the only inline-style exception and
   remove undocumented visual behavior from the CRM path.
9. **Adapt `TechnicalCard`**: make it a thin surface composition with approved
   variants and explicit interactive, disabled and read-only behavior.
10. **Shared states**: align loading, empty, filtered-empty, error, forbidden,
    read-only and disabled states across the approved primitives.
11. **`PageHeader` and `SectionHeader`**: verify typed content/action slots and
    use them only inside recipes, never as Shell ownership.
12. **Filters and action surfaces**: adapt `FilterDropdown`, `IconButton`,
    `Input`, `Select`, `CommandBarTrigger` and `TrailingControl` for keyboard,
    focus, Escape and responsive transformation.
13. **`ResponsiveTable`**: add CRM states, selection/bulk-action semantics,
    density and a semantic mobile representation before `DataWorkspace` use.
14. **Fixtures**: add stable view-model fixtures for the approved foundation
    and state combinations without persistence or authorization behavior.
15. **Unit and accessibility tests**: cover contracts, keyboard behavior,
    focus, state transitions and semantic roles for the implemented slice.
16. **Responsive and visual validation**: validate supported Shell modes,
    density, reduced motion, overflow and mobile transformations.
17. **Registry and documentation**: record owners, consumers, evidence,
    status and destination only after the implementation and validation gates.

#### Phase 1 current gate

**Items 8, 9, 10 and 12: completed for the reviewed CRM contracts.**
`TechnicalSurface` has an explicit interaction contract and focused tests;
`TechnicalCard` delegates its surface boundary to it; the shared state and
control batch is certified; `FiltersActions` is certified for its reviewed web
contract; and `ResponsiveTable` is certified for its reviewed shared contract.
`DenseOperationalTable` has functional, Axe and responsive evidence, but its
visual certification is explicitly blocked until it is reviewed as a focused
operational data surface derived from the approved `EntityTable` visual
standard, without inheriting EntityTable's CRM filters or toolbar.
The current `DataWorkspace` fixture has a real search input, functional status
and plan filters, whole-row selection, and detail rendering through the
platform-owned `ModuleContextPanel`.

The `ResponsiveTable` follow-up is intentionally split into implementation UX
corrections and certification evidence. The corrections are:

- stop propagation from row actions so nested controls do not trigger
  `onRowClick`;
- expose `aria-readonly` for the read-only table contract rather than relying
  only on `data-readonly`;
- make the mobile header configurable instead of hardcoding `Record`,
  `Status` and `Actions`;
- provide a safe `onClearSelection` fallback so the clear action is not
  rendered as an ineffective control when no handler is supplied;
- reset or coordinate the current page after filtering, with ownership kept
  in `FiltersActions` or the consuming composition rather than inventing
  filter state inside the table primitive.

These corrections are now covered by the broader `ResponsiveTable` evidence:
column, sorting and pagination contracts; page-only versus all-results
selection semantics; row-action and row-click separation; offline, error,
forbidden, read-only and disabled states; `aria-sort`, mixed selection and
focus behavior; mobile transformation and overflow; plus documentation,
fixtures and executable evidence. Focused tests pass 19/19, source contracts
pass 12/12, and the EntityTable desktop/mobile/mobile-compact Playwright
matrix passes 21/21. Visual review approved the composed
`FiltersActions` + `ResponsiveTable` experience rendered by `EntityTable`.

### Repeatable component design process

No shared component should be redesigned by iterating directly in the
showcase. The following process is the reusable gate for CRM and future suite
consumers such as Marketing Studio and Operations. It applies to an existing,
new, legacy or partially implemented component. A `certified` status only
allows a stage to be skipped when current evidence explicitly covers the
requested change; a new consumer, state or responsibility reopens that stage.

#### Gate 1: identify and inventory

Record the component name and aliases, owner, route, current consumers,
certification status, requested user outcome and candidate ownership layer.
Inspect implementation, public types, hooks, exports, tests, registry entries,
fixtures and active documentation. Record what the component currently owns,
what it renders, what it delegates and all visible technical debt.

#### Gate 2: establish the cross-platform contract

Define behavior that must be consistent across suites and platforms:

- viewport classes, pointer, touch, keyboard and reduced-motion behavior;
- focus, semantics, labels, announcements and input modality;
- loading, empty, filtered-empty, error, forbidden, read-only, disabled and
  offline states where applicable;
- theme and tenant token requirements, contrast and color independence;
- stable geometry, overflow ownership and responsive transformation.

#### Gate 3: establish suite boundaries

Review the current suite and plausible future consumers. Separate shared
capabilities from suite composition, domain semantics, permissions, data shape
and suite-only visual treatment. A suite may compose or configure a shared
component, but must not leak business rules into `@loopdev/ui`.

#### Gate 4: identify the LoopDev composition standard

State the owning Shell/SuiteCanvas mode, reading order, planes, surfaces,
depth, spacing, density, typography and semantic color roles. Identify the
approved primitives and reference components. Define what must remain
transparent, what may own a `TechnicalSurface`, and what is prohibited:
nested outer cards, local theme colors, arbitrary shadows, duplicate controls
and showcase-only styling.

#### Gate 5: model the functional UX

For every capability, record the user intent, visual affordance, interaction,
states and accessibility behavior. Distinguish transient states such as hover
and focus from persistent states such as active context and selection. Include
future capabilities when they affect the public API or geometry.

#### Gate 6: decide the destination

For each current behavior and requested behavior, explicitly classify it as:

- keep because it already meets the contract;
- adapt with a backwards-compatible change;
- compose from existing primitives;
- extract or promote as a shared primitive/composite;
- move to suite, feature or entity ownership;
- remove or retire;
- pending user/design decision.

Record rejected alternatives and the reason. The result is a design decision,
not an implementation preference.

#### Gate 7: write the implementation handoff

Only after Gates 1–6 are reviewed, define the ordered work:

1. contracts and semantic tokens;
2. primitive reuse or extraction;
3. structural composition and surface ownership;
4. primary functionality;
5. state, interaction and accessibility behavior;
6. responsive and future-consumer behavior;
7. tests, registry and documentation evidence.

Each step must name its owner, affected layer, consumer impact and evidence.

#### Gate 8: implement and expose through showcase

Implement the shared component according to the handoff. Only then add or
update a declarative showcase fixture that exposes representative data,
states and interactions. The showcase must not own shared visual logic.

#### Gate 9: visual and functional approval

Review the rendered component as a user before promoting it. Confirm hierarchy,
composition, color semantics, hover/focus/active behavior, keyboard and pointer
flows, responsive transformation, loading/empty/error states, theme portability
and future-suite assumptions. If it fails, return to the relevant design gate;
do not patch the showcase or accumulate local CSS fixes.

#### Gate 10: certify or track remaining work

Mark the component certified only when the applicable contract, accessibility,
responsive, visual, consumer and registry evidence exists. Otherwise record
the remaining work and its owner in the track. Passing unit tests alone is not
certification.

### DataTable standardization track

The current `DataTable` slice is functionally reusable but is not yet a
LoopDev visual standard. The next work must be treated as a design-system and
interaction contract, not as isolated class-name tuning. The component must
retain the `SuiteCanvas` context while making its internal planes legible:

```text
SuiteCanvas
└── transparent composition wrapper
    ├── filter and search surface
    ├── Spacer
    └── data surface
        ├── contextual selection actions
        ├── table header
        ├── data rows
        ├── Spacer
        └── pagination actions
```

#### Ownership and layering

- `DataTable` owns search, filters, the transparent composition wrapper and the
  spacing between controls and data.
- `ResponsiveTable` owns table mechanics, header, rows, sorting, selection,
  states, mobile representation and pagination.
- `DataWorkspace` and showcase fixtures remain declarative consumers; they must
  not add table surfaces, local spacers or duplicate table styling.
- The root composition layer remains transparent so the `SuiteCanvas` canvas is
  visible around and between the internal surfaces.
- `TechnicalSurface` remains the only approved surface boundary. `Spacer` is a
  transparent layout primitive and must not draw a divider, border, background
  or shadow.
- The filter plane, data plane and pagination plane must be distinguishable by
  hierarchy and spacing without nesting a card around the complete table.

#### Color and visual hierarchy contract

The table must use LoopDev semantic tokens by role rather than treating the
primary color as generic decoration:

| Plane or state      | Required visual role                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| SuiteCanvas context | Preserve `bg-shell-canvas`; no outer table card                                            |
| Filter surface      | Control plane with clear grouping and no accidental border in the transparent gap          |
| Table header        | Dedicated technical band, stronger than rows, with mono metadata and explicit sort state   |
| Normal row          | Stable data surface with readable density and technical separators                         |
| Hover row           | Perceptible interaction tint without making every row look selected                        |
| Focus row           | Keyboard-visible focus ring using the approved ring/primary token                          |
| Active row          | Persistent selection tone, primary edge marker and contextual relationship to detail       |
| Status cell         | Semantic success, warning, danger, info or neutral tone; never one generic badge treatment |
| Pagination          | Operational footer plane with clear disabled, active and navigation states                 |

No hardcoded hex values, local theme assumptions or arbitrary shadows may be
introduced. Hover, focus and active states must remain distinguishable in light,
dark and tenant-themed tokens.

#### Interaction and state contract

The table must model these states independently:

- **Row active:** the contextual row used to open or maintain a detail panel.
- **Row selection:** one or more rows selected for bulk operations.
- **Row hover/focus:** transient pointer or keyboard affordance.
- **Sort state:** unsorted, ascending and descending column state.
- **Data state:** loading, empty, filtered-empty, error, forbidden, read-only
  and offline where the consuming recipe requires it.

Active-row and multi-selection state must not be conflated. A row may be the
contextual detail target without being selected for a bulk operation. When
multiple rows are selected, the contextual action bar must expose the selected
count and available bulk actions as a distinct operational plane.

Rows must support contextual actions through a typed shared contract:

- actions appear on row hover and remain available for the active row;
- actions are keyboard reachable and have accessible labels/tooltips;
- mobile transforms row actions into an accessible menu or equivalent compact
  representation;
- selection, active-row and action states remain legible without relying on
  color alone.

#### Data density and column patterns

The standard must define a default density and allow an explicit reviewed
override. Columns should support reusable semantic patterns rather than forcing
each consumer to hand-style cells:

- `identity`: primary label plus optional technical metadata;
- `status`: semantic status tone and accessible text;
- `metric`: numeric or count value with alignment rules;
- `timestamp`: compact technical date/time representation;
- `actions`: contextual row actions with stable width and responsive behavior.

The table must preserve stable column geometry, avoid layout shift on hover or
action reveal, and keep the 4px spacing grid. Mobile behavior must be a
semantic transformation, not merely horizontal overflow when the recipe needs
an inspectable row representation.

#### Implementation sequence and evidence gate

Before further visual implementation, review and record:

1. Existing LoopDev color tokens and their semantic status/interaction roles.
2. The independent active-row versus multi-selection contract.
3. The typed row-action and semantic-column APIs.
4. Header, hover, focus, selected-row and pagination visual states.
5. Density, stable geometry, overflow and mobile transformation behavior.
6. Light, dark and tenant-themed visual evidence for the complete table.

Only after this review should the shared component be split or expanded into
selection bar, table header, row-action and footer primitives. The showcase
then serves as declarative evidence of the shared contract, not as the owner of
its implementation.

### Phase 1 geometry contract

Recipe geometry is a platform decision, not a per-view styling preference. CRM
recipes must consume the existing `SuiteCanvas` mode and must not independently
invent page gutters, centering rules or full-bleed behavior.

| SuiteCanvas mode | Canonical geometry                 | Primary CRM consumers                  | Content rule                                                                                                                |
| ---------------- | ---------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `overview`       | centered, bounded                  | dashboard, Contacts overview           | constrained content width with responsive gutters                                                                           |
| `data`           | wide workspace with shared gutters | Contacts, Leads, Tasks lists           | table workspace uses the available canvas width and owns internal scrolling; page remains structured rather than full-bleed |
| `workspace`      | centered, bounded                  | Contact 360, Opportunity, Customer 360 | record content remains readable and bounded; panels own internal overflow                                                   |
| `split`          | split and adaptive                 | list/detail journeys                   | list and detail preserve their regions; mobile collapses to sequential content                                              |
| `board`          | wide bounded workspace             | Pipeline                               | use available width within gutters; board owns horizontal overflow                                                          |
| `full-bleed`     | viewport-filling                   | CreativeEditor, immersive workflow     | no centered max-width wrapper; canvas uses all available space                                                              |

The implementation contract is:

- `SuiteCanvas` owns structural mode and available space.
- The recipe layout adapter owns only the mode-approved content width, gutters,
  section gap and overflow behavior.
- Domain widgets own internal density and surface composition, not page geometry.
- `full-bleed` recipes must not add `mx-auto`, `max-w-*` or page padding around
  the primary canvas.
- Bounded recipes must use the shared recipe container contract rather than
  repeating arbitrary `p-*`, `gap-*` and `max-w-*` values in each view.
- Wide data and board recipes must use the shared wide geometry contract rather
  than adding local `max-w-*` overrides to recover unused canvas space.
- `ModuleContextPanel` uses the standard platform width across recipes unless a
  reviewed shell contract explicitly requires another width. Row-level data
  detail opens from selecting the row, not from an artificial `Open` column.
- Mobile gutters and reduced-motion behavior are part of the same contract and
  are validated with the recipe, not patched after visual review.

This contract is the decision gate for Phase 1 items 14–16 and Phase 2
composition work. A new CRM recipe is not ready until its mode, geometry,
overflow owner and mobile transformation are recorded in the matrix above.

### Phase 1C: CommandDialog certification and source-contract gate

**Status: `certified` for `command-dialog-v1`; primitive recertification is the next work item.**

`CommandDialog` is the first component certified under the global zero-hardcode
source contract. Its implementation is consumer-owned: visible copy, command
definitions, actions, icons and close behavior are supplied through the typed
public API. Component defaults for visible copy and `closeOnSelect` were
removed, and representative data was moved to external certification fixtures.

#### Completed evidence

| Gate                               | Status     | Evidence                                                                                     |
| ---------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| Public contract and ownership      | `verified` | `ds/packages/ui/src/components/composites/utilities/CommandDialog/types.ts`, `UI_UX_SPEC.md` |
| Source contract / zero hardcode    | `verified` | `scripts/certification/source-contract-manifest.json`, `pnpm certification:source-contracts` |
| Focused behavior and accessibility | `verified` | `CommandDialog.test.tsx`, 5 passing tests                                                    |
| Responsive and interaction E2E     | `verified` | `e2e/command-dialog.certification.spec.mjs`, 21 passing tests                                |
| Theme and visual review            | `verified` | Playwright desktop, mobile and compact-mobile light/dark matrix                              |
| Registry and documentation         | `verified` | `docs/registries/frontend-components.json`, adjacent source-contract document and UI/UX spec |

The E2E contract covers opening from the consumer trigger, initial focus,
bounded overlay geometry, light/dark themes, desktop/mobile/compact-mobile
layouts, filtering, empty feedback, disabled commands, Escape and no main
content overflow. This certification applies to `command-dialog-v1` and does
not certify a future remote-search, loading, error or permission-aware command
source; those capabilities require a reopened contract.

#### Global source-contract policy

All new or recertified components must be declared in
`scripts/certification/source-contract-manifest.json` before promotion. The
shared gate is integrated into `front:check` and rejects implementation or
public-type source containing domain data, default visible copy, fixture/data
arrays, raw palette classes, literal z-indexes or inline visual styles. Tests,
showcases and external fixtures may contain representative data; reusable
implementation source may not. Component-local regex guards are supplementary
only and cannot replace the global gate.

The generator now creates `certification/source-contract.md`, and the
component-development, UI/UX certification, template and registry-schema
documentation describe this gate. The source-contract test includes both a
passing pilot and a deliberately invalid fixture to protect the validator.

#### Next handoff: recertify existing primitive components

The next track slice is to audit and recertify the existing primitive entries
already used by the CRM certification flow. The order is intentionally narrow:

1. Inventory every `frontend-components.json` entry with
   `certification.overall: "certified"` and a concrete implementation path.
2. Add each implementation and its public types to the source-contract
   manifest; use report mode or a temporary migration manifest to classify
   findings before changing certification status.
3. Move test/showcase data out of reusable implementation files and remove
   defaults, domain copy, raw colors, literal z-indexes and inline visual rules.
4. Record explicit, narrow exceptions only for technical values that are part
   of an approved public contract; broad path or file allowlists are forbidden.
5. Run focused unit/Axe tests, source-contract validation, ownership checks,
   registry validation and the relevant E2E/visual matrix for each primitive.
6. Mark a component `certified` only when all applicable evidence passes;
   otherwise set the active track and registry state to `changes-requested` or
   `reopen-required` with an owner and migration destination.

Initial recertification batch: `Select`, `Checkbox`, `Badge`, `EmptyState`,
`LoadingState`/`Skeleton`, `PageHeader`, `SectionHeader`, `UserAvatar` and
`CommandBarTrigger`. `ResponsiveTable` remains a separate data-foundation
track item because its semantic mobile, selection and state contract is not
yet complete.

#### Known repository-level blocker

`pnpm registries:check` currently fails before evaluating the new
`command-dialog-v1` entry because the historical `filters-actions-v1` entry
references an unknown `ResponsiveTable` dependency. This must be repaired as
a registry migration task before claiming the repository-wide administrative
gate is green; it does not invalidate the component-specific evidence above.

### Phase 1B: shared states and content headers audit

This slice reuses the existing `@loopdev/ui` primitives `LoadingState`,
`EmptyState`, `PageHeader` and `SectionHeader`. It does not create a CRM-local
header or state system, and it does not move any responsibility into Shell.

#### Current-state inventory and ownership

| Component       | Owner                                  | Current evidence                                                        | Decision                                                        |
| --------------- | -------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| `LoadingState`  | Shared atom: `atoms/feedback`          | Public props, focused Vitest/Axe test and showcase consumers            | Keep; use as the in-flight state without owning layout geometry |
| `EmptyState`    | Shared atom: `atoms/feedback`          | Public props, focused Vitest/Axe test and showcase consumers            | Adapt only through consuming state copy and action slots        |
| `PageHeader`    | Shared composite: `composites/content` | Typed title/description/eyebrow/actions API and focused Vitest/Axe test | Keep; content orientation only, never Shell ownership           |
| `SectionHeader` | Shared composite: `composites/content` | Typed title/icon/action API and focused Vitest/Axe test                 | Keep; section orientation only, never duplicate page actions    |

#### Cross-platform and suite contract

- All four components remain usable with pointer, touch and keyboard input;
  action slots own their actual controls and visible focus.
- Loading and empty states preserve consuming canvas geometry and expose status
  semantics without introducing a new surface boundary.
- Page and section headers use semantic heading levels, allow long translated
  content to wrap, and keep actions in caller-owned slots.
- Theme, contrast and responsive behavior come from shared tokens and the
  consuming `SuiteCanvas`; no suite-local colors or Shell controls are added.
- CRM, Marketing Studio and Operations may provide copy, data and actions, but
  may not leak domain status, permissions or routing rules into shared pieces.

#### Composition standard

```text
SuiteCanvas
└── transparent content composition
    ├── PageHeader (orientation and page actions)
    └── TechnicalSurface
        ├── SectionHeader (section orientation and local action)
        └── LoadingState or EmptyState (content state)
```

The reading order is page context, page actions, section context, then content
or its state explanation. Headers do not draw an outer card, and state
primitives do not recreate canvas geometry.

#### Concrete action inventory

| Action    | Owner / location                   | Concrete change                                                                        | Acceptance evidence                                             |
| --------- | ---------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `keep`    | `LoadingState` / shared atom       | Preserve `role=status`, `aria-busy` and caller-owned geometry                          | Focused unit/Axe tests and loading fixture                      |
| `adapt`   | `EmptyState` / consuming recipes   | Express empty, error and forbidden meaning through copy, icon and action               | State fixture, keyboard action and theme/responsive review      |
| `keep`    | `PageHeader` / shared composite    | Preserve typed orientation and action slots; verify long content wraps                 | Header fixture, semantic heading test and responsive review     |
| `keep`    | `SectionHeader` / shared composite | Preserve section heading and local action slot                                         | Header fixture, semantic heading/Axe test and responsive review |
| `compose` | `CertificationLab` / showcase      | Add one declarative foundation fixture showing headers and states inside `SuiteCanvas` | Visual, responsive and interaction Playwright review            |
| `update`  | Registry and track                 | Record evidence only after focused tests, Playwright and registry checks pass          | `pnpm registries:check` and post-implementation re-audit        |

#### Implementation handoff

1. Keep the existing shared implementations and exports.
2. Add a `SharedFoundation` certification fixture to `CertificationLab` using
   `PageHeader`, `SectionHeader`, `LoadingState` and `EmptyState`.
3. Keep state copy and actions in the fixture; do not add business logic to
   shared atoms or composites.
4. Add focused assertions for headings, action slots and state status.
5. Validate unit/Axe, Playwright desktop/mobile, registry and changed-file
   checks before updating certification evidence.

#### Phase 1B post-implementation re-audit

| Action                                                               | Status     | Evidence                                                                                                            |
| -------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Keep `LoadingState` status semantics and caller-owned geometry       | `verified` | Primitive contract, focused unit/Axe tests and showcase loading fixture                                             |
| Adapt `EmptyState` for empty, error, forbidden and read-only meaning | `verified` | Primitive `status="error"` contract, focused unit/Axe tests, shared foundation fixture and responsive visual review |
| Keep `PageHeader` orientation and caller-owned actions               | `verified` | Shared implementation, semantic/action/long-copy tests and showcase fixture                                         |
| Keep `SectionHeader` section heading and local action slot           | `verified` | Shared implementation, semantic/Axe tests, README and showcase fixture                                              |
| Compose `SharedFoundation` inside `SuiteCanvas`                      | `verified` | Declarative CertificationLab fixture; Playwright interaction `7/7` and visual `9/9`                                 |
| Register and document the shared components                          | `verified` | Registry entries, READMEs, `pnpm registries:check` and no evidence gaps                                             |

**Phase 1B certification status: certified for the reviewed shared contracts.**

### Phase 1C: filters and action surfaces audit

This slice audits the existing `FilterDropdown`, `Select`, `Input`,
`IconButton`, `CommandBarTrigger` and `TrailingControl` primitives before CRM
adoption. It does not create a CRM-local filter bar or move action ownership
into Shell. The first implementation hypothesis is to compose the existing
controls in the consuming data composition and only adapt a primitive where a
shared keyboard, focus, state or responsive contract is demonstrably missing.

#### Current-state inventory and ownership

| Component           | Owner                               | Current evidence                                                            | Decision                                                                       |
| ------------------- | ----------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `FilterDropdown`    | Shared atom: `atoms/inputs`         | Multi-select API, semantic trigger, Escape/focus behavior and focused tests | Keep; adapt only for disabled/read-only and responsive placement if required   |
| `Select`            | Shared atom: `atoms/inputs`         | Native select contract, label association and focused Axe test              | Keep; use for single-value filters                                             |
| `Input`             | Shared atom: `atoms/inputs`         | Shared text-entry primitive and existing consumers                          | Keep; verify search label, clear and disabled semantics before promotion       |
| `IconButton`        | Shared atom: `atoms/inputs`         | Existing shared action control and consumers                                | Keep; verify accessible name, tooltip contract and disabled/read-only behavior |
| `CommandBarTrigger` | Shared composite: `shell`/workspace | Platform command entry point                                                | Compose only for global commands; never duplicate it as a CRM local filter     |
| `TrailingControl`   | Shared content/control primitive    | Existing trailing action contract                                           | Keep or defer after checking consumer and keyboard evidence                    |

#### Cross-platform and suite contract

- Search, filters and actions remain inside the `SuiteCanvas` content plane;
  `PlatformHeader` and global command ownership are unchanged.
- Every control has a visible or programmatic accessible name, keyboard focus,
  Escape behavior where a popup exists, and a disabled/read-only distinction.
- Filter state is controlled by the consuming feature; primitives render the
  selected value and interaction affordance without owning CRM queries,
  authorization or persistence.
- Desktop may place controls in one row; narrow layouts may wrap or stack them
  without clipping, horizontal page overflow or unreachable actions.
- CRM, Marketing Studio and Operations can provide option labels and action
  copy, but shared primitives keep tokenized focus, contrast and state styling.

#### Composition standard

```text
SuiteCanvas
└── transparent filter/action plane
    ├── labelled Input (search)
    ├── Select or FilterDropdown (filters)
    ├── clear/reset action
    └── contextual bulk actions (only when selection exists)
```

The plane groups related controls without becoming a nested card. Search comes
first, filters follow, and contextual actions appear last. The data composition
owns query state and selection; the controls own their interaction semantics.

#### UX/UI contract for `FiltersActions`

`FiltersActions` is a workspace or feature-level composition, not a new atom
and not the table itself. Its purpose is to help the user find, narrow and act
on records. It coordinates search, frequent filters, advanced filters, active
criteria and contextual bulk actions while delegating data fetching,
authorization, persistence, pagination, sorting and row rendering to the
consumer and `ResponsiveTable`.

##### Desktop anatomy

The approved reading order is:

```text
Customer records                                      24 records   [Create contact]
[ Search contacts by name, email or company... ]
[Status: All] [Owner: Any] [Segment: All] [More filters]       [Clear filters]
Filters: [Status: Active x] [Segment: Enterprise x]
--------------------------------------------------------------------------
[ ] Customer                 Company              Owner          Status
```

- The header owns the view title, result count and page-level primary action.
- Search is the dominant control and spans the available row before filters
  wrap; it has a visible search affordance, accessible name, clear behavior and
  loading behavior when its result is remote.
- Frequent filters use `Select` for one value and `FilterDropdown` for multiple
  values. `More filters` is reserved for secondary criteria and must not become
  a second permanent toolbar row without a documented need.
- Active criteria are visible as removable chips. A numeric badge inside a
  dropdown may summarize selected values, but must not be the only explanation
  of why rows are hidden.
- `Clear filters` is enabled only when query or filter state is non-default.
- The data plane below is a real `ResponsiveTable`; a list of unheaded rows is
  not sufficient evidence for the CRM table contract.

##### Initial and persistent state

The neutral fixture starts without restrictions:

```text
query = ''
status = 'all'
selectedSegments = []
selectedRecords = []
```

The initial result count must expose the complete fixture. A view may start
filtered only when the route or user intent explicitly supplies that context;
the applied criteria must then be visible in the active-filter summary.

##### Filter semantics

| Capability          | Required behavior                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Search              | Controlled text input; searches the declared record fields; supports clear, focus and loading states |
| Single-value filter | Native labelled `Select`; default option is `All ...`                                                |
| Multi-value filter  | `FilterDropdown`; selected count means selected values only, never available options or result count |
| Advanced filters    | Popover or bottom sheet with `Cancel`, `Clear all` and `Apply filters` when the criteria are complex |
| Active criteria     | Removable chips that update the controlled consumer state                                            |
| Reset               | Clears query, simple filters, multi-select filters and active chips together                         |
| No results          | `filtered-empty` state explains that filters produced no matches and offers `Clear filters`          |

##### Selection and action semantics

Page actions and selection actions are separate contracts. `Create contact`
belongs in the page header and is available independently of row selection.
Bulk actions appear only after selection:

```text
2 selected                                      [Assign owner] [Archive] [Clear]
```

- Actions must expose loading, success and error feedback.
- Destructive actions require confirmation and a danger semantic.
- Actions that do not apply to the current selection are disabled or omitted
  with a documented reason.
- In read-only mode, filters remain usable but mutation actions are absent or
  disabled with an accessible explanation.
- In mobile, bulk actions collapse into an `Actions` menu instead of forcing a
  horizontal action row.

##### Responsive transformation

At tablet width, search occupies the first row and frequent filters wrap below
it. At mobile width:

```text
Customer records                                  [Create]
[ Search contacts... ]
[ Filters · 2 ] [ Clear ]
2 active filters
[Status: Active x]
[Segment: Enterprise x]
```

- Secondary filters open in a bottom sheet or equivalent full-width surface.
- Chips wrap without clipping or causing page-level horizontal overflow.
- The table transforms into semantic record rows according to the
  `ResponsiveTable` contract; the filter composition must not invent a second
  mobile table implementation.
- Focus order follows reading order: search, filters, clear, table selection,
  row actions and bulk actions.

##### State matrix and acceptance criteria

| State          | Required visible behavior                                                        | Evidence                                   |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| No filters     | Complete fixture is visible; clear is disabled or hidden                         | Fixture assertion and Playwright           |
| Active filters | Result count and removable criteria explain the restriction                      | Interaction test and responsive screenshot |
| Filtered empty | Message identifies filtering as the cause and offers reset                       | Unit/Axe and Playwright                    |
| Loading        | Search/filter controls preserve context and expose progress without layout shift | Unit and reduced-motion check              |
| Selection      | Bulk-action band appears only with selected rows                                 | Keyboard and Playwright interaction        |
| Read-only      | Query/filtering works; mutation controls are unavailable with explanation        | Unit/Axe and responsive interaction        |
| Disabled       | Controls cannot open or mutate and expose disabled semantics                     | Focused primitive tests                    |
| Error          | Data error preserves the active criteria and offers retry                        | State fixture and Playwright               |

The initial `FiltersActions` showcase fixture was only a composition probe, not
the component contract. The real composite must remain the owner of filter
state, active criteria, selection and table composition; the showcase may only
provide the certification route and declarative consumer context.

#### Implementation re-audit status

The `FiltersActions` composite now implements the neutral initial state,
controlled search with clear affordance, unified `FilterDropdown`
single/multi-select filtering,
multi-select segments, advanced owner filtering, removable active-filter chips,
contextual clear actions and `ResponsiveTable` columns with sorting, selection,
bulk actions and mobile row rendering. The current result state preserves filter
context and uses a filtered-empty message that points to `Clear filters` for
recovery. The showcase consumes it declaratively through `<FiltersActions />`.

This is now **certified for the reviewed web contract**. Evidence completed:

- focused Vitest/Axe coverage: 8 tests passed;
- Playwright coverage: 5 tests passed across desktop, tablet and mobile;
- responsive overflow and initial CLS checks passed;
- light/dark semantic surface review and keyboard Escape/focus-return passed;
- human visual review approved filter alignment, trigger heights, single/multi-select
  affordances, counter spacing and ownership split with `ResponsiveTable`;
- registry and `UI_UX_SPEC.md` updated with zero evidence gaps.

`FiltersActions` is not a pending certification item in this track. Changes to
its public API, state ownership, responsive transformation or relationship with
`ResponsiveTable` would reopen its applicable certification gates.

#### Concrete action inventory

| Action    | Owner / location                     | Concrete change                                                                                                  | Acceptance evidence                                            |
| --------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `keep`    | `FilterDropdown` / shared atom       | Preserve multi-select, semantic trigger, Escape and focus return                                                 | Focused keyboard/Axe tests and fixture interaction             |
| `keep`    | `Select` / shared atom               | Preserve native labelled single-select semantics                                                                 | Focused Axe test and filter fixture                            |
| `verify`  | `Input` / shared atom                | Verify accessible search naming, clear behavior and disabled/read-only states                                    | Focused contract test and fixture interaction                  |
| `verify`  | `IconButton` / shared atom           | Verify accessible name, focus, disabled state and tooltip expectations                                           | Focused contract/Axe test                                      |
| `compose` | Data composition / showcase          | Declarative `FiltersActionsFixture` consumes the generic API and neutral initial state                           | Vitest/Axe and Playwright evidence passed                      |
| `verify`  | Data composition / `ResponsiveTable` | Keep the certified `FiltersActions` composition aligned while the general table primitive completes its contract | ResponsiveTable contract and responsive evidence passed        |
| `compose` | Data composition / active criteria   | Removable filter chips and filtered-empty recovery implemented                                                   | Unit/Axe and Playwright evidence passed                        |
| `defer`   | `CommandBarTrigger` / global shell   | Keep global command ownership unchanged; document no local duplicate                                             | Ownership check and track review                               |
| `verify`  | `TrailingControl` / shared primitive | Confirm whether it is needed by the CRM filter contract                                                          | Consumer inventory and focused test or still-deferred decision |

#### Implementation handoff

1. Inspect the public types, implementation, exports, registry and tests for
   `Input`, `IconButton`, `CommandBarTrigger` and `TrailingControl`.
2. Add or adapt only the missing shared contracts, with focused unit/Axe tests.
3. Compose a declarative `FiltersActions` fixture inside the existing showcase;
   keep query, filter and selection state in the consumer.
4. Validate keyboard, disabled/read-only, Escape, focus, reduced motion and
   narrow-layout behavior before visual review.
5. Run registry/documentation checks and complete the post-implementation
   re-audit before certification.

### Phase 1D: CRM primitive certification

Before implementing CRM view compositions, certify the minimum shared primitive
surface that those views will consume. This phase is intentionally scoped: it
does not certify the entire design system and does not promote legacy
components merely because they have existing tests.

#### Minimum CRM scope

The initial CRM baseline is:

- `Input`: search, filters and future CRM forms;
- `Button`: create, save, confirm and clear actions;
- `IconButton`: clear controls, row actions and compact menus;
- `FilterDropdown`: single- and multi-select filtering;
- `Select`: only if a native select is required by a documented CRM contract;
- selection control used by `ResponsiveTable`;
- `Badge` or `TechnicalStatusBadge`: record and workflow status;
- `EmptyState`: empty and filtered-empty recovery;
- `LoadingState` and/or `Skeleton`: loading without layout shift;
- `ResponsiveTable`: semantic desktop, tablet and mobile record rendering;
- `PageHeader` and `SectionHeader`: CRM view hierarchy;
- `TechnicalSurface` and `TechnicalCard`: only where the composition contract
  requires a framed surface;
- `UserAvatar`: ownership and assignee identity when used by a CRM view.

`CommandBarTrigger` and `TrailingControl` are Phase 1D candidates only when a
CRM consumer is identified. Trading-only, shell-only and otherwise unrelated
components remain outside this phase.

#### Legacy and destination rules

For each candidate, record one explicit destination: `certified`, `deferred`,
or `legacy/no usar en CRM`. A legacy component is not certified by inheritance
from an existing test or by visual similarity. When two components provide the
same capability, the CRM contract must name one destination API; the alternate
implementation remains excluded or receives a separate migration decision.

#### Certification gates

Each in-scope primitive must have a local `UI_UX_SPEC.md` or an explicit
reference to an existing certified contract, covering:

1. Public API, ownership and visible copy boundaries.
2. Loading, disabled, read-only, error and empty behavior where applicable.
3. Keyboard, focus, semantics and Axe evidence.
4. Responsive behavior and CRM density constraints.
5. Token usage, reduced motion and layout-shift behavior.
6. Focused unit/contract tests and a showcase fixture where visual behavior is
   not already covered.
7. Playwright evidence for desktop, tablet and mobile when layout transforms.

#### Phase 1D exit criteria

Phase 1D is complete only when every minimum CRM primitive has a documented
destination, no undocumented legacy component is consumed by CRM, registry
status and evidence agree, and the focused technical and visual checks pass.
Only then may Phase 2 begin with the `Contacts` composition.

#### CRM primitive audit: `Input`

- Implementation: `ds/packages/ui/src/components/atoms/inputs/Input`
- Owner: shared atom / `frontend-platform`
- Component-development: `certified` for the current technical contract
- UI/UX certification: `certified` for the current CRM consumer baseline
- Contract: `verified` after adjacent `UI_UX_SPEC.md` was created
- Accessibility: `verified` for focused unit/Axe coverage; keyboard password
  toggle and conditional `aria-describedby` were corrected in the atom
- Interaction: `verified` for label, loading, error, disabled and password flows
- Responsive: `verified` through Playwright desktop/tablet/mobile/mobile-compact evidence
- States: `verified` for ready, focused, disabled, loading, error, helper and
  password; consumer-owned forbidden/offline/conflict states remain out of scope
- Consumer ownership: `verified`; CRM owns query, validation, permissions and
  recovery behavior
- API ownership: `verified`; labels, helper/error copy and native input props
  remain consumer-controlled
- Visual review: `verified` through Playwright light/dark CRM shell evidence
- Evidence: `Input.test.tsx` 9/9 passing, `e2e/input.certification.spec.mjs`
  21/21 passing, registry `input-v1`, CRM primitive catalog consumer and
  `Input/UI_UX_SPEC.md`
- Reopen triggers: new input state, masking behavior, semantic role, layout
  contract or suite-specific data responsibility

Current audit decisions:

- `correct`: remove the unconditional `aria-describedby` reference when no
  helper/error content exists;
- `correct`: restore keyboard reachability for the password visibility button;
- `keep`: native input semantics, tokenized variants, loading/error/disabled
  behavior and consumer-owned copy;
- `defer`: high-contrast, focused responsive screenshots and final visual
  verdict before certification.

### CRM primitive audit: `IconButton`

- Implementation: `ds/packages/ui/src/components/atoms/inputs/IconButton`
- Owner: shared atom / `frontend-platform`
- Component-development: `certified` for the current technical contract
- UI/UX certification: `certified` for the current CRM consumer baseline
- Contract: `verified` with native button semantics, typed variants and sizes
- Accessibility: `verified` through accessible-name, keyboard, disabled,
  loading and Axe coverage
- Interaction: `verified` for ready, focus, disabled, loading and tooltip flows
- Responsive: `verified` through desktop, mobile and mobile-compact evidence
- States: `verified` for ready, loading and disabled; permission, error and
  recovery remain consumer-owned
- Consumer ownership: `verified`; CRM owns action meaning, permissions,
  confirmation and mutation lifecycle
- Visual review: `verified` through approved light/dark desktop and mobile
  showcase evidence
- Evidence: `IconButton.test.tsx` 16/16 passing, Icon + IconButton 19/19
  passing, `e2e/icon-button.certification.spec.mjs` 21/21 passing, registry
  `icon-button-v1`, CRM primitive catalog consumer and `IconButton/UI_UX_SPEC.md`
- Registry: `overall: certified`, with resilience explicitly not applicable
  because the atom owns no I/O, persistence or mutation lifecycle
- Reopen triggers: new variant or size, naming/loading contract, custom content
  semantics, menu responsibility or suite-specific data ownership

### Final track follow-up: mobile shell navigation

This is a relevant platform follow-up for the end of the CRM UI foundation
track. It must not be solved through isolated callbacks or incidental changes
made while certifying CRM primitives.

The source of truth for ownership and interaction behavior is the
[Mobile Shell Navigation Contract](../../../docs/03-platform/MOBILE_SHELL_NAVIGATION_CONTRACT.md).
The implementation slice must satisfy that contract before this track can
advance to Phase 2.

The current mobile shell does not yet expose a single, explicit interaction
model for the three navigation layers:

- **Launchpad/global home:** define whether the LoopDev logo or identity
  control returns to the global Launchpad and whether it also opens the suite
  switcher;
- **Suite navigation:** keep an explicit menu control for opening and closing
  `SuiteSidebar` as a mobile drawer;
- **Module context:** define the mobile trigger, close behavior and focus
  management for `ModuleContextSidebar` and `ModuleContextPanel` wherever a
  composition exposes module context.

The follow-up must review `AppShell`, `SuiteShell`, `PlatformHeader`,
`SuiteSidebar`, `ModuleContextSidebar`, `ModuleContextPanel` and
`MobileSuiteNav` as one mobile interaction contract. It must cover:

- one owner for each open/closed state and overlay priority;
- explicit accessible names, `aria-expanded`, `aria-controls`, focus return
  and Escape/backdrop behavior;
- breakpoint behavior so the identity/Launchpad action is mobile-only when
  intended and does not duplicate desktop navigation;
- responsive visual evidence at supported mobile widths;
- a clear distinction between global Launchpad, suite navigation and module
  context actions;
- replacement or removal of ambiguous callbacks such as
  `onToggleRightSidebar` once the final ownership model is agreed.

**Status: contract defined; implementation deferred to the final task of this
track.** It is relevant to the platform boundary, but it does not block the
current primitive certification or the CRM composition work. Do not use the
LoopDev logo as a temporary replacement for the suite menu until the contract
is implemented and certified.

### Certification model evolution: total component certification

The track keeps `ui-ux-component-certification` as an independent and
mandatory UI/UX gate. A component is not globally certified by visual and
interaction evidence alone, so the technical certification model will add five
complementary dimensions:

1. **Security and data integrity:** safe rendering, sensitive-data handling,
   telemetry boundaries, permission presentation and explicit backend
   authorization boundaries.
2. **Data flow and state ownership:** controlled/uncontrolled contract,
   source of truth, normalization boundary, mutation ownership, pending state,
   rollback and concurrency behavior.
3. **Performance and runtime cost:** server/client boundary, dependency cost,
   rendering scale, virtualization or lazy-loading decisions, bundle impact
   and layout stability.
4. **Resilience and failure boundaries:** error, offline, retry, cancellation,
   stale-data and graceful-degradation behavior, including local failure
   isolation where the component risk requires it.
5. **Maintainability and testing contract:** typed public API, focused unit and
   accessibility coverage, responsive and visual evidence, integration/E2E
   evidence where applicable, and explicit change-impact ownership.

These dimensions are risk- and applicability-based. Every dimension must be
marked `passed`, `in-progress`, `changes-requested`, `not-applicable` or
`expired`; an empty or undocumented dimension is not evidence. The global
status is derived rather than manually asserted:

```text
overall certified = UI/UX certified
  AND technical certified
  AND every applicable technical dimension passed
```

This model does not create a parallel UI/UX certification. UI/UX remains the
authority for experience, interaction, responsive composition, accessibility,
visual review and theme portability; the five dimensions extend the technical
gate and its evidence contract.

#### Eight-step adoption plan

1. Define the certification matrix, statuses, applicability, evidence owners
   and change triggers.
2. Extend the component certification contract and `UI_UX_SPEC` guidance
   without moving security or runtime implementation details into showcase
   fixtures.
3. Extend the frontend registry with the five technical dimensions and a
   derived overall status, preserving existing entries during migration.
4. Define proportional evidence profiles for atoms, composites, widgets and
   feature compositions; `not-applicable` must be justified explicitly.
5. Pilot the matrix with `Input`, covering sensitive values, state ownership,
   runtime boundary, layout stability and focused tests.
6. Apply the same matrix to `FiltersActions`, adding action permissions,
   pending/rollback behavior and telemetry review.
7. Apply the matrix to `ResponsiveTable`, adding scale, selection, failure,
   offline and mobile rendering evidence.
8. Automate the stable checks in CI, classify the remaining registry entries,
   and make the derived certification status a promotion requirement.

**Initial execution:** start with step 1 and the `Input` pilot. Do not mark
`Input` globally certified until the existing UI/UX gate and all applicable
technical dimensions have evidence. This model must be validated before it is
rolled out across the entire frontend registry.

## Data tables and filters: UX/UI contract before implementation

**Scope status:** `in-progress / fixture composition`
**Track dependency:** blocks `ResponsiveTable` certification and the Phase 2
CRM compositions until the minimum contract and evidence are complete.

The working UI/UX specification is recorded at
`apps/loopdev-os/src/app/composition-showcase/data-tables/UI_UX_SPEC.md`.
The first fixture composition is intentionally not certified yet: its
structure exists, but mobile renderers, complete states, mixed selection,
configurable labels and final visual alignment still require implementation and
evidence.

The next track slice is `Data tables and filters`. It begins with a written
UX/UI and usability contract, not with new implementation. The goal is to
define a coherent family of data patterns for CRM rather than force every
dataset into one visual table.

### Product and visual principles

- Dense operational tables for records, tasks and backoffice workflows.
- Entity tables for contacts, companies, leads and opportunities, with an
  identity-first column and a deliberate mobile row transformation.
- Quantitative tables for pipeline, revenue, forecast and other numeric data,
  with right-aligned values and explicit trend semantics.
- Activity tables/lists for events, tasks and history where chronology matters
  more than column comparison.
- Selection tables for assignment and bulk operations, with clear selection
  scope and contextual actions.
- A table is not the universal answer: timelines, boards, cards and summary
  metrics remain separate compositions when their information architecture
  requires it.

### Responsive contract

Each table chooses one explicit strategy and documents it:

1. Horizontal table for comparison-heavy or quantitative data, with a bounded
   overflow region and an intentional first-column policy.
2. Desktop table plus mobile list/row renderer for CRM entities; mobile shows
   identity, priority metadata, status and actions rather than every column.
3. Dedicated composition for activity, board, hierarchy and summary patterns.

`renderMobileRow` and the desktop table must not render duplicate content at
the same breakpoint. The mobile strategy, overflow behavior, row actions and
selection behavior must be covered in desktop, mobile and compact-mobile
evidence.

### Composition model

The target composition is:

`DataTableWorkspace` -> header, toolbar, active filters, selection toolbar,
table viewport, state surface and pagination.

The shared boundaries are:

- `DataTableToolbar`: search, frequent filters, advanced filters, view action;
- `ActiveFilterBar`: removable filter chips and clear-all;
- `SelectionToolbar`: selected count, bulk actions and clear selection;
- `DataTableState`: loading, skeleton, empty, filtered-empty, error, forbidden
  and offline;
- `DataTablePagination`: result range, page navigation and page size;
- `DataTableRowActions`: row-level action ownership and mobile menu behavior.

These may initially be internal composition pieces. They become public UI
components only when a second real consumer proves the boundary.

### Component scope

#### P0: stabilize existing contracts

- `ResponsiveTable`: columns, row identity, sorting, selection, pagination,
  states, read-only, row actions and responsive rendering.
- `FiltersActions`: search, frequent/advanced filters, active chips, page
  actions, bulk actions, state ownership, mobile layout and accessibility.

#### P1: shared CRM composition pieces

- `DataTableToolbar`
- `DataTableState`
- `DataTablePagination`
- `ActiveFilterBar`
- `SelectionToolbar`
- `DataTableRowActions`

#### P2: defer until a real consumer requires them

- `DataTableColumnVisibility`
- `DataTableViewSwitcher`
- `DataTableDensityControl`
- `DataTableSavedView`
- `DataTableExport`
- `DataTableBulkConfirmDialog`

No P2 component should be created as speculative infrastructure.

### Required behavior and state matrix

The contract must explicitly cover `ready`, `loading`, `skeleton`, `empty`,
`filtered-empty`, `error`, `forbidden`, `offline`, `read-only` and `disabled`.
It must also resolve whether stale/conflict semantics belong to the table or
to the owning composition. Error, retry, authorization, persistence and domain
copy remain consumer-owned.

Before certification, resolve these current `ResponsiveTable` gaps:

- configurable labels for sorting, selection and pagination;
- controlled pagination, including page and page-size ownership;
- sort accessor or an explicit consumer-owned sorting contract;
- page-only versus all-results selection semantics;
- row actions without accidental row-click conflicts;
- explicit offline state;
- mobile strategy versus horizontal overflow;
- accessible selection, partial selection, focus and `aria-sort` behavior.

### Planned delivery sequence

1. Write and approve the `Data tables and filters` UI/UX spec, including
   anatomy, pattern selection rules, responsive behavior, states and reopen
   triggers.
2. Create the Certification Lab fixtures for `EntityTable`,
   `DenseOperationalTable`, `QuantitativeTable`, `ActivityTable` and
   `SelectionTable`; fixtures may contain representative CRM data, shared
   implementation may not.
3. Stabilize `ResponsiveTable` against the approved contract. Treat
   `FiltersActions` as certified and reopen it only if the table API or shared
   state ownership changes.
4. Run focused unit/Axe tests and the desktop/mobile/compact-mobile Playwright
   matrix for every applicable pattern and state.
5. Update source-contract manifest, registry, UI/UX specs and ownership
   evidence; promote `ResponsiveTable` from `experimental` only when all
   applicable gates pass.
6. Use the certified patterns in Contacts, Customer 360, Pipeline and Tasks.

`Data tables and filters` is therefore the next active design and contract
slice. It does not authorize persistence, remote fetching, authorization or
saved-view behavior before those contracts are separately approved.

### Data-table standardization execution phases

The following phases replace table-by-table improvisation with one reusable
visual and certification workflow. No later table may be certified by copying
mechanics or by generating an isolated screenshot baseline; it must consume the
approved CRM composition boundary and pass the same gates.

#### Phase A: freeze the EntityTable golden reference — **start now**

Owner: frontend-platform. Scope: the approved `EntityTable` composition and its
`FiltersActions` contract.

Deliverables:

- record the exact approved anatomy: context header, control plane, active
  query/selection summary, data plane and navigation footer;
- record surface, border, spacing, density, typography, status, hover, focus
  and selected-row rules as tokens and structural contracts;
- capture approved light/dark desktop, mobile and compact-mobile references;
- identify which parts are shared composition and which parts are
  EntityTable-specific behavior;
- add a visual reference fixture that future table fixtures can consume.

Current implementation evidence: the anatomy and ownership contract is recorded
in `apps/loopdev-os/src/components/composites/data-tables/ENTITY_TABLE_GOLDEN_REFERENCE.md`;
the executable contract is
`apps/loopdev-os/src/components/composites/data-tables/entityTableGoldenReference.ts`,
its focused contract test is
`apps/loopdev-os/src/components/composites/data-tables/entityTableGoldenReference.test.ts`,
and the reproducible capture command is `pnpm e2e:entity-table:golden`.

Exit gate: EntityTable renders unchanged through the reference composition and
the visual review explicitly approves the golden reference. No new table work
should begin before this boundary is stable.

#### Phase B: extract the shared CRM table composition — **blocked by Phase A**

Owner: frontend-platform. Scope: composition layer above `ResponsiveTable`,
without modifying `ResponsiveTable`.

Deliverables:

- extract the shared context header, control plane, data surface and footer
  geometry from the approved EntityTable composition;
- keep `DataTable` as a generic adapter only, not as the CRM visual standard;
- expose typed slots for title, result count, search/filter controls, columns,
  states, actions, pagination and mobile representation;
- preserve ownership: consumers own data, labels, filters and mutations;
  shared composition owns visual structure and table placement;
- add contract tests proving every CRM table uses the same planes and tokens.

Exit gate: EntityTable consumes the extracted composition with no visual
regression across the approved desktop/mobile matrix.

#### Phase C: recompose and re-approve EntityTable — **blocked by Phase B**

Owner: CRM composition owner. Scope: `EntityTable` plus `FiltersActions`.

Deliverables:

- migrate EntityTable to the shared CRM composition;
- preserve its current filters, selection, row actions, states and mobile row;
- compare before/after screenshots against the Phase A golden reference;
- run focused tests, Axe and Playwright desktop/mobile/compact-mobile.

Exit gate: explicit human visual approval confirms that EntityTable remains the
reference implementation after extraction.

#### Phase D: recompose DenseOperationalTable — **blocked by Phase C**

Owner: CRM composition owner. Scope: `DenseOperationalTable` only.

Deliverables:

- consume the approved `EntityTable` data-surface visual language instead of
  presenting an unreviewed generic table;
- retain only operational responsibilities: sortable records, compact
  metadata, status rendering, row actions and pagination behavior;
- exclude EntityTable-specific context, CRM filters, search and bulk-action
  planes;
- define its mobile priority order and operational row representation;
- add fixture states required by the pattern and compare screenshots directly
  against EntityTable geometry.

Exit gate: human visual approval of DenseOperationalTable against EntityTable;
automated evidence alone cannot promote it.

#### Phase E: implement the remaining pattern compositions — **blocked by Phase D**

Implement in this order:

1. `QuantitativeTable`: right-aligned metrics, totals, deltas and bounded
   horizontal comparison using the shared planes.
2. `ActivityTable`: chronological event identity, actor hierarchy, timestamp
   and status using the shared row and footer rules.
3. `SelectionTable`: page selection, mixed header state and bulk toolbar using
   the shared selection plane and action semantics.

Each table gets a typed composition adapter and fixture-specific renderers. None
may introduce its own outer surface, toolbar, pagination styling or arbitrary
responsive layout.

#### Phase F: repeatable certification matrix — **runs per table after Phase E

scope is implemented**

For each composition, run the same checklist:

- focused unit and consumer contract tests;
- Axe in light and dark themes;
- source-contract validation;
- desktop, mobile and compact-mobile Playwright matrix;
- visual comparison against the EntityTable golden reference;
- explicit human visual approval;
- registry and documentation update only after approval.

#### Phase G: promote and unlock consumers — **last**

Promote a table to `certified` only when Phases A–F pass for that table. Then
use the approved pattern in Contacts, Customer 360, Pipeline and Tasks. A
failed visual comparison reopens the composition phase; it does not get
resolved by weakening the snapshot or certifying the generic adapter.

## Data tables and filters: deep visual and usability analysis

This section is the design decision record for the slice above. It translates
the existing technical-surface language into a usable data-plane grammar. The
objective is scan speed, confident action and stable responsive behavior, not a
collection of decorative table skins.

### Visual hierarchy

The composition has five visual levels, each with one responsibility:

1. **Context header:** title, short purpose statement, result count and the
   primary page action. It establishes where the user is and what dataset is
   being manipulated.
2. **Control plane:** search, frequent filters, advanced filters, sort/view
   controls and clear actions. It must remain visually quieter than the data
   plane while staying easy to discover.
3. **Active-query summary:** removable chips and selection summary. This is
   the user's explanation of why the current result set looks the way it does.
4. **Data plane:** table, mobile list or dedicated composition. This receives
   the strongest visual weight and the largest usable area.
5. **Navigation/state footer:** pagination, result range and continuation
   affordances. It should not compete with the first visible rows.

The composition must not become a card inside a card. The workspace owns the
surface boundary; the table owns row and column structure. `TechnicalSurface`
may frame the complete data workspace, but individual rows are not framed as
floating cards on desktop.

### Color contract

- Base surfaces use the existing semantic shell/background tokens. Do not add
  a table-specific hue or gradient.
- `text-main` is reserved for primary identifiers and actionable labels;
  `text-muted` is for metadata, counts and supporting descriptions.
- `border-technical` defines the outer data boundary, header separator and
  pagination separator. `border-subtle` separates rows without turning the
  table into a grid of boxes.
- Primary/accent color is reserved for focus, selected rows, active controls,
  links and the selection toolbar. It must not color every header or badge.
- Warning, error, success and forbidden colors communicate semantic state only;
  they never serve as decoration or row striping.
- Hover is a low-contrast surface change. Selected is stronger than hover and
  must remain distinguishable without relying on color alone.
- Light/dark and tenant themes consume semantic tokens; raw palette classes
  are prohibited in shared implementation source.

### Borders, geometry and density

- Use one outer boundary for the workspace and one structural separator under
  the header. Avoid vertical borders between every column unless a quantitative
  comparison pattern proves they improve scanning.
- Row separators are subtle, consistent and full-width. They do not change
  thickness on hover or selection.
- The primary identifier column is visually anchored through typography and
  spacing, not a permanent accent stripe. A selected row may use an inset
  primary marker because it communicates state, not branding.
- Default density is comfortable for repeated CRM work: a target height of at
  least 44px for interactive rows and controls. A compact variant may reduce
  vertical space only after keyboard and touch targets remain valid.
- Header height and row height must be stable across loading, ready and
  filtered-empty transitions to prevent layout shift.
- Long values truncate only when the full value remains discoverable through
  an accessible name, title or detail action. Identifiers must not be silently
  clipped.

### Header and column behavior

- The context header is not repeated inside the table. `SectionHeader` or an
  equivalent owns the title/action relationship; the table header owns column
  labels only.
- Column labels use concise sentence case or the established mono-label style;
  do not use all caps for long domain terms.
- Sortable headers expose the current direction with `aria-sort` and a visible
  but quiet indicator. Unsorted columns do not imply an arbitrary direction.
- The first column answers “what is this record?” and receives the strongest
  text hierarchy. Status, owner and secondary metadata follow it.
- Numeric values align right and use stable formatting. Dates align consistently
  and expose an unambiguous accessible value.
- The final column is reserved for row actions only when those actions are
  genuinely frequent; otherwise actions belong in an overflow menu.
- Column order is part of the responsive contract, not an implementation
  detail. Each fixture must document priority, hide/reorder behavior and mobile
  representation.

### Filter and toolbar usability

- Search is the dominant control and occupies the flexible width on desktop;
  on mobile it becomes a full-width first row.
- Only the most frequent filters remain visible in the primary toolbar. A
  `More filters` control owns the advanced set and must return focus when it
  closes.
- Filter triggers show their current value or selected count. “Filter” without
  current state is insufficient feedback after a query is applied.
- Active chips are a query explanation, not decoration. Each chip removes one
  predicate, while clear-all resets search, filters and selection according to
  the documented ownership contract.
- Toolbar actions have a stable order: search, frequent filters, advanced
  filters, clear, then view/action controls. On mobile, controls collapse into
  search plus a filter/sort action row or sheet.
- Do not hide essential actions inside an overflow menu merely to preserve a
  desktop single-row layout.

### Selection and action behavior

- Selection is opt-in and never appears on read-only or forbidden surfaces.
- The header checkbox communicates unchecked, checked and mixed states. Its
  label must state whether it selects the visible page or all matching results.
- Selecting rows reveals a contextual toolbar near the data plane with count,
  bulk actions and clear selection. It must not move the table unexpectedly.
- Row click and row selection are separate behaviors. A row containing actions
  must not trigger navigation when the user activates a nested control.
- Destructive bulk actions require a consumer-owned confirmation flow and must
  not be silently added to the table primitive.
- Selection persistence across filtering and pagination must be explicit. The
  default contract is page-visible selection until a future all-results model is
  approved.

### Responsive usability rules

- At mobile widths, preserve the record identity, state, one or two priority
  facts and the primary action. Secondary columns move into progressive
  disclosure or disappear from the first scan.
- Entity tables use a semantic mobile row/list renderer, not a shrunken desktop
  table. The renderer must preserve reading order and action discoverability.
- Quantitative comparison tables may use bounded horizontal overflow. The
  overflow container must be keyboard reachable and must not cause page-level
  horizontal scroll.
- Filters use a full-width search field and a compact action row on mobile;
  advanced filters open in a sheet/drawer with labelled close and focus return.
- Pagination becomes a compact previous/current/next control. Rows-per-page
  remains available when it materially helps the workflow, otherwise it moves
  into the view control.
- Test at desktop, mobile and compact-mobile widths with long labels, empty
  results, selected rows, open filters and dark theme. No text may overlap or
  resize controls unexpectedly.

### Accessibility and interaction contract

- Use a semantic `<table>` when the content is genuinely tabular; do not use
  ARIA grid complexity unless cell-level keyboard navigation is a real need.
- Caption or accessible name identifies the dataset. Header cells use `scope`;
  sortable headers expose `aria-sort`.
- Focus is visible on search, filters, sort controls, row actions, pagination
  and mobile sheets. Escape closes transient filter surfaces and restores focus.
- Status messages use live/status semantics without repeatedly announcing every
  row. Loading and filtered-empty messages must be understandable without
  visual context.
- Color is never the sole signal for status, selection, warning or error.
- Touch targets remain at least 44px where controls are interactive, including
  row menus, chips and pagination.

### Pattern fixture requirements

The Certification Lab must show the full examples, not only summary cards:

1. `EntityTable`: identity-first CRM rows with status, owner, row actions and
   mobile transformation.
2. `DenseOperationalTable`: sortable, paginated records with compact metadata.
3. `QuantitativeTable`: right-aligned metrics, totals, deltas and overflow
   strategy.
4. `ActivityTable`: chronological events with timestamp and actor hierarchy.
5. `SelectionTable`: page selection, mixed header state, bulk toolbar and
   read-only contrast.

Each fixture must include ready, loading/skeleton, empty, filtered-empty,
error, forbidden, offline, selected and mobile states where applicable. Fixtures
may use representative CRM data; shared components may not contain that data.

### Design acceptance criteria

The UX/UI contract is ready for implementation only when:

- a consumer can choose a pattern from the five fixture families without
  inventing a new table layout;
- color, borders, density and hierarchy are token-backed and consistent with
  the existing shell language;
- mobile behavior is selected per pattern and does not duplicate desktop data;
- filters, selection, sorting, pagination and states have explicit ownership;
- keyboard, screen-reader and touch behavior are documented and testable;
- all visible copy and labels are consumer-owned and source-contract compliant.

### Phase 2: CRM compositions

- Implement view-level compositions with typed fixtures and stable boundaries.
- Validate Contacts, Customer 360, Pipeline and Tasks composition proposals
  without binding them to persistence.

### Phase 3: handoff

- Record component ownership and registry evidence.
- Handoff data-bound integration to the module tracks after shared CRM
  contracts and fixtures are approved.

## Validation

- Focused component tests and accessibility checks.
- Responsive behavior checks for supported Shell modes.
- `pnpm registries:check` when registry entries change.
- `pnpm validate:changed` before the implementation PR.

## Criterios de cierre

- The eight-point alignment baseline is reviewed, with unresolved inventory-to-
  registry rows explicitly owned and tracked.
- The Phase 0B candidate decisions are recorded in the alignment matrix.
- Every selected CRM UI component has an owner, contract boundary and fixture.
- Every proposed CRM view maps to a validated SuiteCanvas mode.
- Legacy components are classified as reuse, adaptation, replacement or
  retirement.
- No persistence or authorization behavior is invented in this track.
- The `ResponsiveTable` contract is covered by focused tests, source-contract
  validation, responsive Playwright evidence and current registry/documentation
  links before promotion is considered.

## Phase 1D short-batch post-implementation re-audit

**Audit date:** `2026-08-16`
**Batch status:** `closed / certified`
**Track status:** `closed`

The following short CRM primitive batch is closed and certified:

`Select`, `Checkbox`, `Badge`, `EmptyState`, `LoadingState`, `Skeleton`,
`PageHeader`, `SectionHeader`, `UserAvatar` and `CommandBarTrigger`.

For each component, implementation, component-development, UI/UX,
technical and source-contract gates are recorded as certified in the frontend
registry. The final evidence set is:

- focused unit and Axe checks: 35/35 passing;
- CRM Playwright matrix: 18/18 passing across desktop, mobile and
  mobile-compact projects;
- preflight: passing against the active server with
  `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000`;
- source contracts: 11/11 manifest components passing, including the existing
  `CommandDialog` contract;
- ownership, registry and documentation-link checks: passing;
- focal lint for the changed implementation and documentation surfaces:
  passing;
- `git diff --check`: passing.

The batch is therefore closed for certification. Reopen any item if its public
API, interaction or accessibility semantics, responsive geometry, token/theme
contract, ownership boundary or source-contract policy changes.

`ResponsiveTable` is now certified for the reviewed shared contract. Its
implementation follow-up has 19/19 focused Vitest tests, 12/12 source-contract
checks, a current registry catalog, and EntityTable Playwright evidence of
21/21 across desktop, mobile and mobile-compact. The visual review approved the
composed `FiltersActions` + `ResponsiveTable` experience as rendered by
`EntityTable`; the components remain separately owned, with filtering owned by
`FiltersActions` and table mechanics owned by `ResponsiveTable`. The
pre-existing `Select` props-unknown TypeScript errors remain outside this
batch. The complete CRM Phase 1D track remains active only for the mobile shell
navigation follow-up.

## EntityTable certification closure

**Audit date:** `2026-08-16`
**Component status:** `Front_Certified`
**Evidence commit:** `418858a test(crm): certify entity table workflow`

`EntityTable` is now certified as the reusable CRM data-table composition. The
implementation and contract remain in `apps/loopdev-os/src/components/composites/data-tables`,
with the formal evidence report in
`docs/06-product/crm/shared/ENTITY_TABLE_CERTIFICATION_REPORT.md`.

Completed gates:

- dedicated Playwright smoke, desktop and responsive matrix commands;
- EntityTable matrix: 21/21 passing across desktop, mobile and mobile-compact;
- Axe structural checks in light and dark themes with zero violations in the
  EntityTable region;
- preflight and source-contract validation passing;
- focused Vitest coverage: 17/17 tests passing for EntityTable and
  ResponsiveTable;
- selection, row click, responsive containment, internal horizontal scrolling
  and action/pagination separation verified;
- registry, source-contract manifest, fixture, UI/UX specification and audit
  report linked to the implementation.

The repository does not use Changesets for this application package and the
track remains `release: not-required`; this is recorded as a workflow
exception in the certification report. The existing catalog-level muted-filter
icon contrast warning remains a separate design-token follow-up and is not a
new EntityTable violation.

This closes the EntityTable certification slice. The broader CRM foundation
track remains active only for the mobile shell navigation follow-up; the
`ResponsiveTable` contract and the reviewed data-table compositions are
already certified.

## Data-table composition registry audit

**Audit date:** `2026-08-16`
**Scope:** `EntityTable`, `DenseOperationalTable`, `QuantitativeTable`,
`ActivityTable` and `SelectionTable`.

The five CRM data-table compositions are now explicitly tracked here. Their
status is derived from implementation, focused tests, responsive/Axe evidence,
visual review and registry ownership; technical evidence alone does not
promote a composition to `Front_Certified`.

| Composition             | Status            | Evidence currently registered                                                                                                                                                        | Remaining gate                                                                          |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `EntityTable`           | `Front_Certified` | `ENTITY_TABLE_CERTIFICATION_REPORT.md`, focused Vitest, EntityTable Playwright matrix `21/21`, Axe and registry links                                                                | None for the reviewed contract                                                          |
| `DenseOperationalTable` | `Front_Certified` | Focused Vitest, `e2e/dense-operational-table.visual.spec.mjs`, sorting/pagination/Axe/responsive checks, registry entry and explicit visual approval recorded on `2026-08-16`        | None for the reviewed contract                                                          |
| `QuantitativeTable`     | `Front_Certified` | Focused Vitest, `e2e/quantitative-table.visual.spec.mjs`, metric alignment/progress/Axe/responsive checks, registry entry and explicit visual approval recorded on `2026-08-16`      | None for the reviewed contract                                                          |
| `ActivityTable`         | `Front_Certified` | Focused Vitest `4/4`, `e2e/activity-table.certification.spec.mjs` `18/18` across three projects, Axe, sorting, mobile renderer, context-panel integration and responsive containment | None for the reviewed contract; `PlatformContextPanel` and shell geometry are certified |
| `SelectionTable`        | `Front_Certified` | Focused Vitest `3/3`, Playwright `17 passed / 4 skipped` across desktop, mobile and mobile-compact, Axe, modal/bulk selection evidence, visual approval and registry entry           | None for the reviewed contract                                                          |

The registry audit closes the documentation gap for all five reviewed
compositions. Dense and Quantitative have explicit visual approval, and
SelectionTable has its focused workflow and visual closure recorded below.
No data-table certification slice remains open for the reviewed contracts.

## Dense and Quantitative visual approval closure

**Approval date:** `2026-08-16`
**Approver:** User

The user explicitly approved the rendered visual compositions of
`DenseOperationalTable` and `QuantitativeTable` after their desktop, mobile and
compact-mobile evidence review. Their visual gates are closed for the reviewed
contracts, and both compositions are promoted to `Front_Certified` in the
frontend component registry. Future changes to density, metric alignment,
pagination, responsive transformation, status semantics or the shared table
primitive reopen the applicable evidence gates.

The data-table certification slice is closed for the reviewed contracts.

## Cierre del track

**Fecha de cierre:** `2026-08-18`

El track queda cerrado con la certificación visual, responsive y de accesibilidad de las cinco
composiciones de datos y de la superficie Shell consumida por CRM. La matriz Playwright del Shell y
las composiciones `shell-showcase` y `composition-showcase` pasan en desktop, mobile y
mobile-compact; los checks focales y Axe registrados en este documento también están en verde.

El cierre no habilita Phase 2 ni sustituye G0: Contacts, Leads, Pipeline, Tasks y Customer 360
requieren primero la foundation compartida, persistencia, RLS y validación de aislamiento tenant.

## SelectionTable certification closure

**Audit date:** `2026-08-16`
**Component status:** `Front_Certified`
**Evidence:** `e2e/selection-table.certification.spec.mjs`

`SelectionTable` is now certified for the reviewed CRM selection workflow.
The closure covers default customer sorting, semantic status and owner atoms,
full-row selection, mixed and checked master selection, contextual bulk
actions, confirmed owner assignment through the global modal overlay, Axe and
responsive containment. Mobile interaction checks use the compact responsive
representation; desktop-only table-header interactions are intentionally
skipped there because that DOM is hidden at the mobile breakpoint.

Future changes to selection scope, bulk-action ownership, modal overlay,
responsive representation or the shared `ResponsiveTable`/`TechnicalDialog`
contracts reopen the applicable certification gates.
