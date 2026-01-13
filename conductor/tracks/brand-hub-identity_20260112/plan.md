# Plan: Brand Hub Identity Page

## Phase 1: Foundations & Domain Model
- [ ] Task: Define TypeScript interfaces (`BrandIdentity`, `ToneProfile`, `Claim`).
- [ ] Task: Create rich mock data fixtures (`identity-data.ts`) representing LoopDev's real identity.
- [ ] Task: Create the page shell at `brands/[brandId]/identity/page.tsx` (replacing placeholder).

## Phase 2: Core Components (Atoms/Molecules)
- [ ] Task: Create `StructuredTextBlock` (Header + Content + EditState).
- [ ] Task: Create `ToneProfileCard` (Split view Do/Don't).
- [ ] Task: Create `ClaimList` (Chips with semantic colors).
- [ ] Task: Create `IdentitySection` (Wrapper with title + action).

## Phase 3: Assembly (The Blocks)
- [ ] Task: Assemble `NarrativeBlock` (Mission/Vision/Values).
- [ ] Task: Assemble `VoiceToneBlock` (List of profiles).
- [ ] Task: Assemble `GovernanceBlock` (Claims/Forbidden).

## Phase 4: Page Layout & State
- [ ] Task: Implement the responsive layout (Stack of blocks).
- [ ] Task: Connect read-only/edit modes to the `useActiveBrand` status.
- [ ] Task: Implement "Empty State" for new brands.

## Phase 5: Consequence Wiring (Inspector)
- [ ] Task: Wire `StructuredTextBlock` click to Inspector (Diff/Context).
- [ ] Task: Wire `ToneProfile` click to Inspector (Impact).
- [ ] Task: Wire `Claim` click to Inspector (Validation/Governance).

## Phase 6: Validation
- [ ] Task: Verify that "Published" brands cannot be edited.
- [ ] Task: Verify that "Draft" brands enable inputs.
- [ ] Task: Conductor - User Manual Verification 'Identity Page Operational'.
