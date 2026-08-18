---
id: saas-backend-infrastructure
title: SaaS backend and infrastructure foundation
status: planned
created: 2026-08-18
updated: 2026-08-18
owner: platform
lead: User
branch: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: pilot
areas: [platform, governance, crm]
dependencies: [execution-roadmap-governance, crm-pilot-execution]
blocked_by: []
supersedes: []
---

# SaaS backend and infrastructure foundation

## Outcome

LoopDev dispone de una base backend e infraestructura reproducible para operar el piloto CRM
con seguridad multi-organización, contratos reutilizables, despliegues controlados en Render,
Supabase separado por entorno y evidencia suficiente para promover cambios sin depender de
validaciones manuales u ocultas.

## Contexto

El frontend ya cuenta con una arquitectura gobernada de composición. El backend debe aplicar el
mismo principio: las rutas no inventan autorización ni acceso a datos; consumen contratos,
casos de uso y repositorios autorizados. La rama `feature/crm-shared-foundation` contiene la
primera implementación CRM, pero su RLS, integridad relacional, pruebas reales y operación aún
no están certificadas.

Este track es transversal y coordina la fundación de plataforma con los delivery tracks CRM.
No sustituye `crm-pilot-execution` ni implementa las pantallas del CRM.

## Alcance

### Incluido

- Hardening de PostgreSQL/RLS para organization, workspace, membership, capability y auditoría.
- Constraints y FKs compuestas para impedir referencias cross-organization.
- Contratos Zod de comandos, respuestas, errores, paginación e idempotencia.
- Kernel server-side reutilizable para tenancy, autorización, auditoría, errores y observabilidad.
- Supabase local reproducible: migrations, seed sintético, tipos generados y pgTAP.
- Gates locales y CI para schema, RLS, contratos, typecheck y release.
- Entornos DEV, STAGING y PROD con proyectos Supabase y secretos separados.
- Servicio web en Render, health checks, logs estructurados, monitorización, rollback y restore drill.
- Integración futura con Vitablue solo mediante contratos, eventos, API o webhooks versionados.

### Excluido

- Microservicios, Kubernetes, Kafka, Redis o un worker permanente sin consumidor real.
- Billing, checkout y autoservicio comercial.
- WhatsApp outbound, IA autónoma y nuevas integraciones no requeridas por el piloto.
- Migración global del frontend o refactor del shell.
- Acceso directo de Vitablue a la base de datos de LoopDev.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-18 | Mantener Supabase como Auth, PostgreSQL, RLS y Storage | Ya existe inversión y el riesgo actual está en invariantes y evidencia | Se endurece la plataforma sin cambiar de proveedor | User |
| 2026-08-18 | Mantener Next.js como BFF y monolito modular | Reduce coordinación y mantiene autorización cerca del request | Las rutas delegan en módulos server-side | User |
| 2026-08-18 | Usar Render para el runtime web y separar staging/producción | Permite promoción explícita y rollback controlado | Cada entorno tendrá configuración y secretos propios | User |
| 2026-08-18 | Tratar Vitablue como incubadora desacoplada | Permite experimentar sin perforar el aislamiento del SaaS | Toda integración futura tendrá un contrato explícito | User |

## Arquitectura y contratos

```text
packages/contracts/
  platform/                    # errores, paginación, tenancy y capacidades
  crm/                         # comandos, queries, respuestas y eventos CRM

apps/loopdev-os/src/server/
  platform/{tenancy,access,audit,observability}/
  modules/crm/{domain,application,infrastructure}/

apps/loopdev-os/src/app/api/
  # adaptadores HTTP delgados; sin reglas de negocio ni acceso directo a tablas

supabase/
  migrations/                  # historial reproducible de schema, RLS y funciones
  tests/database/              # pgTAP de aislamiento e invariantes
```

Cada request sigue `sesión -> organization -> workspace -> capability -> contrato -> caso de
uso -> repositorio -> respuesta`. El navegador nunca usa `service_role`. Las mutaciones críticas
escriben estado, auditoría y outbox en una transacción cuando exista un consumidor asíncrono.

## Branch strategy

Este track es un programa transversal. La rama actual `minoveaz-saas-backend-infrastructure`
prepara la definición y el primer slice de plataforma. La ejecución posterior se dividirá en
ramas cortas desde `develop`, al menos:

- `feature/platform-supabase-hardening`
- `feature/platform-backend-kernel`
- `chore/platform-render-environments`

Los delivery tracks CRM consumirán estos contratos y no duplicarán RLS, tenancy ni observabilidad.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** convertir el diagnóstico en una secuencia aprobada y verificable.

**Definition of Ready**

- [x] Autoridad multi-organización, RLS, API y entornos identificada.
- [x] Riesgos bloqueantes de CRM documentados.
- [x] Dependencias con `crm-shared-foundation` y `crm-pilot-execution` identificadas.
- [ ] Owners, secretos, proyectos Supabase y servicios Render confirmados.
- [ ] Criterios de promoción y rollback aprobados.

**Entregables**

- [x] Track transversal de infraestructura creado.
- [ ] Matriz de servicios, variables y responsables por entorno.
- [ ] ADR de backend modular y boundary de `service_role`.
- [ ] Backlog de migraciones de hardening y pruebas.

**Validación**

- [x] `node scripts/tracks/validate-tracks.mjs`.
- [x] `pnpm docs:links:check`.
- [ ] Inventario documental regenerado y validado.

**Evidencia:** El diagnóstico inicial queda registrado en el contexto de la sesión; la
implementación y certificación permanecen pendientes.

**Estado:** en progreso de readiness

### Fase 1: Supabase security foundation

**Objetivo:** impedir cross-organization access y mutaciones no autorizadas.

**Entregables:** policies por verbo, FKs compuestas, auditoría append-only, kill switches,
seed reproducible, tipos generados y pgTAP CRM/Communications.

**Gate:** `supabase db reset`, lint y tests de dos organizaciones con casos positivos y negativos.

### Fase 2: Backend reusable kernel

**Objetivo:** evitar que cada módulo invente su propio backend.

**Entregables:** resolución de contexto, capabilities, envelope de API, `traceId`, errores
estables, cursor compuesto, idempotencia, transacciones y mappers.

**Gate:** tests de contrato, integración y route handlers contra Supabase local autenticado.

### Fase 3: Render and environment operations

**Objetivo:** hacer reproducibles y reversibles los despliegues.

**Entregables:** `render.yaml`, staging/production, health live/ready, secrets, logs JSON,
Sentry o equivalente, alertas, rollback y restore drill.

**Gate:** promoción staging, check agregado obligatorio y rollback probado.

### Fase 4: CRM pilot certification

**Objetivo:** certificar el flujo CRM crítico sobre la fundación real.

**Entregables:** Contacts, Leads, Pipeline, Tasks, Notes, Timeline y Customer 360 por slices
verticales; UAT privado y canary por organization entitlement.

**Gate:** cero P0/P1 de aislamiento, UAT aprobado y decisión explícita de producción controlada.

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Policy CRM `FOR ALL` concede más capacidad de la prevista | Borrado o mutación no autorizada | Migración nueva con policies separadas por verbo y pgTAP | platform/crm | abierto |
| Relaciones CRM sin FK compuesta | Referencias cross-organization | Constraints tenant-aware y pruebas negativas | platform/crm | abierto |
| Seed configurado no existe | Reset local/CI no reproducible | Corregir configuración y usar solo datos sintéticos | platform | abierto |
| No existe configuración Render versionada | Deploy manual y rollback débil | Crear `render.yaml` y release gate | platform | abierto |
| Proyectos Supabase y secretos aún no confirmados | No se puede ejecutar staging real | Inventario de entornos y acceso técnico separado | User | bloqueado |

## Criterios de cierre

- [ ] Aislamiento organization/workspace demostrado por pgTAP e integración.
- [ ] CRM consume contratos y kernel sin duplicar autorización.
- [ ] DEV, STAGING y PROD son reproducibles y tienen secretos separados.
- [ ] Render tiene health checks, release gate y rollback documentado.
- [ ] Backup/PITR y restore drill tienen evidencia.
- [ ] Riesgos residuales y trabajo diferido documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-18 | `pnpm docs:links:check` | Pass | 228 archivos escaneados |
| 2026-08-18 | `node scripts/tracks/validate-tracks.mjs` | Pass | Estado inicial del track |

## Handoff de sesión

- **Fecha:** 2026-08-18.
- **Rama de continuación:** `minoveaz-saas-backend-infrastructure`.
- **Commit de partida:** `50c97f3` (`origin/develop`).
- **Estado alcanzado:** Track transversal creado en `planned/platform`; no se modificó código ni
  migraciones.
- **Decisiones, bloqueos y riesgos:** La rama CRM existente sigue siendo `origin/feature/crm-shared-foundation`.
  Antes de datos reales deben resolverse policies, FKs, pgTAP, seed y entornos. Falta confirmar acceso
  técnico a Supabase y configuración de Render.
- **Validación ejecutada:** Links y validador de tracks pasan; el inventario documental requiere
  regeneración.
- **Siguiente acción concreta:** Aprobar Fase 0 y crear `feature/platform-supabase-hardening` desde
  `develop` actualizado.

## Cierre

Pendiente de aprobación explícita.
