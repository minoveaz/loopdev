# LoadingState

Use `LoadingState` while a view is waiting for data. It exposes `role="status"` and `aria-busy="true"` and keeps the loading skeleton layout-independent.

Use `EmptyState` for a completed request with no content. Use an error state for a failed request; do not represent errors as loading.

```tsx
<LoadingState label="Loading brands" lines={3} />
```
