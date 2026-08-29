---
id: communications-core-crm-inbox-definition
title: Definición de Communications Core y CRM Communications Inbox
status: planned
created: 2026-08-29
updated: 2026-08-29
owner: crm
lead: null
branch: docs/communications-core-crm-inbox-definition
branches: []
phase: 0
pull_requests: []
issues: [156, 157, 158]
packages:
  - docs/06-product/communications/communications-core
  - docs/06-product/communications/crm-communications-inbox
release: not-required
areas: [crm, platform, documentation, governance, communications]
dependencies:
  - packages/contracts/src/communications/communications.ts
  - docs/03-platform/PLATFORM_SHELL_ZONE_CONTRACT.md
  - docs/03-platform/MULTI_TENANCY_STRATEGY.md
blocked_by: []
supersedes: []
---

# Definición de Communications Core y CRM Communications Inbox

## Outcome

Definir Communications Core como capacidad transversal de LoopDev y CRM Communications Inbox como su primer consumidor operativo. La definición producirá límites, UX, contratos, impacto, seguridad y handoff antes de ampliar la implementación existente de WhatsApp Cloud.

## Contexto

LoopDev ya tiene contratos iniciales, persistencia con RLS y un webhook de WhatsApp Cloud. El roadmap clasifica Communications como capacidad cross-suite con owner transitorio `crm`; CRM no es su propietario arquitectónico. Chatwoot se usa como evidencia de patrones de producto e inbox, no como arquitectura o implementación que deba copiarse.

## Alcance

### Incluido

- Definición transversal de cuentas, canales, conversaciones, mensajes, plantillas, delivery, webhooks, idempotencia, reintentos, consentimiento, auditoría y contratos públicos.
- Paquete de definición de `communications-core`.
- Paquete de definición de `crm-communications-inbox` con WhatsApp Cloud como primer canal real.
- Revisión del contrato, esquema, RLS y webhook existentes como evidencia, no como autorización automática de nuevas capacidades.

### Excluido

- Declarar una suite independiente de Communications o alterar el portfolio sin decisión aprobada.
- Activar Email, SMS, Instagram, Facebook Messenger, Telegram, campañas o automatización.
- Reimplementar Chatwoot, reutilizar su código o copiar su lenguaje visual.
- Activar multimedia, colas o nuevos proveedores sin sus gates.
- Código de producto, rutas, migraciones o cambios de RLS durante esta fase documental.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-29 | Communications Core se documenta como capacidad cross-suite bajo owner transitorio `crm`; CRM Communications Inbox será su primer consumidor. | Evita duplicar proveedores, credenciales, webhooks y políticas sensibles entre suites. | Se separan los paquetes de Core e Inbox; no se crea una suite nueva. | Usuario |
| 2026-08-29 | WhatsApp Cloud será el único adaptador real de la primera entrega, sobre un modelo de conversación channel-aware. | Ya hay evidencia de webhook y persistencia; otros canales no tienen proveedor ni operación aprobados. | El contrato conserva extensibilidad, pero el alcance funcional queda limitado a WhatsApp. | Usuario |
| 2026-08-29 | Chatwoot se usa como referencia de patrones de inbox, colaboración y operación, no como arquitectura ni implementación base. | LoopDev debe conservar Platform Shell, FSD, contratos TypeScript, Supabase y RLS por organización. | La UX adopta patrones verificables sin copiar código ni diseño. | Usuario |
| 2026-08-29 | Aprobar la matriz inicial: Agent opera conversaciones asignadas y puede asignarse; Manager opera y reasigna dentro de workspaces autorizados; Viewer es solo lectura; Org admin configura cuentas fuera de la inbox. | Separa operación cotidiana, supervisión y administración de proveedor. | El contrato divide permisos de lectura, respuesta, asignación, lifecycle y configuración. | Usuario |
| 2026-08-29 | Separar consentimiento conversacional, transaccional y de marketing; un inbound no concede opt-in de marketing. | La respuesta contextual no autoriza campañas ni contactos proactivos. | Texto libre solo dentro de ventana WhatsApp; marketing y proactivo requieren consentimiento explícito y propósito. | Usuario |
| 2026-08-29 | Para un número WhatsApp desconocido, crear o vincular un contacto mínimo con identidad pendiente de revisión. | Se conserva el inbound sin afirmar identidad o crear atribución comercial no verificada. | No crea lead, oportunidad, asignación comercial ni consentimiento de marketing automáticamente. | Usuario |
| 2026-08-29 | Usar Meta Embedded Signup como onboarding estándar por organización; limitar la configuración manual a soporte, migración o casos técnicos aprobados. | Reduce errores de configuración y mantiene el ciclo de credenciales, webhook y número bajo control administrativo. | Org admin inicia conexión guiada; tokens, WABA y Phone Number ID siguen server-side y la reconexión se expone como estado operativo. | Usuario |
| 2026-08-29 | La primera implementación integra WhatsApp de extremo a extremo en CRM: inbound, inbox, outbound, delivery y gestión de plantillas. | El objetivo operativo es centralizar la relación WhatsApp del CRM, no validar solo lectura. | Plantillas entran en el primer vertical; contenido, aprobación, sincronización, envío, ventana de 24 horas, consentimiento, reintentos y observabilidad deben cumplir sus gates antes de rollout. | Usuario |
| 2026-08-29 | Retener mensajes y notas durante 24 meses desde la última actividad; retener delivery y auditoría 36 meses sin cuerpo de mensaje; no ofrecer borrado manual inicial. | Preserva continuidad comercial y evidencia operativa sin retención ilimitada ni acciones destructivas tempranas. | Purga server-side, trazable, idempotente y con dry-run; legal hold queda diferido. | Usuario |
| 2026-08-29 | Activar WhatsApp por fases: Dev, piloto interno de una organización, inbound, outbound dentro de ventana, plantillas y disponibilidad general. | Aísla riesgo de proveedor y permite medir controles antes de ampliar el acceso. | Cada fase exige evidencia de seguridad, operación y experiencia antes de avanzar. | Usuario |
| 2026-08-29 | Exigir kill switch server-side por organización y cuenta. | Debe ser posible detener envíos ante una incidencia sin destruir evidencia ni bloquear lectura. | Desactiva outbound y reintentos; mantiene inbox de lectura, auditoría y delivery history. | Usuario |
| 2026-08-29 | Limitar el primer rollout productivo a una organización design partner y usuarios autorizados. | Reduce blast radius durante la validación de inbox y proveedores. | La expansión requiere métricas, evidencia de gates y aprobación posterior. | Usuario |
| 2026-08-29 | CRM crea o vincula contactos mínimos de números inbound desconocidos mediante comando público; Communications solo procesa y referencia el resultado. | Mantiene la propiedad y deduplicación de contactos dentro de CRM. | Core no escribe tablas CRM directamente; falla de CRM deja el evento recuperable y auditado. | Usuario |
| 2026-08-29 | Cualquier actualización autorizada de una conversación reinicia el plazo de retención de 24 meses. | Conserva contexto activo de conversaciones con notas, asignaciones o cambios de estado recientes. | El modelo debe mantener una marca de última actividad de conversación separada de timestamps técnicos. | Usuario |
| 2026-08-29 | Webhooks, delivery, retries y purga escriben a través de un worker server-side con rol de servicio limitado. | Las mutaciones no humanas no deben depender de permisos de navegador ni de `communications.send`. | El rol tiene permisos mínimos, organización resuelta por cuenta/evento y auditoría; no se expone al cliente. | Usuario |
| 2026-08-29 | Las conversaciones inbound nuevas quedan sin asignar. | Evita routing implícito antes de definir equipos y reglas de capacidad. | Agent elegible se autoasigna; Manager asigna o reasigna dentro del workspace autorizado. | Usuario |
| 2026-08-29 | Aprobar los paquetes de Communications Core y CRM Communications Inbox. | Las fronteras, contratos, seguridad, operación y handoffs fueron revisados con sus decisiones de diseño registradas. | Los paquetes pasan a `approved`; la implementación requiere confirmación de readiness en cada Issue y una rama dedicada desde `develop`. | Usuario |

## Arquitectura y contratos

Communications Core normaliza proveedores server-side y expone contratos públicos. Las suites no almacenan secretos ni escriben tablas internas del Core. CRM conserva contactos, leads, oportunidades, actividades y consentimiento comercial; el Inbox consume esas referencias autorizadas.

La experiencia usa `AppShell -> SuiteRuntime -> SuiteCanvas`. CRM Communications Inbox declara `SplitWorkspace`: lista y filtros de conversaciones en `ModuleContextSidebar`, hilo y compositor en `SuiteCanvas`, y contexto CRM del contacto en `ModuleContextPanel`. No crea shell, sidebar ni gestor de overlays paralelos.

## Branch strategy

La definición se realiza en `docs/communications-core-crm-inbox-definition` desde `develop`. La documentación de producto vive en `docs/06-product/communications/`; este track conserva alcance, decisiones, fases y evidencia. Una futura implementación parte de `develop` en ramas separadas y solo después de aprobación explícita.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Crear la definición transversal y los dos paquetes de cinco documentos, con el estado `proposed` y decisiones pendientes explícitas.

**Definition of Ready**
- [x] Owner transitorio y frontera cross-suite identificados.
- [x] Evidencia de contrato, RLS, webhook y patrones de producto revisada.
- [x] Issue padre #156 y Issues de delivery #157 y #158 creados.
- [x] Paquetes de `communications-core` y `crm-communications-inbox` completos.
- [x] Retención, kill switch y rollout de mensajes/plantillas resueltos; legal hold diferido explícitamente.

**Entregables**
- [x] Definición transversal en `docs/06-product/communications/`.
- [x] Paquete de `communications-core`.
- [x] Paquete de `crm-communications-inbox`.
- [x] Revisión de registry y evidencia de gaps.

**Validación**
- [x] Enlaces Markdown, validador de tracks, índice generado y revisión cruzada.

**Evidencia:** Paquetes aprobados por User el 2026-08-29; Issues #157 y #158 quedan preparados para confirmar readiness antes de implementación.

**Estado:** completada

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Confundir el owner transitorio de CRM con propiedad arquitectónica de Communications. | Duplicación de canales y reglas entre suites. | Mantener Core e Inbox como módulos separados y documentar consumidores por contrato. | crm/platform | abierto |
| Habilitar outbound sin consentimiento, ventana de proveedor o templates aprobados. | Incumplimiento operativo y mensajes no autorizados. | Definir policy enforcement y no-go antes de implementación. | crm/platform | abierto |
| Reutilizar patrones de Chatwoot sin adaptarlos al Shell y tenancy de LoopDev. | UI paralela o fuga de datos. | Tratar Chatwoot como evidencia y aplicar contratos de Platform Shell y RLS. | crm/platform | abierto |
| Estado real de Meta, WABA y onboarding multi-organización no confirmado. | La integración no puede activarse de forma segura. | Mantenerlo como dependencia explícita del handoff. | crm | abierto |
| Contacto mínimo inbound puede crear datos insuficientes o duplicados. | Identidad comercial incorrecta o contaminación operativa. | Marcar identidad pendiente, no crear lead/consentimiento y aplicar deduplicación CRM por E.164. | crm | abierto |
| Activar plantillas sin sincronización, estado de aprobación o enforcement de ventana. | Mensajes no autorizados o rechazo del proveedor. | Gestionar lifecycle de plantilla, validar estado y bloquear texto libre fuera de ventana antes de dispatch. | crm/platform | abierto |

## Criterios de cierre

- [x] Definición transversal y ambos paquetes están completos, coherentes y aprobados.
- [x] Issues, dependencias, riesgos y decisiones pendientes están enlazados.
- [x] Validaciones documentales y de tracks tienen evidencia.
- [x] La definición recibió aprobación explícita del usuario antes de implementación.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-29 | `node scripts/tracks/validate-tracks.mjs` | Pasó tras crear el track. | Validación local |
| 2026-08-29 | `pnpm docs:links:check` | Pasó con los documentos transversales y los dos paquetes. | 319 archivos escaneados |
| 2026-08-29 | Issues de definición | Creados. | #156, #157 y #158 |
| 2026-08-29 | `pnpm registries:check` | Pasó tras regenerar el catálogo. | `communications-contracts` y `whatsapp-webhook` continúan como entradas canónicas; no se añadió una suite nueva. |
| 2026-08-29 | `pnpm docs:inventory:check` | Pasó. | Inventario documental generado y actualizado. |
| 2026-08-29 | `git diff --check` | Pasó. | Integridad de whitespace del cambio documental. |
| 2026-08-29 | Validación tras decisiones de producto | Links, track y diff pasaron tras alinear permisos, consentimiento, inbound, onboarding, retención, rollout y kill switch. | Validación local |
| 2026-08-29 | Aprobación de definición | Paquetes Communications Core y CRM Communications Inbox aprobados por User. | Issues #156, #157 y #158 |

## Handoff de sesión

- **Fecha:** 2026-08-29.
- **Rama de continuación:** `docs/communications-core-crm-inbox-definition`.
- **Commit de partida:** `f53383b`.
- **Estado alcanzado:** Definición transversal y paquetes aprobados; el track permanece planned hasta que cada Issue confirme readiness de implementación.
- **Decisiones, bloqueos y riesgos:** Core cross-suite, Inbox CRM primer consumidor, WhatsApp Cloud completo, permisos, consentimiento, contacto inbound, onboarding Meta, retención, rollout y kill switch aprobados; legal hold, media y expansión post-piloto diferidos.
- **Validación ejecutada:** Track validator y Markdown links pasaron.
- **Siguiente acción concreta:** Confirmar Definition of Ready en #157 antes de crear `feature/communications-core-implementation` desde updated `develop`.

## Cierre

Pendiente de aprobación explícita.