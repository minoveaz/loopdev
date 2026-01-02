
# Multi-Level Sidebar

**Description:** Vertical navigation component with expandable groups, supporting infinite nesting depth via recursion. Manages expansion states for folders and active states for leaf nodes.

## 🚀 Usage

```tsx
import { MultiLevelSidebar } from './index';

const items = [
  { id: '1', label: 'Home' },
  { 
    id: '2', 
    label: 'Products',
    children: [
      { id: '2-1', label: 'Electronics' },
      { id: '2-2', label: 'Books' }
    ]
  }
];

<MultiLevelSidebar items={items} />
```

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `SidebarItem[]` | **Yes** | Recursive array of objects containing `id`, `label`, and optional `children`. |
| `className` | `string` | No | Additional CSS classes for the main container. |

### Type Definition: SidebarItem
```typescript
interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  children?: SidebarItem[];
}
```

## 🧠 Logic (useMultiLevelSidebar)

Business logic is isolated in `useMultiLevelSidebar.ts`.

**State:**
*   `activeId`: String (undefined by default). Tracks the currently selected leaf node.
*   `expandedIds`: `Set<string>`. Tracks which parent nodes are open.

**Methods:**
*   `handleItemClick(id, hasChildren)`: Toggles expansion if the item has children, otherwise sets the `activeId`.
*   `isExpanded(id)`: Returns boolean check against the `expandedIds` set.

## 🧩 Atomic UI (components.tsx)

Presentational components extracted from `pages/system/NavigationStructure.tsx`:

*   `SidebarContainer`: Main wrapper with fixed width (48), border, and shadow.
*   `SidebarHeader`: Visual placeholder for brand/title area (circle + line).
*   `NavItem`: Interactive row. Handles visual states for:
    *   **Default:** Standard hover effects.
    *   **Active Leaf:** Highlighted background and text color.
    *   **Expanded Parent:** Specific styling used in the original prototype (open folder look).
*   `NestedContainer`: Wrapper for children items to provide indentation/padding.

## 🛡️ Enterprise Hardening (A11y)

*   **ARIA Roles:** Uses `role="tree"`, `role="treeitem"`, and `role="group"` to define hierarchy for screen readers.
*   **Keyboard Support:** All items are focusable (`tabIndex="0"`) and activatable via `Enter` or `Space` keys.
*   **Focus Visibility:** Added specific `focus-visible` ring styles to maintain visual accessibility without overriding custom design aesthetics.

## ⚠️ Integration Notes

*   **Recursion:** The component uses a recursive helper `SidebarItemRenderer` in `index.tsx` to render nested lists.
*   **Visual Fidelity:** The design strictly follows the "Multi-level Sidebar" card from the `NavigationStructure` static page.
