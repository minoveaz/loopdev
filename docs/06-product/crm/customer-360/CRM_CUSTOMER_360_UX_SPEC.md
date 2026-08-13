---
title: CRM Customer 360 UX Specification
status: proposed
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/88
---

# Especificacion UX/UI de Customer 360

## 1. Proposito

Customer 360 es una vista agregada del Contact autorizado. No crea una entidad paralela ni duplica
Contacts, Leads, Opportunities, Tasks, Notes o TimelineEvents. Daily Operation usa Customer 360 como
contexto transversal de G3.

## 2. Navegacion y Canvas

| Superficie | Ruta | Canvas | Objetivo |
| --- | --- | --- | --- |
| Customer 360 desde Contact | `/sales-crm/contacts/:contactId` | `record` | Ver el perfil y actividad agregada |
| Previsualizacion contextual | Desde Leads/Pipeline/Tasks | `split` | Consultar resumen sin abandonar el contexto |
| Resumen operativo | Desde CRM | `overview` | Mostrar salud y actividad autorizada |

Customer 360 vive dentro del detalle de Contact y no aparece como módulo independiente en la navegación.

## 3. Secciones

- Perfil del Contact.
- Leads relacionados.
- Opportunities relacionadas.
- Tasks abiertas, vencidas y recientes.
- Notes autorizadas.
- Timeline agregada.
- Resumen de actividad y próximos pasos.

Cada actividad aparece una sola vez mediante `ActivitySource`.

## 4. Acciones

- Abrir Contact completo.
- Abrir Lead.
- Abrir Opportunity.
- Abrir Task.
- Crear Task contextual.
- Añadir Note autorizada.
- Filtrar Timeline por tipo y fecha.

No se permiten mutaciones cross-tenant ni editar TimelineEvents.

## 5. Privacidad y estados UX

PII confidencial solo aparece con permiso. Notes no aparecen en logs, analytics ni errores. La vista
cubre `loading`, `empty`, `error`, `forbidden`, `success`, `stale` y `conflict`.

## 6. Responsive

Desktop usa resumen y actividad en dos áreas; tablet apila secciones; mobile usa una columna con
secciones colapsables y acciones en sheets. No hay scroll horizontal.

## 7. Componentes

| Vista | Reutilizar | Desarrollar en CRM |
| --- | --- | --- |
| Record | `ModuleHeader`, `ContextBar`, `Tabs`, `Badge`, estados UX | `Customer360RecordView`, `ContactProfileSummary`, `RelatedLeads`, `RelatedOpportunities`, `RelatedTasks`, `AuthorizedNotes`, `Customer360Timeline` |
| Split | `ContextBar`, `Button`, `Badge`, `Tabs` | `Customer360Preview`, `Customer360QuickActions` |
| Overview | `ModuleHeader`, `ContextBar`, `Badge`, estados UX | `Customer360Summary`, `ActivityHealthSummary` |

## 8. Fuera de alcance

Familia, documentos, cotizaciones, pólizas, datos de salud, comunicaciones reales, scoring, IA,
forecast y dashboard financiero.

## 9. Aprobacion

- [ ] Product Owner aprueba alcance, vistas y secciones.
- [x] Product Owner aprueba alcance, vistas `record`, `split` y `overview`, secciones y composición de componentes.
- [x] Product Owner aprueba secciones, permisos por sección, carga parcial y deduplicación mediante `ActivitySource`.
- [ ] Tech Lead aprueba agregación, permisos, deduplicación y contratos.
- [ ] Se confirma Customer 360 dentro de Contact, no como módulo de navegación independiente.
