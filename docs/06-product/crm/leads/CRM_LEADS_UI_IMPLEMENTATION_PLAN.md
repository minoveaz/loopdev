---
title: CRM Leads UI Implementation Plan
status: approved
version: 1.0
created: 2026-08-22
updated: 2026-09-04
owner: crm
program_track: tracks/active/crm/2026-08-13-crm-pilot-execution.md
related_issue: https://github.com/minoveaz/loopdev/issues/84
backend_handoff: CRM_LEADS_IMPLEMENTATION_HANDOFF.md
component_audit: CRM_LEADS_COMPONENT_AUDIT.md
contract: CRM_LEAD_CONTRACT.md
ux_spec: CRM_LEADS_UX_SPEC.md
approver: User
approved: 2026-08-22
---

# Plan de implementacion UI: Leads CRM

## 1. Proposito y alcance

Este documento convierte la especificacion aprobada de Leads en un plan ejecutable para el frontend
de G2. El backend de Leads ya existe, pero la superficie UI no esta implementada ni certificada.
El plan debe mantenerse alineado con el contrato de Lead, el `SuiteRuntime`, el sistema global de
formularios y el backend certificado de Leads/Pipeline.

La entrega cubre:

- lista paginada de Leads autorizados;
- busqueda, filtros, ordenacion compatible y acciones autorizadas;
- captura rapida y captura completa;
- detalle en `split` y `workspace`;
- edicion, cambio de estado y reasignacion segun capability;
- conversion idempotente de Lead cualificado a Opportunity;
- integracion con Contact y Contact 360;
- feedback global y estados UX;
- validacion desktop, tablet, responsive basico mobile, accesibilidad y E2E.

Quedan fuera de alcance:

- integraciones reales de Marketing, WhatsApp o email;
- merge automatico de contactos;
- borrado masivo, conversion masiva y exportacion masiva;
- cotizaciones, documentos, polizas, IA, scoring, billing y campos personalizados;
- paridad funcional mobile completa.

## 2. Verificacion de alineacion documental

La propuesta de implementacion queda alineada con:

- `CRM_LEADS_UX_SPEC.md`: rutas, modos `data/split/workspace/full-bleed`, journeys y estados;
- `CRM_LEADS_COMPONENT_AUDIT.md`: ownership FSD y reutilizacion de primitives;
- `CRM_LEAD_CONTRACT.md`: entidad, comandos, errores, estados e idempotencia;
- `CRM_LEADS_IMPLEMENTATION_HANDOFF.md`: dependencias, Definition of Ready y exclusiones;
- `CRM_BACKEND_MODULE_PLAYBOOK.md`: orden contract -> schema/RLS -> service/API -> fixtures -> tests -> handoff;
- `CRM_CONTACTS_UI_IMPLEMENTATION_PLAN.md`: receta de trabajo para listas, formularios, feedback y
  responsive.

Correcciones aplicadas respecto a propuestas no autoritativas:

- `SuiteCanvas` permanece generico; no se crean modos `lead-detail` o `lead-create`.
- La lista usa `SplitWorkspace` desde la entrada, el detalle directo usa `RecordWorkspace` y
  la captura completa `ImmersiveWorkflow`.
- El contacto es obligatorio y siempre se reutiliza el flujo autorizado de Contacts.
- La conversion no permite cambiar `contactId`, no duplica Lead/Contact y usa idempotencia por
  `organization + lead + productKey + origin`.
- El prototipo visual solo orienta la composicion; el contrato de API y los estados autorizados son
  la fuente de verdad.

## 3. Decisiones de arquitectura

| Decision      | Implementacion                                                                  |
| ------------- | ------------------------------------------------------------------------------- |
| Rutas         | `/sales-crm/leads`, `/sales-crm/leads/new`, `/sales-crm/leads/:leadId`          |
| Canvas        | `split`, `workspace` y `full-bleed`                                             |
| Recetas       | `SplitWorkspace`, `RecordWorkspace`, `ImmersiveWorkflow`                        |
| Shell         | `PlatformHeader`, `SuiteSidebar` y `SuiteCanvas` permanecen platform-owned      |
| Ownership CRM | widgets, features, entities, view models, adapters y acciones de Leads          |
| Estado server | consumir APIs de aplicacion; nunca leer Supabase desde el navegador             |
| Query state   | query keys con organization, workspace, filtros, source y cursor                |
| Formularios   | primitives de `@loopdev/ui`, schemas Zod y feedback global compartido           |
| Responsive    | tabla desktop/tablet; tarjetas y navegacion a workspace en mobile               |
| Mutaciones    | capabilities server-side, optimistic UI solo con rollback y conflicto explicito |

Composicion obligatoria:

```text
App Router -> SuiteRuntime -> SuiteCanvas
  -> widgets -> features -> entities -> shared
```

No se crean shell, sidebar, repositorio ni reglas de negocio paralelos.

## 4. Superficies y componentes

| Superficie               | Componentes CRM principales                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Lista `data`             | `LeadListWidget`, `LeadWorkspaceHeader`, `LeadToolbar`, `LeadTable`, `LeadFilters`, `LeadBulkActions`                          |
| Previsualizacion `split` | `LeadRecordPreview`, `LeadIdentityHeader`, `LeadAttributionPanel`, `LeadWorkPanel`, `RelatedOpportunityPanel`                  |
| Detalle `workspace`      | `LeadRecordView`, `RelatedContactSummary`, `LeadTimeline`, `LeadWorkPanel`, acciones de edicion                                |
| Captura                  | `QuickLeadCapture`, `LeadCaptureWorkspace`, `ContactLookupField`, `CreateContactFromLead`, `LeadAttributionFields`, `LeadForm` |
| Conversion               | `QualifiedLeadGuard`, `CreateOpportunityFromLead`, `OpportunityResultPanel`                                                    |

Se reutilizan `ModuleHeader`, `ModuleToolbar`, `ContextBar`, `ResponsiveTable`, `StatusBadge`,
`Input`, `Select`, `Button`, `IconButton`, `Tabs`, `EmptyState`, loading/error/forbidden states,
`TechnicalDialog` y los primitives compartidos de formularios.

## 5. Plan de desarrollo por fases

### Fase 0 — Readiness y contrato UI (en curso)

**Objetivo:** cerrar la entrada tecnica antes de crear pantallas.

- [x] confirmar Issue #84, rama, track y dependencias de Contacts/Pipeline;
- [x] mapear respuestas reales de `GET/PATCH /api/crm/leads` y `POST /api/crm/leads/status`;
- [x] definir view models `LeadRowViewModel` y `LeadDetailViewModel`;
- [x] definir capabilities, errores, versionado y query keys;
- [x] confirmar fixtures y kill switches sin usar fixtures en produccion;
- [x] registrar decisiones de discrepancias documentales y obtener aprobacion del plan.

**Salida:** contrato UI aprobado, Definition of Ready completada y matriz de datos/capabilities.
La matriz queda registrada en `CRM_LEADS_UI_CONTRACT.md`.

**Estado 2026-08-22:** Issue #84 y Definition of Ready confirmados por el usuario. La rama
`feature/leads-frontend-implementation` queda autorizada para iniciar esta fase. Contacts permanece
fuera de alcance y no se modifica. La Fase 0 queda completada; la siguiente fase es la lista
operativa en `SplitWorkspace`, con el panel contextual cerrado hasta seleccionar un Lead.

### Fase 1 — Lista Leads `split` (en curso)

**Objetivo:** entregar la superficie operativa principal.

- construir `LeadListWidget` sobre `SplitWorkspace`, con `ModuleContextPanel` contextual;
- implementar busqueda con debounce, filtros autorizados y cursor pagination;
- renderizar tabla desktop/tablet y transformacion semantica a tarjetas mobile;
- incluir columnas y acciones respaldadas por el read model;
- cubrir loading, empty, filtros sin resultados, error, forbidden y success;
- integrar feedback global para acciones y errores.

**Estado 2026-08-24:** primera implementación y pruebas técnicas focalizadas completadas. La lista usa
`SplitWorkspace`; el panel contextual se integra mediante `SuiteRuntime`. La validación server-side
de asignaciones ahora exige un miembro operativo activo de la organización antes de resolver o crear
el Contacto, y las carreras de captura por la clave única se reconcilian como `reused`. La revisión
visual y E2E siguen pendientes.

**Salida:** listado usable y persistente contra API real.

### Fase 2 — Captura de Lead (implementación técnica completada)

**Objetivo:** crear Leads sin duplicar Contactos.

- implementar `QuickLeadCapture` en `TechnicalDialog`/presentacion mobile equivalente;
- implementar `/sales-crm/leads/new` con `ImmersiveWorkflow`;
- integrar `ContactLookupField` y `CreateContactFromLead`;
- implementar origen, asignacion, interes/producto, campaign, UTM, provider, externalId y nota;
- aplicar validacion Zod, permisos, tenant/workspace y reintento seguro;
- mostrar resultado con acceso al detalle, tarea, nota o lista.

**Estado 2026-08-24:** journeys L1 y L2 implementados con `TechnicalDialog` y `ImmersiveWorkflow`.
`LeadForm` valida contacto, origen, asignación, interés/producto y atribución (provider, externalId,
campaña y UTM respaldado por el API), y persiste la nota inicial mediante el endpoint idempotente
existente de Notes. Un reintento con el mismo `source + externalId` devuelve `reused: true` y el
resultado lo comunica explícitamente; una carrera contra el índice único se reconcilia sin duplicar.
La asignación se valida contra `organization_memberships` activo antes de cualquier efecto lateral.
La captura de contacto nuevo reutiliza el contrato de Contacts desde el servicio de Leads; no se
modificó Contacts.

**Limitaciones documentadas:** el contrato actual no persiste `utm_source` ni ofrece un catálogo de
usuarios para asignación; se exponen `utm_medium`, `utm_content` y `utm_term`, y asignación vacía
significa el usuario autenticado. La migración de alcance de asignaciones falla de forma segura ante
asignaciones históricas sin membresía; staging debe auditar ese caso antes de aplicarla. No se inventan
endpoints ni se activa Marketing/WhatsApp real.
La revisión visual y Playwright quedan deliberadamente para el gate final.

**Hardening 2026-09-04:** captura y nota ya no comparten un único estado de error. Si el Lead se
persiste y Notes falla, ambas superficies muestran éxito parcial, conservan el Lead creado y
reintentan solo la nota idempotente.

**Salida técnica:** journeys L1 y L2 funcionales, incluyendo idempotencia visible al reintentar.

### Fase 3 — Previsualizacion y detalle

**Objetivo:** inspeccionar y operar un Lead conservando contexto.

- implementar `split` con scroll independiente y foco accesible;
- implementar `LeadRecordPreview` con estado, atribucion, contacto, oportunidad y actividad;
- implementar `/sales-crm/leads/:leadId` con `RecordWorkspace`;
- añadir edicion, reasignacion y cambio de estado segun capabilities;
- manejar `expectedVersion`, conflicto/stale y refresh seguro;
- enlazar Contact 360 sin crear una entidad paralela.

**Estado 2026-08-24:** implementación técnica completada. `LeadRecordPreview` carga el Lead y el
contexto autorizado de Customer 360, mantiene scroll independiente en el panel y devuelve foco al
encabezado al cambiar la selección. `/sales-crm/leads/:leadId` usa `RecordWorkspace` mediante
`SuiteCanvas mode="workspace"` y `LeadRecordView`. Edición, reasignación y estados se ocultan sin
`crm.manage`; conflictos `409` marcan `stale` y requieren `Actualizar datos` antes de reemplazar el
formulario. El contrato vigente no ofrece `expectedVersion` numérico ni catálogo de asignados, por lo
que se usa `expectedUpdatedAt` y un UUID de usuario; no se inventa una capacidad adicional.

**Evidencia:** `LeadRecordPreview.tsx`, `LeadRecordView.tsx`, `lead-record.test.tsx`,
`app/api/crm/leads/[leadId]/route.test.ts` y `shellRouting.test.ts`. Revisión visual y Playwright
siguen pendientes como gate final.

**Salida:** detalle completo y acciones autorizadas en desktop, tablet y mobile basico.

### Fase 4 — Cualificacion y conversion

**Objetivo:** completar Lead -> Opportunity.

- implementar `QualifiedLeadGuard`;
- habilitar conversión en estado `cualificado` y, para productos adicionales, `convertido`;
- construir `CreateOpportunityFromLead` con producto/interes obligatorio;
- bloquear el `contactId` heredado;
- mostrar resultado idempotente, oportunidad existente o conflicto;
- refrescar Lead, Opportunity y Contact 360 sin duplicados;
- respetar etapa estable `qualified` y origen `lead_conversion`.

**Salida:** journey L3 completo, incluyendo reintento del mismo producto y productos distintos.

**Estado 2026-08-24:** implementación técnica completada. `QualifiedLeadGuard` limita la acción a
Leads `cualificado` con `crm.manage`; `CreateOpportunityFromLead` exige producto/interés y bloquea
`contactId`, que el backend hereda del Lead. La UI consume el endpoint existente y diferencia
Opportunity creada (201), existente (200) y conflicto (409). Tras éxito refresca Lead,
Opportunities relacionadas y Contact 360. Evidence: `lead-conversion.test.tsx`,
`lead-record.test.tsx`, `conversion/route.test.ts` y `crm.test.ts`.

La revisión visual y Playwright quedan bloqueados hasta aprobación visual explícita del usuario; no
se reclama certificación UI/UX ni se inventan endpoints. Contacts permanece fuera de alcance.

**Hardening 2026-09-04:** la guardia UI se alinea con el RPC, que ya acepta `convertido`. El mismo
producto sigue devolviendo la Opportunity existente y otro `productKey` crea una Opportunity
adicional.

### Fase 5 — Certificacion

**Objetivo:** demostrar que G2 frontend cumple el contrato.

- unit/integration tests de view models, adapters y mutaciones;
- Playwright para L1, L2 y L3 en desktop/tablet y responsive basico;
- accesibilidad de tabla, dialog, sheets, foco, teclado y mensajes ARIA;
- validacion de tenant isolation, permisos, conflictos e idempotencia;
- typecheck, lint, build y registry/governance checks existentes;
- evidencia de staging readiness y UAT tecnico/visual.

**Salida:** evidencia enlazada al track, Issue #84 y PR; recomendacion de cierre frontend de G2.

**Estado de Fase 5 — certificación técnica (2026-08-24):** ejecutada de forma
parcial y no cerrada. Los tests focalizados de Leads (view models, adapters,
mutaciones, permisos, conflictos, idempotencia, asignación y Axe) pasan `99/99`;
la suite completa en modo serial pasa `862/862`. También pasan typecheck, lint, shell
`39/39`, `pnpm registries:check`, `pnpm certification:source-contracts`,
`pnpm contracts:ownership:check`, `pnpm docs:links:check`,
`pnpm validate:supabase-governance`, `node scripts/tracks/validate-tracks.mjs`,
`pnpm front:check` y `git diff --check`. `pnpm validate:changed` alcanza los controles
seleccionados pero se detiene en el build por las variables Supabase ausentes.

El build y `pnpm validate:ci` quedan bloqueados al prerenderizar
`loopdev-os`: el entorno no tiene `NEXT_PUBLIC_SUPABASE_URL` ni
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. La prueba pgTAP de aislamiento
(`supabase test db --local supabase/tests/database/005_crm_security.sql`) no
puede conectarse a `127.0.0.1:54322` y Docker no está disponible. La readiness
de staging/UAT queda `NOT READY`: no existe release candidate desplegada en
staging, por lo que el UAT técnico documenta únicamente la evidencia local.

Playwright L1/L2/L3 (desktop/tablet/responsive) y la revisión visual se dejan
explícitamente para el gate final: la política de certificación exige
aprobación visual explícita antes de iniciar Playwright y la infraestructura
actual solo registra proyectos desktop, mobile y mobile-compact, sin journey
de Leads ni proyecto tablet. Fase 5 permanece `in-progress`; no se declara
certificada.

## 6. Criterios de aceptacion

- Ningun Lead se crea, edita o convierte sin `contactId` valido y autorizado.
- La lista nunca descarga todos los Leads y conserva cursor/query state.
- En mobile no se fuerza el modo split; se navega al detalle `workspace`.
- Los estados de Lead son los del contrato y cada cambio queda auditado.
- La conversion crea exactamente una Opportunity por producto normalizado y reintentos devuelven la
  existente.
- Las mutaciones respetan capabilities, versionado optimista y aislamiento tenant.
- Los errores no exponen PII ni detalles internos y muestran feedback accionable.
- No se introducen componentes CRM en `@loopdev/ui` sin segundo consumidor real.

## 7. Dependencias y riesgos

| Riesgo/dependencia                     | Mitigacion                                                            |
| -------------------------------------- | --------------------------------------------------------------------- |
| Contact lookup/create incompleto       | reutilizar contrato y flujo certificado de Contacts                   |
| Read model sin actividad o duplicado   | ocultar columnas sin contrato; usar estados explícitos                |
| Conflictos por concurrencia            | expected version, rollback y refresh                                  |
| Conversion duplicada                   | idempotency key y constraint backend                                  |
| Diferencias entre documentos y backend | contrato/API autoritativos y registrar cualquier cambio               |
| Staging/UAT pendiente                  | no cerrar G2 hasta ejecutar readiness review contra release candidate |

## 8. Evidencia requerida

- plan aprobado y Definition of Ready del Issue #84;
- contrato/typecheck y auditoria de componentes;
- tests de rutas, servicios, view models y formularios;
- Playwright de L1/L2/L3;
- evidencia responsive y accesibilidad;
- evidencia de permisos, RLS, aislamiento, conflictos e idempotencia;
- staging readiness review, UAT y enlace al PR final.
