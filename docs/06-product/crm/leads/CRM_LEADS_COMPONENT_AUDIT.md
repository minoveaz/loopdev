---
title: CRM Leads Component Audit
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
ux_spec: docs/06-product/crm/leads/CRM_LEADS_UX_SPEC.md
---

# Auditoria de componentes de Leads CRM

## Modos aprobados para la definicion UX

`SuiteCanvas` permanece generico. Para Leads se utilizan estos modos:

| Modo | Uso CRM | Regla |
| --- | --- | --- |
| `data` | Lista de Leads | Comparacion, filtros, orden y acciones masivas |
| `split` | Lista + detalle rapido | Conserva el contexto de la lista |
| `record` | Detalle directo | Ficha completa de una entidad operativa |
| `focus` | Captura completa o tarea transaccional | Una tarea principal con validacion y contexto controlado |

`record` y `focus` son modos genericos del Canvas, no modos llamados `lead-detail` o `lead-create`.
El dominio CRM se expresa en los widgets y features que se montan dentro del Canvas.

## Composicion

```text
SuiteRuntime
  -> SuiteCanvas mode=data
    -> LeadWorkspaceHeader
    -> LeadToolbar
    -> LeadTable

SuiteCanvas mode=split
  -> LeadListWidget
  -> LeadRecordPreview

SuiteCanvas mode=record
  -> LeadRecordView
    -> LeadIdentityHeader
    -> LeadAttributionPanel
    -> RelatedContactSummary
    -> RelatedOpportunityPanel
    -> LeadTimeline
    -> LeadWorkPanel

SuiteCanvas mode=focus
  -> LeadCaptureWorkspace
    -> ContactSelector
    -> LeadAttributionFields
    -> LeadForm
```

## Inventario

| Componente | Capa | Estado | Decision |
| --- | --- | --- | --- |
| SuiteRuntime/SuiteCanvas | Shell | Disponible | Reutilizar; no conoce Leads |
| ModuleHeader/PageHeader | UI | Disponible | Reutilizar |
| ModuleToolbar/ContextBar | UI | Disponible | Reutilizar/componer |
| Button/IconButton/Input/Select | UI | Disponible | Reutilizar |
| FilterDropdown/Badge | UI | Disponible | Reutilizar |
| ResponsiveTable/EmptyState/LoadingState | UI | Disponible o verificable | Reutilizar y certificar para Leads |
| Dialog accesible | UI | Debe verificarse | Reutilizar primitive existente |
| LeadWorkspaceHeader | Widget CRM | No existe | Desarrollar en CRM |
| LeadToolbar | Widget CRM | No existe como slice real | Componer primitives |
| LeadTable | Widget CRM | Prototipo parcial | Desarrollar sobre API real |
| LeadDetailPanel | Widget CRM | No existe aprobado | Desarrollar sobre Canvas split |
| LeadAttributionPanel | Widget CRM | No existe | Desarrollar |
| LeadForm | Feature CRM | No existe | Desarrollar con origen e idempotencia |
| QualifyLead | Feature CRM | No existe | Desarrollar con permisos y audit |
| CreateOpportunityFromLead | Feature CRM | No existe | Desarrollar sin duplicar contacto/lead |
| LeadFilters | Feature CRM | No existe como contrato | Desarrollar con query keys tenant-aware |
| Lead | Entity CRM | Parcial/prototipo | Crear entity con public API |
| LeadAttribution | Entity CRM | No existe | Crear entity/contract |
| LeadStatus | Entity CRM | Parcial | Formalizar estados configurables |
| LeadListWidget | Widget CRM | No existe aprobado | Desarrollar para la ruta `data` |
| LeadRecordPreview | Widget CRM | No existe | Desarrollar para la ruta `split` |
| LeadRecordView | Widget CRM | No existe | Desarrollar para la ruta `record` |
| LeadCaptureWorkspace | Widget CRM | No existe | Desarrollar para la ruta `focus` |
| QuickLeadCapture | Feature CRM | No existe | Desarrollar como dialog/drawer de captura rapida |
| ContactLookupField | Feature CRM | Parcial en Contactos | Reutilizar contrato de Contact y desarrollar adaptador de Leads |
| CreateContactFromLead | Feature CRM | No existe aprobado | Desarrollar sobre flujo de Contactos, sin duplicacion silenciosa |
| LeadAttributionFields | Feature CRM | No existe | Desarrollar para las seis fuentes del piloto |
| LeadRecordPreviewActions | Feature CRM | No existe | Desarrollar acciones seguras de inspeccion rapida |
| QualifiedLeadGuard | Feature CRM | No existe | Desarrollar validacion de estado, permisos e idempotencia |
| OpportunityResultPanel | Feature CRM | No existe | Desarrollar resultado, error y enlace a Opportunity |

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
- [x] `data`, `split`, `record` y `focus` tienen una composicion y owner explicitos.
- [x] Cada vista diferencia componentes reutilizados de componentes CRM nuevos.
- [x] Se confirma que el prototipo anterior no es fuente autoritativa.
