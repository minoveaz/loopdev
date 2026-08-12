---
id: ci-validation-scope
title: CI validation scope and required checks
status: planned
created: 2026-08-12
updated: 2026-08-13
owner: governance
lead: null
branch: chore/ci-validation-scope-track
branches: []
phase: 3
pull_requests: []
issues: []
packages: []
release: not-required
areas: [governance, platform]
dependencies: [track-governance]
blocked_by: []
supersedes: []
---

# CI validation scope and required checks

## Outcome

LoopDev pull requests run validations proportional to their affected surface while preserving
required protection for shared contracts, dependency changes, and release-critical code.

## Contexto

The current CI `quality` job runs the full `pnpm validate:ci` command for every pull request.
This protects the repository broadly but makes governance, documentation, and track-only changes
wait for unrelated lint, typecheck, test, and build work. The repository already detects frontend
and shell surfaces; its validation matrix needs a deliberate, evidence-based scope policy.

## Alcance

### Incluido

- Inventory current CI jobs, their commands, costs, and triggering paths.
- Define a validation matrix for governance/tracks, documentation, application surfaces, shared
  contracts, dependencies, root configuration, and release-critical changes.
- Decide which checks are required in pull requests, which run conditionally, and which remain
  mandatory on `develop` or `main`.
- Implement narrow path filters and affected-package validation only after the matrix and fallback
  rules are approved.
- Measure the first representative PRs for correctness, skipped-check visibility, and duration.

### Excluido

- Weakening branch protection without an approved replacement check.
- Removing full-repository validation from protected branch integration without evidence.
- Changing product code solely to make CI routing easier.

## Decisiones aprobadas

| Fecha      | Decisión                                            | Motivo                                                                                    | Impacto                                                          | Aprobado por |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------ |
| 2026-08-12 | Plan CI scope review as a separate governance track | Track-only PRs revealed that the universal quality job is broader than their risk surface | CI routing will be evaluated independently from track automation | User         |
| 2026-08-13 | Treat frozen dependency installation as a blocking preflight | PR #53 exposed a broken lockfile that was repeated independently by multiple domain jobs | A single dependency preflight must pass before package, mobile, shell, quality, or web validation is interpreted | User |

## Arquitectura y contratos

```text
pull request
  -> changed-path classification
  -> required baseline checks
  -> dependency lockfile preflight
  -> surface-specific checks
  -> full validation fallback for shared or root changes

dependency preflight failure
  -> stop downstream domain validation
  -> report one causal blocker instead of repeated install failures

develop/main
  -> full repository validation before or after integration
```

## Branch strategy

This track does not have an implementation branch yet. The branch is selected after the validation
matrix is approved because CI changes affect protected integration behavior.

## Fases

### Fase 0: Baseline and validation matrix

**Objetivo:** make the current CI cost, protection level, and routing gaps explicit before changing
workflow conditions.

**Definition of Ready**

- [ ] Current required checks and branch-protection expectations are known.
- [ ] Representative pull request classes are agreed: tracks, documentation, application, shell,
      contracts, dependencies, root configuration, and release-critical changes.

**Entregables**

- [ ] Inventory of current CI jobs, commands, duration, and affected paths.
- [ ] Approved validation matrix with a safe full-validation fallback.
- [ ] Criteria for required versus conditional checks and skipped-check reporting.

**Validación**

- [ ] Review the matrix against at least one representative PR per class.
- [ ] Confirm branch protection can distinguish successful conditional checks from missing checks.

**Evidencia:** PR #47 confirms that track-focused work currently triggers the full `quality` job in
addition to targeted track validation.

**Estado:** pendiente

### Fase 1: Conditional CI implementation

**Objetivo:** implement the approved matrix without creating blind spots in protected branches.

**Definition of Ready**

- [ ] Fase 0 matrix approved.
- [ ] Required-check behavior on skipped paths is verified.

**Entregables**

- [ ] Path filters and job conditions matching the approved matrix.
- [ ] Focused validation commands or affected-package routing where justified.
- [ ] Full validation fallback for shared contracts, dependency, root, and CI changes.

**Validación**

- [ ] Governance-only, shell, application, contract, and dependency PR fixtures trigger the
      expected checks.
- [ ] `develop` and `main` retain full validation coverage.

**Evidencia:** PR #53 (`feat(shell): compose contextual suite canvas`) terminó fusionado, pero su
historial de 23 commits mostró una secuencia de diagnósticos mezclados: una modificación del
agente dejó `pnpm-lock.yaml` incoherente, `pnpm install --frozen-lockfile` falló con
`ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` para `react-is@19.2.8`, y otros jobs repitieron el mismo
preflight de forma independiente. La ejecución final pasó después de reparaciones, pero el scope
`shell-showcase` llegó a omitir Mobile y la certificación global aunque el diff incluía workflow,
lockfile, Mobile, Web, paquetes compartidos y snapshots. El caso se convirtió en una regresión de
`scripts/validate-plan.test.mjs` que exige fallback completo para ese patrón y en un job único
`Dependency lockfile preflight` que bloquea la interpretación de los jobs de dominio si la
instalación congelada falla. La evidencia no justifica reducir controles.

**Estado:** pendiente

### Fase 2: Observe and calibrate

**Objetivo:** verify that routing reduces unnecessary work without hiding regressions.

**Definition of Ready**

- [ ] Fase 1 is deployed to `develop`.

**Entregables**

- [ ] Duration and failure observations from representative PRs.
- [ ] Adjusted filters or fallback rules when evidence identifies a gap.

**Validación**

- [ ] Review false skips and unnecessary full runs after representative use.
- [ ] Confirm the required-check policy remains understandable to contributors.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Track integrity alert

**Objetivo:** make changes to tests, test support, track governance, and CI workflows visible to
reviewers without turning the signal into an additional blocking validation rule.

**Definition of Ready**

- [ ] Fase 1 is deployed to `develop`.
- [ ] The alert categories and non-blocking behavior are agreed.

**Entregables**

- [ ] A centralized GitHub Actions job reports validation-related file changes.
- [ ] The job lists the exact changed files in the workflow summary and emits a warning annotation.
- [ ] The job remains successful when it finds changes.
- [ ] Unit tests cover test files, test support, track integrity, and workflow changes.

**Validación**

- [ ] A PR changing a test receives an informational warning with the changed path.
- [ ] A PR changing only product code receives a successful job with no warning.
- [ ] The alert cannot alter the selected validation plan or bypass required checks.

#### Matriz mínima de validación

| Caso | Cambio de prueba | Resultado esperado del alert | Resultado esperado del routing | Evidencia mínima |
| ---- | ---------------- | ---------------------------- | ------------------------------ | ----------------- |
| A | Solo código de producto | Job verde, sin warning | Plan de validación normal | URL del job y resumen sin alerta |
| B | Test unitario o de integración | Job verde, warning y ruta exacta | El plan existente no cambia | URL del job y archivo listado |
| C | Test E2E o snapshot | Job verde, warning y ruta exacta | Se mantienen los checks E2E/visuales aplicables | URL del job y archivo listado |
| D | Track o validador de tracks | Job verde, warning y ruta exacta | La validación de tracks continúa ejecutándose | URL del job y resultado del validador |
| E | Workflow o configuración de testing | Job verde, warning y ruta exacta | Se conserva el fallback completo correspondiente | URL del job y resumen de routing |
| F | Cambio mixto de producto y tests | Job verde, warning con todos los archivos vigilados | No se omiten superficies seleccionadas por el plan | URL del job y lista completa |

#### Registro de evidencias

| Fecha | Caso | PR | Resultado observado | URL del job/resumen | Estado |
| ----- | ---- | -- | ------------------- | ------------------ | ------ |
| 2026-08-13 | Implementación inicial del alert | #60 | Job inicialmente falló por forwarding de argumentos; corregido en `4a0b3a1` | PR #60 | pendiente de repetir como caso B/D |

La matriz es deliberadamente pequeña: valida la señal informativa y confirma que no altera el
routing, pero no intenta demostrar por sí sola que cada test de producto detecta todos los defectos.
La revisión puede continuar cuando haya PRs reales que cubran los casos A-F.

**Estado:** en revisión/validación

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| ----- | ------ | ------ | ------------------------ | ------------ |

## Riesgos y bloqueos

| Riesgo o bloqueo                                                           | Impacto                                                 | Mitigación                                                               | Responsable | Estado |
| -------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ | ----------- | ------ |
| Conditional routing skips a required validation                            | Regression reaches a protected branch                   | Use a conservative shared/root fallback and test PR fixtures             | governance  | open   |
| Required check is absent rather than reported as skipped                   | PRs cannot merge or protection is weakened accidentally | Verify GitHub branch-protection behavior before changing required checks | governance  | open   |
| Affected-package routing is slower or less reliable than global validation | More CI complexity without a practical benefit          | Measure representative PRs and keep the simpler fallback when needed     | governance  | open   |
| Broken lockfile is repeated as unrelated domain failures                   | Contributors enter speculative fix loops and misread secondary errors | Run one `pnpm install --frozen-lockfile` preflight and block downstream validation | governance | open |
| Explicit or branch-specific scope hides cross-domain changes               | Mobile, Web, or global protections are falsely skipped | Derive the effective plan from the complete diff; never let a reduced scope clear full fallback | governance | open |

## Criterios de cierre

- [ ] Validation matrix is approved and documented.
- [ ] Conditional and full-fallback checks are implemented and tested with representative PRs.
- [ ] Protected branches retain full validation coverage.
- [ ] Runtime and skipped-check behavior are reviewed after adoption.
- [ ] Risks residuales are documented.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha      | Validación           | Resultado | Referencia                                              |
| ---------- | -------------------- | --------- | ------------------------------------------------------- |
| 2026-08-12 | CI checks for PR #47 | Correcta  | Bootstrap de validación de tracks; motivación del track |
| 2026-08-12 | Track PR status en PR #48 | Correcta | Runs `31585964720` y `31586131453` correctos: labels sincronizadas, comentario único idempotente y transición reversible de `blocked` verificada |
| 2026-08-13 | PR #53 final CI and routing review | Correcta como evidencia de calibración; no apta para reducir controles | PR #53 fusionado; 10 checks correctos, 2 omitidos, 23 commits; lockfile repaired before final green run; cross-domain regression added and dependency preflight implemented in the framework worktree |

## Handoff de sesión

- **Fecha:** 2026-08-12.
- **Rama de continuación:** chore/ci-validation-scope-track.
- **Commit de partida:** Pendiente.
- **Estado alcanzado:** Track planificado desde la evidencia de PR #47.
- **Decisiones, bloqueos y riesgos:** No condicionar checks antes de definir la matriz y verificar branch protection.
- **Validación ejecutada:** Pendiente.
- **Siguiente acción concreta:** Inventariar jobs, rutas, duración y required checks actuales.

## Cierre

Pendiente de aprobación explícita.
