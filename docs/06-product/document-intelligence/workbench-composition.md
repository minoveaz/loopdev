---
title: Document Intelligence Workbench — composición RecordWorkspace (prototipo Fase 0)
status: ready-for-review
owner: ai-platform
reviewed_at: pendiente
track: tracks/active/ai-platform/2026-09-05-document-intelligence-poc-migration.md
issue: 176
---

# Document Intelligence — especificación de composición RecordWorkspace

Workbench navegable guiado por fixtures e intake cliente, sin provider real, backend ni lógica
copiada de VitaBlue. La aprobación visual sigue siendo un gate independiente y pendiente.

## Identity

- **Suite:** `document-intelligence` (`apps/loopdev-os/src/suites/document-intelligence/`)
- **Public surfaces:**
  - `DocumentIntelligenceHome`: `/document-intelligence`
  - `NewDocumentExtraction`: `/document-intelligence/new`
  - `DocumentExtraction`: `/document-intelligence/:documentId`
- **Internal composition:** `workbench` / `RecordWorkspace` (no es nomenclatura de ruta pública)
- **Owner:** `ai-platform`
- **Canvas mode:** `workspace`
- **Visual recipe:** `RecordWorkspace` (header, tabs, record, inspector)

## Composition

- **Regions and owners:**
  - `PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel`, `SuiteCanvas`: shell de plataforma
    (obligatorias, sin variantes locales).
  - Header: `ModuleHeader` vía `moduleHeaderRenderers` de `SuiteRuntime`; los segmentos se derivan
    de `SuiteConfig.modules[].breadcrumbs`. Desktop conserva `Document Intelligence /
Document extraction`; móvil usa solo el módulo activo mediante la variante contractual
    `mobileSegments`, sin duplicar landmarks ni hardcodear labels en la suite.
  - Tabs: control local dentro del canvas (`Datos extraídos / Validaciones / Uso y coste`) con
    `role="tablist"` compuesto desde `Button`. `Datos extraídos` conserva perfiles de salida para
    aseguradoras; `Validaciones` abre el `ModuleContextPanel` contextual.
  - Record: área principal en grid — preview/preparación del documento a la izquierda y panel de
    revisión con tabs a la derecha (`xl:grid-cols-2`, apilado en pantallas menores).
  - Inspector: `ModuleContextPanel` vía `moduleContextPanelRenderers`, oculto por defecto para
    priorizar el canvas. La pestaña `Validaciones` solicita abrirlo con estado del flujo,
    clasificación y uso/coste; el cierre devuelve el panel a estado oculto.
- **Surface sequence:** canvas → surface (`TechnicalSurface variant="surface"`) → elevated
  (placeholder del documento, `bg-surface-elevated`).
- **Background variant:** `plain` (canvas por defecto del preset `workspace`).
- **Density:** comfortable (preset `workspace` de `SUITE_SHELL_MODE_PRESETS`).
- **Spacing/layout constraints:** sin overflow horizontal; el contenido scrollea dentro del canvas;
  el inspector es `inline` en desktop y la shell lo apila automáticamente en `max-lg`.
- **Allowed shared components:** `ModuleHeader`, `ModuleContextPanel`, `TechnicalSurface`,
  `TechnicalCard`, `Button`, `IconButton`, `Input`, `Textarea`, `Form`/`FormField`,
  `Badge`, `TechnicalStatusBadge`, `EmptyState`, `Icon`, `LpdText`, `Divider`.
- **Domain-specific components (suite-local, prototipo):**
  `DocumentIntelligenceWorkbench`, `DocumentIntakePane`, `ExtractionReviewForm`,
  `UsageCostPanel`, `WorkbenchInspector`, `workbench-context`.
- **Shared capability:** `@loopdev/document-viewer` owns native image/PDF rendering, explicit
  `contain`/`width`/`actual` fit modes, zoom, pan, rotation, reset, fallback and object URL cleanup.
- **Preview responsive:** `DocumentIntakePane` owns selector de cara/metadata and intake actions;
  `@loopdev/document-viewer` owns the responsive inspection toolbar and bounded viewport. On mobile
  the footer converts upload and extraction into full-width actions without page overflow.

## Flujo operativo conservado

La migración conserva el flujo operativo validado en VitaBlue:
`historial operativo → upload/preview → processing feedback → review`.
En LoopDev se adapta a `AppShell`, los contratos tenant-aware, el aislamiento por tenancy y los
componentes certificados de LoopDev. El workbench permanece como nombre interno de la composición
`RecordWorkspace`, no como una superficie pública ni una ruta.

`preparation → processing → review → (approve/reject)` y `error`
recuperable (reintentar / cambiar documento / extraer nuevo). El cleanup (revocar previews,
liberar temporales) es implícito al aprobar/rechazar/resetear, igual que en el POC.

- **Preparation:** dropzone real con allowlist MIME/tamaño, selector, drag/drop, portapapeles y
  fixture. Con el documento cargado: toggle anverso/reverso, rotar, zoom/reset, pan mouse/touch,
  crop de imagen, abrir en pestaña, "Iniciar extracción" y error recuperable.
- **Processing:** superficie de canvas completo con cabecera de proceso, estado `PROCESANDO`,
  indicador de actividad, progreso por etapas (preparar → clasificar → extraer → normalizar) y
  contexto de privacidad. Evita concentrar el feedback en una tarjeta pequeña y dejar un área
  blanca sin función.
- **Review:** formulario `Form`/`FormField` con perfil `Aseguradora 1` seleccionado por defecto,
  selector tipado para `Aseguradora 1`, `Aseguradora 2` e `ICAO / Internacional`, campos nullables,
  badge de confianza por campo, copia de campos/JSON y decisión básica approve/reject. El cambio de
  perfil reorganiza la vista sin duplicar el modelo canónico; los apellidos agrupados y separados
  se sincronizan. No muestra `ValidationSummaryList` ni validaciones de negocio dentro del grid.
- **Error:** `EmptyState status="error"` con acciones de recuperación.

## Behavior and states

- **Loading:** composición de proceso activa durante `processing`; ocupa la región disponible y
  mantiene una jerarquía estable mientras avanza la extracción.
- **Empty:** dropzone inicial y panel de revisión vacío con explicación.
- **Error:** estado `error` con mensaje tipado (`502` del fixture) y tres acciones de recuperación.
- **Forbidden:** pendiente — los permisos (`documents.*`) se definen en Fase 2/3; el prototipo no
  aplica gating.
- **Read-only:** no aplica en esta entrega (la revisión es siempre editable).
- **Offline/stale/conflict:** fuera de alcance del prototipo; documentar en Fase 3.
- **Primary/secondary actions:** aprobar (primary), rechazar (danger), extraer nuevo (ghost),
  reintentar (primary), cambiar documento (outline).
- **Keyboard/focus/Escape behavior:** tabs con `role="tablist"/"tab"` y `aria-selected`; controles
  del preview con `aria-pressed`; el crop tiene cancelar explícito; foco gestionado por los
  componentes DS. Auditoría de teclado completa pendiente.
- **Portal/overlay behavior:** sin portales propios; el context panel de plataforma sigue sus
  contratos existentes.

## Data and security

- **Permissions/capabilities:** pendiente de definición (`documents.read`, acción de extracción).
- **Active-route fallback:** módulos `overview` y `workbench` (identificador interno) en el
  `NavigationSchema` declarativo; sus superficies públicas son `/new` y `/:documentId`.
- **Organization isolation:** el shell muestra el `OrganizationSwitcher`; la Fase 2 añade el
  namespacing por tenant/actor en storage temporal y la validación server-side.
- **Pagination/filter/sort contract:** no aplica (un documento activo por sesión).
- **Formatting/localization:** fechas `DD/MM/YYYY` (normalización server-side en Fase 2); copy en
  español; números con `toLocaleString('es-ES')`.
- **Audit/telemetry events:** pendiente; el contrato de `usage` (tokens, coste estimado) ya se
  muestra en la tab "Uso y coste" y en el inspector.
- **Sensitive data/redaction:** sin persistencia de documentos fuente ni datos de identidad; el
  fixture no contiene datos reales.

## Responsive and accessibility

- **Desktop:** inspector `ModuleContextPanel` inline (preset `workspace`), record en dos columnas
  (`xl:grid-cols-2`).
- **Tablet:** la shell mantiene el panel inline hasta `lg`; por debajo apila. La decisión aprobada
  (inspector como overlay en tablet) requiere extender el preset/presentación de
  `ModuleContextPanel` — gap G6 para revisar con `platform-shell` en Fase 3, sin mutar el shell
  desde la suite.
- **Mobile:** región única apilada (la shell apila el aside en `max-lg`; el grid del record colapsa
  a una columna).
- **Touch versus hover:** controles con estados `aria-pressed`; sin interacciones solo-hover.
- **Focus order and restoration:** pendiente de auditoría en Fase 3.
- **Contrast and reduced motion:** tokens semánticos; la transformación de rotación/zoom usa
  `transition-transform` — revisar `prefers-reduced-motion` en Fase 3.
- **Screen-reader semantics:** regiones con `aria-label`, estados de procesamiento/error,
  tablist/tabs/tabpanel, badges con texto no solo color.

## Gaps de componentes (reuse/create)

| Gap | Necesidad                                          | Decisión propuesta                                                                 | Fase     |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| G1  | Dropzone con allowlist MIME, tamaño y portapapeles | Implementado como feature suite-local con controles DS                             | 0-4      |
| G2  | Visor documental (fit/zoom/rotate/pan, PDF)        | Extraído a `@loopdev/document-viewer` con PDF.js legacy + iframe/download fallback | 0-4      |
| G3  | Stepper/progreso por pasos                         | Reusar `EmptyState ai` y mensajes de fixture                                       | 0-4      |
| G4  | Tabs compartidos                                   | Crear atom/composite `Tabs` en DS (hoy control local con `Button`)                 | 3        |
| G5  | Input de fecha `DD/MM/YYYY`                        | Extender `Input` con máscara o variante                                            | 3        |
| G6  | Overlay de inspector en tablet                     | Extender preset/presentación de `ModuleContextPanel` vía `platform-shell`          | 3        |
| G7  | Banner de alertas                                  | No requerido dentro del formulario; el diagnóstico global se compone en `Extraction context` | diferido |
| G8  | Perfiles de salida de aseguradora                  | Compuesto en `ExtractionReviewForm` con catálogo tipado y copia por perfil            | 5 |

Componentes reutilizados sin cambios: `ModuleHeader`, `ModuleContextPanel`, `SuiteRuntime`,
`Form`, `Input`, `Textarea`, `Button`, `IconButton`, `Badge`, `TechnicalStatusBadge`,
`EmptyState`, `TechnicalSurface`, `TechnicalCard`, `Icon`, `LpdText`, `Divider`.

Referencias inspeccionadas (duplicate review): `SalesCrmShell` + `config.ts` (patrón de suite),
`BotInspector`/`InspectorPanel` (inspector contextual), `AssetManagerView` (preview de assets),
`ContactFormDialog` (Form + react-hook-form), `CompositionGrid/fixtures.ts` (recipe
`RecordWorkspace`), `suiteRenderers` de showcase.

## Validation and exceptions

- **Contract tests:** `packages/contracts/src/documents/__tests__/documents.test.ts`.
- **Interaction tests:** tests focalizados de preview, contexto y rutas; `pnpm test:shell:changed`
  y `pnpm test:shell` quedan como validación de cierre.
- **Visual/browser checks:** typecheck previsto, smoke de rutas y lint quedan registrados con los
  comandos reales de cierre. **Revisión visual presencial pendiente — gate de esta especificación.**
- **Performance budget:** sin listas virtualizadas; composición ligera.
- **Exception IDs and approval evidence:** ninguna.
- **Deferred validation:** Playwright responsive/interacción (tras aprobación visual), auditoría
  de teclado y `prefers-reduced-motion`, provider/backend real, historial permanente y
  validaciones de negocio visibles.

## Perfilado de salida y decisión de composición

- **Catálogo:** `apps/loopdev-os/src/suites/document-intelligence/workbench/export-profiles.ts`.
- **Owner:** la feature de revisión; no se promueve a `@loopdev/ui` porque contiene semántica de
  destinos documentales y copy operativo de aseguradoras.
- **Perfil inicial:** `aseguradora-1`, con primer apellido y segundo apellido separados.
- **Perfil agrupado:** `aseguradora-2`, con apellidos en un único campo.
- **Perfil internacional:** `icao-internacional`, con etiquetas ICAO, país emisor y MRZ.
- **Sincronización:** editar cualquiera de las representaciones de apellidos actualiza la otra,
  incluyendo partículas compuestas como `DE LA` y `DEL`.
- **Separación de responsabilidades:** el formulario conserva edición y exportación; `Extraction
  context` queda reservado para estado, clasificación, validaciones globales y uso/coste.
- **Evidencia:** `export-profiles.test.ts`, `ExtractionReviewForm.test.tsx` y
  `ExtractionReviewForm.UI_UX_SPEC.md`. La revisión visual responsive sigue siendo un gate pendiente.
