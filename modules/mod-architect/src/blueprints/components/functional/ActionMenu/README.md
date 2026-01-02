
# Action Menu (Kebab Menu)

**Description:** A contextual dropdown menu triggered by a 3-dot icon button. Designed for dense interfaces like data tables to hide secondary actions.

## 🚀 Usage

### Approach 1: Composition (Recommended)
Best for static lists or when you need dividers/custom logic.

```tsx
import { ActionMenu } from './index';

<ActionMenu>
  <ActionMenu.Item icon="edit" label="Edit" onClick={handleEdit} />
  <ActionMenu.Item icon="content_copy" label="Duplicate" onClick={handleCopy} />
  <ActionMenu.Divider />
  <ActionMenu.Item icon="delete" label="Delete" variant="danger" onClick={handleDelete} />
</ActionMenu>
```

### Approach 2: Data Driven
Best for dynamic lists generated from arrays.

```tsx
const actions = [
  { id: '1', label: 'Edit', icon: 'edit', onClick: () => {} },
  { id: '2', label: 'Delete', variant: 'danger', onClick: () => {} }
];

<ActionMenu items={actions} />
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'left' \| 'right'` | `'right'` | Dropdown alignment relative to the trigger. |
| `items` | `ActionMenuItem[]` | - | Array of action objects (mutually exclusive with children). |
| `children` | `ReactNode` | - | Component composition. |

## 🧠 Logic (useActionMenu)

*   **State:** `isOpen` (boolean).
*   **Click Outside:** Automatically closes when clicking outside the component.
*   **Keyboard:** Closes on `Escape` key.

## 🧩 Atomic UI

*   `MenuTrigger`: The "More Vert" icon button.
*   `MenuDropdown`: Floating container with elevation and animation.
*   `MenuItem`: Standardized row with optional icon and variant styling.
