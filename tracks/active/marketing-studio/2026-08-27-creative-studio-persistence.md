---
id: creative-studio-persistence
title: Persistencia y Storage de Creative Studio
status: active
created: 2026-08-27
updated: 2026-08-28
owner: marketing-studio
lead: null
branch: feature/marketing-studio-creative-persistence
branches: []
phase: 3
pull_requests: []
issues: []
packages: [@loopdev/contracts, loopdev-os]
release: not-required
areas: [marketing-studio, platform]
dependencies: [marketing-studio-platform, platform-core-tenancy]
blocked_by: [remote-supabase-validation]
supersedes: []
---

# Persistencia y Storage de Creative Studio

## Outcome

Establecer la base persistente, multi-tenant y server-side para migrar el backoffice Creative Studio
de VitaBlue a LoopDev sin tocar datos CRM existentes ni activar migraciones remotas.

## Contexto

Creative Studio necesita conservar proyectos creativos, versiones históricas y variantes por canal o
formato. El límite autoritativo es `organization` + `workspace` + `brand`, siguiendo los contratos y
RLS ya usados por Marketing Studio, Organizations, Workspaces y Brands. Las ramas remotas
`feature/crm-contacts-backend-foundation` y `feature/crm-leads-backend-foundation` se revisaron como
referencia de contratos, acceso y persistencia CRM; no se importan cambios CRM en este track.

## Alcance

### Incluido

- Contratos Zod y tipos para proyectos, versiones y variantes.
- Migración Supabase aditiva para `marketing_creative_projects`,
  `marketing_creative_project_versions` y `marketing_creative_variants`.
- Buckets y políticas Storage, assets fuente/exportados, referencias de capas,
  hashing/deduplicación, thumbnails comprimidas y cleanup seguro.
- Claves compuestas de tenant, índices y RLS con `marketing.read`/`marketing.manage`.
- Repositorio server-side Supabase y repositorio en memoria determinista para tests.
- Tests de contratos, aislamiento del repositorio y RLS local.
- Definición y entrega de Fase 1 y del tramo append-only/no destructivo de Fase 2.

### Excluido

- Migraciones remotas, secretos, OAuth, publicación o proveedores externos.
- Borrado o modificación de datos y tablas CRM existentes.
- Edición destructiva de versiones o variantes; quedan append-only en esta entrega.
- Importación de datos reales desde VitaBlue y UI completa del editor.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-27 | Usar `organization_id`, `brand_id` y `workspace_id` como límites obligatorios de Creative Studio. | Mantener aislamiento con Platform Core y Marketing Studio. | Contratos, FKs compuestas, consultas y RLS deben conservar los tres identificadores. | Solicitud explícita del usuario |
| 2026-08-27 | Versiones y variantes se crean y leen, pero no se actualizan ni eliminan en esta fase. | Preservar historial y limitar Fase 2 a comportamiento no destructivo. | Solo se conceden `select, insert`; la actualización queda para una fase posterior. | Solicitud explícita del usuario |
| 2026-08-27 | La validación de Supabase se limita al entorno Docker local; no se ejecutan migraciones remotas. | Evitar secretos y cambios de datos fuera del entorno autorizado. | RLS real queda pendiente de CI/entorno autorizado. | Solicitud explícita del usuario |

## Arquitectura y contratos

`@loopdev/contracts` define los modelos de lectura y comandos de creación. `InMemoryMarketingRepository`
permite tests deterministas con permisos explícitos; `SupabaseCreativeRepository` usa el cliente SSR,
verifica usuario y `has_organization_permission`, y vuelve a aplicar los filtros de tenant en cada
consulta. Supabase es la fuente autoritativa; no se introduce `localStorage` ni fallback silencioso.

## Branch strategy

La implementación se entrega en una única rama: `feature/marketing-studio-creative-persistence`.
Las ramas CRM remotas revisadas son referencias previas y no forman parte de este cambio.

## Fases

### Fase 1: Contratos, esquema y aislamiento

**Objetivo:** dejar disponible la persistencia base multi-tenant sin alterar CRM ni datos existentes.

**Definition of Ready**
- [x] Existe un track específico y el owner `marketing-studio` es canónico.
- [x] Se revisaron los patrones de Contacts y Leads backend.
- [x] Se identificaron permisos `marketing.read` y `marketing.manage`.

**Entregables**
- [x] Contratos y tipos de Creative Studio.
- [x] Migración aditiva con FKs, índices, grants y RLS.
- [x] Tipos locales de base de datos actualizados.
- [x] Repositorio server-side y adaptador en memoria.

**Validación**
- [x] Tests de contratos.
- [x] Tests de aislamiento del repositorio.
- [x] Test SQL de aislamiento RLS preparado para Supabase local.

**Evidencia:** `packages/contracts/src/marketing/creative.ts`,
`supabase/migrations/20260827100000_marketing_creative_studio_persistence.sql`,
`apps/loopdev-os/src/services/marketing/repository.ts`,
`supabase/tests/database/005_creative_studio_rls.sql`.

**Estado:** completada en esta rama; validación remota pendiente.

### Fase 2: Historial y variantes no destructivas

**Objetivo:** soportar snapshots versionados y variantes de canal/formato sin operaciones destructivas.

**Definition of Ready**
- [x] El proyecto tiene versión inicial configurable y límites de tenant.
- [x] Cada versión referencia un proyecto del mismo tenant mediante FK compuesta.
- [x] Cada variante referencia una versión y proyecto coherentes mediante FK compuesta.

**Entregables**
- [x] Creación y lectura de versiones con `version_number` único por proyecto.
- [x] Creación y lectura de variantes con `key` único por versión.
- [x] Payload JSONB para documento y composición, sin Storage ni secretos.
- [x] Grants y políticas sin `update`/`delete` para versiones y variantes.

**Validación**
- [x] Rechazo de versiones duplicadas en el repositorio en memoria.
- [x] Pruebas de aislamiento de proyecto, versión y variante.
- [ ] Ejecución del test RLS contra Supabase local.

**Evidencia:** `apps/loopdev-os/src/services/marketing/repository.test.ts`,
`packages/contracts/src/marketing/__tests__/creative.test.ts`,
`supabase/tests/database/005_creative_studio_rls.sql`.

**Estado:** tramo no destructivo implementado; publicación/edición avanzada diferida.

### Controles de capacidad obligatorios

Estos controles son invariantes de contratos, migraciones, repositorios y pruebas:

1. Los proyectos, versiones, variantes y capas no almacenan base64 ni data URLs; usan referencias a Storage.
2. Cada asset respeta un límite por archivo y cada proyecto respeta un límite agregado.
3. Las thumbnails se comprimen y referencian el original; no duplican el archivo fuente.
4. La retención elimina únicamente versiones fuera de las últimas 10 y sin referencias activas.
5. Los assets huérfanos solo se limpian tras una ventana de gracia y si no tienen referencias.
6. Las exportaciones temporales tienen expiración y se limpian después de vencer.
7. La cuota y el uso se contabilizan por `organization_id` + `workspace_id`.
8. El autosave actualiza el borrador sin crear una versión por pulsación.
9. El hash SHA-256 deduplica assets activos dentro del tenant y workspace.
10. IndexedDB es una caché limitada; Supabase/Storage permanece como fuente de verdad.

### Fase 3: Assets y Storage

**Objetivo:** persistir archivos fuente, exports y thumbnails con límites, aislamiento y cleanup
seguro, sin introducir datos inline ni tocar CRM.

**Definition of Ready**
- [x] Los diez controles de capacidad están documentados como invariantes verificables.
- [x] El bucket privado y las políticas Storage exigen rutas con organization/workspace y permisos Marketing.
- [x] Assets y referencias tienen FKs compuestas para impedir cruces de tenant.

**Entregables**
- [x] Contratos Zod para assets, referencias, documentos sin inline data, cuotas y uso.
- [x] Migración aditiva con bucket `marketing-creative`, políticas RLS, deduplicación por hash,
  cuotas, límites, retención y funciones de cleanup.
- [x] Repositorios server-side e in-memory para hashing, deduplicación, referencias, uso y cleanup.
- [x] Autosave de borrador sin versionado por pulsación.
- [x] Tipos locales de Supabase actualizados para tablas y funciones nuevas.

**Validación**
- [x] Tests de contratos para anti-base64, thumbnails y referencias.
- [x] Tests del repositorio para hashing, dedupe, límites, uso y expiración.
- [x] Test pgTAP de Storage/RLS preparado para Docker local.
- [ ] Ejecución pgTAP contra la instancia local después de aplicar la migración.

**Evidencia:** `packages/contracts/src/marketing/creative-assets.ts`,
`supabase/migrations/20260827110000_marketing_creative_studio_storage.sql`,
`apps/loopdev-os/src/services/marketing/creative-assets-repository.ts`,
`supabase/tests/database/006_creative_studio_storage_rls.sql`.

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-27 | Se separó la persistencia Creative Studio del track genérico de Marketing Studio. | El track existente no tenía una fase ejecutable ni evidencia específica para proyectos creativos. | Se creó este track activo con Fase 1 y Fase 2 parcial. | Solicitud explícita del usuario |
| 2026-08-28 | Se incorporaron diez controles de capacidad y se abrió Fase 3 para Storage/assets. | Evitar crecimiento ilimitado, datos inline y divergencia entre caché y fuente autoritativa. | Se añaden bucket privado, metadatos, referencias, cuotas, dedupe y cleanup sin migración remota. | Solicitud explícita del usuario |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| No se ha autorizado una ejecución remota ni hay secretos disponibles. | No se puede certificar el esquema/RLS remoto. | Ejecutar el test SQL solo en Docker local o CI autorizado. | Plataforma | Abierto |
| Los tipos de base de datos se actualizan manualmente hasta regeneración autorizada. | Puede existir divergencia con el esquema remoto. | Regenerar tipos en CI tras aplicar la migración local/remota. | Plataforma | Abierto |
| El historial local de migraciones contiene versiones remotas ausentes en este checkout. | `supabase migration up --local` no puede reconciliarse automáticamente. | Se aplicó solo este SQL aditivo con `docker exec` al Postgres local; no se reparó el historial. | Plataforma | Abierto |
| El upload y cleanup de objetos Storage dependen de la disponibilidad del servicio local y de jobs autorizados. | Un fallo de Storage puede dejar basura física tras limpiar metadatos. | El cleanup SQL valida referencias; el repositorio elimina objetos solo para IDs borrados y deja el proceso reintentable. | Plataforma | Abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido en un entorno autorizado.
- [ ] Fase 1 certificada con tests de contratos, repositorio y RLS.
- [ ] Fase 2 no destructiva certificada; trabajo destructivo diferido explícitamente.
- [ ] Fase 3 certificada con Storage, límites, dedupe, cuotas y cleanup local.
- [ ] No se han alterado datos CRM existentes.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-27 | Contratos Creative Studio | PASS — 4 tests | `packages/contracts/src/marketing/__tests__/creative.test.ts` |
| 2026-08-27 | Repositorio Marketing en memoria | PASS — 9 tests | `apps/loopdev-os/src/services/marketing/repository.test.ts` |
| 2026-08-27 | RLS Supabase local | PASS — 10 pgTAP tests | `supabase/tests/database/005_creative_studio_rls.sql` |
| 2026-08-27 | Typecheck de `@loopdev/contracts` | PASS | `pnpm --filter @loopdev/contracts typecheck` |
| 2026-08-27 | Typecheck completo de `loopdev-os` | Bloqueado por error preexistente en `repository.test.ts:41` (`CreateMarketingCampaignInput`) | No relacionado con Creative Studio |
| 2026-08-28 | Contracts y repositorios Creative Studio | PASS — 21 tests focalizados | `packages/contracts/src/marketing/__tests__/creative-assets.test.ts`, `apps/loopdev-os/src/services/marketing/creative-assets-repository.test.ts`, `apps/loopdev-os/src/services/marketing/repository.test.ts` |
| 2026-08-28 | Gobernanza de migración Storage | PASS — validación específica; el chequeo global conserva hallazgos preexistentes | `scripts/validate-supabase-governance.mjs` |
| 2026-08-28 | Smoke RLS/controles en Docker local | PASS — tenancy, uso, thumbnail y anti-inline data | `supabase/migrations/20260827110000_marketing_creative_studio_storage.sql` |
| 2026-08-28 | pgTAP Storage/RLS | Bloqueado — la imagen local no tiene instalada la función `plan()` de pgTAP | `supabase/tests/database/006_creative_studio_storage_rls.sql` |

## Handoff de sesión

- **Fecha:** 2026-08-27.
- **Rama de continuación:** `feature/marketing-studio-creative-persistence`.
- **Commit de partida:** `c0305f11`.
- **Estado alcanzado:** Fase 1, tramo append-only de Fase 2 y código de Fase 3 implementados; falta validación local y commit.
- **Decisiones, bloqueos y riesgos:** Sin migraciones remotas ni secretos; pgTAP formal requiere una imagen local con la extensión instalada.
- **Validación ejecutada:** Contracts/repositories 21/21, gobernanza SQL específica, smoke RLS Docker PASS y typecheck/build de contracts PASS; typecheck completo bloqueado por dependencias frontend ausentes preexistentes.
- **Siguiente acción concreta:** Ejecutar contracts, tests de Marketing, gobernanza Supabase y pgTAP local; corregir cualquier fallo antes del commit.

## Cierre

Pendiente de aprobación explícita.
