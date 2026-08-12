---
id: design-system-architecture
title: Design System Reorganization
status: closed
created: 2026-01-07
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/ds-refactor-org_20260107
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Design System Reorganization

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

# Plan: Design System Reorganization

## Phase 1: Preparation & Infrastructure
- [x] Task: Create subdirectory structure in `ds/packages/ui/src/components/atoms/` and `composites/`. 324f5f4
- [x] Task: Identify obsolete components and move them to `.legacy/` folders. 2ef0014
- [ ] Task: Conductor - User Manual Verification 'Taxonomy Confirmed' (Protocol in workflow.md)

## Phase 2: Surgical Movement
- [x] Task: Move Atoms folders to their subcategories and fix internal relative imports. 324f5f4
- [x] Task: Move Composites folders to their subcategories and fix internal relative imports.
- [x] Task: Update the root Barrel Files (`atoms/index.ts` and `composites/index.ts`) to point to the new locations.

## Phase 3: Validation & Cleanup
- [x] Task: Run `pnpm typecheck` in the UI package to detect broken paths. 2ef0014
- [x] Task: Verify Storybook loading for all components.
- [x] Task: Verify `loopdev-os` compilation status.
- [x] Task: Conductor - User Manual Verification 'System Stable' (Protocol in workflow.md)

---

### spec.md

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


---

### metadata.json

```json
{
  "track_id": "ds-refactor-org_20260107",
  "type": "refactor",
  "status": "new",
  "created_at": "2026-01-07T17:00:00Z",
  "updated_at": "2026-01-07T17:00:00Z",
  "description": "Architectural reorganization of Design System atoms and composites into logical subdirectories."
}
```
