---
id: platform-sandbox-runtime
title: Platform Sandbox Runtime
status: planned
created: 2026-09-07
updated: 2026-09-07
owner: platform
lead: null
branch: null
branches:
  - feature/crm-untitled-ui-integration
phase: 0
pull_requests: []
issues:
  - 218
  - 216
packages:
  - packages/contracts
  - apps/loopdev-os
  - apps/loopdev-mobile
release: not-required
areas:
  - platform
  - crm
  - marketing-studio
  - ai-platform
  - quant
dependencies:
  - 2026-08-13-suite-runtime-suite-canvas-fsd
blocked_by: []
supersedes: []
---

# Platform Sandbox Runtime

## Outcome

Todas las suites podrán ejecutarse en un modo Sandbox interactivo, determinista y
no persistente, usando los mismos contratos de datos que el modo Real. CRM será el
primer piloto para validar el flujo Contacto -> Lead -> Pipeline -> Customer 360.

## Contexto

El estado actual mezcla una flag global de simulación, fixtures por suite y llamadas
reales por sección. Esto produce estados híbridos, identificadores incompatibles con
los endpoints y una experiencia que no permite probar flujos completos de forma
segura. La issue #218 se amplía desde CRM hacia una capacidad transversal de plataforma.

## Alcance

### Incluido

- Modos explícitos `real`, `sandbox` y `preview`.
- Selector visible para usuarios autorizados e indicador persistente del entorno.
- Contexto compartido de sesión, organización, workspace y permisos.
- Adaptadores de lectura y comandos compatibles entre Real y Sandbox.
- Store local namespaced, seed determinista, reset y persistencia local opcional.
- Política de red que bloquee writes remotos en Sandbox.
- Registro de seed packs por suite.
- Estrategia de tests unitarios, contract, integración, accesibilidad, responsive,
  E2E y visuales deterministas.

### Excluido

- Migración masiva a Untitled UI.
- Cambios o relajaciones de RLS y autorización.
- Persistencia server-side del Sandbox.
- Sustitución inmediata de todos los fixtures existentes.
- Implementación completa de todas las suites en la primera fase.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-09-07 | El alcance es un Platform Sandbox Runtime transversal; CRM es el primer piloto | Evitar una solución CRM aislada que se replique de forma inconsistente | Owner platform, áreas CRM y demás suites | Usuario |
| 2026-09-07 | El selector de entorno será visible para usuarios autorizados | Permitir revisar y usar los flujos sin flags manuales | Requiere contrato de permisos, accesibilidad y persistencia | Usuario |
| 2026-09-07 | Real, Sandbox y Preview tendrán adaptadores explícitos | Eliminar fallbacks híbridos y conservar contratos de producción | UI independiente del origen de datos | Usuario |

## Arquitectura y contratos

La especificación técnica inicial está en
`docs/03-platform/PLATFORM_SANDBOX_RUNTIME.md`.

El runtime será propietario de plataforma y expondrá:

- `PlatformEnvironmentMode`.
- `PlatformRuntimeContext`.
- Adaptadores de lectura y comandos.
- Registro y ciclo de vida de `PlatformSeedPack`.
- Store local, reset y política de persistencia.
- Política de red y estado visible del entorno.

Las suites no crearán providers globales ni stores paralelos. Design System no
contendrá lógica de runtime.

## Branch strategy

El track es transversal (`branch: null`) porque el runtime afecta contratos y
consumidores de varias suites. La primera implementación se realizará en
`feature/crm-untitled-ui-integration`; futuras suites podrán usar ramas propias
referenciadas aquí sin duplicar el contrato.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Cerrar inventario, límites arquitectónicos, contrato inicial y matriz
de validación antes de implementar.

**Definition of Ready**
- [x] Issue #218 ampliada al Platform Sandbox Runtime.
- [x] Owner platform y estrategia transversal definidos.
- [x] Inventario de providers, flags, fixtures y adaptadores documentado.
- [x] Contrato inicial de modos, contexto, adaptadores, seeds, reset y políticas definido.
- [x] CRM identificado como piloto y los fallbacks híbridos documentados como deuda a retirar.
- [ ] Contratos revisados con tests de esquema antes de promoción a implementación.

**Entregables**
- [x] `docs/03-platform/PLATFORM_SANDBOX_RUNTIME.md`.
- [x] Este track registrado en `tracks/planned/platform/`.
- [x] Contratos públicos, store local y provider base implementados sin conectar CRM.
- [x] Persistencia local versionada del modo preparada para el selector.
- [x] Selector visible compuesto con `TechnicalDropdown`, sin crear una primitiva paralela.
- [ ] Tests técnicos focalizados del primer slice.
- [ ] Decisión de implementación aprobada para Fase 1.

**Validación**
- `node scripts/tracks/validate-tracks.mjs`.
- `node scripts/tracks/generate-tracks-index.mjs`.
- `pnpm validate:plan`.
- Revisión de ownership y contratos de `packages/contracts`.

**Evidencia:** Contratos, store y provider base documentados; validación focalizada completada.

**Estado:** en progreso

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-09-07 | De sandbox CRM a runtime de plataforma | El mismo problema existe en todas las suites y debe resolverse en una capa común | Fase 0 añade inventario transversal; CRM continúa como piloto | Usuario |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Fixtures actuales tienen contratos e identificadores heterogéneos | El adapter sandbox puede divergir de Real | Validación de schemas y seed packs versionados | platform | abierto |
| Persistencia local puede filtrar datos entre organizaciones | Riesgo de aislamiento y tests no deterministas | Namespace por organización/workspace/versión y reset obligatorio | platform | abierto |
| Selector visible puede afectar shell responsive | Regresión visual o de accesibilidad | Declararlo como control de PlatformHeader y cubrir estados responsive | platform | abierto |
| Suite unitaria completa tiene un bloqueo local conocido en Windows | Feedback local incompleto | Usar validaciones focalizadas y no cambiar dependencias sin reproducción en CI | governance | conocido |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-09-07 | `pnpm --filter @loopdev/contracts typecheck` | Correcto | Contratos de runtime |
| 2026-09-07 | Tests focalizados de contratos (2) y store (3) | 5/5 correctos | `packages/contracts/src/platform/__tests__/runtime.test.ts`, `apps/loopdev-os/src/core/platform/runtimeStore.test.ts` |
| 2026-09-07 | `pnpm --filter loopdev-os exec tsc --noEmit` | Correcto tras reconstruir `@loopdev/contracts` | Provider y layout |
| 2026-09-07 | ESLint focalizado | 0 errores; 2 warnings preexistentes de fuente Next | Provider, store y layout |
| 2026-09-07 | `node scripts/tracks/validate-tracks.mjs` | Correcto | Track y dashboard |
| 2026-09-07 | `pnpm --filter @loopdev/contracts typecheck` | Correcto | Contratos CRM/runtime |
| 2026-09-07 | `pnpm --filter loopdev-os exec tsc --noEmit` | Correcto | Adaptador y consumidores CRM |
| 2026-09-07 | `pnpm --filter loopdev-os exec vitest run src/suites/sales-crm/runtimeAdapter.test.ts src/core/platform/runtimeStore.test.ts` | 5/5 correctos | Seguridad de modo, UUIDs y mutación local |
| 2026-09-07 | ESLint focalizado de consumidores CRM | 0 errores; warnings existentes de PipelineWorkspace | Adaptador y routing de Contacts/Leads/Pipeline/Customer 360 |
| 2026-09-07 | Corrección del seed y del comando `createLead` local | Contacto sin Lead/Opportunity, namespace organización/workspace, Customer 360 rechaza IDs desconocidos | CRM adapter |
| 2026-09-07 | Tests focalizados posteriores a la corrección | 6/6 correctos; typecheck y lint correctos | `runtimeAdapter.test.ts` |
| 2026-09-07 | Revisión de notas iniciales en captura de Lead | Real conserva `POST /api/crm/notes`; Sandbox/Preview dejan la nota como pendiente local sin request remoto | `useLeadCaptureForm.ts` |
| 2026-09-07 | Comandos locales de Contact | Sandbox crea/actualiza Contactos, Preview bloquea, y claves de organización no UUID se normalizan para contratos | `runtimeAdapter.ts`, formularios de Contacts |
| 2026-09-07 | Persistencia del estado Sandbox | El estado CRM local se conserva tras refresh en almacenamiento versionado del navegador y Reset lo elimina | `runtimeAdapter.ts` |

## Handoff de sesión

- **Fecha:** 2026-09-07.
- **Rama de continuación:** `feature/crm-untitled-ui-integration`.
- **Commit de partida:** `95f61f49`.
- **Estado alcanzado:** CRM consume explícitamente Real/Sandbox/Preview para Contacts, Leads, Pipeline y Customer 360; Sandbox mantiene estado local por organización y Preview bloquea mutaciones.
- **Decisiones, bloqueos y riesgos:** Selector visible autorizado; no se modifican sus archivos. Real conserva las rutas Supabase y no se cambia RLS/API. Las mutaciones secundarias de CRM fuera de este slice aún requieren migración.
- **Validación ejecutada:** Typecheck de contracts y loopdev-os; tests focalizados runtime/store (5/5); ESLint focalizado sin errores.
- **Siguiente acción concreta:** Extender el adaptador a Tasks, Communications y mutaciones CRM restantes, con aprobación de Fase 1.

## Cierre

Pendiente de aprobación explícita.
