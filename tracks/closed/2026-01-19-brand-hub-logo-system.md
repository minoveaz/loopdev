---
id: brand-hub-logo-system
title: Brand Hub Logo System (v1.0)
status: closed
created: 2026-01-19
updated: 2026-08-12
owner: marketing
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/brand-hub-logo-system_20260119
---

# Brand Hub Logo System (v1.0)

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
- [x] Task: Create `LogoVariantCard` component.
- [x] Task: Create `LogoScaleTest` component.
- [x] Task: Create `BracketsShowcase` component (Supporting elements).

## Phase 3: Page Assembly & Navigation
- [x] Task: Create page route `.../visual/logos/page.tsx`.
- [x] Task: Implement the Layout (Header, Sections for Isotype, Lockups, Variants, Brackets).
- [x] Task: Connect to `useActiveBrand` hook (handling loading states).
- [x] Task: Map navigation in `layout.tsx` and `mock-brands.ts`.
- [x] Task: Implement Certified Identity logic (LoopDev atom injection).

## Phase 4: Infrastructure & Persistence
- [x] Task: Create SQL Migration to add `logos` JSONB column to `brands`.
- [x] Task: Update SQL Seeder with official LoopDev Logo data (SVG paths).

## Phase 5: Verification
- [x] Task: Unit Tests for Schema and Logic.
- [x] Task: Conductor verification: `Logo Page Operational`.
- [x] Task: Visual QA: Dark Mode & Identity text contrast FIXED ✅.

---

### spec.md

# Spec: Brand Hub Logo System (v1.0)

> **Source:** `labdev/pages/system/Overview.tsx`
> **Status:** Definition
> **Track:** `brand-hub-logo-system_20260119`

## 1. Overview
The Logo System is the visual cornerstone of the Brand Hub. It transitions from a simple `logoUrl` string to a structured set of assets, variants, and technical specifications that govern how the brand is represented across all mediums.

## 2. Technical Architecture

### 2.1 Data Model (Schema)
The legacy `logoUrl` field in `public.brands` will be replaced/complemented by a `logos` JSONB object.

**Structure:**
- **Isotype:** The core symbol (e.g., Infinite Loop).
- **Lockups:** Combinations of symbol + text (Horizontal, Vertical).
- **Variants:** Color behaviors (Full Color, Monochrome Dark, Monochrome Light).
- **Metadata:** Technical specs (Grid, Aspect Ratio, Stroke).

### 2.2 Zod Definition (`logo.schema.ts`)
```typescript
export const LogoAssetSchema = z.object({
  url: z.string().url(),
  rawSvg: z.string().optional(), // For copy-paste dev velocity
  width: z.number().optional(),
  height: z.number().optional()
});

export const LogoLockupSchema = z.object({
  horizontal: LogoAssetSchema,
  vertical: LogoAssetSchema,
  isotype: LogoAssetSchema
});

export const LogoSystemSchema = z.object({
  primary: LogoLockupSchema, // Full color versions
  monochrome: z.object({
    positive: LogoLockupSchema, // Dark on Light
    negative: LogoLockupSchema  // Light on Dark
  }).optional(),
  specs: z.object({
    aspectRatio: z.string().default("Variable"),
    gridType: z.string().default("Pixel Perfect"),
    strokeWeight: z.string().default("Fluid")
  })
});
```

## 3. UI Components (Industrialized from Lab)

### 3.1 `LogoHeroShowcase`
- **Visuals:** Large center display of the Isotype.
- **Features:** Grid background (Clearspace visualization), "FIG 1.0" technical label, and contextual action buttons.

### 3.2 `LogoVariantCard`
- **Visuals:** Card with a dotted/grid background.
- **Variants:** Stacks vertically or horizontally depending on the lockup.
- **Actions:** SVG Copy, Download Button.

### 3.3 `LogoApplicationPreview`
- **Contexts:**
    - **Favicon:** Browser tab mockup.
    - **App Icon:** Mobile device/Springboard mockup.
    - **Scale:** Comparison at 16/32/64px.

## 4. Business Rules
1. **Fallback Logic:** If a specific variant (e.g., Monochrome) is missing, the system should default to the `primary` version but warn the user in the Inspector.
2. **Read-Only (MVP):** Initial implementation displays LoopDev's own logos as the reference system.
3. **Accessibility:** Every logo MUST have an `alt` text definition in the metadata.

## 5. Success Criteria
1. The Logos page renders at 100% visual parity with the Lab blueprint.
2. Users can copy raw SVG code to clipboard.
3. Data is fully driven by the `logos` JSONB column in Supabase.
4. Inspector opens with technical specs when a logo is clicked.

---

### userHistories.md

# User Histories: Brand Logo System (v1.0)

**Goal:** Provide a centralized, governed, and industrial-grade repository for all brand logo assets and their usage rules.

## 📚 Historias de Usuario

### [A] Asset Management & Accessibility
1. **[CENTRALIZATION] Source of Truth**
   - **HU:** As a Brand Manager, I want a single place to host all official versions of the logo (Horizontal, Vertical, Isotype) so that team members stop using outdated or low-quality versions found on Slack or Google Drive.
2. **[FORMATS] Production Ready**
   - **HU:** As a Designer, I want to download logos in multiple formats (SVG for web, PNG for docs) directly from the dashboard to save time during campaign creation.
3. **[SVG_COPY] Dev Velocity**
   - **HU:** As a Frontend Developer, I want to copy the raw SVG code of any logo variant with one click so I can paste it directly into my components without handling files.

### [B] Technical Specs & Governance
4. **[LOCKUPS] Contextual Variants**
   - **HU:** As a Designer, I want to define specific "Lockups" (e.g., Vertical for social media, Horizontal for headers) so the system understands which one to suggest for different layouts.
5. **[SAFE_ZONE] Clearspace Rules**
   - **HU:** As a Brand Guardian, I want to visualize the "Safety Zone" (grid) around the logo to ensure it always has enough breathing room and isn't cramped by other UI elements.
6. **[CONTRAST] Background Logic**
   - **HU:** As a system, I need to know which logo variant to use on Dark vs. Light backgrounds automatically to ensure 100% brand legibility at all times.

### [C] Quality & Scale
7. **[MIN_SIZE] Scale Integrity**
   - **HU:** As an Accessibility Lead, I want to see a "Scale Test" (rendering at 16px, 32px, 64px) to verify that the logo remains recognizable at favicon or mobile header sizes.
8. **[ISOTYPE] Symbol Autonomy**
   - **HU:** As a Brand Manager, I want to define the "Isotype" (symbol only) as a standalone asset for use in app icons and loading states (like the LogoSpinner).

### [D] Inspector & Context
9. **[INSPECT] Construction Specs**
   - **HU:** As a user, when I click a logo, I want the Inspector to show me technical specs (Aspect Ratio, Stroke rules, Grid type) so I understand its construction principles.
10. **[AUDIT] Usage History**
    - **HU:** As an Admin, I want to see when a logo variant was last updated and by whom to maintain a clean audit trail of brand evolution.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `LogoVariantCard` con acciones de descarga y copia.
- [ ] Visualizador de construcción con rejilla (Grid Pattern).
- [ ] Soporte para metadatos técnicos (Aspect Ratio, Stroke).
- [ ] Sección de "Applications" (Favicon, App Icon) con previsualización de contexto.
- [ ] Integración con el `useActiveBrand` hook para datos persistentes.
