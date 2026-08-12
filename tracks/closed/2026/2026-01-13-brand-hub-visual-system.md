---
id: brand-hub-visual-system
title: Brand Hub Visual System (Colors v1.5)
status: closed
created: 2026-01-13
updated: 2026-08-12
owner: marketing-studio
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-visual-system_20260113
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Brand Hub Visual System (Colors v1.5)

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

---

### spec.md

# BrandHub — Visual System · Colors (SaaS-Level) · Spec (v1.6)

> **View:** Visual System → Colors (Brand Mode)
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/visual/colors`
> **Purpose:** Provide an enterprise-grade environment to define **brand color truth** as **semantic tokens**. Examples and usage guidelines are delivered contextually via the Inspector.

---

## 0) Core Philosophy (SaaS-grade)
1.  **Colors are Contracts:** A hex is implementation; a token is meaning.
2.  **Two-Layer Model:** Raw Palette vs. Semantic Tokens.
3.  **Just-in-Time Education:** "How-to-use" is explained in the Inspector when risk is detected, keeping the main Canvas clean and technical.

---

## 1) Information Architecture (Page Layout)
... (Same as v1.5) ...

---

## 2) Component System
... (Same as v1.5) ...

---

## 3) Inspector Mapping (Consequence Wiring)

| Selection | Inspector Tab | Content |
| :--- | :--- | :--- |
| **Color Token** | `Context` | Metadata, owner, version. |
| **Color Token** | `Validation` | WCAG checks, ratio, remediation. |
| **Color Token** | `Explain` | **Usage Oracle (Do/Don't):** <br> - ✅ **OK:** Semantic usage examples (e.g., "Button background"). <br> - ❌ **NOT OK:** Misuse warnings (e.g., "Body text on white"). |
| **Color Token** | `Impact` | List of consuming modules/campaigns. |

---

## 4) Explain Tab Design Rules
*   **No Heavy Graphics:** Use mini-chips, typography previews, and text-based logic.
*   **Role-Driven:** Examples must be tied to the token's `role` (background, text, etc.).
*   **Actionable:** Every "Don't" should suggest an "OK" alternative.

---

### userHistories.md

# User Histories: Color Token Management (v1.5)

**Goal:** Provide a governed, high-fidelity environment for defining brand colors with baked-in accessibility and context awareness.

## 📚 Historias de Usuario

### [A] Definition & Visibility
1. **[PALETTE] Instant Overview**
   - **HU:** As a Designer, I want to see tokens grouped by category so I can verify completeness at a glance.
2. **[TOKEN] Value Accuracy**
   - **HU:** As a Developer, I want to copy the resolved hex value in one click to use it in implementation.
3. **[CONTEXT] Context Preview**
   - **HU:** As a Designer, I want to toggle Light/Dark preview so I can validate the palette in both modes without leaving the page.

### [B] Governance & Safety
4. **[CONTRAST] Accessibility Guardrails**
   - **HU:** As a Brand Manager, I want contrast warnings with WCAG ratio to keep the system inclusive.
5. **[STATE] Safe Editing**
   - **HU:** As an Editor, I must be forced to create a draft before changing any token, ensuring production stability.
6. **[APPROVAL] Policy Enforcement**
   - **HU:** As an Admin, I want core token changes to require approval when policy demands.

### [C] Inspector & Context
... (Same as v1.5) ...
9. **[EXPLAIN] Why & Next Step**
   - **HU:** When a token status is BLOCK/WARN, I want an explanation and recommended remediation in the Inspector.
10. **[ORACLE] Contextual Usage Guidelines**
   - **HU:** As a Junior Designer, I want to see semantic Do/Don't examples in the Inspector's Explain tab so I can learn how to apply the brand colors correctly without polluting the main technical grid.


## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `ColorTokenCard` con badge WCAG dinámico.
- [ ] Implementar `ColorContextBar` para switching Light/Dark.
- [ ] Conectar selección de token al Inspector (Context/Diff).
- [ ] Bloquear edición directa en estado `Published`.
