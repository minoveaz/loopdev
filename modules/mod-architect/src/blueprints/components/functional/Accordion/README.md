
# Accordion

**Description:** Vertically stacked list of headers that reveal or hide associated content. Supports "progressive disclosure" to manage screen real estate. The component handles its own state for opening/closing items.

## 🚀 Usage

```tsx
import { Accordion } from './index';

const items = [
  { id: '1', title: 'First Section', content: 'Hidden details here.' },
  { id: '2', title: 'Second Section', content: <div>Complex Content</div> }
];

// Single expand
<Accordion items={items} />

// Allow multiple items open at once
<Accordion items={items} allowMultiple={true} />
```

## ⚙️ API & Props

| Prop | Type | Required | Description | Default |
|------|------|----------|-------------|---------|
| `items` | `AccordionItemData[]` | **Yes** | Array of items to render. | - |
| `allowMultiple` | `boolean` | No | If true, multiple sections can be open simultaneously. | `false` |
| `className` | `string` | No | Additional CSS classes for the container. | - |

### Type Definition: AccordionItemData
```typescript
interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}
```

## 🧠 Logic (useAccordion)

Business logic is isolated in `useAccordion.ts`.

**State:**
*   `expandedIds`: `Set<string>`. Tracks IDs of open items.

**Methods:**
*   `toggle(id)`: Adds or removes ID from the set. If `allowMultiple` is false, it clears other IDs before adding the new one.
*   `isExpanded(id)`: Returns boolean check.

## 🧩 Atomic UI (components.tsx)

Presentational components extracted from `pages/system/NavigationStructure.tsx`. The component dynamically switches between two distinct visual states found in the design system source:

*   **Closed State:** Gray border, white background, `add` icon.
*   **Open State:** Primary color border, blue-tinted header, `remove` icon, visible content with top border.

## 🛡️ Enterprise Hardening (A11y)

*   **Keyboard Navigation:** Headers are focusable (`tabIndex="0"`) and toggle on `Enter` or `Space`.
*   **ARIA Attributes:**
    *   `role="button"` on headers.
    *   `aria-expanded` indicates state.
    *   `role="region"` on the expandable content body.
    *   `focus-visible` rings added for keyboard users.

## ⚠️ Integration Notes

*   **Animation:** Uses `animate-in slide-in-from-top-1` for a subtle expansion effect on the content body.
*   **Icons:** Uses standard `material-symbols-outlined`.
