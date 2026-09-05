---
title: Document Intelligence Workbench — composición RecordWorkspace (prototipo Fase 0)
status: pending-visual-review
owner: ai-platform
reviewed_at: pendiente
track: tracks/planned/ai-platform/2026-09-05-document-intelligence-poc-migration.md
issue: 176
---

# Document Intelligence — especificación de composición RecordWorkspace

Prototipo navegable guiado por fixtures, sin provider real ni lógica migrada de VitaBlue.
Su aprobación visual es el gate que desbloquea la Fase 3 (workbench definitivo).

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
  - Header: `ModuleHeader` vía `moduleHeaderRenderers` de `SuiteRuntime` — breadcrumbs
    (`Document Intelligence / Document extraction`) y badge de estado del flujo.
  - Tabs: control local dentro del canvas (`Datos extraídos / Validación / Uso y coste`) con
    `role="tablist"` compuesto desde `Button`. Gap G4: no existe `Tabs` compartido.
  - Record: área principal en grid — preview/preparación del documento a la izquierda y panel de
    revisión con tabs a la derecha (`xl:grid-cols-2`, apilado en pantallas menores).
  - Inspector: `ModuleContextPanel` vía `moduleContextPanelRenderers` — estado del flujo,
    clasificación, resumen de validación y uso/coste.
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
  `DocumentIntelligenceWorkbench`, `DocumentPreviewPane`, `ExtractionReviewForm`,
  `ValidationSummaryList`, `UsageCostPanel`, `WorkbenchInspector`, `workbench-context`.

## Flujo operativo conservado

La migración conserva el flujo operativo validado en VitaBlue:
`historial → upload/preview → processing feedback → review`.
En LoopDev se adapta a `AppShell`, los contratos tenant-aware, el aislamiento por tenancy y los
componentes certificados de LoopDev. El workbench permanece como nombre interno de la composición
`RecordWorkspace`, no como una superficie pública ni una ruta.

`preparation → processing → review | review-with-warnings → (approve/reject)` y `error`
recuperable (reintentar / cambiar documento / extraer nuevo). El cleanup (revocar previews,
liberar temporales) es implícito al aprobar/rechazar/resetear, igual que en el POC.

- **Preparation:** dropzone placeholder con allowlist de MIME (caption), "Usar documento de
  demostración" y "Pegar desde portapapeles" (ambos cargan el fixture en el prototipo). Con el
  documento cargado: toggle anverso/reverso, rotar, zoom (placeholder interactivo), "Iniciar
  extracción" y "Simular error del proveedor".
- **Processing:** `EmptyState variant="ai"` con `loadingMessages` (preparar → clasificar →
  extraer → normalizar).
- **Review:** formulario `Form`/`FormField` con todos los campos nullables, badge de confianza
  por campo y errores inline desde las validaciones deterministas.
- **Review-with-warnings:** banner de avisos (`TechnicalCard` con acento warning) + contador en la
  tab de validación.
- **Error:** `EmptyState status="error"` con acciones de recuperación.

## Behavior and states

- **Loading:** `EmptyState variant="ai" isLoading` durante `processing`.
- **Empty:** dropzone inicial y panel de revisión vacío con explicación.
- **Error:** estado `error` con mensaje tipado (`502` del fixture) y tres acciones de recuperación.
- **Forbidden:** pendiente — los permisos (`documents.*`) se definen en Fase 2/3; el prototipo no
  aplica gating.
- **Read-only:** no aplica en esta entrega (la revisión es siempre editable).
- **Offline/stale/conflict:** fuera de alcance del prototipo; documentar en Fase 3.
- **Primary/secondary actions:** aprobar (primary), rechazar (danger), extraer nuevo (ghost),
  reintentar (primary), cambiar documento (outline).
- **Keyboard/focus/Escape behavior:** tabs con `role="tablist"/"tab"` y `aria-selected`; controles
  del preview con `aria-pressed`; foco gestionado por los componentes DS. Auditoría de teclado
  completa pendiente para la Fase 3.
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
- **Screen-reader semantics:** regiones con `aria-label`, `role="status"` en el banner de avisos,
  tablist/tabs/tabpanel, badges con texto no solo color.

## Gaps de componentes (reuse/create)

| Gap | Necesidad | Decisión propuesta | Fase |
| --- | --- | --- | --- |
| G1 | Dropzone con allowlist MIME, tamaño y portapapeles | Crear composite DS (`composites/forms` o suite feature) tras diseño-audit | 3 |
| G2 | Visor documental (zoom/rotate/crop, PDF) | Crear componente suite-local; evaluar promoción con segundo consumidor | 3 |
| G3 | Stepper/progreso por pasos | Reusar `EmptyState ai` por ahora; evaluar `Stepper` compartido | 3 |
| G4 | Tabs compartidos | Crear atom/composite `Tabs` en DS (hoy control local con `Button`) | 3 |
| G5 | Input de fecha `DD/MM/YYYY` | Extender `Input` con máscara o variante | 3 |
| G6 | Overlay de inspector en tablet | Extender preset/presentación de `ModuleContextPanel` vía `platform-shell` | 3 |
| G7 | Banner de alertas | Componer `TechnicalCard`+`Icon` (hecho); evaluar `AlertBanner` si hay segundo consumidor | diferido |

Componentes reutilizados sin cambios: `ModuleHeader`, `ModuleContextPanel`, `SuiteRuntime`,
`Form`, `Input`, `Textarea`, `Button`, `IconButton`, `Badge`, `TechnicalStatusBadge`,
`EmptyState`, `TechnicalSurface`, `TechnicalCard`, `Icon`, `LpdText`, `Divider`.

Referencias inspeccionadas (duplicate review): `SalesCrmShell` + `config.ts` (patrón de suite),
`BotInspector`/`InspectorPanel` (inspector contextual), `AssetManagerView` (preview de assets),
`ContactFormDialog` (Form + react-hook-form), `CompositionGrid/fixtures.ts` (recipe
`RecordWorkspace`), `suiteRenderers` de showcase.

## Validation and exceptions

- **Contract tests:** pendientes (Fase 1 para contratos; Fase 3 para composición).
- **Interaction tests:** pendientes; `pnpm test:shell` antes del commit de Fase 3.
- **Visual/browser checks:** typecheck ✅, eslint ✅, smoke de rutas `/document-intelligence`,
  `/document-intelligence/new` y `/document-intelligence/:documentId` con `next dev` (HTTP 200,
  shell + chunks correctos; el
  contenido requiere sesión, igual que el resto de la app). **Revisión visual presencial
  pendiente — gate de esta especificación.**
- **Performance budget:** sin listas virtualizadas; composición ligera.
- **Exception IDs and approval evidence:** ninguna.
- **Deferred validation:** Playwright responsive/interacción (tras aprobación visual), auditoría
  de teclado y `prefers-reduced-motion`, tests de composición.
