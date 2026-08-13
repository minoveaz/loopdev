---
title: CRM Tasks, Notes and Timeline UX Specification
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/87
coordinating_issue: https://github.com/minoveaz/loopdev/issues/86
---

# Especificacion UX/UI de Tasks, Notes y Timeline

## 1. Proposito

Define Tasks como modulo operativo reutilizable y Notes/Timeline como capacidades compartidas de G3.
Daily Operation es un resultado transversal de Contacts, Leads, Pipeline, Tasks, Notes, Timeline y
Customer 360; no es un modulo independiente en esta fase.

Una Task es una accion asignable y auditable relacionada con un Contact, Lead u Opportunity. Una Note
es una anotacion contextual. Un TimelineEvent es un evento de actividad no editable que resume cambios
relevantes.

Este documento permanece propuesto y no autoriza implementacion.

## 2. Navegacion y Canvas

| Superficie | Ruta | Canvas | Objetivo |
| --- | --- | --- | --- |
| Bandeja de tareas | `/sales-crm/tasks` | `data` | Buscar, filtrar, ordenar y completar tareas autorizadas |
| Mi dia | `/sales-crm/tasks/today` | `overview` | Priorizar vencidas, de hoy y proximas |
| Tareas de una entidad | Desde Contact, Lead u Opportunity | `split` | Consultar y operar tareas conservando contexto |
| Detalle de tarea | `/sales-crm/tasks/:taskId` | `record` | Consultar y editar una Task |
| Crear tarea | `/sales-crm/tasks/new` o contexto entidad | `focus` | Crear y asignar una Task |
| Timeline | Dentro de `record` y Customer 360 | `record` | Ver actividad cronologica autoritativa |

`SuiteCanvas` permanece generico. Tasks, Notes y Timeline viven en widgets/features/entities bajo FSD.

## 3. Roles y acciones

| Rol | Acciones |
| --- | --- |
| Agente comercial | Crear tareas autorizadas, editar propias o asignadas, completar, reabrir propias según regla, crear notas |
| Manager | Todas las del agente, reasignar, editar tareas del equipo, revisar vencimientos |
| Admin Estar Protegidos | Configurar reglas existentes de prioridad/estado; no crea campos personalizados |
| Superdev LoopDev | Acceso privilegiado separado, con proposito, actor y auditoria |

No existe `viewer` en el piloto.

## 4. Bandeja y Mi dia

La bandeja `data` muestra titulo, tipo, estado, prioridad, responsable, vencimiento, entidad relacionada,
ultima actividad y acciones. Filtros: estado, responsable, prioridad, vencimiento, tipo de entidad,
Contact/Lead/Opportunity y tareas propias/equipo.

`Mi dia` agrupa:

- Vencidas.
- Hoy.
- Proximas.
- Sin fecha, si la politica lo permite.

El orden por defecto prioriza estado vencido, vencimiento mas cercano y prioridad. Usa cursor pagination.

## 5. Crear y editar Task

La creacion usa `focus` y exige:

- Titulo.
- Responsable.
- Fecha de vencimiento, salvo regla que permita sin fecha.
- Entidad relacionada: Contact, Lead u Opportunity.

Opcionales:

- Descripcion.
- Prioridad.
- Tipo de tarea.
- Nota inicial.

Una Task no puede relacionarse con entidades de otro tenant/workspace. Al crearse desde una entidad,
la relacion queda fijada y visible como contexto de solo lectura.

Estados iniciales:

```text
open -> in_progress -> completed
```

Se admite `cancelled` cuando la politica lo apruebe. Reabrir `completed` exige accion explicita y deja
auditoria; la regla exacta de rol queda pendiente.

## 6. Notes y Timeline

Una Note pertenece a un contexto autorizado y conserva autor, fecha, entidad y contenido. No se
permite editar el historial de TimelineEvent. El Timeline muestra eventos de Task, Note, cambios de
estado, asignacion, conversion y actividad relevante de Contact/Lead/Opportunity.

El contenido de Notes es PII potencial: no aparece en logs, analytics ni errores.

## 7. Estados UX y responsive

Bandeja, Mi dia, detalle, editor y timeline cubren `loading`, `empty`, `error`, `forbidden`, `success`,
`stale`, `action pending` y `conflict`. Desktop usa tabla y paneles; tablet apila; mobile usa una
columna, filtros en sheet y detalle `record`.

## 8. Journeys UAT

### T1: jornada del agente
1. Abrir Mi dia.
2. Revisar vencidas y tareas de hoy.
3. Abrir una tarea relacionada con Lead.
4. Completarla.
5. Ver el evento en Lead y Customer 360.

### T2: crear desde entidad
1. Abrir Contact, Lead u Opportunity.
2. Crear Task contextual.
3. Asignar responsable, prioridad y vencimiento.
4. Confirmar persistencia y permisos.

### T3: Notes y timeline
1. Añadir Note a una entidad autorizada.
2. Confirmar que aparece en Timeline.
3. Confirmar que el evento no se puede alterar como historial.
4. Verificar aislamiento tenant.

## 9. Fuera de alcance

Automatizaciones, tareas recurrentes avanzadas, calendario externo, email, WhatsApp, IA, push,
dependencias complejas, gestión de proyectos, documentos y paridad mobile completa.

## 10. Componentes por vista

| Vista | Reutilizar | Desarrollar en CRM |
| --- | --- | --- |
| Bandeja `data` | `ModuleHeader`, `ModuleToolbar`, `ResponsiveTable`, `Input`, `Select`, `Badge`, estados UX | `TaskListWidget`, `TaskFilters`, `TaskRowActions` |
| Mi dia `overview` | `ModuleHeader`, `ContextBar`, `Tabs`, `Badge`, `EmptyState`, estados UX | `MyDayWidget`, `TaskGroup`, `TaskPrioritySummary` |
| Contexto `split` | `ContextBar`, `Button`, `IconButton`, `Badge`, `Tabs` | `RelatedTaskPanel`, `TaskQuickActions` |
| Detalle `record` | `ModuleHeader`, `Tabs`, `ContextBar`, `Badge`, `Button`, timeline compartida | `TaskRecordView`, `TaskStatusBar`, `TaskActivityPanel`, `RelatedEntitySummary` |
| Crear `focus` | `ModuleHeader`, `Input`, `Select`, `Button`, dialog/drawer, estados UX | `TaskForm`, `TaskAssignmentField`, `TaskDueDateField`, `TaskRelationSelector` |
| Timeline | `Tabs`, `EmptyState`, `LoadingState` | `ActivityTimeline`, `TimelineEventItem`, `NoteComposer`, `NoteItem` |

## 11. Aprobacion

- [x] Product Owner aprueba vistas, rutas, modos Canvas y composicion de componentes de Tasks.
- [x] La composicion aprobada usa `data` para bandeja, `overview` para Mi dia, `split` para contexto, `record` para detalle y `focus` para creacion.
- [x] Product Owner aprueba la bandeja de Tasks y Mi dia con columnas, estados, prioridades, filtros, acciones, grupos, estados UX y comportamiento responsive.
- [x] Product Owner aprueba detalle, creacion y edicion de Task, relaciones con Contact/Lead/Opportunity, ciclo de vida, permisos, validaciones, estados UX y responsive.
- [x] La entidad relacionada queda fijada despues de crear la Task en el piloto; no se permite cambiarla silenciosamente.
- [x] Product Owner aprueba Notes y Timeline como capacidades compartidas, Timeline append-only, Notes protegidas por permisos, `ActivityItem` comun y agregacion sin duplicados en Customer 360.
- [x] Product Owner aprueba campos y estados de Task.
- [x] Product Owner aprueba Notes/Timeline como capacidades compartidas.
- [x] Tech Lead aprueba contratos, RLS, idempotencia y auditoria.
- [x] Se confirma Daily Operation como resultado transversal de G3.
