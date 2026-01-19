# Plan: Brand Hub Typography (v1.0)

## Phase 0: Ideation & Product Specs
- [ ] Task: Create `userHistories.md` defining the needs for Brand Managers and Developers.
- [ ] Task: Update `spec.md` with functional requirements and business logic (not just UI).
- [ ] Task: Define Domain Model in `docs/05-operations/BRAND_HUB_DOMAIN.md` (Update).

## Phase 1: Contracts & Data Modeling
- [ ] Task: Create `src/brands/typography.schema.ts` in `@loopdev/contracts`.
    - Define `FontSchema` (family, provider, weights).
    - Define `TypographySystemSchema` (primary, secondary, scale).
- [ ] Task: Export new schemas in `index.ts`.
- [ ] Task: Update `BrandSchema` (or `BrandIdentity`) to include optional `typography` field.

## Phase 2: Core Components (The Atoms)
- [ ] Task: Create `TypefaceCard` component in Brand Hub `components/` folder.
    - Support `variant="brand" | "technical"`.
    - Implement the "Watermark" visual pattern from Lab.
- [ ] Task: Create `TypeScaleTable` component.
    - Implement the table structure with columns: Preview, Specs, Usage.

## Phase 3: Page Assembly
- [ ] Task: Create page route `.../visual/typography/page.tsx`.
- [ ] Task: Implement the Layout (Header, Grid structure).
- [ ] Task: Integrate `TypefaceCard` for Primary (Inter) and Secondary (JetBrains).
- [ ] Task: Integrate `TypeScaleTable` with mock data matching Lab specs.

## Phase 4: Refinement & Polish
- [ ] Task: Verify "Dark Mode" compatibility (critical for the Technical Card).
- [ ] Task: Ensure responsive behavior (Grid to Stack on mobile).

## Phase 5: Verification
- [ ] Task: Conductor verification: `Typography Page Operational`.
