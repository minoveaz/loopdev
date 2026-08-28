---
id: saas-visual-standardization
title: SaaS visual system and experience standardization
status: active
created: 2026-08-14
updated: 2026-08-17
owner: platform
lead: null
branch: null
branches: [docs/platform-shell-mode-inventory, feature/crm-ui-foundation]
phase: 2
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, governance]
dependencies: [platform-shell-mode-inventory]
blocked_by: []
supersedes: []
---

# SaaS visual system and experience standardization

## Outcome

Define the shared visual language, composition recipes and cross-suite
experience contracts that make LoopDev SaaS views consistent without removing
domain-specific identity or useful density.

## Contexto

`SuiteCanvas` defines structural regions and modes, but it does not by itself
standardize backgrounds, surfaces, spacing, states, responsive behavior,
accessibility or view governance. This track establishes those shared rules
before broad CRM and suite view implementation.

## Alcance

### Incluido

- Inventory of surfaces, backgrounds, technical grids and visual recipes.
- Layout, spacing, density and visual hierarchy.
- Functional states and interaction contracts.
- Data density, tables, filters and formatting.
- Accessibility, responsive behavior and device input.
- Tenancy, theming and organization branding boundaries.
- Internationalization and localization constraints.
- Permission, security and audit presentation requirements.
- Performance budgets and observability.
- Component ownership, promotion and exception governance.
- Standard view specification and validation checklist.

### Excluido

- Replacing the existing Platform Shell or SuiteCanvas mode contract.
- Implementing complete domain views for CRM, Marketing, Quant or Health.
- Changing tenant security enforcement or database policies.
- Introducing a parallel design system outside `@loopdev/ui`.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-14 | Use shared tokens, primitives and recipes instead of suite-local visual CSS systems. | Preserve cross-SaaS consistency while allowing domain composition. | New variants require shared ownership and evidence. | Usuario |
| 2026-08-14 | Keep structural Canvas modes separate from visual surface recipes. | Prevent layout contracts from becoming decoration contracts. | Views declare both a Canvas mode and a visual recipe. | Usuario |
| 2026-08-17 | Adopt the **SuiteCanvas Declarative Composition System**: pages declare semantic regions and grid intent; shared runtime and canvas presets own geometry, surfaces, responsive behavior and overflow. | Prevent page-local pixel layouts and visual drift while preserving domain-specific composition. | Extend the composition contract with governed grid placement where needed; reject arbitrary pixel coordinates and platform overrides. | Usuario |

### Nombre industrial y definición

Este enfoque combina varios patrones conocidos:

- **Declarative layout system:** la vista declara qué regiones existen y qué
  intención de layout tienen, en lugar de mutar el DOM con posiciones libres.
- **Schema-driven layout:** la composición se expresa mediante un contrato
  tipado/validado (`ViewComposition`) y no mediante clases visuales inventadas
  por cada página.
- **Responsive design token system:** columnas, gaps, superficies, densidad,
  breakpoints y estados proceden de tokens y presets compartidos.
- **Design-system governance:** una página puede componer contenido de dominio,
  pero las decisiones estructurales y visuales pertenecen a componentes
  certificados y a sus owners.

En LoopDev el nombre operativo será **SuiteCanvas Declarative Composition
System**. Es la capa que conecta `SuiteRuntime`, `SuiteCanvas`,
`CompositionGrid`, los contratos de `packages/contracts` y las recetas
certificadas de `@loopdev/ui`.

La regla contractual queda fijada así:

```text
Página / módulo
  declara: receta, zonas, slots, contenido, labels, estados y acciones

Composition contract
  declara: columnas permitidas, spans, colocación semántica y reglas responsive

SuiteRuntime / SuiteCanvas / UI primitives
  decide: geometría, anchos, alturas, padding, bordes, fondos, scroll,
          overlays, breakpoints y anatomía visual
```

Las coordenadas, cuando sean necesarias, serán coordenadas de grid (`colStart`,
`rowStart`, `colSpan`, `rowSpan`), nunca posiciones libres en píxeles. La
colocación explícita deberá validarse contra la receta y no podrá habilitar
solapamientos u overflow del shell de forma accidental.

## Arquitectura y contratos

- `SuiteCanvas` owns structural regions and mode semantics.
- Platform tokens own colors, surfaces, borders, spacing, typography and
  density scales.
- Shared primitives own technical grids, surfaces, backgrounds, overlays and
  state treatments.
- Recipes own composition rules for dashboard, data, split, record, board and
  immersive workflows.
- Suites own domain content and approved accents, not parallel shell primitives.
- Every view declares mode, recipe, states, permissions, responsive behavior,
  accessibility, localization and observability requirements.

## Branch strategy

This is a transversal specification track. It remains planned until Phase 0
readiness is approved, then implementation branches may be created per
platform capability while this track remains the system of record.

## Fases

### Fase 0: Inventario y readiness

**Objetivo:** Establish the current token, surface, recipe and experience
baseline with ownership and measurable gaps.

**Definition of Ready**

- [x] Existing platform and UI references inventoried.
- [x] Canonical owners and source-of-truth locations identified.
- [x] Dependencies with Platform Shell and Design System confirmed.
- [x] Validation approach agreed for visual, accessibility and contract gates.

**Entregables**

- [x] Surface and background inventory.
- [x] Visual recipe catalog.
- [x] Cross-SaaS standardization matrix covering the 15 concern areas.
- [x] View specification template.
- [x] Gap, duplication and exception register.

**Validación**

- [x] Documentation links and track integrity pass.
- [x] Every proposed token/recipe has an owner and evidence source.
- [x] No duplicate platform primitive is introduced.

**Evidencia:** [SaaS visual system inventory](../../../docs/03-platform/SAAS_VISUAL_SYSTEM_INVENTORY.md)
records current primitives and duplication. [SaaS visual recipes](../../../docs/03-platform/SAAS_VISUAL_RECIPES.md)
defines the proposed surface taxonomy and initial mode-to-recipe mapping.
[SaaS standardization matrix](../../../docs/03-platform/SAAS_STANDARDIZATION_MATRIX.md)
and [view specification template](../../../docs/03-platform/SAAS_VIEW_SPECIFICATION_TEMPLATE.md)
make the fifteen concern areas and per-view review contract actionable.
[SaaS visual gap register](../../../docs/03-platform/SAAS_VISUAL_GAP_REGISTER.md)
assigns the remaining duplication, accessibility, theming and exception work.

**Estado:** completada

### Fase 1: Shared visual contracts

**Objetivo:** Define tokens, primitives, recipes, states and view contracts.

- [x] Reference composition patterns extracted from supplied screenshots.
- [x] Declarative composition contract with grid, slots, spans and breakpoints.
- [x] Initial `CompositionGrid` renderer consuming the shared contract.
- [x] Neutral showcase fixtures for all six initial recipes.
- [x] `CreativeEditor` reference recipe and design-team fixture.
- [x] Design handoff for CreativeEditor from zero-to-implementation.
- [x] Agnostic-first implementation and LoopDev migration guidance.
- [x] Showcase states for ready, loading, empty, error, read-only and forbidden.
- [x] Responsive showcase container for mobile, tablet and desktop review.
- [x] LoopDev OS production build after repairing the workspace token link.
- [x] Obsolete `operation-os` test surface removed.

**Estado:** completada

**Evidencia:** `/composition-showcase` renders the reference fixtures and
state treatments. Vitest passed with 139 files and 557 tests; the
`loopdev-os` production build passed after the `@loopdev/tokens` workspace link
was restored.

### Fase 2: Reference compositions

**Objetivo:** Apply the contracts to representative dashboard, data, split,
record, board and immersive compositions without implementing full suites.

**Standardization decision:** Composition regions declare semantic layout
intent (`rows`, `placement`, `sizing` and `overflow`) instead of relying on
page-specific pixel fixes. `CreativeEditor` is the first full-bleed reference;
`SuiteOverview` is the next reference before CRM screens are defined.

**Entregables**

- [x] CreativeEditor full-bleed canvas with preview, stage tools, transport and timeline zones.
- [x] Declarative region layout contract for rows, placement, sizing and overflow.
- [x] Shell-owned Media Library and Media Details zones separated from canvas regions.
- [x] SuiteOverview reference composition using the same declarative contract.
- [x] Reference component fixtures for summary, metrics, activity, filters, table and pagination.
- [x] Desktop, tablet and mobile review for both reference compositions.

**Validation gate:** Do not begin CRM screen composition until CreativeEditor
and SuiteOverview both pass layout, state, responsive and accessibility review.

**Estado:** en curso

**Siguiente validación:** Complete the remaining reference fixtures and
contract gates before CRM composition.

### Prioridades pendientes

Estas prioridades amplían la implementación de la Fase 2 y son el orden de
trabajo aprobado antes de iniciar CRM:

1. **Aplicar superficies del DS a las composiciones:** migrar los contenedores
  principales de `composition-showcase` a `TechnicalSurface`, usando el
  contrato de `variant`, `depth`, `radius`, `border`, `borderWidth` y
  `withGrid`. Estado: **contrato endurecido; migración de contenedores locales
  pendiente**.
2. **Completar fixtures reales por recipe:** pendiente sólo la ampliación de
  estados y revisión de `CreativeEditor`; `SplitWorkspace` e
  `ImmersiveWorkflow` ya tienen fixtures de referencia.
3. **Aplicar estados reutilizables a cada recipe:** loading, empty, error,
  forbidden, read-only, offline, stale y conflict.
4. **Normalizar iconos y acciones:** usar `ICON_REGISTRY`, `Button` e
  `IconButton` sin controles HTML o nombres de iconos locales. Estado:
  **parcialmente certificado**, con búsquedas y acciones discretas del
  showcase normalizadas.
5. **Certificar interacción:** hover, focus, active, disabled, loading de
  botones, permisos, teclado y reduced motion. Estado: **certificado para
  referencias**, con cobertura Playwright de estados, foco y reduced motion.
6. **Ejecutar revisión responsive real:** desktop 1440, tablet 1024 y mobile
  390, comprobando regiones contenidas, transformaciones y scroll interno.
7. **Completar auditoría light/dark:** superficies, bordes, grillas,
  overlays, glass y estados semánticos. Estado: **certificado para
  referencias**; el control de tema persiste y valida superficies semánticas.
8. **Añadir tests de contrato:** TechnicalSurface, estados, responsive,
  icon registry y acciones contextuales. Estado: **parcialmente cubierto**;
  existen contratos de recipes, superficies/cards/controles/tablas y tests
  Playwright de interacción.
9. **Registrar evidencia de navegador:** screenshots autenticados y resultados
  visuales para cerrar el readiness gate. Estado: **10 pruebas Playwright
  autenticadas pasadas**.

**Progreso registrado:** el punto 1 avanzó el 2026-08-14 con la migración de la
pestaña `Surfaces`, la configuración de `TechnicalSurface` en el DS y la
aplicación explícita de superficies a las regiones declarativas de
`composition-showcase`. `SuiteOverview` ya usa superficies DS, `TechnicalCanvas`
oficial y grilla blueprint visible. El 2026-08-17 se estandarizaron los
wrappers de `ActivityTable`, `DenseOperationalTable`, `QuantitativeTable`,
`SelectionTable` y `BotMetricsDashboard`, y se retiró la composición manual
comentada de `ImmersiveWorkflow`. También se migraron los cuatro paneles de
estado de `SharedFoundation` a `TechnicalSurface`; los commits de evidencia son
`b6b07fc` y `516eea8`. Marketing Studio queda fuera de esta tanda. La
migración de contenedores locales restantes, la ampliación de fixtures y la
auditoría visual light/dark permanecen pendientes.

El 2026-08-18 se añadieron contratos ejecutables compartidos para las cinco
áreas de Fase 2A: breakpoints (`BREAKPOINTS`, `useBreakpoint` y
`PLATFORM_RESPONSIVE_CONTRACTS`), densidad y overflow de tablas, geometría y
estados de controles, semántica de `TechnicalSurface`/`TechnicalCard` y
geometría/clasificación de estados. `ResponsiveTable` ya acepta el preset de
densidad común y la suite de contratos pasa 6 tests; `@loopdev/tokens`
typecheck también pasa. La adopción visual runtime conserva por ahora las
clases existentes para evitar regresiones y queda como segunda fase de cada
contrato.

## CRM readiness gate

CRM screen composition must not begin until this gate is reviewed. The gate
turns the fifteen cross-SaaS concerns into evidence requirements for the first
CRM screen and prevents CRM from becoming the place where platform behavior is
discovered for the first time.

| Area | Required evidence | Status |
| --- | --- | --- |
| Shell zones | Mandatory and optional zone contract consumed by a module definition | ready |
| Declarative composition | Recipe, canvas mode, rows, columns, placement, sizing and overflow are declared | ready for references |
| CreativeEditor | Full-bleed reference with contextual zones, preview, transport and timeline | ready |
| SuiteOverview | Reference fixture consumes the same contract | ready for visual review |
| DataWorkspace | Reference reviewed for filters, table, pagination and density | fixture ready; visual review pending |
| RecordWorkspace | Reference reviewed for record, tabs, activity and inspector behavior | fixture ready; interaction review pending |
| BoardWorkspace | Reference reviewed for board density, cards, metrics and horizontal flow | fixture ready; interaction review pending |
| Functional states | Loading, empty, error, forbidden, read-only, offline, stale and conflict fixtures | reference coverage |
| Responsive | Desktop, tablet, mobile, touch and sidebar/panel transformations | reference coverage ready |
| Accessibility | Keyboard path, focus restoration, semantics, contrast and reduced motion | reference coverage ready |
| Typography | Font families, sizes, weights, line-height and text expansion use tokens | pending |
| Color and surfaces | Semantic canvas, surface, elevated, overlay, accent and attention tokens | pending |
| Permissions | Hidden, disabled, forbidden, read-only and active-route fallback behavior | reference coverage ready |
| Data density | Table, filters, pagination, sorting, selection, formatting and large-data rules | pending |
| Performance | List, grid, animation, canvas and interaction budgets | reference marks ready; budgets pending |
| Observability | Navigation, context, state, errors, permission and latency events without sensitive data | reference events ready |
| Exceptions | Owner, rationale, approval, scope, review date and removal plan | partially ready |

### Entry criteria

Before creating the first CRM screen composition:

- [x] `CreativeEditor` and `SuiteOverview` pass visual and responsive review.
- [ ] `DataWorkspace`, `RecordWorkspace` and `BoardWorkspace` have reference fixtures or an approved deferral.
- [ ] All required functional states have reusable fixtures and validation plans.
- [ ] Mandatory and optional shell zones are resolved declaratively.
- [ ] Typography, color, surface and density rules point to canonical tokens.
- [ ] Permission and active-route fallback behavior is documented.
- [ ] Keyboard, focus, contrast and reduced-motion checks are defined.
- [ ] Performance and observability budgets are recorded.
- [ ] Any exception has an owner and explicit approval evidence.
- [ ] The first CRM view has a completed SaaS view specification.

Automated evidence already available:

- [x] Full Vitest suite passes: 139 files and 557 tests.
- [x] `loopdev-os` production build compiles TypeScript and generates all pages.
- [x] Track and Markdown link validation pass.

### Exit criteria

CRM may proceed only when every entry criterion is checked or explicitly
deferred in an approved track decision with owner, risk, evidence and review
date. The first CRM view must then be validated against the standardization
matrix before additional CRM screens are created.

### Fase 2A: Geometría, bordes y márgenes del sistema

**Objetivo:** convertir la consistencia visual observada en las composiciones
en contratos compartidos y verificables. Las páginas podrán escoger una
receta y declarar contenido, estados y zonas; no podrán redefinir la anatomía
del shell, sus colores, fondos, alturas, anchos, márgenes, bordes, scroll ni
breakpoints.

#### Diferencia de referencia: `BoardWorkspace` vs `ImmersiveWorkflow`

Estas composiciones no deben converger en una misma caja visual:

| Composición | Intención | Geometría | Overflow | Superficie |
| --- | --- | --- | --- | --- |
| `BoardWorkspace` | Operación por columnas y comparación de trabajo | Canvas `board` con padding estable, columnas de ancho mínimo y separación controlada | Scroll horizontal exclusivo del board; el shell nunca adquiere overflow horizontal | Surface bounded, borde técnico y densidad operativa |
| `ImmersiveWorkflow` | Ejecución continua de un flujo | Canvas `full-bleed`, ocupa el área disponible y reduce el marco exterior | Sin scroll horizontal del shell; el contenido interno controla cualquier overflow específico | Superficie continua, sin card contenedora equivalente al board |

La diferencia visible actual es intencional en escala, marco, margen y densidad,
pero el overflow observado en `BoardWorkspace` debe quedar encapsulado en su
zona de board. Ninguna composición puede compensarlo con anchos arbitrarios o
clases locales del shell.

#### Contratos de geometría por nivel

| Nivel | Owner | Puede definir | No puede definir |
| --- | --- | --- | --- |
| Plataforma | `AppShell`, `PlatformHeader`, `SuiteSidebar`, `SuiteRuntime` | Header fijo, rail, overlays, z-index, altura disponible y regla de scroll único | Contenido de módulo o visuales de una receta |
| Composición | `SuiteCanvas`, presets de modo y recetas certificadas | Modo, zonas, grid semántica, padding de canvas, overflow de una zona autorizada | Colores, fondos, alturas estructurales, widths del shell o anatomía de headers |
| Dominio | Página y módulos | Datos, labels, estados, acciones permitidas y contenido de slots | Shell paralelo, superficies ad hoc, bordes/márgenes estructurales y breakpoints de plataforma |

#### Checklist de endurecimiento

- [x] **Shell global:** fijar altura de `PlatformHeader`, anchos de
  `SuiteSidebar` expandido/rail, posición estable en hover, z-index de
  overlays, altura disponible de `SuiteCanvas` y una sola superficie de
  scroll vertical.
- [x] **`ModuleHeader`:** fijar altura, padding horizontal, grid de tres slots,
  posición del status, ancho/truncado de breadcrumbs, acción derecha sin
  desplazar el contexto izquierdo y transformación móvil.
- [x] **`ModuleToolbar`:** reservar `contextSlot`, fijar ancho máximo de
  `ModuleSearch`, altura, gaps, modo de dos filas, regla móvil y controles
  permitidos en `centerSlot`.
- [x] **`ModuleContextSidebar`:** definir ancho abierto, rail colapsada,
  header, trigger, separación header/content/footer y transición desktop,
  hover y drawer móvil.
- [x] **`ModuleContextPanel`:** fijar ancho, header obligatorio, cierre,
  footer fijo, scroll interno y preset responsive (`inline` en desktop,
  `drawer` full-canvas en móvil).
- [x] **`SuiteCanvas`:** formalizar por modo `overview`, `data`, `workspace`,
  `split`, `board` y `full-bleed` el ancho máximo, padding, gaps, overflow,
  responsive behavior y zonas compatibles.
- [ ] **Tablas:** fijar densidad, alturas de header/fila, padding, mínimo,
  sticky header, truncado, columna de acciones y scroll horizontal exclusivo
  de la tabla.
- [ ] **Cards y superficies:** consumir variantes certificadas para radio,
  borde, fondo, sombra, padding, header/footer y densidad; prohibir
  combinaciones locales de clases para superficies de plataforma.
- [ ] **Controles:** fijar alturas, radios, icon sizes, gaps, focus ring,
  disabled, labels truncados y variantes para botones, `IconButton`, toolbar,
  footer y acciones de tabla.
- [ ] **Breakpoints:** definir transformaciones compartidas para rail,
  sidebar, panel, header, toolbar, tablas y canvas; las páginas no podrán
  redefinir zonas de plataforma con clases responsive locales.
- [ ] **Estados estructurales:** normalizar dimensiones y spacing de loading,
  empty, error, forbidden, read-only, stale y conflict.

**Progreso de implementación**

- [x] **Paso 1:** crear `SuiteCanvasGeometryPreset` y los tipos semánticos
  asociados (`SuiteCanvasGridColumns`, `SuiteCanvasPadding`,
  `SuiteCanvasMaxWidth`, `SuiteCanvasOverflowX`) en
  `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/types.ts`.
- [x] **Paso 2:** añadir presets concretos de geometría a
  `SUITE_SHELL_MODE_PRESETS`.
- [x] **Paso 3:** pasar el preset desde `SuiteRuntime` a `SuiteCanvas`.
- [x] **Paso 4:** aplicar clases certificadas de geometría en `SuiteCanvas`.
- [x] **Paso 5:** añadir cobertura técnica de `board`, `full-bleed`, overflow,
  columnas desktop/móvil, padding y ancho máximo. La evidencia de navegador
  para geometría real queda pendiente antes de cerrar la fase.

#### Slice actual: `ModuleHeader` y `ModuleToolbar`

**Estado:** implementación completada con certificación browser base; ambos
componentes permanecen en `in-progress` hasta completar la revisión visual
detallada de sus grids, alturas y transformaciones.

- `ModuleHeader` ahora expone una cuadrícula estable de tres slots, altura
  tokenizada, modo explícito de una o dos filas y nombre accesible configurable
  para el encabezado y el toggle de contexto.
- `ModuleToolbar` ahora reserva `contextSlot`, conserva el orden left/center/right,
  contiene el overflow en la zona de controles y define una composición móvil
  explícita de dos filas sin crear una tercera fila implícita.
- Se añadieron las especificaciones UI/UX junto a las implementaciones y se
  reabrió la certificación técnica/UI de ambos registros por el cambio de
  contrato y responsive.

**Evidencia:** 8 tests focalizados pasan en `ModuleHeader.test.tsx` y
`ModuleToolbar.test.tsx`; la matriz browser del shell pasa en desktop, tablet y
móvil sin overflow horizontal y sin violaciones Axe críticas/serias.

#### Slice actual: `ModuleContextSidebar` y `ModuleContextPanel`

**Estado:** implementación técnica completada con certificación browser base;
ambos componentes permanecen en `in-progress` hasta completar la revisión
visual detallada de drawer, footer y scroll interno.

- Los headers ya no pueden crear scroll horizontal; las identidades largas se
  contienen con truncado y `min-w-0`.
- `contentScrollable` controla únicamente el contenido; header y footer quedan
  fuera del scroll. El footer conserva su posición fija y el panel mantiene sus
  widths/presentations semánticos.
- Se añadieron atributos de evidencia para width, presentation y scroll, además
  de las especificaciones UI/UX junto a las implementaciones.

**Evidencia:** `ModuleContextSidebar` y `ModuleContextPanel` pasan 13 tests
focalizados en conjunto; la matriz browser del shell pasa en desktop, tablet y
móvil sin overflow horizontal y sin violaciones Axe críticas/serias.

#### Orden de implementación

1. Shell global y `SuiteCanvas`.
2. `ModuleHeader` y `ModuleToolbar`.
3. `ModuleContextSidebar` y `ModuleContextPanel`.
4. Superficies, cards, controles y tablas.
5. Breakpoints, estados y certificación visual de las seis recetas.

#### Criterios de aceptación visual

- [ ] Header, rail, canvas y overlays conservan posición entre recetas.
- [ ] El contenido central tiene scroll vertical único y no existe overflow
  horizontal del shell.
- [ ] `BoardWorkspace` permite scroll horizontal únicamente dentro del board.
- [ ] `ImmersiveWorkflow` ocupa el canvas full-bleed sin adoptar la caja,
  borde o margen del board.
- [ ] Desktop y móvil mantienen la misma jerarquía; sidebar y panel son
  drawers full-canvas en móvil.
- [ ] Dos composiciones con la misma zona alinean `ModuleHeader`, search,
  toolbar, superficies, bordes y márgenes sin ajustes locales.
- [ ] Una página nueva puede declarar receta, zonas, contenido, labels y
  estados, pero no colores, fondos, tamaños, widths, headers, botones,
  scroll, overlays ni breakpoints de plataforma.

**Estado:** implementación y certificación visual completadas. El contrato tipado, los presets
de los seis modos, la propagación `SuiteRuntime -> SuiteCanvas`, la aplicación
de clases semánticas y la matriz técnica de geometría están implementados.
La evidencia de navegador para posiciones y overflow real existe para la
matriz visual del showcase. Los criterios visuales de cierre del shell y la
certificación de los componentes 1–5 fueron aprobados visualmente por el
usuario.

### Fase 3: Promotion and adoption gates

**Objetivo:** Establish component promotion, exception review and validation
gates for all new SaaS views.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-08-17 | Crear `SuiteCanvasGeometryPreset` como contrato tipado inicial. | Separar la intención geométrica de la aplicación visual y preparar presets por modo. | Completa el paso 1 de la Fase 2A; no cambia todavía el render. | Usuario |
| 2026-08-17 | Añadir presets geométricos por modo a `SUITE_SHELL_MODE_PRESETS`. | Mantener la geometría declarativa junto al contrato de `SuiteRuntime` antes de conectarla al render. | Completa el paso 2 de la Fase 2A; los pasos 3 a 5 siguen pendientes. | Usuario |
| 2026-08-17 | Conectar `SuiteRuntime` con `SuiteCanvas` mediante `geometryPreset`. | Hacer que el runtime sea la única fuente de la intención geométrica del módulo sin aplicar todavía clases locales. | Completa el paso 3 de la Fase 2A; la aplicación visual queda para el paso 4. | Usuario |
| 2026-08-17 | Aplicar el preset geométrico en `SuiteCanvas`. | Centralizar max-width, padding, gap y overflow en el canvas; mantener la colocación de regiones en `CompositionGrid` o la receta consumidora. | Completa el paso 4 de la Fase 2A; la cobertura específica de geometría y responsive continúa en el paso 5. | Usuario |
| 2026-08-17 | Completar la matriz técnica de geometría de `SuiteCanvas`. | Verificar los seis modos, columnas desktop/móvil, padding, ancho, overflow y límites de scroll antes de la revisión de navegador. | Completa la cobertura técnica del paso 5; queda pendiente Playwright para confirmar posiciones y overflow en viewport real. | Usuario |
| 2026-08-17 | Endurecer `ModuleHeader` y `ModuleToolbar` como siguiente slice de Fase 2A. | Alinear altura, padding, slots, contexto, selección y transformación móvil con el contrato de Platform Shell. | Implementación y tests focalizados iniciados; certificación visual/Axe pendiente. | Usuario |
| 2026-08-17 | Unificar el breakpoint tablet del shell en `1024px` y reservar explícitamente el gutter del botón de navegación en `PlatformHeader`. | Evitar que el drawer aparezca inerte o que el botón de hamburguesa cubra el logo en iPad; mantener el header fijo sin espacio superior duplicado. | `AppShell` y `PlatformHeader` quedan alineados para tablet; la cobertura queda separada en commits de implementación y E2E. | Usuario |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Suites create local visual systems | Visual drift and duplicated maintenance | Shared recipes, ownership and exception gates | platform | open |
| Technical backgrounds reduce data readability | Cognitive load and accessibility regressions | Contrast, density and usage constraints | platform | open |
| Canvas modes become coupled to decoration | Inflexible structural contracts | Keep modes and recipes independent | platform | mitigated |
| Visual validation is subjective | Inconsistent review outcomes | Token checks, focused tests and reference compositions | governance | open |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Every standardization area has an owner, contract and evidence.
- [ ] Reference compositions pass visual and accessibility review.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-08-14 | Vitest completo | 139 archivos y 557 tests pasaron | `pnpm test` |
| 2026-08-14 | Build de LoopDev OS | Compilación, TypeScript y generación de páginas pasaron | `pnpm --filter loopdev-os build` |
| 2026-08-14 | Showcase runtime | `/composition-showcase` respondió HTTP 200 en desarrollo | `http://localhost:3000/composition-showcase` |
| 2026-08-14 | Enlaces y formato | Sin errores de formato; enlaces Markdown válidos | `git diff --check`, `pnpm docs:links:check` |
| 2026-08-14 | CreativeEditor layout contract | Regions now declare rows, placement, sizing and overflow; shell zones remain separate | `packages/contracts/src/platform/composition.ts`, `CompositionGrid/fixtures.ts` |
| 2026-08-14 | Automated readiness validation | 139 test files and 557 tests passed; LoopDev OS production build passed; browser review requires an authenticated session | `pnpm test`, `pnpm --filter loopdev-os build`, `/composition-showcase` |
| 2026-08-14 | TechnicalSurface contract | 5 focused tests passed, including semantic radius, border tone, width, grid and accessibility | `ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface/TechnicalSurface.test.tsx` |
| 2026-08-14 | Shared recipe state fixtures | All composition regions now expose loading, empty, error, forbidden, read-only, offline, stale and conflict treatments | `apps/loopdev-os/src/app/composition-showcase/page.tsx` |
| 2026-08-14 | Declarative reference fixtures | SuiteOverview now renders through CompositionGrid; DataWorkspace has filters, table and pagination; 2 focused contract tests passed | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.test.ts` |
| 2026-08-14 | Browser responsive review | Authenticated Playwright review passed for SuiteOverview and CreativeEditor at 1440, 1024 and 390; no horizontal overflow detected | `e2e/composition-showcase.visual.spec.mjs` |
| 2026-08-14 | Record and board reference fixtures | RecordWorkspace and BoardWorkspace render declarative regions with representative content, shared states and responsive overflow handling; 4 contract tests passed | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.test.ts`, `e2e/composition-showcase.visual.spec.mjs` |
| 2026-08-14 | Interaction and accessibility certification | Keyboard focus, read-only/forbidden action guards and reduced motion passed; 3 Playwright tests passed | `e2e/composition-showcase.interaction.spec.mjs`, `apps/loopdev-os/src/app/globals.css` |
| 2026-08-14 | Split, immersive and editor certification | SplitWorkspace and ImmersiveWorkflow now render domain fixtures; CreativeEditor exposes active tool, loading transport and focusable timeline; 8 Playwright tests passed across responsive and interaction specs | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `e2e/composition-showcase.visual.spec.mjs`, `e2e/composition-showcase.interaction.spec.mjs` |
| 2026-08-14 | Cross-cutting readiness certification | Light/dark toggle, semantic theme audit, navigation fallback, performance marks and sensitive-data-free observability passed in 10 authenticated Playwright tests | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `e2e/composition-showcase.interaction.spec.mjs` |
| 2026-08-17 | `SuiteCanvasGeometryPreset` contract | New semantic geometry types compiled cleanly; existing SuiteCanvas behavior preserved with 15 focused tests passing | `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/types.ts`, `SuiteCanvas.test.tsx` |
| 2026-08-17 | `SuiteShellModePreset` geometry values | All six canvas modes expose typed geometry presets; split, board and full-bleed assertions pass | `ds/packages/ui/src/components/composites/shell/SuiteRuntime/presets.ts`, `SuiteRuntime.test.tsx`; `pnpm exec vitest run ds/packages/ui/src/components/composites/shell/SuiteRuntime/SuiteRuntime.test.tsx` |
| 2026-08-17 | `SuiteRuntime` to `SuiteCanvas` geometry propagation | Runtime passes the active mode preset and SuiteCanvas exposes its semantic geometry without local layout application; 23 focused tests passed | `ds/packages/ui/src/components/composites/shell/SuiteRuntime/index.tsx`, `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/index.tsx`, `SuiteRuntime.test.tsx`, `SuiteCanvas.test.tsx` |
| 2026-08-17 | `SuiteCanvas` geometry application | Board applies wide/zone-only geometry and full-bleed removes bounded width and exterior padding; 25 focused tests pass | `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/types.ts`, `SuiteCanvas/index.tsx`, `SuiteCanvas.test.tsx`, `SuiteRuntime.test.tsx` |
| 2026-08-17 | `SuiteCanvas` geometry matrix | Six modes, desktop/mobile columns, padding, max-width and board scroll isolation covered; 32 focused tests pass | `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/SuiteCanvas.test.tsx`, `SuiteRuntime.test.tsx`; `pnpm exec vitest run ...` |
| 2026-08-17 | Browser geometry review | Composition showcase visual matrix passed 9/9 scenarios across desktop, mobile and mobile-compact. `CreativeEditor` is intentionally excluded from mobile validation under its desktop/tablet-only product scope. | `e2e/composition-showcase.visual.spec.mjs`; `PLAYWRIGHT_E2E_AUTH_BYPASS=true NEXT_PUBLIC_E2E_AUTH_BYPASS=true pnpm exec playwright test e2e/composition-showcase.visual.spec.mjs --project=desktop --project=mobile --project=mobile-compact --workers=1` |
| 2026-08-17 | CreativeEditor mobile scope | CreativeEditor is desktop/tablet-only for the current reference phase; mobile composition validation excludes it instead of forcing an unsuitable video-editor adaptation. Reopen when a dedicated mobile editing product contract exists. | `e2e/composition-showcase.visual.spec.mjs`, `docs/03-platform/CREATIVE_EDITOR_DESIGN_HANDOFF.md` |
| 2026-08-17 | ModuleHeader / ModuleToolbar focused contract | 8 focused tests pass; stable slot grid, explicit accessible names, tokenized heights and two-row mobile toolbar contract are covered. Shell browser matrix and Axe base evidence now pass; detailed visual assertions remain open. | `ds/packages/ui/src/components/composites/workspace/ModuleHeader/ModuleHeader.test.tsx`, `ds/packages/ui/src/components/composites/workspace/ModuleToolbar/ModuleToolbar.test.tsx`, `e2e/shell-showcase.visual.spec.mjs` |
| 2026-08-17 | Shell showcase browser certification | 12 Playwright tests passed across desktop, tablet and mobile projects: shell containment, compact `UserMenu` profile trigger and no critical/serious Axe violations. | `e2e/shell-showcase.visual.spec.mjs`; `PLAYWRIGHT_E2E_AUTH_BYPASS=true NEXT_PUBLIC_E2E_AUTH_BYPASS=true pnpm exec playwright test e2e/shell-showcase.visual.spec.mjs --project=desktop --project=mobile --project=mobile-compact --workers=1` |
| 2026-08-17 | iPad shell navigation breakpoint | The navigation toggle remains visible beside the LoopDev logo at the 1024px iPad boundary; the PlatformHeader reserves the mobile navigation gutter through that breakpoint. Focused browser check passed. | `ds/packages/ui/src/components/composites/shell/AppShell/index.tsx`, `PlatformHeader/index.tsx`, `e2e/shell-showcase.visual.spec.mjs` |
| 2026-08-17 | Tablet navigation regression fix | `AppShell` treats `1024px` as the mobile/overlay boundary, `PlatformHeader` gives the navigation gutter priority over `md:px-5`, and the top header remains fixed without an extra upper gap. AppShell and PlatformHeader focused tests passed (16 total); the iPad geometry E2E passed (1 test). | Commits `ce35e9e` and `155b060`; `AppShell.test.tsx`, `PlatformHeader.test.tsx`, `e2e/shell-showcase.visual.spec.mjs` |
| 2026-08-17 | ImmersiveWorkflow declarative composition | Migrated the showcase workflow regions from page-local grid classes to `IMMERSIVE_WORKFLOW_COMPOSITION` rendered through `CompositionGrid`; visual review approved the resulting workflow, actions and status placement. | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.ts`; 4 fixture tests and 3 desktop visual tests passed |
| 2026-08-17 | Showcase surfaces and cards audit | The six reference recipes use `TechnicalSurface` for primary surfaces and the certification catalog uses `TechnicalCard`; remaining local border/background/padding classes are confined to legitimate internal content such as timeline, board columns, badges, state indicators and certification examples. No structural page surface migration is required in this slice. | `apps/loopdev-os/src/app/composition-showcase/page.tsx`; `TechnicalSurface.test.tsx` and `TechnicalCard` certification coverage |
| 2026-08-17 | Board forbidden-state regression | `BoardWorkspace` forbidden interaction passed after restoring the missing `EmptyState` import in the showcase. | `apps/loopdev-os/src/app/composition-showcase/page.tsx`, `e2e/composition-showcase.interaction.spec.mjs` |
| 2026-08-17 | Internal surfaces, controls and tables contract | TechnicalSurface, TechnicalCard, Button and IconButton expose semantic contract markers without changing baseline classes; ResponsiveTable exposes density/pagination/scroll ownership and locks sorting/pagination in non-interactive states. 52 focused tests pass. | `ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface`, `TechnicalCard`, `Button`, `IconButton`, `ds/packages/ui/src/components/composites/content/ResponsiveTable` |
| 2026-08-17 | EntityTable responsive certification | 19 Playwright tests passed across desktop, mobile and mobile-compact; 2 theme-toggle checks skipped on mobile because the control is intentionally hidden. Table overflow is isolated to the table zone and the page remains contained. | `e2e/entity-table.certification.spec.mjs`; `PLAYWRIGHT_E2E_AUTH_BYPASS=true NEXT_PUBLIC_E2E_AUTH_BYPASS=true pnpm exec playwright test e2e/entity-table.certification.spec.mjs --project=desktop --project=mobile --project=mobile-compact --workers=1` |
| 2026-08-17 | Component and registry governance | UI/UX specs added for both workspace composites; registry catalog regenerated and checks passed; contract ownership and source-contract checks passed. | `ModuleHeader/UI_UX_SPEC.md`, `ModuleToolbar/UI_UX_SPEC.md`, `pnpm registries:check`, `pnpm docs:links:check`, `pnpm contracts:ownership:check`, `pnpm certification:source-contracts` |
| 2026-08-17 | Shell validation | 36 focused shell tests passed. Typecheck remains blocked by existing errors in `Select` and the already-modified `SuiteSidebar` Lucide typing; no errors were reported in the ModuleHeader/ModuleToolbar slice. | `pnpm test:shell:changed` |
| 2026-08-17 | ModuleContextSidebar header overflow | The visible scrollbar in the shell showcase was horizontal header overflow caused by the long context label and `overflow-x-auto`; the shared header now contains overflow and truncates the label while preserving intentional vertical content scrolling. 6 focused tests pass. | `ds/packages/ui/src/components/composites/shell/ModuleContextSidebar/index.tsx`, `ModuleContextSidebar.test.tsx` |
| 2026-08-17 | ModuleContextSidebar / ModuleContextPanel contract | Headers contain overflow, content is the only configurable scroll zone, footer remains outside scrolling, and semantic width/presentation evidence is exposed. 13 focused tests pass. | `ds/packages/ui/src/components/composites/shell/ModuleContextSidebar/`, `ds/packages/ui/src/components/composites/shell/ModuleContextPanel/` |
| 2026-08-18 | CRM reference composition geometry | DataWorkspace, RecordWorkspace and BoardWorkspace pass the composition visual matrix `9/9` across desktop, tablet, mobile and mobile-compact; RecordWorkspace read-only focus and BoardWorkspace forbidden action guards pass `2/2`. | `e2e/composition-showcase.visual.spec.mjs`, `e2e/composition-showcase.interaction.spec.mjs`; E2E run with explicit auth bypass |
| 2026-08-18 | Complete reference recipe viewport coverage | All eight registered recipes, including CertificationLab, are included in the visual matrix: 22 recipe/viewport checks pass across desktop, mobile and mobile-compact. CreativeEditor remains excluded from mobile by contract. | `e2e/composition-showcase.visual.spec.mjs`; explicit auth-bypass Playwright run |
| 2026-08-18 | Shared review-state certification | All eight recipes expose and accept the nine shared review states, covering 72 recipe/state combinations. The matrix also caught and fixed a real `loading` crash caused by the missing `LoadingState` import. | `e2e/composition-showcase.interaction.spec.mjs`; focused matrix `1/1`, full composition validation `12/12` |
| 2026-08-18 | Recipe-specific state actions | DataWorkspace selection/clear, ImmersiveWorkflow read-only/stale continuation guards and CertificationLab CRM navigation pass dedicated interaction checks `3/3`. | `e2e/composition-showcase.interaction.spec.mjs`; full interaction suite `12/12` |
| 2026-08-18 | Cross-cutting Axe, stress, performance and typography checks | All eight recipes pass serious/critical Axe checks after correcting contextual-action and static-card ARIA defects. DataWorkspace long-filter pressure and BoardWorkspace overflow isolation pass. Showcase state-change measurements remain under the `2000 ms` app budget, and computed typography/inline color checks pass. | `e2e/composition-showcase.interaction.spec.mjs`; focused cross-cutting run `4/4` |
| 2026-08-18 | Production build and global typecheck baseline | `loopdev-os` production build passed compilation, TypeScript, page data collection, 35 static pages and optimization. Monorepo typecheck passed all 11 Turbo tasks. Runtime composition measurements remain under `2000 ms`; build timing observed at approximately 4–6 seconds after cache warm-up. | `pnpm --filter loopdev-os build`, `pnpm typecheck` |
| 2026-08-18 | Global certification closure | 692 of 692 tests passed across 153 files. `FilterDropdown` now renders the selected-count indicator independently of `onClear`, and its Radix interaction/Axe expectations pass `6/6`. `SelectionTable` expectations now account for the desktop and mobile render trees. Global typecheck passes all 11 Turbo tasks and the `loopdev-os` production build passes. | `pnpm test`, `pnpm typecheck`, `pnpm --filter loopdev-os build`, focused `FilterDropdown` and `SelectionTable` suites |

## Handoff de sesión

- **Fecha:** 2026-08-17.
- **Rama de continuación:** `feature/crm-ui-foundation`.
- **Commits de partida:** `ce35e9e` (`fix(shell): align tablet navigation header`) y `155b060` (`test(shell): cover tablet navigation geometry`).
- **Estado alcanzado:** Fase 0 y Fase 1 completadas. En Fase 2A, los pasos técnicos 1–5 de geometría están completados y la navegación responsive del Platform Shell queda validada visualmente en desktop, tablet y móvil. `ModuleHeader` y `ModuleToolbar` permanecen como slice de endurecimiento del shell.
- **Archivos clave:** `ds/packages/ui/src/components/composites/workspace/SuiteCanvas/`, `ds/packages/ui/src/components/composites/shell/SuiteRuntime/`, `ds/packages/ui/src/components/composites/workspace/ModuleHeader/`, `ds/packages/ui/src/components/composites/workspace/ModuleToolbar/`, `apps/loopdev-os/src/app/composition-showcase/page.tsx`.
- **Decisiones, bloqueos y riesgos:** La geometría de `CreativeEditor` no se reabre sin nueva evidencia visual; su alcance móvil sigue excluido por contrato. La Fase 2 y el CRM readiness gate continúan abiertos por criterios visuales, tipografía, superficies, densidad, performance, excepciones y especificación de la primera vista CRM.
- **Validación ejecutada:** tests focalizados de `SuiteCanvas` y `SuiteRuntime` (32 pasaron); `AppShell` y `PlatformHeader` (16 pasaron); E2E de geometría iPad (1 pasó); matriz visual de `composition-showcase` documentada como 9/9; Vitest global `692/692` en 153 archivos; typecheck global `11/11`; build de producción de `loopdev-os` correcto.
- **Siguiente acción concreta:** completar revisión visual humana y cerrar la aprobación explícita del readiness gate. No reabrir la navegación tablet salvo nueva evidencia visual.

## Cierre

Aprobación visual explícita recibida el 2026-08-18. La revisión visual confirma que
las composiciones, tablas, estados, densidad, responsive geometry, tipografía,
contraste y superficies están listas para avanzar. El readiness gate queda cerrado
con la certificación automatizada `692/692`, typecheck `11/11` y build de producción
correcto.
