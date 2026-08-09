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

| Suite            | Front audit | Tokens    | Typography | Icons     | Light     | Dark      | Mobile    | A11y      | Playwright                 | Estado      |
| ---------------- | ----------- | --------- | ---------- | --------- | --------- | --------- | --------- | --------- | -------------------------- | ----------- |
| Launchpad        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | pendiente | pendiente | pendiente                  | Front_Audit |
| Marketing Studio | PASS        | pendiente | parcial    | parcial   | pendiente | pendiente | pendiente | pendiente | pendiente                  | Front_Audit |
| Sales CRM        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | shell     | pendiente | PASS desktop + mobile      | Front_Audit |
| Health OS        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | shell     | pendiente | fuera de alcance funcional | Front_Audit |
| Quant Ops        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente | N/A       | pendiente | PASS desktop-only          | Front_Audit |

## Alcance de este resultado

### Nomenclatura de superficies

- **Desktop Web:** aplicación web en viewport de escritorio; en Playwright corresponde al proyecto `desktop` (`1440x900`).
- **Responsive Web:** la aplicación web adaptada a distintos tamaños; se evidencia mediante `Mobile Web` y `Mobile Compact`.
- **Mobile Web:** aplicación web en viewport móvil; en Playwright corresponde al proyecto `mobile` con dispositivo iPhone 13.
- **Mobile Compact:** caso extremo de Responsive Web; en Playwright corresponde al proyecto `mobile-compact` con viewport `320x800`.
- **Mobile App:** aplicación móvil instalada de `apps/loopdev-mobile`; es una superficie distinta de Mobile Web y no se incluye en los proyectos Playwright web.

Este registro certifica la capa estática de Fase 2 y la cobertura parcial de componentes/Axe de Fase 3. La evidencia Axe cubre actualmente primitives compartidos en `@loopdev/ui` y no certifica todavía el comportamiento real de las suites en navegador, responsive en los viewports oficiales, temas ni snapshots visuales.

Una suite solo puede pasar a `Front_Certified` cuando las columnas bloqueantes estén verificadas y exista evidencia de Vitest, Playwright, Axe, light/dark y responsive.

El alcance de Fase 4 es explícito: Marketing Studio, Brand Hub, Sales CRM y Pipeline se validan en mobile; Quant Ops se valida únicamente en desktop porque no tendrá versión móvil; Health OS conserva smoke de shell/responsive en mobile, pero su funcionalidad interna queda fuera de prioridad hasta que la suite esté desarrollada.

La separación de proyectos Playwright queda verificada con `18` tests en `desktop`, `12` en `mobile` y `12` en `mobile-compact`. Los tests de interacción autenticada de `authenticated.application.spec.mjs` son desktop-only; las rutas de `authenticated.mobile.spec.mjs` se ejecutan en los dos proyectos mobile.

## Próxima evidencia

1. Fase 3 completada en el Design System: `pnpm --filter @loopdev/ui exec vitest run` → 204 suites, 341 tests PASS; `pnpm --filter @loopdev/ui typecheck` → PASS. Cobertura Axe explícita en 43 archivos; composites complejos cuentan con tests propios y Axe cuando el montaje es estable. `SuiteLaunchpad` conserva un gap Axe documentado por un input sin label visible en producción.
2. Ampliar las rutas representativas y pruebas Playwright de las suites prioritarias en Fase 4.
3. Mantener las excepciones de alcance de Quant Ops y Health OS explícitas en cada actualización.
4. Registrar evidencias por viewport y tema antes de cambiar el estado de una suite.
