---
title: CRM Leads Component Audit
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-24
owner: crm
program_track: tracks/active/crm/2026-08-13-crm-pilot-execution.md
ux_spec: docs/06-product/crm/leads/CRM_LEADS_UX_SPEC.md
---

# Auditoria de componentes de Leads CRM

## Modos aprobados para la definicion UX

`SuiteCanvas` permanece generico. Para Leads se utilizan estos modos:

| Modo         | Uso CRM                                | Regla                                                    |
| ------------ | -------------------------------------- | -------------------------------------------------------- |
| `data`       | Lista de Leads                         | Comparacion, filtros, orden y acciones masivas           |
| `split`      | Lista + detalle rapido                 | Conserva el contexto de la lista                         |
| `workspace`  | Detalle directo                        | Ficha completa de una entidad operativa                  |
| `full-bleed` | Captura completa o tarea transaccional | Una tarea principal con validacion y contexto controlado |

`workspace` y `full-bleed` son modos genericos del Canvas, no modos llamados `lead-detail` o `lead-create`.
El dominio CRM se expresa en los widgets y features que se montan dentro del Canvas.

## Composicion

```text
SuiteRuntime
  -> SuiteCanvas mode=split
    -> LeadWorkspaceHeader
    -> LeadToolbar
    -> LeadTable
    -> ModuleContextPanel (al seleccionar)

SuiteCanvas mode=split
  -> LeadListWidget
  -> LeadRecordPreview

SuiteCanvas mode=workspace
  -> LeadRecordView
    -> LeadIdentityHeader
    -> LeadAttributionPanel
    -> RelatedContactSummary
    -> RelatedOpportunityPanel
    -> LeadTimeline
    -> LeadWorkPanel

SuiteCanvas mode=full-bleed
  -> LeadCaptureWorkspace
    -> ContactSelector
    -> LeadAttributionFields
    -> LeadForm
```

## Inventario

| Componente                              | Capa        | Estado                         | Decision                                                                |
| --------------------------------------- | ----------- | ------------------------------ | ----------------------------------------------------------------------- |
| SuiteRuntime/SuiteCanvas                | Shell       | Disponible                     | Reutilizar; no conoce Leads                                             |
| ModuleHeader/PageHeader                 | UI          | Disponible                     | Reutilizar                                                              |
| ModuleToolbar/ContextBar                | UI          | Disponible                     | Reutilizar/componer                                                     |
| Button/IconButton/Input/Select          | UI          | Disponible                     | Reutilizar                                                              |
| FilterDropdown/Badge                    | UI          | Disponible                     | Reutilizar                                                              |
| ResponsiveTable/EmptyState/LoadingState | UI          | Disponible o verificable       | Reutilizar y certificar para Leads                                      |
| Dialog accesible                        | UI          | Debe verificarse               | Reutilizar primitive existente                                          |
| LeadWorkspaceHeader                     | Widget CRM  | No existe                      | Desarrollar en CRM                                                      |
| LeadToolbar                             | Widget CRM  | No existe como slice real      | Componer primitives                                                     |
| LeadTable                               | Widget CRM  | Prototipo parcial              | Desarrollar sobre API real                                              |
| LeadDetailPanel                         | Widget CRM  | No existe aprobado             | Desarrollar sobre Canvas split                                          |
| LeadAttributionPanel                    | Widget CRM  | No existe                      | Desarrollar                                                             |
| LeadForm                                | Feature CRM | No existe                      | Desarrollar con origen e idempotencia                                   |
| QualifyLead                             | Feature CRM | No existe                      | Desarrollar con permisos y audit                                        |
| CreateOpportunityFromLead               | Feature CRM | No existe                      | Desarrollar sin duplicar contacto/lead                                  |
| LeadFilters                             | Feature CRM | No existe como contrato        | Desarrollar con query keys tenant-aware                                 |
| Lead                                    | Entity CRM  | Parcial/prototipo              | Crear entity con public API                                             |
| LeadAttribution                         | Entity CRM  | No existe                      | Crear entity/contract                                                   |
| LeadStatus                              | Entity CRM  | Parcial                        | Formalizar estados configurables                                        |
| LeadListWidget                          | Widget CRM  | No existe aprobado             | Desarrollar para la ruta `data`                                         |
| LeadRecordPreview                       | Widget CRM  | Implementado; visual pendiente | Mantener en `ModuleContextPanel`, scroll independiente y foco accesible |
| LeadRecordView                          | Widget CRM  | Implementado; visual pendiente | Consumir `workspace`/`RecordWorkspace` y acciones capability-gated      |
| LeadCaptureWorkspace                    | Widget CRM  | No existe                      | Desarrollar para la ruta `full-bleed`                                   |
| QuickLeadCapture                        | Feature CRM | No existe                      | Desarrollar como dialog/drawer de captura rapida                        |
| ContactLookupField                      | Feature CRM | Parcial en Contactos           | Reutilizar contrato de Contact y desarrollar adaptador de Leads         |
| CreateContactFromLead                   | Feature CRM | No existe aprobado             | Desarrollar sobre flujo de Contactos, sin duplicacion silenciosa        |
| LeadAttributionFields                   | Feature CRM | No existe                      | Desarrollar para las seis fuentes del piloto                            |
| LeadRecordPreviewActions                | Feature CRM | No existe                      | Desarrollar acciones seguras de inspeccion rapida                       |
| QualifiedLeadGuard                      | Feature CRM | No existe                      | Desarrollar validacion de estado, permisos e idempotencia               |
| OpportunityResultPanel                  | Feature CRM | No existe                      | Desarrollar resultado, error y enlace a Opportunity                     |

## Ownership

- Shell no recibe leads, repositorios ni mutaciones.
- Widgets componen features y entities; no contienen acceso directo a Supabase.
- Features ejecutan acciones mediante contratos y APIs de aplicación.
- `@loopdev/ui` no recibe lógica de Leads sin un segundo consumidor real.
- App Router permanece delgado.

## Estados

Cada vista debe cubrir loading, empty, error, forbidden y success. Lista y detalle deben conservar
layout estable en escritorio/tablet y responsive básico en mobile web.

## Definition of Ready

- [x] UX de Leads aprobada.
- [x] Contrato e impact assessment aprobados.
- [x] Todos los componentes tienen capa y owner.
- [x] Origen manual/campaña/WhatsApp simulado/referral/social/partner e idempotencia están definidos.
- [x] `data`, `split`, `workspace` y `full-bleed` tienen una composicion y owner explicitos.
- [x] Cada vista diferencia componentes reutilizados de componentes CRM nuevos.
- [x] Se confirma que el prototipo anterior no es fuente autoritativa.

## Evidencia de Fase 3

`LeadRecordPreview` y `LeadRecordView` permanecen como widgets CRM-owned. El
primero compone el contexto cargado mediante Leads + Customer 360 en el panel
del `SplitWorkspace`; el segundo compone la ficha completa en
`RecordWorkspace`. Las mutaciones usan los comandos existentes con
`expectedUpdatedAt`, sin inventar un `expectedVersion` numérico ni un catálogo
de asignados. La certificación UI/UX sigue `in-progress` hasta revisión visual
y Playwright.

## Evidencia de Fase 4

`QualifiedLeadGuard`, `CreateOpportunityFromLead` y `OpportunityResultPanel` son
features CRM-owned. La guardia exige `crm.manage` y estado `cualificado`; el
formulario exige producto/interés y no ofrece `contactId`, que se hereda del
Lead en el RPC existente. La UI diferencia Opportunity creada, existente por
idempotencia y conflicto 409, y después refresca Lead, Opportunities y Contact
360 con los endpoints ya autorizados. Tests focalizados y Axe pasan. La
certificación UI/UX permanece bloqueada por revisión visual y Playwright
pendientes.

## Evidencia de Fase 5 — estado técnico

La matriz técnica de Leads queda verificada localmente: `99/99` tests
focalizados pasan para view models, adapters, mutaciones, permisos, conflictos,
idempotencia, asignación y Axe; la suite completa serial pasa `862/862`. Typecheck, lint,
shell (`39/39`), frontend quality gate, registry, source-contracts, ownership, links, governance de
tracks/Supabase y `git diff --check` pasan. `validate:changed` se detiene en el build por las
variables Supabase ausentes.

La cobertura de aislamiento pgTAP no pudo ejecutarse porque Docker y el
Postgres local (`127.0.0.1:54322`) no están disponibles. La migración
`supabase/migrations/20260907000000_crm_lead_assignment_scope.sql` añade FK
compuesto y RLS para impedir asignaciones fuera de la organización; su evidencia
pgTAP queda pendiente de un entorno con Supabase local. Build y
`validate:ci` quedan bloqueados por variables Supabase ausentes. Staging/UAT
están `NOT READY` sin release candidate. Playwright L1/L2/L3 y revisión visual
se reservan explícitamente para el gate final; la certificación UI/UX sigue
`in-progress`.
