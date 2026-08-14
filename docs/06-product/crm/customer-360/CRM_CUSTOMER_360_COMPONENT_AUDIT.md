---
title: CRM Customer 360 Component Audit
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/88
---

# Auditoria de componentes Customer 360

## Boundary

```text
App Router -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared
```

Customer 360 compone read models autorizados; no contiene repositorios ni mutaciones directas.

## Composicion

```text
SuiteCanvas mode=record
  -> Customer360RecordView
    -> ContactProfileSummary
    -> RelatedLeads
    -> RelatedOpportunities
    -> RelatedTasks
    -> AuthorizedNotes
    -> Customer360Timeline

SuiteCanvas mode=split
  -> Customer360Preview

SuiteCanvas mode=overview
  -> Customer360Summary
```

## Inventario

| Componente | Capa | Decision |
| --- | --- | --- |
| `SuiteRuntime/SuiteCanvas` | Shell | Reutilizar sin logica CRM |
| `ModuleHeader/ContextBar/Tabs/Badge` | `@loopdev/ui` | Reutilizar |
| `LoadingState/EmptyState/ErrorState` | `@loopdev/ui` | Reutilizar y certificar |
| `Customer360RecordView` | Widget CRM | Desarrollar |
| `Customer360Preview` | Widget CRM | Desarrollar |
| `Customer360Summary` | Widget CRM | Desarrollar |
| `ContactProfileSummary` | Widget CRM | Componer Contact entity |
| `RelatedLeads` | Widget CRM | Consumir Lead read model |
| `RelatedOpportunities` | Widget CRM | Consumir Opportunity read model |
| `RelatedTasks` | Widget CRM | Consumir Task read model |
| `AuthorizedNotes` | Feature CRM | Consumir Note permissions |
| `Customer360Timeline` | Widget compartido CRM | Consumir ActivityItem y deduplicar por ActivitySource |
| `ActivityHealthSummary` | Feature CRM | Componer actividad autoritativa |

## Promocion a shared

Solo promover timeline, agregadores o summaries a shared después de un segundo consumidor real y
compatibilidad demostrada.

## Definition of Ready

- [x] UX, contract e impact assessment aprobados.
- [x] Vistas `record`, `split` y `overview`, junto con sus componentes y owners iniciales, aprobadas.
- [x] Secciones autorizadas, estados parciales y agregación deduplicada aprobadas.
- [x] Contrato de Customer 360 aprobado.
- [x] Record, split y overview tienen owners.
- [x] Relaciones y permisos están definidos.
- [x] Deduplicación ActivitySource está definida.
- [x] Customer 360 no se convierte en entidad paralela.
