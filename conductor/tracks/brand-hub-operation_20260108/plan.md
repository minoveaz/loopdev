# Plan: Brand Hub Operation

## Phase 1: Chasis & Architecture (The Foundation)
- [x] Task: Implement Route Groups and Nested Layouts (brand-hub/layout + brands/[brandId]/layout). 38a2622
- [x] Task: Implement "Focus Enforcement" (SuiteSidebar -> Rail when in Brand Hub). 38a2622
- [x] Task: Define the State Machine for Panels (sidebarMode, flyout, inspector). 38a2622
- [x] Task: Create the "Shell" version of the Inspector with basic tabs (Context, Impact, Diff, Governance). 38a2622
- [x] Task: Conductor - User Manual Verification 'Chasis Operational'

## Phase 2: High-Fidelity Furniture (Nivel 2.5)
- [x] Task: Implement `ModuleHeader` with dynamic breadcrumbs. 38a2622
- [~] Task: Implement `ModuleSidebar` with searchable brand list (Module Mode).
- [ ] Task: Implement `ModuleSidebar` with Brand Spine (Brand Mode).
- [ ] Task: Implement the `SidebarFlyout` with Learn/Navigate modes.
- [ ] Task: Implement `ModuleToolbar` with situational actions.

## Phase 3: Data & Interaction (Real Operation)
- [ ] Task: Create `useBrands` and `useActiveBrand` hooks (Supabase).
- [ ] Task: Implement "Selection Sync" (Canvas Item -> Inspector Context).
- [ ] Task: Add "Read-only" enforcement for Published versions.
- [ ] Task: Add loading states (Skeletons) for all 3 panels.

## Phase 4: Validation & Certification
- [ ] Task: Perform UI Audit for v3.9 compliance.
- [ ] Task: Verify Deep-link persistence and Back behavior.
- [ ] Task: Update `ENGINEERING_LOG.md`.
- [ ] Task: Conductor - User Manual Verification 'Brand Hub Certified'