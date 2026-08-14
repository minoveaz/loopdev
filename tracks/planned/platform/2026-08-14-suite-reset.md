---
id: suite-reset
title: Reinicio de suites y limpieza de superficies heredadas
status: planned
created: 2026-08-14
updated: 2026-08-14
owner: platform
lead: null
branch: chore/platform-shell-deprecation
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [governance, marketing-studio, health, crm]
dependencies:
  - shell-standardization
blocked_by: []
supersedes: []
---

# Reinicio de suites y limpieza de superficies heredadas

## Outcome

Dejar las suites productivas listas para reconstruirse desde una base limpia y sin
ambigüedad entre shells antiguos y la arquitectura aprobada. Antes de retirar código,
preservar en `docs/06-product` un documento breve que registre qué existía, qué se retira,
qué se conserva como referencia histórica y qué queda fuera del reinicio.

La reconstrucción posterior debe usar la arquitectura de plataforma vigente y contratos
explícitos, sin asumir que las suites actuales, sus páginas o sus componentes de dominio
son la base de producto futura.

## Contexto

Las suites actuales contienen composiciones históricas, rutas, componentes y contratos que
ya no representan necesariamente el producto que se quiere construir. Mantenerlas como
referencia activa genera confusión entre implementaciones antiguas y la dirección nueva del
shell. El usuario ha aprobado iniciar de cero las suites, conservando únicamente un registro
histórico pequeño en `docs/06-product`.

Quant Ops queda fuera del reinicio por ahora: conserva su estado experimental actual y no se
migra ni se limpia dentro de este track, salvo que una dependencia de plataforma lo haga
imprescindible y exista una decisión aprobada específica.

## Alcance

### Incluido

- Inventariar rutas, layouts, componentes, contratos, registros, fixtures, tests y documentación
  de las suites productivas actuales.
- Definir qué superficies se eliminan, archivan, conservan como infraestructura o se reconstruyen.
- Crear un documento histórico breve bajo `docs/06-product` sobre el estado anterior.
- Limpiar las suites productivas seleccionadas para que puedan reconstruirse desde una base mínima.
- Retirar referencias activas a composiciones antiguas de suite que ya no formen parte del nuevo
  punto de partida.
- Mantener separadas la infraestructura compartida de plataforma y los contenidos de dominio que
  deberán redefinirse en tracks posteriores.
- Preservar evidencia suficiente para recuperar decisiones y localizar el material histórico.

### Excluido

- Quant Ops y sus componentes, rutas y composición experimental actuales.
- La implementación de las nuevas suites o de los módulos CRM, Marketing Studio o Health OS.
- Cambios de datos, migraciones, RLS, APIs o contratos de dominio salvo los necesarios para
  retirar referencias rotas durante la limpieza.
- Borrado irreversible antes de completar inventario, aprobación de alcance y copia histórica.
- Eliminación de primitives compartidos de plataforma que todavía sean dependencias de Quant o
  de la compatibilidad temporal.
- Cierre del track sin aprobación explícita del usuario.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-14 | Reiniciar las suites productivas desde una base limpia en lugar de seguir extendiendo su estado actual. | Las suites actuales ya no representan necesariamente el producto deseado y generan confusión arquitectónica. | El trabajo se divide en inventario, preservación histórica, limpieza y reconstrucción posterior. | Usuario |
| 2026-08-14 | Conservar únicamente un documento histórico breve en `docs/06-product` como referencia del estado anterior. | Mantener trazabilidad sin conservar las suites antiguas como autoridad activa. | El documento no autoriza reutilización automática ni sustituye contratos futuros. | Usuario |
| 2026-08-14 | Mantener Quant Ops experimental y fuera del reinicio. | Quant debe conservar su estado actual mientras las demás suites se redefinen. | Quant queda como excepción explícita y no sirve como baseline de las suites productivas. | Usuario |
| 2026-08-14 | Excluir Quant de tests y validación de este track. | No se utilizará todavía y no debe consumir tiempo de esta limpieza. | No se ejecutan ni añaden tests de Quant; solo se protege su código y se valida que no sea modificado indirectamente. | Usuario |

## Arquitectura y contratos

La limpieza no redefine todavía la arquitectura final de cada suite. La infraestructura de
plataforma compartida permanece separada de las suites y se gobierna por sus contratos propios.

El nuevo punto de partida de las suites productivas deberá consumir la composición de shell
aprobada (`SuiteShell`, `PlatformHeader`, `SuiteRuntime` y `SuiteCanvas`) cuando los tracks de
reconstrucción comiencen. Quant puede conservar temporalmente su composición experimental actual.

El documento histórico debe distinguir al menos:

- superficies heredadas de producto;
- infraestructura compartida que se conserva;
- material archivado solo para consulta;
- Quant como excepción experimental;
- decisiones que deberán revisarse antes de reconstruir cada suite.

## Branch strategy

La ejecución inicial se realizará en `chore/platform-shell-deprecation`, creada desde
`docs/platform-shell-mode-inventory`, porque contiene la base más completa de contratos y
composición de plataforma. Las limpiezas de cada suite y las reconstrucciones posteriores deben
usar tracks o ramas derivadas separadas cuando el alcance pueda aislarse.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Confirmar el inventario, la política de preservación y la lista exacta de superficies
que se pueden retirar sin afectar Quant ni la infraestructura compartida.

**Definition of Ready**
- [ ] Inventario por suite con rutas y archivos candidatos.
- [ ] Matriz de conservar / archivar / eliminar / reconstruir.
- [ ] Dependencias externas de APIs, contratos, servicios, registros y E2E clasificadas.
- [ ] Documento histórico breve definido y revisado.
- [ ] Dependencias de Quant identificadas y protegidas.
- [ ] Criterios de borrado reversible e irreversible aprobados.

**Entregables**
- [ ] Inventario de superficies heredadas.
- [ ] Documento histórico en `docs/06-product`.
- [ ] Matriz de alcance y riesgos.
- [ ] Lista de archivos aprobable para la limpieza, separada por suite y por ownership.
- [ ] Aprobación explícita de la lista de archivado antes de mover o eliminar archivos.
- [ ] Plan de validación para la limpieza.

**Validación**
- [ ] Revisión de referencias activas a las suites y al shell antiguo.
- [ ] Validación de que Quant no queda afectado por el inventario.
- [ ] `node scripts/tracks/validate-tracks.mjs`.

**Evidencia:** Inventario inicial y matriz operativa en
`docs/06-product/SUITE_RESET_INVENTORY.md`, junto con la memoria histórica en
`docs/06-product/SUITE_RESET_HISTORY.md`. La lista concreta de candidatos está documentada,
pero la revisión final de ownership y la aprobación explícita antes de mover o eliminar archivos
siguen pendientes.

**Estado:** pendiente

### Fase 1: Preservación histórica y aislamiento

**Objetivo:** Crear el documento histórico y aislar las referencias que deben permanecer fuera de
la autoridad activa.

**Definition of Ready**
- [ ] Fase 0 aprobada.

**Entregables**
- [ ] Documento histórico breve.
- [ ] Referencias archivadas o marcadas según gobernanza documental.
- [ ] Guardrails para impedir nuevos consumidores de superficies retiradas.

**Validación**
- [ ] `pnpm validate:changed` o validación equivalente para los archivos afectados.
- [ ] Revisión documental de referencias activas.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 2: Limpieza de suites productivas

**Objetivo:** Retirar las superficies aprobadas de Marketing Studio, Health OS y Sales CRM,
preservando infraestructura compartida y dejando Quant intacto.

**Definition of Ready**
- [ ] Fase 1 aprobada.
- [ ] Lista de eliminación revisada por suite.
- [ ] Copia histórica y referencias de recuperación verificadas.

**Entregables**
- [ ] Suites productivas reducidas al punto de partida aprobado.
- [ ] Imports, exports, registros y tests obsoletos retirados o actualizados.
- [ ] Quant sin cambios funcionales no aprobados.

**Validación**
- [ ] `pnpm validate:changed`.
- [ ] `pnpm registries:check`.
- [ ] Validación de shell y build de la aplicación.
- [ ] Comprobación de que no quedan referencias rotas.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Handoff a reconstrucción

**Objetivo:** Dejar contratos, documentos y ramas preparados para definir nuevamente cada suite.

**Definition of Ready**
- [ ] Fase 2 validada.

**Entregables**
- [ ] Handoffs por suite o tracks de reconstrucción derivados.
- [ ] Contratos de shell y ownership documentados.
- [ ] Riesgos residuales y dependencias explícitos.

**Validación**
- [ ] Revisión de arquitectura y gobernanza.
- [ ] Validación completa aplicable al alcance.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| El borrado puede eliminar evidencia útil o romper dependencias compartidas. | Alto | Inventario, copia histórica y aprobación por fase antes de retirar archivos. | platform | Abierto |
| Quant puede depender de primitives o exports que también usen las suites productivas. | Alto | Mapear consumidores y mantener Quant fuera del alcance. | platform | Abierto |
| La documentación activa puede seguir presentando las suites actuales como autoridad. | Medio | Revisar referencias y archivar solo después de preservar el resumen histórico. | governance | Abierto |
| El reinicio puede confundirse con una reconstrucción funcional. | Medio | Separar este track de los tracks posteriores de definición e implementación de suites. | platform | Abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Documento histórico breve presente en `docs/06-product`.
- [ ] Quant Ops permanece experimental y fuera del reinicio.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-14 | `node scripts/tracks/validate-tracks.mjs` | Pasó | Validación de gobernanza del track |
| 2026-08-14 | Inventario inicial de consumidores de shell | Registrado | `apps/loopdev-os/src/app/{marketing-studio,health-os,sales-crm,quant-ops}` |
| 2026-08-14 | Memoria histórica de suites | Registrada | `docs/06-product/SUITE_RESET_HISTORY.md` |
| 2026-08-14 | Matriz inicial conservar / archivar / eliminar / reconstruir | Registrada; pendiente de dependencias y aprobación final | `docs/06-product/SUITE_RESET_INVENTORY.md` |
| 2026-08-14 | Dependencias externas de suites | Detectadas y clasificadas provisionalmente | `docs/06-product/SUITE_RESET_INVENTORY.md#dependencias-fuera-de-las-rutas-de-suite` |
| 2026-08-14 | Lista de archivos candidatos a archivar | Propuesta concreta; pendiente de aprobación | `docs/06-product/SUITE_RESET_INVENTORY.md#lista-de-archivos-candidatos-a-archivar` |
| 2026-08-14 | Health OS y adaptadores de header | Aprobado y archivado; `SuiteHeaderRight` se conserva por Quant | `docs/06-product/SUITE_RESET_INVENTORY.md#decisión-aprobada-health-os-y-adaptadores` |
| 2026-08-14 | DAM: rutas y layout | Aprobado y archivado; `asset-manager` y dominio conservados | `docs/06-product/SUITE_RESET_INVENTORY.md#marketing-studio-19-archivos-de-rutas-y-layouts` |
| 2026-08-14 | Brand Hub: rutas y layouts | Aprobado y archivado; dominio de 91 archivos conservado | `docs/06-product/SUITE_RESET_INVENTORY.md#marketing-studio-19-archivos-de-rutas-y-layouts` |
| 2026-08-14 | Marketing Studio: raíz, marcas y campañas | Aprobado y archivado; dominio de 96 archivos conservado | `docs/06-product/SUITE_RESET_INVENTORY.md#marketing-studio-19-archivos-de-rutas-y-layouts` |
| 2026-08-14 | Sales CRM: UI local | Aprobado y archivado; APIs, servicios, contratos y documentación conservados | `docs/06-product/SUITE_RESET_INVENTORY.md#sales-crm-19-archivos-de-rutas-componentes-y-contexto-local` |
| 2026-08-14 | Launchpad: enlaces de suites archivadas | Tarjetas conservadas y bloqueadas; Quant activo con estado experimental `lab` | `apps/loopdev-os/src/app/launchpad/page.tsx` |
| 2026-08-14 | SuiteSwitcher: fixtures públicas | Marketing y CRM retirados de la navegación pública; Quant y Financial Ops conservados | `ds/packages/ui/src/components/composites/shell/SuiteSwitcher/fixtures.ts` |
| 2026-08-14 | E2E general: exclusión de Quant | Retirado el caso funcional y la certificación de Quant; no se ejecutan tests de laboratorio | `e2e/authenticated.application.spec.mjs`, `e2e/phase5.certification.spec.mjs` |
| 2026-08-14 | E2E de suites archivadas | Retiradas las rutas de Marketing, CRM y Health; DAM conservado fuera de `testMatch` como evidencia | `e2e`, `playwright.config.mjs` |
| 2026-08-14 | Lifecycle de módulos | Marketing, CRM y Health marcados `deprecated`; Quant sigue `experimental` sin tests registrados | `docs/registries/product-modules.json`, `docs/registries/REGISTRY_CATALOG.md` |
| 2026-08-14 | Build de LoopDev OS | Pasó después de reconstruir `@loopdev/contracts`; las suites archivadas quedaron fuera del árbol compilable | `pnpm --filter @loopdev/contracts build`, `pnpm --filter loopdev-os build` |

## Handoff de sesión

Actualizar al finalizar una sesión de implementación. Es un resumen breve y reemplazable: no duplica
la especificación, el historial de Git ni la conversación.

- **Fecha:** 2026-08-14.
- **Rama de continuación:** `chore/platform-shell-deprecation`.
- **Commit de partida:** `abf523e`.
- **Estado alcanzado:** Suites productivas archivadas en sus rutas directas; Launchpad conserva las tarjetas pero bloquea Marketing, CRM y Health; SuiteSwitcher ya no ofrece Marketing ni CRM; Quant mantiene su enlace activo con estado `lab` pero está excluido de la batería E2E general; no se han borrado superficies de dominio ni plataforma.
- **Decisiones, bloqueos y riesgos:** Reinicio aprobado por el usuario; Quant queda fuera; APIs, contratos, servicios, registros y E2E requieren clasificación final antes de continuar.
- **Validación ejecutada:** `pnpm --filter @loopdev/contracts build`, `pnpm --filter loopdev-os build`, `pnpm registries:check`, `pnpm docs:links:check`, `node scripts/tracks/validate-tracks.mjs`, `git diff --check`, `node --check` sobre specs/configuración E2E modificados y comprobación de que no hay referencias de Quant en las suites E2E activas.
- **Siguiente acción concreta:** Revisar referencias activas restantes en scripts y documentación, sin ejecutar tests de Quant ni modificar contratos de dominio.

## Cierre

Pendiente de aprobación explícita.