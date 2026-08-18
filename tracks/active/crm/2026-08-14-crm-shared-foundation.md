---
id: crm-shared-foundation
title: CRM shared foundation implementation
status: active
created: 2026-08-14
updated: 2026-08-18
owner: crm
lead: null
branch: feature/crm-contacts-backend-foundation
branches: []
phase: 1
pull_requests: [111]
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

| Fecha      | Decisión                                                                   | Motivo                                                                                                       | Impacto                                                                                                                                                                                   | Aprobado por |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-08-14 | Start with shared CRM foundation                                           | Shared activity, notes and lookup are dependencies for every module                                          | Module tracks wait for these contracts and fixtures                                                                                                                                       | User         |
| 2026-08-14 | Keep Platform Shell inventory separate from CRM implementation             | SuiteCanvas and shell modes are shared platform contracts, not CRM-owned behavior                            | CRM consumes the validated shell contract; shell work gets its own track                                                                                                                  | User         |
| 2026-08-18 | Execute G0 from a clean branch based on current `develop`                  | The historical CRM branch contains mixed history and no effective diff against `develop`                     | All new implementation and validation commits target `feature/crm-g0-shared-foundation`; the old branch is reference-only                                                                 | User         |
| 2026-08-18 | Treat Supabase/RLS hardening as part of CRM G0                             | The shared CRM foundation cannot close without real tenant, workspace and verb-level authorization evidence  | CRM policies, cross-organization constraints, seed/reset and pgTAP become blocking G0 deliverables                                                                                        | User         |
| 2026-08-18 | Reuse one organization-aware hardening pattern for CRM and Communications  | Both foundations had broad mutation policies and relationship paths that could bypass organization ownership | A versioned migration splits policies by verb, tightens grants, adds composite FKs and makes append-only records immutable; Communications is included only for the same identified risk  | User         |
| 2026-08-18 | Make migration governance a CI gate and provide shared readiness artifacts | Security properties must be checked before a database reset is available                                     | Changed migrations are statically checked for ownership, RLS, verb policies, grants and scoped relationships; pgTAP helpers and a DoR/DoD checklist become reusable inputs for new suites | User         |
| 2026-08-18 | Prepare Contacts backend-first without waiting for the frontend            | The frontend is being delivered by another team and needs stable backend wiring                              | Contacts is the first foundation consumer; its contracts, API, RLS, fixtures and tests are delivered independently and documented for later UI integration                                | User         |

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

Implementation uses `feature/crm-contacts-backend-foundation`, created from the current
synchronized `develop` baseline after PR #113. The historical
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

El PR #111 (`feat(crm): enforce G0 shared foundation controls`) fue mergeado en
`develop` el 2026-08-18. G0 queda integrado con hardening de policies por verbo,
aislamiento cross-tenant y cross-workspace, auditoría append-only, seed/reset
reproducible, idempotencia, redacción API, gobernanza de migraciones y evidencia
CI verde. El track permanece activo para validar el primer consumidor, Contacts
(#82), sin duplicación de la foundation y para recibir aprobación explícita de
cierre.

## Siguiente slice: Contacts backend-first

Contacts se implementará sin front-end en esta fase, con la rama
`feature/crm-contacts-backend-foundation`, creada desde el `develop` que contiene
el PR #111 y la actualización documental posterior. El equipo frontend recibirá
contratos y fixtures estables para cablear sus componentes después.

El trabajo seguirá estos cinco puntos:

1. **Mantener la foundation estable:** consumir contratos, helpers, policies y
   operaciones compartidas sin duplicar lógica CRM.
2. **Preparar el backend de Contacts:** definir entidades, migraciones, relaciones,
   RLS, permisos, API, errores, paginación, filtros, auditoría e idempotencia.
3. **Definir el contrato de integración:** documentar read models, commands,
   queries, envelopes, estados, forbidden/error cases y compatibilidad para UI.
4. **Validar con evidencia:** añadir fixtures y tests de schema, RLS, API,
   autorización, aislamiento y regresión sin depender del navegador.
5. **Dejar el flujo reusable:** registrar una plantilla para repetir
   definición → contrato → schema/RLS → API → tests → handoff frontend en Leads,
   Pipeline, Tasks y Customer 360.

Los siguientes módulos CRM no se implementan en este slice; reutilizarán este
flujo y sus artefactos después de que Contacts esté certificado.

### Estado de implementación Contacts

El contrato backend-first ya está cableado en `packages/contracts/src/crm/crm.ts`
y la API del slice en `apps/loopdev-os/src/app/api/crm/contacts/route.ts`.
La primera entrega cubre listado/búsqueda autorizados con cursor, creación
validada y actualización con control optimista mediante `expectedUpdatedAt`.
La UI, Customer 360 visual y merge humano quedan fuera de esta iteración.

## Riesgos y bloqueos

| Riesgo o bloqueo                                                     | Impacto                                                     | Mitigación                                                              | Responsable  | Estado                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| Existing CRM schemas may conflict with roadmap read models           | Unsafe generated contracts or migration drift               | Reconcile before implementation                                         | crm/platform | mitigated; Contacts contract maps only the approved current schema       |
| Activity and audit semantics may be conflated                        | Incorrect retention or disclosure                           | Approve separate event boundaries and fixtures                          | crm          | mitigated; separate append-only tables and pilot timeline fixtures       |
| CRM and Communications policies use broad `FOR ALL` access           | Read permissions may authorize mutation or deletion         | Split policies by SQL verb and validate negative cases with pgTAP       | crm/platform | mitigated; local runtime evidence green                                |
| CRM relationships do not consistently enforce organization ownership | Cross-organization references may bypass intended isolation | Add composite organization-aware foreign keys and constraints           | crm/platform | mitigated; local reset evidence green                                  |
| Local Supabase reset is not reproducible                             | CI and developer evidence can diverge from migration state  | Align `supabase/config.toml` with the canonical seed and certify reset  | platform     | mitigated; canonical seed path and organization scope now pass locally |
| Static checks could drift from the migration contract                | A future suite may reintroduce an unsafe table or grant     | Keep the changed-migration governance gate and reusable checklist in CI | platform     | mitigated; PR #111 CI evidence green                                   |

## Criterios de cierre

- [x] Shared contracts and fixtures are approved.
- [x] RLS, state and contract tests pass; accessibility is not applicable to this backend-only phase.
- [x] Contacts can consume the foundation without duplicating it; its backend
      contract, API, RLS evidence and deterministic pilot fixtures are present.
- [x] Risks and deferred work are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha      | Validación                                                              | Resultado                                                                     | Referencia                                                   |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 2026-08-18 | `supabase db reset` + `supabase db lint --local` + pgTAP database suite | Pass: 128 tests                                                               | Local Docker/Supabase; canonical `seed_loopdev.sql`          |
| 2026-08-18 | Supabase TypeScript type generation + LoopDev OS typecheck              | Pass; generated types include CRM/Communications hardening constraints        | CLI 2.114.0 with local `supabase_admin` database URL         |
| 2026-08-18 | `pnpm test:supabase-governance`                                         | Pass (4 tests)                                                                | `scripts/validate-supabase-governance.test.mjs`              |
| 2026-08-18 | `pnpm validate:full`                                                    | Pass with local Supabase URL and anon key; CRM links and full build green     | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 2026-08-18 | PR #111 GitHub Actions                                                  | Pass; Supabase governance, reset, lint, pgTAP and repository CI green         | `github.com/minoveaz/loopdev/pull/111`                       |
| 2026-08-18 | `pnpm registries:check`                                                 | Pass                                                                          | Generated registry catalog                                   |
| 2026-08-18 | `git diff --check`                                                      | Pass                                                                          | Working tree                                                 |
| 2026-08-18 | LoopDev OS production build                                             | Pass con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` locales | `pnpm --filter loopdev-os build`                             |
| 2026-08-18 | Contacts API route tests                                                | Pass; 7 tests                                                        | `apps/loopdev-os/src/app/api/crm/contacts/route.test.ts`     |
| 2026-08-18 | Top-level Supabase database suites                                      | Pass; 133 tests                                                      | `supabase test db --local` con suites 001-005                |
| 2026-08-18 | `pnpm validate:full`                                                     | Pass con variables locales de Supabase                               | Full repository validation                                   |
| 2026-08-18 | `pnpm docs:links:check` + `pnpm registries:check`                       | Pass                                                                  | Documentation and generated catalog                          |

## Handoff de sesión

- **Fecha:** 2026-08-18.
- **Rama de continuación:** `feature/crm-contacts-backend-foundation`.
- **Commit de partida:** `b89a812` (`origin/develop`), con PR #111 y la
  actualización documental ya integrados.
- **Estado alcanzado:** G0 hardening, migration governance, reusable pgTAP
  helpers, CRM isolation tests, canonical seed, generated database types,
  API-level idempotency/redaction tests and CI validation are integrated into
  `develop` through PR #111.
- **Decisiones, bloqueos y riesgos:** Communications was hardened only for the
  same identified broad-policy and cross-organization risk. Residual work is
  verification by the first consuming module and explicit closure approval; no
  production Supabase credentials or data are used locally.
- **Validación ejecutada:** Local reset/lint/128 pgTAP tests, governance tests,
  CRM contract/API tests (15), contracts build, LoopDev OS typecheck and
  production build with local Supabase variables pass; PR #111 GitHub Actions
  passed. Contacts backend contract/API tests: 12 route tests, 8 contract
  tests and repository typecheck pass. Contacts RLS/integrity coverage now adds
  organization isolation, scoped foreign keys and duplicate protection; all
  database suites pass with 133 tests.
- **Fixtures CRM piloto:** `supabase/seed_crm_pilot.sql` se ejecuta después del
  seed base mediante `supabase/config.toml`. Es determinista, sintético y
  reproducible, e incluye escenarios de lead ganado, perdido, seguimiento
  pendiente, revisión de duplicados, tareas, notas y timeline de actividades.
  Los usuarios de prueba usan exclusivamente `example.test`.
- **Validación adicional:** `supabase db reset --local --yes` pasa cargando el
  seed base y el pack piloto sin errores.
- **Siguiente acción concreta:** publicar la certificación de Contacts en su PR,
  confirmar el handoff con el equipo frontend y solicitar aprobación explícita
  para cerrar este track.

## Cierre

Pendiente de aprobación explícita.
