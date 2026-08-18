---
title: Component alignment matrix
status: baseline-complete
owner: frontend-platform
reviewed_at: 2026-08-15
---

# Component alignment matrix

This is the first evidence snapshot for the UI alignment baseline. It records
the current implementation, not only the target architecture. The matrix must
be expanded before CRM components are created.

## Inventory reconciliation

The physical inventory currently includes these ownership families:

| Family | Current groups | Alignment decision |
| --- | --- | --- |
| Platform atoms | `feedback`, `foundations`, `indicators`, `inputs`, `navigation`, `surfaces` | Candidate shared foundation; audit tokens and evidence |
| Platform composites | `content`, `inspector`, `navigation`, `shell`, `utilities`, `visualizations`, `workspace` | Keep platform-owned; map to recipes and slots |
| Product-specific | `trading` atoms and composites | Keep outside CRM; do not use as CRM precedent without an agnostic contract |
| Registry legacy/migration | Entries without complete contract, test or documentation evidence | Status must not imply certification until gaps are resolved |

The physical inventory is broader than the 71-entry registry snapshot. The
registry remains canonical for governance, but the difference is now an
explicitly classified reconciliation result rather than an assumed one-to-one
mapping.

## Complete physical-to-registry reconciliation

Reconciliation performed on 2026-08-15 against every component directory under
`ds/packages/ui/src/components` and every `implementation` path in
`docs/registries/frontend-components.json`. Barrel directories (`atoms`,
`composites` and category folders) are excluded from component counts.

| Set | Count | Decision |
| --- | ---: | --- |
| Physical component directories | 103 | Canonical implementation inventory |
| Registry implementation entries | 71 | Canonical governance inventory |
| Physical components without registry entry | 44 | Explicitly classified below; no automatic certification |
| Registry entries without physical implementation | 12 | Mark as stale/external and assign registry cleanup |

### Physical components without registry entry

| Group | Components | Destination |
| --- | --- | --- |
| Shared data/content candidates | `LoadingState`, `Select`, `FilterDropdown`, `IndustrialBreadcrumbs`, `TrailingControl`, `ContextBar`, `PageHeader`, `ResponsiveTable`, `SectionHeader`, `DataTable`, `Spacer`, `MobileSuiteNav`, `OrganizationSwitcher`, `SidebarFlyout` | Add registry entries only after contract, consumer and evidence review; `DataTable` and `Spacer` remain Phase 1 audit work |
| Shared shell/runtime candidates | `ModuleContextPanel`, `ModuleContextSidebar`, `ModuleShell`, `PlatformHeader`, `SuiteRuntime`, `SuiteShell`, `PlatformContextPanel`, `TechnicalDialog`, `CompositionGrid`, `KanbanBoard`, `SuiteCanvas`, `SuiteLaunchpad` | Platform follow-up; map ownership and certification evidence before registry promotion |
| Shared visual/indicator candidates | `IndustrialMetric`, `NextEvalTimer`, `PositionProgressBar`, `PositionQuickActions`, `ProximityIndicator`, `PulseSparkline`, `TechnicalIndicator`, `IconRegistry` | Inventory only; classify as shared, experimental or product-specific during component audit |
| Trading-specific | `AssetSelector`, `LivePriceLabel`, `ActivityStream`, `BotCard`, `CreateStrategyModal`, `PositionsDataTable`, `RiskMeter`, `StrategyCard` | Explicitly excluded from CRM; maintain under trading ownership and do not use as CRM precedent |
| Inspector implementation | `inspector/blocks` | Verify whether this is a component family or barrel implementation; platform follow-up |

### Registry entries without physical implementation

The following twelve entries are not present at their registry implementation
paths. Nine point to the Marketing Studio Brand Hub under
`apps/loopdev-os/src/suites/marketing-studio/brand-hub/components` and three
point to shared paths that currently have no matching component directory:

`ClaimList`, `ClaimsGovernanceBlock`, `ColorContextBar`, `ColorTokenCard`,
`NarrativeBlock`, `StructuredTextField`, `TokenGroupSection`,
`ToneProfileCard` and `VoiceToneBlock`; plus `Motion`, `ZIndex` and
`Illustrations`. They must be classified as suite-owned, moved to the current
implementation path, or removed from the frontend registry; they must not be
treated as shared design system components until that decision is recorded.

### Reconciliation decisions

- The registry remains the governance source, but physical presence alone does
  not imply `stable` or `certified` status.
- Every unregistered physical component now has an explicit destination:
  evidence-gated registry promotion, platform follow-up, inventory-only,
  trading exclusion or implementation-family review.
- Every registry-only implementation path now has an explicit cleanup or
  migration destination; no stale entry is silently counted as implemented.
- New shared components such as `DataTable` and `Spacer` must complete the
  Component Design Audit before registry promotion.
- The matrix is complete for Phase 0A inventory reconciliation. Certification,
  registry promotion and physical cleanup remain Phase 1/platform follow-up.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `implemented` | The documented contract is visible in the current code and evidence is available. |
| `legacy` | The component is used or maintained but predates the current Shell/recipe contract. |
| `migration-required` | The component is valid in purpose but violates a current visual or ownership rule. |
| `platform-follow-up` | The gap requires a shared token, recipe, runtime or registry decision. |

## Representative baseline

| Component | Current path | Current path/mode | Visual source | States/evidence | Current status | Destination |
| --- | --- | --- | --- | --- | --- | --- |
| `TechnicalCard` | `ds/packages/ui/src/components/atoms/surfaces/TechnicalCard` | shared surface | local variants plus surface intent | tests/registry to verify | migration-required | adapt to surface contract |
| `ModuleCard` | `ds/packages/ui/src/components/composites/workspace/ModuleCard` | suite-home/workspace | local grid, gradient, card layout | fixture/evidence to verify | legacy | reuse or replace with approved surface composition |
| `ModuleHeader` | `ds/packages/ui/src/components/composites/workspace/ModuleHeader` | `ModuleWorkspace` header | shared atoms plus local layout | tests/registry to verify | legacy | map to SuiteCanvas header region |
| `ModuleToolbar` | `ds/packages/ui/src/components/composites/workspace/ModuleToolbar` | `ModuleWorkspace` toolbar | shared atoms plus local selection treatment | tests/registry to verify | legacy | map to recipe toolbar region |
| `SuiteCanvas` | `ds/packages/ui/src/components/composites/workspace/SuiteCanvas` | `overview`, `data`, `workspace`, `split`, `board`, `full-bleed` | structural runtime boundary | focused tests present | implemented | enforce recipe behavior incrementally |
| `AppShell` | `ds/packages/ui/src/components/composites/shell/AppShell` | platform Shell | token-backed layout with inline runtime dimensions | tests/registry to verify | implemented with exception | document dynamic CSS variable exception |
| `ModuleWorkspace` | `ds/packages/ui/src/components/composites/workspace/ModuleWorkspace` | legacy module workspace | token-backed layout with legacy panel path | active consumers in `ModuleShell`, quant-ops and Marketing Studio | migration-required | exclude from CRM; archive only through a separate platform migration |
| `SuiteHomeLayout` | `ds/packages/ui/src/components/composites/workspace/SuiteHomeLayout` | suite home/overview | custom hero, grid, modules and activity layout | suite-home/type dependencies exist | migration-required | exclude from CRM; reconcile with `SuiteOverview` before archive |

## Known baseline gaps

- The physical component inventory is larger than the current registry entry
  set; the complete reconciliation remains open.
- Some registry entries declare `stable` or `certified` while evidence fields
  still require contracts, tests or documentation review.
- Recipes exist as contracts, but `SuiteCanvas` does not yet enforce every
  visual property such as density, surfaces and state rendering at runtime.
- Inline styles are acceptable for dynamic CSS-variable layout values only
  when documented as an exception; visual styling must remain token-backed.
- Hardcoded colors, gradients, local shadows and local radii require migration
  review rather than silent acceptance in new components.

## Completion rule

This matrix is complete for the alignment baseline because every physical
component and registry-only path is represented or explicitly classified as
excluded, product-specific, stale, inventory-only or covered by a follow-up.
Each remaining implementation or certification action has a destination in the
reconciliation tables above.

## Phase 0B CRM audit decision

The first CRM reuse candidates are:

| Candidate | Decision | Reason |
| --- | --- | --- |
| `SuiteCanvas` | reuse | Current structural boundary with focused mode tests |
| `AppShell` / `SuiteShell` | reuse | Platform-owned Shell; CRM must provide slots only |
| `PageHeader` / `SectionHeader` | audit then reuse | Likely content primitives; verify contract and consumers |
| `ResponsiveTable` | audit then reuse | Candidate for `DataWorkspace`; verify states and density |
| `TechnicalSurface` | reuse | Canonical surface boundary |
| `TechnicalCard` | adapt before reuse | Current local variants and shadows need surface-contract review |
| `ModuleWorkspace` / `ModuleHeader` / `ModuleToolbar` | exclude from CRM; migrate globally | Active non-CRM consumers exist; do not establish new CRM architecture on this path |
| `SuiteHomeLayout` / `ModuleCard` | exclude from CRM; migrate globally | Suite-home consumers and type dependencies exist; reconcile with `SuiteOverview` before archive |
| `trading/*` | exclude | Product-specific domain, not a CRM reference |

No new CRM component is approved by this audit. The next implementation phase
may only consume the candidates marked `reuse`, or candidates marked `adapt`
after their visual and evidence gaps are resolved.

## Candidate audit findings

| Candidate | Contract finding | CRM decision |
| --- | --- | --- |
| `TechnicalSurface` | Correct ownership boundary for surfaces; `withGrid`, hover aura and inline background texture need documented token/exception treatment. | Reuse as the surface boundary; do not reproduce its CSS locally. |
| `TechnicalCard` | Useful wrapper, but interactive scale, local shadows and status colors bypass the stricter surface contract. | Adapt before reuse; define approved variants and interaction states. |
| `PageHeader` | Tokenized heading, description and actions; no recipe or loading/access state ownership. | Reuse as a content region inside a recipe, not as a Shell/header replacement. |
| `SectionHeader` | Tokenized section label and action slot; local border treatment and no state contract. | Reuse for content sections after visual contract review. |
| `ResponsiveTable` | Generic typed rows and empty state; no loading, error, forbidden, read-only, selection or semantic mobile transformation. | Adapt for `DataWorkspace` before CRM use. |

## Phase 0B block audit

| Block | Reuse decision | Blocking findings |
| --- | --- | --- |
| Foundations | Reuse after token/evidence review | `LpdText`/`Heading` are the typography base; `Divider` is suitable but needs spacing and semantic review; `TechnicalSurface` contains documented texture/inline-style exceptions; `ScrollArea` and `TechnicalTooltip` need focused a11y/portal checks. |
| Controls | Adapt before CRM | `Button` has loading and permission props; `FilterDropdown` uses a clickable `div`, local sizing and local dropdown markup; verify keyboard, Escape, focus and controlled state for all filters. |
| States | Consolidate and adapt | `EmptyState` mixes standard and AI presentation; skeleton presets contain local surfaces and inline styles; verify `LoadingState`, `Skeleton`, `Toast`, `Spinner` and status semantics do not duplicate one another. |
| Data | Adapt before recipes | `ResponsiveTable` lacks most CRM states and semantic mobile transformation; `KanbanBoard` has loading/empty but relies on HTML drag-and-drop without a documented keyboard alternative; `MetricCard` and `ActivityFeed` need domain-neutral contracts. |
| Orientation | Select one canonical contract | `ContextPath` exposes clickable `div` segments and a technical breadcrumb label; compare with `IndustrialBreadcrumbs` and keep one internal-orientation API distinct from Shell navigation. |
| Overlays | Adapt before CRM | `TechnicalDropdown` is Radix-backed and reusable; `TechnicalDialog` has backdrop/close behavior but requires dialog semantics, focus trap, Escape and reduced-motion verification; menu items need consistent disabled/selected keyboard behavior. |
| Identity | Reuse with semantic review | `UserAvatar`, `Badge`, `TechnicalLabel` and `TechnicalStatusBadge` exist, but status, label and identity roles overlap; define canonical semantics before CRM variants. |

### Phase 0B closure

Phase 0B is complete as an audit and scope decision. No block is rejected
wholesale; each block has an ownership decision, CRM destination, known
evidence gap and follow-up path. This closure does not certify the components
or approve them for unrestricted CRM reuse.

| Block | Audit outcome | Phase 1 handoff |
| --- | --- | --- |
| Foundations | Reuse the existing typography, surface, scroll and tooltip base with token and accessibility review | Close `TechnicalSurface`, spacing and portal evidence before promotion |
| Controls | Adapt shared controls; preserve keyboard and focus contracts | Review `FilterDropdown`, `Select`, `Input`, `IconButton` and action surfaces |
| States | Consolidate loading, empty, error, forbidden, read-only and status semantics | Define shared state matrix and remove overlapping presentation |
| Data | Adapt `ResponsiveTable`; keep `KanbanBoard`, metrics and activity domain-neutral | Execute the `DataTable` design audit and data-state handoff before visual recomposition |
| Orientation | Select one internal orientation contract distinct from Shell navigation | Resolve `ContextPath` versus `IndustrialBreadcrumbs` with keyboard evidence |
| Overlays | Reuse Radix-backed primitives after focus, Escape and reduced-motion review | Close dialog/menu/tooltip interaction evidence |
| Identity | Reuse identity primitives after status/label semantic separation | Define canonical status and identity tones before CRM variants |

The remaining gaps are now Phase 1 implementation and evidence work, not
unbounded Phase 0 discovery. CRM adoption remains gated by the applicable
contract, state, accessibility, responsive and visual evidence for each
candidate.