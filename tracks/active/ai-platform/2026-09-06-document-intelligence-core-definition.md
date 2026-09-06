---
id: document-intelligence-core-definition
title: Definición de Document Intelligence Core
status: active
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
lead: null
branch: loopdev-io-feature/ai-platform-document-intelligenc
branches: []
phase: 1
pull_requests: []
issues: [198, 199, 200, 204, 202, 205, 201, 203, 176]
packages:
  - docs/06-product/ai-platform/document-intelligence-core
  - packages/contracts/src/documents
release: not-required
areas: [ai-platform, platform, governance, documentation, contracts]
dependencies:
  - tracks/closed/2026/2026-09-05-document-intelligence-poc-migration.md
  - packages/contracts/src/documents
  - docs/06-product/document-intelligence/workbench-composition.md
  - docs/architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md
blocked_by: []
supersedes: []
---

# Definición de Document Intelligence Core

## Outcome

Definir la capacidad transversal `Document Intelligence Core` para que la persistencia, el ciclo de
vida, el historial, la auditoría, la retención, el adapter de provider, la observabilidad y las
validaciones configurables puedan implementarse de forma segura y consistente después del POC
operativo. El resultado de Fase 0 es un paquete documental aprobado; Fase 1 entrega únicamente el
contrato ejecutable de #199, no código de producto ni una reapertura del track cerrado de migración.

## Contexto

El POC operativo quedó cerrado en
[`2026-09-05-document-intelligence-poc-migration.md`](../../closed/2026/2026-09-05-document-intelligence-poc-migration.md)
y su iniciativa histórica es el Issue [#176](https://github.com/minoveaz/loopdev/issues/176). El POC
ya aporta el workbench nativo, los contratos iniciales de extracción y la evidencia funcional del
flujo `preparation -> processing -> review`. Este track comienza la evolución posterior solicitada
por el Issue [#198](https://github.com/minoveaz/loopdev/issues/198); no cambia el estado ni el
alcance de aquel track cerrado.

`Document Intelligence Core` es una capacidad cross-suite de `ai-platform`. Las suites consumidoras
reciben referencias y resultados autorizados; no poseen Storage, providers, reglas globales ni
auditoría del Core.

## Alcance

### Incluido

- Paquete de definición con UX, auditoría de componentes, contrato, impacto y handoff.
- Contratos del ciclo de vida persistente: documento, versión, extracción, estados, aprobación,
  rechazo, retry, idempotencia, concurrencia, envelopes y errores (#199).
- Frontera de persistencia, ownership `organization_id`/workspace y RLS negativa/positiva (#200).
- Historial consultable, filtros, orden, paginación, reapertura de una extracción versionada y
  evolución del `RecordWorkspace` existente (#204).
- Eventos de auditoría append-only para upload, procesamiento, ediciones, decisiones, retry y
  recuperación (#202).
- Clases de retención, expiración, borrado seguro, cleanup idempotente, estado y recuperación
  operativa (#205).
- Adapter server-side de provider, versionado de prompt/response schema y telemetría segura de
  modelo, tokens, coste y latencia (#201).
- Motor de validaciones configurables para checksum, MRZ, expiración y coherencia de campos, con
  severidad, categorías, warnings y resultados explicables; no fraude/autenticidad/liveness (#203).
- Dependencias, no-go, rollout/rollback y gates de aprobación antes de implementar.

### Excluido

- Código de producto, migraciones, cambios de RLS, rutas nuevas, providers reales, secretos o
  despliegues durante esta fase documental.
- Reabrir, modificar o reclasificar el track cerrado del POC; su evidencia se consume como
  baseline.
- Crear una suite, shell, sidebar, header o navegación paralela a Platform Shell.
- Sustituir el `RecordWorkspace` existente: la vista de historial será una evolución del módulo y
  composición ya existentes, con `SuiteRuntime`/`SuiteCanvas`.
- Fraude, autenticidad, liveness, verificación legal, decisiones autónomas o enriquecimiento
  sectorial.
- Borrado manual destructivo sin política, exposición de documentos originales, PII en logs,
  batch processing y una integración específica con CRM, Marketing Studio o Health OS.

## Decisiones aprobadas

| Fecha      | Decisión                                                                                                                                 | Motivo                                                                                                                                                              | Impacto                                                                                                           | Aprobado por                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 2026-09-06 | El Issue #198 es el delivery issue padre y los Issues #199, #200, #204, #202, #205, #201 y #203 son slices derivados del mismo programa. | Permite separar contratos, datos, experiencia y operación sin perder la frontera del Core.                                                                          | El track conserva una sola secuencia y cada slice mantiene dependencias explícitas.                               | Usuario                             |
| 2026-09-06 | `organization_id` es el scope canónico; RLS y pruebas negativas son obligatorios.                                                        | El Core debe ser cross-suite sin relajar el aislamiento multi-organización.                                                                                         | Todos los modelos, comandos, Storage y eventos deben resolver y verificar tenant server-side.                     | Usuario                             |
| 2026-09-06 | Gemini y cualquier provider permanecen detrás de un adapter server-side versionado.                                                      | Evita acoplar consumidores, exponer secretos o bloquear el reemplazo controlado del provider.                                                                       | Prompt, schema, errores y telemetría se estabilizan en un contrato propio del Core.                               | Usuario                             |
| 2026-09-06 | La experiencia de historial evoluciona el `RecordWorkspace` del módulo existente; no se crea un segundo owner de shell.                  | El POC ya documentó y entregó la composición nativa de plataforma.                                                                                                  | Se reutilizan `AppShell`, `SuiteRuntime`, `SuiteCanvas`, `SuiteSidebar` y zonas declarativas existentes.          | Usuario                             |
| 2026-09-06 | Los cinco documentos quedan formalmente aprobados como paquete para el slice autorizado de #199.                                         | La instrucción de ejecución confirma la aprobación de Fase 0 sin atribuir roles o fechas individuales.                                                              | El paquete queda en `approved`; los gates específicos de los slices posteriores siguen fuera del alcance de #199. | Instrucción de coordinación de #199 |
| 2026-09-06 | Se autoriza ejecutar únicamente el slice de contratos y ciclo de vida de #199 desde `develop` actualizado.                               | La instrucción de implementación delimita explícitamente contratos, compatibilidad y pruebas, y mantiene persistencia, RLS, rutas, UI y providers fuera de alcance. | El track pasa a activo en Fase 1; las fases posteriores permanecen pendientes y no se activan.                    | Instrucción de coordinación de #199 |

## Arquitectura y contratos

### Arquitectura visual nativa LoopDev

```text
App Router
  -> AppShell
    -> PlatformHeader + SuiteSidebar + PlatformContextPanel + SuiteCanvas
      -> SuiteRuntime (document-intelligence)
        -> widgets (HistoryWorkspace, ExtractionRecord, RetentionStatus)
          -> features (filters, reopen, review, audit, validation)
            -> entities (Document, DocumentVersion, Extraction, AuditEvent)
              -> shared / @loopdev/contracts
```

El historial usa la receta `DataWorkspace` para la colección/paginación y el `RecordWorkspace`
existente para abrir una versión y continuar la revisión. `RecordWorkspace` se describe aquí solo
como evolución del módulo actual documentado en
[`workbench-composition.md`](../../../docs/06-product/document-intelligence/workbench-composition.md), no como una
nueva ruta o un nuevo track. Las zonas obligatorias siguen siendo `PlatformHeader`, `SuiteSidebar`,
`PlatformContextPanel` y `SuiteCanvas`; `ModuleHeader`, `ModuleContextPanel` y toolbar son
opcionales declarativos, no navegación persistente adicional.

Shell/Canvas no contienen repositories, reglas, Storage, provider clients ni mutaciones. El Core
resuelve actor, organización, workspace, permisos y auditoría server-side. Los consumidores
reciben IDs opacos y resultados autorizados; nunca secretos, URLs públicas permanentes ni blobs como
fuente de verdad.

### Contratos y dependencias

| Slice                           | Issue | Dependencias     | Entrega documental                                                                       |
| ------------------------------- | ----- | ---------------- | ---------------------------------------------------------------------------------------- |
| Contratos y ciclo de vida       | #199  | ninguna          | modelos, comandos, queries, estados, errores, idempotencia y compatibilidad              |
| Persistencia/RLS                | #200  | #199             | entidades persistentes, FKs, organization/workspace scope, políticas y pruebas negativas |
| Historial                       | #204  | #199, #200       | listado, filtros, cursor, orden, reapertura y navegación al registro versionado          |
| Auditoría                       | #202  | #199, #200       | eventos append-only, actor, timestamp y metadatos seguros                                |
| Retención/cleanup               | #205  | #200, #202       | clases, expiración, borrado, retry, recuperación y evidencia                             |
| Provider adapter/observabilidad | #201  | #199             | adapter server-side, versiones, errores sanitizados, tokens/coste/latencia               |
| Validaciones configurables      | #203  | #199, #200, #204 | reglas, severidad, warnings, explicación y resultado por versión                         |

La compatibilidad con los contratos existentes de `packages/contracts/src/documents` debe ser
aditiva o versionada: no se cambian silenciosamente los esquemas usados por el POC.

## Branch strategy

Este track permanece activo en la rama de implementación del slice #199,
`loopdev-io-feature/ai-platform-document-intelligenc`, creada desde `develop` actualizado. Las
fases posteriores partirán de `develop` actualizado en una rama específica por Issue, después de
sus gates de readiness. No se implementan persistencia, RLS, rutas, UI ni providers en esta rama.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** entregar el paquete formal propuesto y dejar explícitos alcance, contratos,
dependencias, riesgos, aprobación y no-go.

**Definition of Ready**

- [x] Rama documental `docs/ai-platform-document-intelligence-core` confirmada desde `origin/develop`.
- [x] Track cerrado del POC y Issue histórico #176 revisados sin reabrirlos.
- [x] Issue padre #198 y Issues derivados identificados.
- [x] Paquete de cinco documentos formalmente aprobado para el slice autorizado de #199.

**Entregables**

- [x] Este track activo en Fase 1.
- [x] UX spec, component audit, contract, impact assessment e implementation handoff.
- [x] Matriz de Issues y dependencias.
- [x] Aprobación formal registrada y actualización de readiness para #199.

**Validación**

- [x] Revisión cruzada de consistencia entre track, Issues y cinco documentos.
- [x] `node scripts/tracks/validate-tracks.mjs`.
- [x] `node scripts/tracks/generate-tracks-index.mjs`.
- [x] `pnpm docs:links:check`.
- [x] `git diff --check`.

**Evidencia:** Los cinco documentos tienen `status: approved`, apuntan al track activo y no
mantienen texto de aprobación pendiente. Los validadores documentales y el índice generado se
ejecutaron después de los cambios.

**Estado:** completada

### Fase 1: Contratos y ciclo de vida (#199)

**Objetivo:** estabilizar el modelo de documento, versiones, extracción, estados, comandos,
consultas, conflictos e idempotencia compatible con el POC.

**Definition of Ready**

- [x] Slice #199 autorizado explícitamente con alcance estricto.
- [x] Contratos existentes y consumidores del POC inventariados.

**Entregables**

- [x] Read/input models, envelopes, errores y lifecycle transitions.
- [x] Política de retry como nuevo intento inmutable, concurrency token e idempotency key.
- [x] Compatibilidad aditiva con contratos y consumidores del POC.

**Validación**

- [x] Contract tests, compatibility tests y revisión de permisos.

**Evidencia:** Contrato v1 aditivo en
`packages/contracts/src/documents/document-intelligence-core.ts`, export público y pruebas
específicas en `packages/contracts/src/documents/__tests__/document-intelligence-core.test.ts`.
Los comandos conservan `organizationId` como constraint verificable y no incluyen actor,
credenciales, URLs públicas ni payloads de provider. Las mutaciones llevan idempotencia; las
operaciones de revisión llevan además versión esperada y token opaco. Los estados terminales de
extracción no tienen transiciones de reapertura: retry crea un nuevo registro enlazado mediante
`previousAttemptId`, sin mutar el intento anterior; reopen sigue la misma regla. Los envelopes
validan las relaciones de organización y ownership entre documento, versión y extracción. La
política concreta de dedupe queda deliberadamente para persistencia (#200).

**Estado:** completada

### Fase 2: Persistencia y RLS (#200)

**Objetivo:** persistir documentos, versiones y extracciones con ownership verificable.

**Definition of Ready**

- [ ] Contratos de #199 aprobados.
- [ ] `organization_id`, workspace scope y rol de servicio definidos.

**Entregables**

- [ ] Esquema, migraciones, FKs, índices, metadatos de retención y policies RLS.
- [ ] Tests positivos y negativos entre dos organizaciones.

**Validación**

- [ ] Lint/migración local, contract/repository tests y pruebas RLS negativas.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Historial y reapertura (#204)

**Objetivo:** consultar y reabrir extracciones autorizadas sin duplicar shell ni reglas de negocio
en la UI.

**Definition of Ready**

- [ ] #199 y #200 cerrados con evidencia.
- [ ] Recipe `DataWorkspace`/`RecordWorkspace` y permisos aprobados.

**Entregables**

- [ ] Historial con filtros allowlisted, orden estable, cursor y estados empty/error/forbidden.
- [ ] Reapertura de una versión y navegación al `RecordWorkspace` existente.

**Validación**

- [ ] Tests de query/paginación, autorización, responsive/accessibility y `pnpm test:shell:changed`.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 4: Auditoría (#202)

**Objetivo:** registrar acciones del lifecycle de forma append-only y segura.

**Definition of Ready**

- [ ] Modelo de eventos y metadatos sin PII innecesaria aprobado.
- [ ] Actor, organización, timestamp y correlación definidos.

**Entregables**

- [ ] Eventos de upload, processing, edit, approve, reject, retry y recovery.
- [ ] Consulta autorizada para soporte sin mutación de evidencia.

**Validación**

- [ ] Tests de inmutabilidad, scope, orden y redacción de datos sensibles.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 5: Retención y cleanup (#205)

**Objetivo:** ejecutar expiración y borrado seguro de temporales, documentos y resultados según
clases aprobadas.

**Definition of Ready**

- [ ] Persistencia/RLS y auditoría aprobadas.
- [ ] Legal, producto y operaciones aprueban clases y excepciones.

**Entregables**

- [ ] Metadata de expiración, jobs idempotentes, estados de cleanup y recovery.
- [ ] Dry-run, kill switch y evidencia de objetos/registros no eliminados por error.

**Validación**

- [ ] Tests de reloj, retry, fallos parciales, Storage y auditoría.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 6: Provider adapter y observabilidad (#201)

**Objetivo:** desacoplar Gemini/provider de los consumidores y hacer visible el coste/latencia sin
exponer contenido.

**Definition of Ready**

- [ ] Lifecycle contract aprobado.
- [ ] Secret management, límites de coste y capability flag revisados por Security.

**Entregables**

- [ ] Adapter server-side versionado, provider errors y fallback controlado.
- [ ] Métricas de invocación, latencia, tokens, coste agregado y cleanup fallido.

**Validación**

- [ ] Contract/provider tests, timeout/retry tests, redaction review y observabilidad.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 7: Validaciones configurables (#203)

**Objetivo:** evaluar reglas configurables por versión sin mezclar fraude, autenticidad o liveness.

**Definition of Ready**

- [ ] Lifecycle, persistencia e historial aprobados.
- [ ] Ownership de reglas, versionado y permisos de configuración aprobados.

**Entregables**

- [ ] Checksum, MRZ, expiración y coherencia con categoría/severidad/warning.
- [ ] Resultado explicable y reproducible ligado a la versión evaluada.

**Validación**

- [ ] Tests de reglas, versiones, explainability, permisos y regresión con fixtures del POC.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha      | Cambio                                                                        | Motivo                                                                                                                           | Impacto en alcance/fases                                                                                   | Aprobado por |
| ---------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-09-06 | Se crea un track planificado separado del track cerrado de migración del POC. | El Issue #198 solicita la evolución de persistencia, historial, auditoría, retención, adapter y validaciones sin reabrir el POC. | El POC queda como baseline y dependencia; la Fase 0 produce únicamente definición.                         | Usuario      |
| 2026-09-06 | Se activa el track para implementar #199 sin ampliar los slices posteriores.  | El usuario autorizó el contrato ejecutable y exigió compatibilidad aditiva con el POC.                                           | Se añaden contratos y pruebas; persistencia, RLS, rutas, UI, providers y migraciones permanecen excluidos. | Usuario      |

## Riesgos y bloqueos

| Riesgo o bloqueo                                                         | Impacto                                           | Mitigación                                                                                    | Responsable            | Estado  |
| ------------------------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| Deriva entre contratos nuevos y los tipos consumidos por el POC.         | Regresiones o migración incompatible.             | Contrato aditivo/versionado y tests de compatibilidad antes de cada slice.                    | ai-platform            | abierto |
| RLS insuficiente en tablas, Storage o workers privilegiados.             | Exposición cross-tenant.                          | `organization_id` obligatorio, FKs compuestos, policies server-side y pruebas negativas.      | ai-platform/platform   | abierto |
| Retención o cleanup elimina evidencia requerida.                         | Pérdida de continuidad, auditoría o cumplimiento. | Clases aprobadas, dry-run, legal hold pendiente y jobs idempotentes con recovery.             | ai-platform/operations | abierto |
| Provider acoplado a Gemini o telemetría con PII.                         | Coste, cambio de provider o fuga de datos.        | Adapter versionado, redaction, límites y métricas agregadas; no prompts/respuestas completas. | ai-platform/security   | abierto |
| Historial convierte `RecordWorkspace` en una segunda navegación o shell. | Deriva visual y deuda de plataforma.              | Evolucionar el módulo existente y validar `AppShell`/`SuiteRuntime`/`SuiteCanvas` canónicos.  | platform/ai-platform   | abierto |
| Motor configurable se interpreta como fraude o verificación legal.       | Riesgo regulatorio y alcance no aprobado.         | Limitar reglas a checks explicables y mantener fraude, autenticidad y liveness fuera.         | ai-platform/product    | abierto |

## Criterios de cierre

- [ ] Outcome verificable: los cinco documentos propuestos describen un Core coherente y trazable a
      #198, #176 y Issues #199/#200/#204/#202/#205/#201/#203.
- [ ] Scope, arquitectura nativa, permisos, tenancy, errores, dependencias y no-go coinciden en
      track y paquete.
- [ ] Product Owner aprueba UX, scope, roles, retención y journeys.
- [ ] Tech Lead aprueba contratos, RLS, provider boundary, observabilidad y rollback.
- [ ] Cada Issue derivado tiene readiness, dependencia y evidencia antes de implementar.
- [ ] Validaciones documentales pasan y el dashboard de tracks se genera sin editarlo manualmente.
- [ ] El cierre de este track queda pendiente de aprobación explícita del usuario.

## Evidencia de validación

| Fecha      | Validación                                      | Resultado                                                        | Referencia                                                             |
| ---------- | ----------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 2026-09-06 | `git branch --show-current`                     | ✅ Rama documental confirmada.                                   | `docs/ai-platform-document-intelligence-core`                          |
| 2026-09-06 | Revisión cruzada documental                     | ✅ Alcance, Issues, arquitectura y estados `proposed` alineados. | Este track y `docs/06-product/ai-platform/document-intelligence-core/` |
| 2026-09-06 | `node scripts/tracks/validate-tracks.mjs`       | Pendiente de ejecutar.                                           | —                                                                      |
| 2026-09-06 | `node scripts/tracks/generate-tracks-index.mjs` | Pendiente de ejecutar.                                           | `tracks/README.md`                                                     |
| 2026-09-06 | `pnpm docs:links:check`                         | Pendiente de ejecutar.                                           | —                                                                      |
| 2026-09-06 | `git diff --check`                              | Pendiente de ejecutar.                                           | —                                                                      |
| 2026-09-06 | Tests focalizados de contratos                  | ✅ 11 tests de documentos y compatibilidad pasan.                | `documents.test.ts`, `document-intelligence-core.test.ts`              |
| 2026-09-06 | `pnpm --filter @loopdev/contracts typecheck`    | ✅ Sin errores.                                                  | `@loopdev/contracts`                                                   |
| 2026-09-06 | `pnpm --filter @loopdev/contracts build`        | ✅ CJS, ESM y declaraciones generadas correctamente.             | `@loopdev/contracts`                                                   |
| 2026-09-06 | `pnpm contracts:ownership:check`                | ✅ Sin redeclaraciones locales de contratos compartidos.         | `scripts/check-contract-type-ownership.mjs`                            |

## Handoff de sesión

- **Fecha:** 2026-09-06.
- **Rama de continuación:** `loopdev-io-feature/ai-platform-document-intelligenc`.
- **Commit de partida:** `6e3ecd80`.
- **Estado alcanzado:** Slice #199 implementado como contrato v1 aditivo; no se implementó
  persistencia, migraciones, RLS, rutas, UI ni provider.
- **Decisiones, bloqueos y riesgos:** `organization_id`, adapter server-side y evolución del
  `RecordWorkspace` aprobados como fronteras; aprobaciones Product Owner/Tech Lead, clases de
  retención, permisos finales y configuración de reglas siguen pendientes.
- **Validación ejecutada:** 11 contract/compatibility tests, typecheck, build y ownership check.
- **Siguiente acción concreta:** revisar y aprobar el contrato de #199 antes de iniciar #200.

## Cierre

Pendiente de aprobación explícita. El track cerrado del POC no se reabre.
