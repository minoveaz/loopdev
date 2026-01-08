# Plan: Design System Reorganization

## Phase 1: Preparation & Infrastructure
- [x] Task: Create subdirectory structure in `ds/packages/ui/src/components/atoms/` and `composites/`. 324f5f4
- [~] Task: Identify obsolete components and move them to `.legacy/` folders.
- [ ] Task: Conductor - User Manual Verification 'Taxonomy Confirmed' (Protocol in workflow.md)

## Phase 2: Surgical Movement
- [ ] Task: Move Atoms folders to their subcategories and fix internal relative imports.
- [ ] Task: Move Composites folders to their subcategories and fix internal relative imports.
- [ ] Task: Update the root Barrel Files (`atoms/index.ts` and `composites/index.ts`) to point to the new locations.

## Phase 3: Validation & Cleanup
- [ ] Task: Run `pnpm typecheck` in the UI package to detect broken paths.
- [ ] Task: Verify Storybook loading for all components.
- [ ] Task: Verify `loopdev-os` compilation status.
- [ ] Task: Conductor - User Manual Verification 'System Stable' (Protocol in workflow.md)
