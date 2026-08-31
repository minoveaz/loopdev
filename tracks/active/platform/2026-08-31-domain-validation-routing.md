---
id: domain-validation-routing
title: Domain Validation Routing and Test Efficiency
status: active
created: 2026-08-31
updated: 2026-08-31
owner: platform
lead: null
branch: test/domain-validation-routing
branches: [test/domain-validation-routing]
phase: 2
pull_requests: []
issues: []
packages:
  [
    '@loopdev/contracts',
    '@loopdev/tokens',
    '@loopdev/ui',
    '@loopdev/ui-native',
    '@loopdev/public-shell',
    '@loopdev/public-blocks',
  ]
release: not-required
areas: [platform, governance, apps, mobile, crm, marketing-studio]
dependencies: []
blocked_by: []
supersedes: []
---

# Domain Validation Routing and Test Efficiency

## Outcome

Establish a traceable, domain-aware validation system in which every changed
surface selects the smallest test suite that protects its specific risk, while
shared contracts, integration branches, and releases continue to receive broad
certification. Documentation-only work must not trigger mobile, browser,
database, or unrelated application tests. Every executable product domain must
have a registered owner, runner, and validation route.

Success means developers receive fast, relevant local feedback; pull requests
validate their accumulated branch impact; and full certification remains a
deliberate integration gate rather than the default response to a small change.

## Contexto

The repository currently has 270 versioned test files across Vitest, Jest,
Playwright, Node test runner, pytest, and Supabase SQL. The existing validation
planner recognizes governance, data, mobile, shell, web, and shared packages,
but it does not model all executable surfaces. In particular, CIMO, worker,
tooling, public packages, and Communications database controls do not have
complete routing coverage. Quant remains experimental and is excluded from this
track until it is a publication candidate.

The current changed-validation path compares `origin/develop...HEAD`. That is
appropriate for branch and pull-request review but too broad for iterative work
on a long-lived branch: a documentation edit can inherit a global fallback from
an earlier configuration or package change. Playwright also executes many
certification tests across three projects and, in some cases, internal viewport
and theme matrices, producing 279 discovered executions from 26 discovered
specifications. This track calibrates execution frequency without removing
protection from required responsive, accessibility, security, or integration
risks.

The detailed control audit identifies three independent execution mechanisms:
the validation planner, Turbo package tasks, and GitHub Actions path filters.
They do not yet share a complete domain catalog. `pnpm lint` schedules 15 Turbo
package tasks and follows package dependencies; `validate:ci` always combines
lint, typecheck, root Vitest coverage, and build when a global fallback occurs.
The frontend quality gate also combines incremental formatting with repository
scans for duplicated classes, contract ownership, design audit, duplication,
and unused exports. The target is not to remove these gates, but to assign each
one to the narrowest scope that can protect its risk.

## Alcance

### Incluido

- Establish separate worktree, commit, branch, and full validation scopes.
- Extend the validation registry and planner with all executable domains.
- Register CIMO, worker, tooling, public packages, CRM Communications, mobile,
  shell, web, contracts, and Supabase subdomains where applicable.
- Repair configuration or workspace-resolution issues that prevent a declared
  domain runner from discovering its own tests.
- Split Supabase validation into platform, marketing, creative, CRM, and
  Communications controls, while preserving a full database certification path.
- Classify Playwright tests into smoke, domain, shell, visual, responsive, and
  full-certification profiles with explicit project and viewport intent.
- Identify and resolve versioned E2E specs that are not discovered by a project.
- Add executable routing tests for positive selection and negative exclusion.
- Audit and route lint, typecheck, build, formatting, static quality gates,
  package-consumer validation, CI jobs, and Git hooks alongside test runners.
- Separate incremental static checks from repository-wide audits such as Knip,
  duplication detection, contract ownership, and design-system audit.
- Remove duplicated CI execution where a selected package or domain job already
  provides the required evidence, while preserving full integration coverage.
- Capture baseline duration and coverage artifacts by runner without imposing
  arbitrary repository-wide thresholds.
- Update affected validation documentation, registry guidance, and command help.

### Excluido

- Removing tests solely to reduce test count.
- Reducing tenant isolation, RLS, accessibility, responsive, visual, or security
  certification requirements.
- Product behavior changes in CIMO, CRM, Marketing Studio, mobile, or
  worker beyond fixes required to execute their declared validation runner.
- Replacing Vitest, Jest, Playwright, pytest, or Supabase as testing tools.
- Setting global line-coverage thresholds before measured baselines are reviewed.
- Adding or routing Quant tests while Quant remains experimental and unpublished.

## Decisiones aprobadas

| Fecha      | Decision                                                                                                           | Motivo                                                                                                                                                | Impacto                                                                                                                                                  | Aprobado por |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-08-31 | Create one platform-owned track for domain validation routing.                                                     | The routing layer crosses applications, packages, data, and governance.                                                                               | Centralizes sequencing and acceptance evidence without changing product ownership.                                                                       | Usuario      |
| 2026-08-31 | Preserve broad certification for branch integration and releases while making local routing narrow and risk-based. | Quality must remain high without making ordinary development slower than implementation.                                                              | Tests are classified by execution moment rather than removed.                                                                                            | Usuario      |
| 2026-08-31 | Require negative routing assertions for documentation and unrelated domains.                                       | A selected test proves inclusion; it does not prove expensive unrelated suites are excluded.                                                          | The acceptance matrix tests both selection and non-selection.                                                                                            | Usuario      |
| 2026-08-31 | Exclude Quant from this track while it remains experimental and unpublished.                                       | Testing investment is prioritized for publication-ready domains.                                                                                      | Quant has no routing or coverage deliverables in this track.                                                                                             | Usuario      |
| 2026-08-31 | New domains may consume but must not directly modify the global shell or `@loopdev/public-shell`.                  | Shared navigation and public runtime are platform-owned contracts, not domain implementation surfaces.                                                | Any change requires a platform-owned delivery, declared consumers, and transversal certification.                                                        | Usuario      |
| 2026-08-31 | Enforce domain quality contracts and protected-surface ownership with repository validators.                       | Documentation alone cannot prevent an unregistered app or domain branch from bypassing platform validation rules.                                     | CI validates domain metadata and rejects protected shell/Public Shell changes without an active platform track for the branch.                           | Usuario      |
| 2026-08-31 | Temporarily allow domain branches to evolve `@loopdev/public-shell` while `public-shell-foundation` is active.     | CIMO and other consumers are contributing to the active Public Shell standardization, so strict branch ownership would block intended iterative work. | The exception is declarative, limited to Public Shell, and expires automatically when the platform track closes; global shell protection remains strict. | Usuario      |

## Arquitectura y contratos

The routing model has four scopes:

| Scope    | Change source                       | Purpose                                                         | Expected cost |
| -------- | ----------------------------------- | --------------------------------------------------------------- | ------------- |
| Worktree | uncommitted files or explicit paths | Fast feedback during implementation                             | low           |
| Commit   | latest commit or explicit revision  | Validate a coherent local delivery unit                         | low-medium    |
| Branch   | `origin/develop...HEAD`             | Validate all accumulated pull-request impact                    | medium-high   |
| Full     | repository-wide certification       | Protected-branch integration, release, or shared infrastructure | high          |

Each registered control must declare one primary risk owner, domain paths,
runner command, cost, supported scopes, and consumer impact. This applies to
lint, typecheck, build, unit tests, browser tests, database tests, and static
quality gates, not only to test runners. A shared package
must first run its own checks, then validate direct consumers appropriate to the
changed contract. It must not trigger unrelated mobile or browser suites by
default.

CI must consume the same routing decision as local validation. A control can be
run once per delivery scope unless it protects a separately declared risk. The
full quality job is reserved for root configuration, workflow, dependency graph,
or explicitly approved integration conditions; it is not a fallback for an
otherwise registered application domain.

Domain implementation may consume shared shell and public-shell packages. The
global shell remains platform-owned and cannot be modified directly by a domain
branch. Public Shell is temporarily evolvable by domain branches while the
declared `public-shell-foundation` platform track is active; this exception
expires automatically when that track closes. Every such change still requires
explicit consumer impact and applicable public experience certification.

Browser profiles must distinguish functional smoke from visual and responsive
certification. Desktop is the default for interaction tests unless a behavior
depends on responsive geometry, touch input, or a declared mobile contract. The
desktop, mobile, and mobile-compact matrix is reserved for responsive and
visual scopes, plus full certification.

Database controls must be independently addressable by schema domain and
collectively addressable by full certification. The complete suite remains the
authority for repository integration.

## Branch strategy

Implementation is performed on `test/domain-validation-routing`, based on
`origin/develop` at `66c64a27`. The branch is dedicated to validation routing,
test configuration, routing tests, and directly affected documentation. Product
feature work remains on its own domain branches. No implementation is committed
to `develop` or `main`.

## Fases

### Fase 0: Baseline and routing contract

**Objetivo:** Confirm the executable inventory, current routing gaps, command
semantics, and measurable acceptance matrix before changing behavior.

**Definition of Ready**

- [x] Current branch is based on current `origin/develop`.
- [x] Versioned test inventory is grouped by domain and runner.
- [x] Current registry, planner, Vitest, Playwright, mobile, worker, and SQL
      configurations have been inspected.
- [x] Initial gaps and redundant execution patterns are documented.

**Entregables**

- [x] Baseline inventory: 270 versioned test files and 279 discovered Playwright
      executions from 26 discovered specifications.
- [x] Initial routing gap register for CIMO, worker, tooling, public
      packages, E2E discovery, and Communications SQL controls.
- [x] Acceptance matrix in this track.

**Validacion**

- [x] `pnpm validate:plan` records the current branch-level routing behavior.
- [x] Runner discovery attempted for CIMO, worker, mobile, Vitest, and Playwright.
- [x] Git confirms the dedicated implementation branch starts from `origin/develop`.

**Evidencia:** 2026-08-31 inventory recorded 116 DS, 54 LoopDev OS, 28 E2E,
23 contracts, 14 SQL, 14 tooling, 9 mobile, 7 CIMO, 4 experimental Quant, and
1 worker test files. CIMO discovery is currently blocked by unresolved
`@vitejs/plugin-react`.

**Estado:** completada

### Fase 1: Validation scope semantics

**Objetivo:** Implement deterministic worktree, commit, branch, and full scope
semantics so local feedback does not inherit unrelated accumulated branch impact.

**Definition of Ready**

- [x] Existing planner unit tests identify supported behavior and public commands.
- [x] The source of changed files can be supplied deterministically in tests.
- [x] Documentation-only and shared-infrastructure policies are agreed in code.

**Entregables**

- [x] Explicit `validate:worktree` and `validate:branch` commands, with
      `validate:changed` retained as a branch-validation compatibility alias.
- [x] `validate:commit` uses `HEAD` by default or an explicit revision.
- [x] Operator guidance for worktree, commit, branch, full, and compatibility
      alias semantics.
- [x] `validate:changed` is retained as a stable compatibility alias for
      `validate:branch`.
- [x] Deterministic routing tests cover documentation-only, staged, unstaged,
      untracked, commit, accumulated branch, and full fallback scenarios.

**Validacion**

- [x] Documentation-only worktree selects no functional, mobile, browser, or SQL runner.
- [x] A branch with prior shared configuration changes can still run narrow
      worktree validation for a new documentation-only edit.
- [x] Branch scope selects all relevant accumulated domains and preserves full
      fallback for shared configuration.

**Evidencia:** `node --test scripts/validate-plan.test.mjs scripts/validate-local.test.mjs`
passes 20 tests. The new regression verifies that a documentation-only worktree
has no preflight or functional commands while the branch scope retains branch
base validation. `pnpm validate:worktree -- --dry-run` correctly escalates the
current implementation worktree because it modifies shared scripts and root
package configuration; `pnpm validate:branch -- --dry-run` selects only branch
base on the new branch with no committed implementation changes. The domain
catalog and protected-surface guards were introduced early to protect the next
phase, but do not replace the pending commit scope and deterministic fixture work.

**Estado:** completada

### Fase 2: Canonical domain catalog and application runners

**Objetivo:** Make the planner, package-impact resolver, and CI path filters use
one canonical catalog of executable domains, paths, runners, and owners.

**Definition of Ready**

- [ ] The runner command and test discovery result are known for each domain.
- [ ] Each domain has one primary owner and no ambiguous overlapping path rule.
- [ ] CIMO configuration-resolution failure has a minimal reproducible check.
- [ ] Every declared package task exists or is intentionally excluded.

**Entregables**

- [x] Canonical domain catalog for CIMO, LoopDev OS, mobile, contracts, UI,
      UI-native, public-shell, and public-blocks, including lint, typecheck, unit,
      and build applicability.
- [x] Runnable CIMO lint, typecheck, and Vitest discovery commands, with
      contracts resolved from source during Vitest.
- [ ] Focused runner commands for worker, tooling, public-shell, public-blocks,
      mobile, contracts, and LoopDev OS.
- [x] CIMO `lint` script, eliminating its missing Turbo task.
- [x] Protected-surface ownership validator for global shell and Public Shell.
- [x] Planner and package-impact resolver consume the CIMO catalog entry.
- [ ] Migrate the remaining planner paths, package-impact rules, and CI path
      filters to the catalog instead of maintaining independent domain maps.

**Validacion**

- [x] A CIMO change selects its domain and no unrelated mobile or web app domain.
- [x] Every catalog entry references an existing manifest and declared package
      scripts; every application manifest has one catalog entry.
- [x] Global shell changes require an active `platform` track for the branch;
      Public Shell is temporarily permitted for domain branches while its
      `public-shell-foundation` standardization track is active.
- [x] CIMO source change selects CIMO checks and does not force global quality.
- [ ] A documentation-only change has no application runner selected.

**Evidencia:** `pnpm test:domain-catalog` passes 4 catalog-contract tests and
`pnpm validate:domain-catalog` validates 8 domains and 2 protected surfaces.
`pnpm test:protected-surfaces` passes 3 ownership tests, including rejection of
a CIMO branch changing Public Shell. The guard now additionally permits a
domain branch while the declared `public-shell-foundation` track remains active,
then rejects it after that track closes. Both validators run in the mandatory CI
`changes` job before downstream job selection.

CIMO is the first catalog-driven domain: a change under `apps/cimo/**` selects
the `cimo` registry control and produces `domainIds: ["cimo"]` in package
impact without `globalFallback`, mobile, or LoopDev OS frontend selection.
`pnpm --filter cimo test` passes 7 files and 27 tests after the workspace
dependencies are linked; lint, typecheck, and production build also pass.
Vitest resolves `@loopdev/contracts` from source, so tests do not depend on a
stale contracts `dist` artifact. CIMO lint reports 1,247 existing warnings and
no errors; Vite reports a >500 kB uncompressed chunk advisory while the initial
JavaScript output is 145.97 kB gzip.

LoopDev OS and mobile now declare their routing in the same catalog. The
catalog's `excludePaths` keeps LoopDev OS API, services, and types out of web
experience routing, while its `frontend` and `mobile` flags replace the
application-specific classification in package impact. The catalog validator
rejects malformed routing flags or exclusion lists. Public Shell and Public
Blocks retain their existing consumer rules until their complete migration in
Phase 4.

**Estado:** en curso; CIMO proves the catalog-driven pattern, while remaining
domains and CI path filters still require migration.

### Fase 3: Static checks, lint, typecheck, and build calibration

**Objetivo:** Route static and compilation controls by risk and domain while
retaining repository-wide analysis for integration and release confidence.

**Definition of Ready**

- [ ] Each lint, typecheck, build, and frontend quality command has a documented
      filesystem scope and package dependency behavior.
- [ ] Global scans are distinguished from changed-file checks.
- [ ] Package scripts are normalized sufficiently for domain invocation.

**Entregables**

- [ ] Focused lint, typecheck, and build commands for each registered domain.
- [x] Explicit static quality commands for worktree, commit, and branch scopes:
      `quality:static:worktree`, `quality:static:commit`, and
      `quality:static:branch`.
- [ ] Scope policy for Turbo lint/typecheck/build and package dependency traversal.
- [ ] Split `front:check` policy: changed-file formatting, domain checks, and
      repository audits (`front:audit`, duplication, contract ownership, Knip).
- [ ] CI schedule for static scans that are too broad for every local iteration.

**Validacion**

- [ ] CIMO lint/typecheck do not invoke unrelated mobile or LoopDev OS checks.
- [ ] A LoopDev OS change does not invoke CIMO lint/typecheck/build.
- [x] Local static runner keeps worktree and commit scopes to changed-file
      Prettier and ESLint checks.
- [x] Branch static runner retains repository-wide classes, ownership,
      source-contract, audit, duplication, and Knip scans.
- [ ] `format:check` remains changed-file based.
- [ ] Repository-wide static scans remain available for branch/full certification.

**Evidencia:** `node --test scripts/validate-static-controls.test.mjs` passes 3
tests covering changed-file classification, local scan exclusion, and branch
scan inclusion. The runner is intentionally not auto-added beside domain lint:
that would duplicate ESLint for CIMO and other domains. Its integration into
the final plan will follow the control-deduplication policy.

**Estado:** pendiente

### Fase 4: Shared-package consumer impact

**Objetivo:** Validate shared packages and their direct consumers without
unnecessary fallback to every application or duplicate global certification.

**Definition of Ready**

- [ ] Consumer lists for contracts, UI, UI-native, tokens, design contracts,
      public-shell, and public-blocks are verified.
- [ ] The primary risk protected by each consumer command is declared.
- [ ] Shared package changes can be distinguished from root configuration changes.

**Entregables**

- [ ] Direct-consumer rules and tests for all shared packages in scope.
- [ ] Explicit full-fallback policy limited to root configuration, workflow,
      dependency graph, and approved cross-domain integration changes.
- [ ] Command deduplication for package validation versus global quality jobs.

**Validacion**

- [ ] Contract change selects declared consumers with no undeclared domain test.
- [ ] UI-only change does not select mobile Jest unless `ui-native` or a declared
      mobile contract is affected.
- [ ] Public package change runs its own tests rather than only a generic global job.
- [ ] Root manifest or workflow change still selects full certification.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 5: Database validation by schema domain

**Objetivo:** Restore complete SQL coverage through focused database controls and
retain ordered full-data certification for cross-schema integration.

**Definition of Ready**

- [ ] All SQL tests are mapped to platform, marketing, creative, CRM, or
      Communications ownership.
- [ ] Migration ordering and shared fixtures are documented.
- [ ] Supabase workflow and validation registry use the same command catalog.

**Entregables**

- [ ] Focused Supabase commands for each schema domain.
- [ ] Complete Communications SQL route including controls `007` through `010`.
- [ ] Ordered full-data command containing all intended database tests.
- [ ] Removal of unnecessary overlap between backend and dedicated Supabase jobs.

**Validacion**

- [ ] CRM, Creative, Marketing, and Communications changes select only their
      focused controls unless a shared migration requires full data certification.
- [ ] Full-data certification runs every versioned database control in order.
- [ ] Data workflow retains tenant-security and migration-governance protection.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 6: Browser and experience profiles

**Objetivo:** Make Playwright profiles represent a declared user-facing risk,
so interaction checks do not pay responsive and visual matrices unnecessarily.

**Definition of Ready**

- [ ] Each Playwright spec has an owner, primary risk, route, and viewport policy.
- [ ] Versioned specs not discovered by a project have a documented disposition.
- [ ] Shell, accessibility, functional, visual, and responsive contracts are distinct.

**Entregables**

- [ ] Smoke, domain, shell, visual-desktop, responsive-matrix, and full browser profiles.
- [ ] CI job selection based on the same domain catalog and experience metadata.
- [ ] Resolution for every versioned but undiscovered Playwright specification.
- [ ] Removal of duplicate viewport/theme execution where it does not protect a
      distinct responsive or visual contract.

**Validacion**

- [ ] Interaction-only change defaults to desktop smoke/domain coverage.
- [ ] CSS, layout, breakpoint, touch, or visual-contract change selects the
      appropriate responsive/visual matrix.
- [ ] Shell changes select shell behavior and accessibility evidence.
- [ ] Full browser certification discovers all intended E2E specifications.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 7: CI orchestration, observations, and certification

**Objetivo:** Adopt the calibrated commands in CI and establish evidence for
duration, coverage, false runs, false skips, and residual risks.

**Definition of Ready**

- [ ] Focused commands are stable locally and have routing tests.
- [ ] CI conditions, package jobs, and full certification responsibilities are mapped.
- [ ] Artifact and observation formats are available for supported runners.

**Entregables**

- [ ] CI workflow that runs each selected control once per delivery scope.
- [ ] Per-domain duration observations for focused, branch, and full runs.
- [ ] Coverage baseline artifacts for Vitest and Jest where supported; no Quant coverage.
- [ ] Operator documentation for local, branch, PR, and integration validation.
- [ ] Final routing acceptance evidence and residual-risk report.

**Validacion**

- [ ] Every selected and skipped control reports domain, risk, reason, and scope.
- [ ] Observations distinguish false runs, false skips, duplicate risk, duration,
      and flaky outcome.
- [ ] No coverage threshold is enforced without approved measured baseline.
- [ ] Full certification passes or an external limitation has owner and follow-up.
- [ ] Track integrity, documentation links, and Git conventions pass.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Acceptance matrix

| Change fixture                        | Required selected controls                           | Required exclusions                                             | Evidence                        |
| ------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `docs/**` only                        | documentation links where applicable                 | lint, typecheck, build, mobile, browser, SQL, CIMO, worker      | planner test and dry run        |
| `tracks/**` only                      | track integrity and governance                       | functional, browser, SQL                                        | planner test and dry run        |
| `apps/cimo/**`                        | CIMO lint, typecheck, and Vitest                     | global quality, mobile Jest, LoopDev OS E2E, SQL                | runner list and focused command |
| `apps/loopdev-mobile/**`              | mobile lint, typecheck, and Jest                     | CIMO, web E2E, SQL                                              | runner list and focused command |
| `apps/loopdev-worker/**`              | worker lint/typecheck and Vitest when declared       | CIMO, mobile Jest, browser E2E                                  | runner list and focused command |
| `scripts/**` test tooling             | affected Node test runner                            | app functional suites unless declared consumer                  | routing test                    |
| `packages/contracts/**`               | contracts lint/typecheck/build plus direct consumers | unrelated browser matrix unless contract affects a browser flow | consumer routing test           |
| `ds/packages/ui/**` behavior          | UI lint/typecheck/tests and direct web consumers     | mobile Jest unless native package affected                      | consumer routing test           |
| `ds/packages/ui/**` visual geometry   | UI checks plus visual/responsive profile             | unrelated SQL and worker                                        | Playwright profile test         |
| `ds/packages/public-shell/**`         | public-shell lint/typecheck/tests and consumers      | mobile Jest and unrelated CRM E2E                               | consumer routing test           |
| new domain feature                    | domain-owned checks only                             | direct global shell or public-shell source modification         | ownership validation and review |
| `front:check` audit source            | applicable domain static check                       | full Knip/duplication scan in worktree                          | command selection test          |
| shell paths                           | shell contract and shell experience profile          | unrelated CIMO/mobile/data                                      | planner test                    |
| CRM Communications SQL                | Communications SQL controls `007-010`                | creative focused SQL                                            | Supabase command selection      |
| shared root configuration             | full certification                                   | none; escalation is intentional                                 | planner test                    |
| branch with accumulated global change | branch/full policy controls                          | no false claim of narrow branch scope                           | planner test                    |
| CI selected package job               | one package/consumer execution per declared risk     | duplicate global quality job unless integration required        | workflow routing test           |

## Registro de cambios de enfoque

| Fecha      | Cambio                                                                        | Motivo                                                                                                                                  | Impacto en alcance/fases                                                                                           | Aprobado por |
| ---------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ |
| 2026-08-31 | Initial track created from test inventory and routing audit.                  | Establish an auditable implementation plan before changing validation behavior.                                                         | Defines five implementation phases and explicit acceptance matrix.                                                 | Usuario      |
| 2026-08-31 | Expand the track from test-runner routing to all executable quality controls. | Lint, typecheck, build, static checks, package impact, and CI orchestration cause the same false-run and duplicate-work risks as tests. | Replaces the plan with eight aligned phases and acceptance criteria for selection, exclusion, and non-duplication. | Usuario      |
| 2026-08-31 | Retain `validate:changed` as a stable alias for branch validation.            | Existing automation and operator habits need a predictable migration path.                                                              | New local work uses `validate:worktree`; PR review uses `validate:branch` or the compatibility alias.              | Usuario      |

## Riesgos y bloqueos

| Riesgo o bloqueo                                                               | Impacto                                                                                  | Mitigacion                                                                                                             | Responsable            | Estado   |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- |
| CIMO cannot resolve `@vitejs/plugin-react` for Vitest discovery.               | CIMO tests cannot provide reliable focused feedback.                                     | Reproduce with the package command; correct workspace dependency resolution minimally; rerun discovery.                | platform/apps          | abierto  |
| Quant is experimental and unpublished.                                         | Premature test investment would compete with publication-ready domains.                  | Exclude Quant from this track; reconsider only when publication is approved.                                           | quant/platform         | aceptado |
| A domain feature changes global shell or public-shell source.                  | Domain work can alter shared navigation or public runtime without transversal review.    | Enforce ownership validation; require a separate platform-owned change with consumer and experience evidence.          | platform               | abierto  |
| Domain catalog and planner diverge during migration.                           | A domain can be structurally registered but still receive an incorrect validation route. | Make the planner, package resolver, and CI path filters consume the catalog in Phase 2; retain explicit routing tests. | platform               | abierto  |
| Narrow routing may omit a real cross-domain consumer.                          | Regression could reach integration.                                                      | Declare consumers in package rules; retain branch/full certification; test positive and negative routing fixtures.     | platform               | abierto  |
| Excessive global fallback keeps local feedback slow.                           | Developers continue to avoid relevant validation.                                        | Separate worktree from branch scope and report fallback reason explicitly.                                             | platform               | abierto  |
| Over-aggressive E2E reduction may weaken responsive or accessibility coverage. | User-facing regressions can escape.                                                      | Retain matrix for visual/responsive contracts and full certification.                                                  | platform/design-system | abierto  |
| SQL focused suites may hide migration ordering dependencies.                   | Schema integration failures can appear late.                                             | Preserve ordered full-data certification for branch integration and release.                                           | platform/data          | abierto  |
| Coverage metrics may be gamed or misinterpreted.                               | Time may shift to low-value tests.                                                       | Baseline first; use behavior, risk, duration, false-run, and false-skip evidence.                                      | platform/governance    | abierto  |

## Criterios de cierre

- [ ] Every executable domain has a documented owner, paths, runner, risk, and scope route.
- [ ] Domain-owned changes cannot directly modify global shell or `@loopdev/public-shell` source without platform-owned validation.
- [ ] Worktree, commit, branch, and full validation have tested and documented semantics.
- [ ] Documentation-only and track-only changes demonstrably exclude unrelated functional suites.
- [ ] CIMO, worker, tooling, public packages, mobile, contracts, shell, web, and data controls can be selected or explicitly justified as deferred.
- [ ] SQL controls cover platform, marketing, creative, CRM, and Communications in focused and full modes.
- [ ] Every versioned Playwright spec is discovered by an intended profile or explicitly retired with approval.
- [ ] Browser smoke, domain, visual, responsive, and full profiles have explicit purpose and viewport policy.
- [ ] Routing unit tests cover every acceptance-matrix row.
- [ ] Baseline duration and available coverage evidence are recorded without unapproved global thresholds.
- [ ] Documentation, registry, and operator commands are updated and validated.
- [ ] Outcome is verified, residual risks are documented, and closure is approved explicitly by the user.

## Evidencia de validacion

| Fecha      | Validacion                                  | Resultado                                                                                                                                                                                       | Referencia                                                                                                 |
| ---------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-08-31 | `pnpm validate:plan`                        | Passed; branch-level plan selected web, shell, data, governance, and packages for 77 accumulated files.                                                                                         | Baseline routing inventory                                                                                 |
| 2026-08-31 | `pnpm exec playwright test --list`          | Passed; 279 tests discovered in 26 files, with 28 versioned E2E specifications.                                                                                                                 | Baseline browser inventory                                                                                 |
| 2026-08-31 | CIMO Vitest discovery                       | Blocked; configuration cannot resolve `@vitejs/plugin-react`.                                                                                                                                   | Baseline runner inventory                                                                                  |
| 2026-08-31 | Worker and mobile runner discovery          | Passed; worker exposes 4 tests and mobile exposes 9 test files.                                                                                                                                 | Baseline runner inventory                                                                                  |
| 2026-08-31 | Domain catalog and protected-surface guards | Passed; 7 Node tests and both repository validators pass.                                                                                                                                       | `test:domain-catalog`, `validate:domain-catalog`, `test:protected-surfaces`, `validate:protected-surfaces` |
| 2026-08-31 | Scope semantics                             | Passed; 24 routing tests cover worktree, commit, branch, staged, unstaged, untracked, documentation-only, and fallback routing.                                                                 | `validate-plan.test.mjs`, `validate-local.test.mjs`                                                        |
| 2026-08-31 | Catalog-driven application CI routing       | Passed; 34 planner/package-impact/catalog tests, catalog validation, and Prettier validation pass. Mobile and LoopDev OS use catalog-derived flags without duplicate domain-controls execution. | `validate-package-impact.test.mjs`, `validate-plan.test.mjs`, `ci.yml`                                     |
| 2026-08-31 | Advisory Public Shell/Public Blocks routing | Passed; 21 catalog/package-impact tests and catalog validation confirm focused controls and direct consumers without global fallback.                                                           | `validate-package-impact.test.mjs`, `validate-domain-catalog.test.mjs`                                     |

## Handoff de sesion

- **Fecha:** 2026-08-31.
- **Rama de continuacion:** `test/domain-validation-routing`.
- **Commit de partida:** `66c64a27`.
- **Estado alcanzado:** Fase 2 in progress, with Fase 3 static-scope work started. CIMO, mobile, and LoopDev OS application routing consume catalog metadata; Public Shell/Public Blocks routing is advisory and static-control deduplication remains pending.
- **Decisiones, bloqueos y riesgos:** Quant is excluded while experimental. `validate:changed` is a stable branch alias. New domains must declare four quality controls or an explicit non-applicability. The global shell requires an active platform track for its branch. Public Shell permits domain contributions only while `public-shell-foundation` is active. CIMO resolves contracts from source in Vitest; its pre-existing lint warnings and chunk advisory are tracked separately.
- **Validacion ejecutada:** Baseline inventory, 34 planner/package-impact/catalog tests, 3 domain-control tests, 5 catalog tests, 4 protected-surface ownership tests, CIMO 7-file/27-test Vitest suite, CIMO lint/typecheck/build, repository validators, and dry-run checks.
- **Siguiente accion concreta:** Complete static-control deduplication and migrate remaining CI filters without restricting active Public Shell development.

## Cierre

Pendiente de aprobacion explicita.
