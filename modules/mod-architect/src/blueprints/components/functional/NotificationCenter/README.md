
# Notification Center

**Description:** A self-contained widget for displaying system alerts and updates. Manages its own state for reading, dismissing, and clearing notifications.

## 🚀 Usage

```tsx
import { NotificationCenter } from './index';

<div className="relative">
  <NotificationCenter className="w-80" />
</div>
```

## ✨ Features

*   **Atomic Design:** Composed of header, scrollable list, and footer.
*   **Visual States:** Distinct styling for Read vs. Unread items.
*   **Variants:** Supports `info`, `success`, `warning`, and `error` types with semantic colors and icons.
*   **Interactions:** Mark single item as read, mark all read, dismiss item, clear all.
*   **Empty State:** Friendly feedback when list is cleared.

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Additional CSS classes for the main container. |

## 🧠 Logic (useNotificationSystem)

The logic is encapsulated in `useNotificationSystem.ts`. It initializes with mock data (matching the design system source) but is built to accept real data streams.

**Key Methods:**
*   `markAsRead(id)`: Removes the "unread" visual indicators (blue bar/bg).
*   `removeNotification(id)`: Completely removes the item from the list.
*   `markAllAsRead()`: Bulk update.

## 🛡️ Enterprise Standards

*   **Error Boundary:** Wrapped automatically to prevent crashes affecting the parent app.
*   **Theming:** Uses `primary`, `surface`, and semantic color tokens (`red`, `green`, `yellow`) strictly from `tailwind.config.js`. No hardcoded hex values in components.
