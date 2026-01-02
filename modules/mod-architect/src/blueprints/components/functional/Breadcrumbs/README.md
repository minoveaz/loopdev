
# Breadcrumbs

**Description:** A navigation helper that displays the current location within a hierarchy. It helps users understand their context and navigate back to parent pages.

## 🚀 Usage

```tsx
import { Breadcrumbs } from './index';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', active: true }
];

<Breadcrumbs items={items} />
```

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `BreadcrumbItemData[]` | **Yes** | Array of breadcrumb items. |
| `className` | `string` | No | Additional CSS classes for the container. |

### Type Definition: BreadcrumbItemData
```typescript
interface BreadcrumbItemData {
  label: string;
  href?: string;
  active?: boolean;
}
```

## 🧠 Logic (useBreadcrumbs)

Business logic is isolated in `useBreadcrumbs.ts`.

**Features:**
*   **Item Processing:** Handles formatting and logic for identifying the active item (defaults to the last item if not explicitly set).
*   **Future Proofing:** ready for logic like auto-generation from React Router's `useLocation` or truncation of long paths.

## 🧩 Atomic UI (components.tsx)

*   `BreadcrumbContainer`: Semantic `<nav>` wrapper.
*   `BreadcrumbItem`: Renders a link (if `href` exists) or text.
*   `BreadcrumbActiveItem`: Renders the current page indicator with specific styling (pill background, primary color).
*   `BreadcrumbSeparator`: Visual separator (Chevron Right).

## 🛡️ Enterprise Standards

*   **Accessibility:** Uses `aria-label="Breadcrumb"` on the nav and `aria-current="page"` on the active item.
*   **Theming:** Compatible with light/dark modes using system tokens (`slate-400` for inactive, `primary` for active).
