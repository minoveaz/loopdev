
# Drawer (Off-Canvas)

**Description:** A panel that slides in from the edge of the screen, typically used for navigation, details, or complex forms that need to preserve context with the main view.

## 🚀 Usage

```tsx
import { Drawer, useDrawer } from './index';

const MyComponent = () => {
  const { isOpen, open, close } = useDrawer();

  return (
    <>
      <button onClick={open}>Open Settings</button>
      
      <Drawer isOpen={isOpen} onClose={close} title="Settings">
        <p>Drawer content here...</p>
        <Drawer.Footer>
          <button onClick={close}>Close</button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
};
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls visibility. |
| `onClose` | `() => void` | - | Callback to close the drawer. |
| `title` | `string` | - | Header title text. |
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` | Controls the width of the panel. |
| `actions` | `ReactNode` | - | Optional content to inject into the header/footer (responsive). |
| `portalTarget` | `HTMLElement` | `body` | DOM node to render into. |

## 🧠 Logic (useDrawer)

Business logic is isolated in `useDrawer.ts`.

**Features:**
*   **State Management:** Simple `isOpen` boolean with toggle helpers.
*   **Keyboard Support:** Automatically attaches a `keydown` listener to close on `Escape`.
*   **Scroll Locking:** Prevents the body from scrolling while the drawer is open.

## 🧩 Atomic UI (components.tsx)

*   `DrawerOverlay`: Backdrop with blur effect.
*   `DrawerPanel`: The sliding container. Handles animations (slide-in) and responsive width.
*   `DrawerFooter`: Helper for consistent action layout at the bottom.

## 🛡️ Enterprise Standards

*   **Portal:** Renders outside the parent DOM hierarchy (via `React.createPortal`) to ensure correct z-index stacking context.
*   **A11y:** Includes `role="dialog"`, `aria-modal="true"`, and backdrop click-to-dismiss.
