# Plan: Brand Hub Rules Engine (v1.0)

## Phase 0: Ideation & Product Specs
- [x] Task: Create `userHistories.md` based on official design docs (No-code, Severity, Explainability).
- [x] Task: Create `spec.md` with detailed Block Map (Rail, List, Editor, Policies).
- [x] Task: Define Domain Model in `docs/05-operations/BRAND_HUB_DOMAIN.md` (Update for Governance Rules).

## Phase 1: Contracts & Data Modeling
- [x] Task: Create `src/brands/rules.schema.ts` in `@loopdev/contracts`.
    - Define `RuleTriggerSchema`.
    - Define `RuleConditionSchema`.
    - Define `RuleActionSchema`.
- [x] Task: Export new schemas in `index.ts`.
- [x] Task: Update `BrandSchema` to include `rulesEngine` collection.

## Phase 2: Core Components (The Logic Atoms)
- [x] Task: Create `DomainBadge` & `SeverityBadge` atoms.
- [x] Task: Create `RuleRow` molecule with logic summary.
- [x] Task: Create `RuleDomainRail` composite with telemetry stats.
- [x] Task: Create `RuleEditor` with explainability templates.

## Phase 3: Page Assembly & Navigation
- [x] Task: Create page route `.../governance/rules/page.tsx`.
- [x] Task: Implement the Layout (Rail + List + Editor structure).
- [x] Task: Map navigation in `layout.tsx` and `mock-brands.ts`.
- [x] Task: Connect to `useActiveBrand` hook with fixture fallback for LoopDev.

## Phase 4: Infrastructure & Persistence
- [x] Task: Create SQL Migration for `rules_engine` JSONB column.
- [x] Task: Update SQL Seeder with initial LoopDev Governance rules.

## Phase 5: Verification
- [x] Task: Unit Tests for Rule Validation Logic (Contracts PASSED ✅).
- [x] Task: Conductor verification: `Rules Engine Operational`.
- [x] Task: Manual verification with real DB data: SUCCESS ✅.