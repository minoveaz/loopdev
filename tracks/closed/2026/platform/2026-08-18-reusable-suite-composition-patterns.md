---
id: reusable-suite-composition-patterns
title: Reusable suite composition patterns
status: closed
created: 2026-08-18
updated: 2026-08-19
closed: 2026-08-19
owner: platform
lead: User
branch: feature/reusable-suite-composition-patterns
branches: []
phase: 2
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, frontend, design-system]
dependencies: [platform-shell-mode-inventory, crm-ui-foundation]
blocked_by: []
supersedes: []
---

# Reusable suite composition patterns

## Outcome

Define and implement reusable operational interaction patterns that can compose CRM and future
suite pages without coupling shared UI to a domain, persistence layer, authorization model or
specific route.

## Context

Shell, SuiteRuntime, SuiteCanvas, canvas modes, surfaces, layers, primitives and data-table
compositions are available. The next reusable boundary is the pattern layer between primitives and
module pages. This track provides stable contracts for repeated operational workflows while keeping
business logic in the consuming suite.

## Decisiones aprobadas para C11

| Fecha      | Decisión                                                                                                 | Motivo                                                                                                | Impacto                                                                                                | Aprobado por |
| ---------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------ |
| 2026-08-19 | C11 se implementa en este track como una certificación visual y contractual pequeña del Kanban genérico. | Validar la composición reutilizable sin mezclar Pipeline CRM, persistencia o permisos en el DS.       | Se usa `KanbanBoard` existente; no se instala `dnd-kit` ni se implementa drag and drop de producto.    | User         |
| 2026-08-19 | Los bloques Kanban admiten tonos semánticos controlados por etapa.                                       | Permitir estados visuales como oportunidades perdidas sin hardcodear lógica CRM ni colores de tenant. | El contrato usa `neutral`, `primary`, `success`, `warning` y `danger`; la suite decide el significado. | User         |
| 2026-08-19 | Las capacidades avanzadas quedan documentadas para un futuro track específico de Kanban.                 | Mantener C11 pequeño y estable sin perder el backlog de evolución.                                    | El futuro track cubrirá interacción, accesibilidad avanzada, vistas, selección y estados operativos.   | User         |

## Alcance inicial

### Incluido

- Audit existing search, command, filter and toolbar primitives before creating duplicates.
- Define the ownership and public contracts for `SearchInput`, `FilterBar` and `QueryToolbar`.
- Cover loading, empty, error, disabled, read-only, keyboard, focus, accessibility and responsive
  states.
- Provide fixtures, focused tests, Axe evidence and responsive showcase coverage.
- Demonstrate consumption through a domain-neutral fixture and one CRM-oriented composition without
  adding CRM data fetching or persistence.
- Record registry, documentation and ownership evidence for every promoted pattern.

### Excluido

- Supabase, RLS, tenant authorization, CRM contracts or server-side data access.
- Entity-specific search behavior, ranking, debouncing policy or query persistence.
- New Shell, SuiteRuntime or SuiteCanvas contracts.
- Route implementation for Contacts, Leads, Pipeline, Tasks or Customer 360.
- Promotion of a pattern without a reviewed contract and focused evidence.
- Implementation of product-specific drag and drop for Pipeline CRM or adoption
  of an external drag and drop dependency.

## Primer slice

1. `SearchInput`: controlled query entry, clear, loading, submit, keyboard and accessible status.
2. `FilterBar`: active filter tokens, reset behavior, overflow and mobile representation.
3. `QueryToolbar`: composition boundary with slots for search, filters, view controls and actions.

The first slice must keep fetching, permissions, query serialization and domain semantics in the
consumer. `SearchCombobox` and `SearchCommand` remain separate future patterns because selection
and command navigation have different semantics from text search.

## Fases

### Fase 0: inventario y contrato

- [ ] Existing primitives and duplicate implementations are inventoried.
- [ ] Ownership layer and public API are approved for each pattern.
- [ ] Controlled state, events, slots and consumer responsibilities are documented.
- [ ] Responsive recipes are mapped to validated SuiteCanvas modes.

### Fase 1: implementation and evidence

- [ ] SearchInput implemented with focused unit and Axe coverage.
- [ ] FilterBar implemented with active, reset and responsive states.
- [ ] QueryToolbar implemented as a compositional boundary.
- [ ] Domain-neutral fixtures and responsive Playwright evidence pass.
- [ ] Registry and documentation links match implementation ownership.

### Fase 2: promotion

- [ ] Patterns are consumed by at least two distinct composition contexts or the reuse decision is
      explicitly documented.
- [ ] Accessibility, visual, responsive and source-contract gates pass.
- [ ] Handoff documents define how CRM and future suites consume the patterns.

### Cierre operativo de Fases A y B

- [x] Contratos compartidos implementados y consumidos por la composición de
      certificación.
- [x] A1-A5 revisados visualmente en claro, oscuro, desktop y mobile.
- [x] B6-B8 revisados visualmente en claro, oscuro, desktop y mobile.
- [x] B7 cerrado como handoff sin duplicar la certificación de
      `ResponsiveTable`.
- [x] Tests focalizados, TypeScript, Prettier y `git diff --check` pasan.
- [x] `pnpm certification:source-contracts` pasa después de retirar estilos
      inline no consumidos de `EmptyState` y `LoadingState`.
- [x] Promoción completa en registry y documentación pública de
      `SearchInput`, `FilterBar`, `QueryToolbar` y `Pagination`.
- [x] `pnpm front:check` completo: formato, clases duplicadas, ownership de
      contratos, source-contracts, `front:audit`, duplicación y Knip completan
      el gate con código de salida 0 el 2026-08-19.

**Decisión:** las Fases A y B quedan cerradas en implementación, composición,
revisión visual y evidencia focalizada. C10, C11 y C12 quedan cerrados dentro
del alcance de este track. El gate global `front:audit` queda como deuda de
plataforma separada; no se añade a la baseline ni se considera resuelto por
esta certificación.

## Criterios de cierre

- [x] No duplicate shared component is introduced.
- [x] Public contracts do not contain CRM entity or persistence semantics.
- [x] All supported states and responsive transformations have evidence.
- [x] At least one real or representative suite composition consumes the slice.
- [x] Registry, tests, fixtures and documentation are synchronized.
- [x] Closure is approved explicitly by the user.

### Deuda global posterior al cierre

El trabajo de calidad frontend posterior se resolvió en la misma rama sin
modificar la baseline: `front:audit` reporta 0 hallazgos y `pnpm front:check`
completa el gate con código de salida 0. La deuda restante de Knip son avisos
informativos de exports no usados o duplicados y no bloquea el cierre.

## Relacion con CRM

CRM consumes this track as a shared frontend capability. It does not replace `crm-shared-foundation`
and does not unblock G0, G1 or module implementation. CRM-specific data, permissions and query
behavior remain owned by the CRM tracks.

## Plan de bloques reutilizables

El programa se organiza en doce bloques compartidos para CRM y futuras suites.
Cada bloque debe conservar contratos domain-neutral, evidencia responsive y de
accesibilidad, y reutilizar componentes existentes antes de introducir nuevos.

### Fase A: base operativa compartida

1. **Fundaciones y superficies**: `TechnicalSurface`, `TechnicalCard`,
   `LpdText`, `Heading`, `Divider`, `ScrollArea`, `TechnicalTooltip` y
   `CompositionGrid`.
2. **Controles de entrada y selección**: `Input`, `Select`, `FilterDropdown`,
   `Textarea`, `Checkbox`, `RadioGroup`, `Switch` y selección múltiple.
3. **Estados de contenido**: `EmptyState`, `LoadingState`, error, forbidden,
   read-only, conflicto, datos obsoletos y guardado exitoso.
4. **Identidad y estados semánticos**: `UserAvatar`, `Badge`, `TechnicalLabel`,
   `StatusBadge` y la taxonomía común de severidades y lifecycle states.
5. **Orientación y navegación interna**: `PageHeader`, `SectionHeader`,
   `ContextPath`, breadcrumbs, tabs y navegación local de módulo.

**Estado:** iniciada. A1 queda reconocido como baseline existente y certificado;
no se repite su implementación ni su certificación visual. El frente activo es
A2, controles de entrada y selección. No se crearán duplicados de `DataTable`,
feedback global ni navegación del Shell.

### Estado de ejecución de Fase A

- [x] **A1 Fundaciones y superficies:** reutilización y certificación existentes.
- [x] **A2 Controles de entrada y selección:** implementación promovida y
      revisión visual responsive aprobada. `Input` y `FilterDropdown` fueron las
      referencias de contrato.
- [x] **A3 Estados de contenido:** implementación promovida y revisión visual
      conjunta aprobada.
- [x] **A4 Identidad y estados semánticos:** implementación promovida y
      revisión visual conjunta aprobada.
- [x] **A5 Orientación y navegación interna:** implementación promovida y
      revisión visual conjunta aprobada.

### Fase B: flujo operativo común

6. **Consulta y toolbar**: `SearchInput`, `FilterBar`, `QueryToolbar`,
   filtros activos, reset, orden, vista y `Pagination`.
7. **Datos y listados**: `ResponsiveTable`, selección de filas, acciones
   masivas, estados responsive y composición `DataWorkspace`.
8. **Workspace y detalle de registros**: `SuiteCanvas`, `InspectorPanel`,
   split view, list-detail, `RecordWorkspace`, focus restoration y dirty state.

**Estado de ejecución de Fase B:** B7 queda cerrado como evidencia de handoff
entre la query controlada y el contrato de listado certificado. B6 permanece
como base implementada que alimenta ese handoff; B8 queda como el siguiente
bloque de trabajo y no se considera cerrado en esta actualización.

- [x] **B6 Consulta y toolbar:** placeholder contextual visible, filtros y
      reset controlados, `Sort` sin badge numérico, selector de vista segmentado,
      paginación separada y layout responsive para desktop y mobile.
- [x] **B7 Handoff de datos y listados:** ownership explícito del resultado
      filtrado y consumo del contrato `ResponsiveTable`, sin duplicar la
      certificación de tabla.
- [x] **B8 Workspace y detalle:** split view con lista navegable, registro
      seleccionado, `InspectorPanel`, cierre, metadatos legibles y estado dirty
      visible con acción `Discard`; revisión visual aprobada.

**Evidencia B7:** tests focalizados de `SearchInput`, `FilterDropdown`,
`QueryToolbar`, `FilterBar` y `Pagination` pasan; TypeScript, Prettier y
`git diff --check` pasan. La revisión visual del handoff y de los controles
reutilizados fue aprobada en modo claro y oscuro, en desktop y mobile.

**Decisión de no duplicación:** B7 no renderiza otra `ResponsiveTable` ni
recertifica selección, estados o paginación de tabla. Esa evidencia permanece
en `ResponsiveTableCertification`, `DataTablesCatalog` y los tests del
componente compartido. `QueryToolbar` conserva slots para `pagination` y
`sort.control` para que las composiciones conecten estos contratos sin crear
variantes de tabla.

**Aprobación visual:** Fase A (A1-A5) y Fase B (B6-B8) fueron revisadas y
aprobadas visualmente en modo claro y oscuro, en desktop y mobile. Esta
aprobación no sustituye los gates técnicos globales pendientes.

**Revisión visual C10 (2026-08-19):** La composición de dashboards y resumen
(`DashboardSummaryCertification`) fue revisada y aprobada en móvil y desktop,
en modo claro y oscuro. La revisión cubre métricas, actividad, acciones rápidas,
próximos pasos, progreso y resumen de calendario. El layout móvil se mantiene
sin overflow visible mediante composición responsive sobre componentes DS
existentes. No se crean nuevos componentes de calendario, progreso o resumen en
esta iteración; la necesidad de extraerlos queda pendiente de consumidores
reales y del track de evaluación de dependencias externas.

**Evidencia técnica C10:** La fixture consume `MetricCard`, `ActivityStream`,
`QuickActionMenu`, `TechnicalSurface`, `Button` e `Icon` desde `@loopdev/ui`.
El ajuste responsive de `ActivityStream` evita overflow en móvil sin alterar el
layout de desktop. No se promovió la fixture como componente compartido ni se
añadió una entrada de registry, porque representa una composición de
certificación y no una responsabilidad reutilizable independiente.

Validación ejecutada el 2026-08-19: test focalizado de `ActivityStream` (3/3,
incluida accesibilidad base), typecheck de `@loopdev/ui`, Prettier y
`git diff --check`.

### Fase C: operaciones avanzadas y plataforma

9. **Acciones operativas**: `Button`, `IconButton`, menús de acción, bulk
   actions, confirmaciones, export/import, retry y undo.
10. [x] **Dashboards y resumen:** métricas, actividad, quick actions, próximos
        pasos, progreso y resúmenes de calendario; composición responsive aprobada
        en móvil y desktop, claro y oscuro.
11. [x] **Tableros y visualizaciones:** `KanbanBoard`, timeline, activity stream,
        progreso y vistas board/list con alternativa de teclado. En este track se
        limita a contrato y certificación visual del patrón; la implementación real
        de drag and drop, incluyendo `dnd-kit`, queda reservada al Pipeline CRM.
        Las columnas deben admitir tonos semánticos controlados (`neutral`,
        `primary`, `success`, `warning`, `danger`) para representar etapas como
        oportunidades perdidas sin introducir colores de tenant ni lógica CRM en
        el componente compartido.

### C11: alcance de esta iteración

**Objetivo:** certificar un Kanban genérico que cualquier suite pueda componer
cuando necesite una vista de etapas, sin convertirlo en un motor de workflow.

**Incluido en C11**

- Fixture domain-neutral con cuatro o cinco columnas.
- Columnas con ancho estable, scroll horizontal controlado y scroll vertical
  interno para tarjetas.
- Tonos semánticos de columna: `neutral`, `primary`, `success`, `warning` y
  `danger`.
- Contadores y métricas opcionales por columna.
- Tarjetas custom mediante `renderCard`.
- Estados visuales normal, hover, focus, selected, read-only y disabled.
- Loading, empty board, empty column y contenido largo.
- Acciones de tarjeta y columna mediante slots o callbacks.
- Revisión responsive en desktop, tablet y mobile, en claro y oscuro.
- Alternativa visual reservada para `Move to...`, sin implementar todavía la
  mutación de Pipeline.

**Excluido de C11**

- `dnd-kit` y drag and drop de producto.
- Persistencia, optimistic updates, rollback y auditoría.
- Permisos CRM y reglas de transición entre etapas.
- Datos, fetching y contratos de entidades CRM.
- Swimlanes, timeline, dependencias y automatizaciones.
- Bulk selection completa y acciones masivas de dominio.

**Estado:** certificado visualmente y contractualmente el 2026-08-19.

**Evidencia de C11:** La fixture `KanbanBoardCertification` consume el
`KanbanBoard` y `ResponsiveTable` existentes desde `@loopdev/ui`, con datos
domain-neutral, cinco columnas, tonos semánticos, métricas, búsqueda, filtros,
ordenación y selector Board/List. La vista List usa la superficie estándar de
`ResponsiveTable`; en mobile utiliza su contrato `renderMobileRow` para
transformarse en una lista legible, sin crear una tabla paralela.

La revisión visual fue aprobada en claro y oscuro, desktop y mobile. Se
verificaron superficie, contraste, overflow horizontal del board, touch targets,
acciones, estado vacío y comportamiento responsive de la lista. No se instala
`dnd-kit` ni se implementa mutación de Pipeline en C11.

**Validación técnica ejecutada:** Prettier, TypeScript de `loopdev-os`, tests
focalizados de `ResponsiveTable` (12/12) y `git diff --check`.

**Handoff:** C11 queda cerrado en este track. La interacción avanzada de
Kanban, incluyendo drag and drop con mouse, touch y teclado, ordenación,
rollback, persistencia, permisos y adapter de `dnd-kit`, queda reservada para
el futuro track específico de Pipeline CRM.

**Backlog para un futuro track específico de Kanban**

- Drag and drop con mouse, touch y teclado; `dnd-kit` se evaluará e
  implementará en el Pipeline CRM mediante un adapter LoopDev.
- Ordenamiento dentro de columnas y movimiento entre columnas.
- Drag overlay, colisiones, restricciones y cancelación.
- Anuncios accesibles, focus restoration y alternativa completa de `Move to...`.
- Capacidad por columna y estados por encima del límite.
- Filtros, búsqueda y estado `filtered empty` integrados con `QueryToolbar`.
- Selección múltiple, bulk actions y acciones contextuales avanzadas.
- Columnas colapsables, swimlanes y agrupación por responsable o prioridad.
- Vistas board/list y transformación específica para mobile.
- Offline/stale state, errores por tarjeta y recuperación de mutaciones.
- Contratos de rendimiento, bundle, SSR, Axe y evidencia Playwright.

**Criterio de no duplicación:** C11 debe componer `KanbanBoard`, `TechnicalSurface`,
`StatusBadge`, `QueryToolbar` y primitives existentes siempre que cubran la
responsabilidad. No se crearán `PipelineCard`, `KanbanColumnHeader` u otros
componentes CRM dentro de `@loopdev/ui` durante esta iteración.

### C12: feedback y contexto global

**Estado:** certificado visualmente y contractualmente el 2026-08-19.

**Evidencia de C12:** La fixture `InteractionFeedbackCertification` compone los
contratos existentes `TechnicalDialog`, `ToastItem` y `CommandDialog` desde
`@loopdev/ui`. El flujo domain-neutral cubre confirmación de archivado,
feedback de éxito con `Undo`, error con `Retry`, dismiss, restauración y
comandos accionables para archivar, restaurar y abrir actividad.

La revisión visual fue aprobada en claro y oscuro, desktop y mobile. Se
verificó que `CommandDialog` se centra en el viewport móvil, mantiene búsqueda,
grupos y navegación por teclado, y que sus comandos ejecutan acciones reales de
la fixture mediante `onSelect`. No se creó una command palette paralela ni se
introdujo lógica CRM o persistencia.

**Validación técnica ejecutada:** Prettier, TypeScript de `loopdev-os`, tests
focalizados de `CommandDialog` (5/5) y `git diff --check`.

**Handoff:** C12 queda cerrado en este track. Las operaciones de negocio,
persistencia, permisos y recuperación remota pertenecen a los consumidores de
suite; este bloque certifica únicamente la composición y los contratos de
feedback/contexto.

12. **Feedback y contexto global**: `Toast`, `CommandDialog`,
    `TechnicalDialog`, `PlatformHeader` con bombillo, `ContextPanelHost` y
    `PlatformContextPanel` para notificaciones, ayuda, asistente y perfil.

**Evidencia existente:** el bloque 12 y los patrones principales del bloque 6
ya cuentan con certificación en `Loopdev components`. Se conservan como base y
no se repiten; las fases siguientes deben consumirlos.

## Entrega inicial de la Fase A

La Fase A continúa con una matriz de contratos y reutilización con estas
salidas, en este orden:

1. **A1 completado:** conservar tokens, superficies y tipografía compartida
   como baseline certificada.
2. **A2 activo:** consolidar `Input`, `Select`, `FilterDropdown`, `Checkbox`,
   `Textarea`, `RadioGroup` y `Switch` con contratos públicos, estados nativos,
   accesibilidad y evidencia responsive. Los tres últimos se crearon porque
   forman parte del alcance aprobado y no existían en el inventario físico.
3. Auditar estados para evitar solapamiento entre `EmptyState`, `LoadingState`,
   `Skeleton`, error y forbidden.
4. Definir la taxonomía semántica de identidad, status y severidad.
5. Resolver `ContextPath` frente a `IndustrialBreadcrumbs` y separar
   orientación interna de navegación del Shell.
6. Crear una fixture común de Fase A y añadir evidencia focused de teclado,
   Axe y responsive.

La implementación de A1-A5 está disponible en `Loopdev components`. La Fase A
no abre módulos CRM ni introduce persistencia, autorización, queries de negocio
o contratos de entidades. Su cierre requiere una revisión visual conjunta en
desktop/mobile, contratos públicos, tests focused, Axe y documentación
sincronizada.
