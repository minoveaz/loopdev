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

Implementar de forma segura y consistente la capacidad transversal `Document Intelligence Core`
después del POC operativo. La entrega cubre contratos, persistencia específica, RLS, historial,
auditoría, retención/cleanup, boundary de provider, observabilidad y validaciones configurables,
manteniendo el aislamiento organizacional y la compatibilidad aditiva con el POC.

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

- UI/rutas nuevas, shell paralelo, providers reales, secretos, despliegues y persistencia general
  de la plataforma.
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

| Fecha      | Decisión                                                                                                                                        | Motivo                                                                                                                                                              | Impacto                                                                                                                                                            | Aprobado por                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| 2026-09-06 | El Issue #198 es el delivery issue padre y los Issues #199, #200, #204, #202, #205, #201 y #203 son slices derivados del mismo programa.        | Permite separar contratos, datos, experiencia y operación sin perder la frontera del Core.                                                                          | El track conserva una sola secuencia y cada slice mantiene dependencias explícitas.                                                                                | Usuario                             |
| 2026-09-06 | `organization_id` es el scope canónico; RLS y pruebas negativas son obligatorios.                                                               | El Core debe ser cross-suite sin relajar el aislamiento multi-organización.                                                                                         | Todos los modelos, comandos, Storage y eventos deben resolver y verificar tenant server-side.                                                                      | Usuario                             |
| 2026-09-06 | Gemini y cualquier provider permanecen detrás de un adapter server-side versionado.                                                             | Evita acoplar consumidores, exponer secretos o bloquear el reemplazo controlado del provider.                                                                       | Prompt, schema, errores y telemetría se estabilizan en un contrato propio del Core.                                                                                | Usuario                             |
| 2026-09-06 | La experiencia de historial evoluciona el `RecordWorkspace` del módulo existente; no se crea un segundo owner de shell.                         | El POC ya documentó y entregó la composición nativa de plataforma.                                                                                                  | Se reutilizan `AppShell`, `SuiteRuntime`, `SuiteCanvas`, `SuiteSidebar` y zonas declarativas existentes.                                                           | Usuario                             |
| 2026-09-06 | Los cinco documentos quedan formalmente aprobados como paquete para el slice autorizado de #199.                                                | La instrucción de ejecución confirma la aprobación de Fase 0 sin atribuir roles o fechas individuales.                                                              | El paquete queda en `approved`; los gates específicos de los slices posteriores siguen fuera del alcance de #199.                                                  | Instrucción de coordinación de #199 |
| 2026-09-06 | Se autoriza ejecutar únicamente el slice de contratos y ciclo de vida de #199 desde `develop` actualizado.                                      | La instrucción de implementación delimita explícitamente contratos, compatibilidad y pruebas, y mantiene persistencia, RLS, rutas, UI y providers fuera de alcance. | El track pasa a activo en Fase 1; las fases posteriores permanecen pendientes y no se activan.                                                                     | Instrucción de coordinación de #199 |
| 2026-09-06 | Se autoriza implementar secuencialmente los slices restantes #200, #204, #202, #205, #201 y #203 en esta misma rama y en un único commit final. | La instrucción de coordinación delimita el orden, conserva el alcance del Core y exige detenerse ante decisiones materiales no aprobadas.                           | Las fases 2–7 se ejecutan una a una con readiness, evidencia y validación dirigida; no se crean rutas, UI, providers reales ni persistencia de plataforma general. | Usuario                             |

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

Este track permanece activo en la rama única de implementación,
`loopdev-io-feature/ai-platform-document-intelligenc`, creada desde `develop` actualizado. Los
slices autorizados se implementan secuencialmente en esta rama y se entregan en un único commit
final; no se crean ramas ni pull requests intermedios. No se implementan rutas, UI, providers
reales, secretos ni persistencia de plataforma general.

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

- [x] Contratos de #199 aprobados.
- [x] `organization_id` canónico y workspace scope compuesto definidos.
- [x] El acceso privilegiado queda limitado al repositorio server-side; ningún secreto o rol de
      servicio cruza el contrato público.

**Entregables**

- [x] Esquema, migraciones, FKs, índices, metadatos de retención y policies RLS.
- [x] Tests positivos y negativos entre dos organizaciones.

**Validación**

- [ ] Validación consolidada de migración local, contract/repository tests y pruebas RLS negativas.
      La validación focalizada está ejecutándose; la evidencia final de cierre del slice permanece
      abierta.

**Evidencia inicial:** Contratos de persistencia en
`packages/contracts/src/documents/document-intelligence-persistence.ts`, migración
`supabase/migrations/20260906100000_document_intelligence_core_persistence.sql` y pruebas
positivas/negativas en `supabase/tests/database/008_document_intelligence_core_rls.sql`.
`organization_id` es obligatorio y canónico; las relaciones documento/workspace, versión/documento
y extracción/versión usan claves foráneas compuestas. Las políticas separan lectura de escritura y
el test ai-platform incluye aislamiento entre dos organizaciones y el rechazo de cambios de
`organization_id` por miembros de varias organizaciones. La consolidación de la evidencia del
slice sigue abierta.

**Estado:** implementada; en validación

### Fase 3: Historial y reapertura (#204)

**Objetivo:** consultar y reabrir extracciones autorizadas sin duplicar shell ni reglas de negocio
en la UI.

**Definition of Ready**

- [x] #199 implementado y #200 implementado con evidencia inicial; ninguno se considera cerrado
      por gobernanza del track.
- [x] La consulta usa `DataWorkspace`/`RecordWorkspace` como boundary de contrato, sin crear shell,
      ruta o owner visual nuevo.
- [x] La reapertura conserva la versión y crea un intento enlazado, sin mutar el intento previo.

**Entregables**

- [x] Historial con filtros allowlisted, orden estable, cursor y estados empty/error/forbidden.
- [x] Reapertura de una versión y navegación al `RecordWorkspace` existente.

**Validación**

- [ ] Consolidación de tests de query/paginación y autorización; responsive/accessibility y
      `pnpm test:shell:changed` no aplican porque no hubo UI ni shell.

**Evidencia inicial:** Contratos de consulta y reapertura en
`packages/contracts/src/documents/document-intelligence-history.ts`, con filtros allowlisted,
cursor opaco, orden estable `createdAt + id` y boundary repository tipado. Las pruebas específicas
verifican límites, rechazo de offsets no declarados y reapertura como nuevo intento inmutable sobre
la versión seleccionada; no se añade shell, ruta ni navegación paralela. La validación consolidada
del slice sigue abierta.

**Estado:** implementada; en validación

### Fase 4: Auditoría (#202)

**Objetivo:** registrar acciones del lifecycle de forma append-only y segura.

**Definition of Ready**

- [x] Modelo de eventos y metadatos sin PII innecesaria definido en contrato y validado por
      redaction tests.
- [x] Actor, organización, timestamp y correlación definidos.

**Entregables**

- [x] Eventos de upload, processing, edit, approve, reject, retry y recovery.
- [x] Consulta autorizada para soporte sin mutación de evidencia.

**Validación**

- [ ] Consolidación de tests de inmutabilidad, scope, orden y redacción de datos sensibles.

**Evidencia inicial:** Eventos append-only y boundary de consulta definidos en
`packages/contracts/src/documents/document-intelligence-audit.ts`, con actor tipado, organización,
timestamp, correlación e idempotencia. La metadata permite únicamente valores escalares y rechaza
claves de PII/payload/provider. La migración
`supabase/migrations/20260906110000_document_intelligence_audit.sql` revoca UPDATE/DELETE, instala
trigger de inmutabilidad, FKs compuestas y RLS; `009_document_intelligence_audit.sql` confirma
append positivo, aislamiento negativo y mutaciones rechazadas. La validación consolidada del slice
sigue abierta.

**Estado:** implementada; en validación

### Fase 5: Retención y cleanup (#205)

**Objetivo:** ejecutar expiración y borrado seguro de temporales, documentos y resultados según
clases aprobadas.

**Definition of Ready**

- [x] Persistencia/RLS y auditoría implementadas con evidencia inicial; la validación dirigida
      consolidada sigue abierta.
- [x] Las clases se limitan a temporales, documentos persistidos y resultados de extracción; legal
      hold queda como estado de exclusión operativa y no como decisión de retención.

**Entregables**

- [x] Metadata de expiración, jobs idempotentes, estados de cleanup y recovery.
- [x] Dry-run, kill switch y evidencia de objetos/registros no eliminados por error como contratos
      y pruebas; el worker destructivo permanece fuera de alcance.

**Validación**

- [ ] Consolidación de tests de reloj lógico, retry, fallos parciales, Storage boundary y
      auditoría.

**Evidencia inicial:** Clases y decisiones de retención, estados de cleanup, idempotencia, retry y
recuperación están tipadas en
`packages/contracts/src/documents/document-intelligence-retention.ts`. La migración
`supabase/migrations/20260906120000_document_intelligence_cleanup.sql` añade únicamente estado
operativo por organización, con FK compuesta, RLS sin DELETE y tests de reloj lógico, retry,
completado y aislamiento en `010_document_intelligence_cleanup.sql`. No se ejecuta ningún worker,
Storage destructivo ni política legal fuera del contrato. La validación consolidada del slice sigue
abierta.

**Estado:** implementada; en validación

### Fase 6: Provider adapter y observabilidad (#201)

**Objetivo:** desacoplar Gemini/provider de los consumidores y hacer visible el coste/latencia sin
exponer contenido.

**Definition of Ready**

- [x] Lifecycle contract aprobado.
- [x] Secret management permanece fuera del contrato público; se usan referencias de prompt/schema,
      capability flags y telemetría agregada sin payloads.

**Entregables**

- [x] Adapter server-side versionado, provider errors y fallback controlado como contrato.
- [x] Métricas de invocación, latencia, tokens, coste agregado y cleanup fallido como modelo seguro.

**Validación**

- [ ] Consolidación de contract/provider tests, timeout/retry tests, redaction review y
      observabilidad.

**Evidencia inicial:** Adapter server-side y observabilidad están definidos en
`packages/contracts/src/documents/document-intelligence-provider.ts`. Los contratos transportan
solo referencias versionadas de prompt/response schema, capability, timeout, modelo, tokens,
latencia y coste entero en micros USD; no incluyen secretos, prompts ni respuestas completas en
errores. `sanitizeDocumentProviderError` devuelve mensajes allowlisted y conserva únicamente la
correlación. Las pruebas cubren timeout sanitizado, telemetría y compatibilidad de versiones; no se
implementa provider real. La validación consolidada del slice sigue abierta.

**Estado:** implementada; en validación

### Fase 7: Validaciones configurables (#203)

**Objetivo:** evaluar reglas configurables por versión sin mezclar fraude, autenticidad o liveness.

**Definition of Ready**

- [x] Lifecycle, persistencia e historial implementados con evidencia inicial; la validación
      consolidada sigue abierta.
- [x] Ownership de reglas, versionado y permisos de configuración acotados al contrato server-side;
      fraude, autenticidad y liveness siguen fuera de alcance.

**Entregables**

- [x] Checksum, MRZ, expiración y coherencia con categoría/severidad/warning.
- [x] Resultado explicable y reproducible ligado a la versión evaluada.

**Validación**

- [ ] Consolidación de tests de reglas, versiones, explainability, permisos y regresión con
      fixtures del POC.

**Evidencia inicial:** Reglas versionadas, ownership organizacional, permisos `read/evaluate/manage`,
severidad, warnings y resultados explicables están definidos en
`packages/contracts/src/documents/document-intelligence-validation.ts`. Las fixtures de regresión
cubren checksum, MRZ, expiración y coherencia; se rechazan categorías fuera de alcance y permisos
incorrectos. No se implementan fraude, autenticidad ni liveness. La validación consolidada del
slice sigue abierta.

**Estado:** implementada; en validación

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
- [ ] El track permanece activo porque las Fases 2–7 están implementadas y en validación; la
      aprobación formal de Fase 0 está completa y el cierre final espera un PR consolidado y su
      evidencia completa.

## Evidencia de validación

| Fecha      | Validación                                        | Resultado                                                                                                                   | Referencia                                                             |
| ---------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 2026-09-06 | `git branch --show-current`                       | ✅ Rama documental confirmada.                                                                                              | `docs/ai-platform-document-intelligence-core`                          |
| 2026-09-06 | Revisión cruzada documental                       | ✅ Alcance, Issues, arquitectura y estados de Fase 0/Fase 1/Fases 2–7 alineados.                                            | Este track y `docs/06-product/ai-platform/document-intelligence-core/` |
| 2026-09-06 | `node scripts/tracks/validate-tracks.mjs`         | ✅ Track válido.                                                                                                            | —                                                                      |
| 2026-09-06 | `node scripts/tracks/generate-tracks-index.mjs`   | ✅ Dashboard regenerado.                                                                                                    | `tracks/README.md`                                                     |
| 2026-09-06 | `pnpm docs:links:check`                           | ✅ 347 archivos Markdown escaneados sin enlaces rotos.                                                                      | —                                                                      |
| 2026-09-06 | `git diff --check`                                | ✅ Ejecutado durante cada slice.                                                                                            | —                                                                      |
| 2026-09-06 | Tests focalizados de contratos                    | ✅ 32 tests de documentos, lifecycle, persistencia, historial, auditoría, provider, retención y validación pasan.           | `packages/contracts/src/documents/__tests__/`                          |
| 2026-09-06 | `pnpm --filter @loopdev/contracts typecheck`      | ✅ Sin errores.                                                                                                             | `@loopdev/contracts`                                                   |
| 2026-09-06 | `pnpm --filter @loopdev/contracts build`          | ✅ CJS, ESM y declaraciones generadas correctamente.                                                                        | `@loopdev/contracts`                                                   |
| 2026-09-06 | `pnpm contracts:ownership:check`                  | ✅ Sin redeclaraciones locales de contratos compartidos.                                                                    | `scripts/check-contract-type-ownership.mjs`                            |
| 2026-09-06 | `pnpm test:data:domain -- ai-platform`            | ✅ 66 tests SQL; Storage, persistencia, auditoría y cleanup pasan, incluidos negativos de inmutabilidad multi-organización. | `supabase/tests/database/007-010_*.sql`                                |
| 2026-09-06 | Gobernanza de migraciones cambiadas               | ✅ Las tres migraciones pasan `validate-supabase-governance`.                                                               | `supabase/migrations/202609061*.sql`                                   |
| 2026-09-06 | `pnpm format:check`, `pnpm docs:links:check`      | ✅ Formato y 347 enlaces Markdown pasan.                                                                                    | Implementación y documentación del Core                                |
| 2026-09-06 | `pnpm registries:check`, `pnpm validate:worktree` | ✅ Catálogo y controles de worktree pasan.                                                                                  | Controles de repositorio                                               |
| 2026-09-06 | `pnpm quality:static:worktree`                    | ✅ Prettier y ESLint de archivos cambiados pasan.                                                                           | Controles estáticos                                                    |
| 2026-09-06 | `pnpm validate:full`                              | ⚠️ 228/229 archivos de tests pasan; falla timeout ajeno en `@loopdev/ui` `PhoneInput.test.tsx`.                             | Limitación preexistente/no relacionada                                 |

## Handoff de sesión

- **Fecha:** 2026-09-06.
- **Rama de continuación:** `loopdev-io-feature/ai-platform-document-intelligenc`.
- **Commit de partida:** `26bee8c5`.
- **Estado alcanzado:** Fase 1 (#199) es la única fase completada. Las Fases 2–7 tienen
  implementación inicial como contratos y límites mínimos; permanecen en validación y no se
  consideran completadas. Persistencia/RLS se limita a las tres tablas Core, auditoría
  append-only y estado de cleanup. No se implementaron rutas, UI, providers reales, secretos ni
  persistencia de plataforma general.
- **Decisiones, bloqueos y riesgos:** `organization_id`, incluida su inmutabilidad en UPDATE para
  documentos, versiones, extracciones y cleanup, sigue siendo server-authoritative. Adapter
  server-side, historial como contrato de `RecordWorkspace`, clases acotadas y reglas sin
  fraude/autenticidad/liveness quedan dentro del alcance implementado. El worker de cleanup,
  providers reales, rutas/UI y el cierre consolidado siguen fuera de esta entrega.
- **Validación ejecutada:** suite focalizada de 28 tests de contratos, typecheck/build de
  `@loopdev/contracts`, 62 tests SQL del dominio `ai-platform`, gobernanza de migraciones
  cambiadas, catálogo de datos, formato, docs links, ownership, static worktree y
  `git diff --check`. `pnpm validate:full` queda limitado por el timeout ajeno descrito en la
  evidencia.
- **Siguiente acción concreta:** consolidar el PR y la evidencia restante de las Fases 2–7 antes
  de solicitar el cierre del track.

## Cierre

La aprobación formal de Fase 0 está completa. El track permanece activo porque las Fases 2–7
siguen en implementación/validación; el cierre final espera un PR consolidado y evidencia
completa. El track cerrado del POC no se reabre.
