# Specification: Design System Reorganization (v1.0)

## 1. Overview
The Design System has grown to a point where a flat structure in `atoms` and `composites` is no longer scalable. This track reorganizes all components into logical subdirectories based on their technical role and hierarchy within the OS chassis.

## 2. Goals
- **Improve Discoverability:** Group related components together.
- **Enforce Governance:** Clearly separate infrastructure (Foundations) from functional UI (Inputs).
- **Stability:** Ensure that public exports remain unchanged to prevent breaking the application.

## 3. Proposed Taxonomy

### Atoms
- **`foundations/`**: Low-level infrastructure (Typography, ZIndex, Motion).
- **`indicators/`**: Visual feedback markers (Badge, StatusPulse, Spinner).
- **`inputs/`**: Interactive elements (Button, Input, ThemeToggle).
- **`surfaces/`**: Chasis parts and containers (TechnicalSurface, Divider, ScrollArea).
- **`feedback/`**: Complex feedback components (Skeleton, EmptyState).

### Composites
- **`shell/`**: Level 1 Global Chassis (AppShell, SuiteSidebar, SuiteHeader).
- **`workspace/`**: Level 2 Module Chassis (ModuleWorkspace, ModuleHeader, Toolbar).
- **`navigation/`**: User orientation (ContextPath, UserMenu).
- **`utilities/`**: High-level utility widgets (NotificationCenter, QuickActionMenu).

## 4. Stability Strategy
The `atoms/index.ts` and `composites/index.ts` files will be maintained as "Pass-through" barrel files. 
Application imports like `import { Button } from '@loopdev/ui'` will continue to work without modification.

## 5. Acceptance Criteria
- [ ] All components moved to their respective subdirectories.
- [ ] Internal relative imports within components are fixed.
- [ ] Root barrel files correctly re-export all components.
- [ ] `loopdev-os` builds and runs without error.
- [ ] Storybook reflects the new hierarchy.
