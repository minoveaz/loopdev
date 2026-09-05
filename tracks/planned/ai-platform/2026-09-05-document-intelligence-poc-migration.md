---
id: document-intelligence-poc-migration
title: Migración del POC operativo de Document Intelligence desde VitaBlue
status: planned
created: 2026-09-05
updated: 2026-09-06
owner: ai-platform
lead: null
branch: loopdev-io-document-intelligence-migration
branches: []
phase: 0
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
operativo validado en VitaBlue —subida temporal, preparación/preview, extracción server-side con
Gemini, resultados normalizados nullables, revisión/edición manual, validación local, errores
recuperables, visibilidad de uso/coste y cleanup— sobre la shell de plataforma, los contratos de
`@loopdev/contracts` y las convenciones de tenancy y accesibilidad de LoopDev, ejecutable de punta
a punta con fixtures antes de conectar el provider real.

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

### Incluido

- Track de migración con decisiones, contratos, fases, dependencias, riesgos y rollout/rollback
  (este documento, Fase 0).
- Extensión de los contratos tenant-aware en `packages/contracts/src/documents` para extracción de
  documentos de identidad (tipos de documento, campos nullables normalizados, request/response de
  extracción, validaciones y uso/coste), sin romper los esquemas existentes.
- Fixtures que cubren el flujo completo preparation → processing → review antes de conectar el
  provider.
- Edge Function `extract-identity-document` equivalente: auth por sesión, storage temporal con
  cleanup garantizado, Gemini server-side, errores recuperables tipados y telemetría de uso/coste.
- Workbench nativo en `apps/loopdev-os` como nueva suite `document-intelligence` con `SuiteShell`,
  zonas obligatorias de Platform Shell y recipe canónico, con composiciones desktop, tablet y
  mobile aprobadas visualmente.
- Validación local: normalización de formato más las reglas deterministas actuales del POC
  (checksums DNI/NIE, caducidad, coherencia MRZ, mayoría de edad) como validación fija no
  configurable.
- Tipos de documento validados hoy: pasaporte, DNI español, NIE español e ID nacional genérico
  donde aplique.

### Excluido

- Esquemas de documento configurables.
- Motor de reglas deterministas o semánticas configurable.
- Autenticidad, fraude, liveness o verificación legal.
- Procesamiento por lotes e historial permanente de extracciones.
- Historial local (localStorage en VitaBlue) y perfiles de exportación; quedan documentados como
  frontera de consumidor futuro (p. ej. Marketing Studio).
- Integración con Marketing Studio más allá de definir la frontera de consumo futura.
- Ciclo de vida completo de Document Intelligence Core (retención, auditoría, versionado de
  documento) más allá del intake temporal seguro necesario para el flujo operativo.
- Copia de la shell de backoffice de VitaBlue, sus rutas o sus componentes.

## Decisiones aprobadas

| Fecha | Decisión | Motivo | Impacto | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-09-05 | Migrar el flujo operativo actual del POC, no el producto completo de VitaBlue. | El issue #176 limita la primera entrega al flujo validado. | Hub, perfiles, reglas configurables e historiales quedan fuera y se documentan como frontera futura. | Usuario (solicitud explícita) |
| 2026-09-05 | Migrar las reglas deterministas actuales (checksums DNI/NIE, caducidad, coherencia MRZ, mayoría de edad) como validación fija no configurable. | El issue incluye validación local pero excluye el motor configurable. | Las reglas viajan como código fijo con tests; el motor configurable queda diferido. | Usuario (selección en planificación) |
| 2026-09-05 | Excluir historial de extracciones y perfiles de exportación de la primera entrega. | El issue excluye historial permanente y no menciona exportación. | Se documentan como frontera de consumidor futuro; no hay persistencia de identidad por defecto. | Usuario (selección en planificación) |
| 2026-09-05 | Registrar el workbench como nueva suite `document-intelligence` en `apps/loopdev-os`, owner `ai-platform`. | No existe aún una suite AI Platform y el issue exige workbench nativo sobre la shell de plataforma. | Se usa `SuiteShell` y recipe canónico; no se crea navegación paralela ni se copia el backoffice de VitaBlue. | Usuario (selección en planificación) |
| 2026-09-05 | Mantener Gemini server-side tras una Edge Function de Supabase con credenciales solo en servidor. | Requisito explícito del issue y práctica validada en el POC. | Ninguna credencial de provider ni documento fuente llega al cliente; el contrato de la función es la única frontera. | Usuario (solicitud explícita en issue) |
| 2026-09-05 | Recipe canónico del workbench: `RecordWorkspace` (canvas mode `workspace`). El área principal combina documento-preview y revisión; el inspector contextual muestra estado, validación y uso/coste. Responsive: inspector como overlay en tablet y región única en móvil. | El flujo operativo es un registro/proceso activo con entidad principal (documento en revisión) y contexto lateral; encaja con el recipe `RecordWorkspace` del inventario de modos de Platform Shell. | Gate de la implementación visual: la Fase 0 solo se cierra con esta composición; la Fase 3 implementa exactamente esta estructura y sus transformaciones responsive. | Usuario (aprobación explícita vía sesión Migración Backoffice) |
| 2026-09-06 | Launchpad reutiliza `SuiteSidebar` en modo `rail` para mostrar las capabilities declaradas por `PlatformToolEntry`; no existe un rail transversal paralelo. | La navegación y su control de colapso permanecen en el renderer canónico de Platform Shell. El acceso se filtra por `state` y `requiredPermission` antes de construir el schema de Launchpad. | Se retira el renderer independiente y el slot específico de `AppShell`; `SuiteSidebar` queda como única superficie de navegación. La ruta inicial es `/document-intelligence`; Gemini/backend siguen fuera de esta fase. | Usuario (solicitud explícita) |
| 2026-09-06 | Launchpad usa `AppShell` directamente como owner de layout, con `PlatformHeader` en `headerSlot` y `SuiteSidebar` en `navSlot`; no se formaliza como suite mediante `SuiteRuntime`. | Launchpad es una landing de plataforma sin módulo activo ni canvas de suite, pero necesita los contratos globales de header, navegación, drawer, foco y scroll. | Se elimina `LaunchpadFrame`, sus widths/heights/footer/drawer/responsive locales y cualquier segundo owner geométrico. `PlatformToolEntry` queda limitado al contrato de capabilities. | Usuario (implementación aprobada de la auditoría comparativa) |

## Arquitectura y contratos

### Fronteras

- **UI (suite `document-intelligence` en `apps/loopdev-os`)**: estados `preparation`, `processing`,
  `review`, `review-with-warnings` y `error` con acciones de recuperación (reintentar, cambiar
  documento, extraer nuevo). Composición sobre `SuiteShell` con las zonas obligatorias
  `PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel` y `SuiteCanvas`. El recipe canónico
  aprobado es `RecordWorkspace` (canvas mode `workspace`): el área principal combina
  documento-preview y revisión; el inspector contextual (zona `PlatformContextPanel`) muestra
  estado, validación y uso/coste; en tablet el inspector pasa a overlay y en móvil la composición
  colapsa a región única.
- **Servicio**: subida temporal a storage privado con path namespaced por tenant/usuario,
  invocación de la Edge Function y cleanup garantizado en `finally`, también en error.
- **Provider**: Edge Function `extract-identity-document`. Credenciales (`GEMINI_API_KEY`) solo
  server-side; auth por sesión; validación de referencias de documento contra el actor autenticado;
  `responseSchema` JSON estricto; normalización de fechas y bounding boxes en servidor.

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
`DocumentPreviewPane`, `ExtractionReviewForm`, `ValidationSummaryList`, `UsageCostPanel`,
`WorkbenchInspector`.

Gaps que requieren componente nuevo o extensión en Fase 3 (detalle en la especificación de
composición): dropzone con allowlist MIME (G1), visor documental zoom/rotate/crop/PDF (G2),
stepper de progreso (G3), `Tabs` compartido (G4), input de fecha `DD/MM/YYYY` (G5) y
presentación overlay del `ModuleContextPanel` en tablet (G6, requiere revisión con
`platform-shell`; prohibido mutar el shell desde la suite).

## Branch strategy

`branch: loopdev-io-document-intelligence-migration` para el track (Fase 0). Las fases de
implementación crearán ramas propias siguiendo `git-workflow` y se registrarán en `branches`.

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
- [x] Este track en `tracks/planned/ai-platform/`.
- [x] Especificación de composición de la suite (desktop/tablet/mobile):
      `docs/06-product/document-intelligence/workbench-composition.md`.
- [x] Prototipo navegable guiado por fixtures en `apps/loopdev-os` (rutas `/document-intelligence`
      y `/document-intelligence/workbench`), sin provider real ni lógica migrada de VitaBlue.
- [x] Contrato `PlatformToolEntry`, `SuiteSidebar` colapsado por defecto y registro inicial de
      Document Intelligence en Launchpad, sin duplicar shells ni alterar la suite.
- [ ] Aprobación visual explícita del prototipo por el usuario (gate para Fase 3).

**Validación**
- [x] `node scripts/tracks/validate-tracks.mjs` sin errores.
- [x] Typecheck de `loopdev-os`, eslint de la suite y smoke de rutas con `next dev` (HTTP 200).
- [x] `pnpm test:shell:changed` (sin cambios en la superficie de la shell; solo consumo).
- [x] `pnpm registries:check` tras registrar los componentes del prototipo como `experimental`.
- [x] Typecheck/build focalizados de `@loopdev/contracts` y `@loopdev/ui`, incluyendo
      `SuiteSidebar` y su layout footer/lista.
- [x] Tests focalizados de `SuiteSidebar` y filtrado de permisos/estado.
- [ ] Revisión visual del prototipo (último gate de la fase, pendiente del usuario).

**Evidencia:** Pendiente.

**Estado:** en progreso

### Fase 1: Contratos y fixtures

**Objetivo:** Extender `packages/contracts/src/documents` con los contratos de extracción de
identidad y disponer de fixtures que cubran el flujo completo sin provider.

**Definition of Ready**
- [ ] Fase 0 cerrada con composición aprobada.

**Entregables**
- [ ] Esquemas `IdentityDocumentType`, `IdentityDocumentFields`, `DocumentExtractionRequest`,
      `DocumentExtractionResult` y errores tipados, con tests de contrato.
- [ ] Fixtures por tipo de documento (passport, DNI, NIE, ID genérico) que cubren éxito, éxito con
      warnings y errores recuperables.

**Validación**
- [ ] Tests de contratos en `packages/contracts` verdes.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 2: Servicio de extracción server-side

**Objetivo:** Edge Function `extract-identity-document` tenant-scoped, segura, recuperable y con
telemetría de uso/coste, más el servicio cliente de upload/cleanup.

**Definition of Ready**
- [ ] Contratos de Fase 1 mergeados.

**Entregables**
- [ ] Edge Function con auth por sesión, validación de referencias por actor, allowlist MIME,
      límites de tamaño, Gemini server-side y normalización de salida.
- [ ] Servicio cliente: upload temporal namespaced, invocación y cleanup garantizado en `finally`.
- [ ] Tests enfocados del servicio y de la función (éxito, warnings, errores 400/401/404/413/415/
      502/503).

**Validación**
- [ ] Suite de tests enfocada verde.
- [ ] Revisión con skill `security-review` (aislamiento por organización, secretos, storage
      temporal).

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 3: Workbench nativo

**Objetivo:** Suite `document-intelligence` en `apps/loopdev-os` con el flujo completo sobre
fixtures y provider real conmutable.

**Definition of Ready**
- [ ] Fases 1 y 2 cerradas.

**Entregables**
- [ ] Suite registrada con `SuiteShell`, zonas obligatorias y recipe canónico documentado.
- [ ] Estados `preparation`, `processing`, `review`, `review-with-warnings` y `error` con acciones
      de recuperación, revisión/edición manual y visibilidad de uso/coste.
- [ ] Composiciones desktop, tablet y mobile aprobadas visualmente antes de Playwright.

**Validación**
- [ ] `pnpm test:shell:changed` durante desarrollo y `pnpm test:shell` antes del commit.
- [ ] Flujo completo preparation → processing → review guiado por fixtures.

**Evidencia:** Pendiente.

**Estado:** pendiente

### Fase 4: Validación integral y rollout

**Objetivo:** Cerrar el track con validación completa, rollout por flag y rollback definido.

**Entregables**
- [ ] `pnpm validate:ci` verde.
- [ ] Feature flag por tenant para activar el workbench; fixtures como fallback operativo.
- [ ] Rollback documentado: desactivar flag y función; sin datos persistidos que migrar.

**Validación**
- [ ] `pnpm validate:ci`.
- [ ] Evidencia de rollout/rollback registrada en este track.

**Evidencia:** Pendiente.

**Estado:** pendiente

## Registro de cambios de enfoque

| Fecha | Cambio | Motivo | Impacto en alcance/fases | Aprobado por |
| --- | --- | --- | --- | --- |
| 2026-09-06 | Se adelanta en Fase 0 la infraestructura transversal mínima de capabilities sobre `SuiteSidebar`. | El workbench necesita un punto de entrada de plataforma sin convertirse en navegación paralela de suite. | Se limita a contrato, schema derivado, filtrado consumidor y ruta fixture; no inicia Fase 1-3 ni integra provider. | Usuario (solicitud explícita) |

## Riesgos y bloqueos

| Riesgo o bloqueo | Impacto | Mitigación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| Credenciales de Gemini mal gestionadas | Exposición de PII y coste no controlado | Credenciales solo server-side; revisión `security-review` en Fase 2 | ai-platform | Abierto |
| PII en storage temporal | Fuga de datos de identidad | Bucket privado, path por actor, cleanup en `finally`, sin persistencia por defecto | ai-platform | Abierto |
| Deriva de la shell de plataforma | Composición fuera de estándar | Recipe canónico aprobado en Fase 0; `pnpm test:shell` en Fase 3 | platform | Abierto |
| Divergencia fixture/provider | El flujo con fixtures no predice el real | Contrato único `DocumentExtractionResult` para ambos providers; tests de contrato | ai-platform | Abierto |
| Coste por run sin visibilidad | Gasto no atribuible | Telemetría `usage` obligatoria en el contrato y visible en el workbench | ai-platform | Abierto |

## Criterios de cierre

- [ ] Outcome verificable cumplido.
- [ ] Fases requeridas cerradas o diferidas explícitamente.
- [ ] Validaciones ejecutadas con evidencia.
- [ ] Riesgos residuales documentados.
- [ ] Cierre aprobado explícitamente por el usuario.

## Evidencia de validación

| Fecha | Validación | Resultado | Referencia |
| --- | --- | --- | --- |
| 2026-09-05 | `node scripts/tracks/validate-tracks.mjs` + dashboard | ✅ | tracks/README.md |
| 2026-09-05 | Typecheck `loopdev-os` (`tsc --noEmit`) | ✅ | suites/document-intelligence, app/document-intelligence |
| 2026-09-05 | eslint de la suite y rutas nuevas | ✅ (0 errores, 0 warnings) | apps/loopdev-os |
| 2026-09-05 | Smoke `next dev`: `/document-intelligence` y `/document-intelligence/workbench` | ✅ HTTP 200, compilación limpia | requiere sesión para el contenido, igual que el resto de la app |
| 2026-09-05 | `pnpm test:shell:changed` | ✅ sin cambios en superficie shell | scripts/check-shell.mjs |
| 2026-09-05 | `pnpm registries:check` | ✅ | docs/registries/frontend-components.json (+6 entradas experimental) |
| 2026-09-06 | `pnpm --filter @loopdev/contracts build` + typecheck `@loopdev/ui` | ✅ | `PlatformToolEntry`, `SuiteSidebar`, Launchpad |
| 2026-09-06 | Tests focalizados `SuiteSidebar` + filtrado de capabilities | ✅ | `ds/packages/ui/src/components/composites/shell/SuiteSidebar` |
| 2026-09-06 | Auditoría comparativa Launchpad vs suites certificadas | ✅ | Matriz de paridad: Launchpad debía retirar `LaunchpadFrame` y usar el owner canónico `AppShell` |
| 2026-09-06 | Launchpad conectado directamente a `AppShell` con `PlatformHeader`/`SuiteSidebar` en slots | ✅ | `apps/loopdev-os/src/components/layout/LaunchpadShell.tsx`; `LaunchpadShell.test.tsx` |
| 2026-09-06 | `SuiteSidebar.showSuiteHome` configurable; Launchpad oculta solo el dashboard entry | ✅ | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx` |
| 2026-09-06 | Footer del sidebar en flujo flex al fondo y responsive gestionado por `AppShell` | ✅ | `SuiteSidebar.test.tsx`; `LaunchpadShell.test.tsx`; `AppShell` canonical wiring |
| 2026-09-06 | Eliminado el propietario geométrico local `LaunchpadFrame` y su footer/drawer/responsive paralelo | ✅ | `LaunchpadShell.tsx`; registry frontend regenerado |
| 2026-09-06 | Corrección del content layer certificado de `TechnicalSurface` para preservar altura completa en `SuiteSidebar` | ✅ | `TechnicalSurface.test.tsx`; `SuiteSidebar.test.tsx` |
| 2026-09-06 | Launchpad conserva rail con iconos en desktop y fuerza `SuiteSidebar` expandido con `headerSlot` contextual en tablet/móvil | ✅ | `LaunchpadShell.tsx`; `SuiteSidebar` API; `LaunchpadShell.test.tsx` |

## Handoff de sesión

Actualizar al finalizar una sesión de implementación. Es un resumen breve y reemplazable: no duplica
la especificación, el historial de Git ni la conversación.

- **Fecha:** Pendiente.
- **Rama de continuación:** Pendiente.
- **Commit de partida:** Pendiente.
- **Estado alcanzado:** Pendiente.
- **Decisiones, bloqueos y riesgos:** Pendiente.
- **Validación ejecutada:** Pendiente.
- **Siguiente acción concreta:** Pendiente.

## Cierre

Pendiente de aprobación explícita.
