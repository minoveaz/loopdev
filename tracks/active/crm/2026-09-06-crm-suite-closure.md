---
id: crm-suite-closure
title: CRM Suite closure and pilot release
status: active
created: 2026-09-06
updated: 2026-09-06
owner: crm
lead: User
branch: loopdev-io-crm-suite-closure-plan
branches:
  - feature/crm-leads-quality
  - feature/leads-frontend-implementation
  - feature/communications-core-implementation
  - feature/crm-communications-inbox-implementation
  - loopdev-io-crm-suite-closure-plan
phase: 4
pull_requests: [114, 119, 121, 126, 128, 129, 130, 134, 159, 160, 173, 178]
issues:
  [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 87, 88, 89, 90, 91, 92, 94, 157, 190]
packages: ['@loopdev/contracts', 'loopdev-os', 'supabase']
release: pilot
areas: [crm, platform, governance]
dependencies: [execution-roadmap-governance]
blocked_by: [tenant-security-evidence, staging-readiness, pilot-uat]
supersedes: [estar-protegidos-crm-platform]
---

# CRM Suite closure and pilot release

## Outcome

Cerrar y certificar CRM Suite sobre `origin/develop` (`6255ec36`) para un piloto tenant-safe.
El resultado incluye Contacts, Leads, Pipeline, Tasks, Customer 360 y Communications Core/Inbox,
con evidencia reproducible de RLS, E2E, staging, observabilidad, rollback, UAT y canary.

## Contexto

El código principal de Contacts, Leads, Pipeline, Tasks y Customer 360 ya está integrado en
`develop` mediante los PRs #114, #119, #121, #126, #128, #129, #130, #134 y #178. Las ramas
`feature/crm-leads-quality` y `feature/leads-frontend-implementation` requieren una comparación
de rescate antes de archivarse. Communications Core e Inbox siguen en ramas separadas y deben
integrarse en ese orden.

## Alcance

### Incluido

- Reconciliación de ramas y contratos CRM.
- Validación de RLS por operación, integridad tenant-aware y auditoría append-only.
- Reset, seed sintético, tipos generados y pruebas de dos organizaciones.
- Certificación funcional de Contacts, Leads, Pipeline, Tasks y Customer 360.
- Implementación y certificación de Communications Core e Inbox.
- CI, staging reproducible, observabilidad, rollback, UAT y canary.
- Reconciliación de tracks, Issues y PRs antes del cierre.

### Excluido

- Canales de Communications distintos de WhatsApp.
- Automatizaciones autónomas, campañas, IA de ventas y media/attachments.
- Cierre de Issues sin evidencia verificable.
- Nuevas features CRM no requeridas para el piloto.

## Decisiones aprobadas

| Fecha      | Decisión                                                  | Motivo                                             | Impacto                                                           | Aprobado por |
| ---------- | --------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- | ------------ |
| 2026-09-06 | `origin/develop@6255ec36` es la única base de integración | Evitar duplicación y pérdida entre ramas CRM       | Todas las ramas funcionales deben partir de `develop` actualizado | User         |
| 2026-09-06 | PR #178 es la autoridad para Leads frontend               | Sustituye los intentos anteriores #175 y ramas WIP | Las ramas Leads antiguas solo se revisan para rescate             | User         |
| 2026-09-06 | Communications Core precede a Inbox                       | La UI no debe crear una segunda persistencia       | Inbox se rebasea después de integrar Core                         | User         |

## Arquitectura y contratos

La fuente de contratos es `packages/contracts/src/crm/`. La aplicación vive en
`apps/loopdev-os/src/app/api/crm`, `apps/loopdev-os/src/services/crm` y
`apps/loopdev-os/src/suites/sales-crm`. La persistencia CRM se define en
`supabase/migrations/20260827000000_crm_core_catalog_foundation.sql`,
`20260828000000_crm_lead_capture_idempotency.sql` y las migraciones posteriores de seguridad y
asignación. Communications usa las migraciones `20260829000000`,
`20260831000000` y `20260901000000`.

## Branch strategy

Este track es transversal y usa una rama de gobernanza para el plan. Las ramas funcionales solo
pueden continuar como rescate o implementación explícitamente autorizada:

- Leads: comparar `feature/crm-leads-quality` y `feature/leads-frontend-implementation` contra
  PR #178; integrar únicamente cambios faltantes.
- Communications Core: terminar `feature/communications-core-implementation` y fusionar primero.
- Communications Inbox: continuar `feature/crm-communications-inbox-implementation` después de Core.
- No abrir nuevas ramas CRM hasta completar F1 y F2.

## Fases

### Fase 0: Inventario y congelación

**Objetivo:** establecer una fuente única de verdad y clasificar todas las ramas, PRs e Issues.

**Definition of Ready**

- [x] `develop` y `origin/develop` están identificados.
- [x] Existe matriz módulo/Issue/PR/rama/SHA/evidencia.
- [x] Las ramas Leads antiguas están clasificadas como rescate o históricas.

**Entregables**

- [x] Track actualizado con el estado real.
- [x] Matriz de consolidación.
- [x] Lista de ramas autorizadas.

**Validación**

- [ ] `git status --short --branch`
- [ ] Comparación de ramas contra `origin/develop`.
- [ ] Revisión de PRs e Issues CRM.

**Evidencia:** `origin/develop@6255ec36`, PRs #114–#178, ramas CRM remotas,
`docs/06-product/crm/CRM_SUITE_CLOSURE_MATRIX.md`.

**Estado:** completada; las dos ramas Leads antiguas quedan superseded y no requieren cherry-pick CRM.

### Fase 1: Consolidación de ramas y contratos

**Objetivo:** eliminar duplicación y rescatar solo cambios no integrados.

**Definition of Ready**

- [x] F0 cerrada con matriz versionada.
- [x] `origin/develop@6255ec36` confirmado como base.
- [x] Ramas Leads históricas clasificadas como superseded.

**Entregables**

- [x] Auditoría de las dos ramas frontend antiguas de Leads.
- [x] Contratos, servicios, APIs y migraciones alineados.
- [x] Ramas históricas marcadas como superseded.

**Validación**

- [x] `@loopdev/contracts` build/typecheck.
- [x] Tests API/UI de Leads, Contacts, Pipeline, Tasks y Customer 360.
- [x] `git diff origin/develop...<rama>` revisado.

**Evidencia:** `docs/06-product/crm/CRM_SUITE_CONTRACT_ALIGNMENT.md`,
`docs/06-product/crm/CRM_SUITE_CLOSURE_MATRIX.md`, Issue #190.

**Estado:** completada; no se requieren cambios de contrato o servicio desde ramas superseded.

### Fase 2: Seguridad, datos y tenant isolation

**Objetivo:** cerrar Issues #70–#78 con evidencia reproducible.

**Entregables**

- [x] RLS separado por verbo y permiso implementado en `origin/develop`.
- [x] Integridad cross-tenant en relaciones CRM/Communications implementada.
- [x] Audit Events y Activities append-only implementados.
- [x] Reset, seed sintético y tipos reproducibles verificados juntos sobre snapshot limpio de `origin/develop`.
- [x] Matriz pgTAP de roles y dos organizaciones versionada.

**Validación**

- [x] `supabase/tests/database/005_crm_security.sql` — 47/47.
- [x] `supabase/tests/database/006_crm_tasks_contract.sql` — 30/30.
- [x] Reset Supabase desde cero sobre snapshot limpio de `origin/develop`.
- [x] Intentos positivos y negativos cross-tenant.

**Evidencia:** `docs/06-product/crm/CRM_SUITE_SECURITY_ALIGNMENT.md`,
`supabase/migrations/20260902000000_crm_security_hardening.sql`,
`supabase/migrations/20260906000000_crm_daily_operation_hardening.sql`,
`supabase/tests/database/005_crm_security.sql`,
`supabase/tests/database/006_crm_tasks_contract.sql`.

**Estado:** completada con aprobación explícita del usuario; reset limpio y 77/77 assertions pgTAP pasan.

### Fase 3: Cierre funcional CRM Core

**Objetivo:** certificar Contacts, Leads, Pipeline, Tasks y Customer 360.

**Entregables**

- [x] Cerrar #82, #84, #85, #87 y #88 con evidencia.
- [x] Recorrido persistente Contact → Lead → Opportunity → Task/Note → Customer 360.
- [x] Approved CRM route compositions delivered: Pipeline board/list/preview/detail/create,
      Tasks inbox/My Day/context/detail/create, and Customer 360 workspace/preview/overview within
      Contact detail. No Customer 360 navigation module was added.
- [ ] Eliminar fixtures y simulaciones de rutas críticas.

**Validación**

- [x] API, UI, accesibilidad y E2E autenticado.
- [x] Idempotencia de captura y Tasks.
- [x] Auditoría de asignaciones y cambios de etapa.

**Estado:** completada con aprobación explícita del usuario el 2026-09-06; las Issues #82, #84, #85, #87 y #88 fueron reconciliadas y cerradas.

### Fase 4: Communications Core e Inbox

**Objetivo:** entregar WhatsApp tenant-safe y su Inbox sin duplicar persistencia.

**Entregables**

- [x] Webhook firmado y deduplicado.
- [x] Resolución de Contact y ventana outbound.
- [x] Templates, delivery states, retries, retención y kill switch.
- [x] Inbox de conversaciones, mensajes, notas internas y asignación.
- [x] Communications Core e Inbox integrados en `develop` mediante PR #191 y #193.

**Validación**

- [x] Tests de webhook, provider, worker y permisos.
- [x] E2E Core antes de integrar Inbox.
- [x] E2E CRM + Inbox después de integrar Inbox.

**Estado:** completada técnicamente; reconciliación documental pendiente de aprobación de cierre.

### Fase 5: Calidad, staging y operaciones

**Objetivo:** probar el sistema fuera del entorno local.

**Entregables**

- [ ] Required CI gate.
- [ ] Staging reproducible.
- [ ] Logs, alertas y métricas.
- [ ] Backup, restore, rollback y purge dry-run.
- [ ] Certificación UX y accesibilidad.

**Validación**

- [ ] Issues #76–#81 y #90–#92 con evidencia.
- [ ] Migraciones aplicadas en staging limpio.
- [ ] Smoke y E2E con Auth/RLS reales.

**Estado:** pendiente

### Fase 6: UAT del piloto

**Objetivo:** validar el flujo operativo con usuarios autorizados y dataset sintético.

**Entregables**

- [ ] Usuarios, roles, organización y marcas confirmados.
- [ ] Casos UAT ejecutados.
- [ ] P0/P1 corregidos o aprobados explícitamente.
- [ ] Informe UAT firmado.

**Validación**

- [ ] Contact, Lead, Pipeline, Tasks, Customer 360 y WhatsApp.
- [ ] Casos negativos cross-tenant.
- [ ] Kill switch y rollback.

**Estado:** pendiente

### Fase 7: Canary y cierre

**Objetivo:** tomar la decisión formal de go-live y cerrar el programa.

**Entregables**

- [ ] Canary de una organización.
- [ ] Smoke post-deploy.
- [ ] Métricas de observación.
- [ ] Decisión de go-live para #94.
- [ ] Cierre o defer explícito de Issues y tracks.

**Validación**

- [ ] Cero P0.
- [ ] P1 aceptados con workaround documentado.
- [ ] Rollback ensayado.
- [ ] Aprobación explícita del usuario para cerrar el track.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha      | Cambio                                                         | Motivo                                                                                    | Impacto en alcance/fases                                       | Aprobado por |
| ---------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------ |
| 2026-09-06 | El cierre se organiza como programa de consolidación y release | El código core está mayoritariamente integrado; el riesgo está en evidencia y duplicación | Se priorizan F0–F2 antes de nuevas features                    | User         |
| 2026-09-06 | F0 queda activo con matriz versionada y ramas clasificadas     | Las ramas antiguas de Leads aún requieren comparación de rescate                          | No se archivan esas ramas hasta completar la revisión de diffs | User         |
| 2026-09-06 | F2 cerrada y F3 activada                                       | El usuario aprobó explícitamente el cierre tras 77/77 assertions pgTAP                    | Se inicia certificación funcional CRM Core                     | User         |

## Riesgos y bloqueos

| Riesgo o bloqueo                            | Impacto                                                   | Mitigación                                               | Responsable         | Estado                                          |
| ------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| Ramas Leads WIP solapadas con #178          | Pérdida o cherry-pick duplicado                           | Comparación y rescate antes de archivar                  | crm                 | abierto                                         |
| RLS genérico para `for all`                 | Mutaciones con permisos incorrectos                       | Separar políticas por verbo y probar dos tenants         | crm/platform        | mitigado en F2                                  |
| Communications Core e Inbox paralelos       | Persistencias y contratos divergentes                     | Integrar Core antes de Inbox                             | crm                 | abierto                                         |
| Staging/E2E real pendiente                  | No se puede declarar go-live                              | Completar Issues #76–#81                                 | platform/governance | abierto                                         |
| Track histórico ausente en `origin/develop` | #185 referencia rutas que no existen en la rama integrada | Publicar este track normalizado y regenerar el dashboard | crm/governance      | resuelto en esta rama; pendiente de integración |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Issues y ramas reconciliadas.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha      | Validación                                    | Resultado                                                                                                                                                                            | Referencia                                                                                               |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 2026-09-06 | F4 post-merge                                 | Communications + Inbox certificados sobre `origin/develop@2efa92a0`; 47/47 tests, pgTAP 59/59 y gates completos                                                                      | PR #191, PR #193, comentarios #157/#185                                                                  |
| 2026-09-06 | F0: matriz y clasificación de ramas           | Completado salvo rescue diff review de Leads                                                                                                                                         | `docs/06-product/crm/CRM_SUITE_CLOSURE_MATRIX.md`                                                        |
| 2026-09-06 | F1: alineación de contratos y superficies CRM | Completado; validaciones de contracts y tests focalizados correctos                                                                                                                  | `docs/06-product/crm/CRM_SUITE_CONTRACT_ALIGNMENT.md`, Issue #190                                        |
| 2026-09-06 | F2: certificación de seguridad                | Hardening SQL y matriz pgTAP revisados                                                                                                                                               | `docs/06-product/crm/CRM_SUITE_SECURITY_ALIGNMENT.md`                                                    |
| 2026-09-06 | F2: validación runtime                        | Reset limpio de `origin/develop@6255ec36`; tests 005 (47) y 006 (30) pasan                                                                                                           | `docs/06-product/crm/CRM_SUITE_SECURITY_ALIGNMENT.md`                                                    |
| 2026-09-06 | F3: inicio de certificación funcional         | Matriz de API, UI, servicios, E2E y recorrido CRM creada                                                                                                                             | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`, Issue #188                                  |
| 2026-09-06 | F3: ejecución ampliada                        | 220/220 tests de dominio y Contacts E2E 1/1 pasan; CRM matrix 18/18 ya certificada                                                                                                   | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`, Issue #188                                  |
| 2026-09-06 | F3: revisión de cobertura                     | No existe E2E persistente multi-entidad; API/servicios usan mocks fuera de dominio                                                                                                   | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`                                              |
| 2026-09-06 | F3: recorrido persistente                     | Contact capture y Lead qualification pasan; Lead conversion API devuelve 500 aunque el RPC SQL directo pasa                                                                          | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`, Issue #188                                  |
| 2026-09-06 | F3: corrección y recorrido completo           | Fix `c5aece7`; Contact → Lead → Opportunity → Task → Note → Customer 360 pasa; cross-tenant devuelve 403; Issues #82, #84, #85, #87 y #88 cerradas                                   | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`                                              |
| 2026-09-06 | F3: approved CRM route composition completion | Productive board/list/split/workspace/full-bleed/overview routes implemented with existing contracts/APIs; focused UI tests and typecheck pass; browser/staging gates remain pending | `docs/06-product/crm/CRM_SUITE_FUNCTIONAL_CERTIFICATION.md`, `apps/loopdev-os/src/suites/sales-crm/crm/` |

## Handoff de sesión

- **Fecha:** 2026-09-06.
- **Rama de continuación:** `loopdev-io-crm-suite-closure-plan`.
- **Commit de partida:** `2efa92a0e6b9eedf404c124ea79df02800241950`.
- **Estado alcanzado:** F0–F3 completadas; F4 implementada, integrada y certificada post-merge.
- **Decisiones, bloqueos y riesgos:** No se inventan rutas de track ausentes en `origin/develop`; este archivo normaliza la fuente de verdad. #185 permanece abierta hasta aprobación explícita. Fase 5 queda pendiente.
- **Validación ejecutada:** Communications + Inbox 47/47; contratos 6/6; worker 4/4 con typecheck/build; pgTAP 59/59; reset local; governance 6/6; docs links 334; `validate:full` 9 tareas; diff-check.
- **Siguiente acción concreta:** integrar este track y su dashboard en `develop`, después preparar Fase 5 de rollout protegido.

## Cierre

F2 y F3 cerradas con aprobación explícita del usuario el 2026-09-06; F4 activa.
