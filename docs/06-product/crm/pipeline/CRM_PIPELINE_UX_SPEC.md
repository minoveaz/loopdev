---
title: CRM Pipeline and Opportunities UX Specification
status: proposed
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/96
---

# Especificacion UX/UI de Pipeline y Opportunities

## 1. Proposito

Define la experiencia operativa de Opportunities y Pipeline para el piloto CRM. Pipeline permite
visualizar, comparar, crear, editar y mover Opportunities autorizadas. Una Opportunity pertenece al
mismo tenant/workspace/brand y puede relacionarse con un Contact y opcionalmente con un Lead.

Este documento permanece propuesto y no autoriza implementacion.

## 2. Navegacion y Canvas

| Superficie | Ruta | Canvas | Objetivo |
| --- | --- | --- | --- |
| Pipeline principal | `/sales-crm/pipeline` | `board` | Ver Opportunities por etapa y moverlas mediante acciones autorizadas |
| Tabla de Opportunities | `/sales-crm/pipeline/list` | `data` | Buscar, filtrar, ordenar y comparar registros |
| Detalle de Opportunity | `/sales-crm/opportunities/:opportunityId` | `record` | Consultar y operar una ficha completa |
| Lista + previsualizacion | `/sales-crm/pipeline` | `split` | Mantener board o tabla y revisar una Opportunity |
| Crear Opportunity | `/sales-crm/opportunities/new` | `focus` | Crear una Opportunity manual con Contact y producto |

`SuiteCanvas` permanece generico. `board`, `data`, `split`, `record` y `focus` son composiciones;
las reglas de Pipeline viven en widgets, features y entities bajo FSD.

## 3. Roles y acciones

| Rol | Acciones |
| --- | --- |
| Agente comercial | Ver Opportunities autorizadas, crear manual, editar permitidos, mover a etapas autorizadas, registrar nota/tarea |
| Manager | Todas las del agente, reasignar, operar el Pipeline del equipo y revisar conflictos |
| Admin Estar Protegidos | Configurar nombre/orden/activo de etapas y reglas existentes; no crea campos personalizados |
| Superdev LoopDev | Acceso privilegiado separado, con proposito, actor y auditoria |

No existe `viewer` en el piloto.

## 4. Board y tabla

El board muestra columnas de etapas activas, ordenadas por `stage_order`. Cada tarjeta muestra
Opportunity, Contact, producto, responsable, importe, fecha estimada de cierre y origen.

Acciones del board: abrir detalle, mover etapa, editar, reasignar autorizado, crear tarea/nota y
abrir Contact 360. El drag and drop no sustituye la autorizacion server-side y debe ofrecer alternativa
por menu para accesibilidad.

La tabla muestra Opportunity, Contact, Lead relacionado, producto, origen, etapa, importe, moneda,
probabilidad, responsable, fecha estimada de cierre, ultima actividad y acciones. Filtros: etapa,
producto, origen, responsable, marca, workspace, rango de cierre, Contact/Lead y Opportunities
abiertas/cerradas. Usa cursor pagination.

## 5. Crear Opportunity

La creacion manual usa `focus`. Contact es obligatorio; puede seleccionarse un Contact existente o
abrirse el flujo autorizado de Contacts. Lead es opcional para Opportunities manuales y no puede
referenciar otro tenant.

Campos obligatorios: nombre, Contact, producto/interes, etapa inicial y responsable cuando la politica
lo exija. Campos opcionales: importe, moneda, probabilidad, fecha estimada de cierre y nota inicial.
La etapa inicial configurable por regla, por defecto `qualified` cuando proceda; el ID estable nunca
se sustituye por el nombre visible.

## 6. Opportunity derivada de Lead

`origin=lead_conversion` se crea desde un Lead cualificado y conserva `contactId`, `leadId`, tenant,
workspace, brand, producto e atribucion. `contactId` y `leadId` quedan bloqueados durante la conversion.
La unicidad de conversion es `tenant + lead + product_key + origin=lead_conversion`; productos distintos
pueden producir Opportunities distintas. `origin=manual` identifica creaciones desde Pipeline y no
cambia por si solo el estado del Lead.

## 7. Etapas

Cada etapa tiene ID estable, nombre visible, orden, activo y tipo terminal (`open`, `won`, `lost`).
Admin puede cambiar nombre y orden sin cambiar IDs ni historico. Mover una Opportunity registra actor,
etapa anterior, etapa nueva, fecha y motivo cuando la regla lo exija.

## 8. Estados UX y responsive

Board, tabla, detalle y formularios cubren `loading`, `empty`, `error`, `forbidden`, `success`,
`stale` y `action pending`. Escritorio muestra board completo; tablet reduce columnas y permite
scroll controlado; mobile usa columnas secuenciales o lista, con detalle `record` y sheets para acciones.

## 9. Journeys UAT

### P1: operar board
1. Abrir Pipeline.
2. Filtrar por responsable/producto.
3. Abrir una Opportunity.
4. Moverla a una etapa autorizada.
5. Recargar y confirmar persistencia/auditoria.

### P2: crear manual
1. Crear Opportunity con Contact existente y producto.
2. Confirmar `origin=manual`.
3. Verla en board y tabla.
4. Confirmar aislamiento tenant.

### P3: conversión desde Lead
1. Abrir Lead cualificado.
2. Crear Opportunity para producto A.
3. Confirmar `origin=lead_conversion`, etapa estable y Lead convertido.
4. Crear producto B sin duplicar A.
5. Reintentar producto A y recibir la Opportunity existente.

## 10. Fuera de alcance

Cotizaciones, productos detallados, descuentos, pólizas, facturacion, forecast avanzado, scoring,
IA, documentos, integraciones externas y paridad mobile completa.

## 11. Componentes por vista

| Vista | Reutilizar | Desarrollar en CRM |
| --- | --- | --- |
| Board `board` | `ModuleHeader`, `ModuleToolbar`, `ContextBar`, `Button`, `Badge`, `KanbanBoard`, estados UX | `PipelineBoardWidget`, `OpportunityCard`, `PipelineStageColumn`, `StageMoveMenu` |
| Tabla `data` | `ResponsiveTable`, `Input`, `Select`, `Button`, `Badge`, paginacion, estados UX | `OpportunityTable`, `OpportunityFilters`, `OpportunityRowActions` |
| Detalle `record` | `ModuleHeader`, `Tabs`, `ContextBar`, `Badge`, `Button`, `IconButton`, timeline si existe | `OpportunityRecordView`, `OpportunitySummary`, `RelatedContact`, `RelatedLead`, `OpportunityTimeline` |
| Crear `focus` | `ModuleHeader`, `Input`, `Select`, `Button`, `Dialog/drawer`, estados UX | `OpportunityForm`, `ContactSelector`, `ProductField`, `StageSelector`, `OpportunityFormActions` |

## 12. Aprobacion

- [ ] Product Owner aprueba rutas, Canvas, board, tabla y detalle.
- [ ] Product Owner aprueba campos y reglas de origen.
- [ ] Tech Lead aprueba etapas, comandos, RLS e idempotencia.
- [ ] Se confirma que no se inicia implementacion en esta rama documental.
