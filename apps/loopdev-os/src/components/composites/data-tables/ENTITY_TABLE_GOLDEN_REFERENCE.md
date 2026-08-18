# EntityTable Golden Reference

- Component: `EntityTable`
- Reference status: `pending human visual approval`
- Owner: `frontend-platform`
- Implementation: `apps/loopdev-os/src/components/composites/data-tables/EntityTable.tsx`
- Composition boundary: `apps/loopdev-os/src/components/composites/data/FiltersActions.tsx`
- Table mechanics: `ds/packages/ui/src/components/composites/content/ResponsiveTable/index.tsx`
- Visual captures: `e2e/entity-table-golden.visual.spec.mjs-snapshots/`
- Executable contract: `apps/loopdev-os/src/components/composites/data-tables/entityTableGoldenReference.ts`
- Contract test: `apps/loopdev-os/src/components/composites/data-tables/entityTableGoldenReference.test.ts`
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`

## Purpose

This document is the visual source of truth for CRM data-table compositions. It
is not a second implementation and it does not certify `ResponsiveTable` by
itself. New compositions must reuse this structure and vary only their typed
content, state and domain-specific interaction pattern.

The executable contract is authoritative for required planes, shared slots,
semantic token roles, responsive viewports and EntityTable-specific differences.
This Markdown document explains the intent and review criteria; it must not
introduce requirements that are absent from the TypeScript contract without
updating the contract test.

## Exact anatomy

```text
SuiteCanvas / CRM workspace
└── EntityTable composition
    ├── context header plane
    │   ├── title: Customer records
    │   ├── result count
    │   └── primary page action: Create customer
    ├── control plane
    │   ├── dominant search field
    │   ├── frequent filter controls
    │   ├── advanced filter action when applicable
    │   ├── clear actions when a query is active
    │   └── active-filter summary/chips
    ├── selection/action plane
    │   ├── selected count
    │   ├── bulk actions
    │   └── clear selection
    ├── data plane
    │   ├── semantic table caption/name
    │   ├── technical table header
    │   ├── identity-first rows
    │   ├── semantic status cells
    │   └── row actions separated from row activation
    └── navigation/state footer
        ├── result range
        ├── current page
        ├── rows per page
        └── previous/next controls
```

## Visual contract

- The composition is transparent around its owned planes; it does not add an
  unrelated outer card around the complete workspace.
- The control plane is quieter than the data plane, but search is the dominant
  control and receives the flexible desktop width.
- The data surface has one technical outer boundary, a stronger header
  separator and subtle full-width row separators.
- The primary identity uses `text-main` and stronger typography; metadata and
  counts use `text-muted`.
- Status uses semantic `Badge` treatment. Color is not the only state signal.
- Hover, focus, active and selected rows remain distinct. Selection may use a
  primary inset marker and stronger surface tone, but never arbitrary decoration.
- Footer geometry is stable and belongs to the data plane composition. It is
  not an unrelated generic card or detached toolbar.
- Interactive controls preserve the 44px target and visible keyboard focus.
- No gradients, local palette, arbitrary shadow or table-specific hardcoded
  color is permitted.

## Density and geometry

- Comfortable repeated-work density is the baseline.
- Header and row geometry must remain stable across ready, loading, empty and
  filtered-empty states.
- The first column answers "what is this record?" and receives the strongest
  hierarchy.
- Status, owner and secondary metadata follow identity in a stable order.
- Pagination remains aligned to the data surface and does not introduce a
  second visual language.

## Responsive reference

- Desktop: semantic table with all reviewed CRM columns and bounded internal
  overflow where needed; page-level horizontal overflow is prohibited.
- Mobile: identity-first semantic row/list preserving record name, priority
  metadata, status and primary action; it is not a shrunken desktop table.
- Mobile-compact: the same reading order and action discoverability at 320px;
  controls wrap without overlap or layout shift.
- Search becomes the first full-width control. Filters/actions collapse into a
  compact, labelled interaction row or sheet.

## Shared versus EntityTable-specific

### Shared by future CRM table compositions

- context/control/data/footer plane hierarchy;
- technical surface, border, spacing and density tokens;
- identity-first typography rules;
- semantic status treatment;
- sorting, pagination, focus and state placement;
- responsive containment and mobile reading-order rules;
- Axe, source-contract, Playwright and visual-review gates.

### Specific to EntityTable

- customer-record title and copy;
- customer identity, segment, owner, email, region and last-updated columns;
- create-customer page action;
- assign-owner and export bulk actions;
- customer-specific filters and recovery labels;
- customer row action and detail-panel behavior.

## Approval gate

The captures in `e2e/entity-table-golden.visual.spec.mjs-snapshots/` are
reproducible comparison artifacts, not automatic approval. A human reviewer
must approve the desktop, mobile and compact-mobile references before Phase A
is closed. Any future composition is compared against these captures and this
contract before it can enter its own certification gate.
