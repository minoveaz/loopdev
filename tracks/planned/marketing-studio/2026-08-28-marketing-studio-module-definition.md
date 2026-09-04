---
id: marketing-studio-module-definition
title: Definición de módulos iniciales de Marketing Studio
status: planned
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
lead: null
branch: docs/marketing-studio-module-definitions
branches: []
phase: 0
pull_requests: []
issues: [141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152]
packages: []
release: not-required
areas: [marketing-studio, platform, governance]
dependencies: [marketing-studio-suite-definition]
blocked_by: []
supersedes: []
---

# Definición de módulos iniciales de Marketing Studio

## Outcome

Producir los paquetes de definición de Brand Hub, Asset Library, Creative Studio, Image Studio,
Video Studio, Content Engine y Campaign Orchestrator para que una futura implementación tenga
fronteras de producto, UX, contratos, seguridad e impacto auditables.

## Contexto

Marketing Studio es una propuesta nueva desde cero. La definición de suite aprobada en PR #139
establece las fronteras de producto y usa VitaBlue solo como evidencia funcional. El legacy no es
una fuente autoritativa y no se reactivan sus rutas, contratos, componentes ni decisiones técnicas.

Este track de planificación no entrega código de producto. El Issue de delivery padre es #141.

## Alcance

### Incluido

- Paquetes de cinco documentos para los siete módulos iniciales.
- Fronteras entre Brand Hub, Asset Library, Creative Studio y sus verticales.
- UX, Canvas recipes, contratos, tenancy, permisos, impacto, riesgos y handoff documental.
- Autonomía de evolución interna de Image Studio y Video Studio dentro de las fronteras compartidas.
- Evidencia funcional relevante de VitaBlue, sin trasladar sus decisiones técnicas directamente.

### Excluido

- Código de producto, rutas, componentes, migraciones, RLS, buckets o datos de prueba.
- Activación de providers, secretos, IA, integraciones, publicación o automatización.
- Creación de ramas de implementación o cambios de estado del Issue a `In progress`.
- Reactivación o migración automática de Marketing Studio legacy.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-28 | Definir Marketing Studio como propuesta nueva, sin usar legacy como autoridad. | El producto legacy fue archivado y eliminado. | Los paquetes deberán declarar sus contratos y límites sin reutilizar automáticamente decisiones previas. | Solicitud explícita del usuario |
| 2026-08-28 | Definir primero Brand Hub, Asset Library y Creative Studio; después Image Studio y Video Studio; finalmente Content Engine y Campaign Orchestrator. | Las fundaciones aclaran ownership y contratos para los verticales. | El orden de documentos seguirá las dependencias, no un catálogo funcional cerrado. | Solicitud explícita del usuario |
| 2026-08-28 | Permitir evolución autónoma y experimentación continua en Image Studio y Video Studio. | Su objetivo es generar assets de alta calidad rápidamente y de forma eficiente. | Sus contratos y controles compartidos se mantienen estables; su roadmap interno no queda congelado. | Solicitud explícita del usuario |
| 2026-08-28 | Reconocer Image Studio y Video Studio como desarrollo exploratorio ya iniciado en VitaBlue, separado de cualquier activación de LoopDev. | La evidencia funcional proviene de verticales que siguen evolucionando antes de su integración gobernada. | VitaBlue puede continuar como laboratorio; las rutas, contratos runtime y lanzamiento de LoopDev permanecen bloqueados por los gates de sus paquetes. | Solicitud explícita del usuario |
| 2026-08-28 | Registrar Brand Hub y Campaign Orchestrator como superficies exploratorias ya iniciadas en VitaBlue. | El backoffice VitaBlue contiene un panel de identidad y un Campaign Manager con planificación, readiness, assets, copy, enlaces, actividad y publicación preliminar. | Brand Hub se clasifica como evidencia visual inicial; Campaign Orchestrator como evidencia de flujo. Sus datos, `localStorage`, shell y RLS por rol no se reutilizan como autoridad de LoopDev. | Solicitud explícita del usuario |

## Arquitectura y contratos

Cada módulo documentará la composición obligatoria `AppShell -> SuiteRuntime/SuiteCanvas -> widgets
-> features -> entities -> shared`. Platform Core conserva tenancy, autorización base, auditoría,
jobs durables, secrets y providers. Asset Library conserva el lifecycle de recursos; Creative Studio
coordina las experiencias creativas sin convertirse en dueño de assets, Storage o publicación.

## Branch strategy

La definición documental se realiza en `docs/marketing-studio-module-definitions` y se entregará por
Pull Request hacia `docs/2026-execution-roadmap`. Cada módulo aprobado iniciará cualquier futura
implementación desde `develop` en su propia rama `feature/marketing-studio-<module>-implementation`.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Crear los paquetes formales de los siete módulos iniciales y documentar los cuatro
módulos diferidos con sus gates, dejando explícitas dependencias, límites y decisiones pendientes.

**Definition of Ready**
- [x] Suite propuesta y sus fronteras documentadas en PR #139.
- [x] Issue padre #141 creado.
- [x] Track padre creado en estado `planned`.
- [x] Paquetes de los siete módulos iniciales completos y consistentes.
- [x] Paquetes de los cuatro módulos diferidos completos, con gates de activación explícitos.
- [ ] Revisión explícita de Producto y Tech Lead.

**Entregables**
- [x] Brand Hub: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Asset Library: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Creative Studio: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Image Studio: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Video Studio: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Content Engine: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Campaign Orchestrator: paquete `proposed` creado; pendiente de revisión y aprobación.
- [x] Publishing & Integrations: paquete diferido `proposed` creado; bloqueado por proveedor/OAuth/seguridad.
- [x] Marketing Insights: paquete diferido `proposed` creado; bloqueado por eventos y atribución.
- [x] Marketing Automation: paquete diferido `proposed` creado; bloqueado por Workflow y consentimiento.
- [x] Compliance & Governance: paquete diferido `proposed` creado; bloqueado por ownership y políticas.

**Validación**
- [x] `node scripts/docs/check-markdown-links.mjs`.
- [x] `node scripts/tracks/validate-tracks.mjs`.
- [x] `node scripts/tracks/generate-tracks-index.mjs` y segunda validación de tracks.
- [x] Revisión cruzada de UX, contratos e impacto de cada paquete.

**Evidencia:** PR #139, Issues #141 a #152 y paquetes `proposed` para todos los módulos del mapa.

**Estado:** en curso

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-28 | Crear un track padre separado del track técnico `creative-studio-persistence`. | La nueva definición de suite no debe tomar una entrega técnica heredada como programa autoritativo. | La persistencia existente queda como evidencia y dependencia potencial, no como alcance de este track. | Solicitud explícita del usuario |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Duplicar ownership de assets entre Creative Studio y Asset Library. | Contratos y datos inconsistentes. | Fijar lifecycle y límites en ambos paquetes antes de definir los verticales. | Marketing Studio | abierto |
| Trasladar patrones de VitaBlue sin adaptar tenancy o seguridad. | Riesgo de aislamiento y operación. | Usar VitaBlue solo como evidencia y documentar adaptación a Platform Core. | Marketing Studio / Platform | abierto |
| Convertir un experimento de Image o Video Studio en dependencia compartida sin revisión. | Acoplamiento prematuro. | Requerir revisión de impacto antes de promover contratos o componentes. | Marketing Studio | abierto |
| Confundir desarrollo exploratorio de VitaBlue con implementación autorizada de LoopDev. | Activación prematura o traslado de decisiones no certificadas. | Marcar el estado por contexto y exigir los gates documentados antes de cualquier ruta, contrato runtime o rollout de LoopDev. | Marketing Studio | abierto |
| Reutilizar persistencia o RLS de campañas de VitaBlue sin aislamiento tenant-aware. | Exposición cross-tenant o autorización insuficiente. | Tratar la RLS por rol de VitaBlue como evidencia de riesgo; rediseñar esquema, RLS y autorización server-side por organización/workspace/marca en LoopDev. | Marketing Studio / Platform | abierto |

## Criterios de cierre

- [ ] Los once paquetes están completos, revisados y enlazados desde el Issue #141; los cuatro
	diferidos conservan sus gates de no implementación.
- [ ] Dependencias, riesgos y decisiones pendientes son explícitos.
- [ ] Validaciones documentales y de tracks ejecutadas con evidencia.
- [ ] Estado y handoff aprobados explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-28 | `git branch --show-current` | Rama documental `docs/marketing-studio-module-definitions` confirmada. | Guard de module-definition |
| 2026-08-28 | `node scripts/docs/check-markdown-links.mjs` | Passed; 252 archivos escaneados tras crear la UX de Brand Hub. | Validación local |
| 2026-08-28 | Validación documental acumulada | Links, tracks, índice generado y `git diff --check` pasaron tras crear los once paquetes. | Validación local |
| 2026-08-28 | Revisión transversal de los once paquetes | Ownership, lifecycle, tenancy, evidencia VitaBlue y gates revisados; se corrigieron lifecycle editorial/publication, estado de suite, alcance del track y completitud de módulos diferidos. | Revisión documental local |
| 2026-08-28 | Inventario documental | `pnpm docs:inventory:generate` y `pnpm docs:inventory:check` pasaron. | `docs/04-governance/DOCUMENTATION_REVIEW_INVENTORY.md` |
| 2026-08-28 | Plan de validación | `pnpm validate:plan` detectó fallback global por historial de cambios de la rama; los cambios propios de esta fase son documentación y tracks. | Validación local |

## Handoff de sesión

- **Fecha:** 2026-08-28.
- **Rama de continuación:** `docs/marketing-studio-module-definitions`.
- **Commit de partida:** Pendiente del primer commit del track.
- **Estado alcanzado:** Once paquetes `proposed` creados y revisados transversalmente; Fase 0 pendiente de aprobación explícita.
- **Decisiones, bloqueos y riesgos:** Image/Video están en desarrollo exploratorio en VitaBlue, pero todos los módulos de LoopDev requieren aprobación explícita y sus gates antes de implementación o activación.
- **Validación ejecutada:** Guard de rama, Markdown links, tracks, índice, inventario documental y `git diff --check` pasaron.
- **Siguiente acción concreta:** Obtener aprobación explícita de Producto y Tech Lead para las foundations antes de preparar cualquier implementación.

## Cierre

Pendiente de aprobación explícita del usuario.