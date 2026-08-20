---
title: CRM Post-Pilot Backlog
status: active
version: 1.0
created: 2026-08-20
updated: 2026-08-20
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
---

# CRM Post-Pilot Backlog

## Proposito

Este documento centraliza capacidades, decisiones y deuda técnica que no forman parte del alcance
certificado del piloto CRM, pero deben revisarse después de cerrar el piloto. No autoriza por sí solo
cambios de producto, contratos, schema, RLS o UI. Cada entrada debe convertirse en un requisito,
contrato y track de implementación aprobado antes de desarrollarse.

## Regla de clasificación

- **Deuda técnica:** una decisión o implementación provisional que debe corregirse para mantener
  calidad, seguridad, consistencia o capacidad operativa.
- **Evolución funcional:** una capacidad de producto prevista, pero fuera del alcance actual del
  piloto.
- **Dependencia transversal:** trabajo que requiere contratos o capacidades compartidas por varios
  módulos CRM.

## Entradas iniciales

| ID           | Área         | Tipo                    | Estado   | Revisión requerida                                                                                                            |
| ------------ | ------------ | ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| CRM-POST-001 | Contacts     | Evolución funcional     | Diferido | Definir segmentos rápidos `Todos`, `Mis contactos`, `Sin asignar` y `Recientes`, con queries server-side y sincronización URL |
| CRM-POST-002 | Contacts     | Evolución funcional     | Diferido | Definir `lifecycleStage` de Contact, catálogo, transiciones, ownership y read model                                           |
| CRM-POST-003 | CRM shared   | Dependencia transversal | Diferido | Definir asignación/owner, lookup autorizado de usuarios, permisos de reasignación y auditoría                                 |
| CRM-POST-004 | Contacts     | Evolución funcional     | Diferido | Definir exportación, capability `contacts.export`, formato, límites, PII, auditoría y endpoint                                |
| CRM-POST-005 | CRM shared   | Evolución funcional     | Diferido | Definir acciones masivas, límites por lote, idempotencia, autorización, auditoría y recuperación parcial                      |
| CRM-POST-006 | Contacts     | Evolución funcional     | Diferido | Enriquecer Contact con empresa, rol/puesto y relaciones autorizadas                                                           |
| CRM-POST-007 | CRM shared   | Dependencia transversal | Diferido | Exponer total/count y ordenación server-side sin romper cursor pagination                                                     |
| CRM-POST-008 | CRM shared   | Dependencia transversal | Diferido | Exponer última interacción desde actividad/Customer 360 con reglas de deduplicación y permisos                                |
| CRM-POST-009 | Contacts     | Evolución funcional     | Diferido | Completar Customer 360, detalle `workspace`, preview `split`, notas, timeline y duplicate review                              |
| CRM-POST-010 | CRM shared   | Deuda técnica           | Diferido | Sustituir errores genéricos de servicios CRM por errores tipados, trace IDs y envelopes seguros                               |
| CRM-POST-011 | CRM shared   | Deuda técnica           | Diferido | Completar pruebas remotas de RLS, concurrencia, dos organizaciones y dos marcas sin mezcla de datos                           |
| CRM-POST-012 | CRM frontend | Deuda técnica           | Diferido | Añadir cobertura Playwright de Contacts en desktop/tablet/mobile, permisos y estados de error                                 |
| CRM-POST-013 | CRM frontend | Deuda técnica           | Diferido | Certificar accesibilidad de tabla, filtros, selección, dialogs/drawers y restauración de foco                                 |
| CRM-POST-014 | CRM platform | Dependencia transversal | Diferido | Centralizar patrón de tablas, filtros, paginación, estados y timeline cuando exista un segundo consumidor real                |
| CRM-POST-015 | Contacts     | Evolución funcional     | Diferido | Definir vistas guardadas y segmentos rápidos (`All`, `My contacts`, `Unassigned`, `Recent`) con queries server-side, URL state y permisos |
| CRM-POST-016 | Contacts     | Evolución funcional     | Diferido | Añadir ordenación como control explícito del workspace, con catálogo de campos y contrato server-side compatible con cursor pagination |
| CRM-POST-017 | Contacts     | Evolución funcional     | Diferido | Añadir constructor de filtros avanzados con campo, operador, valor, grupos AND/OR, validación y query contract aprobado          |
| CRM-POST-018 | Contacts     | Evolución funcional     | Diferido | Añadir configuración de columnas y persistencia por usuario/organización, respetando PII y campos autorizados                   |
| CRM-POST-019 | Contacts     | Evolución funcional     | Diferido | Evaluar modos de vista adicionales, como tabla densa y board/kanban, solo con read models y workflows autorizados               |
| CRM-POST-020 | Contacts     | Evolución funcional     | Diferido | Añadir acciones por fila y acciones contextuales (`Open`, `Edit`, `More actions`) solo con endpoints y capabilities definidos   |
| CRM-POST-021 | CRM frontend | Deuda técnica           | Diferido | Revisar densidad responsive y la experiencia móvil de filtros, tarjetas, selección y paginación con evidencia Playwright         |

## Prioridad sugerida después del piloto

### P0: cerrar riesgos del piloto

- CRM-POST-010: errores tipados, trace IDs y envelopes seguros.
- CRM-POST-011: RLS remoto, aislamiento y concurrencia.
- CRM-POST-012: regresión E2E de Contacts y navegación CRM.
- CRM-POST-013: accesibilidad y estados críticos.

### P1: completar la operación de Contacts

- CRM-POST-002: lifecycle stage.
- CRM-POST-003: owner y asignación.
- CRM-POST-006: empresa y rol.
- CRM-POST-007: count y ordenación server-side.
- CRM-POST-008: última interacción.
- CRM-POST-001: segmentos rápidos.

### P2: acciones avanzadas

- CRM-POST-004: exportación.
- CRM-POST-005: acciones masivas.
- CRM-POST-009: Customer 360 completo y duplicate review.
- CRM-POST-014: promoción de patrones agnósticos al Design System.
- CRM-POST-015: vistas guardadas y segmentos rápidos.
- CRM-POST-016: ordenación explícita y server-side.
- CRM-POST-017: filtros avanzados y query builder.
- CRM-POST-018: configuración de columnas.
- CRM-POST-020: acciones por fila.
- CRM-POST-021: densidad responsive y experiencia móvil.

### Referencia de producto post-piloto

La revisión visual de la pantalla de Contacts de HubSpot identificó un modelo de workspace más
completo que la superficie certificada del piloto: vistas guardadas, filtros rápidos y avanzados,
ordenación explícita, configuración de columnas, modos de vista y acciones contextuales. Estas
referencias sirven para priorizar evolución, pero no autorizan copiar UI, datos, marca o contratos.

La dirección aprobable para LoopDev es mantener la separación actual de responsabilidades:

```text
ModuleHeader
  -> contexto del módulo + acción primaria
FiltersActions
  -> búsqueda + filtros + ordenación + acciones contextuales
ResponsiveTable
  -> filas + selección + estados + paginación
```

Cada capacidad debe entrar después del piloto con contrato de datos, capability, autorización,
estado responsive y pruebas focalizadas. No se deben mostrar controles vacíos o deshabilitados para
simular cobertura funcional.

## Criterio para retirar una entrada

Una entrada solo puede marcarse como completada cuando existe:

- requisito aprobado y alcance explícito;
- contrato de datos o comando actualizado;
- API, capability y autorización definidas cuando aplique;
- migración/RLS y auditoría cuando aplique;
- implementación y tests focalizados;
- evidencia de validación en el track o PR correspondiente;
- actualización de los documentos de módulo afectados.

## Relación con otros documentos

- `CRM_COMPONENT_IMPLEMENTATION_BACKLOG.md` ordena los slices principales del CRM.
- Los contratos de cada módulo definen el comportamiento aprobado actual.
- Los planes de implementación UI registran el alcance ejecutable de cada slice.
- Este backlog registra lo que queda diferido o requiere una decisión posterior al piloto.

Las entradas deben mantenerse aquí aunque afecten a varios módulos. Los detalles específicos de una
entrada pueden vivir en el contrato o track del módulo correspondiente, pero este documento conserva
su ID, prioridad y estado central.
