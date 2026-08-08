# Track: CRM multi-tenant y comunicaciones de Estar Protegidos

**Fecha:** 2026-08-08  
**Estado:** Planificación aprobada — CRM Core + Insurance Pack  
**Prioridad:** Alta para entorno Dev  
**Organización objetivo:** Estar Protegidos  
**Marcas iniciales:** Vitablue y Protege tu Salud

## Objetivo

Convertir Sales CRM en un módulo persistente, multi-tenant y operativo para pequeñas y medianas empresas, empezando por Estar Protegidos. El primer producto combinará un CRM Core agnóstico al sector con un `Insurance Pack` desacoplado, preparado para recibir leads desde webs, campañas, WhatsApp y redes sociales sin mezclar organizaciones, marcas, workspaces ni conversaciones.

La interfaz actual sirve como referencia funcional, pero los datos demo y el contexto local no serán fuente de verdad. La fuente autoritativa será Supabase mediante servicios server-side, contratos compartidos y RLS.

## Principios

- Cada registro de negocio pertenece a una `organization_id`.
- Leads y oportunidades pueden asociarse a `brand_id` y `workspace_id`.
- Ningún secreto, token de proveedor o webhook sensible llega al navegador.
- Las comunicaciones se almacenan separando mensajes externos de notas internas.
- Las operaciones importantes generan auditoría.
- Los eventos externos son idempotentes.
- El CRM debe funcionar primero con datos manuales y después con WhatsApp.
- La POC de WhatsApp será inbound-first; no se activarán envíos masivos ni automatizaciones autónomas.

## Módulos funcionales del CRM

## Alcance de producto aprobado

### CRM Core — prioritario y agnóstico

El núcleo no conocerá pólizas, aseguradoras ni conceptos exclusivos de seguros. Sus entidades serán reutilizables por cualquier negocio:

- Contactos y empresas.
- Leads y fuentes de captación.
- Conversaciones omnicanal.
- Pipeline y oportunidades.
- Actividades, tareas y timeline.
- Equipos, asignación y permisos.
- Campañas, UTM y atribución básica.
- Auditoría y preferencias de comunicación.

### Insurance Pack — extensión vertical inicial

El paquete de seguros se construirá encima del CRM Core y tendrá sus propios contratos, tablas y permisos:

- Productos y planes.
- Aseguradoras.
- Coberturas y exclusiones.
- Reglas de elegibilidad.
- Cotizaciones versionadas.
- Relación entre lead, producto y cotización.
- Estado de cotización y siguiente acción.
- Onboarding posterior, inicialmente como fase separada.

El `Insurance Pack` no debe introducir campos de seguros en `crm_contacts`, `crm_leads` o `crm_conversations`. Se relacionará mediante `lead_id`, `contact_id`, `opportunity_id` y referencias de contexto.

### Canales de adquisición y conversación

WhatsApp, Instagram, Facebook Messenger y email se implementarán como adaptadores de comunicación. La bandeja trabajará con conversaciones y mensajes genéricos; cada proveedor aportará únicamente normalización, webhooks, credenciales y estados de entrega.

### 1. Suite Dashboard

- Resumen de leads nuevos, activos, estancados y ganados.
- Valor del pipeline y oportunidades próximas a cierre.
- Actividad pendiente del equipo.
- Conversaciones sin asignar y sin responder.
- Filtros por marca, workspace, agente, origen y periodo.

### 2. Contactos

- Ficha de persona o empresa.
- Nombre, teléfono E.164, email y datos básicos.
- Marcas y fuentes relacionadas.
- Búsqueda y filtros.
- Deduplicación por teléfono/email normalizado dentro de la organización.
- Historial de leads, oportunidades, actividades y conversaciones.

### 3. Leads

- Captación manual, web, campaña, referido, WhatsApp y otras fuentes.
- Asociación a contacto, marca, workspace, campaña y UTM.
- Estado: activo, inactivo o estancado.
- Etapas configurables del pipeline.
- Asignación a usuario.
- Conversión a oportunidad sin duplicar contacto.

### 4. Pipeline y oportunidades

- Vista kanban y listado.
- Etapas: lead, contacted, proposal, negotiation, won, lost, rejected y discarded.
- Importe, moneda, probabilidad y fecha prevista de cierre.
- Historial de cambios de etapa.
- Reglas de transición y permisos.
- Configuración por workspace, con valores iniciales seguros.

### 5. Actividades y timeline

- Notas internas.
- Llamadas.
- Emails.
- WhatsApp.
- Cambios de estado.
- Documentos y tareas.
- Actor, fecha, resumen, detalles y metadata validada.
- Timeline ordenado e inmutable para auditoría.

### 6. Tareas y seguimiento

- Crear, asignar, completar y cancelar tareas.
- Prioridad y fecha límite.
- Tareas vinculadas a leads, oportunidades o conversaciones.
- Bandeja personal del agente.
- Indicadores de tareas vencidas.

### 7. Bandeja de comunicaciones

- Conversaciones por contacto.
- Canales extensibles: WhatsApp, email y teléfono como mínimo conceptual.
- Estados de conversación: open, pending, closed y snoozed.
- Asignación de conversación.
- Etiquetas y prioridad.
- Mensajes externos separados de notas internas.
- Estado de entrega: sent, delivered, read y failed.

### 8. WhatsApp Business inbound POC

- Cuenta por organización y marca.
- Verificación de webhook.
- Validación de firma, cuenta y payload.
- Normalización de teléfono E.164.
- Idempotencia por identificador externo de evento y mensaje.
- Creación o actualización de contacto.
- Creación o actualización de conversación.
- Registro de mensajes de texto, imagen, documento, audio y ubicación.
- Captura de campaña, anuncio, referido y fuente cuando estén disponibles.
- Bandeja protegida en CRM.

### 9. Respuestas controladas

- Envío únicamente server-side.
- Verificación de permisos del agente.
- Respeto de ventana de atención y plantillas autorizadas.
- Registro de request, respuesta, estado y error sin guardar secretos.
- Reintentos controlados.
- Sin automatización autónoma en el MVP.

### 10. Captación y atribución

- Lead desde wizard público.
- Lead desde landing o formulario.
- Lead desde campaña de Marketing Studio.
- UTM, fuente, medium, campaign, content y term.
- Referidos y anuncios de WhatsApp.
- Idempotencia para evitar leads duplicados.

### 11. Cotizaciones y contexto comercial

- Acceso al resumen de cotización desde el lead.
- Historial de versiones de cotización.
- Producto, aseguradora, cobertura y estado.
- Separación con el futuro módulo de operaciones.
- No mezclar todavía datos clínicos o documentos sensibles.

### 12. Administración, permisos y auditoría

- Permisos de lectura, creación, edición, asignación, exportación y administración.
- RLS por organización.
- Restricción adicional por workspace cuando proceda.
- Registro de cambios sensibles.
- Exportaciones controladas y auditadas.
- Retención y borrado definidos antes de producción.

## Modelo persistente inicial

```text
crm_contacts
crm_leads
crm_opportunities
crm_pipeline_stages
crm_activities
crm_tasks
crm_notes
crm_audit_events

communications_accounts
communications_channels
communications_contacts
communications_conversations
communications_messages
communications_internal_notes
communications_webhook_events
communications_delivery_events
```

Todas las tablas nuevas tendrán como mínimo `organization_id`, timestamps y actor cuando aplique. Las entidades CRM tendrán `brand_id` y `workspace_id` cuando el dominio lo necesite. Los identificadores externos de proveedores tendrán constraints de unicidad dentro de su cuenta y organización.

## Entregas

### Fase 6A — CRM persistente mínimo

- [ ] Migración aditiva de contactos, leads, oportunidades, actividades y tareas.
- [ ] Contratos Zod de entidades, lecturas y comandos.
- [ ] Servicios server-side y APIs protegidas.
- [ ] RLS y permisos por organización/workspace.
- [ ] Sustituir fixtures del contexto CRM.
- [ ] Conectar dashboard, clientes, pipeline y detalle.
- [ ] Implementar asignación, timeline, notas y tareas.
- [ ] Tests de contratos, mappers, servicios y aislamiento.

### Fase 6A.1 — CRM Core de producto

- [ ] Consolidar entidades agnósticas y evitar dependencias del dominio de seguros.
- [ ] Implementar bandeja de conversaciones genérica.
- [ ] Preparar adaptador de WhatsApp inbound.
- [ ] Preparar contratos de canales sociales sin activar proveedores incompletos.
- [ ] Integrar campañas y atribución básica.

### Fase 6B — Captación y pipeline operativo

- [ ] Configuración de etapas por workspace.
- [ ] Deduplicación de contactos y leads.
- [ ] Integración con marcas, campañas, UTM y wizard.
- [ ] Auditoría de cambios de etapa y asignación.
- [ ] Búsqueda e índices.
- [ ] Playwright para crear lead, mover etapa y completar tarea.

### Fase 6C — Insurance Pack

- [ ] Crear contratos y migraciones de productos, aseguradoras y coberturas.
- [ ] Crear reglas de elegibilidad como servicio testeable.
- [ ] Crear cotizaciones versionadas relacionadas con oportunidades.
- [ ] Conectar el resumen de cotización al detalle del lead.
- [ ] Añadir permisos específicos del paquete.
- [ ] Preparar el handoff hacia Operations sin mezclar datos con el CRM Core.

### Fase 8A — WhatsApp inbound POC

- [ ] Contratos de payload externo normalizado.
- [ ] Cuenta y canal por organización/marca.
- [ ] Endpoint de verificación y webhook server-side.
- [ ] Validación de firma y deduplicación idempotente.
- [ ] Contacto, conversación y mensaje persistentes.
- [ ] Bandeja CRM con asignación y estado.
- [ ] Tests de eventos duplicados y aislamiento.

### Fase 8B — Respuesta controlada

- [ ] Servicio server-side de envío.
- [ ] Ventana de atención y plantillas.
- [ ] Estados de entrega y reintentos.
- [ ] Pruebas con texto y adjuntos.
- [ ] Observabilidad y manejo de errores.

## Fuera del MVP

- Automatizaciones autónomas.
- Generación LLM y agentes que envían mensajes sin aprobación.
- Campañas masivas de WhatsApp.
- Integración completa con todos los proveedores sociales.
- Operaciones de pólizas, renovaciones y emisión.
- Datos clínicos o sanitarios.

La emisión, renovaciones y operaciones completas pertenecen a una fase posterior. El primer `Insurance Pack` se limita a captación, elegibilidad, cotización y seguimiento comercial.

## Criterios de aceptación

- Un agente de Estar Protegidos puede crear y gestionar un lead persistente.
- Puede moverlo por el pipeline y consultar su timeline.
- Puede asignar tareas y registrar notas internas.
- Dos marcas de la misma organización no mezclan datos de atribución ni conversaciones.
- Una organización distinta no puede leer datos mediante la API directa.
- Un webhook duplicado no crea contactos, conversaciones ni mensajes duplicados.
- Un agente autorizado puede responder desde el CRM sin exponer credenciales.
- Todos los cambios relevantes quedan auditados.

## Siguiente acción

Crear la migración y los servicios de Fase 6A empezando por `crm_contacts`, `crm_leads`, `crm_activities` y `crm_tasks`, después conectar el pipeline actual antes de abordar WhatsApp.
