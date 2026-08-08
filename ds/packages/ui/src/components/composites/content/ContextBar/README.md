# ContextBar

Use `ContextBar` for compact operational context that applies to the current view, such as the active brand, workspace, or filter scope.

Keep primary page actions in `PageHeader` or a module toolbar. Use `leading` and `trailing` for caller-owned visual and interactive slots.

```tsx
<ContextBar label="Active brand" value="VitaBlue" trailing={<Button>Change</Button>} />
```
