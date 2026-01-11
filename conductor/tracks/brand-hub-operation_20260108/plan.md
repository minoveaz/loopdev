# Plan: Brand Hub Operation

## Phase 1: Chasis & Architecture (The Foundation)
- [x] Task: Implement Route Groups and Nested Layouts (brand-hub/layout + brands/[brandId]/layout). 8a34dd9
- [x] Task: Implement "Focus Enforcement" (SuiteSidebar -> Rail when in Brand Hub). 8a34dd9
- [x] Task: Define the State Machine for Panels (sidebarMode, flyout, inspector). 8a34dd9
- [x] Task: Create the "Shell" version of the Inspector with basic tabs. 8a34dd9
- [x] Task: Conductor - User Manual Verification 'Chasis Operational'

## Phase 2: High-Fidelity Furniture (Nivel 2.5)
- [x] Task: Implement `ModuleHeader` with dynamic breadcrumbs. 8a34dd9
- [x] Task: Implement `ModuleSidebar` with searchable brand list (Module Mode). 8a34dd9
- [x] Task: Implement `ModuleSidebar` with Brand Spine (Brand Mode). 8a34dd9
- [x] Task: Implement `SidebarFlyout` with Learn/Navigate modes. 8a34dd9
- [x] Task: Implement `ModuleToolbar` (BrandToolbar) with state-aware actions. 3688a46

## Phase 3: The "Brain" (Inspector & Governance)
- [x] Task: Define Global Inspector Types (`InspectorContext`, `Intent`). 3688a46
- [x] Task: Create `UnifiedInspector` (Shell Component). 3688a46
- [x] Task: Create Reusable UI Blocks (`ContextBlock`, `ImpactBlock`, `DiffBlock`). 3688a46
- [x] Task: Implement `BrandInspector` renderer using Blocks. 3688a46
- [x] Task: Integrate Inspector with Layout and Toolbar actions. 3688a46

## Phase 4: Data & Interaction (Real Operation)
- [x] Task: Create `useBrands` and `useActiveBrand` hooks (Supabase). 8a34dd9
- [x] Task: Implement "Selection Sync" (Layout -> Inspector Context). 3688a46
- [x] Task: Add "Read-only" enforcement for Published versions. 8a34dd9
- [x] Task: Add loading states (Skeletons) for all panels. 8a34dd9

## Phase 5: Validation & Certification
- [x] Task: Perform UI Audit for v3.9 compliance.
- [x] Task: Verify responsive behavior and layout heights.
- [ ] Task: Create E2E Tests for Critical Flows (Inspector, Toolbar).
- [ ] Task: Update `ENGINEERING_LOG.md`.
- [ ] Task: Conductor - User Manual Verification 'Brand Hub Certified'
