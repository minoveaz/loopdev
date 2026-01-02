
# Empty State

**Description:** A placeholder component used when data is missing, a search yields no results, or a fresh state is encountered. It guides the user toward the next actionable step.

## 🚀 Usage

```tsx
import { EmptyState } from './index';

<EmptyState 
  title="No Projects"
  description="You haven't created any projects yet."
  action={<button>Create Project</button>}
/>
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Yes** | Primary heading. |
| `description` | `ReactNode` | **Yes** | Contextual explanation. |
| `icon` | `string` | `'search_off'` | Material Symbol icon name. |
| `action` | `ReactNode` | - | Primary call-to-action button. |
| `size` | `'sm' | 'md'` | `'md'` | Adjusts padding and icon scale. |
| `iconBadge` | `string` | - | Optional small badge (e.g. "?") on the icon. |

## 🧩 Atomic UI (components.tsx)

*   `EmptyStateContainer`: Flex container with optional border/shadow based on size.
*   `EmptyStateIcon`: Circular icon wrapper with hover scale effect.
*   `EmptyStateContent`: Typography wrapper for title and description.

## 🛡️ Enterprise Standards

*   **Visual Hierarchy:** Uses muted text colors to avoid competing with actual content.
*   **Flexibility:** Supports custom actions (buttons, links) passed as React Nodes.
