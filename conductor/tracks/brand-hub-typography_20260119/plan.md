# Plan: Brand Hub Typography (v1.0)

## Phase 0: Ideation & Product Specs
- [x] Task: Create `userHistories.md` defining the needs for Brand Managers and Developers.
- [x] Task: Update `spec.md` with functional requirements and business logic (not just UI).
- [x] Task: Define Domain Model in `docs/05-operations/BRAND_HUB_DOMAIN.md` (Update).

## Phase 1: Contracts & Data Modeling
- [x] Task: Create `src/brands/typography.schema.ts` in `@loopdev/contracts`.
    - Define `FontSchema` (family, provider, weights).
    - Define `TypographySystemSchema` (primary, secondary, scale).
- [x] Task: Export new schemas in `index.ts`.
- [x] Task: Update `BrandSchema` (or `BrandIdentity`) to include optional `typography` field.

## Phase 2: Core Components (The Atoms)
- [x] Task: Create `TypefaceCard` component in Brand Hub `components/` folder.
    - Support `variant="brand" | "technical"`.
    - Implement the "Watermark" visual pattern from Lab.
- [x] Task: Create `TypeScaleTable` component.
    - Implement the table structure with columns: Preview, Specs, Usage.

## Phase 3: Page Assembly & Data Connectivity
- [x] Task: Create page route `.../visual/typography/page.tsx`.
- [x] Task: Implement the Layout (Header, Grid structure).
- [x] Task: Integrate `TypefaceCard` for Primary (Inter) and Secondary (JetBrains).
- [x] Task: Integrate `TypeScaleTable` with dynamic math calculations.
- [x] Task: Connect page to real Supabase data via `useActiveBrand` hook.

## Phase 4: Infrastructure & Refinement
- [x] Task: Create SQL Migration to add `typography` column to `brands` table.
- [x] Task: Update SQL Seeder with official LoopDev Typography data.
- [x] Task: Verify "Dark Mode" compatibility (Refactored with semantic tokens).
- [x] Task: Ensure responsive behavior (Grid to Stack on mobile).

## Phase 5: Verification
- [x] Task: Conductor verification: `Typography Page Operational`.
- [x] Task: Quality Assurance: Logic & Contract Tests PASSED ✅.