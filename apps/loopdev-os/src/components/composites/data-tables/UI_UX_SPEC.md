# UI/UX Specification: Data table compositions

- Implementation: `apps/loopdev-os/src/components/composites/data-tables`
- Owner: `frontend-platform`
- Status: `certified`; all five CRM data-table compositions have formal
	certification closures for their reviewed contracts.
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`

## Scope

These are five independently certifiable CRM data compositions. The showcase
only composes and presents them; it does not own their implementation.

- `EntityTable`: identity-first records with controlled filters and search.
- `DenseOperationalTable`: sortable and paginated operational records.
- `QuantitativeTable`: aligned metrics, deltas and targets.
- `ActivityTable`: chronological events with actor, date and status.
- `SelectionTable`: visible-page selection and contextual bulk actions.

`DenseOperationalTable` is implemented as a focused typed composition over the
`ResponsiveTable` surface. It supplies operational fixture defaults while
allowing consumers to provide rows, columns and pagination options; sorting,
pagination, states and responsive mechanics remain delegated to the shared
table primitive. It intentionally does not add `FiltersActions`, search or
domain filters because its workflow is repeated operational scanning.

## Shared visual contract

Use existing LoopDev semantic tokens and primitives. The composition owns no
private palette, gradients or domain data outside its fixture. Use one workspace
surface boundary, technical separators for structure, subtle row dividers,
text hierarchy for identity versus metadata, and semantic color only for state,
focus, selection and actions. Preserve stable geometry, 44px interaction targets
and readable density across desktop and compact mobile.

## Responsive contract

Entity and activity compositions must provide an identity-first mobile row/list
when column comparison is not useful. Quantitative comparison may use bounded
horizontal overflow, never page-level overflow. Selection preserves its scope
and actions on mobile. Desktop and mobile representations must not duplicate at
the same breakpoint.

## Evidence required before certification

Each component requires focused unit/Axe tests, desktop/mobile/compact-mobile
Playwright evidence, ready/loading/skeleton/empty/filtered-empty/error/forbidden
and offline states where applicable, source-contract validation and registry
ownership evidence. Reopen on changes to data ownership, responsive strategy,
state semantics, accessibility, tokens or primitive contracts.

## DenseOperationalTable evidence

- Implementation: `apps/loopdev-os/src/components/composites/data-tables/DenseOperationalTable.tsx`.
- Primitive boundary: `ds/packages/ui/src/components/composites/content/ResponsiveTable/index.tsx`.
- Focused consumer test: `apps/loopdev-os/src/components/composites/data-tables/DenseOperationalTable.test.tsx`.
- Current evidence: focused consumer test passes; sorting, pagination, Axe and
	responsive containment pass in the desktop/mobile/mobile-compact matrix.
- Certification blocker: the generated screenshot is only a technical
- baseline for the visual review. The composition was approved against the
	`EntityTable` data-surface hierarchy, header/row geometry, status treatment,
	action placement and mobile transformation on `2026-08-16`. It was not
	judged against EntityTable's CRM toolbar or filter plane because those are
	not part of this workflow.

## QuantitativeTable evidence

- Implementation: `apps/loopdev-os/src/components/composites/data-tables/QuantitativeTable.tsx`.
- Focused consumer test: `apps/loopdev-os/src/components/composites/data-tables/QuantitativeTable.test.tsx`.
- Playwright evidence: `e2e/quantitative-table.visual.spec.mjs` across desktop,
	mobile and mobile-compact, including metric alignment, progress semantics,
	Axe and responsive containment.
- Visual approval: explicit human approval recorded on `2026-08-16`.

## Mandatory composition standard

Every new data-table composition must begin from the approved `EntityTable`
visual language and select only the planes required by its workflow.
`DataTable` and `ResponsiveTable` provide mechanics; they must not be used as a
reason to produce a generic standalone table. Before a composition can be
certified, its implementation must demonstrate the relevant approved visual
language for:

- transparent composition boundary and technical data surface;
- search/filter/action plane hierarchy and spacing;
- identity-first row typography and metadata hierarchy;
- semantic status treatment, selected/active/hover/focus states;
- stable density, separators and pagination geometry;
- deliberate mobile transformation rather than an accidental fallback.

The visual baseline is evidence for comparison only. Certification requires an
explicit human visual approval of the rendered composition.

The Phase A golden reference for future CRM table compositions is documented
in `apps/loopdev-os/src/components/composites/data-tables/ENTITY_TABLE_GOLDEN_REFERENCE.md`
and enforced by the executable contract in
`apps/loopdev-os/src/components/composites/data-tables/entityTableGoldenReference.ts`.
