# UI/UX Specification: ResponsiveTable

- Implementation: `ds/packages/ui/src/components/composites/content/ResponsiveTable/index.tsx`
- Public export: `@loopdev/ui`
- Owner: frontend-platform
- Runtime: dual-safe presentational composite
- Status: in-progress
- Contract version: `responsive-table-v1`
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Platform target: web

## Purpose

Present tabular records with stable desktop geometry, deliberate narrow-screen
overflow or a consumer-provided semantic mobile row, accessible sorting,
selection, row actions and pagination.

## Ownership

`ResponsiveTable` owns table mechanics, row and column semantics, sorting,
selection mechanics, pagination controls, state presentation and the overflow
boundary. Consumers own data fetching, filtering, authorization, persistence,
labels, recovery actions and domain mutations.

## Public contract

- Columns expose a stable `key`, visible `header`, optional `render`,
  `sortable` and optional `sortAccessor`.
- Sorting may be local or controlled by `sortKey`, `sortDirection` and
  `onSortChange`.
- Pagination may be local or controlled by `currentPage`, `pageSize`,
  `onPageChange` and `onPageSizeChange`.
- `resetPageKey` is a consumer signal for returning to page one after a query
  or filter changes. The table does not own filter state.
- Selection defaults to `selectionMode="page"`; `selectionMode="all"` selects
  every sorted result and requires consumer-owned all-results semantics.
- `rowActions` are isolated from row click propagation.
- `readOnly` and `disabled` prevent selection and expose corresponding ARIA
  state. `loading`, `errorState`, `offline`, `forbidden` and `emptyState` are
  consumer-labelled states.
- `renderMobileRow` supplies semantic mobile content. `mobileHeaders` or
  `labels.mobileHeader` supplies its visible column labels.

## State and interaction matrix

| State | Behavior | Evidence required |
| --- | --- | --- |
| Ready | Rows, sorting, selection and pagination are usable | Unit and E2E |
| Loading/skeleton | Content geometry remains stable and mutation is unavailable | Unit/Axe and E2E |
| Empty/filtered-empty | Consumer recovery content is visible | Unit and E2E |
| Error/offline/forbidden | State content is visible without exposing data | Unit/Axe and E2E |
| Read-only | Records remain readable; selection and mutation controls are unavailable | ARIA and keyboard evidence |
| Disabled | Table controls and selection are unavailable with `aria-disabled` | Unit/Axe evidence |
| Selected/mixed | Page or all-results selection is explicit and not color-only | Keyboard and E2E |

## Responsive contract

Desktop uses a semantic table inside a bounded horizontal-scroll region. Entity
consumers provide `renderMobileRow` for mobile and compact-mobile viewports;
quantitative consumers may retain horizontal comparison when documented. The
page itself must never acquire horizontal overflow. Mobile headers are
consumer-configurable and must not contain domain-specific hardcoded copy.

## Accessibility contract

The table has an accessible caption or name. Sortable headers expose
`aria-sort`; row selection exposes checkbox labels and mixed state; read-only
and disabled states expose `aria-readonly` and `aria-disabled`; focus remains
visible on sorting, selection, row actions and pagination. Nested row actions
must not activate the row click handler.

## Reopen triggers

Reopen the contract for a new selection model, remote sorting or pagination,
new state, new mobile transformation, new suite consumer or changed ownership
of labels, recovery, authorization or mutation actions.

## Evidence plan

- Focused Vitest/Axe: `ResponsiveTable.test.tsx`.
- CRM consumer evidence: `e2e/entity-table.certification.spec.mjs`.
- Required browser matrix: desktop, mobile and mobile-compact.
- Registry: `docs/registries/frontend-components.json`, entry
  `responsive-table-v1`.

Certification requires the focused suite, source-contract and registry checks,
responsive browser evidence, visual review and a complete implementation/API
review. Current status remains `in-progress` until those gates pass.
