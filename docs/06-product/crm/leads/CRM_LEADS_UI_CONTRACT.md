---
title: CRM Leads UI integration contract
status: approved
version: 1.1
created: 2026-08-22
updated: 2026-08-24
owner: crm
program_track: tracks/active/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/84
plan: CRM_LEADS_UI_IMPLEMENTATION_PLAN.md
---

# Contrato de integración UI: Leads CRM

## Alcance de Fase 0

Este documento fija el contrato que consumirán los widgets y features de Leads. La UI usa únicamente
los adaptadores HTTP de App Router y los contratos exportados por `@loopdev/contracts`; nunca accede
directamente a Supabase. Contacts permanece como dependencia de lectura/selección y fuera del alcance
de esta implementación.

## Endpoints autorizados

La entrada al módulo usa `SplitWorkspace`: el panel contextual permanece cerrado hasta seleccionar
una fila y la tabla conserva su contexto durante la inspección y las acciones.

| Operación                  | Endpoint                                        | Entrada                                                                                                                 | Respuesta                                                       |
| -------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Obtener detalle            | `GET /api/crm/leads/:leadId`                    | `organizationId`                                                                                                        | `CrmLead`                                                       |
| Contexto relacionado       | `GET /api/crm/contacts/:contactId/customer-360` | `organizationId`, `view=record`, `sections`                                                                             | Contact, Opportunities, Activity                                |
| Listar                     | `GET /api/crm/leads`                            | `organizationId`, `workspaceId?`, `status?`, `source?`, `assignedUserId?`, `cursor?`, `limit?`                          | `CrmLeadPage`                                                   |
| Capturar                   | `POST /api/crm/capture`                         | `CrmCaptureLeadCommand` con contacto existente o datos de contacto nuevo, origen, atribución e interés                  | Lead, Contact y `reused`                                        |
| Registrar nota inicial     | `POST /api/crm/notes`                           | `CreateNoteCommand` con `relationType=lead`, `relationId` e `idempotencyKey`                                            | `NoteRead` (201/200 al reintentar)                              |
| Editar                     | `PATCH /api/crm/leads`                          | `CrmUpdateLeadCommand` con `expectedUpdatedAt`                                                                          | `CrmLead`                                                       |
| Cambiar estado             | `POST /api/crm/leads/status`                    | `CrmMoveLeadStatusCommand` con `expectedUpdatedAt`                                                                      | `CrmLead`                                                       |
| Convertir Lead cualificado | `POST /api/crm/leads/conversion`                | `CrmCreateOpportunityFromLeadCommand` (`organizationId`, `leadId`, `productKey`, `name`, campos comerciales opcionales) | `CrmOpportunity`; HTTP 201 creado, 200 existente, 409 conflicto |

Todas las entradas se validan con los schemas Zod compartidos antes de llamar a la API. La lista usa
cursor pagination y el límite del contrato (1-100); la UI no debe descargar todos los Leads.

## View models

```ts
type LeadRowViewModel = {
  id: string;
  organizationId?: string;
  contactId: string;
  status: CrmLead['status'];
  statusLabel: string;
  sourceKind: CrmLead['source']['kind'];
  sourceLabel: string;
  interest: string | null;
  assignedUserId: string | null;
  brandId: string | null;
  workspaceId: string | null;
  duplicateReviewId: string | null;
  createdAt: string;
  updatedAt: string;
};

type LeadDetailViewModel = {
  lead: CrmLead;
  contact: CrmContact | null;
  opportunities: CrmOpportunity[];
  activity: ActivityItem[];
  state: 'loading' | 'ready' | 'error' | 'forbidden' | 'stale';
};
```

Los view models son presentacionales: no cambian el contrato de dominio ni contienen datos de Contact
que no devuelva una API autorizada. Las etiquetas visibles se derivan de IDs estables y pueden
localizarse sin alterar `status`, `source.kind` ni `stageKey`.

## Capabilities y errores

| Capacidad          | Permiso requerido | Comportamiento UI                                              |
| ------------------ | ----------------- | -------------------------------------------------------------- |
| Leer lista/detalle | `crm.read`        | Mostrar `loading`, `empty`, `error` o `forbidden`              |
| Editar/reasignar   | `crm.manage`      | Enviar `expectedUpdatedAt`; tratar conflicto como stale        |
| Cambiar estado     | `crm.manage`      | Permitir solo estados manuales del contrato                    |
| Capturar/converter | `crm.manage`      | Captura Fase 2; conversión Fase 4 solo para Lead `cualificado` |

La UI conserva el envelope seguro del servidor y presenta estos códigos sin exponer detalles internos:
`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`,
`IDEMPOTENCY_CONFLICT`, `INVALID_STATUS_TRANSITION` y `CONTACT_REQUIRED`.

## Evidencia de captura (Fase 2)

- `LeadForm` cubre contacto existente/nuevo, origen, asignación (vacío significa asignación automática
  al usuario autenticado), interés/producto, provider, externalId, campaña, UTM `medium/content/term` y
  nota inicial.
- La nota se registra después de capturar el Lead mediante el endpoint existente de Notes; su clave
  determinista `lead-capture-note-{leadId}` hace idempotente el reintento.
- El backend actual no persiste `utm_source` ni expone catálogo de usuarios para un selector de
  asignación. La UI no inventa esos contratos: muestra los tres campos UTM respaldados y acepta un
  UUID de usuario; `utm_source` queda diferido hasta ampliar el contrato de atribución.
- Contacts no se modifica: la captura reutiliza `findOrCreateContact` dentro del servicio de Leads y
  la búsqueda consume `GET /api/crm/contacts`.

## Evidencia de detalle (Fase 3)

- La lista usa `ModuleContextPanel` para `LeadRecordPreview`; el contenido mantiene scroll vertical
  independiente y enfoca su encabezado al cambiar de selección.
- El detalle directo usa `SuiteCanvas` con `mode="workspace"` y compone `LeadRecordView` con Contact,
  Opportunities y Activity desde el Customer 360 autorizado, sin entidad paralela.
- `crm.manage` habilita edición, reasignación por UUID y estados manuales. El backend vigente no expone
  un `version` numérico en Leads: las mutaciones usan `expectedUpdatedAt`, que la UI conserva como token
  de concurrencia. Un `409` marca el detalle como `stale` y solo un refresh explícito reemplaza datos.

## Query keys

Las consultas se identifican por un objeto serializable con esta forma:

```ts
type LeadsQueryKey = [
  'crm',
  'leads',
  {
    organizationId: string;
    workspaceId?: string;
    status?: CrmLead['status'];
    source?: CrmLead['source']['kind'];
    assignedUserId?: string;
    cursor?: string;
    limit: number;
  },
];
```

La conversión no acepta `contactId`: el servidor hereda el Contacto autorizado del Lead. La
organización es obligatoria en toda clave y petición. Cambiar organización, workspace, filtros o
cursor reinicia selección y paginación local; los reintentos de mutación no deben perder el
`expectedUpdatedAt`.

## Fixtures y kill switch

La UI de Leads usará fixtures deterministas solo para showcases o pruebas explícitamente aisladas.
No se añade un fallback silencioso para producción. Cualquier kill switch deberá ser una variable
`NEXT_PUBLIC_*` documentada, desactivada por defecto y sin datos sensibles.

## Evidencia de Fase 0

- Issue #84 y Definition of Ready confirmados por el usuario el 2026-08-22.
- Plan UI aprobado y rama autorizada.
- Endpoints contrastados con `apps/loopdev-os/src/app/api/crm/leads/` y
  `apps/loopdev-os/src/services/crm/leads.ts`.
- Contacts no modificado.

## Evidencia de conversión (Fase 4)

- `QualifiedLeadGuard` habilita la acción únicamente con `crm.manage` y estado `cualificado`.
- `CreateOpportunityFromLead` exige producto/interés, no expone un selector editable de Contacto y
  consume el endpoint existente de conversión.
- La respuesta 201/200 se presenta como creada/existente; los 409 se presentan como conflicto con
  reintento seguro.
- Tras éxito se recargan Lead, Opportunities relacionadas y Contact 360 usando los endpoints existentes.
- Contacts no se modifica. El backend RPC `crm_convert_lead` mantiene `stage_key=qualified`,
  `origin=lead_conversion`, idempotencia por Lead/producto normalizado y actualización transaccional
  del estado del Lead.

## Evidencia de Fase 5 (sin certificación visual)

- View models, adapters y mutaciones pasan en los tests focalizados (`82/82`),
  incluyendo permisos `crm.read`/`crm.manage`, conflictos `409`, reintentos
  idempotentes y envelopes de error.
- Tabla, dialog/sheet, foco, teclado y mensajes ARIA tienen cobertura
  unitaria/integración con Axe en los tests de captura, detalle y conversión.
- Typecheck, lint, shell, registry, source-contracts, ownership, links y
  governance de tracks/Supabase pasan localmente.
- La validación pgTAP cross-tenant está bloqueada por la ausencia del stack
  Docker local; staging readiness está `NOT READY` porque no existe una
  release candidate desplegada.
- Playwright y revisión visual permanecen pendientes del gate final y de la
  aprobación visual explícita del usuario. No se marca `certified`.
