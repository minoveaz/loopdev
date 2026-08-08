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

### Distinción de dominio: contacto, empresa, lead y oportunidad

Estas entidades no se combinan ni se duplican:

- **Contacto:** persona persistente que conocemos. Puede existir sin una oportunidad activa.
- **Empresa:** cuenta o entidad jurídica relacionada con uno o varios contactos. En B2C el contacto puede funcionar sin empresa.
- **Lead:** intención comercial concreta, originada por una fuente, campaña, producto o conversación. Siempre referencia a un contacto y puede asociarse a una marca y workspace.
- **Oportunidad:** proceso comercial cualificado derivado de un lead, con etapa, importe, probabilidad y fecha prevista de cierre.

El flujo canónico es:

```text
Contacto/Empresa → Lead → Oportunidad → Cliente/operación
```

Un nuevo contacto procedente de una campaña de Facebook crea un contacto y un lead asociado. Si la misma persona vuelve por WhatsApp para otro producto, se reutiliza el contacto y se crea un nuevo lead cuando representa una intención distinta:

```text
Ana García
  ├── Lead: seguro de salud — Facebook — ganado
  └── Lead: seguro de vida — WhatsApp — nuevo
```

El CRM no creará un contacto duplicado por cada campaña o conversación. La deduplicación buscará primero teléfono normalizado en formato E.164 y después email normalizado, siempre dentro de la misma organización.

Modelo relacional inicial:

```text
crm_contacts
crm_companies
crm_contact_companies
crm_related_people
crm_leads
crm_opportunities
```

Un contacto podrá tener muchos leads; un lead podrá tener cero o varias oportunidades según el proceso comercial. Las conversaciones y actividades se vincularán al contacto y, cuando exista contexto comercial, también al lead u oportunidad.

### Relaciones familiares y roles aseguradores

El CRM debe distinguir entre una persona relacionada con un cliente y un contacto autorizado para comunicación. No toda persona que aparece en una familia, póliza o expediente debe convertirse automáticamente en contacto.

- **Contacto comunicable:** persona con datos de contacto y consentimiento o base válida para ser contactada.
- **Persona relacionada:** miembro de la familia registrado como contexto, sin permiso de contacto.
- **Tomador:** persona o entidad que contrata y asume las obligaciones de la póliza.
- **Asegurado:** persona protegida por la póliza; puede ser el tomador o una persona relacionada.
- **Beneficiario:** persona con derecho derivado de la póliza, sin que ello implique permiso de contacto.

Una persona relacionada solo se promoverá a `crm_contacts` cuando exista consentimiento explícito, una solicitud directa o una base legal documentada. No se enviarán mensajes a alguien únicamente por aparecer en una póliza.

### Customer Workspace / Customer 360

El CRM tendrá un espacio de cliente que agregará perfil, familia y relaciones, leads, oportunidades, conversaciones, actividades, tareas, documentos, cotizaciones, campañas, consentimiento y auditoría. No convertirá automáticamente personas relacionadas en contactos ni expondrá datos sensibles sin permisos.

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

### Decisión transversal: Communications Core

El envío de correo y mensajería no será una funcionalidad exclusiva del CRM. LoopDev tendrá un módulo transversal `Communications Core` reutilizable por todas las suites.

```text
Communications Core
  ├── Email
  ├── WhatsApp
  ├── Instagram / Facebook Messenger
  ├── Proveedores y credenciales seguras
  ├── Webhooks y estados de entrega
  ├── Reintentos e idempotencia
  ├── Plantillas
  ├── Consentimiento y preferencias
  └── Auditoría
```

Las superficies de producto consumirán este núcleo según su caso de uso:

- **CRM Inbox:** conversaciones individuales, seguimiento y respuestas de agentes.
- **Marketing Studio:** campañas segmentadas, plantillas y métricas de envío.
- **Insurance Pack:** emails transaccionales de cotizaciones y documentos.
- **Health OS:** comunicaciones operativas con permisos específicos.

Se distinguirán tres tipos de comunicación:

1. **Conversacional:** respuesta de un agente dentro de una conversación.
2. **Marketing:** envío segmentado a múltiples destinatarios con consentimiento y métricas.
3. **Transaccional:** mensajes operativos vinculados a un proceso de negocio.

Las suites no implementarán directamente proveedores ni guardarán tokens. Solicitarán operaciones al servicio server-side común, que registrará el mensaje, resolverá el proveedor autorizado y devolverá estados normalizados.

### Decisión transversal: Document Intelligence Core

El escaneo, clasificación, extracción y validación de documentos tampoco pertenecerán a una suite concreta. LoopDev tendrá un módulo transversal `Document Intelligence Core` consumible por CRM, Insurance Pack, Finance, Health OS y futuras suites.

```text
Document Intelligence Core
  ├── Ingesta segura de archivos
  ├── Antivirus y validación de tipo/tamaño
  ├── OCR y extracción de texto
  ├── Clasificación documental
  ├── Extracción estructurada por esquema
  ├── Validaciones de formato y consistencia
  ├── Revisión humana
  ├── Versiones y trazabilidad
  ├── Referencias a Storage y proveedores
  └── Retención, permisos y auditoría
```

Las suites aportarán esquemas y reglas de dominio, pero no duplicarán el pipeline técnico:

- **CRM:** documentos de clientes, identificaciones y anexos relacionados con leads.
- **Insurance Pack:** documentos de identidad, pólizas, coberturas y soportes de cotización.
- **Finance:** facturas, recibos, comprobantes y datos fiscales.
- **Health OS:** documentos clínicos u ocupacionales con permisos y retención reforzados.

El núcleo debe separar claramente:

1. **Documento original:** archivo inmutable en Storage protegido.
2. **Resultado de procesamiento:** texto, clasificación y campos extraídos.
3. **Validación:** reglas automáticas, confianza y discrepancias.
4. **Revisión humana:** decisión, comentarios y responsable.

No se considerará válido un dato sensible únicamente porque haya sido extraído por OCR o un modelo. Los campos deberán conservar confianza, origen, versión del procesador y estado de revisión. Los datos clínicos y otros datos sensibles tendrán políticas específicas y no se mezclarán con el CRM comercial.

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
- [ ] Añadir empresas y relación contacto-empresa sin forzar el modelo B2C.
- [ ] Modelar personas relacionadas sin convertirlas automáticamente en contactos.
- [ ] Modelar consentimiento, preferencias y restricciones de comunicación.
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
- [ ] Crear contacto + lead en la primera captación de Facebook, WhatsApp, web o campaña.
- [ ] Reutilizar contactos existentes y crear nuevos leads para intenciones distintas.
- [ ] Mantener la atribución de cada lead sin sobrescribir campañas anteriores.
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
- [ ] Modelar tomadores, asegurados y beneficiarios como roles de póliza.
- [ ] Permitir familiares o asegurados sin canal de contacto autorizado.
- [ ] Preparar el handoff hacia Operations sin mezclar datos con el CRM Core.

### Fase 6D — Customer Workspace

- [ ] Crear la vista Customer 360 sobre servicios autorizados.
- [ ] Mostrar relaciones familiares y roles de seguro sin asumir capacidad de contacto.
- [ ] Mostrar leads, oportunidades, conversaciones, actividades, documentos y cotizaciones.
- [ ] Exigir consentimiento y permisos antes de iniciar una comunicación.
- [ ] Añadir pruebas de aislamiento y privacidad por agente y organización.

## Capacidades de IA para CRM

La IA será una capa de asistencia sobre datos estructurados y auditables. No será la fuente de verdad del CRM ni sustituirá la autorización del agente o las reglas de negocio.

### Asistencia en captación

- [ ] Clasificar automáticamente nuevos leads.
- [ ] Detectar intención, producto de interés, idioma y urgencia.
- [ ] Sugerir marca, workspace, equipo o agente responsable.
- [ ] Detectar posibles duplicados.
- [ ] Extraer datos relevantes de formularios, mensajes y campañas.

### Asistencia en conversaciones

- [ ] Resumir conversaciones largas.
- [ ] Extraer hechos, necesidades y compromisos.
- [ ] Proponer la siguiente acción.
- [ ] Sugerir respuestas según contexto y tono.
- [ ] Traducir mensajes cuando proceda.
- [ ] Detectar preguntas sin respuesta, frustración o urgencia.
- [ ] Crear tareas de seguimiento con confirmación del agente.

### Asistencia en pipeline

- [ ] Sugerir etapa y prioridad.
- [ ] Detectar leads estancados o sin actividad.
- [ ] Priorizar oportunidades.
- [ ] Estimar probabilidad de conversión como recomendación no vinculante.
- [ ] Resumir oportunidades y proponer próximos pasos.
- [ ] Detectar información comercial faltante.

### Customer 360 asistido

- [ ] Generar resumen ejecutivo del cliente.
- [ ] Relacionar conversaciones, campañas, leads y oportunidades.
- [ ] Mostrar cambios relevantes del historial.
- [ ] Preparar briefing antes de contactar.
- [ ] Restringir la información mostrada según permisos y consentimiento.

### IA para documentos

- [ ] Clasificar documentos.
- [ ] Extraer nombres, fechas, importes y referencias.
- [ ] Detectar documentos incompletos.
- [ ] Comparar datos entre documentos.
- [ ] Señalar inconsistencias.
- [ ] Preparar campos para cotizaciones.
- [ ] Solicitar revisión humana cuando la confianza sea baja.

### IA para Insurance Pack

- [ ] Detectar necesidades declaradas por el cliente.
- [ ] Recomendar productos compatibles según reglas explícitas.
- [ ] Explicar coberturas y exclusiones en lenguaje sencillo.
- [ ] Comparar opciones sin modificar reglas de elegibilidad.
- [ ] Preparar borradores de cotización.
- [ ] Detectar datos faltantes.
- [ ] Resumir condiciones para revisión del agente.

## Guardrails obligatorios de IA

- [ ] La IA no puede contactar automáticamente sin consentimiento y aprobación.
- [ ] La IA no puede enviar mensajes sensibles sin confirmación humana.
- [ ] La IA no decide elegibilidad final de seguros.
- [ ] La IA no aprueba documentos de alto riesgo por sí sola.
- [ ] La IA no cambia etapas críticas sin trazabilidad y permiso.
- [ ] La IA no inventa datos; toda extracción debe conservar origen y confianza.
- [ ] La IA no accede a personas relacionadas sin autorización.
- [ ] La IA no toma decisiones clínicas, legales o financieras definitivas.
- [ ] Toda recomendación conserva modelo, versión, contexto, usuario y resultado.
- [ ] Los prompts, respuestas y datos sensibles se procesan server-side.

## Arquitectura de capacidades

```text
CRM Core
  → datos y procesos persistentes

Communications Core
  → canales y mensajes

Document Intelligence Core
  → documentos, OCR y extracción

AI Assistant Layer
  → clasificación, resúmenes, sugerencias y automatizaciones aprobables
```

La primera entrega de IA priorizará resúmenes de conversaciones, clasificación de leads, extracción de mensajes y documentos, sugerencias de respuesta, creación de tareas, detección de leads estancados y resúmenes de cliente u oportunidad.

Las integraciones con proveedores LLM, workers, jobs idempotentes, control de costes, límites, reintentos, timeouts y selección de modelos se implementarán como una fase técnica posterior y por módulo, manteniendo las claves exclusivamente en servidor.

### Fase 8A — WhatsApp inbound POC

- [ ] Contratos de payload externo normalizado.
- [ ] Cuenta y canal por organización/marca.
- [ ] Endpoint de verificación y webhook server-side.
- [ ] Validación de firma y deduplicación idempotente.
- [ ] Contacto, conversación y mensaje persistentes.
- [ ] Bandeja CRM con asignación y estado.
- [ ] Tests de eventos duplicados y aislamiento.

### Fase transversal — Communications Core

- [ ] Definir contratos comunes de canales, mensajes, plantillas, consentimientos y estados.
- [ ] Separar mensajes conversacionales, marketing y transaccionales.
- [ ] Crear referencias seguras a credenciales por organización, marca y proveedor.
- [ ] Crear servicio server-side de envío y recepción normalizados.
- [ ] Centralizar webhooks, idempotencia, reintentos y estados de entrega.
- [ ] Exponer adaptadores consumibles por CRM, Marketing Studio e Insurance Pack.
- [ ] Añadir auditoría y observabilidad sin exponer secretos.

### Fase transversal — Document Intelligence Core

- [ ] Definir contratos comunes de documentos, archivos, clasificaciones, campos y validaciones.
- [ ] Crear ingesta segura y referencias protegidas a Storage.
- [ ] Crear pipeline asíncrono de OCR/procesamiento sin acoplar proveedores.
- [ ] Implementar extracción estructurada mediante esquemas por dominio.
- [ ] Registrar confianza, versión del procesador y estado de revisión.
- [ ] Añadir revisión humana y auditoría.
- [ ] Crear adaptadores CRM e Insurance Pack como primeros consumidores.
- [ ] Mantener Finance y Health OS como consumidores posteriores con permisos específicos.

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
