---
id: brand-hub-identity
title: Brand Hub Identity Page
status: closed
created: 2026-01-12
updated: 2026-08-12
owner: marketing-studio
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-identity_20260112
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Brand Hub Identity Page

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

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

---

### spec.md

# BrandHub — Identity · Semantic Definition Spec (v1.1)

> **View:** Identity → Narrative (Brand Mode)
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/identity`
> **Reference Brand for Implementation:** **LoopDev** (the canonical demo tenant/brand)
> **Goal:** Establish the **semantic source of truth** for brand identity (narrative + voice + regulated claims) in a **versioned, governed, AI-consumable** format.

---

## 0) Definition (What this page is)
This page is where **brand meaning** is defined as structured data.
It is:
* **Machine-readable** (AI/agents can consume fields independently)
* **Governed** (draft, approval, publish)
* **Explainable** (why rules exist, where they apply)

It is NOT a campaign copy editor, CMS, DAM, or visual token editor.

---

## 1) Information Architecture (Exact Blocks)

### Block A — Narrative Foundation
**Component:** `NarrativeBlock`
**Fields (structured, separate)**
* Mission (single field)
* Vision (single field)
* Values (list; each value has title + description)
* Brand Promise (optional v1, recommended)

### Block B — Voice & Tone Profiles
**Component:** `VoiceToneBlock`
**Fields**
* Tone profiles (collection): e.g. `Neutral`, `Professional`, `Witty`, `Bold`
* Each profile contains: Description, Do examples, Don’t examples, Allowed channels.

### Block C — Claims & Forbidden Language (Legal Safety)
**Component:** `ClaimsGovernanceBlock`
**Collections**
* Forbidden words/phrases (list)
* Regulated claims (list): Text, Jurisdiction, Reason, Severity (warn/block).

### Block D — Contextual Overrides (Optional / Phase 2)
**Component:** `IdentityOverridesBlock`
* Market overrides, Language overrides, Channel overrides.

---

## 2) Component System (Reusables)

### 2.1 Atoms (OS-level reusable)
* `FieldLabel`, `StatusChip`, `SeverityPill`, `KbdHint`, `InlineHelp`, `EmptyPrompt`, `TextSkeleton`.

### 2.2 Molecules (reusable)
* `StructuredTextField`, `StructuredTextBlock`
* `DoDontSplit`, `ToneProfileCard`
* `ClaimChip`, `ClaimList`
* `BlockHeader`

### 2.3 Composites (page blocks)
* `NarrativeBlock`, `VoiceToneBlock`, `ClaimsGovernanceBlock`.

---

## 3) Interactions & Inspector Mapping

| Interaction                | SelectionRef              | Inspector Tab                       | Notes                            |
| -------------------------- | ------------------------- | ----------------------------------- | -------------------------------- |
| Click Mission field        | `identity.mission`        | Diff (if draft exists) else Context | Shows baseline + last editor     |
| Click Vision field         | `identity.vision`         | Diff                                | Required for reviewer story      |
| Click a Value item         | `identity.value:{id}`     | Context + Diff                      | Shows value metadata             |
| Click Tone profile card    | `identity.tone:{id}`      | Impact                              | Shows channels & consumers       |
| Click Do/Don’t example     | `identity.example:{id}`   | Context                             | Shows origin + policy            |
| Click Forbidden word chip  | `identity.forbidden:{id}` | Validation                          | Shows why + severity             |
| Click Regulated claim chip | `identity.claim:{id}`     | Governance (and Explain)            | Must include jurisdiction reason |

---

## 4) States (Loading / Empty / Error)

### 4.1 Loading
* Block-level skeletons for Narrative, Voice, and Claims.

### 4.2 Empty (Guided)
* Mission prompt: “Our mission is to…”
* Vision prompt: “We envision a future where…”
* Values prompt: “We value…”
* Tone prompt: “Choose a tone profile to define…”
* Claims prompt: “Add forbidden words to protect compliance…”

### 4.3 Error
* Partial rendering: If Voice fails, Narrative + Claims stay functional.

---

## 5) Governance Rules
* Identity edits require Draft.
* Some fields may be policy-locked (e.g. Regulated claims are `Legal-only`).
* If policy requires approval: Request approval action appears in toolbar, Inspector requires justification.

---

## 6) LoopDev Reference Identity (Mock Data v1)
* **Mission:** Build the operational system that turns brand truth into enforceable workflows.
* **Vision:** A world where every team ships on-brand by default, with governance built into creation.
* **Values:** Precision, Transparency, Velocity, Craft.
* **Brand Promise:** “On-brand by default.”
* **Voice Profiles:** Professional, Witty (controlled).
* **Forbidden Words:** “guaranteed”, “best”, “cure”, “risk-free”.
* **Regulated Claims:** “Guaranteed results” (BLOCK), “No risk” (WARN).

---

### userHistories.md

# User Histories: Brand Identity Definition (v1.1)

**Goal:** Establish the semantic source of truth for the brand.

## 📚 Historias de Usuario

### [A] Definition & Structure
1. **[NARRATIVE] Semantic Foundation**
   - **HU:** As a Brand Manager, I want to define Mission, Vision, and Values in separate fields so that AI agents can consume them individually without confusion.
2. **[VOICE] Operational Guidance**
   - **HU:** As a Copywriter, I want to see clear "Do" and "Don't" examples side-by-side so I understand the boundaries of the brand voice.
3. **[CLAIMS] Legal Safety**
   - **HU:** As a Legal Officer, I want to define a list of "Forbidden Words" that triggers alerts in the campaign editor if used.
4. **[PROMISE] Brand Promise**
   - **HU:** As a Brand Manager, I want to define a Brand Promise so creators understand the single sentence contract the brand makes to customers.

### [B] Governance & Control
5. **[STATE] Safe Editing**
   - **HU:** As an Editor, I want to be forced to "Create Draft" before modifying identity fields, ensuring the live brand is never accidentally broken.
6. **[DIFF] Change Visibility**
   - **HU:** As a Reviewer, I want to see exactly what changed in the "Vision" text compared to the published version (diff highlight) before approving.
7. **[APPROVAL] Policy-aware actions**
   - **HU:** As an Admin, I want identity changes to require approval when governance policy demands, with mandatory justification.

### [C] Inspector & Context
8. **[INSPECT] Claim Context**
   - **HU:** As a user, when I click on a regulated claim, I want the Inspector to tell me *why* it is regulated (e.g., "Restricted by EU Law").
9. **[IMPACT] Voice Radius**
   - **HU:** As an architect, I want to see which channels are using the "Formal" tone profile via the Inspector's Impact tab.
10. **[EXPLAIN] Why this matters**
    - **HU:** As a user, when a rule/claim is blocking, I want the Inspector Explain tab to tell me the risk and recommended next action.

### [D] Resilience & Onboarding
11. **[EMPTY] Guided Setup**
    - **HU:** As a user setting up a new brand, I want the Narrative section to show prompts (e.g., "Our mission is to...") rather than a blank box.
12. **[RESILIENCE] Partial load**
    - **HU:** As a user, if Voice profiles fail to load, I want Narrative and Claims to remain usable.
13. **[DEEPLINK] Shareable review**
    - **HU:** As a reviewer, I want a link that opens the Inspector on a specific field (e.g., Vision) and shows Diff, so reviews are fast.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `StructuredTextBlock` con estados de lectura/edición.
- [ ] Implementar `ToneProfileCard` con layout de dos columnas (Do/Don't).
- [ ] Implementar `ClaimList` con severidad y jurisdicción.
- [ ] Bloqueo de edición en `Published`.
- [ ] Inspector abre tabs correctas al hacer click en campos.
- [ ] Soporte de Deep-link (`?inspect=...`).
- [ ] Mock Data robusto: `LoopDev Identity`.
