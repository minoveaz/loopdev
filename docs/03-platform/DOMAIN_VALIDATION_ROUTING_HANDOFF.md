# Domain Validation Routing Handoff

Fecha: 2026-09-02

Rama de trabajo: `loopdev-io-test/domain-test-contract-names`

Rama canónica del track: `test/domain-validation-routing`

Base del track: `origin/develop` (`66c64a27`)
HEAD de esta sesión: `b2e62392`
Estado: Fases 0, 1, 2, 3, 4 y 6 completadas; Fase 5 y Fase 7 no cumplen
completamente sus criterios.

## Objetivo

Mantener routing de validación por dominio y riesgo, con scopes explícitos de
worktree, commit, branch y full, sin reducir las garantías de integración,
seguridad, accesibilidad, responsive, visuales o tenancy.

## Evidencia de PRs mergeados

| PR   | Estado | Merge commit | Fecha de merge       | Checks GitHub             |
| ---- | ------ | ------------ | -------------------- | ------------------------- |
| #162 | MERGED | `5f5360ca`   | 2026-09-02 07:24:46Z | 14 `SUCCESS`, 5 `SKIPPED` |
| #163 | MERGED | `ba4cacec`   | 2026-09-02 11:07:33Z | 10 `SUCCESS`, 6 `SKIPPED` |
| #164 | MERGED | `6db792dd`   | 2026-09-02 13:00:04Z | 15 `SUCCESS`, 3 `SKIPPED` |
| #165 | MERGED | `f781b63b`   | 2026-09-02 14:41:38Z | 16 `SUCCESS`, 2 `SKIPPED` |

Los checks `SKIPPED` se conservan como resultado del rollup de GitHub; no se
reclasifican como false skip sin una observación representativa.

## Estado y decisiones

- Fase 5: la certificación local disponible pasa: reset, lint de schema,
  gobernanza Supabase, catálogo y 196 tests pgTAP en 8 archivos. El catálogo
  mantiene `communications: []`; no se inventan controles SQL `007`–`010` sin
  archivos de test SQL versionados.
- Fase 7: la orquestación y la certificación local pasan, pero no hay dataset
  representativo de CI remoto para duración, false runs, false skips,
  duplicación o flakiness.
- Quant permanece fuera de alcance por seguir experimental/no publicable.
- El cierre no se ejecuta: requiere criterios completos y aprobación explícita
  del usuario.

## Validaciones ejecutadas

### Gobernanza, catálogos y tooling

- `pnpm validate:plan` — pasa sin cambios de worktree.
- `pnpm validate:track-integrity origin/develop HEAD` — alerta informativa,
  sin archivos de track/test/workflow en el rango evaluado.
- `pnpm test:track-integrity` — 4/4.
- `pnpm test:domain-catalog` y `pnpm validate:domain-catalog` — 6/6; 14
  dominios y 2 superficies protegidas.
- `pnpm test:e2e-catalog` y `pnpm validate:e2e-catalog` — 5/5; 28 specs y 3
  proyectos.
- `pnpm test:data-catalog` y `pnpm validate:data-catalog` — 8/8; 9 entradas
  SQL contando el fallback manual y 5 dominios.
- `pnpm test:ci-orchestration` y `pnpm validate:ci-orchestration` — 4/4 y
  15 controles.
- `pnpm test:package-impact` — 16/16.
- `pnpm test:protected-surfaces` — 4/4.
- `pnpm test:source-contracts` — 2/2; el diagnóstico de 3 reglas en el
  fixture inválido es evidencia negativa esperada.
- `pnpm test:tooling` — 119/119.
- `pnpm registries:check` — catálogo sincronizado.
- `pnpm docs:links:check` — 326 archivos, pasa.
- `pnpm validation:observations config/validation-observations.example.json`
  — esquema válido. El ejemplo contiene métricas sintéticas y no se usa como
  evidencia.

### Supabase local

- `supabase start`
- `supabase db reset`
- `supabase db lint --local` — sin errores.
- `pnpm validate:supabase-governance --base origin/develop --head HEAD` —
  pasa; 0 migraciones en el rango.
- `pnpm test:supabase-governance` — 5/5.
- `pnpm test:data` — 8 archivos y 196 tests pgTAP, pasa.

### Static, cobertura y CI-representative

- `pnpm quality:static:branch` — pasa; los scans globales reportan 81 grupos
  jscpd y hallazgos Knip informativos no bloqueantes.
- `pnpm test:shell:changed` — shell sin cambios; skip explícito.
- `pnpm validate:ci` sin variables Supabase — falla en `loopdev-os#build`
  por `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` ausentes.
- `pnpm validate:ci` con variables del Supabase local — pasa, 7/7 tareas.
- `pnpm test:coverage` local — 179 archivos y 792 tests; 66.78% statements,
  60.42% branches, 49.81% functions, 69.20% lines.
- `pnpm --filter loopdev-mobile test:coverage` — 9 suites y 22 tests; 56.92%
  statements, 44.72% branches, 55.75% functions, 61.27% lines.
- La cobertura Vitest medida está disponible como referencia en
  `config/validation-coverage-baseline.json`; no bloquea validaciones ni cierre
  y no se imponen thresholds.
- `pnpm exec playwright test --list` — discovery disponible: 282 tests en 27
  archivos.
- `pnpm e2e:preflight` — bloqueado en esta sesión porque no había LoopDev OS
  escuchando en `127.0.0.1:3001`; no se confunde con un resultado funcional.
- `pnpm validate:git-conventions` — falla para la rama scratch actual por su
  nombre; `pnpm exec node scripts/validate-git-conventions.mjs --branch
test/domain-validation-routing` pasa para la rama canónica.

## Limitaciones con owner y follow-up

| Limitación                                                                | Owner                 | Follow-up                                                                                                        |
| ------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| No hay duración ni observaciones representativas de CI remoto.            | `platform/governance` | Obtener runs CI accesibles y registrar solo duración, false run/skip, duplicación y flakiness observados.        |
| E2E runtime requiere servidor LoopDev OS.                                 | `platform/apps`       | Levantar el servidor con entorno equivalente a CI y repetir perfiles focalizados.                                |
| La rama scratch actual no cumple la convención de nombres.                | `platform/governance` | Renombrar a `test/<area>-<topic>` antes de commit/push; la rama canónica sí pasa.                                |

## Siguiente acción

Conservar el track activo hasta obtener la evidencia remota faltante; después
solicitar aprobación explícita del usuario antes de mover el track a
`tracks/closed/`.
