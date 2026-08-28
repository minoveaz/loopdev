---
title: CRM Pipeline and Opportunities Implementation Handoff
status: approved-for-handoff
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/85
---

# Handoff de implementacion de Pipeline

## Leer primero

0. `../shared/CRM_BACKEND_MODULE_PLAYBOOK.md`.

1. `CRM_PIPELINE_UX_SPEC.md`.
2. `CRM_PIPELINE_COMPONENT_AUDIT.md`.
3. `CRM_PIPELINE_CONTRACT.md`.
4. `CRM_PIPELINE_IMPACT_ASSESSMENT.md`.
5. `../leads/CRM_LEAD_CONTRACT.md`.
6. `../../../../tracks/planned/crm/2026-08-13-crm-pilot-execution.md`.

## Rama y trazabilidad

Este paquete se prepara en `docs/2026-execution-roadmap`. La rama de implementacion futura sera
`feature/crm-pilot-pipeline-implementation`, creada desde `develop` actualizado solo despues de que
el Issue #85 confirme Definition of Ready. Commits incluyen `(#85)` y el PR usa `Closes #85`.

## Outcome

Entregar board persistente, tabla, detalle y creacion de Opportunity con etapas estables, permisos,
Contact obligatorio, relacion opcional/obligatoria con Lead segun origin, movimientos auditados y
conversion idempotente por producto.

## Composicion obligatoria

```text
App Router -> SuiteRuntime -> SuiteCanvas mode=board/data/split/workspace/full-bleed
  -> widgets -> features -> entities -> shared
```

Canvas no contiene repositorios, reglas ni mutaciones. No crear shell o sidebar paralelo.

## Fuera de alcance

Cotizaciones, documentos, polizas, facturacion, forecast avanzado, scoring, IA, integraciones reales,
campos personalizados y paridad mobile completa.

## Definition of Ready

- [ ] UX spec, component audit, contract e impact assessment aprobados por Product Owner/Tech Lead.
- [ ] Issue #85 y Project CRM Pilot G0-G5 enlazados con evidencia.
- [ ] Contact/Lead contracts y dependencias RLS confirmados.
- [ ] Etapas, IDs estables, origenes y producto definidos.
- [ ] Unicidad `(tenant, lead, productKey, origin=lead_conversion)` definida en schema.
- [ ] Board, tabla, detalle y creacion tienen estados UX y responsive definidos.
- [ ] No hay cambios ajenos en el primer commit.

## Evidence and validation

Required: contract/typecheck, schema/RLS review, pgTAP, unit/integration/E2E, accessibility,
responsive, concurrency/idempotency evidence, staging readiness review and PR link.

La implementacion confirma readiness en el Issue #85 antes de crear la rama. Esta rama documental no
inicia codigo ni cambia el estado a `In progress`.
