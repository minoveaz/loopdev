---
title: CRM Contact Implementation Handoff
status: approved-for-handoff
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
implementation_issue: https://github.com/minoveaz/loopdev/issues/82
implementation_branch: feature/crm-pilot-contacts-implementation
commit_convention: 'feat(crm): implement <slice> (#82)'
pull_request_closure: 'Closes #82'
---

# Handoff de implementacion: CRM Contact

## 1. Instruccion para el equipo implementador

Antes de crear la rama de implementacion, leer y aceptar este documento junto con sus referencias.
La rama debe crearse desde `develop` actualizado con el nombre:

```text
feature/crm-pilot-contacts-implementation
```

La rama de documentacion/preparacion `feature/crm-pilot-contacts` no es la rama de implementacion.
No se deben reutilizar como fuente autoritativa los fixtures, contextos locales o componentes del
prototipo CRM anterior.

## 2. Referencias obligatorias

1. [CRM Pilot UX Specification](../shared/CRM_PILOT_UX_SPEC.md)
2. [CRM Contacts Component Audit](CRM_CONTACTS_COMPONENT_AUDIT.md)
3. [CRM Contact Contract](CRM_CONTACT_CONTRACT.md)
4. [CRM Contact Impact Assessment](CRM_CONTACT_IMPACT_ASSESSMENT.md)
5. [CRM Pilot Readiness Review](../shared/CRM_PILOT_READINESS_REVIEW.md)
6. [CRM Pilot Execution track](../../../../tracks/active/crm/2026-08-13-crm-pilot-execution.md)
7. [Suite composition ADR](../../../architecture/ADR-2026-08-13-suite-runtime-suite-canvas-fsd.md)

## 3. Outcome de la entrega

Entregar el primer vertical slice real de Contactos:

- Lista paginada y autorizada.
- Busqueda y filtros autorizados.
- Creacion y edicion de contacto.
- Detalle de Contact y Customer 360 minimo.
- Campos personales opcionales y configuracion mostrar/ocultar/obligatorio de campos existentes.
- Deduplicacion exacta.
- Posible duplicado: crear contacto, informar al agente y abrir revision.
- Merge humano aprobado por agente/manager, con auditoria y referencias preservadas.
- Estados `loading`, `empty`, `error`, `forbidden` y `success`.
- Escritorio y tablet como superficie funcional; mobile web responsive basico.

## 4. Composicion frontend obligatoria

```text
App Router route
  -> SuiteRuntime
    -> SuiteCanvas mode=data
      -> ContactWorkspaceHeader
      -> ContactToolbar
      -> ContactTable

Contact detail route/state
  -> SuiteRuntime
    -> SuiteCanvas mode=split
      -> ContactDetailPanel
        -> Customer360Tabs
        -> ContactTimeline
        -> RelatedLeads
        -> RelatedOpportunities
        -> RelatedTasks
        -> NotesPanel
        -> DuplicateReviewPanel
```

FSD se aplica dentro del Canvas:

```text
app -> widgets -> features -> entities -> shared
```

- `widgets`: ContactTable, ContactDetailPanel, Customer360Tabs, ContactTimeline.
- `features`: create/update contact, duplicate review/merge, contact field configuration, filters.
- `entities`: Contact, Lead, Opportunity, Task, TimelineEvent.
- `shared`: solo utilidades y UI sin reglas de negocio.

`SuiteRuntime` y `SuiteCanvas` no reciben contactos, queries, repositorios ni reglas CRM. No se crea
una sidebar o shell paralelo dentro de CRM.

## 5. Requisitos de datos y autorizacion

- Cada request resuelve organization, workspace, membership y permiso server-side.
- El navegador no usa `service_role` ni accede directamente a tablas CRM.
- RLS por verbo y constraints tenant-aware son obligatorios.
- Tenant B no puede leer, mutar ni referenciar datos de tenant A.
- PII no aparece en logs, analytics, screenshots ni errores.
- Merges y cambios sensibles generan audit append-only.
- Contact creation y update respetan el contrato aprobado y el control de concurrencia.

## 6. Fuera de este handoff

No implementar en esta rama:

- Pipeline o configuracion de etapas.
- Leads como slice completo.
- WhatsApp, Marketing, email o providers reales.
- Cotizaciones, polizas, OCR, documentos o datos de salud.
- AI Insights, scoring o agentes.
- Billing, entitlements comerciales o mobile CRM.
- Migracion global de FSD o refactor global del shell.

## 7. Flujo Issue, rama, commit y PR

El equipo debe crear la rama desde `develop` actualizado, pero la evidencia durable de la rama no
se mantiene en un campo manual del Project:

```text
Issue #82
  -> feature/crm-pilot-contacts-implementation
    -> commits con (#82)
      -> PR con Closes #82
```

Primer commit de implementacion recomendado:

```text
feat(crm): scaffold contacts vertical slice (#82)
```

El PR debe incluir `Closes #82`. El Project conserva el Issue, gate, prioridad, carril y evidencia;
la rama y sus cambios se obtienen del PR y de sus commits.

## 8. Definition of Ready de la rama implementadora

Antes del primer commit de codigo, el equipo debe confirmar en el Issue #82:

- [ ] Ha leido este handoff y todas sus referencias.
- [ ] Ha creado `feature/crm-pilot-contacts-implementation` desde `develop` actualizado.
- [ ] Ha identificado las rutas App Router que seran delgadas.
- [ ] Ha confirmado la disponibilidad de SuiteRuntime/SuiteCanvas en su base.
- [ ] Ha declarado Contracts, Schema, RLS, Storage, Secrets, Observability y Rollout/Rollback.
- [ ] Ha identificado dependencias SEC/DB y su orden de trabajo.
- [ ] Ha acordado no incluir cambios ajenos ni fixtures autoritativos.

## 8. Evidencia esperada

- PR enlazado al Issue #82.
- Contratos y mappers validados.
- Migracion aditiva y tipos generados si aplica.
- Matriz RLS/pgTAP con dos organizaciones y roles.
- Tests de route, integracion y estados UX.
- Evidencia de ContactTable y ContactDetailPanel en desktop/tablet.
- Readiness review completada antes de declarar tests verdes o UAT.
