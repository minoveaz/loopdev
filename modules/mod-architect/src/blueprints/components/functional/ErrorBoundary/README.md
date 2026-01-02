
# Error Boundary

**Description:** A React component that catches JavaScript errors anywhere in their child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

## 🚀 Usage

Wrap any complex functional component (like DataTables, Charts, or third-party integrations) with the ErrorBoundary to ensure a single crash doesn't break the entire app.

```tsx
import { ErrorBoundary } from './index';
import { ComplexWidget } from './ComplexWidget';

<ErrorBoundary>
  <ComplexWidget />
</ErrorBoundary>
```

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | **Yes** | The components to be protected. |
| `fallback` | `ReactNode` | No | Custom UI to display when an error occurs. If not provided, a default Design System alert is shown. |
| `onError` | `(error, info) => void` | No | Callback function for logging errors to services like Sentry or Datadog. |

## 🎨 Default UI

The default fallback uses the system's `red` and `surface` tokens:
*   **Icon:** `error_outline` in a red circle.
*   **Action:** A "Try Again" button that attempts to re-render the children.
*   **Dev Mode:** Shows the stack trace in a code block during development.

## 🛡️ Enterprise Integration

This component is critical for:
1.  **Resilience:** Preventing white-screen-of-death.
2.  **Observability:** Hooking into the `onError` prop allows centralized logging.
3.  **UX:** Providing a graceful degradation path.
