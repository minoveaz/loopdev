---
id: crm-shared-foundation
title: CRM shared foundation implementation
status: active
created: 2026-08-14
updated: 2026-08-18
owner: crm
lead: null
branch: feature/crm-shared-foundation
branches: []
phase: 0
pull_requests: []
issues: [70, 71, 72, 73, 74, 75, 82]
packages: []
release: not-required
areas: [crm, platform]
dependencies: [crm-component-inventory]
blocked_by: []
supersedes: []
---

# CRM shared foundation implementation

## Outcome

Implement the shared CRM foundation required by Contacts, Leads, Pipeline,
Customer 360 and Tasks: an authorized lookup contract, append-only activity
read model, and authorized notes feature.

## Contexto

The CRM inventory is closed and identifies three shared foundations whose
contracts must converge before module-specific UI. This track implements only
the approved shared boundaries and does not promote them to `@loopdev/ui`.

## Alcance

### Incluido

- Reconcile shared CRM contracts with `packages/contracts/src/crm`.
- Define organization/workspace scoping, capabilities, cursor pagination,
  idempotency, audit and conflict behavior.
- Implement contract, RLS, accessibility and state tests.
- Produce fixtures consumed by the later CRM module tracks.

### Excluido

- CRM route UI and module-specific forms.
- Changes to `SuiteRuntime` or `SuiteCanvas`.
- Registry promotion, unrelated migrations, and product scope changes.

## Decisiones aprobadas

| Fecha      | Decisión                                                       | Motivo                                                                            | Impacto                                                                  | Aprobado por |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------ |
| 2026-08-14 | Start with shared CRM foundation                               | Shared activity, notes and lookup are dependencies for every module               | Module tracks wait for these contracts and fixtures                      | User         |
| 2026-08-14 | Keep Platform Shell inventory separate from CRM implementation | SuiteCanvas and shell modes are shared platform contracts, not CRM-owned behavior | CRM consumes the validated shell contract; shell work gets its own track | User         |

## Arquitectura y contratos

The server resolves organization, workspace, membership and capabilities for
every read and mutation. The browser receives authorized read models only.
Activity is append-only and deduplicates by `sourceType:sourceId`; notes omit
content when the caller lacks permission. Lookup responses are bounded,
cursor-backed and cannot reveal cross-organization records.

## Branch strategy

Implementation uses `feature/crm-shared-foundation`, created from the
synchronized `origin/develop` baseline.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Reconcile contracts and establish testable implementation gates.

**Definition of Ready**

- [x] `develop` baseline is synchronized with `origin/develop`.
- [x] `feature/crm-shared-foundation` is created from that baseline.
- [x] Shared contracts and existing schemas are reconciled.
- [x] Capability, RLS and redaction matrices are approved.

**Entregables**

- [x] `docs/06-product/crm/CRM_SHARED_FOUNDATION_READINESS.md`.
- [x] `docs/06-product/crm/fixtures/crm-shared-foundation-fixtures.json`.
- [x] Implementation plan with migrations, tests and rollback boundaries.

**Validación**

- [x] Track validator passes.
- [x] Contract and RLS test plan is reviewed.

**Evidencia:** Existing CRM schemas were reviewed against the approved shared
boundaries. Readiness findings, capability/redaction rules, rollback boundaries
and negative cases are recorded in the readiness document and fixtures.

**Estado:** completada el 2026-08-14. Implementation can begin.

## Estado actualizado 2026-08-18

La rama `feature/crm-shared-foundation` sigue publicada en remoto, pero no existe un PR asociado ni evidencia de merge en `develop`. La foundation UI del PR #108 ya está mergeada, pero no sustituye la validación de contratos, RLS, seed/reset ni pruebas de aislamiento de este track.

El track permanece activo y bloqueado para cierre hasta ejecutar la validación remota de Supabase/RLS y completar los checks contractuales. Su siguiente consumidor previsto es Contacts (#82), después de cerrar las condiciones de G1.

## Riesgos y bloqueos

| Riesgo o bloqueo                                           | Impacto                                       | Mitigación                                     | Responsable  | Estado |
| ---------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | ------------ | ------ |
| Existing CRM schemas may conflict with roadmap read models | Unsafe generated contracts or migration drift | Reconcile before implementation                | crm/platform | open   |
| Activity and audit semantics may be conflated              | Incorrect retention or disclosure             | Approve separate event boundaries and fixtures | crm          | open   |

## Criterios de cierre

- [ ] Shared contracts and fixtures are approved.
- [ ] RLS, state, accessibility and contract tests pass.
- [ ] Module tracks can consume the foundation without duplicating it.
- [ ] Risks and deferred work are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| ----- | ---------- | --------- | ---------- |

## Handoff de sesión

- **Fecha:** 2026-08-14.
- **Rama de continuación:** `feature/crm-shared-foundation`.
- **Commit de partida:** `22483b9` (`origin/develop` baseline).
- **Estado alcanzado:** Shared schemas, migration, write/read APIs and mocked
  route tests are committed and pushed through `607873b`.
- **Decisiones, bloqueos y riesgos:** Supabase local is unavailable; RLS
  integration remains a CI/remote-environment gate. Vitest dependency
  installation is corrupted locally but outside Git.
- **Validación ejecutada:** Contract build, smoke checks, track validation and
  `git diff --check` pass. Vitest execution is pending in a clean environment.
- **Siguiente acción concreta:** Run RLS and Vitest validation in CI, then start
  the Contacts consumer after the Platform Shell inventory confirms mode
  contracts.

## Cierre

Pendiente de aprobación explícita.
