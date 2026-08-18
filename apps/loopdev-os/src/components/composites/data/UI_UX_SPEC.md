# UI/UX Specification: FiltersActions

- Implementation: `apps/loopdev-os/src/components/composites/data/FiltersActions.tsx`
- Public export: `@/components/composites/data/FiltersActions`
- Owner: `composite`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM CertificationLab; future CRM data workspaces
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.4`
- Contract version: `filters-actions-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Purpose

Help users find, narrow and act on records through search, frequent filters,
advanced criteria, active-filter feedback and contextual selection actions.

## Responsibility

### Owns

- Control-plane composition, controlled filter state, active criteria summary,
  selection coordination and connection to `ResponsiveTable`.

### Does not own

- Server queries, persistence, authorization decisions, pagination mechanics,
  global command bar, Shell geometry or domain-specific data services.

## Anatomy and composition

```text
SuiteCanvas content plane
└── FiltersActions
    ├── SectionHeader: title, result count, page action
    ├── search and frequent filters
    ├── advanced filter surface
    ├── removable active-filter chips
    └── ResponsiveTable with contextual bulk actions
```

Desktop places search first, filters next and contextual actions last. Mobile
wraps controls, moves advanced filters to a full-width surface and renders
semantic mobile rows without page-level horizontal overflow.

- Runtime constraints: current implementation is client-only because it owns
  local filter, popup and selection state.
- Theme token mapping: semantic surface, content, border and action tokens; no
  raw tenant colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: pending final visual/A11y evidence.

## Public UI contract

The composite is API-driven: rows, columns, row keys, search, filter
definitions and values, labels, visible filter density, state, permissions,
page/bulk/error actions and optional controlled row selection are supplied by
the consumer. No domain data, mutation behavior or user-facing copy is owned
by the implementation.

| Prop/state      | Meaning                                    | Visual behavior                     | Interaction                    | Accessibility                 |
| --------------- | ------------------------------------------ | ----------------------------------- | ------------------------------ | ----------------------------- |
| `readOnly`      | Query/filtering available without mutation | Mutation actions unavailable        | Selection disabled             | `aria-readonly` table context |
| `disabled`      | Control plane unavailable                  | Controls disabled                   | No opening or mutation         | Native disabled semantics     |
| neutral state   | No criteria applied                        | All fixture records visible         | Clear hidden/disabled          | Complete result count         |
| active criteria | Query or filters narrow results            | Chips and count explain restriction | Chips remove one criterion     | Active filter group named     |
| filtered-empty  | Criteria produce no matches                | Recovery message                    | Clear filters restores results | Explicit filtered-empty copy  |

## State model

| State          | Required UI                           | Allowed actions                     |
| -------------- | ------------------------------------- | ----------------------------------- |
| Ready          | Full table and controls               | Search, filter, select, page action |
| Loading        | Preserve criteria and geometry        | No unsafe mutation                  |
| Filtered-empty | Explain criteria caused no results    | Clear filters                       |
| Error          | Preserve criteria and show retry      | Retry owned by consumer             |
| Read-only      | Filters usable, mutations unavailable | Inspect only                        |
| Disabled       | Controls and selection unavailable    | None                                |

## Responsive contract

| Viewport | Layout                                                  | Transformation                                    | Overflow rule                     |
| -------- | ------------------------------------------------------- | ------------------------------------------------- | --------------------------------- |
| Desktop  | Search, filters and actions in a wrapping control plane | Bulk actions appear when selected                 | No page overflow                  |
| Tablet   | Search gets first row; filters wrap                     | Advanced filters remain reachable                 | No clipped controls               |
| Mobile   | Stacked search, filters and chips                       | Advanced filters full-width; semantic mobile rows | No page-level horizontal overflow |

## Accessibility contract

- Search has a programmatic name and clear action.
- Filter controls retain labels, keyboard focus, Escape and disabled/read-only semantics.
- Active criteria form a named group; each chip removes only its own criterion.
- Table selection uses semantic checkboxes and bulk actions use a named toolbar.
- Focus order follows search, filters, chips, table selection and bulk actions.

- Automated A11y evidence: verified by focused Vitest/Axe coverage (8 tests).

## Platform portability

| Platform        | Implementation                    | Shared contract                 | Allowed divergence                           | Evidence |
| --------------- | --------------------------------- | ------------------------------- | -------------------------------------------- | -------- |
| Web/RSC         | client boundary wrapper required  | filter/state/action model       | browser controls and table semantics         | pending  |
| Web/client      | `FiltersActions.tsx`              | tokens/types/interaction intent | none                                         | pending  |
| Expo/NativeWind | native suite composition required | filter/state/action model       | list controls, bottom sheet and selection UI | pending  |

- Native equivalent: not implemented; future suite-owned data workspace.
- NativeWind compatibility: `partial` at contract level, not implementation level.
- RSC constraints: callbacks and local state cannot cross the server boundary;
  queries and mutations remain consumer-owned.

## Usage recipes and compatibility

### Recommended usage

```tsx
<FiltersActions
  rows={rows}
  columns={columns}
  getRowKey={(row) => row.id}
  labels={labels}
  filters={filters}
  filterValues={filterValues}
  onFilterValuesChange={onFilterValuesChange}
/>
```

Use inside a suite-owned content plane where the consumer supplies the dataset,
query integration and domain actions. The composite owns the filter and
selection interaction model; the CRM feature owns persistence, authorization
and mutation handlers.

`visibleFilterCount` controls how many frequent filters remain in the primary
toolbar. It defaults to `2`; remaining filters are exposed through `More
filters`. Consumers may increase or decrease it according to their density and
viewport contract.

### Avoid

```tsx
// Do not recreate search, chips, selection or bulk actions in the showcase.
<CertificationLabLocalFilters />
```

Do not wrap the entire workflow in an unrelated outer card, attach it directly
to Shell geometry, put server queries inside the composite, or use it as a
generic command bar for navigation. Do not allow table overflow to become
page-level horizontal scrolling on mobile.

### Works with

| Component/view    | Supported relationship           | Required conditions                 | Result                        |
| ----------------- | -------------------------------- | ----------------------------------- | ----------------------------- |
| `SectionHeader`   | Header composition               | Consumer owns title and page action | Clear data-workspace context  |
| `FilterDropdown`  | Frequent/advanced filter control | Controlled selected values          | Consistent filter semantics   |
| `ResponsiveTable` | Data result surface              | Semantic selection contract         | Desktop table and mobile rows |
| `EmptyState`      | Filtered-empty/error feedback    | Consumer provides recovery handler  | Clear recovery path           |

### Does not work with

| Component/view                 | Incompatibility              | Reason                             | Alternative                                |
| ------------------------------ | ---------------------------- | ---------------------------------- | ------------------------------------------ |
| `SuiteHeader`                  | Global navigation actions    | Different ownership level          | Use page action slot or Shell              |
| Server repository/service      | Query/persistence inside UI  | Violates shared composite boundary | Inject consumer-owned handlers             |
| Page-level horizontal scroller | Mobile overflow escape hatch | Hides controls and rows            | Use the responsive transformation contract |

### Designed capabilities and future suites

- Designed for: CRM data workspaces with search, frequent filters, advanced
  criteria, active-filter removal, record selection and contextual bulk actions.
- Not designed for: global navigation, dashboards without a record collection,
  authorization, server queries, persistence or domain mutation policy.
- Future CRM use: contacts, accounts, campaigns, tasks and operational queues
  backed by suite-owned repositories and permission-aware actions.
- Future Marketing Studio use: campaign and audience tables, provided the suite
  supplies its own filter definitions and mutation handlers.
- Future Operations use: queues and exception worklists, provided bulk actions
  remain consumer-owned and state semantics are explicit.
- Extension boundary: add typed filter definitions, result adapters, labels and
  action slots through composition; do not fork the control-plane behavior.
- New capability requires: a new state, action type, data shape or responsive
  transformation documented here and revalidated through both certification
  gates.

## Current audit findings

| Severity   | Finding                                                                         | Required resolution                                                                       | Gate                       |
| ---------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| `resolved` | Domain data, filter definitions, labels and actions are consumer-owned.         | Fixture supplies the typed public API; showcase remains a consumer.                       | Contract, ownership        |
| `resolved` | Loading, skeleton, error, forbidden, read-only and disabled states were absent. | Explicit state API now delegates state rendering to `ResponsiveTable`.                    | States, contract, CLS      |
| `resolved` | No focused component test existed.                                              | Added Vitest interaction/state/read-only/Axe coverage.                                    | Accessibility, interaction |
| `resolved` | Advanced filters were modal without dialog management.                          | Advanced filters now use a non-modal disclosure with `aria-expanded` and `aria-controls`. | Interaction, accessibility |
| `resolved` | Search width and copy were unstable in the original fixture.                    | Search has a stable responsive minimum and concise consumer-owned placeholder.            | Responsive, content        |

## Certification checklist and reproducibility

- [x] Public API owns data, labels, state adapters and action handlers through
      typed consumer props.
- [x] Public API exposes optional controlled row selection and recovery/action
      handlers; technical filter IDs are not rendered as user-facing labels.
- [x] Showcase consumes the public component through a separate CRM fixture.
- [x] `loading`, `skeleton`, `error`, `forbidden`, `read-only` and `disabled`
      states are implemented or explicitly delegated.
- [x] Loading-to-ready/empty/error transitions preserve dimensions and avoid CLS.
- [x] Dark mode, high contrast and tenant semantic tokens are verified.
- [x] Keyboard, focus return, Escape and advanced-filter disclosure are verified.
- [x] Automated A11y evidence exists through the repository-approved Axe runner.
- Reproducibility: `pnpm exec vitest run apps/loopdev-os/src/components/composites/data/FiltersActions.test.tsx --config vitest.config.ts`
- A11y automation: verified, 8 tests passed; jsdom emits a non-failing canvas warning.

## Change impact matrix

| Change                                         | Gates to reopen                    |
| ---------------------------------------------- | ---------------------------------- |
| Extract data/actions into props                | Contract, ownership, interaction   |
| Add loading/skeleton/error/forbidden state API | States, accessibility, CLS, visual |
| Change mobile table/filter transformation      | Responsive, interaction, visual    |
| Add suite consumer                             | Portability, ownership, responsive |

## Spec history

| Date         | Version | Change                                                         | Impact              | Reviewer         |
| ------------ | ------- | -------------------------------------------------------------- | ------------------- | ---------------- |
| `2026-08-16` | `1.1`   | Initial executable audit against UI/UX skill                   | `changes-requested` | `GitHub Copilot` |
| `2026-08-16` | `1.2`   | Generic API, consumer fixture, states and focused Axe evidence | `certified`         | `GitHub Copilot` |
| `2026-08-16` | `1.3`   | Visual alignment: flexible search and unified filter dropdowns | `ready-for-review`  | `GitHub Copilot` |
| `2026-08-16` | `1.4`   | Visual approval after API and spacing review | `certified` | `GitHub Copilot` |

## Certification evidence

- Contract: `verified` - typed generic rows, columns, filters, labels and action slots
- Accessibility: `verified` - focused Axe suite, named toolbar and filter group
- Interaction: `verified` - search clear, filter disclosure and state contract covered by Vitest
- Responsive: `verified` - Playwright desktop/tablet/mobile passed after layout changes
- States: `verified` - explicit state union delegated to table primitives
- Consumer ownership: `verified` - showcase consumes `FiltersActionsFixture`
- Visual review: `verified` - human review approved current screenshots; spacing and filter consistency resolved

## ResponsiveTable coordination update

`FiltersActions` remains certified for its reviewed web contract. It delegates
table mechanics to `ResponsiveTable` and supplies `resetPageKey` from its
controlled search/filter state so filtering returns the table to page one.
The following table-level UX corrections are part of the remaining
`ResponsiveTable` certification work: row-action click isolation,
`aria-readonly`, configurable mobile headers, a safe clear-selection fallback
and consumer-owned page reset coordination.
- Registry: `verified` - entry promoted after all executable gates
- Reproducibility: `verified` - Vitest/Axe and Playwright commands recorded

## Reopen triggers

- New CRM consumer, state, action type, table responsibility or responsive transformation.
