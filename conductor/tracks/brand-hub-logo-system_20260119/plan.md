# Plan: Brand Hub Logo System (v1.0)

## Phase 0: Ideation & Product Specs
- [x] Task: Create `userHistories.md` defining the needs for Brand Managers (upload, safe zone) and Developers (SVG, formats).
- [x] Task: Create `spec.md` with functional requirements (Isotype, Lockups, Clearspace) based on `labdev/pages/system/Overview.tsx`.
- [x] Task: Define Domain Model in `docs/05-operations/BRAND_HUB_DOMAIN.md` (Update for Logo Assets).

## Phase 1: Contracts & Data Modeling
- [x] Task: Create `src/brands/logo.schema.ts` in `@loopdev/contracts`.
    - Define `LogoVariantSchema` (full, isotype, monochrome).
    - Define `LogoAssetSchema` (url, fileType, dimensions).
- [x] Task: Export new schemas in `index.ts`.
- [x] Task: Update `BrandSchema` to include `logos` field (replacing simple `logoUrl`).

## Phase 2: Core Components (The Atoms)
- [x] Task: Create `LogoShowcase` component (The Hero Grid from Lab).
    - Support "Safety Zone" visualization (grid background).
    - Support Dark/Light context toggle.
- [x] Task: Create `LogoVariantCard` component.
    - Displays a specific variant (Horizontal, Vertical, Isotype).
    - Includes "Download" and "Copy SVG" actions.
- [x] Task: Create `LogoScaleTest` component (Micro-interactions check).

## Phase 3: Page Assembly
- [x] Task: Create page route `.../visual/logos/page.tsx`.
- [x] Task: Implement the Layout (Header, Sections for Isotype, Lockups, Variants).
- [x] Task: Connect to `useActiveBrand` hook (handling loading states).

## Phase 4: Infrastructure & Persistence
- [x] Task: Create SQL Migration to add `logos` JSONB column to `brands`.
- [x] Task: Update SQL Seeder with official LoopDev Logo data (SVG paths).

## Phase 5: Verification
- [x] Task: Unit Tests for Schema and Logic.
- [x] Task: Conductor verification: `Logo Page Operational`.