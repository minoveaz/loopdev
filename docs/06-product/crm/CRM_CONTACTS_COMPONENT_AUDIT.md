---
title: CRM Contacts Component Audit
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
ux_spec: docs/06-product/crm/CRM_PILOT_UX_SPEC.md
approver: User
approved_at: 2026-08-13
---

# Auditoria de componentes para Contactos CRM

## 1. Proposito

Esta matriz define los componentes que necesita la vista de Contactos sobre `SuiteCanvas mode=data`
y el detalle Customer 360 sobre `SuiteCanvas mode=split`. No es una autorizacion para implementar
logica de negocio en el shell ni una lista de componentes del Design System que deban promoverse
automaticamente a `@loopdev/ui`.

## 2. Composicion de la vista

```text
SuiteRuntime
  -> SuiteCanvas mode=data
    -> ContactWorkspaceHeader
    -> ContactToolbar
      -> ContactSearch
      -> ContactFilters
      -> ContactFieldViewSelector
      -> CreateContactButton
    -> ContactTable
      -> ContactRow
    -> Pagination
    -> EmptyState / LoadingState / ErrorState / ForbiddenState

SuiteCanvas mode=split
  -> ContactDetailPanel
    -> ContactIdentityHeader
    -> ContactSummary
    -> Customer360Tabs
    -> ContactTimeline
    -> RelatedLeads
    -> RelatedOpportunities
    -> RelatedTasks
    -> NotesPanel
    -> DuplicateReviewPanel
```

## 3. Inventario de componentes

| Componente | Capa | Estado | Decision |
| --- | --- | --- | --- |
| `SuiteRuntime` | Shell | Disponible/candidato aprobado | Reutilizar como runtime de suite; no conoce CRM |
| `SuiteCanvas` | Shell | Disponible/candidato aprobado | Reutilizar `data` y `split`; no conoce CRM |
| `ModuleHeader` / `PageHeader` | UI | Disponible | Reutilizar para contexto y titulo |
| `ModuleToolbar` / `ContextBar` | UI | Disponible | Reutilizar y componer para toolbar CRM |
| `Button` / `IconButton` | UI | Disponible | Reutilizar |
| `Input` | UI | Disponible | Reutilizar para busqueda y formularios |
| `Select` / `FilterDropdown` | UI | Disponible | Reutilizar para filtros y opciones |
| `Badge` | UI | Disponible | Reutilizar para origen, estado y posibles duplicados |
| `EmptyState` | UI | Disponible | Reutilizar |
| `Spinner` / `LoadingState` | UI | Disponible | Reutilizar |
| `ResponsiveTable` | UI | Disponible | Reutilizar si cubre columnas, overflow y estados CRM |
| `Dialog` accesible | UI | Debe verificarse | Usar primitive accesible existente; no crear modal artesanal |
| `Pagination` | UI | Debe verificarse | Reutilizar si existe; desarrollar solo si falta un contrato adecuado |
| `ContactWorkspaceHeader` | Widget CRM | No existe | Desarrollar dentro de CRM |
| `ContactToolbar` | Widget CRM | No existe como slice CRM | Componer primitives existentes dentro de CRM |
| `ContactTable` | Widget CRM | No existe como vista real | Desarrollar sobre datos autoritativos |
| `ContactRow` | Entity/UI CRM | No existe | Desarrollar dentro de entity contact |
| `ContactForm` | Feature CRM | No existe como flujo aprobado | Desarrollar con campos configurables y PII controlada |
| `ContactDetailPanel` | Widget CRM | Prototipo parcial | Rehacer como widget FSD sobre `split` |
| `Customer360Tabs` | Widget CRM | No existe como experiencia persistente | Desarrollar con contrato estricto |
| `ContactTimeline` | Widget CRM | Prototipo parcial | Rehacer con datos reales y deduplicacion visual |
| `DuplicateReviewPanel` | Feature CRM | No existe | Desarrollar para revision y merge humano auditado |
| `ContactFieldViewSelector` | Feature CRM | No existe | Desarrollar para mostrar/ocultar/obligatorio; sin campos personalizados |
| `ContactFilters` | Feature CRM | No existe como contrato CRM | Desarrollar con filtros autorizados y query keys tenant-aware |
| `ErrorState` / `ForbiddenState` CRM | UI/Widget | Debe componerse | Reutilizar primitives; definir copy y acciones CRM |

## 4. Reglas de ownership

- `SuiteRuntime` y `SuiteCanvas` no reciben contactos, leads, queries ni callbacks de negocio.
- `ContactTable` y `ContactDetailPanel` son widgets CRM, no componentes del shell.
- `ContactForm`, `DuplicateReviewPanel` y `ContactFieldViewSelector` son features CRM.
- `Contact`, `Lead`, `Opportunity`, `Task` y `TimelineEvent` son entities CRM.
- `@loopdev/ui` solo recibe un componente si existe un segundo consumidor real y no contiene reglas CRM.
- Las rutas App Router solo componen y delegan; no contienen repositorios ni reglas de deduplicacion.

## 5. Estados obligatorios

Cada widget debe definir `loading`, `empty`, `error`, `forbidden` y `success`. La tabla mantiene
dimensiones estables en desktop/tablet y usa responsive basico en mobile web. El detalle `split`
+se convierte en drawer/overlay solo cuando el contrato responsive lo requiera.

## 6. Criterio de salida de la auditoria

- [x] Cada componente de UI existente tiene consumidor y contrato revisado.
- [x] Los componentes CRM nuevos tienen owner de capa y API publica.
- [x] Contactos puede componerse sin importar internals del shell.
- [x] No quedan fixtures como fuente autoritativa.
- [x] La primera implementacion puede empezar con `ContactTable`, `ContactForm` y `ContactDetailPanel`.
- [x] Product Owner y Tech Lead aprueban la matriz antes de abrir el slice CRM-01.

## 7. Aprobacion

La matriz fue aprobada el 2026-08-13 por User. La aprobacion desbloquea la preparacion de `CRM-01`,
pero no autoriza saltar los gates de datos, seguridad, contratos, RLS o readiness.
