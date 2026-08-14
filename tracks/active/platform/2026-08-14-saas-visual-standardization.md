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

- [ ] Existing platform and UI references inventoried.
- [ ] Canonical owners and source-of-truth locations identified.
- [ ] Dependencies with Platform Shell and Design System confirmed.
- [ ] Validation approach agreed for visual, accessibility and contract gates.

**Entregables**

- [x] Surface and background inventory.
- [x] Visual recipe catalog.
- [x] Cross-SaaS standardization matrix covering the 15 concern areas.
- [x] View specification template.
- [x] Gap, duplication and exception register.

**Validación**

- [ ] Documentation links and track integrity pass.
- [ ] Every proposed token/recipe has an owner and evidence source.
- [ ] No duplicate platform primitive is introduced.

**Evidencia:** [SaaS visual system inventory](../../../docs/03-platform/SAAS_VISUAL_SYSTEM_INVENTORY.md)
records current primitives and duplication. [SaaS visual recipes](../../../docs/03-platform/SAAS_VISUAL_RECIPES.md)
defines the proposed surface taxonomy and initial mode-to-recipe mapping.
[SaaS standardization matrix](../../../docs/03-platform/SAAS_STANDARDIZATION_MATRIX.md)
and [view specification template](../../../docs/03-platform/SAAS_VIEW_SPECIFICATION_TEMPLATE.md)
make the fifteen concern areas and per-view review contract actionable.
[SaaS visual gap register](../../../docs/03-platform/SAAS_VISUAL_GAP_REGISTER.md)
assigns the remaining duplication, accessibility, theming and exception work.

**Estado:** en curso

### Fase 1: Shared visual contracts

**Objetivo:** Define tokens, primitives, recipes, states and view contracts.

**Estado:** pendiente

### Fase 2: Reference compositions

**Objetivo:** Apply the contracts to representative dashboard, data, split,
record, board and immersive compositions without implementing full suites.

**Estado:** pendiente

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

## Handoff de sesión

- **Fecha:** 2026-08-14.
- **Rama de continuación:** `docs/platform-shell-mode-inventory`.
- **Commit de partida:** `e389092`.
- **Estado alcanzado:** Track activado en `active`; alcance transversal definido.
- **Decisiones, bloqueos y riesgos:** Depende del cierre técnico del inventario
  Platform Shell; no se implementan vistas de suites en este track.
- **Validación ejecutada:** Pendiente de validación de tracks y dashboard.
- **Siguiente acción concreta:** Ejecutar validación de tracks y comenzar el
  inventario de tokens, superficies y recetas existentes.

## Cierre

Pendiente de aprobación explícita.
