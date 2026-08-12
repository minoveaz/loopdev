---
id: package-lifecycle
title: Package lifecycle and release readiness
status: active
created: 2026-08-12
updated: 2026-08-12
owner: platform
lead: null
branch: chore/platform-package-inventory
branches: []
phase: 0
pull_requests: []
issues: []
packages: ["@loopdev/contracts", "@loopdev/ui"]
release: not-required
areas: [platform, governance]
dependencies: [track-governance]
blocked_by: []
supersedes: []
---

# Package lifecycle and release readiness

## Outcome

LoopDev has an explicit lifecycle policy for shared packages: each package is classified as
internal, publishable, or application-only; package changes receive the right validation; and
future releases can be introduced without coupling application deployment to library versioning.

## Contexto

LoopDev is a pnpm and Turbo monorepo with shared contracts, a shared UI system, and deployable
applications. The repository currently contains the private `@loopdev/contracts` package and the
UI package under `ds/packages/ui`, but it has no approved package publication policy, Changesets
configuration, registry, or release workflow.

The immediate need is package governance and release readiness. Publishing packages is explicitly
out of the initial implementation phase until the package boundary and distribution need are
confirmed.

## Alcance

### Incluido

- Inventory and classification of shared packages, modules, and applications.
- Versioning policy for packages that may be distributed independently.
- Package-specific build, typecheck, and consumer validation requirements.
- Track metadata and evidence for package-impacting changes and future releases.
- Decision record for a future Changesets, registry, and publication workflow.

### Excluido

- Publishing packages during phase 0.
- Making internal packages public or changing package privacy without approval.
- Versioning deployable applications as npm packages.
- Choosing a registry or production release environments before a distribution need exists.
- Introducing Changesets only for the sake of adding tooling.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-12 | Create a separate package lifecycle track owned by `platform` | Package governance is broader than the completed track automation and belongs to shared platform ownership | Package policy and release automation are handled independently from repository governance | User |
| 2026-08-12 | Treat shared libraries as independently versionable when publication is justified | Contracts and UI can evolve at different rates from applications | Applications are not forced into package releases | User |
| 2026-08-12 | Defer Changesets, registry, and publication automation until package classification and distribution needs are approved | The current packages are internal and there is no release workflow | Phase 0 remains focused on inventory, policy, and validation readiness | User |

## Arquitectura y contratos

```text
track metadata
  -> package impact classification
  -> package-specific validation
  -> consumer compatibility evidence
  -> approved release decision
  -> optional versioning and registry workflow
```

Package lifecycle decisions must not change application deployment semantics. A package release,
when introduced, will record its package name, version, source commit, validation, registry, and
environment in the related track evidence.

## Branch strategy

This is a planned governance and platform track. It starts without an implementation branch. A
branch is selected when phase 0 produces an approved implementation scope for package validation or
release automation.

## Fases

### Fase 0: Inventory and readiness

**Objetivo:** establish the current package boundary, ownership, privacy, consumers, and validation
requirements before introducing release tooling.

**Definition of Ready**

- [ ] Current package and shared-module inventory is complete.
- [ ] `@loopdev/contracts`, `@loopdev/ui`, applications, and non-publishable modules are classified.
- [ ] Package owners and primary consumers are identified.
- [ ] The distinction between package publication and application deployment is documented.

**Entregables**

- [ ] Package inventory with privacy and publication intent.
- [ ] Independent versioning policy for publishable packages.
- [ ] Package-impact rules for tracks and pull requests.
- [ ] Validation matrix for package-only, consumer, dependency, and root changes.

**Validación**

- [ ] Inventory is reviewed against the pnpm workspace and Turbo configuration.
- [ ] Each shared package has a build and typecheck command or an explicit exception.
- [ ] At least one representative contracts change and one UI change are mapped to validation.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 1: Package validation implementation

**Objetivo:** make package-impacting changes receive focused validation without weakening the
existing full validation fallback.

**Definition of Ready**

- [ ] Phase 0 inventory and validation matrix are approved.
- [ ] Shared contracts and root/dependency fallback rules are explicit.

**Entregables**

- [ ] Affected-package build and typecheck routing where reliable.
- [ ] Consumer validation for packages with known application consumers.
- [ ] Track evidence produced by package-impacting pull requests.

**Validación**

- [ ] Package-only, consumer, dependency, and root changes trigger the expected checks.
- [ ] Protected branches retain full validation coverage.
- [ ] Skipped package checks are visible and cannot hide a required fallback.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 2: Release policy and publication decision

**Objetivo:** decide whether and how LoopDev distributes packages outside the monorepo.

**Definition of Ready**

- [ ] At least one package has an approved external or cross-repository distribution need.
- [ ] Package privacy and ownership are approved.
- [ ] Registry and release environments are selected.

**Entregables**

- [ ] Changesets or an approved alternative selected.
- [ ] Registry and authentication model documented.
- [ ] Release approval and rollback policy documented.
- [ ] Release evidence contract added to the track template or skill if needed.

**Validación**

- [ ] A dry-run version and changelog can be generated without publishing.
- [ ] Publication permissions and provenance are verified.
- [ ] A release can be traced to a track, source commit, package, and validation result.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Automated publication

**Objetivo:** publish approved packages through a protected workflow only after phase 2 decisions are
complete.

**Definition of Ready**

- [ ] Phase 2 policy is approved.
- [ ] Registry credentials and environments are available through protected secrets.
- [ ] Release approval and rollback behavior are tested.

**Entregables**

- [ ] Version and changelog workflow.
- [ ] Protected package publication workflow.
- [ ] Track evidence update or release report.

**Validación**

- [ ] Dry-run and real publication are distinguishable.
- [ ] Re-running a release is idempotent or safely blocked.
- [ ] Applications are not published as packages accidentally.

**Evidencia:** Pendiente.

**Estado:** diferida

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Publishing internal packages too early | Unnecessary registry and credential complexity | Keep packages private until a distribution need is approved | platform | open |
| Package validation becomes weaker than global CI | Regressions reach protected branches | Retain full fallback for shared contracts, dependencies, root, and CI changes | governance | open |
| Versioning policy couples applications to libraries | Noisy releases and unclear deployment ownership | Version publishable libraries independently and deploy applications separately | platform | open |
| Registry choice is made before ownership is clear | Rework and incorrect access controls | Decide privacy, consumers, and ownership in phase 0 | platform | open |

## Criterios de cierre

- [ ] Package inventory and classification are approved.
- [ ] Versioning and package-impact validation policies are documented.
- [ ] Required validation is implemented and tested, or explicitly deferred with rationale.
- [ ] Release tooling decisions are documented as approved or deferred.
- [ ] Residual risks and future publication prerequisites are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-12 | Repository package inventory | Initial inventory found `@loopdev/contracts`; UI package remains under `ds/packages/ui` | `package.json` files |
| 2026-08-12 | Release tooling inventory | No `.changeset` directory or release/publication workflow found | Repository inspection |

## Handoff de sesión

- **Fecha:** 2026-08-12.
- **Rama de continuación:** chore/platform-package-inventory.
- **Commit de partida:** c75457d.
- **Estado alcanzado:** Phase 0 activated on the package inventory branch; package inventory and policy readiness are now in execution.
- **Decisiones, bloqueos y riesgos:** Packages remain internal; Changesets, registry, and publication are deferred until distribution need is approved.
- **Validación ejecutada:** Track transition validation pending.
- **Siguiente acción concreta:** Complete the package inventory and review consumers against workspace and Turbo configuration.

## Cierre

Pendiente de aprobación explícita.
