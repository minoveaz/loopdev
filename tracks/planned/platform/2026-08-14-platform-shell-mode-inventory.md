---
id: platform-shell-mode-inventory
title: Platform Shell and SuiteCanvas mode inventory
status: planned
created: 2026-08-14
updated: 2026-08-14
owner: platform
lead: null
branch: null
branches: []
phase: 0
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
- [ ] Shell architecture, suite composition, interaction and testing guidance reviewed.
- [ ] All shell implementations and neighboring tests identified.
- [ ] Mode matrix fields and acceptance invariants agreed.
- [ ] Dedicated documentation branch created from `origin/develop`.

**Entregables**
- [ ] Source and implementation inventory.
- [ ] Shell/SuiteCanvas mode compatibility matrix.
- [ ] Evidence and gap extraction rules.

**Validación**
- [ ] `pnpm test:shell:changed` passes for affected shell tests.
- [ ] Track validator and generated dashboard pass.

**Evidencia:** Pendiente.

**Estado:** pendiente

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
- **Rama de continuación:** Pendiente de crear.
- **Commit de partida:** `origin/develop` pendiente de fijar.
- **Estado alcanzado:** Track created from shell architecture guidance.
- **Decisiones, bloqueos y riesgos:** Inventory only; no shell behavior changes.
- **Validación ejecutada:** Pending.
- **Siguiente acción concreta:** Create the documentation branch and execute Phase 0.

## Cierre

Pendiente de aprobación explícita.
