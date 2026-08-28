# Inventario inicial para el reinicio de suites

**Fecha:** 2026-08-14
**Track:** `suite-reset`
**Rama:** `chore/platform-shell-deprecation`
**Commit de referencia:** `abf523e`

Este inventario describe la superficie actual antes de cualquier limpieza. No autoriza por si solo el borrado de archivos. La decision final requiere revisar dependencias, registros, tests y referencias activas.

## Resumen

| Superficie | Archivos de app | Layout actual | Decision inicial |
| --- | ---: | --- | --- |
| Marketing Studio | 19 | `SuiteShell` en raiz; `ModuleWorkspace` en Brand Hub y DAM | Limpiar contenido de producto; conservar infraestructura compartida validada. |
| Health OS | 2 | `AppShell` + `SuiteHeader` + `ModuleWorkspace` | Limpiar y reconstruir desde contratos nuevos. |
| Sales CRM | 19 | `AppShell` + `SuiteHeader` + `ModuleWorkspace` | Limpiar prototipo y componentes de producto; reconstruir mediante tracks CRM posteriores. |
| Quant Ops | 26 | `AppShell` + `SuiteHeader` + `ModuleWorkspace` | Excepcion experimental: conservar tal como esta. |

## Marketing Studio

### Superficie

- `apps/loopdev-os/src/app/marketing-studio/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/brands/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/brands/[brandId]/**/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brands/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/campaigns/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/dam/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/dam/page.tsx`

### Shell y ownership observado

- La raiz ya consume `SuiteShell` y `PlatformHeader`.
- Brand Hub consume `ModuleWorkspace` directamente.
- DAM consume `ModuleWorkspace` directamente.
- El contenido de Brand Hub, marcas, campañas y DAM es contenido de producto, no infraestructura de plataforma.

### Clasificacion inicial

| Categoria | Tratamiento |
| --- | --- |
| `marketing-studio/layout.tsx` | Conservar solo como punto de integracion futura; revisar providers y navegacion. |
| `brand-hub/**` | Candidato a limpiar y reconstruir; conservar historia, no autoridad activa. |
| `dam/**` | Candidato a limpiar y reconstruir; conservar historia, no autoridad activa. |
| `brands/**`, `campaigns/**` | Candidatos a limpiar y reconstruir; revisar dependencias antes de retirar. |
| `SuiteShell`, `PlatformHeader`, `SuiteSidebar` | Infraestructura compartida; fuera del borrado de suites. |

## Health OS

### Superficie

- `apps/loopdev-os/src/app/health-os/layout.tsx`
- `apps/loopdev-os/src/app/health-os/page.tsx`

### Shell y ownership observado

- `layout.tsx` importa `AppShell`, `SuiteHeader` y `ModuleWorkspace`.
- `SuiteHeaderLeft` y `SuiteHeaderRight` son adaptadores locales del layout.
- La suite tiene una superficie minima de app, pero su layout es una implementacion legacy completa.

### Clasificacion inicial

| Categoria | Tratamiento |
| --- | --- |
| `health-os/**` | Candidato a limpiar y reconstruir desde un track de suite posterior. |
| `SuiteHeaderLeft` | Archivado tras confirmar que no tiene consumidores activos fuera de Health OS. |
| `SuiteHeaderRight` | Conservar temporalmente solo porque Quant Ops lo consume; no promoverlo como shell productivo. |
| Primitives compartidos | Conservar; no son propiedad de Health OS. |

## Sales CRM

### Superficie

- `apps/loopdev-os/src/app/sales-crm/layout.tsx`
- `apps/loopdev-os/src/app/sales-crm/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/ai-insights/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/customers/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/pipeline/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/components/**`
- `apps/loopdev-os/src/app/sales-crm/context/**`
- `apps/loopdev-os/src/app/sales-crm/utils/**`

### Shell y ownership observado

- `layout.tsx` importa `AppShell`, `SuiteHeader` y `ModuleWorkspace`.
- Hay componentes legacy como `MasterDetailModal`, `PipelineCard`, `PipelineFilters` y formularios de producto.
- El inventario CRM aprobado ya indica que este material es evidencia historica, no autoridad de implementacion futura.

### Clasificacion inicial

| Categoria | Tratamiento |
| --- | --- |
| `sales-crm/layout.tsx` | Candidato a retirar y reemplazar por una definicion de suite posterior. |
| `sales-crm/page.tsx`, `customers/**`, `pipeline/**`, `ai-insights/**` | Candidatos a limpiar; reconstruccion en tracks CRM separados. |
| `sales-crm/components/**` | Candidatos a archivar o eliminar tras revisar referencias y contratos. |
| `sales-crm/context/**`, `utils/**` | Revisar dependencias con APIs y contratos antes de decidir. |
| Contratos y APIs compartidos | No eliminar en esta fase sin un analisis independiente de dominio y seguridad. |

## Quant Ops: excepcion protegida

### Superficie

- `apps/loopdev-os/src/app/quant-ops/layout.tsx`
- `apps/loopdev-os/src/app/quant-ops/page.tsx`
- `apps/loopdev-os/src/app/quant-ops/bots/**`
- `apps/loopdev-os/src/app/quant-ops/components/**`
- `apps/loopdev-os/src/app/quant-ops/context/**`
- `apps/loopdev-os/src/app/quant-ops/exchanges/**`
- `apps/loopdev-os/src/app/quant-ops/history/**`
- `apps/loopdev-os/src/app/quant-ops/risk/**`
- `apps/loopdev-os/src/app/quant-ops/strategies/**`
- `apps/loopdev-os/src/app/quant-ops/terminal/**`

### Regla

Quant Ops queda fuera de cualquier limpieza, migracion y validacion de este track. Sus componentes,
rutas, layout, contratos experimentales, tests y estado visual actual se conservan sin ejecutar ni
añadir pruebas nuevas. Cualquier cambio indirecto por una limpieza de infraestructura compartida
requiere una decision aprobada; no se incluye una validacion especifica de Quant en este track.

## Infraestructura compartida fuera de suites

Estas superficies no son candidatas a borrado por este inventario:

- `ds/packages/ui/src/components/composites/shell/SuiteShell`
- `ds/packages/ui/src/components/composites/shell/PlatformHeader`
- `ds/packages/ui/src/components/composites/shell/SuiteRuntime`
- `ds/packages/ui/src/components/composites/workspace/SuiteCanvas`
- `ds/packages/ui/src/components/composites/shell/AppShell` mientras Quant o compatibilidad lo requieran
- `ds/packages/ui/src/components/composites/shell/SuiteHeader` mientras Quant o compatibilidad lo requieran
- `ds/packages/ui/src/components/composites/workspace/ModuleWorkspace` mientras Quant o compatibilidad lo requieran
- `apps/loopdev-os/src/app/shell-showcase/**`

## Dependencias fuera de las rutas de suite

La limpieza de `apps/loopdev-os/src/app/<suite>` no es suficiente para retirar una suite. Se
detectaron referencias y superficies relacionadas fuera de esas rutas:

| Area | Evidencia observada | Tratamiento inicial |
| --- | --- | --- |
| Launchpad y navegacion | `apps/loopdev-os/src/app/launchpad/page.tsx` enlaza a suites y `ds/packages/ui` contiene fixtures de navegacion de Marketing Studio. | Conservar la infraestructura; revisar y retirar solo enlaces a suites que dejen de existir. |
| Marketing shared suite code | `apps/loopdev-os/src/suites/marketing-studio/**` contiene providers, fixtures, views y componentes de Brand Hub/Asset Manager. | Clasificar por ownership; no borrar junto con `src/app` sin revisar consumidores. |
| Marketing services and API | `apps/loopdev-os/src/services/marketing/**` (9 archivos) y `apps/loopdev-os/src/app/api/marketing/**` (8 archivos) contienen repositorios, operaciones y endpoints de Brand Hub, assets y campañas. | Mantener hasta decidir el futuro del dominio y revisar seguridad/datos. |
| Marketing shared suite code | `apps/loopdev-os/src/suites/marketing-studio/**` contiene 96 archivos de providers, fixtures, views y componentes de Brand Hub/Asset Manager. | Clasificar por ownership; no borrar junto con `src/app` sin revisar consumidores. |
| CRM API, services and contracts | `apps/loopdev-os/src/app/api/crm/**` (12 archivos), `apps/loopdev-os/src/services/crm/**` (4 archivos), `packages/contracts/src/crm/**` (3 archivos) y documentación CRM definen contratos y fixtures de dominio. | No eliminar en este track sin decisión separada de dominio, datos y seguridad. |
| Registros | `docs/registries/frontend-components.json`, `docs/registries/product-modules.json` y catálogos generados contienen entries de suites y componentes. | Actualizar después de aprobar la matriz; no dejar referencias rotas. |
| E2E y certificación | `e2e/authenticated.*`, `e2e/marketing-studio.dam.spec.mjs`, `e2e/phase5.certification.spec.mjs` y tests de shell navegan las suites actuales. | Reclasificar como tests de plataforma, tests históricos o tests de futuras reconstrucciones. |
| Tracks y documentación | Hay tracks activos/planificados y documentos CRM/Marketing/Health que describen las suites actuales. | Archivar o marcar como históricos según gobernanza; no conservarlos como autoridad activa sin revisión. |

## Matriz provisional de decisión

Esta matriz es deliberadamente provisional. La Fase 2 no puede comenzar hasta convertir cada fila
en una lista de archivos aprobada con dependencias y validación.

| Superficie | Conservar | Archivar | Eliminar | Reconstruir después |
| --- | --- | --- | --- | --- |
| Shell Showcase y primitives de plataforma | Si | No | No | Evolucionar mediante track de plataforma |
| Marketing Studio UI actual | Solo integración mínima si no rompe plataforma | Sí, como evidencia | Después de revisar dependencias | Sí |
| Health OS UI actual | Solo infraestructura compartida | Sí | Después de revisar rutas y referencias | Sí |
| Sales CRM UI actual | Solo contratos/API si tienen decisión independiente | Sí | Después de revisar rutas y referencias | Sí |
| Quant Ops | Sí, íntegramente | No | No | No en este track |
| CRM product specs and fixtures | Pendiente de decisión del track CRM | Posible | No aún | Reconciliar antes de reconstruir |
| Marketing services and domain contracts | Sí temporalmente | No | No en esta fase | Revisar en track de dominio |
| E2E de suites actuales | Shell/platform tests | Sí o adaptar | Solo tras reemplazo | Nuevos tests por suite |

## Gaps antes de borrar

- Revisar imports fuera de `apps/loopdev-os/src/app` que dependan de estas suites.
- Revisar APIs, contratos, fixtures, registros y tests asociados a cada suite.
- Determinar que documentacion debe archivarse y que referencias deben eliminarse.
- Confirmar que el borrado no afecta rutas de autenticacion, launchpad, providers ni Quant.
- Obtener aprobacion explicita de la matriz final antes de la Fase 2 de limpieza.
- Resolver el solapamiento con tracks CRM, Marketing Studio y Health OS antes de retirar sus
	contratos o especificaciones.

## Lista de archivos candidatos a archivar

Esta es una propuesta de alcance para la siguiente fase. Los paths están versionados y se pueden
revisar de forma aislada. No implica borrar ni moverlos hasta que la matriz final sea aprobada.

### Marketing Studio: 19 archivos de rutas y layouts

- `apps/loopdev-os/src/app/marketing-studio/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/**`
- `apps/loopdev-os/src/app/marketing-studio/brands/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/campaigns/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/dam/**`

La carpeta `apps/loopdev-os/src/suites/marketing-studio/**` no se incluye automaticamente: sus 96
archivos deben dividirse entre componentes de dominio, providers, fixtures, servicios de apoyo y
posible infraestructura reutilizable antes de decidir su destino.

El 2026-08-14 se aprobó archivar únicamente la ruta y el layout de DAM:

- `apps/loopdev-os/src/app/marketing-studio/dam/layout.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/dam/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/dam/page.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/dam/page.tsx`

El código `asset-manager`, sus servicios, APIs, fixtures y pruebas quedan conservados hasta una
decisión posterior sobre la reconstrucción de Marketing Studio.

El 2026-08-14 se aprobó archivar los 13 archivos directos de rutas y layouts de Brand Hub bajo
`apps/loopdev-os/src/app/_archived/marketing-studio/brand-hub/**`. Los 91 archivos de
`apps/loopdev-os/src/suites/marketing-studio/brand-hub/**` y sus hooks, servicios, APIs, contratos,
fixtures y pruebas quedan conservados para una decisión posterior de reconstrucción.

También se aprobó archivar los cuatro archivos restantes de la raíz de Marketing Studio:

- `apps/loopdev-os/src/app/marketing-studio/layout.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/layout.tsx`
- `apps/loopdev-os/src/app/marketing-studio/page.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brands/page.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/brands/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/campaigns/page.tsx` -> `apps/loopdev-os/src/app/_archived/marketing-studio/campaigns/page.tsx`

Con esto, los 19 archivos de rutas y layouts de Marketing Studio quedan fuera del routing activo.
Los 96 archivos de `apps/loopdev-os/src/suites/marketing-studio/**` permanecen conservados.

### Health OS: 2 archivos de rutas y layout

- `apps/loopdev-os/src/app/health-os/layout.tsx`
- `apps/loopdev-os/src/app/health-os/page.tsx`

Los adaptadores `SuiteHeaderLeft` y `SuiteHeaderRight` deben revisarse por separado porque viven
fuera de la carpeta de ruta y pueden tener referencias desde otras suites.

### Sales CRM: 19 archivos de rutas, componentes y contexto local

- `apps/loopdev-os/src/app/sales-crm/layout.tsx`
- `apps/loopdev-os/src/app/sales-crm/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/ai-insights/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/customers/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/pipeline/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/components/**`
- `apps/loopdev-os/src/app/sales-crm/context/**`
- `apps/loopdev-os/src/app/sales-crm/utils/**`

Los endpoints, servicios, contratos, fixtures de dominio y documentos CRM quedan fuera de esta
lista hasta que el track CRM determine su continuidad.

El 2026-08-14 se aprobó archivar los 19 archivos directos de `apps/loopdev-os/src/app/sales-crm/**`
en `apps/loopdev-os/src/app/_archived/sales-crm/**`. Las APIs, servicios, contratos,
documentación, fixtures y demás superficies CRM fuera de esa ruta quedan conservadas para la
reconstrucción posterior.

### Quant Ops: no archivar ni validar

No se incluyen paths bajo `apps/loopdev-os/src/app/quant-ops/**`, ni sus componentes, contexto,
fixtures, tests o documentación experimental. Quant es una excepción protegida del reinicio y no
se ejecutarán sus tests en este track.

### No tocar en el archivado de suites

- `apps/loopdev-os/src/app/api/**`
- `apps/loopdev-os/src/services/**`
- `apps/loopdev-os/src/suites/**` hasta completar clasificación por ownership
- `packages/contracts/**`
- `ds/packages/ui/**`
- `apps/loopdev-os/src/app/shell-showcase/**`
- `e2e/shell-showcase.contract.spec.mjs`
- `e2e/shell.*`
- registros canónicos y configuración global

## Decisión aprobada: Health OS y adaptadores

El 2026-08-14 se aprobó archivar la superficie directa de Health OS y el adaptador izquierdo de
su header. Los movimientos realizados son:

- `apps/loopdev-os/src/app/health-os/layout.tsx` -> `apps/loopdev-os/src/app/_archived/health-os/layout.tsx`
- `apps/loopdev-os/src/app/health-os/page.tsx` -> `apps/loopdev-os/src/app/_archived/health-os/page.tsx`
- `apps/loopdev-os/src/components/layout/SuiteHeaderLeft.tsx` -> `apps/loopdev-os/src/components/layout/_archived/SuiteHeaderLeft.tsx`

`apps/loopdev-os/src/components/layout/SuiteHeaderRight.tsx` permanece activo porque
`apps/loopdev-os/src/app/quant-ops/layout.tsx` lo utiliza. Esta excepción pertenece únicamente a
Quant Ops y no autoriza nuevos consumidores del shell legacy.

## Decisión aprobada: Launchpad

El 2026-08-14 se aprobó conservar las tarjetas de Marketing Studio, Sales & CRM y Health OS en
Launchpad, pero retirar sus enlaces activos mientras sus suites están archivadas. Las tarjetas
quedan bloqueadas con `href="#"` e `isLocked`.

Quant Ops conserva su enlace activo y se marca con `status="lab"` en `SuiteCard` para comunicar
que permanece como superficie experimental. No se retiraron tarjetas ni se modificaron fixtures,
E2E, registros o documentación en este bloque.

El 2026-08-14 se limpió `ds/packages/ui/src/components/composites/shell/SuiteSwitcher/fixtures.ts`:
Marketing Studio y Sales & CRM dejaron de aparecer como suites navegables públicas. Quant Ops y
Financial Ops permanecen disponibles. `MARKETING_STUDIO_SCHEMA` se conserva aparte como fixture
técnica del Shell Showcase y de sus tests; no representa una suite productiva activa.

Quant Ops también fue excluido de la batería E2E general: se retiró su caso de
`e2e/authenticated.application.spec.mjs` y su entrada de `e2e/phase5.certification.spec.mjs`.
No quedan referencias de Quant dentro de `e2e` y no se ejecutarán pruebas de Quant en este track.

La batería E2E general también dejó de ejecutar rutas archivadas de Marketing Studio, Sales CRM y
Health OS. Se actualizaron los specs de autenticación, smoke, diagnóstico móvil, accessibility y
certification, además de `playwright.config.mjs`. El spec `e2e/marketing-studio.dam.spec.mjs` se
conserva como evidencia histórica, pero quedó fuera de `testMatch` y no se ejecuta.

El registro canónico `docs/registries/product-modules.json` marca ahora Marketing Studio, Sales
CRM y Health OS como `deprecated` y apunta su evidencia de implementación a `_archived`. Quant Ops
permanece `experimental`, sin cambios de lifecycle ni tests registrados.
