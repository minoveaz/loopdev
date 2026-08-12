# ResponsiveTable

Use `ResponsiveTable` for tabular data that needs a deliberate horizontal-scroll boundary on narrow viewports.

Provide stable column keys and a `getRowKey` for persistent rows. Use `emptyState` for domain-specific empty content instead of putting loading or error logic into the table.

```tsx
<ResponsiveTable columns={columns} rows={brands} getRowKey={(brand) => brand.id} />
```
