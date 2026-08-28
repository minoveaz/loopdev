---
title: CRM Leads UX Specification
status: approved
version: 1.2
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
---

# Especificacion UX/UI de Leads

## 1. Proposito

Define la experiencia de Leads del piloto CRM y su relacion con Contactos y Pipeline. Leads
representa una intencion comercial; Contact representa la persona persistente. Un lead siempre
pertenece a un contacto.

Esta especificacion es el primer borrador para el bloque de Leads. No autoriza implementacion hasta
su aprobacion y la posterior creacion del contrato e impact assessment.

## 2. Navegacion y Canvas

| Superficie | Ruta | Canvas | Objetivo |
| --- | --- | --- | --- |
| Lista de Leads | `/sales-crm/leads` | `data` | Buscar, filtrar, ordenar y abrir leads autorizados |
| Lista + previsualizacion | `/sales-crm/leads` | `split` | Mantener la tabla visible mientras se inspecciona un Lead |
| Crear/capturar Lead | `/sales-crm/leads/new` | `full-bleed`; dialog/drawer para captura rapida | Seleccionar o crear contacto, origen y asignacion |
| Detalle de Lead desde lista | `/sales-crm/leads/:leadId` | `split` | Inspeccionar el Lead conservando la lista como contexto |
| Detalle directo de Lead | `/sales-crm/leads/:leadId` | `workspace` | Ver y operar la ficha completa del Lead |
| Crear oportunidad | Desde detalle de Lead | panel transaccional; `full-bleed` si requiere mas datos | Convertir una intencion cualificada sin duplicar contacto ni Lead |

`SuiteCanvas` admite los modos genericos `overview`, `data`, `workspace`, `split`, `board`,
`full-bleed` y `workspace`. `workspace` representa la ficha operativa de una entidad y `full-bleed`
representa una tarea guiada o transaccional. Ningun modo conoce Leads, Contacts u Opportunities.
`SuiteCanvas` admite los modos genericos `overview`, `data`, `workspace`, `split`, `board` y `full-bleed`. `data` es la tabla principal, `split` conserva tabla y previsualizacion, `workspace` representa la ficha operativa de una entidad y `full-bleed` representa una tarea guiada o transaccional. Ningun modo conoce Leads, Contacts u Opportunities.

La ruta permanece delgada: `SuiteRuntime + SuiteCanvas` compone la superficie y FSD organiza
widgets, features y entities dentro del Canvas.

### Composicion por vista

| Vista | Canvas | Componentes reutilizables | Componentes CRM a desarrollar |
| --- | --- | --- | --- |
| Lista de Leads | `data` | `ModuleHeader`, `ModuleToolbar`, `ContextBar`, `Input`, `Select`, `Button`, `IconButton`, `Badge`, `ResponsiveTable`, `EmptyState`, `LoadingState`, dialog accesible | `LeadListWidget`, `LeadToolbar`, `LeadTable`, `LeadFilters`, `LeadBulkActions` |
| Captura rapida | dialog/drawer | `Dialog` o primitive equivalente, `Input`, `Select`, `Button`, `Badge`, `LoadingState`, `ErrorState` | `QuickLeadCapture`, `ContactLookupField`, `LeadSourceField`, `AssignmentField` |
| Captura completa | `full-bleed` | `ModuleHeader`, `ContextBar`, `Input`, `Select`, `Button`, `IconButton`, `EmptyState`, `LoadingState` | `LeadCaptureWorkspace`, `ContactSelector`, `CreateContactFromLead`, `LeadAttributionFields`, `LeadForm` |
| Lista + detalle | `split` | `ResponsiveTable`, `ModuleToolbar`, `Button`, `IconButton`, `Badge`, `ContextBar` | `LeadListWidget`, `LeadRecordPreview`, `LeadQuickActions` |
| Detalle directo | `workspace` | `ModuleHeader`, `ContextBar`, `Tabs`, `Badge`, `Button`, `IconButton`, `EmptyState`, `LoadingState` | `LeadRecordView`, `LeadIdentityHeader`, `LeadAttributionPanel`, `RelatedContactSummary`, `RelatedOpportunityPanel`, `LeadTimeline`, `LeadWorkPanel` |
| Crear Opportunity | panel transaccional o `full-bleed` | `Dialog`/drawer, `Input`, `Select`, `Button`, `LoadingState`, `ErrorState`, `SuccessState` | `CreateOpportunityFromLead`, `QualifiedLeadGuard`, `OpportunityResultPanel` |

Los componentes reutilizables se consumen desde `@loopdev/ui` cuando ya existen y se certifican
para accesibilidad, responsive y estados. Los componentes de CRM permanecen dentro del suite y no
se promueven a UI compartida sin un segundo consumidor real.

## 3. Roles y acciones

| Rol | Acciones |
| --- | --- |
| Agente comercial | Crear/capturar, editar, asignar cuando tenga permiso, cambiar estado, crear oportunidad y registrar nota/tarea |
| Manager | Todas las del agente, reasignar, revisar duplicados y operar el pipeline del equipo |
| Admin Estar Protegidos | Configurar estados y reglas operativas existentes; no crea campos personalizados en este piloto |
| Superdev LoopDev | Soporte transversal privilegiado, separado, auditado y no expuesto como rol tenant |

No existe `viewer` en el piloto.

## 4. Vista de tabla de Leads

La tabla de Leads usa `SuiteCanvas mode=data` y muestra como minimo:

- Nombre del contacto y enlace a Contact 360.
- Estado del lead.
- Origen: manual, campaña, WhatsApp simulado, referral, social o partner.
- Campaña/UTM cuando exista.
- Marca y workspace.
- Asignado a.
- Fecha de creación y actualización.
- Indicador de posible duplicado.
- Oportunidad relacionada cuando exista.
- Acciones autorizadas.

Columnas principales de escritorio: Contacto, Estado, Origen, Interés/producto, Asignado a, Última
actividad, Marca, Workspace, Opportunity relacionada, posible duplicado y Acciones.

En mobile la fila prioriza Contacto, Estado, Origen, Asignado a y Última actividad. El resto aparece
en el detalle `workspace` o en la previsualización `split`.

Filtros iniciales: estado, origen, asignado, marca, workspace, campaña, rango de fechas, con o sin
Opportunity, con posible duplicado y sin actividad reciente. La lista usa paginación/cursor y nunca
descarga todos los Leads de una organización.

Acciones por fila: abrir detalle, editar, cambiar estado, reasignar si existe permiso, registrar
tarea, registrar nota, abrir Contact 360, crear Opportunity cuando el Lead esté `cualificado` y
revisar duplicado cuando exista alerta.

Acciones masivas del piloto: cambiar responsable, cambiar estado y crear tarea. Borrado masivo,
conversión masiva, merge automático y exportación masiva quedan fuera de alcance.

La ruta inicia en `data`. En escritorio, el clic simple sobre una fila puede abrir una previsualización
en `split` sin abandonar la tabla. La acción "Ver ficha" abre el detalle completo en `workspace`. En
mobile, la tabla navega al detalle y no mantiene dos columnas simultáneas.

## 5. Crear y capturar Lead

La captura rápida se abre desde la tabla en dialog o drawer. La captura completa usa
`SuiteCanvas mode=full-bleed` en `/sales-crm/leads/new`. El formulario exige un contacto existente o la
creación de uno nuevo mediante el flujo de Contactos. No crea una segunda persona silenciosamente.

Composición de captura completa:

```text
SuiteCanvas mode=full-bleed
	-> LeadCaptureWorkspace
		-> ContactSelector
		-> LeadAttributionFields
		-> AssignmentField
		-> LeadForm
		-> LeadFormActions
```

Campos:

- Contacto.
- Origen: manual, campaña, WhatsApp simulado, referral, social o partner.
- Marca y workspace cuando corresponda.
- Asignado a.
- Interés/producto en texto libre.
- Campaña, UTM source/medium/campaign/content/term cuando existan.
- Provider e identificador externo para futuras integraciones.
- Nota inicial.

Campos obligatorios: Contacto, origen, interés/producto y asignado a, salvo que una política
aprobada permita asignación automática.

Campos opcionales: campaña, UTM source/medium/campaign/content/term, Provider, identificador
externo y nota inicial.

El selector permite buscar un Contact, ver un resumen, seleccionarlo o abrir el flujo de creación de
Contactos. Al volver, el Contact creado queda seleccionado en el Lead.

Antes de guardar se validan tenant/workspace, permisos, catálogo de origen, asignación autorizada,
duplicados e idempotencia de `provider + externalId`. Tras el éxito se ofrece abrir el detalle,
crear una tarea, registrar una nota o volver a la lista. El error conserva valores no sensibles,
permite reintento seguro y no expone detalles internos.

Las conexiones reales de Marketing y WhatsApp no se activan en el piloto. Referral, social y partner
sí forman parte del catálogo de origen y pueden capturarse manualmente o mediante fixtures. Provider,
externalId y atribución quedan preparados para H2 y sus identificadores deben ser idempotentes.

## 6. Estados del Lead

Estados base del piloto:

- `nuevo`.
- `contactado`.
- `cualificado`.
- `estancado`.
- `inactivo`.
- `convertido`.

Los estados son configurables dentro de los límites aprobados por el admin. El movimiento debe
quedar auditado y no puede cambiar el ownership del contacto.

## 7. Detalle de Lead

El detalle muestra:

- Contacto enlazado y acceso a Customer 360.
- Origen y atribución.
- Estado y responsable.
- Interés y datos comerciales no sensibles.
- Oportunidades relacionadas.
- Tareas y notas relacionadas.
- Timeline de cambios.
- Posibles duplicados del contacto, si existe una revisión abierta.

El detalle no muestra documentos, cotizaciones, pólizas, datos de salud, IA ni comunicaciones reales.

### Regla de Contact durante la conversión

La conversión a Opportunity hereda el `contactId` del Lead y no permite cambiarlo durante la
operación. Si la relación es incorrecta, el usuario debe corregir primero el Contact mediante el
flujo autorizado de Contacts. La conversión nunca crea un Contact alternativo ni permite reasignar
la Opportunity a otro Contact desde el panel de conversión.

## 8. Estados UX y responsive

Cada vista implementa `loading`, `empty`, `error`, `forbidden` y `success`. Los errores permiten
reintento seguro y no exponen datos de otro tenant.

UAT funcional: escritorio y tablet. Mobile web: responsive básico, sin paridad funcional completa.

## 9. Journeys UAT de Leads

### Journey L1: captura manual

1. Abrir Leads.
2. Crear o seleccionar un contacto.
3. Crear lead con origen manual, interés y asignado.
4. Abrir el detalle y confirmar persistencia tras recarga.
5. Registrar nota/tarea y abrir Contact 360.

### Journey L2: atribución futura simulada

1. Capturar un lead con origen campaña o WhatsApp simulado.
2. Registrar provider, identificador externo y UTM cuando existan.
3. Repetir el mismo identificador y confirmar idempotencia.
4. Confirmar que no se crea un contacto duplicado.

### Journey L3: cualificación

1. El agente o manager cambia el estado a `cualificado`.
2. El sistema crea automáticamente una oportunidad en la etapa estable `qualified`, cuyo nombre
	visible inicial es `Cualificado`.
3. Confirma que el contacto y el lead permanecen relacionados.
4. La oportunidad aparece en Contact 360 sin duplicar el lead.

El admin puede cambiar el nombre visible de la etapa o su orden sin cambiar el identificador estable
`qualified`, los contratos ni el histórico.

### Opportunities por producto

Un Lead puede tener varias Opportunities cuando representa intereses de productos distintos, por
ejemplo seguro de salud y seguro de hogar. La unicidad se aplica a la combinación Lead + producto o
interés normalizado + tipo de origen de conversión, no al Lead completo.

La conversión es idempotente por esa combinación: dos intentos para el mismo producto devuelven la
misma Opportunity; una conversión para otro producto crea otra Opportunity legítima. Pipeline puede
crear Opportunities manuales adicionales, diferenciadas mediante `origin=manual`; la conversión
desde Lead usa `origin=lead_conversion`.

El Lead pasa de `cualificado` a `convertido` cuando se crea correctamente la primera Opportunity
con `origin=lead_conversion`. `convertido` significa que el Lead ya produjo una oportunidad de
conversión; no impide crear Opportunities de conversión posteriores para productos distintos. Una
Opportunity manual creada desde Pipeline no cambia por sí sola el estado del Lead.

## 10. Criterios de aprobación

- [x] Rutas, Canvas y vistas cubren L1, L2 y L3.
- [x] Origen y atribución futura están definidos sin activar integraciones reales.
- [x] Estados y transiciones tienen owner y auditoría.
- [x] Lead siempre pertenece a un Contact.
- [x] Los roles y estados UX están definidos.
- [x] Modos `data`, `split`, `workspace` y `full-bleed` definidos para Leads.
- [x] Columnas, filtros y acciones iniciales de la tabla aprobados.
- [x] Captura rápida y captura completa aprobadas.
- [x] Detalle `workspace`, timeline, tareas, notas y Opportunity aprobado.
- [x] Un Lead `cualificado` crea como máximo una Opportunity de conversión por producto/interés, vinculada al mismo Contact y Lead.
- [x] La primera Opportunity de conversión cambia el Lead a `convertido`; las posteriores para otros productos siguen permitidas.
- [x] El Contact queda bloqueado durante la conversión y se hereda del Lead.
- [x] La conversión bloquea los datos heredados y permite editar solo nombre, importe, moneda, cierre, responsable autorizado y nota inicial.
- [x] Product Owner aprueba esta especificación antes de crear el contrato de Lead.
