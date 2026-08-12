---
id: package-lifecycle
title: Package lifecycle and release readiness
status: active
created: 2026-08-12
updated: 2026-08-12
owner: platform
lead: null
branch: chore/platform-package-impact-validation
branches: []
phase: 1
pull_requests: [52, 54, 55]
issues: []
packages: ["@loopdev/contracts", "@loopdev/ui", "@loopdev/ui-native", "@loopdev/design-contracts", "@loopdev/tokens", "@loopdev/tailwind-config", "@loopdev/eslint-config", "@loopdev/tsconfig"]
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
| 2026-08-12 | Classify `@loopdev/ui` as the only publication candidate; classify all other packages as internal and applications/playgrounds as application-only | The user confirmed that only the shared web UI may require distribution outside the monorepo | Phase 1 validates internal consumers without changing package privacy or enabling publication; phase 2 may revisit only UI distribution prerequisites | User |

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

This is an active governance and platform track executing phase 1 on
`chore/platform-package-impact-validation`. Phase 0 inventory and classification are approved. This
branch implements affected-package validation while preserving the full fallback for shared,
dependency, root, workflow, and ambiguous changes. Release tooling remains deferred.

## Inventario de packages y consumidores

The workspace is declared by `pnpm-workspace.yaml` across `apps/*`, `packages/*`,
`modules/*`, `ds/packages/*`, `ds/apps/*`, and `labdev`. The current manifest inventory contains
the following shared packages and workspaces:

| Package/workspace | Ruta | Clasificación inicial | Privacidad | Scripts relevantes | Consumidores directos conocidos |
| --- | --- | --- | --- | --- | --- |
| `@loopdev/contracts` | `packages/contracts` | Internal shared contract library | Private | `build`, `lint`, `typecheck` | `@loopdev/ui`, `loopdev-os`, `loopdev-mobile` |
| `@loopdev/ui` | `ds/packages/ui` | Shared web UI library; only publication candidate | Not marked private | `build`, `lint`, `typecheck`, `test` | `loopdev-os` |
| `@loopdev/ui-native` | `ds/packages/ui-native` | Internal mobile UI library | Private | `lint`, `typecheck` | `loopdev-mobile` |
| `@loopdev/design-contracts` | `ds/packages/design-contracts` | Internal design-system contracts | Private | `lint`, `typecheck` | `@loopdev/ui-native`, `loopdev-mobile` |
| `@loopdev/tokens` | `ds/packages/tokens` | Internal shared design foundation | Not marked private | `lint`, `typecheck` | `@loopdev/ui-native`, `loopdev-os`, `loopdev-mobile`; UI has a TypeScript path reference |
| `@loopdev/tailwind-config` | `ds/packages/tailwind-config` | Internal web tooling/configuration | Not marked private | `lint`, `typecheck` | `@loopdev/ui` |
| `@loopdev/eslint-config` | `ds/packages/eslint-config` | Internal tooling/configuration; no workspace consumer found | Not marked private | `lint`, `typecheck` | None found in current source scan |
| `@loopdev/tsconfig` | `ds/packages/tsconfig` | Internal TypeScript configuration; no workspace consumer found | Not marked private | `lint`, `typecheck` | None found in current source scan |
| `loopdev-os` | `apps/loopdev-os` | Deployable web application | Private | `build`, `lint`; tests run from root Vitest projects | `@loopdev/contracts`, `@loopdev/tokens`, `@loopdev/ui` |
| `loopdev-mobile` | `apps/loopdev-mobile` | Deployable mobile application | Private | `lint`, `typecheck`, `test`, `test:coverage` | `@loopdev/design-contracts`, `@loopdev/contracts`, `@loopdev/tokens`, `@loopdev/ui-native` |
| `estar-protegidos` | `ds/apps/estar-protegidos` | Deployable application | Not marked private | `build`, `lint`, `typecheck` | No shared workspace dependency declared |
| `playground` | `ds/apps/playground` | Development playground; not a release package | Not marked private | `lint`, `typecheck` | No shared workspace dependency declared |
| `my-company-web-platform` | `ds` | Private workspace container, not a distributable package | Private | Delegates to Turbo | Contains the design-system workspace |

Applications and the `ds` workspace container are not candidates for npm publication. A manifest
without `"private": true` is not publication approval; publication intent requires an explicit
decision in this track.

### Dependency graph

```text
@loopdev/contracts -> @loopdev/ui -> loopdev-os
@loopdev/contracts -----------------> loopdev-os
@loopdev/contracts -----------------> loopdev-mobile
@loopdev/design-contracts -> @loopdev/ui-native -> loopdev-mobile
@loopdev/design-contracts -----------------------> loopdev-mobile
@loopdev/tokens -> @loopdev/ui-native -> loopdev-mobile
@loopdev/tokens ---------------------> loopdev-os
@loopdev/tokens ---------------------> loopdev-mobile
@loopdev/tailwind-config -> @loopdev/ui -> loopdev-os
```

The graph is based on workspace dependency declarations, source imports, Next transpilation
configuration, and the UI TypeScript path mapping. It is a validation baseline, not a release
artifact; phase 1 may replace the manual mapping with affected-package automation.

## Política inicial de versionado

| Category | Versioning policy | Release status |
| --- | --- | --- |
| Shared library with approved external consumer | Independent package version; breaking API or contract changes require explicit release evidence | Deferred until phase 2 approval |
| Internal shared library | Repository changes are validated through consumers; no registry release | Current default |
| Tooling/configuration package | Version only if independently distributed; otherwise repository-owned | Current default |
| Application or playground | Application deployment/versioning, never npm package release | Excluded from package publication |

### Decisión aprobada: clasificación de distribución

The approved classification is to keep `@loopdev/contracts` and all non-UI packages internal, treat
`@loopdev/ui` as the only publication candidate, and keep applications/playgrounds application-only.
This classification does not change `private` metadata, publish to a registry, or authorize a
release.

In this track, **internal** means that a package is owned and consumed by this repository and its
applications. Its API is validated through workspace consumers and commits, but it has no approved
external distribution contract, registry publication, or independent release process.

**Publication candidate** means that a package has a package boundary that may justify distribution
outside this monorepo. It is not public and is not publishable by default: an external consumer,
package owner, versioning policy, registry, authentication, release approval, and rollback policy
must be approved before phase 2 or phase 3 can authorize publication.

## Matriz de validación de impacto

| Change surface | Minimum validation | Consumer/fallback validation |
| --- | --- | --- |
| `@loopdev/contracts` | Package lint, typecheck, and build | `@loopdev/ui`, `loopdev-os`, mobile tests/typecheck; full root fallback for contract or dependency changes |
| `@loopdev/ui` | Package lint, typecheck, build, and Vitest tests | `loopdev-os` build and frontend E2E when its web surface is affected |
| `@loopdev/ui-native` | Package lint and typecheck | Mobile lint, typecheck, and Jest/Expo tests |
| `@loopdev/design-contracts` | Package lint and typecheck | `@loopdev/ui-native` and mobile validation |
| `@loopdev/tokens` | Package lint and typecheck | UI, UI Native, web app, and mobile validation according to consumers |
| `@loopdev/tailwind-config` | Package lint and typecheck | UI build and affected web application validation |
| `@loopdev/eslint-config` or `@loopdev/tsconfig` | Package lint and typecheck | Full fallback when shared configuration changes affect repository tooling |
| `supabase/**` | Supabase migration reset, schema lint, and database contract tests from `supabase.yml` | Application quality only when application code also changes |
| Root, lockfile, Turbo, workflows, or ambiguous shared changes | Full `pnpm validate:ci` and relevant specialized workflows | Protected branch fallback; do not reduce checks from path heuristics |
| Application-only change | Application package checks | E2E or mobile checks when the affected application surface requires them |

Current CI runs the root quality job for executable/configuration changes and the specialized
Supabase workflow for `supabase/**`. Mobile package checks are declared in `apps/loopdev-mobile`
but are not currently part of the root CI workflow; this is a phase 0 gap to resolve before phase 1
automation is considered complete.

## Fases

### Fase 0: Inventory and readiness

**Objetivo:** establish the current package boundary, ownership, privacy, consumers, and validation
requirements before introducing release tooling.

**Definition of Ready**

- [x] Current package and shared-module inventory is complete.
- [x] `@loopdev/contracts`, `@loopdev/ui`, applications, and non-publishable modules are classified.
- [x] Package owners and primary consumers are identified.
- [x] The distinction between package publication and application deployment is documented.

**Entregables**

- [x] Package inventory with privacy and publication intent.
- [x] Independent versioning policy for publishable packages.
- [x] Package-impact rules for tracks and pull requests.
- [x] Validation matrix for package-only, consumer, dependency, and root changes.

**Validación**

- [x] Inventory is reviewed against the pnpm workspace and Turbo configuration.
- [x] Each shared package has a build and typecheck command or an explicit exception.
- [x] At least one representative contracts change and one UI change are mapped to validation.

**Evidencia:** Manifest inventory, dependency declarations, source imports, Next transpilation
configuration, and UI TypeScript path mappings were inspected. `@loopdev/contracts` build and
`@loopdev/ui` build passed. UI tests passed with Vitest 4 constrained to one worker (`101` files,
`373` tests); the default concurrent package test run exited before executing tests, so worker
configuration/resource behavior remains a validation gap. Mobile Jest/Expo checks are declared in
the package but are not wired into root CI.

**Estado:** completada

### Fase 1: Package validation implementation

**Objetivo:** make package-impacting changes receive focused validation without weakening the
existing full validation fallback.

**Definition of Ready**

- [x] Phase 0 inventory and validation matrix are approved.
- [x] Shared contracts and root/dependency fallback rules are explicit.

**Entregables**

- [x] Affected-package build and typecheck routing where reliable.
- [x] Consumer validation for packages with known application consumers.
- [ ] Track evidence produced by package-impacting pull requests.

**Validación**

- [x] Package-only, consumer, dependency, and root changes trigger the expected checks.
- [x] Protected branches retain full validation coverage.
- [x] Skipped package checks are visible and cannot hide a required fallback.

**Evidencia:** Added `scripts/validate-package-impact.mjs` and focused `node:test` coverage for
documentation, UI, contracts, mobile, Supabase, root, shared configuration, and unknown paths.
Dry-runs confirm UI routing to package checks plus `loopdev-os` build, contracts routing to its
declared consumers plus global fallback, mobile routing to global plus mobile checks, and
Supabase-only changes remaining in the specialized workflow. The new CI jobs install frozen
dependencies and expose the resolver outputs for package and mobile validation while retaining
the existing `validate:ci` fallback.

Focused resolver tests, Node syntax, ESLint, Prettier, UI lint/typecheck/build, and mobile
lint/typecheck passed. Mobile Jest currently has three pre-existing failures in `App.test.tsx`
(two 5-second timeouts and one organization-state expectation); the `loopdev-os` consumer build
also fails in generated `.next/dev/types` because `src/app/operation-os/page.tsx` cannot be
resolved. The full phase remains open until those validation gaps are addressed or explicitly
accepted in a later evidence update.

**Estado:** en ejecución

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
| 2026-08-12 | Make global quality conditional and decouple workflow changes from frontend E2E | Documentation-only changes should not wait for lint, typecheck, tests, and build; workflow changes retain full quality validation without implying frontend changes | Phase 0 PR validation becomes faster without reducing executable-change coverage | User |
| 2026-08-12 | Classify `@loopdev/ui` as the only publication candidate and all other packages as internal | The user confirmed that external distribution is only a future possibility for the shared web UI | Phase 1 validates internal consumers without changing package privacy or enabling publication | User |

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
| 2026-08-12 | Planned-to-active transition | Passed; track status, directory, owner, branch, and unique id validated | `node scripts/tracks/validate-tracks.mjs` |
| 2026-08-12 | Track dashboard generation | Passed; dashboard regenerated from the active inventory | `node scripts/tracks/generate-tracks-index.mjs` |
| 2026-08-12 | Package classification approval | User approved `@loopdev/ui` as the only publication candidate; all other packages are internal and applications/playgrounds are application-only | User decision recorded in `Decisiones aprobadas` |
| 2026-08-12 | Phase 0 readiness merge | Passed; inventory, consumers, versioning policy, and impact matrix merged in PR #54 | Commit `0832cca` |
| 2026-08-12 | Phase 1 activation merge | Passed; approved classification and phase 1 readiness merged in PR #55 | Commit `47915d4` |

## Handoff de sesión

- **Fecha:** 2026-08-12.
- **Rama de continuación:** chore/platform-package-impact-validation.
- **Commit de partida:** 47915d4.
- **Estado alcanzado:** Phase 0 classification and readiness were approved and merged; phase 1 implementation is active for affected-package validation.
- **Decisiones, bloqueos y riesgos:** Packages remain internal; Changesets, registry, and publication are deferred until distribution need is approved.
- **Validación ejecutada:** Track validator passed before and after dashboard generation; staged diff check and Git convention hooks passed.
- **Siguiente acción concreta:** Implement affected-package validation routing with a full fallback for shared and ambiguous changes.

## Cierre

Pendiente de aprobación explícita.
