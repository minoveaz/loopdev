---
title: CRM Leads Implementation Handoff
status: approved-for-handoff
version: 1.0
created: 2026-08-13
updated: 2026-09-04
owner: crm
program_track: tracks/active/crm/2026-08-13-crm-pilot-execution.md
implementation_issue: https://github.com/minoveaz/loopdev/issues/84
implementation_branch: feature/leads-frontend-implementation
ui_contract: CRM_LEADS_UI_CONTRACT.md
---

# Handoff de implementacion: CRM Leads

## Instruccion

Use the repeatable [CRM backend-first module playbook](../shared/CRM_BACKEND_MODULE_PLAYBOOK.md)
before starting implementation.

Leer este documento y sus cuatro referencias antes de crear la rama de implementacion desde `develop`
actualizado:

```text
feature/leads-frontend-implementation
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
App Router -> SuiteRuntime -> SuiteCanvas mode=data/split/workspace/full-bleed
  -> widgets -> features -> entities -> shared
```

`SuiteCanvas` no conoce Leads ni accede a datos. No crear shell o sidebar paralelo.

## Fuera de alcance

- Integraciones reales de Marketing, WhatsApp o email.
- Cotizaciones, documentos, pólizas, IA, scoring, billing y mobile CRM.
- Campos personalizados y refactor global del shell/FSD.

## Definition of Ready

- [ ] Ha leído este handoff y sus referencias.
- [x] Ha creado la rama de implementación desde `develop` actualizado.
- [ ] Ha declarado Contracts, Schema, RLS, Storage, Providers, AI, Billing, Observability y Rollback.
- [ ] Ha confirmado la dependencia del Contact contract y CRM-01.
- [ ] Ha preparado idempotencia para source/provider/externalId.
- [ ] Un Lead cualificado crea como maximo una Opportunity de conversion por producto/interes en el ID estable `qualified`.
- [ ] Pipeline puede crear Opportunities manuales adicionales, diferenciadas de `lead_conversion`.
- [ ] La primera Opportunity `lead_conversion` mueve el Lead a `convertido`; las siguientes pueden corresponder a otros productos.
- [ ] El nombre visible de la etapa puede cambiar sin cambiar IDs estables ni historico.
- [ ] Ha enlazado el Issue, Project, track, rama y evidencia.
- [ ] No hay cambios ajenos en el primer commit.

## Autorización de implementación frontend

El usuario autorizó el 2026-08-22 iniciar la implementación frontend usando
`CRM_LEADS_UI_IMPLEMENTATION_PLAN.md` como plan autoritativo. Contacts permanece fuera de alcance.

## Estado de Fase 0

Completada el 2026-08-22. El contrato de integración UI, los view models, las capabilities, los
códigos de error, las query keys y las reglas de fixtures/kill switch están documentados en
`CRM_LEADS_UI_CONTRACT.md`. La siguiente entrega es Fase 2: captura rápida y completa, con
idempotencia visible y nota inicial usando contratos existentes.

## Evidencia inicial de Fase 1

Implementados `LeadListWidget`, `LeadTable`, `LeadFilters`, `LeadContextPanel`, el adaptador HTTP y
los view models en `apps/loopdev-os/src/suites/sales-crm/leads/`. Pruebas focalizadas en
`apps/loopdev-os/src/app/sales-crm/leads/leads.test.ts` y
`apps/loopdev-os/src/app/sales-crm/leads/leads-components.test.tsx`. Contacts no fue modificado.
La revisión visual y Playwright quedan pendientes.

## Estado y evidencia de Fase 2 UI

**Estado:** implementación técnica completada el 2026-08-24; revisión visual y Playwright quedan
como gate final, por política de certificación UI.

**Implementado:** `QuickLeadCapture` y `/sales-crm/leads/new` comparten `LeadForm`, validación Zod,
contacto existente o nuevo mediante el contrato de Contacts, origen, asignación, interés/producto,
provider, externalId, campaña, UTM `medium/content/term` y nota inicial. La nota usa el endpoint
existente `POST /api/crm/notes` con la clave `lead-capture-note-{leadId}`. Los reintentos con el mismo
externalId muestran el resultado `reused` sin duplicar el Lead.

**Evidencia técnica:** `leadCaptureForm.test.ts`, `QuickLeadCapture.test.tsx`,
`LeadCaptureWorkspace.test.tsx`, `lead-capture-api.test.ts`, `api/crm/capture/route.test.ts` y
`services/crm/capture.test.ts`. El servicio valida que la asignación sea un miembro operativo
activo antes de resolver/crear contactos y reconcilia carreras del índice único como `reused`.
La migración `20260907000000_crm_lead_assignment_scope.sql` añade la misma barrera
mediante FK compuesto y RLS; queda pendiente ejecutarla con Supabase real.

**Limitaciones:** el backend actual no persiste `utm_source` ni ofrece un catálogo de asignados; no se
inventan endpoints. UTM source queda diferido y la asignación vacía usa el usuario autenticado.
La migración de alcance de asignaciones falla de forma segura si detecta registros históricos con un
asignado fuera de `organization_memberships`; staging debe auditar esos datos antes de aplicarla.

## Estado de Fase 3 — previsualización y detalle

`LeadRecordPreview` y `LeadRecordView` están implementados sobre los endpoints existentes de Leads y
Customer 360. El detalle directo se resuelve como `RecordWorkspace` (`SuiteCanvas` en `workspace`),
mientras que la lista conserva `SplitWorkspace` y su panel contextual con scroll independiente y foco
accesible. `crm.manage` habilita edición, reasignación y estados manuales; `crm.read` mantiene el
detalle en solo lectura.

El API de Leads vigente usa `expectedUpdatedAt` como token de concurrencia y no expone
`expectedVersion` numérico ni catálogo de usuarios. Un conflicto `409` se presenta como `stale` y
requiere refresh explícito; no se inventan endpoints ni se modifica Contacts. La revisión visual y
Playwright siguen pendientes.

## Estado de Fase 4 — cualificación y conversión

Implementados `QualifiedLeadGuard`, `CreateOpportunityFromLead` y
`OpportunityResultPanel`. La acción solo se muestra con `crm.manage` y estado
`cualificado`; producto/interés es obligatorio y `contactId` no forma parte del
payload: el backend lo hereda del Lead. Se consume el endpoint existente
`POST /api/crm/leads/conversion`, que usa el RPC transaccional
`crm_convert_lead`, etapa estable `qualified`, origen `lead_conversion` y
unicidad por Lead/producto normalizado.

La UI diferencia Opportunity creada (201), existente reutilizada (200) y
conflicto (409), y refresca Lead, Opportunities y Contact 360 tras éxito.
Evidence: `lead-conversion.test.tsx`, `lead-record.test.tsx`,
`conversion/route.test.ts` y `crm.test.ts`.

**Estado:** implementación técnica completada el 2026-08-24. La revisión
visual y Playwright requieren aprobación explícita del usuario y quedan
bloqueadas; no se marca certificación UI/UX. Contacts permanece sin cambios.

## Estado de Fase 5 — certificación técnica

La certificación técnica se ejecutó el 2026-08-24 sin cerrar la fase. Leads
focalizado pasa `99/99` tests y la suite completa serial pasa `862/862`,
incluyendo view models, adapters, mutaciones, permisos, conflictos, asignación,
idempotencia y Axe para tabla, dialog, foco, teclado y ARIA. Typecheck, lint,
shell `39/39`, frontend quality gate, registry, source-contracts, ownership, links,
governance de Supabase, validator de tracks y `git diff --check` también pasan.

El build/`validate:ci` está bloqueado por variables ausentes
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` durante el
prerender de `loopdev-os`. pgTAP de aislamiento no pudo conectar con
`127.0.0.1:54322` porque Docker no está disponible. No hay release candidate
desplegada en staging; la readiness y el UAT de producto quedan `NOT READY` y
solo se documenta UAT técnico local.

`validate:changed` alcanza los controles seleccionados pero se detiene en el build por la misma
configuración ausente. Playwright de L1/L2/L3 y la revisión visual se mantienen explícitamente para
el gate final, pendientes de aprobación visual del usuario. La infraestructura
detectada no contiene journeys de Leads ni un proyecto tablet. Fase 5 sigue
`in-progress`; no se declara completada ni certificada.

## Hardening prioritario 2026-09-04

- `20260907000000_crm_lead_assignment_scope.sql` incorpora preflight no-go, FK compuesto a
  `organization_memberships`, validación de rol/estado, protección del ciclo de vida de la membresía
  y RLS de escritura. Su ejecución y la nueva evidencia pgTAP quedan pendientes de Codespaces con
  Supabase/Postgres; no se certifica RLS.
- La conversión UI admite Leads `cualificado` y `convertido`, mientras el RPC conserva idempotencia
  por producto normalizado y permite productos distintos.
- Captura y nota exponen éxito parcial cuando Notes falla y permiten reintentar únicamente la nota
  idempotente, sin volver a crear el Lead.
