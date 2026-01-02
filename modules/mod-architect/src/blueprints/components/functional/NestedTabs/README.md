
# Nested Tabs

**Description:** A secondary navigation pattern used to organize related content views within a single context card or section. It uses a contained style distinct from primary page tabs.

## 🚀 Usage

```tsx
import { NestedTabs } from './index';

const tabs = [
  { id: 'overview', label: 'Overview', content: <div>Overview Content</div> },
  { id: 'structure', label: 'Structure', content: <div>Structure View</div> },
  { id: 'settings', label: 'Settings', content: <div>Settings Panel</div> }
];

<NestedTabs items={tabs} defaultActiveId="structure" />
```

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `TabItem[]` | **Yes** | Array of tab objects (id, label, content). |
| `defaultActiveId` | `string` | No | ID of the tab active by default. Defaults to first item. |
| `className` | `string` | No | Additional CSS classes for the container. |

### Type Definition: TabItem
```typescript
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}
```

## 🧠 Logic (useNestedTabs)

Business logic is isolated in `useNestedTabs.ts`.

**State:**
*   `activeTabId`: String. Tracks currently selected tab.

**Methods:**
*   `handleTabClick(id)`: Updates active state.

## 🧩 Atomic UI (components.tsx)

Presentational components extracted from `pages/system/NavigationStructure.tsx`:

*   `TabContainer`: Wrapper with white background, border radius, and shadow.
*   `TabList`: Flex container for headers with bottom border.
*   `TabTrigger`: Clickable header. Handles visual states:
    *   **Active:** Primary text, bold, bottom primary border, subtle blue background.
    *   **Inactive:** Slate text, hover gray background.
*   `TabContentContainer`: Content area with subtle gray background.

## ⚠️ Integration Notes

*   **Visual Fidelity:** Matches the "Nested Tabs" card in the Design System perfectly.
*   **Scroll:** `TabList` includes `overflow-x-auto` to handle many tabs gracefully on small screens.
