---
id: brand-hub-typography
title: Brand Hub Typography (v1.0)
status: closed
created: 2026-01-19
updated: 2026-08-12
owner: marketing-studio
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-typography_20260119
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Brand Hub Typography (v1.0)

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

---

### spec.md

# Spec: Brand Hub Typography System (v1.0)

> **Source:** `labdev/pages/system/Typography.tsx`
> **Status:** Definition
> **Owner:** Brand Hub Team

## 1. Overview
The Typography module serves as the authoritative source for a brand's typographic system. It defines the typefaces, weights, and usage rules for both UI (User Interface) and Technical (Code/Data) contexts.

## 2. Technical Architecture
Following the "Contract-First" approach, typography data must be modeled in Zod before UI implementation.

### 2.1 Data Model (Schema)
The `BrandIdentity` will be extended. Unlike the simple Lab view, the industrial model supports governance:

- **Font Family:** Name, Type (Sans, Serif, Mono, Display).
- **Source:** Provider (Google, Custom, System) + URI/File path.
- **License:** Type (OFL, Proprietary, Adobe) to ensure legal safety.
- **Weights:** Specific weights authorized for use (avoiding loading unused 900 italic).
- **Fallbacks:** The CSS stack string for safety.

### 2.2 Zod Definition (`typography.schema.ts`)
```typescript
export const FontSourceSchema = z.enum(['google', 'system', 'custom', 'adobe']);

export const FontVariantSchema = z.object({
  weight: z.number(), // 400, 700
  style: z.enum(['normal', 'italic']),
  usage: z.string().optional() // "Body text only"
});

export const FontDefinitionSchema = z.object({
  family: z.string(),
  type: z.enum(['sans', 'serif', 'mono', 'display', 'handwriting']),
  source: FontSourceSchema,
  sourceUrl: z.string().optional(), // For Google/Custom
  license: z.string().optional(),
  variants: z.array(FontVariantSchema),
  fallbacks: z.array(z.string()).default(['sans-serif'])
});

export const TypographySystemSchema = z.object({
  primary: FontDefinitionSchema,
  secondary: FontDefinitionSchema.optional(), // Mono is optional for non-tech brands
  baseSize: z.number().min(12).default(16), // Accessibility floor
  scaleRatio: z.number().default(1.25), // Major Third by default
  lineHeightBase: z.number().default(1.5)
});
```

## 3. UI Implementation Strategy (Lab -> OS)

### 3.1 Visual Components
The `labdev` design introduces specific presentation patterns that need to be industrialized:

1.  **TypefaceCard:** A rich presentation card for fonts.
    *   *Variant A (Brand):* Light theme, large watermark "Aa", alphabet preview.
    *   *Variant B (Technical):* Dark theme, code decorations (`{ }`, `< >`), monospaced.
    *   *Interactive:* Allow user to type in the preview area (HU-9).
2.  **TypeScaleTable:** A table view showing the hierarchy (H1...Caption).
    *   *Logic:* Must calculate the px/rem values based on `baseSize` * `scaleRatio`.

### 3.2 Page Layout (`TypographyPage`)
- **Header:** Standard `BrandHub` header (Title + Subtitle).
- **Section 1:** Typeface Definitions (Grid of Primary + Secondary).
- **Section 2:** Hierarchy/Scale Table (Live calculation).

## 4. Business Logic & Governance
- **Read-Only (MVP):** Initially, this view displays the system defaults.
- **Validation:** `baseSize` cannot be < 12px (Accessibility Rule).
- **Safety:** If Primary font fails to load (network error), the `fallback` stack must be displayed in the Inspector.

## 5. Success Criteria
1.  The `TypographyPage` matches the `labdev` visual fidelity.
2.  Data is served from a structured object (even if mocked initially), not hardcoded JSX text.
3.  Components use `@loopdev/ui` primitives (`LpdText`, `TechnicalCard`, etc.).
4.  Inspector shows "License" and "Weights" when a card is clicked.

---

### userHistories.md

# User Histories: Brand Typography System (v1.0)

**Goal:** Ensure typographic consistency and readability across all brand touchpoints (Marketing & Product).

## 📚 Historias de Usuario

### [A] Definition & Hierarchy
1. **[PRIMARY] Brand Voice in Type**
   - **HU:** As a Brand Manager, I want to define a "Primary Typeface" (e.g., Inter) that is automatically applied to all Marketing headings and UI body text to ensure brand recognition.
2. **[SECONDARY] Technical Precision**
   - **HU:** As a Developer Experience Lead, I want to define a specific "Monospace Typeface" (e.g., JetBrains Mono) for all code snippets and technical data displays to ensure clarity for engineering users.
3. **[SCALE] Dynamic Hierarchy**
   - **HU:** As a Designer, I want the H1-H6 headers to follow a mathematical ratio (e.g., 1.2 or 1.5) based on a base size, so that the visual rhythm is always harmonious without manual tweaking.

### [B] Governance & Usage
4. **[SOURCE] Legal Compliance**
   - **HU:** As a Legal Officer, I want to specify the "Provider" of the font (Google Fonts vs. Custom Upload) and attach license details to prevent copyright infringement lawsuits.
5. **[FALLBACK] Performance Safety**
   - **HU:** As a CTO, I want to define a "System Fallback Stack" (e.g., sans-serif) that loads immediately if the webfont fails, ensuring the site is never unreadable.
6. **[USAGE] Contextual Rules**
   - **HU:** As a Designer, I want to attach "Usage Guidelines" (e.g., "Only use Black weight for Hero sections") to the font definition so that content creators don't misuse the weights.

### [C] Inspector & AI Context
7. **[INSPECT] Character Set**
   - **HU:** As a localization specialist, I want to inspect the supported "Character Sets" (Latin, Cyrillic) via the Inspector to verify we can launch in new markets.
8. **[AI] Readability Optimization**
   - **HU:** As an AI Content Agent, I need to know the "Optimal Line Height" and "Max Line Length" defined in the typography system to generate layouts that are easy to read.

### [D] Visualization (The Lab Blueprint)
9. **[PREVIEW] Real-time Testing**
   - **HU:** As a stakeholder, I want to type my own text into a "Playground" area within the Typeface Card to see how my specific brand name looks in that font.
10. **[CONTRAST] Accessibility Check**
    - **HU:** As an accessibility advocate, I want the system to warn me if the chosen "Base Font Size" is too small (<16px) for legibility standards.

## 📐 Criterios de Aceptación Técnicos
- [ ] Modelo de datos soporta `provider` (Google/Custom/System).
- [ ] La UI distingue visualmente entre Contexto Marca (Light/Serif/Sans) y Contexto Técnico (Dark/Mono).
- [ ] La tabla de escala muestra valores calculados (rem/px) reales.
- [ ] El inspector muestra detalles de licencia y pesos disponibles.
