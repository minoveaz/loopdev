---
title: CRM Tasks, Notes and Timeline Component Audit
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/87
---

# Auditoria de componentes de Tasks

## Boundary

```text
App Router -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared
```

Canvas y shell no conocen tareas, repositorios, permisos ni mutaciones.

## Composicion

```text
SuiteCanvas mode=data
  -> TaskListWidget
    -> TaskFilters
    -> TaskTable

SuiteCanvas mode=overview
  -> MyDayWidget
    -> TaskGroup

SuiteCanvas mode=record
  -> TaskRecordView
    -> TaskStatusBar
    -> TaskActivityPanel
    -> RelatedEntitySummary

SuiteCanvas mode=focus
  -> TaskForm
    -> TaskAssignmentField
    -> TaskDueDateField
    -> TaskRelationSelector

Record widget
  -> ActivityTimeline
    -> TimelineEventItem
    -> NoteComposer
```

## Inventario

| Componente | Capa | Decision |
| --- | --- | --- |
| `SuiteRuntime/SuiteCanvas` | Shell | Reutilizar; sin logica de Tasks |
| `ResponsiveTable` | `@loopdev/ui` | Reutilizar para bandeja |
| `ModuleHeader/Toolbar/ContextBar` | `@loopdev/ui` | Reutilizar/componer |
| `Input/Select/Button/Badge/Tabs` | `@loopdev/ui` | Reutilizar |
| `LoadingState/EmptyState/ErrorState` | `@loopdev/ui` | Reutilizar y certificar |
| `TaskListWidget` | Widget CRM | Desarrollar |
| `MyDayWidget` | Widget CRM | Desarrollar |
| `TaskRecordView` | Widget CRM | Desarrollar |
| `TaskForm` | Feature CRM | Desarrollar |
| `TaskCompletion` | Feature CRM | Desarrollar con permiso y auditoria |
| `TaskAssignment` | Feature CRM | Desarrollar con scope de equipo |
| `TaskRelationSelector` | Feature CRM | Desarrollar para Contact/Lead/Opportunity |
| `ActivityTimeline` | Widget compartido CRM | Desarrollar como consumidor de ActivityItem |
| `NoteComposer` | Feature compartida CRM | Desarrollar con redaccion y permisos |
| `Task` | Entity CRM | Crear public API |
| `Note` | Entity CRM | Crear public API |
| `TimelineEvent` | Entity CRM | Crear read model append-only |
| `ActivityItem` | Entity/shared CRM | Definir union de actividad |

## Promocion a shared

`ActivityTimeline`, `ActivityItem` y primitives de estados solo se promueven a shared cuando exista
un segundo consumidor real (Contacts, Leads, Pipeline o Customer 360) y evidencia de compatibilidad.

## Definition of Ready

- [x] Vistas, rutas, modos Canvas y composicion inicial de Tasks aprobados.
- [x] Bandeja de Tasks y Mi dia aprobados con filtros, agrupaciones, acciones y estados UX.
- [x] Detalle `record`, creacion `focus`, edicion, relaciones y ciclo de vida de Task aprobados.
- [x] Notes, Timeline, `ActivityItem` y agregacion de Customer 360 aprobados como capacidades compartidas.
- [x] UX, contract e impact assessment aprobados.
- [x] Vistas `data`, `overview`, `split`, `record` y `focus` tienen owner.
- [x] Task, Note, TimelineEvent y ActivityItem tienen contratos coherentes.
- [x] Relaciones Contact/Lead/Opportunity y tenant scope están definidos.
- [x] Prototipos anteriores no son fuente autoritativa.
