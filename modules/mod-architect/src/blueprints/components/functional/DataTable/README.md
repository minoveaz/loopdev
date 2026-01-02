
# Advanced Data Table

**Description:** A feature-rich data grid designed for density and flexibility. Supports complex interactions including sorting, filtering, row selection, row expansion, and pagination.

## 🚀 Usage

```tsx
import { DataTable } from './index';

<div className="p-8">
  <DataTable onAddRecord={() => console.log('Add new')} />
</div>
```

## ✨ Features

*   **Sortable Columns:** Click headers to toggle ascending/descending sort.
*   **Search Filtering:** Instant client-side filtering by name, email, or role.
*   **Selection:** Multi-row selection with "Select All" capability for the current page.
*   **Expandable Rows:** Reveal detailed information without navigating away.
*   **Pagination:** Built-in controls for page navigation.
*   **Theming:** Fully compatible with Dark Mode and Design System tokens.

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Additional CSS classes for the container. |
| `onAddRecord` | `() => void` | No | Callback for the "Add Record" button. |

## 🧠 Logic (useDataTable)

Business logic is isolated in `useDataTable.ts`.

**State:**
*   `searchQuery`: String filter.
*   `sortConfig`: Object `{ key, direction }`.
*   `selectedIds`: Set of strings for checkbox state.
*   `expandedId`: String (single row expansion for demo, scalable to Set).
*   `currentPage`: Number.

**Methods:**
*   `handleSort(key)`: Toggles sort direction.
*   `toggleAll()`: Selects/Deselects all visible rows.

## 🧩 Atomic UI (components.tsx)

*   `TableContainer`: Main wrapper with border and shadow.
*   `Toolbar`: Contains Search, Filters, Columns, Export, and Add buttons.
*   `ActiveFilters`: Display area for applied filter chips.
*   `TableHead`: Renders `<thead>` with interactive sort icons.
*   `TableRow`: Renders `<tr>`, handles selection/expansion logic and conditional rendering of detailed view.
*   `Pagination`: Footer with page numbers and row count.

## 🛡️ Enterprise Standards

*   **Error Boundary:** Wrapped to prevent crash propagation.
*   **Accessibility:** Semantic `<table>` structure, keyboard interactive elements.
*   **Performance:** `useMemo` used for sorting and filtering to prevent unnecessary calculations on render.
