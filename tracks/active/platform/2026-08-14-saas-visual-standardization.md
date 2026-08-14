---
id: saas-visual-standardization
title: SaaS visual system and experience standardization
status: active
created: 2026-08-14
updated: 2026-08-14
owner: platform
lead: null
branch: null
branches: [docs/platform-shell-mode-inventory]
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, governance]
dependencies: [platform-shell-mode-inventory]
blocked_by: []
supersedes: []
---

# SaaS visual system and experience standardization

## Outcome

Define the shared visual language, composition recipes and cross-suite
experience contracts that make LoopDev SaaS views consistent without removing
domain-specific identity or useful density.

## Contexto

`SuiteCanvas` defines structural regions and modes, but it does not by itself
standardize backgrounds, surfaces, spacing, states, responsive behavior,
accessibility or view governance. This track establishes those shared rules
before broad CRM and suite view implementation.

## Alcance

### Incluido

- Inventory of surfaces, backgrounds, technical grids and visual recipes.
- Layout, spacing, density and visual hierarchy.
- Functional states and interaction contracts.
- Data density, tables, filters and formatting.
- Accessibility, responsive behavior and device input.
- Tenancy, theming and organization branding boundaries.
- Internationalization and localization constraints.
- Permission, security and audit presentation requirements.
- Performance budgets and observability.
- Component ownership, promotion and exception governance.
- Standard view specification and validation checklist.

### Excluido

- Replacing the existing Platform Shell or SuiteCanvas mode contract.
- Implementing complete domain views for CRM, Marketing, Quant or Health.
- Changing tenant security enforcement or database policies.
- Introducing a parallel design system outside `@loopdev/ui`.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-14 | Use shared tokens, primitives and recipes instead of suite-local visual CSS systems. | Preserve cross-SaaS consistency while allowing domain composition. | New variants require shared ownership and evidence. | Usuario |
| 2026-08-14 | Keep structural Canvas modes separate from visual surface recipes. | Prevent layout contracts from becoming decoration contracts. | Views declare both a Canvas mode and a visual recipe. | Usuario |

## Arquitectura y contratos

- `SuiteCanvas` owns structural regions and mode semantics.
- Platform tokens own colors, surfaces, borders, spacing, typography and
  density scales.
- Shared primitives own technical grids, surfaces, backgrounds, overlays and
  state treatments.
- Recipes own composition rules for dashboard, data, split, record, board and
  immersive workflows.
- Suites own domain content and approved accents, not parallel shell primitives.
- Every view declares mode, recipe, states, permissions, responsive behavior,
  accessibility, localization and observability requirements.

## Branch strategy

This is a transversal specification track. It remains planned until Phase 0
readiness is approved, then implementation branches may be created per
platform capability while this track remains the system of record.

## Fases

### Fase 0: Inventario y readiness

**Objetivo:** Establish the current token, surface, recipe and experience
baseline with ownership and measurable gaps.

**Definition of Ready**

- [x] Existing platform and UI references inventoried.
- [x] Canonical owners and source-of-truth locations identified.
- [x] Dependencies with Platform Shell and Design System confirmed.
- [x] Validation approach agreed for visual, accessibility and contract gates.

**Entregables**

- [x] Surface and background inventory.
- [x] Visual recipe catalog.
- [x] Cross-SaaS standardization matrix covering the 15 concern areas.
- [x] View specification template.
- [x] Gap, duplication and exception register.

**Validación**

- [x] Documentation links and track integrity pass.
- [x] Every proposed token/recipe has an owner and evidence source.
- [x] No duplicate platform primitive is introduced.

**Evidencia:** [SaaS visual system inventory](../../../docs/03-platform/SAAS_VISUAL_SYSTEM_INVENTORY.md)
records current primitives and duplication. [SaaS visual recipes](../../../docs/03-platform/SAAS_VISUAL_RECIPES.md)
defines the proposed surface taxonomy and initial mode-to-recipe mapping.
[SaaS standardization matrix](../../../docs/03-platform/SAAS_STANDARDIZATION_MATRIX.md)
and [view specification template](../../../docs/03-platform/SAAS_VIEW_SPECIFICATION_TEMPLATE.md)
make the fifteen concern areas and per-view review contract actionable.
[SaaS visual gap register](../../../docs/03-platform/SAAS_VISUAL_GAP_REGISTER.md)
assigns the remaining duplication, accessibility, theming and exception work.

**Estado:** completada

### Fase 1: Shared visual contracts

**Objetivo:** Define tokens, primitives, recipes, states and view contracts.

- [x] Reference composition patterns extracted from supplied screenshots.
- [x] Declarative composition contract with grid, slots, spans and breakpoints.
- [x] Initial `CompositionGrid` renderer consuming the shared contract.
- [x] Neutral showcase fixtures for all six initial recipes.
- [x] `CreativeEditor` reference recipe and design-team fixture.
- [x] Design handoff for CreativeEditor from zero-to-implementation.
- [x] Agnostic-first implementation and LoopDev migration guidance.
- [x] Showcase states for ready, loading, empty, error, read-only and forbidden.
- [x] Responsive showcase container for mobile, tablet and desktop review.
- [x] LoopDev OS production build after repairing the workspace token link.
- [x] Obsolete `operation-os` test surface removed.

**Estado:** completada

**Evidencia:** `/composition-showcase` renders the reference fixtures and
state treatments. Vitest passed with 139 files and 557 tests; the
`loopdev-os` production build passed after the `@loopdev/tokens` workspace link
was restored.

### Fase 2: Reference compositions

**Objetivo:** Apply the contracts to representative dashboard, data, split,
record, board and immersive compositions without implementing full suites.

**Standardization decision:** Composition regions declare semantic layout
intent (`rows`, `placement`, `sizing` and `overflow`) instead of relying on
page-specific pixel fixes. `CreativeEditor` is the first full-bleed reference;
`SuiteOverview` is the next reference before CRM screens are defined.

**Entregables**

- [x] CreativeEditor full-bleed canvas with preview, stage tools, transport and timeline zones.
- [x] Declarative region layout contract for rows, placement, sizing and overflow.
- [x] Shell-owned Media Library and Media Details zones separated from canvas regions.
- [x] SuiteOverview reference composition using the same declarative contract.
- [x] Reference component fixtures for summary, metrics, activity, filters, table and pagination.
- [x] Desktop, tablet and mobile review for both reference compositions.

**Validation gate:** Do not begin CRM screen composition until CreativeEditor
and SuiteOverview both pass layout, state, responsive and accessibility review.

**Estado:** en curso

**Siguiente validación:** Complete the remaining reference fixtures and
contract gates before CRM composition.

### Prioridades pendientes

Estas prioridades amplían la implementación de la Fase 2 y son el orden de
trabajo aprobado antes de iniciar CRM:

1. **Aplicar superficies del DS a las composiciones:** migrar los contenedores
  principales de `composition-showcase` a `TechnicalSurface`, usando el
  contrato de `variant`, `depth`, `radius`, `border`, `borderWidth` y
  `withGrid`. Estado: **iniciado**.
2. **Completar fixtures reales por recipe:** pendiente sólo la ampliación de
  estados y revisión de `CreativeEditor`; `SplitWorkspace` e
  `ImmersiveWorkflow` ya tienen fixtures de referencia.
3. **Aplicar estados reutilizables a cada recipe:** loading, empty, error,
  forbidden, read-only, offline, stale y conflict.
4. **Normalizar iconos y acciones:** usar `ICON_REGISTRY`, `Button` e
  `IconButton` sin controles HTML o nombres de iconos locales. Estado:
  **parcialmente certificado**, con búsquedas y acciones discretas del
  showcase normalizadas.
5. **Certificar interacción:** hover, focus, active, disabled, loading de
  botones, permisos, teclado y reduced motion. Estado: **certificado para
  referencias**, con cobertura Playwright de estados, foco y reduced motion.
6. **Ejecutar revisión responsive real:** desktop 1440, tablet 1024 y mobile
  390, comprobando regiones contenidas, transformaciones y scroll interno.
7. **Completar auditoría light/dark:** superficies, bordes, grillas,
  overlays, glass y estados semánticos. Estado: **certificado para
  referencias**; el control de tema persiste y valida superficies semánticas.
8. **Añadir tests de contrato:** TechnicalSurface, estados, responsive,
  icon registry y acciones contextuales. Estado: **parcialmente cubierto**;
  existen contratos de recipes y tests Playwright de interacción.
9. **Registrar evidencia de navegador:** screenshots autenticados y resultados
  visuales para cerrar el readiness gate. Estado: **10 pruebas Playwright
  autenticadas pasadas**.

**Progreso registrado:** el punto 1 avanzó el 2026-08-14 con la migración de la
pestaña `Surfaces`, la configuración de `TechnicalSurface` en el DS y la
aplicación explícita de superficies a las regiones declarativas de
`composition-showcase`. `SuiteOverview` ya usa superficies DS, `TechnicalCanvas`
oficial y grilla blueprint visible. El resto de los fixtures comparte ahora
tratamientos de estado reutilizables; la migración de contenedores locales y la
auditoría visual light/dark permanecen pendientes.

## CRM readiness gate

CRM screen composition must not begin until this gate is reviewed. The gate
turns the fifteen cross-SaaS concerns into evidence requirements for the first
CRM screen and prevents CRM from becoming the place where platform behavior is
discovered for the first time.

| Area | Required evidence | Status |
| --- | --- | --- |
| Shell zones | Mandatory and optional zone contract consumed by a module definition | ready |
| Declarative composition | Recipe, canvas mode, rows, columns, placement, sizing and overflow are declared | ready for references |
| CreativeEditor | Full-bleed reference with contextual zones, preview, transport and timeline | ready |
| SuiteOverview | Reference fixture consumes the same contract | ready for visual review |
| DataWorkspace | Reference reviewed for filters, table, pagination and density | fixture ready; visual review pending |
| RecordWorkspace | Reference reviewed for record, tabs, activity and inspector behavior | fixture ready; interaction review pending |
| BoardWorkspace | Reference reviewed for board density, cards, metrics and horizontal flow | fixture ready; interaction review pending |
| Functional states | Loading, empty, error, forbidden, read-only, offline, stale and conflict fixtures | reference coverage |
| Responsive | Desktop, tablet, mobile, touch and sidebar/panel transformations | reference coverage ready |
| Accessibility | Keyboard path, focus restoration, semantics, contrast and reduced motion | reference coverage ready |
| Typography | Font families, sizes, weights, line-height and text expansion use tokens | pending |
| Color and surfaces | Semantic canvas, surface, elevated, overlay, accent and attention tokens | pending |
| Permissions | Hidden, disabled, forbidden, read-only and active-route fallback behavior | reference coverage ready |
| Data density | Table, filters, pagination, sorting, selection, formatting and large-data rules | pending |
| Performance | List, grid, animation, canvas and interaction budgets | reference marks ready; budgets pending |
| Observability | Navigation, context, state, errors, permission and latency events without sensitive data | reference events ready |
| Exceptions | Owner, rationale, approval, scope, review date and removal plan | partially ready |

### Entry criteria

Before creating the first CRM screen composition:

- [x] `CreativeEditor` and `SuiteOverview` pass visual and responsive review.
- [ ] `DataWorkspace`, `RecordWorkspace` and `BoardWorkspace` have reference fixtures or an approved deferral.
- [ ] All required functional states have reusable fixtures and validation plans.
- [ ] Mandatory and optional shell zones are resolved declaratively.
- [ ] Typography, color, surface and density rules point to canonical tokens.
- [ ] Permission and active-route fallback behavior is documented.
- [ ] Keyboard, focus, contrast and reduced-motion checks are defined.
- [ ] Performance and observability budgets are recorded.
- [ ] Any exception has an owner and explicit approval evidence.
- [ ] The first CRM view has a completed SaaS view specification.

Automated evidence already available:

- [x] Full Vitest suite passes: 139 files and 557 tests.
- [x] `loopdev-os` production build compiles TypeScript and generates all pages.
- [x] Track and Markdown link validation pass.

### Exit criteria

CRM may proceed only when every entry criterion is checked or explicitly
deferred in an approved track decision with owner, risk, evidence and review
date. The first CRM view must then be validated against the standardization
matrix before additional CRM screens are created.

### Fase 3: Promotion and adoption gates

**Objetivo:** Establish component promotion, exception review and validation
gates for all new SaaS views.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Suites create local visual systems | Visual drift and duplicated maintenance | Shared recipes, ownership and exception gates | platform | open |
| Technical backgrounds reduce data readability | Cognitive load and accessibility regressions | Contrast, density and usage constraints | platform | open |
| Canvas modes become coupled to decoration | Inflexible structural contracts | Keep modes and recipes independent | platform | mitigated |
| Visual validation is subjective | Inconsistent review outcomes | Token checks, focused tests and reference compositions | governance | open |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Every standardization area has an owner, contract and evidence.
- [ ] Reference compositions pass visual and accessibility review.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-14 | Vitest completo | 139 archivos y 557 tests pasaron | `pnpm test` |
| 2026-08-14 | Build de LoopDev OS | Compilación, TypeScript y generación de páginas pasaron | `pnpm --filter loopdev-os build` |
| 2026-08-14 | Showcase runtime | `/composition-showcase` respondió HTTP 200 en desarrollo | `http://localhost:3000/composition-showcase` |
| 2026-08-14 | Enlaces y formato | Sin errores de formato; enlaces Markdown válidos | `git diff --check`, `pnpm docs:links:check` |
| 2026-08-14 | CreativeEditor layout contract | Regions now declare rows, placement, sizing and overflow; shell zones remain separate | `packages/contracts/src/platform/composition.ts`, `CompositionGrid/fixtures.ts` |
| 2026-08-14 | Automated readiness validation | 139 test files and 557 tests passed; LoopDev OS production build passed; browser review requires an authenticated session | `pnpm test`, `pnpm --filter loopdev-os build`, `/composition-showcase` |
| 2026-08-14 | TechnicalSurface contract | 5 focused tests passed, including semantic radius, border tone, width, grid and accessibility | `ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface/TechnicalSurface.test.tsx` |
| 2026-08-14 | Shared recipe state fixtures | All composition regions now expose loading, empty, error, forbidden, read-only, offline, stale and conflict treatments | `apps/loopdev-os/src/app/composition-showcase/page.tsx` |
| 2026-08-14 | Declarative reference fixtures | SuiteOverview now renders through CompositionGrid; DataWorkspace has filters, table and pagination; 2 focused contract tests passed | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.test.ts` |
| 2026-08-14 | Browser responsive review | Authenticated Playwright review passed for SuiteOverview and CreativeEditor at 1440, 1024 and 390; no horizontal overflow detected | `e2e/composition-showcase.visual.spec.mjs` |
| 2026-08-14 | Record and board reference fixtures | RecordWorkspace and BoardWorkspace render declarative regions with representative content, shared states and responsive overflow handling; 4 contract tests passed | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.test.ts`, `e2e/composition-showcase.visual.spec.mjs` |
| 2026-08-14 | Interaction and accessibility certification | Keyboard focus, read-only/forbidden action guards and reduced motion passed; 3 Playwright tests passed | `e2e/composition-showcase.interaction.spec.mjs`, `apps/loopdev-os/src/app/globals.css` |
| 2026-08-14 | Split, immersive and editor certification | SplitWorkspace and ImmersiveWorkflow now render domain fixtures; CreativeEditor exposes active tool, loading transport and focusable timeline; 8 Playwright tests passed across responsive and interaction specs | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `e2e/composition-showcase.visual.spec.mjs`, `e2e/composition-showcase.interaction.spec.mjs` |
| 2026-08-14 | Cross-cutting readiness certification | Light/dark toggle, semantic theme audit, navigation fallback, performance marks and sensitive-data-free observability passed in 10 authenticated Playwright tests | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `e2e/composition-showcase.interaction.spec.mjs` |

## Handoff de sesión

- **Fecha:** 2026-08-14.
- **Rama de continuación:** `docs/platform-shell-mode-inventory`.
- **Commit de partida:** `1a80e8e`.
- **Estado alcanzado:** Fase 0 y Fase 1 completadas; superficies, estados base y shell contextual están implementados. CreativeEditor fue restaurado al layout visual estable: stage, transport independiente y timeline inferior; SplitWorkspace ya mueve la acción al SuiteSidebar sin dejar riel duplicado.
- **Archivos clave:** `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface/`, `ds/packages/ui/src/components/composites/shell/ModuleContextSidebar/`, `tracks/active/platform/2026-08-14-saas-visual-standardization.md`.
- **Decisiones, bloqueos y riesgos:** No reabrir la geometría de CreativeEditor sin evidencia visual; la auditoría light/dark queda pendiente del usuario. El bloque amplio de readiness aún no está cerrado: faltan fixtures específicos por recipe, icon registry completo, interacción/responsive real y tests por recipe.
- **Validación ejecutada:** lint de `composition-showcase`; 10 tests focalizados pasaron en `TechnicalSurface` y `ModuleContextSidebar`; build de `loopdev-os` pasó antes de la restauración final del CreativeEditor; push confirmado en `origin/docs/platform-shell-mode-inventory`.
- **Siguiente acción concreta:** Continuar con la certificación de interacción, accesibilidad, iconos y estados avanzados. `RecordWorkspace` y `BoardWorkspace` ya tienen fixtures de referencia y validación responsive.

## Cierre

Pendiente de aprobación explícita.
