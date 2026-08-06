# Plan: Brand Hub Visual System (Colors v1.5)

## Phase 1: Data Hardening (Semantic Model)
- [x] Task: Update `types.ts` with `SemanticColorToken` and `BrandPalette` interfaces.
- [x] Task: Refactor `color.ts` utilities for context resolution (Light/Dark).
- [x] Task: Seed Supabase `palette` JSONB with LoopDev's new Semantic Tokens.

## Phase 2: Core Components (The Swatches)
- [x] Task: Create `ColorTokenCard` (Swatch, Resolved Hex, Contrast Badge).
- [x] Task: Create `TokenGroupSection` (Grid container).
- [x] Task: Create `ColorContextBar` (Theme toggler, View switcher).

## Phase 3: Page Implementation
- [x] Task: Assemble `ColorsPage` layout (Context Bar + Main Surface).
- [x] Task: Implement Filter/Search logic.

## Phase 4: Consequence Wiring (The Brain)
- [x] Task: Wire Token selection → Inspector `Context` tab.
- [x] Task: Wire Contrast Badge → Inspector `Validation` tab.
- [x] Task: Wire Draft Changes → Inspector `Diff` tab.

## Phase 5: Validation & Certification
- [x] Task: Verify Theme Context switching updates resolved values.
- [x] Task: Verify Copy-to-clipboard.
- [x] Task: Conductor verification: `Colors Module Operational`.
