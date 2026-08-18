# SectionHeader

Use `SectionHeader` for the title and local action of a content section inside a page composition.

Keep page-level orientation and actions in `PageHeader`. Keep section content and state below `SectionHeader`; the component does not create a surface or own domain permissions.

```tsx
<SectionHeader
  title="Customer activity"
  action={
    <Button variant="outline" size="sm">
      Refresh
    </Button>
  }
/>
```

## Contract

- Renders a configurable semantic heading (`h2` by default).
- Accepts an optional icon and caller-owned action slot.
- Uses shared border and text tokens.
- Keeps interaction, permission and state decisions in the consuming feature.

## Evidence

- `SectionHeader.test.tsx` covers semantic heading output, action rendering and Axe.
- `composition-showcase` consumes the component inside `SuiteCanvas`.
