---
id: suite-definition-workflow
title: Suite Definition Workflow
status: planned
created: 2026-08-14
updated: 2026-08-14
owner: platform
lead: null
phase: 0
branch: docs/suite-definition-workflow
branches: []
pull_requests: []
issues: []
packages: []
release: not-required
areas:
  - documentation
  - governance
  - platform
  - product-definition
dependencies:
  - tracks/planned/crm/2026-08-13-crm-pilot-execution.md
  - .github/skills/module-definition/SKILL.md
blocked_by: []
supersedes: []
---

# Suite Definition Workflow

## Outcome

Create and validate a reusable, documentation-only workflow for defining a new
LoopDev suite before implementation. The workflow turns the CRM pilot lessons
into a repeatable product-governance capability.

## Contexto

CRM established a useful sequence of UX, component, contract, impact,
security, and implementation-handoff documents. Future suites need the same
quality bar without copying CRM-specific decisions or creating inconsistent
planning packages.

## Alcance

### Incluido

- Suite intent, users, value, and domain boundaries.
- Initial and future module map with dependencies and sequencing.
- UX and navigation definition.
- Component reuse audit and design-system gaps.
- Domain, tenancy, permissions, integration, and ownership contracts.
- Security, impact, readiness, and implementation handoff gates.
- A reusable suite template and approval checklist.
- CRM as a dry-run and traceability case study.

### Excluido

- Product code, database migrations, runtime behavior, and deployment changes.
- Rewriting CRM decisions that are already documented.
- Replacing the module-definition skill; this workflow composes it at suite level.
- Closing or changing the protected roadmap branch.

## Decisiones aprobadas

| Fecha | Decision | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-14 | Crear un workflow transversal para definir suites antes de implementar | CRM ya demostro un paquete de definicion reutilizable | Futuras suites deben pasar por una especificacion y gates comunes | User |
| 2026-08-14 | Usar CRM como caso de prueba, no como plantilla para copiar decisiones | Se necesita extraer reglas generales sin mezclar limites de dominio | El workflow debe enlazar evidencia CRM y separar lo especifico | User |
| 2026-08-14 | Mantener el trabajo en una rama documental separada del roadmap protegido | El roadmap es autoridad durable y no debe recibir cambios operativos | La propuesta llega a develop mediante PR documental | User |

## Arquitectura y contratos

The suite definition must identify its canonical modules, shared entities,
tenancy boundary, permission model, cross-suite dependencies, event and
integration ownership, package ownership, and navigation entry point. A suite
cannot enter implementation without explicit decisions for unresolved contract
questions.

## Branch strategy

This is a documentation-only branch created from `develop`. It must not modify
`docs/2026-execution-roadmap`. Merge through a PR into `develop`; preserve this
branch only if it becomes a durable reference, otherwise retain the merged
artifacts as the source of truth.

## Fases

### Fase 0: Definicion y readiness

**Objetivo:** Produce and validate the workflow package using CRM as a dry-run.

**Definition of Ready**
- [x] Scope is documentation-only.
- [x] CRM precedent and module-definition skill are identified.
- [ ] Workflow specification is complete.
- [ ] Approval checklist is complete.
- [ ] Reusable suite template is complete.
- [ ] CRM traceability review is recorded.

**Entregables**
- [ ] `docs/04-governance/SUITE_DEFINITION_WORKFLOW.md`
- [ ] `docs/04-governance/SUITE_DEFINITION_APPROVAL_CHECKLIST.md`
- [ ] `docs/04-governance/SUITE_DEFINITION_TEMPLATE.md`
- [ ] CRM case-study traceability section.

**Validacion**
- [ ] Track validator passes.
- [ ] Documentation links resolve.
- [ ] Template fields map to the approval checklist.
- [ ] No product code or database changes are included.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigacion | Responsable | Estado |
| --- | --- | --- | --- | --- |
| El workflow puede duplicar la skill de module-definition | Confusion entre niveles de gobierno | Enlazar la skill y definir suite como composicion de modulos | Platform | abierto |
| CRM puede sesgar el modelo hacia una sola suite | Workflow poco generalizable | Marcar CRM como caso de prueba y exigir limites explicitos | Platform | abierto |

## Criterios de cierre

- [ ] Workflow, checklist y template estan publicados.
- [ ] CRM fue revisado contra los gates sin alterar sus decisiones.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explicitamente por el usuario.

## Evidencia de validacion

| Fecha | Validacion | Resultado | Referencia |
| --- | --- | --- | --- |

## Handoff de sesion

- **Fecha:** 2026-08-14.
- **Rama de continuacion:** `docs/suite-definition-workflow`.
- **Commit de partida:** `22483b9`.
- **Estado alcanzado:** Track creado; artefactos del workflow pendientes de validar.
- **Decisiones, bloqueos y riesgos:** CRM se usa como caso de prueba; no se implementa codigo.
- **Validacion ejecutada:** Pendiente.
- **Siguiente accion concreta:** Completar y validar los tres documentos del workflow.

## Cierre

Pendiente de aprobacion explicita.
