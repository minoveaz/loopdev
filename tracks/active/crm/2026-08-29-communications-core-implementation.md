---
id: communications-core-implementation
title: Implementación de Communications Core para WhatsApp CRM
status: active
created: 2026-08-29
updated: 2026-08-29
owner: crm
lead: null
branch: feature/communications-core-implementation
branches: []
phase: 0
pull_requests: []
issues: [157]
packages:
  - docs/06-product/communications/communications-core
  - docs/06-product/communications/crm-communications-inbox
release: not-required
areas: [crm, platform, communications, contracts, supabase, security]
dependencies:
  - docs/06-product/communications/communications-core/COMMUNICATIONS_CORE_CONTRACT.md
  - docs/06-product/communications/communications-core/COMMUNICATIONS_CORE_IMPACT_ASSESSMENT.md
  - packages/contracts/src/communications/communications.ts
  - supabase/functions/loopdev-whatsapp-webhook/index.ts
blocked_by: []
supersedes: []
---

# Implementación de Communications Core para WhatsApp CRM

## Outcome

Implementar la fundación aprobada de Communications Core para WhatsApp Cloud sin construir aún la UI de CRM Communications Inbox. La entrega habilita contratos, seguridad, operaciones server-side, eventos, plantillas, delivery, retención y controles necesarios para que #158 consuma una API pública estable.

## Contexto

La definición aprobada en PR #159 separa Communications Core de CRM Communications Inbox. Estar Protegidos es el design partner inicial: una sola organización con varias marcas y usuarios autorizados. `organization_id` es el límite de aislamiento; `brand_id` es contexto opcional y no amplía acceso.

La POC existente sirve como evidencia de Meta Cloud, webhook firmado, normalización E.164 e idempotencia. Sus tablas y atajos no son el modelo canónico. Los valores reales de WABA, Phone Number ID, secretos y usuarios piloto se difieren hasta el gate de activación y no deben entrar en Git, contratos, fixtures ni logs.

## Alcance

### Incluido

- Contrato público y errores normalizados de Communications Core.
- Adaptador `MessagingProvider` para WhatsApp Cloud y límites de proveedor server-side.
- Webhook firmado, deduplicación, eventos de delivery y resolución de contacto CRM mediante comando público.
- Cuentas, onboarding Embedded Signup, reconexión y lifecycle de plantillas.
- Texto dentro de ventana, plantillas aprobadas fuera de ventana, idempotencia y estados de envío.
- Worker de privilegio limitado para delivery, retries y purga.
- Retención, kill switch por organización/cuenta, observabilidad y pruebas de aislamiento.

### Excluido

- UI de CRM Communications Inbox, rutas y composición visual de #158.
- Otros canales, media/attachments, llamadas, IA, campañas, automatización, SLA y routing automático.
- WABA productivo, secretos reales o usuarios del piloto hasta el gate de activación.
- Migrar o extender tablas legacy de la POC como modelo canónico.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-29 | Estar Protegidos es el design partner inicial, limitado a una organización multi-marca. | Validar el caso real sin ampliar el blast radius. | Las pruebas incluyen aislamiento entre organizaciones y contexto de marca dentro de una organización. | Usuario |
| 2026-08-29 | WABA, Phone Number ID, secretos y usuarios piloto se difieren al gate de activación. | No bloquean el desarrollo local ni deben aparecer en el repositorio. | La implementación usa mocks, fixtures redacted y sandbox; ningún rollout real puede comenzar sin esta configuración. | Usuario |
| 2026-08-29 | Communications no escribe tablas CRM directamente; CRM resuelve contactos inbound mediante comando público. | Conserva ownership y deduplicación CRM. | Se requiere contrato de aplicación y procesamiento recuperable ante fallos de CRM. | Usuario |
| 2026-08-29 | El worker server-side usa privilegios mínimos para webhooks, delivery, retries y purga. | Las mutaciones no humanas no dependen de permisos de navegador. | El worker es auditado, organization-scoped y nunca expuesto al cliente. | Usuario |
| 2026-08-29 | Conservar `loopdev-whatsapp-webhook` como la única entrada pública canónica de WhatsApp Cloud. | Es el endpoint registrado y el único con evidencia documentada de WABA Sandbox, verificación GET y POST firmado. | La ruta Next duplicada se depreca y se retira o convierte en adaptador interno solo tras pruebas de equivalencia, firma, deduplicación y aislamiento. | Usuario |
| 2026-08-29 | Representar el Manager inicial de Communications mediante los roles Platform existentes `owner` y `admin`. | Platform Core no tiene un rol global `manager`; añadirlo extendería membresías y consumidores fuera de #157. | `owner` y `admin` pueden reasignar; `agent` opera y se autoasigna; `viewer` conserva solo lectura. | Usuario |
| 2026-08-29 | Usar `communications.manage-accounts` como key canónica de administración. | El catálogo Platform permite guiones y no guiones bajos en permission keys. | Contrato y documentación se alinean con la migración; no cambia la semántica aprobada. | Corrección técnica respaldada por el contrato Platform |

## Arquitectura y contratos

El flujo canónico es `provider webhook -> verify/normalize -> Communications application service -> CRM public contact command -> communications persistence and outbox -> limited worker -> provider adapter`. Los Route Handlers y Edge Functions verifican entrada y delegan; el worker realiza trabajo durable. Ninguna UI, webhook o adaptador accede a repositorios internos de otro módulo.

## Fases

### Fase 0: Auditoría y readiness técnico

**Objetivo:** Establecer la línea base de POC, contratos, migraciones, RLS, webhooks, rutas y validación antes de editar comportamiento.

**Definition of Ready**
- [x] Paquetes aprobados y Issue #157 disponible.
- [x] Rama `feature/communications-core-implementation` creada desde `develop` actualizado.
- [x] Design partner y modelo multi-marca definidos.
- [x] Auditoría de consumidores y de POC registrada.
- [x] Compatibilidad legacy registrada: `communication_*` es canónico; `communications_*` y `communication_entity_links` permanecen solo como recuperación, sin nuevas rutas ni funcionalidades en #157.
- [x] Plan de validación por fase registrado.
- [x] Seleccionado `loopdev-whatsapp-webhook` como endpoint canónico; ruta Next pendiente de deprecación verificada.

**Entregables**
- [x] Inventario de superficies existentes y brechas contra el contrato aprobado.
- [x] Decisión de compatibilidad de POC y límites de legacy.
- [x] Backlog ordenado por contrato, seguridad, adapter, worker y operación.

**Validación**
- [x] `pnpm validate:plan`.
- [x] Pruebas existentes de contratos y webhook identificadas y ejecutadas.
- [ ] `git diff --check` al cerrar Fase 0.

**Evidencia:** `pnpm validate:plan` no seleccionó protecciones porque aún no había cambios rastreados. Las 13 pruebas focalizadas existentes de contrato, firma, parser y adaptador pasaron. El Edge Function consta como activo en el registry y como endpoint validado con WABA Sandbox, GET y POST firmado en el track CRM histórico. Inventario y brechas se registran en esta fase.

**Estado:** completada

#### Inventario y brechas verificadas

| Superficie | Estado actual | Brecha contra el contrato aprobado | Backlog |
| --- | --- | --- | --- |
| `packages/contracts/src/communications/communications.ts` | Contratos básicos de cuentas, templates, conversaciones, mensajes y comandos. | Conversación no expone `accountId`, `channelId` ni `lastActivityAt`; faltan contrato de kill switch, actor/asignación y lifecycle operacional de templates. | Fase 1 |
| `apps/loopdev-os/src/services/communications/core.ts` | Servicios CRUD, envío de texto, status y programación de retry. | Usa token global, no implementa `MessagingProvider`, no hay contacto CRM por comando público, kill switch, template dispatch ni worker durable. | Fases 1, 3 y 4 |
| Rutas `/api/communications/*` | Conversación, mensaje, nota, status y retry autorizados por `communications.send`. | Status y retry de provider se exponen como acciones de usuario; envelopes/errores no siguen el contrato final. | Fases 1 y 3 |
| `/api/webhooks/whatsapp` y Edge Function `loopdev-whatsapp-webhook` | Dos entradas activas, ambas verifican firma y escriben datos canónicos con privilegios de servicio. | Duplican comportamiento y ambas escriben `crm_contacts` directamente. | Edge Function canónico; deprecar la ruta Next tras equivalencia, Fase 1 |
| `communication_*` | Modelo canónico con `organization_id`, RLS y FKs compuestas. | Falta `last_activity_at`, account kill switch, retención/purge y assignment history; RLS agrupa toda escritura bajo `communications.send`, incluido delete. | Fases 1 y 4 |
| `communications_*`, `communication_entity_links` y recovery schema | Modelo POC legacy basado en `workspace_id`; no hay consumidores de aplicación fuente. | No cumple ownership canónico ni aislamiento requerido. | Retener solo recuperación; migración/archivo en track posterior |
| Pruebas | 13 tests focalizados cubren schemas, HMAC, parser y envío de texto. | No existen pruebas de rutas, webhook end-to-end, RLS Communications, dos organizaciones, templates, worker, purge o kill switch. | Fases 1 a 5 |

#### Plan de compatibilidad legacy

- `communication_accounts`, `communication_channels`, `communication_conversations`, `communication_messages` y sus tablas relacionadas son el único destino de nuevas capacidades.
- `communications_*` y `communication_entity_links` quedan sin nuevas rutas, escrituras, contratos o consumidores durante #157; sus recovery snapshots se conservan como evidencia histórica.
- La eliminación, archivo de datos o migración de legacy requiere un track posterior con inventario de datos, plan reversible, aprobación explícita y pruebas de aislamiento. No forma parte de este Issue.
- Los tipos generados que aún reflejan legacy no autorizan consumo nuevo; se actualizarán únicamente cuando exista una migración aprobada de esquema/tipos.
- `loopdev-whatsapp-webhook` permanece como única URL pública configurada en Meta. La ruta Next `/api/webhooks/whatsapp` no recibe configuración nueva y solo se elimina o convierte tras evidencia de equivalencia y rollback.

#### Plan de validación por fase

| Fase | Riesgo principal | Validación mínima |
| --- | --- | --- |
| 1 | Contratos, authorization y ownership CRM | Tests de contratos y consumidores, `pnpm contracts:ownership:check`, RLS/isolation tests y `pnpm validate:changed`. |
| 2 | Secretos, onboarding y lifecycle de templates | Tests de adapter/cuenta/template, revisión de secretos y `pnpm validate:domain -- packages`. |
| 3 | Inbound, outbound, ventana y delivery | Tests de webhook firmado, duplicados, contactos, policy y errores de provider; `pnpm validate:changed`. |
| 4 | Worker, purge, retry y kill switch | Tests de least privilege, retry, purge dry-run y pause por organización/cuenta; `pnpm validate:full` si cambia infraestructura compartida. |
| 5 | Activación de partner | Entorno protegido, dos organizaciones, validación de rollout y revisión de seguridad. |

#### Entrega preparada para entorno con Docker/Supabase

1. Ejecutar `pnpm exec supabase db reset` desde la raíz para aplicar todas las migraciones, incluida `20260907000000_communications_phase1_authorization.sql`.
2. Ejecutar la suite pgTAP que descubre `supabase/tests/database/007_communications_core_security.sql` y confirmar los 18 asserts: permisos, privilegio service role, resolución CRM y aislamiento entre organizaciones.
3. Regenerar `apps/loopdev-os/src/types/database.types.ts` mediante el comando oficial de tipos Supabase del entorno para incorporar `identity_status`, `outbound_enabled`, `last_activity_at` y la RPC.
4. Ejecutar `pnpm validate:changed`, las pruebas focalizadas de Communications y la revisión de seguridad antes de marcar Fase 1 completada.

#### Validación diferida por entorno

Docker Desktop y Podman no están disponibles en este equipo, por lo que `pnpm exec supabase db reset`, `supabase status` y la ejecución pgTAP no son posibles. La migración `20260907000000_communications_phase1_authorization.sql` y `supabase/tests/database/007_communications_core_security.sql` quedan preparados para ejecutarse en un equipo con Docker/Supabase antes de aprobar la Fase 1. Los checks disponibles de contratos, lint y gobernanza Supabase se ejecutan localmente en esta rama.

#### Backlog inicial ordenado

1. Definir contratos públicos y separar permisos de lectura, envío, notas, asignación, lifecycle y administración; añadir `accountId`, `channelId`, `lastActivityAt` y kill switch.
2. Extraer `MessagingProvider` y el comando público CRM de resolución inbound; hacer que Edge Function delegue sin escribir CRM directamente.
3. Deprecar las rutas de mutación de provider (`PATCH` status y `PUT` retry) y moverlas al worker limitado; retirar o convertir el webhook Next después de equivalencia.
4. Añadir migraciones canónicas para lifecycle de cuenta/template, assignment history, `last_activity_at`, kill switch, retención/purga y permisos RLS por operación.
5. Cubrir contratos, RLS de Communications, dos organizaciones, webhook end-to-end, templates, worker, purge y kill switch antes de activar Estar Protegidos.

### Fase 1: Contratos, autorización y contacto CRM

**Objetivo:** Alinear contratos, permisos y el comando público CRM sin acceso cross-module directo.

**Definition of Ready**
- [x] Fase 0 revisada.

**Entregables**
- [x] Contratos para cuenta, canal, conversación, `lastActivityAt`, templates, kill switch y errores.
- [x] Puerto `MessagingProvider` y contrato público CRM de resolución inbound.
- [x] Permisos por acción y prueba pgTAP preparada de aislamiento de dos organizaciones.
- [x] Edge Function delega la resolución inbound al RPC CRM y deja de escribir `crm_contacts` directamente.
- [x] Rutas humanas usan permisos granulares; creación genérica, status y retry quedan fuera del API público.

**Validación**
- [x] Tests de contrato y consumidores disponibles en este entorno.
- [x] Lint focalizado y gobernanza estática de Supabase.
- [ ] Aplicar `20260907000000_communications_phase1_authorization.sql` y ejecutar `007_communications_core_security.sql` con Docker/Supabase.

**Evidencia:** 21 tests TypeScript focalizados, typecheck de `@loopdev/contracts`, lint focalizado y `pnpm test:supabase-governance` pasaron. Docker/Podman no están disponibles en este equipo, por lo que el reset local y pgTAP quedan pendientes.

**Estado:** implementación preparada; validación de base de datos bloqueada por entorno

### Fase 2: Cuentas, onboarding y plantillas

**Objetivo:** Implementar lifecycle de cuenta Meta, Embedded Signup, reconexión y templates sin secretos de cliente.

**Definition of Ready**
- [ ] Fase 1 validada.

**Entregables**
- [ ] Account health y onboarding server-side.
- [ ] Sincronización y lifecycle de templates.
- [ ] Validación de cuenta, organización, marca y parámetros.

**Validación**
- [ ] Tests de adapter y estados de cuenta/template.
- [ ] Revisión de secretos y auditoría.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Inbound, outbound y delivery

**Objetivo:** Completar el flujo WhatsApp con webhook, contacto CRM, ventana de 24 horas, texto, templates y estados de entrega.

**Definition of Ready**
- [ ] Fase 2 validada.

**Entregables**
- [ ] Webhook y eventos idempotentes.
- [ ] Conversaciones inbound abiertas y sin asignación.
- [ ] Dispatch de texto y templates con enforcement de policy.
- [ ] Delivery states normalizados y auditables.

**Validación**
- [ ] Tests signed webhook, duplicados, CRM resolution, ventana, template y delivery.
- [ ] Pruebas de aislamiento y errores de proveedor.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 4: Worker, retención y controles operativos

**Objetivo:** Añadir trabajo durable y controles de recuperación sin ampliar canales.

**Definition of Ready**
- [ ] Fase 3 validada.

**Entregables**
- [ ] Worker least-privilege y reintentos acotados.
- [ ] Kill switch por organización/cuenta.
- [ ] Retención, purge dry-run y auditoría.
- [ ] Métricas de salud, trazas y runbook de rollback.

**Validación**
- [ ] Tests de worker, retry, purge y kill switch.
- [ ] Validación de observabilidad sin cuerpos ni secretos.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 5: Gate de activación y handoff Inbox

**Objetivo:** Preparar el piloto Estar Protegidos y entregar contratos estables a #158.

**Definition of Ready**
- [ ] Fase 4 validada.
- [ ] WABA, Phone Number ID, secretos server-side y usuarios piloto confirmados fuera de Git.

**Entregables**
- [ ] Evidencia de piloto por fases y rollback probado.
- [ ] Handoff de contratos/read models a #158.
- [ ] Criterios de expansión post-piloto y riesgos residuales.

**Validación**
- [ ] Validación de entorno protegido y rollout por fases.
- [ ] Revisión de seguridad y evidencia de piloto.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Los artefactos legacy de POC podrían inducir accesos o ownership incorrectos. | Alto | Auditar antes de cambiar y mantener legacy fuera de los nuevos flujos. | crm | abierto |
| Meta/WABA real y usuarios piloto aún no están configurados. | El piloto no puede activarse. | Tratarlo como gate de Fase 5; usar mocks/sandbox antes. | crm | abierto |
| Un worker de servicio podría evadir aislamiento. | Alto | Privilegios mínimos, scope por cuenta/evento, auditoría y tests negativos. | platform/crm | abierto |
| Templates o replies fuera de ventana pueden incumplir policy de Meta. | Alto | Enforcement server-side, estados normalizados y pruebas de provider. | crm | abierto |

## Criterios de cierre

- [ ] Todas las fases requeridas tienen evidencia y aceptación registrada.
- [ ] Dos organizaciones no pueden cruzar mensajes, cuentas, templates ni delivery events.
- [ ] El piloto de Estar Protegidos completó los gates aprobados o el trabajo residual fue diferido explícitamente.
- [ ] #158 recibe un handoff de contratos/read models estable.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-29 | `pnpm validate:plan` | Pasó; sin cambios rastreados al inicio de Fase 0. | Validación local |
| 2026-08-29 | Tests focalizados de contrato, firma, parser y adaptador | Pasaron 21 tests. | `packages/contracts` y `apps/loopdev-os/src/services/communications` |
| 2026-08-29 | Typecheck y lint focalizados | Pasaron. | `@loopdev/contracts` y rutas Communications |
| 2026-08-29 | `pnpm test:supabase-governance` | Pasó. | Gobernanza estática de migraciones |
| 2026-08-29 | Reset local y pgTAP | Bloqueados. | Docker Desktop/Podman no están disponibles en este equipo |

## Handoff de sesión

- **Fecha:** 2026-08-29.
- **Rama de continuación:** `feature/communications-core-implementation`.
- **Commit de partida:** `61a81ad`.
- **Estado alcanzado:** Fase 0 completada; Fase 1 implementada en código, migración y pgTAP preparados, pendiente de runtime Docker/Supabase.
- **Decisiones, bloqueos y riesgos:** Estar Protegidos es el piloto multi-marca; WABA, secretos y usuarios reales se difieren a activación; POC es evidencia; Edge Function es la entrada pública canónica y la ruta Next se depreca después de equivalencia. La migración no puede validarse localmente sin Docker/Podman.
- **Validación ejecutada:** 21 tests focalizados, typecheck de contratos, lint de rutas, gobernanza Supabase, branch-base, track y diff pasaron. `supabase db reset` y pgTAP están pendientes por entorno.
- **Siguiente acción concreta:** En un equipo con Docker/Supabase, ejecutar el procedimiento de entrega preparado, regenerar tipos y cerrar Fase 1 solo si la migración y pgTAP pasan.

## Cierre

Pendiente de aprobación explícita.