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