---
title: CRM Leads Implementation Handoff
status: approved-for-handoff
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
implementation_issue: https://github.com/minoveaz/loopdev/issues/84
implementation_branch: feature/crm-pilot-leads-implementation
---

# Handoff de implementacion: CRM Leads

## Instruccion

Use the repeatable [CRM backend-first module playbook](../shared/CRM_BACKEND_MODULE_PLAYBOOK.md)
before starting implementation.

Leer este documento y sus cuatro referencias antes de crear la rama de implementacion desde `develop`
actualizado:

```text
feature/crm-pilot-leads-implementation
```

Confirmar la Definition of Ready en el Issue #84 antes del primer commit. La rama de documentacion
`docs/2026-execution-roadmap` conserva las decisiones; esta rama futura contiene solo implementacion.

## Referencias

1. [Leads UX](CRM_LEADS_UX_SPEC.md)
2. [Leads component audit](CRM_LEADS_COMPONENT_AUDIT.md)
3. [Lead contract](CRM_LEAD_CONTRACT.md)
4. [Lead impact assessment](CRM_LEAD_IMPACT_ASSESSMENT.md)
5. [Contact implementation handoff](../contacts/CRM_CONTACT_IMPLEMENTATION_HANDOFF.md)
6. [CRM Pilot Execution](../../../../tracks/active/crm/2026-08-13-crm-pilot-execution.md)

## Outcome

Entregar lista, captura, detalle, edicion y estados de Lead; preparar una oportunidad desde Lead sin
duplicar Contact o Lead; y conservar atribucion e idempotencia de fuentes manuales, campaña,
WhatsApp simulado, referral, social y partner.

## Composicion obligatoria

```text
App Router -> SuiteRuntime -> SuiteCanvas mode=data/split/record/focus
  -> widgets -> features -> entities -> shared
```

`SuiteCanvas` no conoce Leads ni accede a datos. No crear shell o sidebar paralelo.

## Fuera de alcance

- Integraciones reales de Marketing, WhatsApp o email.
- Cotizaciones, documentos, pólizas, IA, scoring, billing y mobile CRM.
- Campos personalizados y refactor global del shell/FSD.

## Definition of Ready

- [ ] Ha leído este handoff y sus referencias.
- [ ] Ha creado la rama indicada desde `develop` actualizado.
- [ ] Ha declarado Contracts, Schema, RLS, Storage, Providers, AI, Billing, Observability y Rollback.
- [ ] Ha confirmado la dependencia del Contact contract y CRM-01.
- [ ] Ha preparado idempotencia para source/provider/externalId.
- [ ] Un Lead cualificado crea como maximo una Opportunity de conversion por producto/interes en el ID estable `qualified`.
- [ ] Pipeline puede crear Opportunities manuales adicionales, diferenciadas de `lead_conversion`.
- [ ] La primera Opportunity `lead_conversion` mueve el Lead a `convertido`; las siguientes pueden corresponder a otros productos.
- [ ] El nombre visible de la etapa puede cambiar sin cambiar IDs estables ni historico.
- [ ] Ha enlazado el Issue, Project, track, rama y evidencia.
- [ ] No hay cambios ajenos en el primer commit.
