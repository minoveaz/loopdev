# Frontend Certification Matrix — 2026-08-08

## Resultado del gate

| Check                  | Comando                                                                                  | Resultado                 |
| ---------------------- | ---------------------------------------------------------------------------------------- | ------------------------- |
| Formato de cambios     | `pnpm format:check`                                                                      | PASS                      |
| Clases repetidas       | `pnpm classes:check`                                                                     | PASS                      |
| Ownership de contratos | `pnpm contracts:ownership:check`                                                         | PASS                      |
| Auditoría frontend     | `pnpm front:audit --fail-on-new-findings --baseline=config/frontend-audit-baseline.json` | PASS, 0 hallazgos nuevos  |
| Duplicación            | `pnpm duplication:check`                                                                 | PASS, reporte informativo |
| Dependencias y exports | `pnpm knip --no-exit-code --reporter compact`                                            | PASS, reporte informativo |
| Gate compuesto         | `pnpm front:check`                                                                       | PASS                      |

El baseline versionado está en `config/frontend-audit-baseline.json` y contiene 0 hallazgos aceptados. Una regresión nueva no incluida en ese archivo bloquea `front:check`.

## Estado por suite

| Suite            | Front audit | Tokens    | Typography | Icons     | Light     | Dark      | Mobile    | A11y      | Playwright | Estado      |
| ---------------- | ----------- | --------- | ---------- | --------- | --------- | --------- | --------- | --------- | ---------- | ----------- |
| Launchpad        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente  | Front_Audit |
| Marketing Studio | PASS        | pendiente | parcial    | parcial   | pendiente | pendiente | pendiente | pendiente | pendiente  | Front_Audit |
| Sales CRM        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente  | Front_Audit |
| Health OS        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente  | Front_Audit |
| Quant Ops        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente  | Front_Audit |

## Alcance de este resultado

Este registro certifica la capa estática de Fase 2 y la cobertura parcial de componentes/Axe de Fase 3. La evidencia Axe cubre actualmente primitives compartidos en `@loopdev/ui` y no certifica todavía el comportamiento real de las suites en navegador, responsive en los viewports oficiales, temas ni snapshots visuales.

Una suite solo puede pasar a `Front_Certified` cuando las columnas bloqueantes estén verificadas y exista evidencia de Vitest, Playwright, Axe, light/dark y responsive.

## Próxima evidencia

1. Fase 3 completada en el Design System: `pnpm --filter @loopdev/ui exec vitest run` → 204 suites, 341 tests PASS; `pnpm --filter @loopdev/ui typecheck` → PASS. Cobertura Axe explícita en 43 archivos; composites complejos cuentan con tests propios y Axe cuando el montaje es estable. `SuiteLaunchpad` conserva un gap Axe documentado por un input sin label visible en producción.
2. Añadir las rutas representativas y pruebas Playwright en Fase 4.
3. Registrar evidencias por viewport y tema antes de cambiar el estado de una suite.
