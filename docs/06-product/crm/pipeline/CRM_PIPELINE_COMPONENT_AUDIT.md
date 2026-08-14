---
title: CRM Pipeline and Opportunities Component Audit
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/85
ux_spec: docs/06-product/crm/pipeline/CRM_PIPELINE_UX_SPEC.md
---

# Auditoria de componentes de Pipeline

## Boundary

```text
App Router -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared
```

Canvas y shell no conocen Opportunities, repositorios, autorizacion ni mutaciones.

## Composicion

```text
SuiteCanvas mode=board
  -> PipelineBoardWidget
    -> PipelineStageColumn
      -> OpportunityCard

SuiteCanvas mode=data
  -> OpportunityTable
    -> OpportunityFilters

SuiteCanvas mode=record
  -> OpportunityRecordView
    -> OpportunitySummary
    -> RelatedContact
    -> RelatedLead
    -> OpportunityTimeline

SuiteCanvas mode=focus
  -> OpportunityForm
    -> ContactSelector
    -> ProductField
    -> StageSelector
```

## Inventario

| Componente | Capa | Decision |
| --- | --- | --- |
| `SuiteRuntime/SuiteCanvas` | Shell | Reutilizar; permanece sin logica CRM |
| `KanbanBoard` | `@loopdev/ui` | Reutilizar y certificar accesibilidad/movimiento |
| `ResponsiveTable` | `@loopdev/ui` | Reutilizar para tabla |
| `ModuleHeader/Toolbar/ContextBar` | `@loopdev/ui` | Reutilizar/componer |
| `Input/Select/Button/Badge/Tabs` | `@loopdev/ui` | Reutilizar |
| `LoadingState/EmptyState/ErrorState` | `@loopdev/ui` | Reutilizar y certificar |
| `PipelineBoardWidget` | Widget CRM | Desarrollar |
| `PipelineStageColumn` | Widget CRM | Desarrollar; consume stage read model |
| `OpportunityCard` | Widget CRM | Desarrollar; sin mutaciones directas |
| `OpportunityTable` | Widget CRM | Desarrollar sobre contrato real |
| `OpportunityRecordView` | Widget CRM | Desarrollar |
| `OpportunityForm` | Feature CRM | Desarrollar |
| `StageMove` | Feature CRM | Desarrollar con permiso, version y auditoria |
| `CreateManualOpportunity` | Feature CRM | Desarrollar con Contact obligatorio |
| `CreateOpportunityFromLead` | Feature CRM compartida | Reutilizar el contrato definido por Leads; no duplicar logica |
| `Opportunity` | Entity CRM | Formalizar public API y read model |
| `PipelineStage` | Entity CRM | Formalizar ID estable, nombre, orden y terminalidad |
| `OpportunityOrigin` | Entity CRM | Formalizar `manual` y `lead_conversion` |

## Patrones estandarizados aprobados

- `EntityCardActivityFooter`.
- `ActivityHealthIndicator`.
- `EntityCardIndicators` con tooltip y tono semantico.
- Estados `idle`, `dragging`, `drop-pending`, `drop-success`, `drop-error`, `locked` y `stale`.
- Menu contextual como alternativa accesible al drag and drop.
- Theming por tokens, sin colores ni marcas hardcodeadas.
- View models de tarjeta por entidad, sin mutaciones ni reglas de repositorio dentro de la tarjeta.

IA, PDFs, presupuestos, cotizaciones, documentos e integraciones externas quedan fuera del audit del
piloto y se reservan para la siguiente fase.

## Promocion a shared

No promover componentes al design system por un solo consumidor. `KanbanBoard` y primitives existentes
se reutilizan; cualquier nuevo componente compartido exige segundo consumidor real y evidencia.

## Definition of Ready

- [x] UX, contract e impact assessment aprobados.
- [ ] Board, data, split, record y focus tienen owner.
- [ ] Todas las superficies distinguen reutilizacion y desarrollo CRM.
- [ ] Etapas estables y origenes estan definidos.
- [ ] Prototipos anteriores no son fuente autoritativa.
- [x] Board aprobado con filtros, movimiento server-side, alternativa accesible, estados UX y responsive mobile.
- [x] Reapertura de etapas terminales aprobada con permiso elevado, motivo y auditoría.
- [x] Tabla de Opportunities aprobada con componentes reutilizables, filtros, paginación y acciones masivas limitadas.
- [x] Detalle `record` aprobado con relaciones, historial, actividad, tareas, notas y reapertura auditada.
- [x] Creación manual `focus` aprobada con ContactSelector, campos comerciales, StageSelector y estados de mutación.
