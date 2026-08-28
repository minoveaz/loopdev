# ResponsiveTable

Use `ResponsiveTable` for tabular data that needs a deliberate horizontal-scroll boundary on narrow viewports.

Provide stable column keys and a `getRowKey` for persistent rows. Use
`emptyState`, `loadingState`, `errorState`, `offlineState`,
`forbiddenState` and `disabledState` for consumer-owned state content instead
of putting queries, persistence or authorization logic into the table.

```tsx
<ResponsiveTable columns={columns} rows={brands} getRowKey={(brand) => brand.id} />
```

## Contract

- `columns` supports typed rendering, `sortable` headers and an optional
	`sortAccessor` for values that are not read directly from the row.
- Sorting is controlled with `sortKey`, `sortDirection` and `onSortChange`, or
	remains local when those props are omitted.
- Pagination is controlled with `currentPage`, `pageSize`, `onPageChange` and
	`onPageSizeChange`. `resetPageKey` lets a consumer reset to page one after a
	query or filter changes without making the table own filter state.
- Selection defaults to `selectionMode="page"`. Use `selectionMode="all"` when
	the consumer explicitly owns all-result selection semantics.
- `rowActions` render inside a propagation boundary so nested actions do not
	trigger `onRowClick`.
- `readOnly`, `disabled`, `loading`, `errorState`, `offline` and `forbidden`
	are independent consumer-visible states. Read-only exposes
	`aria-readonly`; disabled exposes `aria-disabled` and prevents selection.
- `renderMobileRow` provides a semantic mobile representation. Its header is
	configurable through `mobileHeaders` or `labels.mobileHeader`.
- The bulk clear action calls `onClearSelection` when provided and otherwise
	falls back to `onSelectedRowKeysChange([])`.

The component owns table mechanics and stable geometry. Consumers own labels,
data fetching, filtering, authorization, mutation actions and recovery.

## Certification evidence

The focused contract suite is
`ResponsiveTable/ResponsiveTable.test.tsx`. It covers state semantics, row
action propagation, read-only and disabled ARIA, configurable mobile headers,
selection fallback, sorting accessors, controlled pagination, page/all
selection and filter-driven page reset. Promotion also requires desktop,
mobile and compact-mobile Playwright evidence, registry evidence and a reviewed
`UI_UX_SPEC.md`.
