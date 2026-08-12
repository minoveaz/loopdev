---
id: track-governance
title: Track Governance and Migration
status: active
created: 2026-08-12
updated: 2026-08-12
owner: governance
branch: feature/track-governance
areas: [governance, platform]
dependencies: []
blocked_by: []
supersedes: []
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
---

# Track Governance and Migration

## Outcome

LoopDev has a versioned, single-file, specification-driven track system that is visible by status, supports phases and approved decisions, records validation evidence, and requires explicit approval before closure.

## Contexto

The legacy `conductor/tracks` structure mixed folders and standalone files, used inconsistent names, separated related specification/plan/story documents, and depended on a manual index that did not reliably expose operational state.

## Alcance

### Incluido

- Root `tracks/` lifecycle folders for planned, active, and closed work.
- Single-file migration of all legacy tracks with preserved historical content.
- Standard template, project skill, slash prompts, validation, and generated dashboard.
- Explicit governance for phases, decisions, evidence, blockers, and closure.

### Excluido

- Rewriting the substantive historical specification of every closed track.
- Reclassifying the remaining `conductor` product, inventory, and workflow documents.
- External work-management tooling.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-12 | One Markdown file per track | Preserve a readable, versioned system of record | Legacy folder documents are consolidated | User |
| 2026-08-12 | Use `tracks/{planned,active,closed}` | Make lifecycle visible without Jira-like overhead | Directory and metadata status must agree | User |
| 2026-08-12 | Close ambiguous legacy tracks during migration | User-approved historical classification policy | Closure is recorded as migration policy, not fresh execution evidence | User |
| 2026-08-12 | Require explicit approval for future closures | Keep closure accountable and evidence-based | Skill never auto-closes a current track | User |
| 2026-08-12 | Organize planned and active tracks by canonical domain; closed tracks by year | Make work visible by product/technical ownership while keeping history chronological | `owner` is a canonical domain and controls the active/planned path | User |
| 2026-08-12 | Require a branch strategy for active tracks | Connect specification, implementation, PRs and CI without inventing a single branch for transversal programs | Normal tracks use `branch`; transversal programs document `branches` and strategy | User |
| 2026-08-12 | Keep track automation portable across macOS and Windows | Contributors and agents work on both platforms | Node.js scripts use repository-relative paths only | User |

## Arquitectura y contratos

```text
.github/skills/track-governance
  -> template and governance procedures
.github/prompts/create-track|update-track|review-track|close-track
  -> focused slash-command entry points
scripts/tracks
  -> metadata validation and dashboard generation
tracks/{planned,active,closed}
  -> single-file system of record
```

## Fases

### Fase 0: Modelo y automatización

**Objetivo:** definir el lifecycle, plantilla, skill, prompts, validation and generated dashboard.

**Definition of Ready**
- [x] Lifecycle, naming, ownership, and closure policies approved.
- [x] Legacy migration policy approved.

**Entregables**
- [x] `track-governance` skill and template.
- [x] Slash prompts for create, update, review, and close.
- [x] Validation and dashboard generation scripts.

**Validación**
- [x] Script syntax validation.
- [x] Track validation against the migrated inventory.

**Evidencia:** `node --check scripts/tracks/*.mjs` and `node scripts/tracks/validate-tracks.mjs` passed on 2026-08-12.

**Estado:** cerrado

### Fase 1: Migración y adopción

**Objetivo:** consolidate tracks, remove legacy structure, and establish the new system as the operating record.

**Entregables**
- [x] 27 legacy/current tracks consolidated into `tracks/`.
- [x] Legacy `conductor/tracks` and manual index removed.
- [x] Generated dashboard created.
- [x] Tracks organized by canonical domain and closure year.
- [x] Metadata and validation extended for owner, lead, branch strategy, phase, packages and release impact.
- [ ] Integrate this governance track and AI Platform track after branch reconciliation.
- [ ] Review active tracks using `/review-track` and formalize their remaining closure criteria.

**Validación**
- [x] Metadata/directory/filename validation passed after migration.
- [x] Domain/year organization and generated dashboard validation passed.
- [ ] Confirm branch reconciliation and review the active tracks.

**Evidencia:** `tracks/README.md` is generated from the 27 normalized track files.

**Estado:** en curso

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-12 | Migrate all legacy tracks in one initiative | User selected full migration | Added consolidation script and migration phase | User |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Active tracks retain legacy section shapes | Their closure criteria need future formalization | Review each active track before closure | governance | open |
| AI Platform track is isolated on another branch | It is not yet part of the normalized inventory | Reconcile branches, then move it into `tracks/active` | platform | open |

## Criterios de cierre

- [x] All legacy tracks are consolidated into one file each.
- [x] Skill, template, prompts, validator, and generated dashboard are present.
- [x] Legacy tracks directory and manual index are removed.
- [ ] AI Platform work is reconciled into the new structure.
- [ ] Active tracks are reviewed for formal closure criteria.
- [ ] Closure is approved explicitly by the user.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-12 | `node --check scripts/tracks/*.mjs` | Correcta | Scripts de tracks |
| 2026-08-12 | `node scripts/tracks/migrate-legacy-tracks.mjs` | Correcta | 27 tracks consolidados |
| 2026-08-12 | `node scripts/tracks/validate-tracks.mjs` | Correcta | Metadata y estructura |
| 2026-08-12 | `node scripts/tracks/generate-tracks-index.mjs` | Correcta | `tracks/README.md` |

## Cierre

Pendiente de aprobación explícita después de reconciliar AI Platform y revisar los tracks activos.
