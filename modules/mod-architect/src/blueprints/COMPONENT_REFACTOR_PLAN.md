
# Functional Component Refactoring Plan & Atomic Architecture Spec

**Version:** 1.7.0
**Target:** Engineering Team (SaaS Global Integration)
**Objective:** Decouple presentational UI from business logic to create reusable, testable, and scalable functional components.

---

## 1. Architectural Philosophy: The Atomic Hook Pattern

We are moving away from monolithic `.tsx` files mixed with hardcoded HTML towards a modular architecture. Each "Functional Component" will reside in its own directory and strictly follow this separation of concerns:

### Directory Structure
```text
components/functional/[ComponentName]/
├── index.tsx           # Entry point. Composes Logic + UI.
├── use[ComponentName].ts # Custom Hook. Contains 100% of state and business logic.
├── components.tsx      # Sub-components (Atoms/Molecules). Purely presentational.
├── utils.ts            # Pure helper functions (formatting, validation).
└── README.md           # Documentation (Usage, API, Logic).
```

### Benefits
1.  **Headless Capability:** The `useHook` can be reused with a completely different UI (e.g., Mobile Native or different skin) without rewriting logic.
2.  **Testability:** Logic in hooks is easier to unit test than logic buried in JSX.
3.  **Maintenance:** "Dumb" components in `components.tsx` are less prone to breaking when logic changes.

---

## 2. Component Refactoring Roadmap

The following components have been identified for promotion from "Static Prototypes" to "Functional System Components".

### Priority 1: Data Table (`DataTable`)
*   **Current Source:** `pages/system/DataTables.tsx`
*   **Target:** `components/functional/DataTable/`

#### Logic Specification (`useDataTable.ts`)
*   **State:** `data`, `sortConfig` (key, direction), `filters`, `pagination` (page, pageSize), `selectedRowIds`.
*   **Methods:**
    *   `handleSort(key)`: Toggles ASC/DESC.
    *   `handleFilter(key, value)`: client-side filtering.
    *   `handlePageChange(page)`: Updates view window.
    *   `toggleSelection(id)`: Handles checkbox logic (single/multi).
    *   `getVisibleData()`: Returns the processed array derived from state.

#### Atomic UI (`components.tsx`)
*   `TableHeader`: Renders `<th>` with sort icons.
*   `TableRow`: Renders `<tr>` with selection checkbox.
*   `PaginationControls`: Reusable next/prev/page-size UI.

---

### Priority 2: Transfer List (`TransferList`)
*   **Current Source:** `pages/system/ManagementEditing.tsx`
*   **Target:** `components/functional/TransferList/`

#### Logic Specification (`useTransferList.ts`)
*   **State:** `leftItems`, `rightItems`, `checkedItems` (temp selection before move).
*   **Methods:**
    *   `moveRight()`: Moves checked items from Left -> Right.
    *   `moveLeft()`: Moves checked items from Right -> Left.
    *   `moveAll(direction)`: Bulk transfer.
    *   `handleToggle(id)`: Toggles check state.

#### Atomic UI (`components.tsx`)
*   `ListContainer`: Card wrapper with search bar.
*   `ListItem`: Individual row with checkbox/icon.
*   `TransferActions`: Middle column with buttons (>, <, >>, <<).

---

### Priority 3: Notification Center (`NotificationCenter`)
*   **Current Source:** `pages/system/NotificationsAndWorkflows.tsx`
*   **Target:** `components/functional/NotificationCenter/`

#### Logic Specification (`useNotificationSystem.ts`)
*   **State:** `notifications` (Array of objects with `id`, `type`, `message`, `read`).
*   **Methods:**
    *   `addNotification(notification)`: Pushes to stack.
    *   `markAsRead(id)`: Updates status.
    *   `removeNotification(id)`: Removes from DOM (optionally after animation).
    *   `clearAll()`: Flushes list.

#### Atomic UI (`components.tsx`)
*   `NotificationList`: Scrollable container.
*   `NotificationItem`: The alert card (supports variations: Info, Warning, Error).
*   `BadgeIcon`: Contextual icon based on type.

---

### Priority 4: Drawer (`Drawer`) - **COMPLETED**
*   **Current Source:** `components/functional/Drawer/`
*   **Status:** Reusable Component Live.

#### Logic Specification (`useDrawer.ts`)
*   **State:** `isOpen` (boolean).
*   **Methods:**
    *   `open()`: Sets state to true.
    *   `close()`: Sets state to false.
    *   `toggle()`: Flips state.
*   **Interactions:** Handles ESC key press to close. Locks body scroll when open.

#### Atomic UI (`components.tsx`)
*   `DrawerOverlay`: The backdrop with blur.
*   `DrawerPanel`: The sliding container with fixed positioning and z-index management.
*   `DrawerFooter`: Helper component for layout consistency.

---

### Priority 5: Stepper / Wizard (`Stepper`)
*   **Current Source:** `pages/system/NotificationsAndWorkflows.tsx`
*   **Target:** `components/functional/Stepper/`

#### Logic Specification (`useStepper.ts`)
*   **State:** `activeStep` (number), `steps` (Array), `completedSteps` (Set/Array).
*   **Methods:**
    *   `nextStep()`: Validates current step (optional callback) -> Increments.
    *   `prevStep()`: Decrements.
    *   `goToStep(index)`: Jumps (if step is reachable).
    *   `isStepComplete(index)`: Boolean check.

#### Atomic UI (`components.tsx`)
*   `StepIndicator`: The circle/number visuals and connector lines.
*   `StepLabel`: Text description.
*   `StepContent`: Wrapper for the active view.

---

### Priority 6: Breadcrumbs (`Breadcrumbs`) - **COMPLETED**
*   **Current Source:** `pages/system/NavigationStructure.tsx`
*   **Status:** Reusable Component Live.

---

### Priority 7: Multi-Level Sidebar (`MultiLevelSidebar`) - **COMPLETED**
*   **Current Source:** `pages/system/NavigationStructure.tsx`
*   **Status:** Reusable Component Live.

---

### Priority 8: Accordion (`Accordion`) - **COMPLETED**
*   **Current Source:** `pages/system/NavigationStructure.tsx`
*   **Status:** Reusable Component Live.

---

### Priority 9: Autocomplete (`Autocomplete`) - **COMPLETED**
*   **Current Source:** `pages/system/ComplexForms.tsx`
*   **Status:** Reusable Component Live.

---

### Priority 10: Tag Input (`TagInput`) - **COMPLETED**
*   **Current Source:** `pages/system/ComplexForms.tsx`
*   **Status:** Reusable Component Live.

---

## 3. Integration Guidelines & Rules

When creating these components, follow this strict lifecycle:

1.  **Source of Truth:** Read the code in the "Current Source" file (e.g., `pages/system/*.tsx`). This serves as the *Visual Specification*.
2.  **Preservation of Static Pages:** **DO NOT** modify the original HTML in `pages/system/`. These serve as the "Gold Standard" reference.

### Creation Flow (The "Refactor Lifecycle")

*   **Phase 1: Visual Extraction & Token Compliance**
    *   Copy HTML structure and Tailwind classes from the static page into `components.tsx`.
    *   **CRITICAL: Design Token Replacement:**
        *   **Colors:** Replace hardcoded hex codes (e.g., `#135bec`, `#0d121b`) with semantic tokens (e.g., `text-primary`, `bg-surface-dark`).
        *   **Opacity:** Use Tailwind opacity modifiers on tokens instead of new colors (e.g., `bg-primary/10` instead of `bg-blue-50`).
        *   **Spacing:** Use `p-4`, `m-2` (rem-based) instead of arbitrary pixels like `p-[13px]`.
    *   **Theming:** Ensure every color class has a corresponding `dark:` variant using the `surface`, `border`, and `text` semantic tokens.

*   **Phase 2: Enterprise Hardening (Logic & A11y)**
    *   **Logic:** Implement robust state management in `use[Component].ts` (e.g., filtering, sorting, async states).
    *   **Accessibility:** Add ARIA attributes, keyboard navigation support (Arrows, Esc, Enter), and focus management.
    *   **Edge Cases:** Implement handling for "No Results", "Loading", "Error", and empty data states.
    *   **Performance:** Add debouncing or memoization where necessary.

*   **Phase 3: Documentation & Registration**
    *   **README:** Create a `README.md` detailing Features, Usage, Props API, and Logic.
    *   **Registry:** Add the fully polished component to `pages/functional/FunctionalLibrary.tsx`.

## 4. Enterprise Standards Checklist

To ensure components are production-ready, apply these standards:

### 4.1 Design Tokens (Strict Theming)
*   **NO Hardcoded Colors:** Never use hex codes like `#135bec` directly in components.
*   **Use Semantic Classes:**
    *   `bg-primary`, `text-primary`, `border-primary` for main brand elements.
    *   `bg-surface-light`, `bg-surface-dark` for containers.
    *   `text-text-main`, `text-text-muted` for typography.
*   **Opacity Strategy:** Use `bg-primary/10` instead of `bg-blue-50` to ensure the theme color propagates correctly if the primary token changes.

### 4.2 Error Handling
*   **Error Boundaries:** Wrap complex logic components (like DataTables or Dashboards) in an `ErrorBoundary` to prevent the "White Screen of Death".
*   **Fallback UI:** Provide a `fallback` prop to display a friendly message if the component crashes.

### 4.3 Internationalization (i18n) Readiness
*   **No Hardcoded Text:** Do not write "Search..." or "Loading..." directly in JSX.
*   **Props API:** Accept text labels via props:
    ```tsx
    // Good
    <SearchInput labelSearch="Buscar..." placeholder="Escribe aquí..." />
    ```

### 4.4 RTL (Right-to-Left) Support
*   **Logical Properties:** Use Tailwind's logical properties where possible:
    *   `ms-2` (margin-start) instead of `ml-2`.
    *   `pe-4` (padding-end) instead of `pr-4`.
    *   `start-0` instead of `left-0`.
*   **Icon Rotation:** Ensure directional icons (arrows, chevrons) have logic to flip in RTL contexts (e.g., `rtl:rotate-180`).
