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
