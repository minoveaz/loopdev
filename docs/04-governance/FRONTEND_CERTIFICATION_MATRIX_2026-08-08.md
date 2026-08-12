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

| Suite            | Front audit | Tokens    | Typography | Icons     | Light     | Dark                    | Mobile    | A11y      | Playwright                 | Estado      |
| ---------------- | ----------- | --------- | ---------- | --------- | --------- | ----------------------- | --------- | --------- | -------------------------- | ----------- |
| Launchpad        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente               | pendiente | pendiente | pendiente                  | Front_Audit |
| Marketing Studio | PASS        | pendiente | parcial    | parcial   | pendiente | pendiente               | pendiente | pendiente | pendiente                  | Front_Audit |
| Sales CRM        | PASS        | pendiente | pendiente  | pendiente | pendiente | PASS (Pipeline desktop) | shell     | pendiente | PASS desktop + mobile      | Front_Audit |
| Health OS        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente               | shell     | pendiente | fuera de alcance funcional | Front_Audit |
| Quant Ops        | PASS        | pendiente | pendiente  | pendiente | pendiente | pendiente               | N/A       | pendiente | PASS desktop-only          | Front_Audit |

## Resultado de revisión Fase 5

Las cinco suites fueron revisadas con `front:audit --file`: Launchpad, Marketing Studio, Sales CRM, Health OS y Quant Ops obtuvieron 0 hallazgos. El build de `loopdev-os` también pasa. Health OS mantiene alcance limitado a shell/responsive y Quant Ops permanece desktop-only por decisión de producto.

La certificación ejecutable `e2e/phase5.certification.spec.mjs` valida las cinco suites en light y dark con sesión E2E, contenido principal visible, ausencia de overflow horizontal y ausencia de errores de navegador no conocidos: **10/10 PASS**.

## Alcance de este resultado

### Nomenclatura de superficies

- **Desktop Web:** aplicación web en viewport de escritorio; en Playwright corresponde al proyecto `desktop` (`1440x900`).
- **Responsive Web:** la aplicación web adaptada a distintos tamaños; se evidencia mediante `Mobile Web` y `Mobile Compact`.
- **Mobile Web:** aplicación web en viewport móvil; en Playwright corresponde al proyecto `mobile` con dispositivo iPhone 13.
- **Mobile Compact:** caso extremo de Responsive Web; en Playwright corresponde al proyecto `mobile-compact` con viewport `320x800`.
- **Mobile App:** aplicación móvil instalada de `apps/loopdev-mobile`; es una superficie distinta de Mobile Web y no se incluye en los proyectos Playwright web.

Este registro consolida la evidencia estática, de componentes y de aplicación de las fases anteriores. La evidencia de navegador incluye Axe en login, launchpad y Sales Pipeline, además de snapshots light/dark en Desktop Web, Mobile Web y Mobile Compact para login.

Una suite solo puede pasar a `Front_Certified` cuando las columnas bloqueantes estén verificadas y exista evidencia de Vitest, Playwright, Axe, light/dark y responsive.

El alcance de Fase 4 es explícito: Marketing Studio, Brand Hub, Sales CRM y Pipeline se validan en mobile; Quant Ops se valida únicamente en desktop porque no tendrá versión móvil; Health OS conserva smoke de shell/responsive en mobile, pero su funcionalidad interna queda fuera de prioridad hasta que la suite esté desarrollada.

La separación de proyectos Playwright queda verificada con `19` tests en `desktop`, `12` en `mobile` y `12` en `mobile-compact`. Los tests de interacción autenticada de `authenticated.application.spec.mjs` son desktop-only; las rutas de `authenticated.mobile.spec.mjs` se ejecutan en los dos proyectos mobile. Axe desktop cubre ahora login, launchpad y Sales Pipeline sin violaciones críticas o serias.

## Evidencia de cierre de Fase 4 y 4.1

1. Fase 3 completada en el Design System: `pnpm --filter @loopdev/ui exec vitest run` → 204 suites, 341 tests PASS; `pnpm --filter @loopdev/ui typecheck` → PASS. Cobertura Axe explícita en 43 archivos; composites complejos cuentan con tests propios y Axe cuando el montaje es estable. `SuiteLaunchpad` conserva un gap Axe documentado por un input sin label visible en producción.
2. `pnpm exec playwright test --project=desktop --project=mobile --project=mobile-compact --workers=1` → 43 tests PASS.
3. `pnpm exec playwright test e2e/responsive.visual.spec.mjs --project=mobile --project=mobile-compact --workers=1` → 4 snapshots PASS.
4. CI ejecuta Desktop Web, Mobile Web, Mobile Compact, Axe de navegador y snapshots visuales. Quant Ops permanece desktop-only y Health OS limita la cobertura móvil a shell/responsive.
