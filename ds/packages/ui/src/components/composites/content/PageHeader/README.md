# PageHeader

Use `PageHeader` for the primary title and orientation of a page or route.

Use `headingAs` only when the surrounding document already owns the `h1`. Keep page actions in `actions`; domain content belongs below the header.

```tsx
<PageHeader
  eyebrow="Marketing Studio"
  title="Brand Hub"
  description="Manage the active brand system."
  actions={<Button>New brand</Button>}
/>
```
