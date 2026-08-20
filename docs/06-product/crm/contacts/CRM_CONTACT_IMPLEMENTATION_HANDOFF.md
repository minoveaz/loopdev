---
title: CRM Contact Implementation Handoff
status: approved-for-handoff
version: 1.0
created: 2026-08-13
updated: 2026-08-18
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
implementation_issue: https://github.com/minoveaz/loopdev/issues/82
implementation_branch: feature/crm-contacts-backend-foundation
commit_convention: 'feat(crm): implement <slice> (#82)'
pull_request_closure: 'Closes #82'
---

# Handoff de implementacion: CRM Contact backend-first

## 1. Instruccion para el equipo implementador

La primera entrega se implementa sin frontend para que el equipo de UI pueda
cablearse contra contratos y fixtures estables. Leer y aceptar este documento
junto con sus referencias. La rama se crea desde `develop` actualizado con el nombre:

```text
feature/crm-contacts-backend-foundation
```

La rama de documentación/preparación anterior no es la rama de implementación.
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

Entregar el primer slice backend real de Contactos:

- Lista paginada y autorizada.
- Busqueda y filtros autorizados.
- Creacion y edicion de contacto.
- Contratos Zod, envelopes de respuesta y errores estables.
- Fixtures de dos organizaciones y pruebas de autorización/aislamiento.
- Estados de conflicto, validación, forbidden y not-found para el consumidor UI.

Customer 360, merge humano y composición visual quedan preparados en contrato
pero fuera del primer slice backend.

## 4. Composicion frontend posterior

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

Esta composición no se implementa en la rama backend-first; se usa como contrato
de integración para el equipo frontend.

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

## 8. Estado de certificacion backend-first

La rama implemento y certifico el slice backend-first con contratos Zod,
autorizacion server-side, RLS por organizacion, aislamiento cross-tenant,
creacion idempotente por email/telefono normalizado y actualizacion optimista.
Los adapters convierten conflictos de concurrencia o recurso ausente en `409`
sin exponer errores internos. El pack reproducible
`supabase/seed_crm_pilot.sql` cubre los caminos del piloto y queda disponible
para la integracion UI.

## 9. Definition of Ready de la rama implementadora

Antes del primer commit de codigo, el equipo debe confirmar en el Issue #82:

- [ ] Ha leido este handoff y todas sus referencias.
- [x] Ha creado `feature/crm-contacts-backend-foundation` desde `develop` actualizado.
- [ ] Ha identificado las rutas App Router que seran delgadas.
- [ ] El equipo frontend ha confirmado la disponibilidad de SuiteRuntime/SuiteCanvas para la integración posterior.
- [ ] Ha declarado Contracts, Schema, RLS, Storage, Secrets, Observability y Rollout/Rollback.
- [ ] Ha identificado dependencias SEC/DB y su orden de trabajo.
- [ ] Ha acordado no incluir cambios ajenos ni fixtures autoritativos.

## 10. Evidencia esperada

- PR enlazado al Issue #82.
- Contratos y mappers validados.
- Migracion aditiva y tipos generados si aplica.
- Matriz RLS/pgTAP con dos organizaciones y roles.
- Tests de route, integración, contratos y estados de autorización.
- Fixtures deterministas para el equipo frontend.
- Readiness review backend completada antes de declarar tests verdes o handoff UI.
