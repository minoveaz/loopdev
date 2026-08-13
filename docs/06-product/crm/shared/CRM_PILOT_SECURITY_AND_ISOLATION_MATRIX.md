---
title: CRM Pilot Security and Isolation Matrix
status: approved
version: 1.0
created: 2026-08-13
updated: 2026-08-13
owner: platform
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issues: "#70, #71, #72, #73, #74"
---

# Matriz de Seguridad y Aislamiento del Piloto CRM

## 1. Propósito

Esta matriz define qué operaciones puede realizar cada rol, qué scope debe aplicar RLS, qué
invariante de integridad debe cumplirse y qué evidencia demuestra el aislamiento. Es un gate de G1 y
una entrada obligatoria de la readiness review antes de pruebas o UAT.

La matriz no implementa políticas. Especifica el contrato que deben cumplir schema, RLS, APIs/BFF,
frontend, pgTAP, E2E y auditoría.

## 2. Scope obligatorio

Toda lectura o mutación debe resolver server-side:

```text
organization/tenant -> workspace -> brand -> membership -> entity ownership/relation
```

Reglas:

- El navegador nunca usa `service_role`.
- RLS se aplica por verbo, no solo por tabla.
- FKs y constraints son tenant-aware.
- Una referencia a otra entidad debe compartir tenant y workspace autorizados.
- Desactivar membership, workspace u organización revoca el acceso aplicable.
- Customer 360 es una proyección autorizada y no un bypass de RLS.
- Superdev usa un camino privilegiado separado, con propósito, actor y auditoría.

## 3. Roles

| Rol | Scope ordinario | Capacidades base |
| --- | --- | --- |
| Agente | Membership activa y alcance asignado | Leer y mutar entidades autorizadas; completar Tasks; mover etapas permitidas |
| Manager | Workspace/equipo autorizado | Acciones de agente; reasignar; revisar duplicados; operar equipo |
| Admin | Organización/workspaces administrados | Configurar reglas y etapas existentes; no crea campos personalizados |
| Superdev | Camino privilegiado separado | Soporte cross-tenant excepcional, siempre con propósito y auditoría |
| Viewer | No habilitado en el piloto | No existe como rol operativo del piloto |

## 4. Matriz por entidad y verbo

| Entidad | Verbo | Agente | Manager | Admin | Superdev | Control obligatorio | Evidencia |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contact | SELECT | Scope asignado | Workspace/equipo | Organización | Privilegiado auditado | tenant + workspace + membership | pgTAP + E2E |
| Contact | INSERT | Sí, scope autorizado | Sí | Sí | Auditado | tenant-aware FK | integration + E2E |
| Contact | UPDATE | Propio/autorizado | Equipo | Sí | Auditado | ownership + version | integration |
| Contact | MERGE | No automático | Sí, revisión | Sí | Auditado | mismo tenant + audit | DB + E2E |
| Lead | SELECT | Scope asignado | Equipo | Organización | Privilegiado auditado | tenant/workspace | pgTAP + E2E |
| Lead | INSERT | Sí | Sí | Sí | Auditado | Contact same tenant | integration |
| Lead | UPDATE | Autorizado | Equipo | Sí | Auditado | ownership + version | integration |
| Lead | MOVE_STATUS | Permitido | Permitido | Configura reglas | Auditado | transition + audit | E2E |
| Opportunity | SELECT | Scope asignado | Equipo | Organización | Privilegiado auditado | tenant/workspace/brand | pgTAP + E2E |
| Opportunity | INSERT | Sí, manual | Sí | Sí | Auditado | Contact same tenant | integration |
| Opportunity | UPDATE | Autorizado | Equipo | Sí | Auditado | version + permission | integration |
| Opportunity | MOVE_STAGE | Etapas permitidas | Equipo | Configura etapas | Auditado | active stage + audit | E2E |
| Opportunity | REOPEN | No ordinario | Sí | Sí | Auditado | reason + elevated permission | E2E + audit |
| Task | SELECT | Propia/asignada | Equipo | Organización | Privilegiado auditado | relation same scope | pgTAP + E2E |
| Task | INSERT | Sí | Sí | Sí | Auditado | relation integrity | integration |
| Task | COMPLETE | Propia/asignada | Equipo | Sí | Auditado | version + audit | integration + E2E |
| Task | REOPEN | Según política | Sí | Sí | Auditado | reason + version | E2E + audit |
| Task | ASSIGN | Según regla | Equipo | Sí | Auditado | target membership | integration |
| Note | SELECT | Permissioned | Permissioned | Permissioned | Auditado | note permission + scope | policy test |
| Note | INSERT | Permissioned | Sí | Sí | Auditado | relation same scope | integration |
| Note | UPDATE | Author/policy | Moderación | Moderación | Auditado | version + policy | integration + audit |
| TimelineEvent | SELECT | Permissioned | Permissioned | Permissioned | Auditado | append-only read | pgTAP + E2E |
| TimelineEvent | INSERT | Indirect/system | Indirect/system | Indirect/system | Auditado | transaction source | DB + audit |
| TimelineEvent | UPDATE/DELETE | No | No | No | No ordinary path | append-only | negative test |
| Customer 360 | SELECT | Contact scope | Workspace scope | Organization | Privilegiado auditado | source permissions + dedup | integration + E2E |
| Customer 360 | MUTATE | Via source contract only | Via source contract | Via source contract | Auditado | no projection bypass | negative test |
| PipelineStage | SELECT | Workspace | Workspace | Organization | Auditado | workspace scope | pgTAP |
| PipelineStage | CONFIGURE | No | No | Sí | Auditado | admin + stable IDs | E2E + audit |

## 5. Aislamiento entre tenants

Todas estas operaciones deben fallar con `FORBIDDEN`, `NOT_FOUND` o `CROSS_TENANT_REFERENCE` según el
contrato, sin filtrar existencia o datos:

| Caso | Resultado esperado | Evidencia |
| --- | --- | --- |
| Tenant A lee entidad de Tenant B | Denegado | pgTAP + Auth E2E |
| Tenant A muta entidad de Tenant B | Denegado y sin cambio | pgTAP + integration |
| Tenant A crea Lead con Contact de Tenant B | Denegado | FK/constraint + integration |
| Tenant A crea Task con Opportunity de Tenant B | Denegado | relation test |
| Tenant A consulta Customer 360 de Tenant B | Denegado | API/E2E |
| Workspace A referencia Workspace B | Denegado | FK/RLS |
| Brand A filtra datos de Brand B sin scope | Denegado | query test |
| Membership revocada accede a datos | Denegado | kill-switch E2E |
| Workspace desactivado recibe mutación | Denegado | kill-switch integration |
| Organización desactivada recibe lectura | Denegado | kill-switch E2E |
| Superdev accede cross-tenant sin propósito | Denegado y alertado | privileged audit |

## 6. Kill switches

| Switch | Lectura | Mutación | Evidencia |
| --- | --- | --- | --- |
| Membership inactive | Denegar | Denegar | Auth E2E |
| Workspace inactive | Denegar | Denegar | integration |
| Organization inactive | Denegar | Denegar | E2E |
| Privileged path disabled | N/A | Denegar operación privilegiada | audit/log |

La denegación debe ser server-side, inmediata según la política de cache y sin confiar en el estado del
cliente.

## 7. Auditoría

Registrar, sin PII innecesaria:

- Actor y tipo de actor.
- Propósito en acciones privilegiadas.
- Tenant/workspace/brand scope.
- Entidad y verbo.
- Resultado.
- Request/correlation ID.
- Timestamp.
- Motivo en merge, reapertura o moderación.
- Versiones afectadas cuando aplique.

No registrar:

- Tokens o secretos.
- Payloads completos.
- Cuerpos de Notes.
- Datos personales innecesarios.
- Datos de otro tenant.

La auditoría de mutaciones críticas es append-only.

## 8. Evidencia y criterios de G1

G1 no puede marcarse validado hasta disponer de:

- Policies RLS por verbo revisadas.
- FKs y constraints tenant-aware verificadas.
- Matriz pgTAP ejecutada.
- Dos tenants sintéticos con datos separados.
- Pruebas Auth E2E con agente, manager y admin.
- Pruebas negativas de lectura, mutación y referencia cross-tenant.
- Kill switches demostrados.
- Auditoría append-only comprobada.
- Required CI gate activo.
- E2E crítico sin bypass de RLS/Auth.

## 9. No-go conditions

- Cualquier lectura o mutación cross-tenant exitosa.
- Referencia cross-tenant aceptada por schema, API o UI.
- RLS ausente o aplicada solo en frontend.
- Service role expuesto en requests ordinarias.
- Kill switch que revoca solo la UI pero no el backend.
- Audit mutable o con payloads sensibles.
- Customer 360 que bypassa permisos de la entidad fuente.
- Viewer operativo habilitado sin decisión aprobada.

## 10. Estado

```text
Matriz documental: propuesta
G1: pendiente de ejecución y evidencia
Owner operativo: User
Issues relacionados: #70, #71, #72, #73, #74
```
