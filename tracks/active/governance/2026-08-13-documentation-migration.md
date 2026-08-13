---
id: documentation-migration
title: Documentation migration and registry standardization
status: active
created: 2026-08-13
updated: 2026-08-13
owner: governance
lead: null
branch: docs/documentation-migration
branches: []
phase: 4
pull_requests: []
issues: []
packages: []
release: not-required
areas: [governance, platform, ai-platform, marketing-studio, crm, mobile, health, quant]
dependencies: [track-governance]
blocked_by: []
supersedes: []
---

# Documentation migration and registry standardization

## Outcome

LoopDev has a governed documentation system with explicit lifecycle states,
frozen strategic references, one canonical registry per domain, an indexed
hybrid registry model, and no active dependency on obsolete documentation
locations.

## Contexto

The repository contains a useful but overlapping documentation structure under
`docs/` and legacy product, workflow, inventory, and style material under
`conductor/`. Two component registries also describe different slices of the
same frontend inventory. This track standardizes ownership and migration
without modifying the frozen product roadmap or pilot documents.

## Alcance

### Incluido

- Defining documentation lifecycle states and authority rules.
- Preserving the frozen strategic documents in `docs/architecture/`.
- Establishing `docs/registries/` as the hybrid registry entry point.
- Migrating the existing frontend component inventories into one canonical
  frontend registry without losing source provenance.
- Preparing backend, infrastructure, and product registries for future domains.
- Archiving dated audits and migrating valid legacy `conductor/` content.
- Updating references, validating links, and removing obsolete sources only
  after dependency review.

### Excluido

- Editing or renaming the frozen strategic documents.
- Rewriting substantive product strategy from the frozen documents.
- Introducing external documentation or work-management tooling.
- Deleting legacy sources before reference migration and validation.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-13 | Use a hybrid registry model with one canonical registry per domain and a global index | Avoid a single heterogeneous registry while preserving cross-domain discoverability | Creates `docs/registries/` and domain-specific schemas | User |
| 2026-08-13 | Freeze `LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md` and `LOOPDEV_PILOT.md` | Preserve the approved strategic baseline during cleanup | They cannot be moved, renamed, or edited in this migration | User |
| 2026-08-13 | Use `docs/registries/frontend-components.json` as the canonical frontend registry | Consolidate the two historical frontend inventories without filename-based deletion | 71 entries are retained with source provenance | User |
| 2026-08-13 | Preserve the former registries as migration sources until references are validated | Prevent loss of historical fields and semantics | Legacy files receive no new entries and remain temporarily | User |
| 2026-08-13 | Define documentation states in `docs/04-governance/DOCUMENTATION_GOVERNANCE.md` | Make authority and lifecycle explicit | All migrated documents receive a state and destination | User |

## Arquitectura y contratos

```text
docs/README.md
  -> documentation map and canonical entry points
docs/04-governance/DOCUMENTATION_GOVERNANCE.md
  -> lifecycle states, authority, and migration rules
docs/registries/index.json
  -> domain registry catalog
docs/registries/frontend-components.json
  -> canonical frontend component inventory and certifications
docs/registries/{backend,infrastructure,product}-*.json
  -> future domain registries
tracks/active/governance/2026-08-13-documentation-migration.md
  -> migration scope, phases, evidence, and closure criteria
```

## Branch strategy

All implementation for this migration is performed on
`docs/documentation-migration`. The frozen strategic documents remain unchanged
on this branch and are validated as part of every documentation milestone.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Establish the documentation authority model, freeze policy, and
migration baseline before removing or archiving sources.

**Definition of Ready**

- [x] Migration branch `docs/documentation-migration` created.
- [x] Documentation inventory and migration matrix reviewed.
- [x] Frozen strategic documents identified and verified unchanged.
- [x] Hybrid registry model approved.
- [x] Registry ownership and migration-source policy approved.
- [x] Documentation lifecycle states defined.

**Entregables**

- [x] `docs/README.md` created as the documentation index.
- [x] `docs/04-governance/DOCUMENTATION_GOVERNANCE.md` created.
- [x] `docs/registries/` created with global index and future-domain registries.
- [x] Canonical frontend registry created with 71 unique entries.
- [x] Active registry references updated to the canonical path.

**Validación**

- [x] Registry JSON files parse successfully.
- [x] Canonical frontend registry contains 71 unique IDs.
- [x] Local links in the new documentation files resolve.
- [x] Frozen documents have no diff.
- [x] `git diff --check` passes for the implementation changes.

**Evidencia:** Initial audit, registry comparison, and implementation validation
completed on 2026-08-13 in the `docs/documentation-migration` worktree.

**Estado:** cerrado — aprobado por el usuario el 2026-08-13

### Fase 1: Consolidación de registros

**Objetivo:** Complete the hybrid registry model without duplicating resource
authority.

**Definition of Ready**

- [ ] Canonical frontend schema reviewed against all 71 migrated entries.
- [ ] Required common fields and domain-specific fields approved.
- [ ] Ownership for backend, infrastructure, and product entries confirmed.

**Entregables**

- [x] Document the common registry schema and domain extensions.
- [x] Normalize common fields on all 71 frontend entries.
- [x] Map implementation paths for all 71 frontend entries from repository evidence.
- [x] Map existing component type contracts from repository evidence.
- [x] Record missing contract, test, and documentation evidence as explicit gaps;
  creating that evidence is outside this migration.
- [x] Define backend capability registry entries from repository evidence.
- [x] Define infrastructure capability registry entries from platform evidence.
- [x] Define product module registry entries from the frozen roadmap and tracks.
- [x] Add a generated and validated cross-domain registry view.

**Validación**

- [x] No duplicate resource IDs across all domain registries.
- [x] Every canonical entry has an owner and lifecycle status.
- [x] Registry JSON files parse against the documented field contract.
- [x] Registry references are updated in active documentation and workflows.

**Evidencia:** Common schema documented in
`docs/registries/REGISTRY_SCHEMA.md`; 71 frontend entries normalized and 15
backend, infrastructure, and product entries catalogued on 2026-08-13.

**Estado:** cerrado — aprobado por el usuario el 2026-08-13

### Fase 2: Auditorías y migración de `conductor/`

**Objetivo:** Preserve useful legacy evidence while removing obsolete authority
from the active documentation surface.

**Definition of Ready**

- [x] All active references to `conductor/` are inventoried and classified as
  historical provenance or compatibility material.
- [x] Historical snapshots have a dated archive destination.
- [x] Each former `conductor/` document has a migration decision.

**Entregables**

- [x] Archive the two legacy component registries with a dated migration README.
- [x] Create `docs/04-governance/audits/` and its index.
- [x] Archive dated governance and inventory snapshots.
- [x] Migrate `conductor/jscpd-exceptions.md` to governance.
- [x] Reconcile `conductor/tech-stack.md` with platform and foundations docs.
- [x] Reconcile `conductor/product.md` and `product-guidelines.md` with product and frontend authorities.
- [x] Reconcile `conductor/workflow.md` with `docs/03-platform/GIT_WORKFLOW.md`.
- [x] Remove `conductor/setup_state.json` after confirming it is generated state.

**Validación**

- [x] No active track references an obsolete `conductor/` authority; remaining
  `migration_source` values are historical provenance.
- [ ] Historical documents are marked `HISTORICAL` or `DEPRECATED`.
- [ ] All migrated links resolve.

**Evidencia:** Pendiente.

**Estado:** cerrado — aprobado por el usuario el 2026-08-13

### Fase 3: Referencias, calidad y limpieza

**Objetivo:** Make the new documentation model reliable in day-to-day
development and safe to maintain.

**Definition of Ready**

- [ ] Registry and legacy-source migrations are complete.
- [ ] Active documentation owners are identified.
- [ ] Required validation commands are confirmed.

**Entregables**

- [x] Update remaining documentation, track, script, and workflow references.
- [x] Add a documented link and registry validation procedure.
- [x] Add ownership and review cadence for navigation and canonical documents.
- [x] Remove deprecated source files only after validation.

**Validación**

- [x] Documentation links and registry JSON validate.
- [x] Track validation passes.
- [x] No frozen document was modified.
- [x] Relevant quality checks pass for changed surfaces.

**Evidencia:** Link and registry checks are automated through
`pnpm docs:links:check` and `pnpm registries:check`; CI runs both checks before
the existing quality gates.

**Estado:** completada; aprobada por el usuario el 2026-08-13.

### Fase 4: Adopción y cierre

**Objetivo:** Review and normalize the complete `docs/` corpus so the
standardized documentation model becomes the operating record for future work.

**Definition of Ready**

- [x] Phases 1 through 3 have evidence and no unresolved migration blockers.
- [x] The user approves the final migration state.

**Entregables**

- [x] Inventory every document under `docs/`; the content review remains
  explicitly pending per entry and excludes only frozen strategic documents from
  content changes.
- [ ] Confirm an explicit lifecycle state, authority, owner, and review cadence
  for every reviewed document.
- [ ] Update, consolidate, relocate, archive, or formally retain each document
  with a documented reason and updated references.
- [ ] Document onboarding and contribution guidance.
- [ ] Record final registry and archive ownership.

**Validación**

- [ ] Full documentation content and reference review passes.
- [x] Inventory generation, synchronization, and link validation pass.
- [ ] Track validation and generated dashboard pass.
- [ ] Residual risks and deferred work are documented.

**Evidencia:** The generated
[`DOCUMENTATION_REVIEW_INVENTORY.md`](../../../docs/04-governance/DOCUMENTATION_REVIEW_INVENTORY.md)
covers 100 documentation files and identifies 62 entries that still require
document-by-document content review. Every entry now has a proposed lifecycle
state, authority, owner, cadence, canonical destination, and initial action;
these proposals require confirmation during content review. Generation is
reproducible with `pnpm docs:inventory:generate` and checked with
`pnpm docs:inventory:check`.

**Revisión ejecutada — Foundations y Platform:** 15 documentos revisados.
Se identificaron un plan de gaps y un roadmap de infraestructura superseded,
un modelo de seguridad duplicado, y conflictos de terminología entre
`tenants` y `organizations`. Las acciones propuestas están registradas en el
inventario; no se archiva ni fusiona ningún documento hasta migrar sus
referencias y conservar la evidencia necesaria.

La primera alineación ya está aplicada en
`SAAS_DATA_MODEL.md`, `MULTI_TENANCY_STRATEGY.md` y
`DATABASE_SECURITY_RLS.md`: `organizations`/`organization_id` es el modelo
canónico y `tenants`/`tenant_id` queda documentado como compatibilidad legacy.

**Revisión ejecutada — Frontend y Design System:** 12 documentos revisados.
Se corrigieron referencias de registry, tracks, versiones visuales y
terminología de organizations. Se identificaron referencias legacy a Firestore,
Chromatic y rutas de paquetes que requieren verificación contra la
implementación antes de cerrar sus acciones.

Tras la aprobación del usuario, se retiraron 49 referencias legacy a
`userHistories.md` del registro frontend; la evidencia documental ausente queda
marcada explícitamente como gap. La validación visual activa queda definida con
Playwright.

**Revisión ejecutada — Governance y Operations:** Se revisaron las guías de
auditoría, certificación, prompts operativos, templates y comandos del
orquestador. Las reglas activas quedaron alineadas con organizations,
tracks/, el registro JSON canónico y Playwright. Los snapshots de auditoría
siguen siendo históricos; `ROADMAP_BRAND_HUB.md` queda marcado para archivado
después de migrar cualquier hito vigente a un track.

**Migración de prompts legacy:** `AUDIT_INFRA_PROMPT.md`,
`INFRA_CERTIFICATION_CHECKLIST.md` e `INFRA_ENGINEERING_PROMPT.md` fueron
marcados como `DEPRECATED`, sus reglas vigentes se consolidaron en
`INFRA_IMPLEMENTATION_SKILL.md` y `QA_TESTING_SKILL.md`, se actualizaron las
referencias activas y los originales se archivaron en
`docs/archive/prompts/2026-08-13/`.

**Brand Hub:** El usuario confirmó que `BRAND_HUB_DOMAIN.md` y
`ROADMAP_BRAND_HUB.md` no representan la dirección actual. Ambos fueron
marcados como `DEPRECATED` y archivados en
`docs/archive/product/brand-hub/2026-08-13/` sin migrar milestones; cualquier
futuro Brand Hub deberá partir de un track y autoridades nuevas.

**Product experimental:** El usuario confirmó que los documentos de Brand Hub,
Trading Ops y Quant Ops revisados no representan la realidad actual. Se
marcaron como deprecated y se archivaron en
`docs/archive/product/experimental/2026-08-13/`; las referencias activas de
registros fueron retiradas o clasificadas como experimentales.

**Revisión inicial — AI Skills:** Se actualizó el índice y registro del
framework, se eliminaron referencias a prompts deprecated, y se alinearon
ejemplos de tenancy con `organization_id`.

**Revisión — Skills de gobernanza:** Se revisaron las cuatro Skills de Tier 3.
Security Audit permanece como referencia detallada y las otras tres fueron
archivadas tras migrar su routing a `track-governance`, `validation-framework`
y `git-workflow`.

**Skill operativa consolidada:** Se creó
`.github/skills/security-review/SKILL.md` como autoridad ejecutable para
revisiones de organizaciones, RLS, contratos, migraciones, secretos, gates de
release y evidencia en tracks. La Skill detallada de seguridad queda como
referencia ampliada, no como una segunda autoridad operativa.

**Estado:** en curso

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-13 | Replaced a single global component JSON with a hybrid domain registry model | Frontend, backend, infrastructure, and product resources require different schemas | Added domain registries and a global index; frontend consolidation remains in Phase 1 | User |
| 2026-08-13 | Closed Phase 0 and started Phase 1 | User reviewed and explicitly approved the Phase 0 evidence | Registry schema review and domain consolidation are now active | User |
| 2026-08-13 | Closed Phase 1 and started Phase 2 | User reviewed and explicitly approved the registry model and catalog | Legacy registry archiving and `conductor/` migration are now active | User |
| 2026-08-13 | Closed Phase 2 and started Phase 3 | User reviewed and explicitly approved the archive and `conductor/` removal evidence | Reference, quality, and cleanup validation are now active | User |
| 2026-08-13 | Closed Phase 3 and started Phase 4 | User reviewed and explicitly approved the link, registry, and quality validation evidence | Adoption guidance, ownership finalization, and closure review are now active | User |
| 2026-08-13 | Confirmed documentation authorities | User confirmed `organizations`/`organization_id`, `tracks/` plus the canonical JSON registry, and Playwright for visual validation | Tenancy, frontend workflow, and testing guidance are aligned to the confirmed authorities | User |
| 2026-08-13 | Deprecated infrastructure prompt layer | User approved replacing the legacy infrastructure prompts with Skills and archiving the originals | Infrastructure implementation and QA Skills become the operational authorities | User |
| 2026-08-13 | Archived obsolete Brand Hub documents | User confirmed the domain definition and roadmap do not represent the current Brand Hub direction | Both documents are historical only; future Brand Hub work requires a new track and authorities | User |
| 2026-08-13 | Archived experimental product documentation | User confirmed Ops, Trading, and the reviewed Brand Hub documents are experimental and obsolete | Product registries no longer use archived documents as active evidence; Quant Ops is classified as experimental | User |
| 2026-08-13 | Consolidated operational security review | User approved grouping the current security and governance rules into an operational repository Skill | `.github/skills/security-review/SKILL.md` is the executable authority; detailed AI documentation remains reference material | User |
| 2026-08-13 | Archived obsolete governance Skills | User approved archiving Architecture Review, Performance Optimization, and Release Readiness as superseded documentation | Active routing now uses repository Skills; archived files remain historical provenance | User |
| 2026-08-13 | Archived experimental Product, Ops, and Trading documents | User confirmed these documents no longer represent current product direction | Brand Hub, Quant Ops, and Trading UX documents are historical; new scope requires an approved track | User |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Legacy `conductor/` references remain in historical and active material | Broken links or conflicting authority | Inventory classified references; retain only historical provenance | governance | mitigated |
| The two source registries use different schemas | Data loss or ambiguous ownership | Preserve provenance and validate the canonical schema before deleting sources | governance | open |
| Frozen strategic documents are accidentally modified | Roadmap and pilot baseline become unreliable | Verify their diff remains empty at each milestone | governance | mitigated |
| Future domain registries lack authoritative entries | Incomplete cross-domain inventory | Populate only from repository evidence and dedicated domain reviews | domain owners | open |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-13 | Registry JSON parsing and unique-ID check | Passed; 71 unique frontend entries | `docs/registries/*.json` |
| 2026-08-13 | Frozen document diff check | Passed; no changes | `docs/architecture/LOOPDEV_*.md` |
| 2026-08-13 | Local links in new documentation | Passed | `docs/README.md`, `docs/04-governance/DOCUMENTATION_GOVERNANCE.md` |
| 2026-08-13 | `git diff --check` | Passed | Current branch |
| 2026-08-13 | Track validator and dashboard generation | Passed before and after generation | `node scripts/tracks/validate-tracks.mjs` |
| 2026-08-13 | Branch base validation | Passed; `origin/develop` is an ancestor | `node scripts/validate-branch-base.mjs` |
| 2026-08-13 | Common registry schema normalization | Passed; 71 entries have required common fields and unique IDs | `docs/registries/REGISTRY_SCHEMA.md`, `docs/registries/frontend-components.json` |
| 2026-08-13 | Repository evidence mapping | Passed; implementation 71/71, documentation 55/71, tests 67/71 | `docs/registries/frontend-components.json` |
| 2026-08-13 | Contract evidence mapping | Passed; existing type contracts mapped for 62/71 entries | `docs/registries/frontend-components.json` |
| 2026-08-13 | Evidence gaps recorded | Passed; missing documentation, contracts, and tests are explicit and remain out of scope | `docs/registries/frontend-components.json`, `docs/registries/REGISTRY_SCHEMA.md` |
| 2026-08-13 | Domain registries populated | Passed; backend 5, infrastructure 5, product 5, with 86 unique IDs across all registries | `docs/registries/*.json` |
| 2026-08-13 | Generated registry catalog | Passed; catalog generated and synchronization check passed | `pnpm registries:generate`, `pnpm registries:check` |
| 2026-08-13 | Legacy registry archive | Passed; both source registries archived with original-path provenance | `docs/archive/registries/2026-08-13/` |
| 2026-08-13 | Legacy `conductor/` migration | Passed; snapshots archived, canonical exceptions migrated, compatibility pointers retained | `docs/archive/conductor/`, `docs/04-governance/audits/` |
| 2026-08-13 | Deprecated pointer archive | Passed; no active guidance remains under `conductor/` | `docs/archive/conductor/deprecated-pointers/` |
| 2026-08-13 | `conductor/` reference audit | Passed; active references are migrated or historical provenance | `rg "conductor/" docs tracks scripts .github` |
| 2026-08-13 | Legacy directory removal | Passed; `conductor/` no longer exists in the worktree | `Test-Path conductor` |
| 2026-08-13 | Documentation link automation | Passed; Markdown links can be checked deterministically | `pnpm docs:links:check` |
| 2026-08-13 | CI documentation gates | Passed; link and registry checks run before quality gates | `scripts/validate-ci.mjs` |
| 2026-08-13 | AI Skills archive and routing validation | Passed; obsolete governance Skills archived and active references migrated | `docs/archive/ai-skills/2026-08-13/`, `docs/06-ai-skills/`, `.github/skills/` |

## Handoff de sesión

- **Fecha:** 2026-08-13.
- **Rama de continuación:** `docs/documentation-migration`.
- **Commit de partida:** `b115f6d`.
- **Estado alcanzado:** Fases 0, 1, 2 y 3 cerradas con aprobación explícita.
  Fase 4 continúa para consolidar adopción, ownership y cierre.
- **Decisiones, bloqueos y riesgos:** Los documentos estratégicos congelados no
  se han modificado. No hay bloqueos técnicos; la Fase 4 debe completar la
  guía de adopción y la revisión final de referencias.
- **Validación ejecutada:** `pnpm docs:links:check` (150 archivos),
  `pnpm docs:inventory:check`, `pnpm registries:check`,
  `node scripts/tracks/validate-tracks.mjs` y `git diff --check`; todo pasó
  salvo que la primera ejecución de `git diff --check` detectó whitespace, que
  fue corregido.
- **Siguiente acción concreta:** Continuar la revisión de Product y completar
  la clasificación documento por documento, preservando los dos documentos
  estratégicos congelados.

## Cierre

Pendiente de aprobación explícita.
