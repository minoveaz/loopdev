---
id: crm-component-inventory
title: CRM component inventory and reuse architecture
status: planned
created: 2026-08-13
updated: 2026-08-13
owner: crm
lead: null
branch: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [crm, platform, governance]
dependencies: [documentation-migration]
blocked_by: []
supersedes: []
---

# CRM component inventory and reuse architecture

## Outcome

Produce an approved, implementation-ready catalog of CRM components that
maximizes reuse across suites, prevents semantic duplicates, assigns each
component to the narrowest ownership layer, and identifies missing shared
capabilities before implementation begins.

## Contexto

The `docs/2026-execution-roadmap` branch defines Contacts, Leads, Pipeline,
Customer 360, Tasks/Notes/Timeline, and shared CRM journeys. Its component
audits intentionally distinguish existing shared primitives from CRM widgets,
features, and entities, but many names describe potentially overlapping
responsibilities. The `component-development` Skill and safe generator now
provide the method; this track applies that method to CRM.

Initial evidence reviewed:

- CRM component audits for Contacts, Leads, Pipeline, Customer 360, and Tasks.
- CRM UX specifications, contracts, and implementation handoffs.
- Existing `ds/packages/ui` implementations, exports, tests, and registry.
- Shared shell direction: `SuiteRuntime` and `SuiteCanvas` remain suite-agnostic.

Initial collision groups include record/detail previews, quick actions,
assignment controls, activity items/timelines, state components, tables,
filters, and pagination.

## Alcance

### Incluido

- Extracting every component suggestion from the CRM documentation branch.
- Reviewing the functional reason, journey, role, permission, state, and
  consumer for each suggestion.
- Comparing proposals with existing implementations, exports, tests, and the
  frontend registry.
- Normalizing names and clustering semantic duplicates.
- Deciding `reuse`, `variant`, `compose`, or `create`.
- Defining agnostic contracts and the narrowest valid route.
- Identifying missing capabilities and evidence gaps.
- Producing an implementation-ready catalog and decision matrix.

### Excluido

- Implementing CRM product components.
- Changing `SuiteRuntime` or `SuiteCanvas` contracts.
- Promoting a CRM component to `@loopdev/ui` based only on anticipated reuse.
- Changing CRM business contracts, RLS, or product scope.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-13 | Separate CRM component inventory into its own track | The inventory requires detailed module analysis and must not make the documentation migration indefinite | CRM receives independent phases, evidence, risks, and approval while reusing the component-development method | User |
| 2026-08-13 | Reuse before creation; promote shared components only with a second real consumer | Prevent suite-specific duplication in the shared design system | Every creation and promotion requires explicit evidence | User |

## Arquitectura y contratos

```text
CRM documentation branch
  -> component extraction and functional rationale
repository implementations and registry
  -> reference discovery and duplicate detection
component-development Skill
  -> reuse / variant / compose / create decision
approved CRM component catalog
  -> later implementation tracks
```

The catalog must distinguish:

- `@loopdev/ui` atoms and composites;
- shell/workspace contracts;
- suite `shared`;
- `entities`;
- `features`;
- `widgets`.

## Branch strategy

This is a planning and inventory track. Implementation branches will be
declared only after the catalog is approved and the user authorizes the next
phase.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Confirm sources, extraction method, ownership boundaries, and
approval criteria.

**Definition of Ready**

- [x] `component-development` Skill exists and defines the mandatory pipeline.
- [x] Safe `pnpm component:new` generator exists.
- [x] CRM documentation branch and module areas are identified.
- [ ] User approves starting the inventory.

**Entregables**

- [ ] Source inventory for all CRM module documents.
- [ ] Functional extraction schema.
- [ ] Duplicate and promotion decision rules.

**Validación**

- [ ] Track validation passes.
- [ ] Source paths and branch commit are recorded.

**Evidencia:** Initial CRM component findings are recorded in Contexto.

**Estado:** pendiente

### Fase 1: Extracción y normalización

**Objetivo:** Convert all documented component suggestions into a normalized
inventory with module, purpose, layer, and consumer information.

**Entregables**

- [ ] `crm-component-catalog.md`.
- [ ] Normalized component list with source citations.

**Estado:** pendiente

### Fase 2: Reuse, duplicate, and gap analysis

**Objetivo:** Compare every proposal with repository evidence and resolve
semantic collisions.

**Entregables**

- [ ] `crm-component-decision-matrix.json`.
- [ ] `crm-component-gaps.md`.
- [ ] Duplicate-review records for every `create` decision.

**Estado:** pendiente

### Fase 3: Contract and route approval

**Objetivo:** Define implementation-ready contracts, consumers, routes, and
promotion eligibility without implementing components.

**Entregables**

- [ ] Approved contracts and states for definitive components.
- [ ] Shared versus suite ownership decisions.
- [ ] Implementation backlog grouped by dependency.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| CRM names describe behavior without complete contracts | Duplicate or incompatible implementations | Require functional rationale, states, consumers, and contract summary before creation | crm/platform | open |
| Shared promotion based on anticipated reuse | Suite rules leak into `@loopdev/ui` | Require second real consumer and promotion evidence | platform | open |
| Remote roadmap branch changes while inventory is running | Non-reproducible source analysis | Record branch commit and source paths in evidence | crm | open |

## Criterios de cierre

- [ ] Every CRM component suggestion is extracted and normalized.
- [ ] Every suggestion has a reuse, variant, compose, or create decision.
- [ ] Semantic duplicate groups are resolved.
- [ ] Missing component capabilities are documented.
- [ ] Routes, consumers, states, and ownership are defined for definitive components.
- [ ] Validation passes with repository evidence.
- [ ] Residual risks and deferred implementation work are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-13 | CRM roadmap source inspection | Initial component audits and UX/contracts identified across five CRM areas | `origin/docs/2026-execution-roadmap:docs/06-product/crm/` |
| 2026-08-13 | Component workflow readiness | Passed; `component-development` Skill and safe generator available | `.github/skills/component-development/`, `scripts/components/create-component.mjs` |

## Handoff de sesión

- **Fecha:** 2026-08-13.
- **Rama de continuación:** `docs/documentation-migration`.
- **Commit de partida:** `cd817d8`.
- **Estado alcanzado:** The inventory work was separated from documentation
  migration; initial CRM module and collision findings are preserved.
- **Decisiones, bloqueos y riesgos:** No CRM components have been generated.
  The source branch must be pinned before detailed extraction.
- **Validación ejecutada:** Track validator and generator safety checks passed.
- **Siguiente acción concreta:** Obtain approval to start Phase 0, pin the
  roadmap branch commit, and create the normalized source inventory.

## Cierre

Pendiente de aprobación explícita.
