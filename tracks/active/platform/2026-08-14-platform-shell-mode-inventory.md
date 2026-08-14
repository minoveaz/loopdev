---
id: platform-shell-mode-inventory
title: Platform Shell and SuiteCanvas mode inventory
status: active
created: 2026-08-14
updated: 2026-08-14
owner: platform
lead: null
branch: docs/platform-shell-mode-inventory
branches: []
phase: 1
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, governance]
dependencies: []
blocked_by: []
supersedes: []
---

# Platform Shell and SuiteCanvas mode inventory

## Outcome

Produce an evidence-backed inventory and compatibility matrix for the
platform shell, `SuiteShell`, `SuiteSidebar`, and `SuiteCanvas` modes so every
suite can compose them without layout shifts, inaccessible states or divergent
navigation primitives.

## Contexto

The shell architecture defines `expanded`, `rail`, `hover`, and `hidden`
sidebar behavior and generic Canvas modes such as `overview`, `data`, `split`,
`board`, `record`, and `focus`. CRM will consume these contracts, but the
platform must verify them centrally before module-specific implementation.

## Alcance

### Incluido

- Inventory of AppShell, SuiteShell, PlatformHeader, SuiteSidebar,
  GlobalContextPanel, SuiteRuntime and SuiteCanvas.
- Mode/state matrix for desktop, keyboard, portal dropdown, tooltip, focus
  restoration and permission-filtered navigation.
- Contract review for NavigationSchema, AccessMap, active route and Canvas
  mode transitions.
- Existing implementation, fixture and test evidence.
- Gaps, regressions and implementation backlog with ownership.

### Excluido

- Creating a parallel suite sidebar.
- Changing shell contracts or responsive behavior during inventory.
- CRM business components or tenant-specific navigation rules.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-14 | Review shell modes before CRM route composition | CRM depends on generic Canvas and navigation guarantees | Shell findings become platform gates for CRM and other suites | User |

## Arquitectura y contratos

Use the existing shell ownership model and preserve `@loopdev/contracts`
navigation schemas. Hover expansion must overlay center content without moving
its x-coordinate; portalized footer menus must keep expanded state stable; rail
tooltips must not change layout dimensions.

## Branch strategy

Planning and inventory work stays on a dedicated documentation branch to be
created from synchronized `origin/develop` before execution.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Fix sources, owners, mode vocabulary and validation matrix.

**Definition of Ready**
- [x] Shell architecture, suite composition, interaction and testing guidance reviewed.
- [x] All shell implementations and neighboring tests identified.
- [x] Mode matrix fields and acceptance invariants agreed.
- [x] Dedicated documentation branch created from synchronized baseline.

**Entregables**
- [x] `docs/03-platform/PLATFORM_SHELL_MODE_INVENTORY.md`.
- [x] Shell/SuiteCanvas mode compatibility matrix.
- [x] Evidence and gap extraction rules.

**Validación**
- [x] Existing shell contract sources and neighboring tests identified.
- [x] Track validator and generated dashboard pass.

**Evidencia:** The inventory records all primary shell boundaries, six Canvas
modes, four sidebar modes, ownership constraints, acceptance invariants and
five implementation gates. No shell behavior was changed.

**Estado:** completada el 2026-08-14. Phase 1 can define and execute focused
shell mode tests.

### Fase 1: Mode compatibility validation

**Objetivo:** Verify declared SuiteCanvas modes and record shell interaction
gates without changing shell behavior.

**Entregables**
- [x] Render coverage for `overview`, `data`, `workspace`, `split`, `board`,
  and `full-bleed`.
- [x] CRM semantic mapping for `record` and `focus` to current contract modes.
- [x] `docs/03-platform/PLATFORM_SHELL_COMPATIBILITY_MATRIX.md`.
- [x] Align `AccessMap` with `forbidden` and `read-only` contract states.
- [ ] Hover overlay, portal footer and permission fallback interaction tests.

**Validación**
- [x] `pnpm test:shell:changed` evaluated the changed-surface gate.
- [ ] Contracts build and Vitest run in this worktree; dependencies are absent.
- [ ] `@loopdev/ui` SuiteCanvas test runner passes in a dependency-complete environment.

**Evidencia:** The current contract exposes six modes; focused render coverage
was added for all six. `record` and `focus` are documented as semantic
requirements, not silently added as unsupported enum values. The local UI
worktree has no dependencies installed, so the direct Vitest run is deferred
to CI or a clean install.

**Estado:** en curso

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Hover/portal behavior differs between implementations | Layout shift or inaccessible navigation | Test overlay, tolerance and focus invariants | platform | open |
| Canvas modes are generic in name but inconsistent in consumers | Suite-specific hacks and route regressions | Matrix every mode against concrete consumers | platform | open |

## Criterios de cierre

- [ ] Every shell mode has an owner, contract and test evidence.
- [ ] Every SuiteCanvas mode has a compatible consumer matrix.
- [ ] Gaps and implementation work are assigned.
- [ ] Validation passes with repository evidence.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |

## Handoff de sesión

- **Fecha:** 2026-08-14.
- **Rama de continuación:** `docs/platform-shell-mode-inventory`.
- **Commit de partida:** `f0b6390` (branch baseline with CRM separation).
- **Estado alcanzado:** Phase 0 inventory completed; no shell behavior changed.
- **Decisiones, bloqueos y riesgos:** Portal/hover and cross-mode tests remain
  implementation gates.
- **Validación ejecutada:** Track validator and generated dashboard pass.
- **Siguiente acción concreta:** Add focused shell mode tests for hover overlay,
  portal footer tolerance, Canvas mode transitions and access fallback.

## Cierre

Pendiente de aprobación explícita.
