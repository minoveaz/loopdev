---
id: document-intelligence-poc-migration
title: Migración del POC operativo de Document Intelligence desde VitaBlue
status: active
created: 2026-09-05
updated: 2026-09-05
owner: ai-platform
lead: null
branch: loopdev-io-document-intelligence-migration
branches: []
phase: 4
pull_requests: []
issues: [176]
packages: [@loopdev/contracts, loopdev-os]
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
- Backend real, Edge Function, Gemini, storage tenant-scoped y credenciales de provider.
- Procesamiento por lotes e historial permanente de extracciones.
- Perfiles de exportación; quedan documentados como frontera de consumidor futuro (p. ej.
  Marketing Studio).
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
| 2026-09-05 | Se incluye historial operativo local y persistencia de metadatos, pero no historial permanente.                                                                                                                                                                                          | La home necesita recuperar fixtures y sesiones recientes sin convertir el POC en un sistema de retención.                                                                                            | `localStorage` conserva metadatos no sensibles; archivos y datos de identidad no se persisten.                                                                                                                           | Usuario (solicitud explícita)                                  |
| 2026-09-05 | Se retira `ValidationSummaryList` y cualquier validación de negocio visible del workbench.                                                                                                                                                                                               | La revisión solicitada es editable/nullables con decisión básica; las validaciones visibles se difieren.                                                                                             | El resultado puede transportar validaciones para el futuro, pero no se renderizan ni bloquean aprobar/rechazar.                                                                                                          | Usuario (solicitud explícita)                                  |

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
- **Frontera futura**: la subida a storage privado, invocación de la Edge Function y cleanup
  server-side permanecen como contrato diferido; este bloque solo revoca object URLs del navegador.
- **Provider diferido**: Edge Function `extract-identity-document`, credenciales
  (`GEMINI_API_KEY`), auth por sesión, validación de referencias y normalización server-side no se
  conectan en este bloque.

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
`DocumentPreviewPane`, `ExtractionReviewForm`, `UsageCostPanel`, `WorkbenchInspector`.

Gaps resueltos en este bloque: dropzone con allowlist MIME y tamaño (G1), visor documental
zoom/rotate/crop/PDF con fallback (G2), feedback de procesamiento fixture (G3). Gaps diferidos:
`Tabs` compartido (G4), input de fecha `DD/MM/YYYY` (G5), presentación overlay del
`ModuleContextPanel` en tablet (G6, requiere revisión con `platform-shell`; prohibido mutar el
shell desde la suite) y validaciones de negocio visibles. La home de historial reutiliza
`ResponsiveTable` con columnas explícitas de documento, tipo/clasificación, estado, actualización y
acción de apertura; en móvil usa filas semánticas apiladas sin depender de overflow horizontal.

## Branch strategy

`branch: loopdev-io-document-intelligence-migration` para todo el bloque Fases 0-4. No se crean
ramas adicionales: el usuario solicitó preservar esta rama de migración existente.

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

**Evidencia:** `apps/loopdev-os/src/suites/document-intelligence/workbench/DocumentPreviewPane/UI_UX_SPEC.md`;
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

**Evidencia:** `apps/loopdev-os/src/suites/document-intelligence/workbench/file-validation.ts`,
`DocumentPreviewPane.tsx`, `workbench-context.tsx`.

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

**Evidencia:** `DocumentPreviewPane.test.tsx`, `workbench-context.test.tsx`,
`routes.test.ts`, `DocumentPreviewPane/UI_UX_SPEC.md`.

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

## Registro de cambios de enfoque

| Fecha      | Cambio                                                                                                                                            | Motivo                                                                                                   | Impacto en alcance/fases                                                                                           | Aprobado por                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| 2026-09-06 | Se adelanta en Fase 0 la infraestructura transversal mínima de capabilities sobre `SuiteSidebar`.                                                 | El workbench necesita un punto de entrada de plataforma sin convertirse en navegación paralela de suite. | Se limita a contrato, schema derivado, filtrado consumidor y ruta fixture; no inicia Fase 1-3 ni integra provider. | Usuario (solicitud explícita) |
| 2026-09-05 | Se implementa el bloque Fases 0-4 con fixture/intake cliente y se excluyen backend real, validaciones de negocio visibles e historial permanente. | Alcance explícito de la migración solicitada.                                                            | Actualiza entregables, evidencia y criterios de cierre sin cambiar la frontera de tenancy del futuro backend.      | Usuario (solicitud explícita) |
| 2026-09-05 | Se reajusta la dropzone vacía para centrar el grupo completo, reforzar la jerarquía tipográfica y apilar acciones en móvil. | La preparación debía aprovechar mejor el espacio de `TechnicalSurface` sin crear una geometría local paralela. | Solo cambia la composición visual interna de `DocumentPreviewPane`; no cambia contratos de intake, estados ni flujo. | Usuario (solicitud explícita) |
| 2026-09-05 | Se corrige el anclaje horizontal del grupo vacío usando un wrapper `w-full flex-1` y un grupo `mx-auto max-w-2xl`. | El primer ajuste centraba dentro del ancho limitado, pero no respecto a toda la caja blanca. | La geometría queda centrada en el canvas completo en desktop y móvil; no cambia el flujo ni los contratos. | Usuario (solicitud explícita) |
| 2026-09-05 | Se retira `Simular error` de la UX normal y se mueve `Recortar` al toolbar como control iconográfico solo para imágenes. | El estado de error sigue cubierto por fixtures/tests, pero no debe exponerse como acción de producto; el recorte pertenece a los controles de inspección. | El footer queda limitado a reemplazo/subida e inicio de extracción; PDF no muestra recorte. | Usuario (solicitud explícita) |
| 2026-09-05 | `Reverso` pasa a ser condicional al archivo de segunda cara y el estado vuelve a `front` si ese archivo desaparece. | No debe existir un control seleccionable para una cara inexistente ni quedar el preview apuntando a una cara eliminada. | Se conserva el flujo de una cara; la segunda cara solo añade el control cuando está disponible. | Usuario (solicitud explícita) |
| 2026-09-06 | El preview cargado adopta dos filas responsive (selector/cara y controles) y acciones de footer a ancho completo en móvil; el breadcrumb usa `SuiteConfig.modules[].breadcrumbs` con `mobileSegments` contractual. | Evita apilamiento/overflow del toolbar y elimina labels duplicados o truncados sin crear un renderer local. | Se conserva la anatomía desktop; móvil muestra solo el módulo activo en un único landmark breadcrumb. | Usuario (solicitud explícita) |
| 2026-09-06 | La fila móvil de controles pasa a una toolbar secundaria de ancho completo con seis celdas uniformes (cinco en PDF), targets mínimos de 44px y separadores sutiles; desde `sm` conserva la fila compacta desktop. | La distribución anterior envolvía controles sin garantizar igualdad geométrica ni aprovechamiento del ancho disponible. | No cambia acciones ni layout desktop; crop sigue siendo image-only y open-tab permanece accesible. | Usuario (solicitud explícita) |
| 2026-09-06 | La celda de porcentaje recibe una fracción mínima mayor y `whitespace-nowrap`/`overflow-visible` para mostrar siempre `100%`, `150%` y valores equivalentes sin elipsis. | El grid móvil podía comprimir el botón de reset y mostrar `10...`. | Se mantiene el target de 44px y la toolbar compacta desktop; no cambia la escala tipográfica. | Usuario (solicitud explícita) |
| 2026-09-06 | PDF.js calcula un fit-contain desde el viewport medido del contenedor, conserva el aspect ratio y separa bitmap de CSS pixels; el fallback iframe ocupa toda la superficie disponible. | El canvas PDF podía aparecer como thumbnail por una medición/escala insuficiente, aunque la imagen usaba correctamente el viewport. | La escala base real se aplica antes de zoom/rotación/pan; no se introduce un zoom fijo ni cambia el comportamiento de imágenes. | Usuario (solicitud explícita) |
| 2026-09-06 | PDF.js adopta el flujo VitaBlue con build legacy estable, worker local resuelto por bundler (`new URL(..., import.meta.url)`), `Uint8Array` del `File`, cMaps y destrucción del loading task. | El blank podía provenir de worker remoto/incompatible con Next webpack o de errores de render no expuestos. | No se instala otra librería ni se cambia la versión existente; el fallback iframe permanece visible y full-surface. | Usuario (decisión basada en referencia VitaBlue) |
| 2026-09-06 | Diagnóstico browser real: el wrapper transformado se contraía a 1px, PDF.js medía ese ancho y renderizaba un canvas thumbnail; se fija `w-full min-w-0` en el wrapper. | El worker y PDF.js renderizaban correctamente; la escala diminuta era un feedback loop de layout intrínseco. | El fit-contain existente pasa a recibir el ancho real de desktop/móvil; fallback y worker se conservan. | Usuario (reproducción solicitada) |
| 2026-09-05 | PDF con whitespace excesivo: se añade auto-fit visual conservador mediante bounding box no-blanca después del render inicial, con margen y umbral de cobertura; páginas normales/vacías mantienen fit de página. | El `fit-contain` de la hoja completa dejaba el documento legible demasiado pequeño cuando el PDF tenía una gran área blanca alrededor. | No se modifica el archivo PDF; zoom, pan, rotación y reset siguen aplicándose al resultado visual; el fallback iframe permanece intacto. | Usuario (solicitud explícita) |
| 2026-09-05 | Se separan `baseFitScale`/`autoFitScale` de `userZoom`: el PDF inicia con escala visual derivada y el control muestra `100%`; reset vuelve a esa base y zoom +/- la multiplica. | La escala visual equivalente al antiguo 250% debía conservarse sin presentar un porcentaje engañoso ni aplicar un zoom fijo ciego. | Imágenes no cambian; PDFs normales mantienen fit de página y el auto-crop existente sigue siendo condicional. | Usuario (solicitud explícita) |
| 2026-09-05 | Se corrige el consumo de la escala derivada: `autoFitScale/baseFitScale` se aplica al wrapper visual, mientras el canvas conserva el viewport base y `userZoom=1` sigue mostrando `100%`; se limita el multiplicador a la referencia visual aprobada de 250%. | La captura demostró que medir el canvas no garantizaba el tamaño del contenido: la transformación externa ignoraba la escala derivada. | El PDF cargado alcanza la densidad visual de 250% sin falsear el porcentaje; pan/rotación/reset y comportamiento de imágenes se conservan. | Usuario (reproducción visual solicitada) |
| 2026-09-05 | Se revierte el auto-crop heurístico y el multiplicador oculto; PDF vuelve al enfoque VitaBlue: `baseScale` contractual de página, canvas CSS+DPR y wrapper solo con `userZoom`. | La comparación visual mostró que el auto-fit por píxeles no representaba de forma fiable el documento y podía producir escalas artificiales. | Se conserva fallback iframe/error, cleanup y zoom/pan/rotación; el label `100%` vuelve a corresponder a la escala base real. | Usuario (solicitud explícita) |

## Riesgos y bloqueos

| Riesgo o bloqueo                       | Impacto                                  | Mitigación                                                                         | Responsable | Estado  |
| -------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- | ----------- | ------- |
| Credenciales de Gemini mal gestionadas | Exposición de PII y coste no controlado  | Credenciales solo server-side; revisión `security-review` en Fase 2                | ai-platform | Abierto |
| PII en storage temporal                | Fuga de datos de identidad               | Bucket privado, path por actor, cleanup en `finally`, sin persistencia por defecto | ai-platform | Abierto |
| Deriva de la shell de plataforma       | Composición fuera de estándar            | Recipe canónico aprobado en Fase 0; `pnpm test:shell` en Fase 3                    | platform    | Abierto |
| Divergencia fixture/provider           | El flujo con fixtures no predice el real | Contrato único `DocumentExtractionResult` para ambos providers; tests de contrato  | ai-platform | Abierto |
| Coste por run sin visibilidad          | Gasto no atribuible                      | Telemetría `usage` obligatoria en el contrato y visible en el workbench            | ai-platform | Abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha      | Validación                                                                                                                  | Resultado                                                                                       | Referencia                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 2026-09-05 | `node scripts/tracks/validate-tracks.mjs` + dashboard                                                                       | ✅                                                                                              | tracks/README.md                                                                                |
| 2026-09-05 | Typecheck `loopdev-os` (`tsc --noEmit`)                                                                                     | ✅                                                                                              | suites/document-intelligence, app/document-intelligence                                         |
| 2026-09-05 | eslint focalizado de la suite y rutas nuevas                                                                                | ✅ (0 errores; warnings Tailwind no bloqueantes)                                                | apps/loopdev-os                                                                                 |
| 2026-09-05 | Smoke `next dev`: `/document-intelligence`, `/document-intelligence/new` y `/document-intelligence/:documentId`             | ✅ HTTP 200, compilación limpia                                                                 | requiere sesión para el contenido, igual que el resto de la app                                 |
| 2026-09-05 | `pnpm test:shell:changed`                                                                                                   | ✅ sin cambios en superficie shell                                                              | scripts/check-shell.mjs                                                                         |
| 2026-09-05 | `pnpm registries:check`                                                                                                     | ✅                                                                                              | docs/registries/frontend-components.json (+6 entradas experimental)                             |
| 2026-09-06 | `pnpm --filter @loopdev/contracts build` + typecheck `@loopdev/ui`                                                          | ✅                                                                                              | `PlatformToolEntry`, `SuiteSidebar`, Launchpad                                                  |
| 2026-09-06 | Tests focalizados `SuiteSidebar` + filtrado de capabilities                                                                 | ✅                                                                                              | `ds/packages/ui/src/components/composites/shell/SuiteSidebar`                                   |
| 2026-09-06 | Auditoría comparativa Launchpad vs suites certificadas                                                                      | ✅                                                                                              | Matriz de paridad: Launchpad debía retirar `LaunchpadFrame` y usar el owner canónico `AppShell` |
| 2026-09-06 | Launchpad conectado directamente a `AppShell` con `PlatformHeader`/`SuiteSidebar` en slots                                  | ✅                                                                                              | `apps/loopdev-os/src/components/layout/LaunchpadShell.tsx`; `LaunchpadShell.test.tsx`           |
| 2026-09-06 | `SuiteSidebar.showSuiteHome` configurable; Launchpad oculta solo el dashboard entry                                         | ✅                                                                                              | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx`                                              |
| 2026-09-06 | Footer del sidebar en flujo flex al fondo y responsive gestionado por `AppShell`                                            | ✅                                                                                              | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx`; `AppShell` canonical wiring                 |
| 2026-09-06 | Eliminado el propietario geométrico local `LaunchpadFrame` y su footer/drawer/responsive paralelo                           | ✅                                                                                              | `LaunchpadShell.tsx`; registry frontend regenerado                                              |
| 2026-09-06 | Corrección del content layer certificado de `TechnicalSurface` para preservar altura completa en `SuiteSidebar`             | ✅                                                                                              | `TechnicalSurface.test.tsx`; `SuiteSidebar.test.tsx`                                            |
| 2026-09-06 | Launchpad conserva rail con iconos en desktop y fuerza `SuiteSidebar` expandido con `headerSlot` contextual en tablet/móvil | ✅                                                                                              | `LaunchpadShell.tsx`; `SuiteSidebar` API; `LaunchpadShell.test.tsx`                             |
| 2026-09-05 | Tests focalizados de Document Intelligence                                                                                  | ✅ 8 tests                                                                                      | preview, validación MIME/tamaño, contexto, decisiones y rutas                                   |
| 2026-09-05 | Preparación sin placeholder de revisión ni inspector contextual por defecto                                                  | ✅                                                                                              | `DocumentIntelligenceWorkbench.test.tsx`; `DocumentIntelligenceShell.test.tsx`                |
| 2026-09-05 | Historial de extracciones migrado a `ResponsiveTable` con columnas claras y representación móvil semántica                  | ✅                                                                                              | `apps/loopdev-os/src/app/document-intelligence/page.tsx`; `page.test.tsx`                    |
| 2026-09-05 | Dropzone de preparación centrada, con jerarquía ampliada y acciones responsive sin overflow móvil                         | ✅                                                                                              | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane/UI_UX_SPEC.md` |
| 2026-09-05 | Geometría de dropzone verificada visualmente en 1440, 1920 y 390 px: grupo centrado y sin overflow horizontal             | ✅                                                                                              | Playwright local contra `/document-intelligence/new`; wrapper y rects centrados en cada viewport |
| 2026-09-05 | Preview cargado sin `Simular error`; `Recortar` en toolbar, image-only, con tooltip y target 32px            | ✅                                                                                              | `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane.tsx`; UI/UX spec |
| 2026-09-05 | `Reverso` ausente sin segunda cara y reset automático a `Anverso` al eliminar el back activo            | ✅                                                                                              | `DocumentPreviewPane.test.tsx`; `DocumentPreviewPane.side-state.test.tsx` |
| 2026-09-06 | Toolbar móvil en dos filas, footer CTA sin overflow y breadcrumb contractual desktop/mobile        | ✅ tests focalizados; revisión visual final pendiente                                           | `DocumentPreviewPane.test.tsx`; `ModuleHeader.test.tsx`; `DocumentIntelligenceShell.test.tsx`; `IndustrialBreadcrumbs` |
| 2026-09-06 | Toolbar secundaria móvil full-width con celdas uniformes, targets 44px y grid PDF/image            | ✅ tests focalizados; revisión visual final pendiente                                           | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec |
| 2026-09-06 | Regresión PDF: fit-contain del primer page viewport, aspect ratio y fallback iframe full-surface | ✅ test de cálculo; browser matrix pendiente                                                   | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec |
| 2026-09-06 | Worker PDF.js empaquetado, `Uint8Array`, cMaps y fallback robusto alineados con VitaBlue | ✅ 8 tests focalizados; revisión visual con PDF real pendiente | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; VitaBlue `DocumentViewer.tsx` |
| 2026-09-06 | Diagnóstico y corrección browser real del canvas PDF de 1px | ✅ Playwright desktop/móvil con PDF válido: canvas pasó de 1px a viewport medido tras fijar wrapper; test estructural añadido | `DocumentPreviewPane.tsx`; evidencia runtime capturada durante la sesión |
| 2026-09-06 | Fallback de segundo nivel para PDF: si PDF.js y el iframe fallan, se muestra error accionable con descarga del object URL | ✅ test de contrato de estado y fallback visible | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx` |
| 2026-09-05 | Auto-fit PDF por bounding box no-blanca con preservación de fit para páginas normales/vacías | ✅ 12 tests focalizados; Playwright real desktop/móvil con PDF de página amplia y contenido centrado: canvas 464×228 (1440) y 292×143 (390), sin thumbnail y sin overflow | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec |
| 2026-09-05 | Escala inicial PDF separada del porcentaje de usuario | ✅ 13 tests focalizados; Playwright con el mismo PDF: etiqueta `100%`, canvas estable 464×228 desktop y 292×143 móvil tras completar render | `DocumentPreviewPane.tsx`; `DocumentPreviewPane.test.tsx`; UI/UX spec |
| 2026-09-05 | Corrección visual de escala inicial PDF basada en captura y bounding box visible | ✅ Playwright antes/después: antes contenido visible 273×40 dentro de canvas 464×228; después screenshot con wrapper `scale(2.5)`, PDF grande y label `100%`; móvil sin overflow | `/tmp/document-intelligence-pdf-after.png`; `/tmp/document-intelligence-pdf-final2.png`; `DocumentPreviewPane.tsx` |
| 2026-09-05 | Comparación VitaBlue/LoopDev: baseScale sin auto-crop ni multiplicador oculto | Pendiente de ejecución final en ambos visores; el contrato y la implementación quedan alineados con VitaBlue antes de la comparación | `DocumentPreviewPane.tsx`; UI/UX spec; VitaBlue `DocumentViewer.tsx` |
| 2026-09-05 | `pnpm test`                                                                                                                 | ✅                                                                                              | Vitest completo                                                                                 |
| 2026-09-05 | `pnpm test:shell`                                                                                                           | ✅ 41 tests + typecheck UI                                                                      | shell canónico                                                                                  |
| 2026-09-05 | `pnpm registries:check` + `node scripts/tracks/validate-tracks.mjs`                                                         | ✅                                                                                              | registry y dashboard sincronizados                                                              |
| 2026-09-05 | `pnpm validate:changed`                                                                                                     | ⚠️ bloqueado por base histórica: `origin/develop` no es ancestro de HEAD                        | no relacionado con el cambio                                                                    |
| 2026-09-05 | `pnpm validate:ci` | ⚠️ lint del efecto corregido; el segundo intento alcanza el frontend quality gate pero queda bloqueado por paths eliminados/movidos del diff de rama y formato histórico fuera de este cambio | `ValidationSummaryList.tsx` eliminado y track movido a `tracks/active` |
| 2026-09-05 | `pnpm --filter loopdev-os build` | ✅ | Next production build; rutas `/document-intelligence`, `/new` y `/:documentId` generadas |

## Handoff de sesión

Actualizar al finalizar una sesión de implementación. Es un resumen breve y reemplazable: no duplica
la especificación, el historial de Git ni la conversación.

- **Fecha:** 2026-09-05.
- **Rama de continuación:** `loopdev-io-document-intelligence-migration`.
- **Commit de partida:** `11572c06`.
- **Estado alcanzado:** Fases 0-4 implementadas con contratos, fixtures, home/lista persistida,
  intake real cliente, preview PDF/imagen y revisión básica; la preparación ocupa solo el preview
  y el inspector contextual permanece oculto hasta revisión/error.
- **Decisiones, bloqueos y riesgos:** provider real/Gemini, Edge Function, storage tenant-scoped,
  validaciones de negocio visibles, historial permanente y certificación visual quedan fuera.
- **Validación ejecutada:** typecheck/build de contratos y `loopdev-os`, tests focalizados y completos,
  build Next, shell, registry, tracks y source-contracts verdes; `validate:changed` está bloqueado por
  la base histórica y `validate:ci` alcanza el quality gate pero no puede resolver paths eliminados/
  movidos y formato histórico del diff de rama.
- **Siguiente acción concreta:** revisión visual presencial y aprobación explícita del usuario;
  la certificación visual no se declara en este bloque.

## Cierre

Pendiente de aprobación explícita.
