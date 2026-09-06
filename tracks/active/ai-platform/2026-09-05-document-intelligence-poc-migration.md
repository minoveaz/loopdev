---
id: document-intelligence-poc-migration
title: Migración del POC operativo de Document Intelligence desde VitaBlue
status: active
created: 2026-09-05
updated: 2026-09-06
owner: ai-platform
lead: null
branch: feature/document-intelligence-backend
branches: []
phase: 5
pull_requests: [181]
issues: [176]
packages: [@loopdev/contracts, @loopdev/document-viewer, loopdev-os]
release: not-required
areas: [ai-platform, platform]
dependencies: [shell-standardization, platform-shell-mode-inventory]
blocked_by: []
supersedes: []
---

# Migración del POC operativo de Document Intelligence desde VitaBlue

## Outcome

Disponer en LoopDev de un workbench nativo de Document Intelligence que reproduce el flujo
operativo validado en VitaBlue —historial operativo local, subida temporal, preparación/preview,
feedback de procesamiento, resultados normalizados nullables, revisión/edición manual, decisión
básica, errores recuperables, visibilidad de uso/coste y cleanup— sobre la shell de plataforma,
los contratos de `@loopdev/contracts` y las convenciones de tenancy y accesibilidad de LoopDev.
El provider real, el backend y las validaciones de negocio visibles quedan fuera de este bloque.

## Contexto

El issue #176 define esta migración como la primera iniciativa de migración desde VitaBlue, por
delante de Marketing Studio. La implementación de referencia vive en el repositorio VitaBlue
(`features/document-intelligence`, `pages/backoffice/DocumentIntelligence*`,
`supabase/functions/extract-identity-document`) y es evidencia funcional, no autoridad técnica: no
se copian su shell de backoffice, sus rutas ni sus decisiones de composición.

El roadmap de producto (`docs/architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md` §7.2)
define Document Intelligence Core como capacidad cross-suite con owner `ai-platform` y separa
cuatro objetos con ciclos de vida distintos: documento original, extracción provisional, validación
automática y revisión humana. Este track se limita al flujo operativo actual del POC y no implementa
el ciclo de vida completo de Document Intelligence Core.

Estado del POC en VitaBlue (fuente de verdad funcional):

- Flujo: `preparation → processing → review | review-with-warnings`, con estado `error`
  recuperable (reintentar, cambiar documento, extraer nuevo) y cleanup implícito de archivos
  temporales en el servicio.
- Servicio: subida a bucket temporal de Supabase Storage con path `userId/<uuid>.<ext>`, invocación
  de la Edge Function `extract-identity-document` y borrado de temporales en `finally`.
- Provider: Gemini 2.5 Flash con `responseSchema` JSON estricto, credenciales solo server-side,
  auth por sesión, validación de path por usuario y telemetría de uso
  (`promptTokens`, `outputTokens`, `totalTokens`, `estimatedCostUsd`).
- Modelo: tipos `passport`, `spanish-dni`, `spanish-nie`, `latin-american-national-id`, `unknown`;
  campos de identidad todos nullables, con distinción `rawFields` (salida del provider) y `fields`
  (normalizados); bounding boxes `[ymin, xmin, ymax, xmax]` normalizadas a 0..1000.
- Fixtures que permiten recorrer el flujo completo sin provider.

## Alcance

### Incluido en el bloque Fases 0-4

- Track de migración con decisiones, contratos, fases, dependencias, riesgos y rollout/rollback
  (este documento, Fase 0).
- Extensión de los contratos tenant-aware en `packages/contracts/src/documents` para extracción de
  documentos de identidad (tipos de documento, campos nullables normalizados, request/response de
  extracción, validaciones y uso/coste), sin romper los esquemas existentes.
- Contratos tenant-aware y fixtures que cubren el flujo completo preparation → processing → review
  antes de conectar el provider.
- Historial operativo de sesión/navegador y lista de fixtures; no es historial permanente de
  extracciones.
- Workbench nativo en `apps/loopdev-os` como nueva suite `document-intelligence` con `SuiteRuntime`,
  zonas obligatorias de Platform Shell y recipe canónico, con composiciones desktop, tablet y
  mobile aprobadas visualmente.
- Intake real de imagen/PDF en cliente: allowlist MIME, límite de 10 MB, preview de imagen,
  PDF.js canvas con fallback iframe, zoom/reset/rotación/pan, crop de imagen, pestaña nueva,
  dual-side y cleanup de object URLs.
- Feedback de preparación/procesamiento guiado por fixtures y revisión editable de campos
  nullables con decisiones approve/reject básicas.
- Tipos de documento validados hoy: pasaporte, DNI español, NIE español e ID nacional genérico
  donde aplique.

### Excluido

- Esquemas de documento configurables.
- Motor de reglas deterministas o semánticas configurable y validaciones de negocio visibles en
  la revisión; el contrato conserva el espacio para una fase posterior.
- Autenticidad, fraude, liveness o verificación legal.
- Backend real, Edge Function, Gemini, storage tenant-scoped y credenciales de provider en las
  Fases 0-4; quedan planificados y acotados en la Fase 5, no implementados en este bloque.
- Procesamiento por lotes e historial permanente de extracciones.
- Perfiles de exportación persistentes o configurables; el formulario incorpora únicamente el
  catálogo operativo fijo requerido por el POC (`Aseguradora 1`, `Aseguradora 2` e
  `ICAO / Internacional`).
- Integración con Marketing Studio más allá de definir la frontera de consumo futura.
- Ciclo de vida completo de Document Intelligence Core (retención, auditoría, versionado de
  documento) más allá del intake temporal seguro necesario para el flujo operativo.
- Copia de la shell de backoffice de VitaBlue, sus rutas o sus componentes.

## Decisiones aprobadas

| Fecha      | Decisión                                                                                                                                                                                                                                                                                 | Motivo                                                                                                                                                                                               | Impacto                                                                                                                                                                                                                  | Aprobado por                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| 2026-09-05 | Migrar el flujo operativo actual del POC, no el producto completo de VitaBlue.                                                                                                                                                                                                           | El issue #176 limita la primera entrega al flujo validado.                                                                                                                                           | Hub, perfiles, reglas configurables e historiales quedan fuera y se documentan como frontera futura.                                                                                                                     | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Migrar las reglas deterministas actuales (checksums DNI/NIE, caducidad, coherencia MRZ, mayoría de edad) como validación fija no configurable.                                                                                                                                           | El issue incluye validación local pero excluye el motor configurable.                                                                                                                                | Las reglas viajan como código fijo con tests; el motor configurable queda diferido.                                                                                                                                      | Usuario (selección en planificación)                           |
| 2026-09-05 | Excluir historial de extracciones y perfiles de exportación de la primera entrega.                                                                                                                                                                                                       | El issue excluye historial permanente y no menciona exportación.                                                                                                                                     | Se documentan como frontera de consumidor futuro; no hay persistencia de identidad por defecto.                                                                                                                          | Usuario (selección en planificación)                           |
| 2026-09-05 | Registrar Document Intelligence como nueva suite en `apps/loopdev-os`, owner `ai-platform`, con superficies `DocumentIntelligenceHome` (`/document-intelligence`), `NewDocumentExtraction` (`/document-intelligence/new`) y `DocumentExtraction` (`/document-intelligence/:documentId`). | No existe aún una suite AI Platform y el issue exige el flujo operativo nativo sobre la shell de plataforma.                                                                                         | `RecordWorkspace`/`workbench` queda como concepto interno de composición; no se expone `/workbench`. Se usa `SuiteRuntime` y no se copia el backoffice de VitaBlue.                                                      | Usuario (actualización explícita)                              |
| 2026-09-05 | Mantener Gemini server-side tras una Edge Function de Supabase con credenciales solo en servidor.                                                                                                                                                                                        | Requisito explícito del issue y práctica validada en el POC.                                                                                                                                         | Ninguna credencial de provider ni documento fuente llega al cliente; el contrato de la función es la única frontera.                                                                                                     | Usuario (solicitud explícita en issue)                         |
| 2026-09-05 | Recipe canónico del workbench: `RecordWorkspace` (canvas mode `workspace`). El área principal combina documento-preview y revisión; el inspector contextual muestra estado, validación y uso/coste. Responsive: inspector como overlay en tablet y región única en móvil.                | El flujo operativo es un registro/proceso activo con entidad principal (documento en revisión) y contexto lateral; encaja con el recipe `RecordWorkspace` del inventario de modos de Platform Shell. | Gate de la implementación visual: la Fase 0 solo se cierra con esta composición; la Fase 3 implementa exactamente esta estructura y sus transformaciones responsive.                                                     | Usuario (aprobación explícita vía sesión Migración Backoffice) |
| 2026-09-06 | Launchpad reutiliza `SuiteSidebar` en modo `rail` para mostrar las capabilities declaradas por `PlatformToolEntry`; no existe un rail transversal paralelo.                                                                                                                              | La navegación y su control de colapso permanecen en el renderer canónico de Platform Shell. El acceso se filtra por `state` y `requiredPermission` antes de construir el schema de Launchpad.        | Se retira el renderer independiente y el slot específico de `AppShell`; `SuiteSidebar` queda como única superficie de navegación. La ruta inicial es `/document-intelligence`; Gemini/backend siguen fuera de esta fase. | Usuario (solicitud explícita)                                  |
| 2026-09-06 | Launchpad usa `AppShell` directamente como owner de layout, con `PlatformHeader` en `headerSlot` y `SuiteSidebar` en `navSlot`; no se formaliza como suite mediante `SuiteRuntime`.                                                                                                      | Launchpad es una landing de plataforma sin módulo activo ni canvas de suite, pero necesita los contratos globales de header, navegación, drawer, foco y scroll.                                      | Se elimina `LaunchpadFrame`, sus widths/heights/footer/drawer/responsive locales y cualquier segundo owner geométrico. `PlatformToolEntry` queda limitado al contrato de capabilities.                                   | Usuario (implementación aprobada de la auditoría comparativa)  |
| 2026-09-05 | Este bloque completa las Fases 0-4 con provider fixture e intake cliente; backend/Gemini real queda fuera.                                                                                                                                                                               | La solicitud exige preview y flujo verificable sin copiar la implementación server-side ni conectar provider.                                                                                        | Fase 2 se satisface como frontera de contrato/feedback de fixture; backend, storage tenant-scoped y validaciones de negocio visibles quedan diferidos.                                                                   | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Se abre la Fase 5 para trasladar el backend real de VitaBlue a LoopDev: Edge Function, Storage temporal/RLS, `GEMINI_API_KEY`, conexión del intake, tenant/auth, cleanup, errores y pruebas.                                                                                             | El usuario autoriza continuar sobre la rama existente, pero solicita primero registrar el plan sin editar código ni habilitar Gemini.                                                                | Fase 5 queda `planned`; Fases 0-4 conservan fixture como fallback y no cambia el comportamiento actual.                                                                                                                  | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Se incluye historial operativo local y persistencia de metadatos, pero no historial permanente.                                                                                                                                                                                          | La home necesita recuperar fixtures y sesiones recientes sin convertir el POC en un sistema de retención.                                                                                            | `localStorage` conserva metadatos no sensibles; archivos y datos de identidad no se persisten.                                                                                                                           | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Se retira `ValidationSummaryList` y cualquier validación de negocio visible del workbench.                                                                                                                                                                                               | La revisión solicitada es editable/nullables con decisión básica; las validaciones visibles se difieren.                                                                                             | El resultado puede transportar validaciones para el futuro, pero no se renderizan ni bloquean aprobar/rechazar.                                                                                                          | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Integrar en `ExtractionReviewForm` los tres formatos operativos de VitaBlue, con `Aseguradora 1` seleccionado por defecto.                                                                                                                                                               | Los operadores necesitan copiar nombres, apellidos y datos documentales con la anatomía exigida por cada portal, sin duplicar el modelo canónico.                                                    | El selector y el formateo son suite-locales; los apellidos agrupados/separados se sincronizan; la configuración persistente queda fuera.                                                                                 | Usuario (aprobación explícita)                                 |
| 2026-09-05 | Mantener el diagnóstico global en `Extraction context` y fuera del grid de campos.                                                                                                                                                                                                       | Evita contaminar la superficie de edición/copia y conserva la separación entre corrección local y validación de negocio.                                                                             | La ampliación de severidad/categoría/regla y su renderizado se planifica como slice posterior; no bloquea aprobar/rechazar en este slice.                                                                                | Usuario (decisión explícita)                                   |
| 2026-09-06 | Mantener `Extraction context` oculto por defecto y abrirlo desde la pestaña `Validaciones` del Workbench, nunca desde `SuiteSidebar`.                                                                                                                                                    | El inspector es contenido del módulo y no debe introducir controles de dominio en la navegación de la suite.                                                                                         | `ModuleContextPanel` conserva estado, clasificación y uso/coste; la pestaña controla su apertura y el panel mantiene cierre explícito.                                                                                   | Usuario (decisión explícita)                                   |
| 2026-09-06 | Crear `AIFeedbackSurface` como composite compartido experimental para feedback/procesamiento de IA, conservando la identidad morada/neural y separándolo de `EmptyState`.                                                                                                                | `EmptyState` representa ausencia de resultados y no debe asumir procesos de canvas completo, etapas o progreso.                                                                                      | Document Intelligence es el primer consumidor; copy, etapas, progreso y acciones permanecen en el consumidor. La certificación visual, el segundo consumidor y la promoción quedan pendientes.                           | Usuario (aprobación explícita)                                 |
| 2026-09-06 | Ajustar `AIFeedbackSurface` a una única superficie de proceso con avance temporal por etapas y terminal de escritura para la etapa activa; el consumidor declara duraciones y puede usar modo controlado mediante `progress`.                                                            | La primera composición dejaba un plano visual vacío y mostraba `66%` estático, sin comunicar el avance real del procesamiento.                                                                       | `autoAdvance`, `stepDurationMs`, `tickMs`, `onProgressChange` y `onStepChange` forman parte del contrato; Document Intelligence usa cuatro etapas que recorren 0–100% en 7,4 s para el fixture.                          | Usuario (feedback explícito)                                   |
| 2026-09-06 | Mantener las fases dentro del bloque central, inmediatamente debajo de la barra de progreso.                                                                                                                                                                                             | Refuerza que las fases son parte del proceso activo y evita separar la timeline del terminal, el porcentaje y la barra que explican su avance.                                                       | La timeline conserva sus estados, semántica accesible y transformación responsive, pero cambia su posición dentro de `ai-feedback-surface-plane`.                                                                        | Usuario (solicitud explícita)                                  |
| 2026-09-06 | Coordinar la salida del feedback mediante final visual al 100%, transición con `LogoSpinner` y entrada posterior a revisión.                                                                                                                                                             | El cambio directo de `processing` a `review` podía ocultar el 100%, no dejar visibles todas las fases completadas y producir un salto brusco de layout.                                              | `AIFeedbackSurface` mantiene el estado completado durante 600 ms y emite `onComplete`; el Workbench espera al provider y muestra `loading-results` centrado durante 3000 ms antes de `review`.                           | Usuario (aprobación explícita)                                 |

## Arquitectura y contratos

### Fronteras

- **UI (suite `document-intelligence` en `apps/loopdev-os`)**: estados `preparation`, `processing`,
  `review` y `error` con acciones de recuperación (reintentar, cambiar documento, extraer nuevo).
  Composición sobre `SuiteRuntime` con las zonas obligatorias
  `PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel` y `SuiteCanvas`. El recipe canónico
  aprobado es `RecordWorkspace` (canvas mode `workspace`): el área principal combina
  documento-preview y revisión; el inspector contextual (zona `PlatformContextPanel`) muestra
  estado, clasificación y uso/coste; en tablet el inspector pasa a overlay y en móvil la composición
  colapsa a región única.
- **Frontera Fase 5**: la subida a Storage privado, invocación de la Edge Function y cleanup
  server-side se implementarán detrás del contrato existente; este bloque solo revoca object URLs
  del navegador.
- **Provider diferido a Fase 5**: Edge Function `extract-identity-document`, credenciales
  (`GEMINI_API_KEY`), auth por sesión, validación de referencias y normalización server-side no se
  conectan en esta actualización.

### Contratos (`packages/contracts/src/documents`)

Se extienden los esquemas existentes (`DocumentRecord`, `DocumentExtraction`,
`DocumentReviewDecision`) sin romperlos:

- `IdentityDocumentType`: `passport | spanish-dni | spanish-nie | national-id | unknown`.
- `IdentityDocumentFields`: todos los campos nullables (nombre, apellidos, número de documento,
  fechas de nacimiento/emisión/caducidad en `DD/MM/YYYY` normalizado, nacionalidad, sexo, país
  emisor, MRZ, campos opcionales por tipo), con distinción `rawFields`/`fields`.
- `DocumentExtractionRequest` / `DocumentExtractionResult`: classification con confianza, fields,
  bounding boxes, validaciones por campo, provider (`fixture | gemini`) y usage
  (`promptTokens`, `outputTokens`, `totalTokens`, `estimatedCostUsd`).
- Errores tipados: 400 payload inválido, 401 no autorizado, 404 documento no encontrado,
  413 tamaño excedido, 415 MIME no soportado, 502 fallo de provider, 503 provider no configurado.

### Intake seguro mínimo (alineado con roadmap §7.2)

Allowlist de MIME/extensión (`image/jpeg`, `image/png`, `application/pdf`), límites de tamaño,
objeto privado temporal, referencia firmada y validada por actor, propósito declarado y cleanup
inmediato tras la extracción. Sin persistencia de documentos fuente ni de datos de identidad por
defecto. Quarantine, malware scanning, hash, retención y auditoría completas pertenecen al ciclo de
vida de Document Intelligence Core y quedan fuera de este track.

### Inventario DS y decisiones de reutilización (Fase 0, 2026-09-05)

Referencias inspeccionadas (duplicate review): `SalesCrmShell` + `config.ts` (patrón de suite y
wiring de `SuiteRuntime`), `BotInspector`/`InspectorPanel` (inspector contextual),
`AssetManagerView` (preview de assets), `ContactFormDialog` (Form + react-hook-form) y
`CompositionGrid/fixtures.ts` (recipe `RecordWorkspace`).

Reutilizados sin cambios (todos registrados y con certificación vigente): `SuiteRuntime`,
`ModuleHeader`, `ModuleContextPanel`, `Form`/`FormField`, `Input`, `Textarea`, `Button`,
`IconButton`, `Badge`, `TechnicalStatusBadge`, `EmptyState`, `TechnicalSurface`, `TechnicalCard`,
`Icon`, `LpdText`, `Divider`.

Creados como suite-local `experimental` (registrados en
`docs/registries/frontend-components.json` con evidence gaps): `DocumentIntelligenceWorkbench`,
`DocumentIntakePane`, `ExtractionReviewForm`, `UsageCostPanel`, `WorkbenchInspector`. El antiguo
`DocumentPreviewPane` fue el renderer local histórico de este track y se eliminó durante la
extracción.

La implementación vigente añade `@loopdev/document-viewer` como composite compartido
`experimental`: conserva el intake en `DocumentIntakePane` y centraliza imagen/PDF, fit explícito,
zoom, pan, rotación, reset, crop manual opt-in, fallback y cleanup de object URLs. La evidencia
vigente es `packages/document-viewer/src/**`, `DocumentIntakePane.tsx`,
`e2e/document-viewer.certification.spec.mjs` y el registro `document-viewer-v1`.

Gaps resueltos en este bloque: dropzone con allowlist MIME y tamaño (G1), visor documental
zoom/rotate/crop/PDF con fallback (G2), feedback de procesamiento fixture (G3). Gaps diferidos:
`Tabs` compartido (G4), input de fecha `DD/MM/YYYY` (G5), presentación overlay del
`ModuleContextPanel` en tablet (G6, requiere revisión con `platform-shell`; prohibido mutar el
shell desde la suite) y validaciones de negocio visibles. La home de historial reutiliza
`ResponsiveTable` con columnas explícitas de documento, tipo/clasificación, estado, actualización y
acción de apertura; en móvil usa filas semánticas apiladas sin depender de overflow horizontal.

## Branch strategy

`branch: feature/document-intelligence-viewer` para las Fases 0-5. No se crean ramas adicionales:
el usuario solicitó preservar esta rama de migración existente.

## Fases

### Fase 0: Definición y readiness

**Objetivo:** Dejar aprobado el track, la especificación de suite/composición y los criterios de
aceptación antes de escribir código de producto.

**Definition of Ready**

- [x] Track validado con `node scripts/tracks/validate-tracks.mjs` y dashboard regenerado.
- [x] Modo/recipe canónico y zonas opcionales de la suite `document-intelligence` seleccionados y
      documentados: `RecordWorkspace` (canvas mode `workspace`), área principal
      documento-preview + revisión, inspector contextual con estado/validación/uso, overlay en
      tablet y región única en móvil.
- [x] Inventario de componentes DS existentes reutilizables para upload, preview y formularios de
      revisión (ver "Inventario DS y decisiones de reutilización" más abajo).

**Entregables**

- [x] Este track en `tracks/active/ai-platform/`.
- [x] Especificación de composición de la suite (desktop/tablet/mobile):
      `docs/06-product/document-intelligence/workbench-composition.md`.
- [x] Prototipo navegable guiado por fixtures en `apps/loopdev-os` (rutas
      `/document-intelligence`, `/document-intelligence/new` y
      `/document-intelligence/:documentId`), sin provider real ni lógica migrada de VitaBlue.
- [x] Contrato `PlatformToolEntry`, `SuiteSidebar` colapsado por defecto y registro inicial de
      Document Intelligence en Launchpad, sin duplicar shells ni alterar la suite.
- [ ] Aprobación visual explícita del prototipo por el usuario (gate de certificación; no se
      declara completada por esta implementación automatizada).

**Validación**

- [x] `node scripts/tracks/validate-tracks.mjs` sin errores.
- [x] Typecheck de `loopdev-os` y lint focalizado de la suite (sin errores; quedan warnings de
      orden Tailwind en el preview).
- [x] Tests focalizados de las tres rutas y del flujo cliente; smoke manual con `next dev` queda
      pendiente de evidencia reproducible.
- [x] `pnpm test:shell:changed` y `pnpm test:shell` (contratos de shell verdes).
- [x] `pnpm registries:check` tras registrar los componentes del prototipo como `experimental`.
- [x] Typecheck/build focalizados de `@loopdev/contracts` y `@loopdev/ui`, incluyendo
      `SuiteSidebar` y su layout footer/lista.
- [x] Tests focalizados de `SuiteSidebar` y filtrado de permisos/estado.
- [ ] Revisión visual del prototipo (último gate de la fase, pendiente del usuario).

**Evidencia histórica:** la especificación inicial del preview y las rutas existentes.
**Evidencia vigente:** `packages/document-viewer/src/UI_UX_SPEC.md`, el paquete compartido, la
composición y rutas existentes; revisión visual pendiente.

**Estado:** completada con revisión visual pendiente

### Fase 1: Contratos y fixtures

**Objetivo:** Extender `packages/contracts/src/documents` con los contratos de extracción de
identidad y disponer de fixtures que cubran el flujo completo sin provider.

**Definition of Ready**

- [ ] Fase 0 cerrada con composición aprobada.

**Entregables**

- [x] Esquemas `IdentityDocumentType`, `IdentityDocumentFields`, `DocumentExtractionRequest`,
      `DocumentExtractionResult` y errores tipados, con tests de contrato.
- [x] Fixtures de sesión que cubren preparación, procesamiento, revisión y error recuperable.

**Validación**

- [x] Tests de contratos en `packages/contracts` verdes.

**Evidencia:** `packages/contracts/src/documents/document-intelligence.ts`,
`packages/contracts/src/documents/__tests__/documents.test.ts`,
`apps/loopdev-os/src/suites/document-intelligence/workbench/fixtures.ts`.

**Estado:** completada

### Fase 2: Intake cliente y feedback de extracción

**Objetivo:** Delimitar el contrato de extracción y entregar intake cliente, feedback de
procesamiento, fallback documental y cleanup de previews antes de conectar el provider.

**Definition of Ready**

- [ ] Contratos de Fase 1 mergeados.

**Entregables**

- [x] Intake cliente con allowlist MIME, límite de tamaño y validación recuperable antes de
      cualquier provider.
- [x] Cleanup de object URLs al cambiar de archivo o desmontar el preview; PDF.js tiene fallback
      iframe.
- [x] Feedback de processing guiado por fixture y error recuperable con reintento.
- [ ] Edge Function, upload server-side, Gemini y tests de storage/tenant: diferidos fuera de este
      bloque.

**Validación**

- [x] Suite de tests de intake, contratos y flujo fixture.
- [ ] Revisión `security-review` del backend real: diferida hasta conectar storage/provider.

**Evidencia vigente:** `apps/loopdev-os/src/suites/document-intelligence/workbench/file-validation.ts`,
`DocumentIntakePane.tsx`, `packages/document-viewer/src/engines.tsx`,
`apps/loopdev-os/src/suites/document-intelligence/workbench/workbench-context.tsx`.

**Estado:** completada con backend diferido

### Fase 3: Workbench nativo

**Objetivo:** Suite `document-intelligence` en `apps/loopdev-os` con el flujo completo sobre
fixtures y revisión básica, sin provider real.

**Definition of Ready**

- [ ] Fases 1 y 2 cerradas.

**Entregables**

- [x] Suite registrada con `SuiteRuntime`, zonas obligatorias y recipe canónico documentado.
- [x] Estados `preparation`, `processing`, `review` y `error` con acciones de recuperación,
      revisión/edición manual, decisión básica y visibilidad de uso/coste.
- [ ] Composiciones desktop, tablet y mobile aprobadas visualmente; evidencia visual pendiente.

**Validación**

- [x] `pnpm test:shell:changed` durante desarrollo y `pnpm test:shell` antes del commit.
- [x] Flujo completo preparation → processing → review guiado por fixtures.

**Evidencia vigente:** `DocumentIntakePane.test.tsx`, `workbench-context.test.tsx`,
`routes.test.ts`, `packages/document-viewer/src/DocumentViewer.test.tsx`,
`packages/document-viewer/src/UI_UX_SPEC.md`.

**Estado:** completada con revisión visual pendiente

### Fase 4: Validación integral y rollout

**Objetivo:** Cerrar el bloque con validación de código, contratos, registry y rutas; dejar
documentado el rollout fixture y el rollback sin datos permanentes.

**Entregables**

- [ ] `pnpm validate:ci` verde (falla por el error de lint corregido durante el cierre; debe
      repetirse antes de commit).
- [x] El modo fixture es el fallback operativo y la activación queda limitada a la suite/rutas
      existentes; el flag del provider real se difiere.
- [x] Rollback documentado: retirar la entrada de navegación y las rutas; los metadatos locales
      pueden limpiarse sin migración de datos permanentes.

**Validación**

- [ ] `pnpm validate:ci` (repetir tras la corrección del efecto de hidratación).
- [x] Evidencia de rollout/rollback registrada en este track.

**Evidencia:** comandos de validación del cierre y este handoff.

**Estado:** completada con validación CI pendiente de repetición

### Fase 5: Backend real y extracción tenant-aware

**Estado:** en curso; inventario completado y primera migración de Storage creada sin commit.

**Evidencia inicial (2026-09-05):** LoopDev ya dispone de `organizations`,
`organization_memberships` y `is_organization_member()`. Se añadieron sin commit la migración
`20260905100000_document_intelligence_temp_storage.sql`, la Edge Function
`supabase/functions/extract-identity-document/index.ts` y el servicio server-side
`apps/loopdev-os/src/services/document-intelligence/extraction.ts`, la route handler
`apps/loopdev-os/src/app/api/document-intelligence/extract/route.ts` y pruebas focalizadas de
path/service/auth/tenant/multipart/cleanup. La validación de gobernanza Supabase,
`supabase db lint --local`, TypeScript, 7 archivos/14 tests focalizados y `git diff --check`
pasan.

**Resumen de cierre provisional de Fase 5 (2026-09-05):** la frontera backend local está definida
y ejecutable con Storage privado, RLS por organización/actor, Edge Function, servicio server-side,
route handler multipart y cleanup defensivo. La fase no se considera cerrada hasta completar los
gates remotos indicados abajo; no se añade alcance adicional en esta actualización.

**Gaps de cierre pendientes (explícitos):**

- [ ] Validar en el proyecto Supabase remoto de LoopDev el bucket/policies y
      `GEMINI_API_KEY` por entorno; no se ha usado ninguna clave real ni se ha probado Gemini remoto.
- [ ] Ejecutar Playwright autenticado con una organización de test en desktop, tablet y móvil,
      verificando upload front/back, estados `processing` → `review/error`, ausencia de secretos y
      cleanup observable.
- [ ] Ejecutar una prueba RLS negativa con usuarios de dos organizaciones que demuestre que no
      pueden leer, subir ni eliminar objetos temporales cruzados.
- [ ] Con credencial PostgreSQL válida del mismo proyecto remoto, reparar el historial y aplicar
      las migraciones pendientes hasta `20260905100000_document_intelligence_temp_storage.sql`.
      La auditoría read-only confirmó las ocho tablas de `20260829000000`, sus columnas base,
      constraints estructurales, índices, RLS y grants; el remoto también contiene endurecimientos
      posteriores (`*_id_organization_key`, FKs compuestos y policies `*_communications_*`), por
      lo que no se creó una migración correctiva que pudiera reintroducir policies menos restrictivas.
      `20260829000000` y las migraciones `20260830`/`20260831` quedaron reconciliadas; el
      historial remoto las muestra aplicadas. `db push` avanzó hasta `20260901000000` y se
      detuvo porque `crm_contacts_id_organization_key` ya existe (`SQLSTATE 42P07`). La
      migración `20260901000000` y las posteriores, incluida `20260905100000`, siguen pendientes.

**Diagnóstico de drift (2026-09-05):** `20260829000000_communications_core_foundation.sql`
combina `create table if not exists` con `alter table ... add constraint` no idempotentes. El
remoto ya contiene `communication_accounts_brand_fkey`, pero la lista de migraciones no marca
`20260829000000` como aplicada. La auditoría remota exhaustiva encontró la estructura fundacional
presente y compatible, con políticas posteriores más restrictivas ya materializadas. La reparación
queda bloqueada exclusivamente por la credencial PostgreSQL rechazada; no se modifica la migración
histórica ni se crea una migración correctiva innecesaria.

**Resultado de la secuencia autorizada (2026-09-05):** tras cargar una credencial válida en la
terminal, `migration repair` para `20260829000000` funcionó y `migration list` confirmó también
`20260830000000` y `20260831000000` aplicadas. `db push` pidió confirmación una vez, comenzó
`20260901000000_communications_tenant_integrity.sql` y se detuvo de forma no destructiva en
`crm_contacts_id_organization_key` ya existente (`SQLSTATE 42P07`). No se alcanzó Storage/RLS.
La Edge Function `extract-identity-document` ya quedó desplegada y verificada como versión 12
en una ejecución anterior; esto no implica que el bucket ni `20260905100000` estén aplicados.
El wrapper terminó con `zsh: read-only variable: status` al intentar guardar el código de salida,
sin efecto sobre Supabase.

**Auditoría de `20260901000000` (2026-09-05):** consulta remota read-only completada. Se
esperaban 15 constraints de integridad de organización y se encontraron los 15, sin faltantes ni
definiciones divergentes: cinco `UNIQUE (id, organization_id)` y diez FKs compuestos con las
tablas/columnas esperadas. La migración tampoco figura en `supabase_migrations.schema_migrations`,
por lo que el fallo de `db push` es únicamente de idempotencia/historial; no hay una diferencia
estructural que requiera migración correctiva. El siguiente paso seguro es marcar
`20260901000000` como aplicada y volver a ejecutar el push serializado; no se ha ejecutado ese
repair ni ningún cambio remoto en esta auditoría.

**Reconciliación y despliegue remoto (2026-09-05):** tras la auditoría, `20260901000000` y
`20260902000000` se marcaron como aplicadas porque sus objetos ya estaban presentes y coincidían
con las migraciones locales. `supabase db push --linked --yes` aplicó correctamente
`20260903000000`, `20260904000000`, `20260905000000`,
`20260905100000_document_intelligence_temp_storage.sql` y `20260906000000`; la lista remota
ahora coincide con todas las migraciones locales. La Edge Function se desplegó en el proyecto
`sukjcsylkljiyvfklxvj` y quedó `ACTIVE` en versión 12. La variable de contraseña fue eliminada
de la terminal al finalizar.

**Ajuste de navegación y revisión (2026-09-05):** el workbench conserva el identificador
`activeDocumentId` generado al cargar/subir el documento y ahora cambia de
`/document-intelligence/new` a `/document-intelligence/{documentId}` al entrar en revisión. En
`review`, el preview queda solo lectura y no muestra acciones de carga ni de inicio de extracción;
esas acciones permanecen exclusivas de `preparation`. El build de LoopDev OS y las pruebas
focalizadas de rutas, página e intake pasan.

**Objetivo:** trasladar el flujo server-side operativo de VitaBlue a LoopDev sin copiar su
backoffice ni relajar el aislamiento por organización: Edge Function de extracción, Storage
temporal privado, autenticación de sesión, `GEMINI_API_KEY` server-side, conexión explícita desde
`DocumentIntakePane`, cleanup determinista y errores tipados compatibles con
`@loopdev/contracts`.

**Definition of Ready**

- [ ] Fases 0-4 revisadas y sus gaps de certificación visual/CI aceptados o cerrados.
- [ ] Contrato request/response de `@loopdev/contracts` confirmado como frontera única entre intake y
      provider; ningún tipo de VitaBlue se importa directamente.
- [ ] Decisión de despliegue Supabase para LoopDev confirmada: proyecto, entorno, bucket,
      migraciones/RLS y nombres de secretos.
- [ ] `security-review` aprobado para auth, tenant isolation, Storage/RLS, PII, logs, límites y
      coste antes de habilitar el provider real.

**Referencia funcional a trasladar**

- VitaBlue: `supabase/functions/extract-identity-document/index.ts`.
- Flujo observado: `Authorization` → `auth.getUser()` → validación de payload/MIME/tamaño/path →
  descarga desde bucket privado → envío inline a Gemini 2.5 Flash con `responseSchema` →
  normalización de campos/fechas/bounding boxes/usage → respuesta tipada → `finally` con borrado
  de una o dos referencias temporales.
- La implementación LoopDev debe conservar el comportamiento funcional necesario, pero adaptar
  nombres, organización/tenant, contratos, observabilidad y políticas de seguridad de LoopDev.

**Entregables**

- [ ] Edge Function `extract-identity-document` reubicada en la superficie Supabase de LoopDev,
      con CORS allowlist de LoopDev, `OPTIONS`, método `POST` y respuestas JSON sin filtrar secretos
      ni PII sensible en logs.
- [ ] Storage temporal privado para `image/jpeg`, `image/png` y `application/pdf`, límite de
      10 MB, path no adivinable y ligado a `organization_id` + `user_id`/actor; políticas RLS y
      Storage impiden lectura/escritura cruzada entre organizaciones.
- [ ] Secreto `GEMINI_API_KEY` configurado únicamente en el entorno server-side de la función;
      ninguna clave de Gemini llega al navegador, bundle Next, respuesta o telemetría.
- [ ] Contrato de invocación desde `DocumentIntakePane`: subida temporal de front/back, referencias
      firmadas o server-owned, llamada autenticada a la función, transición `processing` →
      `review`/`error` y eliminación de referencias en éxito, error y cancelación.
- [ ] Errores 400/401/404/413/415/502/503 alineados con los contratos existentes, mensajes
      accionables para el usuario y detalles técnicos solo en logs server-side controlados.
- [ ] Cleanup garantizado con `finally`, incluyendo fallo de Gemini, JSON inválido, timeout,
      cancelación y documentos de una o dos caras; no se persisten originales ni resultados fuera
      de la política aprobada.
- [ ] Uso/coste (`promptTokens`, `outputTokens`, `totalTokens`, `estimatedCostUsd`) validado,
      acotado y visible solo a través del contrato de uso del workbench.

**Pruebas y criterios de aceptación**

- [ ] Tests unitarios de validación de payload, MIME, límite, path traversal, pertenencia a
      organización, normalización nullable/fechas/bounding boxes y clasificación desconocida.
- [ ] Tests de Edge Function con sesión válida, sesión ausente/inválida, secreto ausente, storage
      faltante, provider 4xx/5xx/timeout, JSON inválido, front-only y front/back.
- [ ] Tests de Storage/RLS que demuestren aislamiento positivo y negativo entre dos organizaciones,
      permisos de actor y eliminación posterior al procesamiento.
- [ ] Tests de integración del `DocumentIntakePane` contra el adapter real/mock server-side:
      upload → extracción → revisión; retry; cambio de documento; error recuperable; cleanup.
- [ ] Playwright con auth/organización real de test para desktop, tablet y móvil, sin claves reales:
      no exposición de secretos, estados estables, errores visibles, no overflow y no archivos
      temporales remanentes.
- [ ] Validar security, data/experience, contratos, registry y CI antes del rollout.

**Rollout / rollback**

- Rollout por entorno: función y bucket primero en desarrollo, luego staging, después producción;
  provider real detrás de una capability/feature flag tenant-aware con fixture como fallback.
- Observabilidad mínima: conteo de invocaciones, latencia, códigos de error, tokens/coste agregado y
  cleanup fallido; nunca registrar documento, base64, prompt completo ni respuesta PII.
- Rollback: desactivar la capability del provider, volver al flujo fixture sin borrar contratos ni
  rutas; mantener cleanup defensivo de objetos ya creados y retirar la función/bucket solo después
  de confirmar que no quedan referencias temporales.

**Dependencias y riesgos específicos**

- Supabase project/configuración LoopDev, migración de bucket/policies, secretos por entorno y
  cliente autenticado disponible para `apps/loopdev-os`.
- Contratos de `@loopdev/contracts` y límites de payload estables antes de conectar el intake.
- Riesgos: fuga de PII por logs o Storage, bypass de RLS/path, coste descontrolado de Gemini,
  limpieza incompleta, divergencia de normalización y degradación silenciosa al fallback fixture.

**Estado de fase:** `in_progress`; el bucket, las políticas RLS, la Edge Function y la conexión
server-side están implementados y desplegados en el proyecto remoto. La fase continúa abierta para
completar la validación negativa multi-organización, la prueba autenticada end-to-end y la
certificación de secretos, límites, timeout y cleanup con provider real.

## Registro de cambios de enfoque

| Fecha      | Cambio                                                                                                                                                                                                                                                        | Motivo                                                                                                                                                    | Impacto en alcance/fases                                                                                                                   | Aprobado por                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| 2026-09-06 | Se adelanta en Fase 0 la infraestructura transversal mínima de capabilities sobre `SuiteSidebar`.                                                                                                                                                             | El workbench necesita un punto de entrada de plataforma sin convertirse en navegación paralela de suite.                                                  | Se limita a contrato, schema derivado, filtrado consumidor y ruta fixture; no inicia Fase 1-3 ni integra provider.                         | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se implementa el bloque Fases 0-4 con fixture/intake cliente y se excluyen backend real, validaciones de negocio visibles e historial permanente.                                                                                                             | Alcance explícito de la migración solicitada.                                                                                                             | Actualiza entregables, evidencia y criterios de cierre sin cambiar la frontera de tenancy del futuro backend.                              | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se reajusta la dropzone vacía para centrar el grupo completo, reforzar la jerarquía tipográfica y apilar acciones en móvil.                                                                                                                                   | La preparación debía aprovechar mejor el espacio de `TechnicalSurface` sin crear una geometría local paralela.                                            | Solo cambia la composición visual interna de `DocumentPreviewPane`; no cambia contratos de intake, estados ni flujo.                       | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se corrige el anclaje horizontal del grupo vacío usando un wrapper `w-full flex-1` y un grupo `mx-auto max-w-2xl`.                                                                                                                                            | El primer ajuste centraba dentro del ancho limitado, pero no respecto a toda la caja blanca.                                                              | La geometría queda centrada en el canvas completo en desktop y móvil; no cambia el flujo ni los contratos.                                 | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se retira `Simular error` de la UX normal y se mueve `Recortar` al toolbar como control iconográfico solo para imágenes.                                                                                                                                      | El estado de error sigue cubierto por fixtures/tests, pero no debe exponerse como acción de producto; el recorte pertenece a los controles de inspección. | El footer queda limitado a reemplazo/subida e inicio de extracción; PDF no muestra recorte.                                                | Usuario (solicitud explícita)                    |
| 2026-09-05 | `Reverso` pasa a ser condicional al archivo de segunda cara y el estado vuelve a `front` si ese archivo desaparece.                                                                                                                                           | No debe existir un control seleccionable para una cara inexistente ni quedar el preview apuntando a una cara eliminada.                                   | Se conserva el flujo de una cara; la segunda cara solo añade el control cuando está disponible.                                            | Usuario (solicitud explícita)                    |
| 2026-09-06 | El preview cargado adopta dos filas responsive (selector/cara y controles) y acciones de footer a ancho completo en móvil; el breadcrumb usa `SuiteConfig.modules[].breadcrumbs` con `mobileSegments` contractual.                                            | Evita apilamiento/overflow del toolbar y elimina labels duplicados o truncados sin crear un renderer local.                                               | Se conserva la anatomía desktop; móvil muestra solo el módulo activo en un único landmark breadcrumb.                                      | Usuario (solicitud explícita)                    |
| 2026-09-06 | La fila móvil de controles pasa a una toolbar secundaria de ancho completo con seis celdas uniformes (cinco en PDF), targets mínimos de 44px y separadores sutiles; desde `sm` conserva la fila compacta desktop.                                             | La distribución anterior envolvía controles sin garantizar igualdad geométrica ni aprovechamiento del ancho disponible.                                   | No cambia acciones ni layout desktop; crop sigue siendo image-only y open-tab permanece accesible.                                         | Usuario (solicitud explícita)                    |
| 2026-09-06 | La celda de porcentaje recibe una fracción mínima mayor y `whitespace-nowrap`/`overflow-visible` para mostrar siempre `100%`, `150%` y valores equivalentes sin elipsis.                                                                                      | El grid móvil podía comprimir el botón de reset y mostrar `10...`.                                                                                        | Se mantiene el target de 44px y la toolbar compacta desktop; no cambia la escala tipográfica.                                              | Usuario (solicitud explícita)                    |
| 2026-09-06 | PDF.js calcula un fit-contain desde el viewport medido del contenedor, conserva el aspect ratio y separa bitmap de CSS pixels; el fallback iframe ocupa toda la superficie disponible.                                                                        | El canvas PDF podía aparecer como thumbnail por una medición/escala insuficiente, aunque la imagen usaba correctamente el viewport.                       | La escala base real se aplica antes de zoom/rotación/pan; no se introduce un zoom fijo ni cambia el comportamiento de imágenes.            | Usuario (solicitud explícita)                    |
| 2026-09-06 | PDF.js adopta el flujo VitaBlue con build legacy estable, worker local resuelto por bundler (`new URL(..., import.meta.url)`), `Uint8Array` del `File`, cMaps y destrucción del loading task.                                                                 | El blank podía provenir de worker remoto/incompatible con Next webpack o de errores de render no expuestos.                                               | No se instala otra librería ni se cambia la versión existente; el fallback iframe permanece visible y full-surface.                        | Usuario (decisión basada en referencia VitaBlue) |
| 2026-09-06 | Diagnóstico browser real: el wrapper transformado se contraía a 1px, PDF.js medía ese ancho y renderizaba un canvas thumbnail; se fija `w-full min-w-0` en el wrapper.                                                                                        | El worker y PDF.js renderizaban correctamente; la escala diminuta era un feedback loop de layout intrínseco.                                              | El fit-contain existente pasa a recibir el ancho real de desktop/móvil; fallback y worker se conservan.                                    | Usuario (reproducción solicitada)                |
| 2026-09-05 | PDF con whitespace excesivo: se añade auto-fit visual conservador mediante bounding box no-blanca después del render inicial, con margen y umbral de cobertura; páginas normales/vacías mantienen fit de página.                                              | El `fit-contain` de la hoja completa dejaba el documento legible demasiado pequeño cuando el PDF tenía una gran área blanca alrededor.                    | No se modifica el archivo PDF; zoom, pan, rotación y reset siguen aplicándose al resultado visual; el fallback iframe permanece intacto.   | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se separan `baseFitScale`/`autoFitScale` de `userZoom`: el PDF inicia con escala visual derivada y el control muestra `100%`; reset vuelve a esa base y zoom +/- la multiplica.                                                                               | La escala visual equivalente al antiguo 250% debía conservarse sin presentar un porcentaje engañoso ni aplicar un zoom fijo ciego.                        | Imágenes no cambian; PDFs normales mantienen fit de página y el auto-crop existente sigue siendo condicional.                              | Usuario (solicitud explícita)                    |
| 2026-09-05 | Se corrige el consumo de la escala derivada: `autoFitScale/baseFitScale` se aplica al wrapper visual, mientras el canvas conserva el viewport base y `userZoom=1` sigue mostrando `100%`; se limita el multiplicador a la referencia visual aprobada de 250%. | La captura demostró que medir el canvas no garantizaba el tamaño del contenido: la transformación externa ignoraba la escala derivada.                    | El PDF cargado alcanza la densidad visual de 250% sin falsear el porcentaje; pan/rotación/reset y comportamiento de imágenes se conservan. | Usuario (reproducción visual solicitada)         |
| 2026-09-05 | Se revierte el auto-crop heurístico y el multiplicador oculto; PDF vuelve al enfoque VitaBlue: `baseScale` contractual de página, canvas CSS+DPR y wrapper solo con `userZoom`.                                                                               | La comparación visual mostró que el auto-fit por píxeles no representaba de forma fiable el documento y podía producir escalas artificiales.              | Se conserva fallback iframe/error, cleanup y zoom/pan/rotación; el label `100%` vuelve a corresponder a la escala base real.               | Usuario (solicitud explícita)                    |

## Riesgos y bloqueos

| Riesgo o bloqueo                       | Impacto                                  | Mitigación                                                                                     | Responsable | Estado  |
| -------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- | ------- |
| Credenciales de Gemini mal gestionadas | Exposición de PII y coste no controlado  | Credenciales solo server-side; revisión `security-review` antes de Fase 5                      | ai-platform | Abierto |
| PII en storage temporal                | Fuga de datos de identidad               | Bucket privado, RLS por organización/actor, cleanup en `finally`, sin persistencia por defecto | ai-platform | Abierto |
| Deriva de la shell de plataforma       | Composición fuera de estándar            | Recipe canónico aprobado en Fase 0; `pnpm test:shell` en Fase 3                                | platform    | Abierto |
| Divergencia fixture/provider           | El flujo con fixtures no predice el real | Contrato único `DocumentExtractionResult` para ambos providers; tests de contrato              | ai-platform | Abierto |
| Coste por run sin visibilidad          | Gasto no atribuible                      | Telemetría `usage` obligatoria en el contrato y visible en el workbench                        | ai-platform | Abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha      | Validación                                                                                                                  | Resultado                                                                                                                                                                                     | Referencia                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 2026-09-05 | `node scripts/tracks/validate-tracks.mjs` + dashboard                                                                       | ✅                                                                                                                                                                                            | tracks/README.md                                                                                                       |
| 2026-09-05 | Typecheck `loopdev-os` (`tsc --noEmit`)                                                                                     | ✅                                                                                                                                                                                            | suites/document-intelligence, app/document-intelligence                                                                |
| 2026-09-05 | eslint focalizado de la suite y rutas nuevas                                                                                | ✅ (0 errores; warnings Tailwind no bloqueantes)                                                                                                                                              | apps/loopdev-os                                                                                                        |
| 2026-09-05 | Smoke `next dev`: `/document-intelligence`, `/document-intelligence/new` y `/document-intelligence/:documentId`             | ✅ HTTP 200, compilación limpia                                                                                                                                                               | requiere sesión para el contenido, igual que el resto de la app                                                        |
| 2026-09-05 | `pnpm test:shell:changed`                                                                                                   | ✅ sin cambios en superficie shell                                                                                                                                                            | scripts/check-shell.mjs                                                                                                |
| 2026-09-05 | `pnpm registries:check`                                                                                                     | ✅                                                                                                                                                                                            | docs/registries/frontend-components.json (+6 entradas experimental)                                                    |
| 2026-09-06 | `pnpm --filter @loopdev/contracts build` + typecheck `@loopdev/ui`                                                          | ✅                                                                                                                                                                                            | `PlatformToolEntry`, `SuiteSidebar`, Launchpad                                                                         |
| 2026-09-06 | Tests focalizados `SuiteSidebar` + filtrado de capabilities                                                                 | ✅                                                                                                                                                                                            | `ds/packages/ui/src/components/composites/shell/SuiteSidebar`                                                          |
| 2026-09-06 | Auditoría comparativa Launchpad vs suites certificadas                                                                      | ✅                                                                                                                                                                                            | Matriz de paridad: Launchpad debía retirar `LaunchpadFrame` y usar el owner canónico `AppShell`                        |
| 2026-09-06 | Launchpad conectado directamente a `AppShell` con `PlatformHeader`/`SuiteSidebar` en slots                                  | ✅                                                                                                                                                                                            | `apps/loopdev-os/src/components/layout/LaunchpadShell.tsx`; `LaunchpadShell.test.tsx`                                  |
| 2026-09-06 | `SuiteSidebar.showSuiteHome` configurable; Launchpad oculta solo el dashboard entry                                         | ✅                                                                                                                                                                                            | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx`                                                                     |
| 2026-09-06 | Footer del sidebar en flujo flex al fondo y responsive gestionado por `AppShell`                                            | ✅                                                                                                                                                                                            | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx`; `AppShell` canonical wiring                                        |
| 2026-09-06 | Eliminado el propietario geométrico local `LaunchpadFrame` y su footer/drawer/responsive paralelo                           | ✅                                                                                                                                                                                            | `LaunchpadShell.tsx`; registry frontend regenerado                                                                     |
| 2026-09-06 | Corrección del content layer certificado de `TechnicalSurface` para preservar altura completa en `SuiteSidebar`             | ✅                                                                                                                                                                                            | `TechnicalSurface.test.tsx`; `SuiteSidebar.test.tsx`                                                                   |
| 2026-09-06 | Launchpad conserva rail con iconos en desktop y fuerza `SuiteSidebar` expandido con `headerSlot` contextual en tablet/móvil | ✅                                                                                                                                                                                            | `LaunchpadShell.tsx`; `SuiteSidebar` API; `LaunchpadShell.test.tsx`                                                    |
| 2026-09-05 | Tests focalizados de Document Intelligence                                                                                  | ✅ 8 tests                                                                                                                                                                                    | preview, validación MIME/tamaño, contexto, decisiones y rutas                                                          |
| 2026-09-05 | Tests focalizados de perfiles y formulario (`export-profiles`, `ExtractionReviewForm`, `DocumentIntelligenceWorkbench`)     | ✅ 5 tests                                                                                                                                                                                    | catálogo tipado, `Aseguradora 1` por defecto y selector estructural                                                    |
| 2026-09-06 | Copia individual por campo en `ExtractionReviewForm`                                                                        | ✅ 6 tests                                                                                                                                                                                    | `IconButton` accesible en campos simples y MRZ; feedback `role="status"`                                               |
| 2026-09-05 | UI/UX spec del formulario de revisión                                                                                       | ✅ contrato documentado; aprobación visual pendiente                                                                                                                                          | `ExtractionReviewForm.UI_UX_SPEC.md`; responsive y menú Radix pendientes de revisión en navegador                      |
| 2026-09-05 | Preparación sin placeholder de revisión ni inspector contextual por defecto                                                 | ✅                                                                                                                                                                                            | `DocumentIntelligenceWorkbench.test.tsx`; `DocumentIntelligenceShell.test.tsx`                                         |
| 2026-09-05 | Historial de extracciones migrado a `ResponsiveTable` con columnas claras y representación móvil semántica                  | ✅                                                                                                                                                                                            | `apps/loopdev-os/src/app/document-intelligence/page.tsx`; `page.test.tsx`                                              |
| 2026-09-05 | Dropzone de preparación centrada, con jerarquía ampliada y acciones responsive sin overflow móvil                           | ✅                                                                                                                                                                                            | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane/UI_UX_SPEC.md`                         |
| 2026-09-05 | Geometría de dropzone verificada visualmente en 1440, 1920 y 390 px: grupo centrado y sin overflow horizontal               | ✅                                                                                                                                                                                            | Playwright local contra `/document-intelligence/new`; wrapper y rects centrados en cada viewport                       |
| 2026-09-05 | Preview cargado sin `Simular error`; `Recortar` en toolbar, image-only, con tooltip y target 32px                           | ✅                                                                                                                                                                                            | `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane.tsx`; UI/UX spec                                                  |
| 2026-09-05 | `Reverso` ausente sin segunda cara y reset automático a `Anverso` al eliminar el back activo                                | ✅                                                                                                                                                                                            | `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane.side-state.test.tsx`                                              |
| 2026-09-06 | Toolbar móvil en dos filas, footer CTA sin overflow y breadcrumb contractual desktop/mobile                                 | ✅ tests focalizados; revisión visual final pendiente                                                                                                                                         | `DocumentPreviewPane.test.tsx`; `ModuleHeader.test.tsx`; `DocumentIntelligenceShell.test.tsx`; `IndustrialBreadcrumbs` |
| 2026-09-06 | Toolbar secundaria móvil full-width con celdas uniformes, targets 44px y grid PDF/image                                     | ✅ tests focalizados; revisión visual final pendiente                                                                                                                                         | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec                                                  |
| 2026-09-06 | Regresión PDF: fit-contain del primer page viewport, aspect ratio y fallback iframe full-surface                            | ✅ test de cálculo; browser matrix pendiente                                                                                                                                                  | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec                                                  |
| 2026-09-06 | Worker PDF.js empaquetado, `Uint8Array`, cMaps y fallback robusto alineados con VitaBlue                                    | ✅ 8 tests focalizados; revisión visual con PDF real pendiente                                                                                                                                | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; VitaBlue `DocumentViewer.tsx`                               |
| 2026-09-06 | Diagnóstico y corrección browser real del canvas PDF de 1px                                                                 | ✅ Playwright desktop/móvil con PDF válido: canvas pasó de 1px a viewport medido tras fijar wrapper; test estructural añadido                                                                 | `DocumentPreviewPane.tsx`; evidencia runtime capturada durante la sesión                                               |
| 2026-09-06 | Fallback de segundo nivel para PDF: si PDF.js y el iframe fallan, se muestra error accionable con descarga del object URL   | ✅ test de contrato de estado y fallback visible                                                                                                                                              | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`                                                              |
| 2026-09-05 | Auto-fit PDF por bounding box no-blanca con preservación de fit para páginas normales/vacías                                | ✅ 12 tests focalizados; Playwright real desktop/móvil con PDF de página amplia y contenido centrado: canvas 464×228 (1440) y 292×143 (390), sin thumbnail y sin overflow                     | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec                                                  |
| 2026-09-05 | Escala inicial PDF separada del porcentaje de usuario                                                                       | ✅ 13 tests focalizados; Playwright con el mismo PDF: etiqueta `100%`, canvas estable 464×228 desktop y 292×143 móvil tras completar render                                                   | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec                                                  |
| 2026-09-05 | Corrección visual de escala inicial PDF basada en captura y bounding box visible                                            | ✅ Playwright antes/después: antes contenido visible 273×40 dentro de canvas 464×228; después screenshot con wrapper `scale(2.5)`, PDF grande y label `100%`; móvil sin overflow              | `/tmp/document-intelligence-pdf-after.png`; `/tmp/document-intelligence-pdf-final2.png`; `DocumentPreviewPane.tsx`     |
| 2026-09-05 | Comparación VitaBlue/LoopDev: baseScale sin auto-crop ni multiplicador oculto                                               | Pendiente de ejecución final en ambos visores; el contrato y la implementación quedan alineados con VitaBlue antes de la comparación                                                          | `DocumentPreviewPane.tsx`; UI/UX spec; VitaBlue `DocumentViewer.tsx`                                                   |
| 2026-09-05 | `pnpm test`                                                                                                                 | ✅                                                                                                                                                                                            | Vitest completo                                                                                                        |
| 2026-09-05 | `pnpm test:shell`                                                                                                           | ✅ 41 tests + typecheck UI                                                                                                                                                                    | shell canónico                                                                                                         |
| 2026-09-05 | `pnpm registries:check` + `node scripts/tracks/validate-tracks.mjs`                                                         | ✅                                                                                                                                                                                            | registry y dashboard sincronizados                                                                                     |
| 2026-09-05 | `pnpm validate:changed`                                                                                                     | ⚠️ bloqueado por base histórica: `origin/develop` no es ancestro de HEAD                                                                                                                      | no relacionado con el cambio                                                                                           |
| 2026-09-05 | `pnpm validate:ci`                                                                                                          | ⚠️ lint del efecto corregido; el segundo intento alcanza el frontend quality gate pero queda bloqueado por paths eliminados/movidos del diff de rama y formato histórico fuera de este cambio | `ValidationSummaryList.tsx` eliminado y track movido a `tracks/active`                                                 |
| 2026-09-05 | `pnpm --filter loopdev-os build`                                                                                            | ✅                                                                                                                                                                                            | Next production build; rutas `/document-intelligence`, `/new` y `/:documentId` generadas                               |

## Component duplicate review

- **Requested shared pattern:** `AIFeedbackSurface` / AI processing feedback surface.
- **Candidates reviewed:** `EmptyState variant="ai"`, `AILoader`, `TechnicalCanvas`,
  `TechnicalSurface` and the existing suite-local processing composition.
- **Reuse decision:** create a shared composite that composes the existing
  technical primitives. `EmptyState` remains unchanged because its contract is
  terminal/empty result feedback; `AILoader` remains a lower-level textual
  indicator.
- **Rejected alternatives:** extending `EmptyState` with stages and a full
  workspace layout would conflate loading with empty-state semantics; keeping
  the purple block in Document Intelligence would duplicate the pattern and
  block future consumers.
- **Owner and consumers:** `frontend-platform`; Document Intelligence first,
  CRM/Marketing Studio/Operations planned.
- **Evidence:** `ds/packages/ui/src/components/composites/feedback/AIFeedbackSurface`
  and registry entry `ai-feedback-surface-v1`. Status is experimental with visual,
  responsive-browser, second-consumer and technical-certification gaps.

- **Requested name:** `DocumentViewer` / `@loopdev/document-viewer`.
- **Reference components reviewed:** previous suite-local `DocumentPreviewPane`, Marketing Studio
  `AssetManagerView`, `TechnicalSurface`/`IconButton` contracts and the VitaBlue `DocumentViewer`
  reference recorded in this track.
- **Normalized responsibility:** one browser-local image/PDF inspection surface with explicit fit,
  transform and recovery behavior.
- **Intended consumers:** Document Intelligence now; CRM, Marketing Studio and Operations as
  future consumer-owned intake compositions.
- **Owning layer:** shared package composite under `packages/document-viewer`.
- **Registry entries searched:** `document-preview-pane`, existing preview/asset workspace entries,
  `docs/registries/frontend-components.json`, package exports and `@loopdev/ui`.
- **Similar candidates:** `AssetManagerView` (suite-owned asset cards, not a renderer), old
  `DocumentPreviewPane` (feature-owned intake plus renderer), and `TechnicalSurface` (surface only).
- **Reuse/composition attempted:** reused `TechnicalSurface`, `Button`, `IconButton`, `Badge`,
  `Icon`, tokens and the existing `pdfjs-dist` dependency; intake remains suite-owned.
- **Decision:** `create` one shared, suite-agnostic viewer and remove the local renderer.
- **Rejected alternatives:** retaining the feature-local renderer would duplicate PDF lifecycle and
  create future drift; moving upload/tenant/extraction rules into the package would violate package
  ownership; auto-crop or a hidden scale would make fit behavior non-deterministic.
- **Promotion target:** shared package, experimental until visual review is complete.
- **Evidence:** `packages/document-viewer/src/types.ts`, `presets.ts`, `DocumentViewer.tsx`,
  `engines.tsx`, `UI_UX_SPEC.md`, focused tests, Playwright certification and registry entry.

## Re-audit: shared DocumentViewer extraction

| Action                                                   | Result         | Evidence                                                                  |
| -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------- |
| `extract` renderer from `DocumentPreviewPane`            | verified       | `packages/document-viewer/src/DocumentViewer.tsx`; deleted local renderer |
| `adapt` fit behavior to explicit modes                   | verified       | `calculateDocumentFit` tests and `DOCUMENT_VIEWER_PRESETS`                |
| `remove` auto-crop and hidden/fixed multipliers          | verified       | only `contain`, `width` and `actual`; no heuristic content crop           |
| `compose` consumer-owned intake and extraction           | verified       | `DocumentIntakePane.tsx` passes typed file/labels and keeps validation    |
| `keep` PDF legacy worker/cMap fallback                   | verified       | `engines.tsx`; Next webpack production build                              |
| `keep` responsive and accessible controls                | verified       | Vitest/Axe and desktop/mobile-compact Playwright                          |
| `defer` native/Expo implementation and permanent history | still-deferred | UI/UX spec portability boundary                                           |

## Implementation handoff and evidence (2026-09-05)

- **Starting commit:** `edae4f76`.
- **Implementation:** added `packages/document-viewer` with typed contracts/presets, native image
  engine, PDF.js legacy worker and cMap configuration, explicit fit modes, zoom/pan/rotate/reset,
  fallback/download recovery and object URL cleanup.
- **Consumer migration:** `DocumentIntelligenceWorkbench` now composes `DocumentIntakePane`; the
  suite keeps MIME/size validation, clipboard/drop/fixture intake and side selection while the
  duplicate `DocumentPreviewPane` renderer, tests and spec were removed.
- **Browser evidence:** `e2e/document-viewer.certification.spec.mjs` passes desktop, mobile and
  compact-mobile interaction/overflow plus valid PDF.js canvas checks (9/9).
- **Validation evidence:** full Vitest, package/consumer focused Vitest/Axe tests, shared package
  build, Next webpack build, full shell (41 tests), changed-shell, static controls,
  source-contracts, registry/catalog, track, ownership/design, E2E catalog and `git diff --check`
  pass. Branch validation is blocked by the repository's historical `origin/develop` ancestry
  mismatch; package tests are excluded from the package production typecheck and run through the
  registered Vitest project.
- **UI/UX gate:** `ready-for-review`; visual review and forced PDF fallback browser evidence remain
  registry gaps.

### Validación de continuación (extracción compartida)

- El smoke Playwright real del consumidor `/document-intelligence/new` pasa en
  `desktop`, `mobile` y `mobile-compact` (9/9): fit explícito, zoom/reset,
  rotación, overflow y render PDF.js con canvas visible.
- Los fixtures públicos del paquete cubren PDF, JPEG y PNG con bytes de archivo
  reales; `createDocumentViewerFixtures()` queda disponible para pruebas y
  consumidores de certificación.
- Validación focalizada vigente: `@loopdev/document-viewer` (6 tests), `DocumentIntakePane`
  y `DocumentIntelligenceWorkbench` (3 tests), build de `loopdev-os`,
  `registries:check` y `certification:source-contracts`.
- La ejecución global de Vitest conserva un fallo histórico de
  `src/app/document-intelligence/routes.test.ts` cuando se invoca desde el
  proyecto agregado (resuelve el `cwd` como `apps/loopdev-os` y duplica el
  prefijo); las rutas sí están presentes y `next build` las genera. No se
  modifica ese test no relacionado en esta extracción.

## Handoff de sesión

- **Fecha:** 2026-09-06.
- **Rama de continuación:** `feature/document-intelligence-backend`.
- **Commit de partida:** `63b00b42` (`develop` tras squash de #181).
- **Estado alcanzado:** Fases 0-4 integradas en `develop`; Fase 5 reanudada para endurecer la
  frontera server-side. Bucket privado, RLS, Edge Function, route handler multipart y cleanup ya
  existen; este slice añade timeout explícito del provider y parseo tipado de respuestas inválidas.
- **Decisiones, bloqueos y riesgos:** no se usan credenciales reales en local; faltan pruebas
  negativas RLS, E2E autenticado con provider real y confirmación por entorno de `GEMINI_API_KEY`.
- **Validación ejecutada:** tests shell/workbench, validación estática y `validate:branch` del
  estado integrado; el E2E autenticado local requiere levantar el servidor y credenciales de test.
- **Siguiente acción concreta:** añadir cobertura ejecutable para timeout/provider-invalid y preparar
  la matriz de pruebas RLS/E2E sin exponer PII ni secretos.

## Cierre

Pendiente de aprobación explícita.
