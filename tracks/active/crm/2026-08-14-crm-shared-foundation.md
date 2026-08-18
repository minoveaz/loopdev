---
id: crm-shared-foundation
title: CRM shared foundation implementation
status: active
created: 2026-08-14
updated: 2026-08-18
owner: crm
lead: null
branch: feature/crm-g0-shared-foundation
branches: []
phase: 1
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
read model, authorized notes, and a reusable organization-isolation baseline
for CRM persistence and governance.

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
- Harden CRM and Communications policies, grants, append-only audit behavior
  and organization-aware relationship constraints.
- Add a static migration governance gate, reusable pgTAP helpers and a
  table/suite Definition of Ready/Done checklist.

### Excluido

- CRM route UI and module-specific forms.
- Changes to `SuiteRuntime` or `SuiteCanvas`.
- Registry promotion, unrelated migrations, and product scope changes.

## Decisiones aprobadas

| Fecha      | Decisión                                                       | Motivo                                                                            | Impacto                                                                  | Aprobado por |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------ |
| 2026-08-14 | Start with shared CRM foundation                               | Shared activity, notes and lookup are dependencies for every module               | Module tracks wait for these contracts and fixtures                      | User         |
| 2026-08-14 | Keep Platform Shell inventory separate from CRM implementation | SuiteCanvas and shell modes are shared platform contracts, not CRM-owned behavior | CRM consumes the validated shell contract; shell work gets its own track | User         |
| 2026-08-18 | Execute G0 from a clean branch based on current `develop` | The historical CRM branch contains mixed history and no effective diff against `develop` | All new implementation and validation commits target `feature/crm-g0-shared-foundation`; the old branch is reference-only | User |
| 2026-08-18 | Treat Supabase/RLS hardening as part of CRM G0 | The shared CRM foundation cannot close without real tenant, workspace and verb-level authorization evidence | CRM policies, cross-organization constraints, seed/reset and pgTAP become blocking G0 deliverables | User |
| 2026-08-18 | Reuse one organization-aware hardening pattern for CRM and Communications | Both foundations had broad mutation policies and relationship paths that could bypass organization ownership | A versioned migration splits policies by verb, tightens grants, adds composite FKs and makes append-only records immutable; Communications is included only for the same identified risk | User |
| 2026-08-18 | Make migration governance a CI gate and provide shared readiness artifacts | Security properties must be checked before a database reset is available | Changed migrations are statically checked for ownership, RLS, verb policies, grants and scoped relationships; pgTAP helpers and a DoR/DoD checklist become reusable inputs for new suites | User |

## Arquitectura y contratos

The server resolves organization, workspace, membership and capabilities for
every read and mutation. The browser receives authorized read models only.
Activity is append-only and deduplicates by `sourceType:sourceId`; notes omit
content when the caller lacks permission. Lookup responses are bounded,
cursor-backed and cannot reveal cross-organization records.

Database hardening uses composite `(record_id, organization_id)` keys for
CRM relationships, separate policies for each SQL verb, and an append-only
trigger for activities and audit events. Communications receives the same
policy/grant treatment because it shares the affected foundation risk. The
static gate runs against changed migrations and the pgTAP suite verifies
organization, workspace and append-only negative cases.

## Branch strategy

Implementation uses `feature/crm-g0-shared-foundation`, created from the current
synchronized `develop` baseline after PR #110. The historical
`origin/feature/crm-shared-foundation` branch is reference-only and must not be
used for new work.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Reconcile contracts and establish testable implementation gates.

**Definition of Ready**

- [x] `develop` baseline is synchronized with `origin/develop`.
- [x] `feature/crm-g0-shared-foundation` is created from that baseline.
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

### Fase 1: G0 database hardening and reusable governance

**Objetivo:** Close the organization-isolation baseline for CRM persistence and
make the same controls enforceable for future tables and suites.

**Definition of Ready**

- [x] The approved CRM and platform tenancy authorities are identified.
- [x] Existing CRM and Communications migrations and their negative-risk paths
      are inventoried.
- [x] The local validation and CI entry points are known.

**Entregables**

- [x] Versioned CRM/Communications hardening migration with per-verb policies,
      least-privilege grants, composite organization-aware FKs and append-only
      triggers.
- [x] Static migration governance validator and CI gate.
- [x] Reusable pgTAP helpers and focused CRM isolation tests.
- [x] Database table/suite DoR/DoD checklist.

**Validación**

- [x] Governance validator unit tests pass.
- [x] SQL patch passes `git diff --check`.
- [x] Local Supabase reset, lint and pgTAP execution.

**Evidencia:** The implementation is present in
`supabase/migrations/20260902000000_crm_security_hardening.sql`,
`scripts/validate-supabase-governance.mjs`,
`supabase/tests/database/005_crm_security.sql`,
`supabase/tests/helpers/rls_helpers.sql` and
`docs/03-platform/DATABASE_TABLE_SUITE_READINESS_CHECKLIST.md`. Local Supabase
reset, lint and pgTAP now pass with Docker Desktop running.

**Estado:** en progreso; implementación y certificación local completadas.

## Estado actualizado 2026-08-18

La rama histórica `feature/crm-shared-foundation` sigue publicada en remoto,
pero contiene historial mezclado y no aporta diferencias frente a `develop`. La
rama de trabajo vigente es `feature/crm-g0-shared-foundation`, creada limpia
desde el `develop` posterior al merge del PR #110. La foundation UI del PR #108
ya está mergeada, pero no sustituye la validación de contratos, RLS, seed/reset
ni pruebas de aislamiento de este track.

El track permanece activo y bloqueado para cierre hasta completar G0:
hardening de policies por verbo, aislamiento cross-tenant y cross-workspace,
auditoría append-only, seed/reset reproducible, idempotencia y validación real
de Supabase/RLS y Vitest. Su siguiente consumidor previsto es Contacts (#82),
después de cerrar las condiciones de G1.

## Riesgos y bloqueos

| Riesgo o bloqueo                                           | Impacto                                       | Mitigación                                     | Responsable  | Estado |
| ---------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | ------------ | ------ |
| Existing CRM schemas may conflict with roadmap read models | Unsafe generated contracts or migration drift | Reconcile before implementation                | crm/platform | open   |
| Activity and audit semantics may be conflated              | Incorrect retention or disclosure             | Approve separate event boundaries and fixtures | crm          | open   |
| CRM and Communications policies use broad `FOR ALL` access | Read permissions may authorize mutation or deletion | Split policies by SQL verb and validate negative cases with pgTAP | crm/platform | mitigated; runtime evidence pending |
| CRM relationships do not consistently enforce organization ownership | Cross-organization references may bypass intended isolation | Add composite organization-aware foreign keys and constraints | crm/platform | mitigated; reset evidence pending |
| Local Supabase reset is not reproducible | CI and developer evidence can diverge from migration state | Align `supabase/config.toml` with the canonical seed and certify reset | platform | open; config seed path still needs correction |
| Static checks could drift from the migration contract | A future suite may reintroduce an unsafe table or grant | Keep the changed-migration governance gate and reusable checklist in CI | platform | mitigated; CI evidence pending |

## Criterios de cierre

- [ ] Shared contracts and fixtures are approved.
- [ ] RLS, state, accessibility and contract tests pass.
- [ ] Module tracks can consume the foundation without duplicating it.
- [ ] Risks and deferred work are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| ----- | ---------- | --------- | ---------- |
| 2026-08-18 | `pnpm test:supabase-governance` | Pass (4 tests) | `scripts/validate-supabase-governance.test.mjs` |
| 2026-08-18 | `pnpm validate:full` | Bloqueado por 2 enlaces Markdown preexistentes fuera de este cambio | `docs/06-product/crm/{contacts,leads}/*IMPLEMENTATION_HANDOFF.md` |
| 2026-08-18 | `pnpm registries:check` | Pass | Generated registry catalog |
| 2026-08-18 | `git diff --check` | Pass | Working tree |
| 2026-08-18 | Supabase reset/lint/pgTAP | Bloqueado: Docker local apagado/no disponible | `.github/workflows/supabase.yml` remains the CI gate |

## Handoff de sesión

- **Fecha:** 2026-08-18.
- **Rama de continuación:** `feature/crm-g0-shared-foundation`.
- **Commit de partida:** `5df63e8` (`feature/crm-g0-shared-foundation` before
  this implementation slice).
- **Estado alcanzado:** G0 hardening, static migration governance, reusable
  pgTAP helpers, focused CRM isolation tests and the table/suite checklist are
  implemented without commit/push.
- **Decisiones, bloqueos y riesgos:** Communications was hardened only for the
  same broad-policy and cross-organization relationship risk. Docker is
  unavailable locally, so reset/lint/pgTAP evidence remains a CI gate.
- **Validación ejecutada:** Migration governance unit tests and `git diff
  --check` pass. The changed-file gate is wired in CI; local database execution
  is pending.
- **Siguiente acción concreta:** Run the Supabase workflow (reset, lint and
  `005_crm_security.sql`) in an environment with Docker, then reconcile the
  evidence before closing G0 and starting Contacts.

## Cierre

Pendiente de aprobación explícita.
