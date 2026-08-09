# Track: Marketing Studio multi-tenant para LoopDev

**Fecha:** 2026-08-09  
**Estado:** Propuesto — ejecución offline-first; inventario VitaBlue completado  
**Dependencia:** Fase 8 del track `2026-08-05-loopdev-saas-platform-upgrade.md`  
**Origen funcional:** módulo `marketing-studio` y backoffice protegido de VitaBlue

## Objetivo

Convertir Marketing Studio en una suite SaaS multi-tenant, reutilizable por varias organizaciones, marcas y workspaces dentro de LoopDev. La primera entrega debe trasladar el vertical slice funcional existente en VitaBlue y sustituir sus límites de prototipo por contratos, persistencia, permisos y servicios server-side canónicos.

Marketing Studio será la fuente de verdad de marketing de LoopDev. VitaBlue aporta dominio, flujos, copy, presets visuales y evidencia funcional; no se mantendrá una segunda implementación autoritativa en VitaBlue.

## Evidencia funcional de VitaBlue

El backoffice de VitaBlue ya contiene una primera implementación operativa, protegida por autenticación y roles (`admin`, `editor`, `viewer`). Las superficies identificadas son:

- **Identidad de marca:** panel de identidad, colores, logos, tipografías y reglas.
- **Perfiles sociales:** configuración y visualización de perfiles para Facebook, Instagram, TikTok, YouTube, LinkedIn y X.
- **Campañas:** creación, edición, estados, objetivo, fecha, plataformas, tipos de contenido, copies y assets.
- **Workspace de contenido:** selector de formatos, editor de assets, previews por canal y exportación de piezas.
- **Generador social inicial:** formatos 1:1 y 9:16, temas, ilustraciones, badge, título, subtítulo, CTA de WhatsApp y exportación PNG.
- **Conexiones:** OAuth para proveedores sociales, callback server-side, desconexión y metadatos de cuenta.
- **Persistencia inicial:** tablas `marketing_campaigns`, `social_profiles` y `oauth_connections`, con RLS y funciones de roles.
- **Sincronización híbrida:** Supabase como persistencia y `localStorage` como fallback/cache local.

Este inventario define el punto de partida funcional, pero no convierte las decisiones técnicas de VitaBlue en contratos de LoopDev.

## Principios de migración

1. LoopDev es la implementación canónica; VitaBlue queda como fuente de conocimiento y migración.
2. La organización, el workspace y la marca son límites de autorización y pertenencia de datos.
3. `localStorage` puede conservarse como cache no autoritativa, nunca como fuente de verdad.
4. Ningún access token, refresh token, client secret o credencial de proveedor llega al navegador.
5. Las operaciones de publicación, OAuth y proveedores se ejecutan server-side.
6. Brand Hub es la fuente de identidad publicada para Content Engine, Campaign Orchestrator y Compliance.
7. La generación asistida no publica ni ejecuta acciones de impacto sin aprobación humana.
8. Toda migración debe ser aditiva, reversible y verificable mediante contratos, RLS y pruebas de aislamiento.

## Restricción operativa y arquitectura offline-first

El ordenador de desarrollo actual no tiene conectividad con Supabase. Esto no bloquea la construcción de la experiencia ni del dominio, pero impide ejecutar validaciones remotas de base de datos, RLS, Storage, Edge Functions y OAuth real. La restricción queda formalizada en este track para evitar que una pantalla nueva dependa accidentalmente de una red disponible.

### Regla de separación

```text
UI Marketing Studio
	|
	v
@loopdev/contracts + servicios de dominio
	|
	v
MarketingRepository / adaptadores server-side
	|
	+--> InMemoryMarketingRepository  <- desarrollo local y tests
	+--> SupabaseMarketingRepository  <- CI/entorno autorizado posterior
```

- La UI no importa `@supabase/supabase-js` ni conoce tablas, RLS o nombres de columnas.
- Los servicios reciben un contexto explícito con `organizationId`, `workspaceId`, `brandId`, usuario y permisos.
- La persistencia se consume mediante interfaces de repositorio y comandos tipados.
- `InMemoryMarketingRepository` será determinista, sustituible y exclusivo de desarrollo/tests.
- `SupabaseMarketingRepository` se implementará detrás de la misma interfaz cuando exista conectividad autorizada.
- `localStorage` solo podrá actuar como cache explícita; nunca será fuente autoritativa ni fallback silencioso de producción.

### Fixtures offline obligatorios

Los fixtures deben simular dos organizaciones independientes, varias marcas y workspaces por organización, usuarios `admin`, `editor` y `viewer`, campañas, assets, versiones de marca, conexiones simuladas, aprobaciones y estados de error o acceso denegado.

También deben cubrir intentos de lectura o escritura cruzada entre organizaciones, marcas y workspaces. Deben llevar identificadores y contratos estables, no parecer datos productivos y no ocultar errores de red.

### Qué queda bloqueado hasta CI o entorno autorizado

- aplicar o validar migraciones Supabase;
- ejecutar RLS real y pruebas contra dos organizaciones remotas;
- generar tipos desde el esquema remoto;
- usar Storage, URLs firmadas, Vault o Edge Functions desplegadas;
- ejecutar OAuth real, publicación en redes o webhooks externos;
- importar datos reales desde VitaBlue.

Estas tareas se preparan con contratos, migraciones revisables y tests locales, pero se ejecutan únicamente en CI o en un entorno con conectividad y secretos autorizados.

### Protocolo obligatorio para cambios de base de datos

Antes de implementar una funcionalidad que pueda requerir persistencia, se debe indicar explícitamente en el cambio:

- **¿Requiere cambio de esquema?** tablas, columnas, constraints, índices o funciones.
- **¿Requiere cambio de RLS?** políticas, funciones de autorización o permisos.
- **¿Requiere Storage?** buckets, objetos, URLs firmadas o retención.
- **¿Requiere secretos o proveedor externo?** Vault, OAuth, Edge Functions o webhooks.
- **¿Qué se puede validar offline?** contratos, dominio, repositorio en memoria, UI y tests.
- **¿Qué queda pendiente?** migración, generación de tipos, RLS real, Storage o integración externa.

Cuando una tarea requiera base de datos, primero se crearán los contratos y el adaptador offline. La migración SQL, el cambio RLS y la prueba remota se documentarán como entregables separados y bloqueados hasta CI o un entorno autorizado. Ninguna prueba local con fixtures se presentará como evidencia de seguridad de base de datos.

Cada PR que introduzca una dependencia futura de base de datos debe incluir una sección `Database impact` con este estado:

```text
Schema: none | planned | required
RLS: none | planned | required
Storage: none | planned | required
Secrets/external providers: none | planned | required
Offline validation: ...
Blocked validation: ...
```

## Alcance de la suite

### Suite Dashboard

- Resumen de campañas, contenido pendiente, conexiones y tareas de aprobación.
- Métricas agregadas únicamente de datos autorizados del workspace activo.
- Estados vacíos y errores operativos explícitos; no fixtures silenciosos en producción.

### Brand Hub

- Identidad, colores, tipografías, logos, voz, tono, claims y reglas.
- Versiones publicadas e historial de cambios.
- Contexto de marca consumible por el resto de Marketing Studio mediante contrato único.

### Asset Manager

- Assets originales y derivados.
- Tags, colecciones, variantes, dimensiones, formatos, derechos y procedencia.
- Storage privado con URLs firmadas y metadatos persistentes.

### Content Engine

- Briefs, piezas, copies, plantillas, versiones y estados de revisión.
- Generación asistida basada en el contexto de marca publicado.
- Exportación de formatos sociales sin acoplar la UI a un proveedor LLM.

### Campaign Orchestrator

- Campañas, objetivos, audiencias, canales, contenidos, assets, calendario y UTM.
- Estados de borrador, revisión, aprobación, programación, publicación y archivado.
- Atribución conectable con CRM sin duplicar la fuente de leads.

### Integrations

- Conexiones de proveedores sociales por organización y marca.
- OAuth con state/PKCE, allowlist de redirect y secretos server-side.
- Estados de conexión, scopes, expiración, desconexión y auditoría.

### Insights & Intel

- Métricas normalizadas por campaña, canal y publicación.
- Atribución y embudos con origen verificable.
- Sin presentar métricas sintéticas como datos reales.

### Growth Ops

- Hipótesis, experimentos, variantes, métricas, iniciativas y tareas.
- Registro de decisiones y resultados.

### Advisor System

- Recomendaciones con evidencia, nivel de confianza, feedback y aprobación.
- Sin acciones autónomas de publicación, gasto o cambio de campaña.

### Compliance

- Políticas, reglas, checks, hallazgos, revisiones, aprobaciones y evidencias.
- Aplicación por organización, marca, canal y tipo de contenido.

## Inventario de superficies y estado actual

La primera revisión del código de LoopDev muestra que la Fase 8 no parte de una aplicación vacía. El trabajo debe completar y conectar capacidades existentes, no duplicarlas.

| Superficie | Estado en LoopDev | Decisión para Fase 8A |
| --- | --- | --- |
| Marketing Studio shell y navegación | Existe en `apps/loopdev-os/src/app/marketing-studio` | Reutilizar shell, `ModuleWorkspace` y rutas existentes. |
| Brand Hub | Existe con overview, marcas, identidad, colores, logos, tipografía y reglas | Reutilizar UI y `BrandContextSnapshot`; documentar fixtures y límites de persistencia. |
| Campaign Orchestrator | Existe pantalla, hook, API y servicio server-side con organización/workspace | No reconstruir; cubrir con repositorio offline y ampliar contratos solo cuando llegue la migración oficial. |
| Content Engine | Ruta y capacidades parciales existentes | Inventariar estados y conectar posteriormente al repositorio común. |
| Asset Manager / DAM | Ruta prevista en el shell, sin flujo persistente completo | Definir contrato y proveedor local, sin Storage remoto. |
| Integrations | No es un flujo completo en LoopDev | Preparar estados simulados y contrato; OAuth real queda bloqueado. |
| Insights, Growth, Advisor y Compliance | Roadmap, fixtures o capacidades parciales | Separar métricas sintéticas de datos reales y entregar por incrementos. |

### Inventario de rutas y flujos

- [ ] Revisar `/marketing-studio` y estados del dashboard.
- [ ] Revisar `/marketing-studio/brand-hub`, `/brands` y las vistas por `brandId`.
- [ ] Revisar `/marketing-studio/campaigns` y sus estados de carga, error, vacío y creación.
- [ ] Revisar rutas previstas de `/marketing-studio/content` y `/marketing-studio/dam`.
- [ ] Registrar rutas no implementadas o con fixtures antes de conectarlas a datos.
- [ ] Mapear los flujos funcionales de VitaBlue a superficies existentes de LoopDev.

## Matriz de permisos y aislamiento

La autorización debe verificarse en tres capas: navegación/UI para experiencia, servicios server-side para control de comandos y RLS para la barrera definitiva cuando exista conectividad. La capa offline prueba el comportamiento esperado, pero no sustituye RLS.

| Acción | Viewer | Editor | Admin | Scope obligatorio |
| --- | --- | --- | --- | --- |
| Ver dashboard, marcas y campañas | Sí | Sí | Sí | organización + workspace |
| Ver contexto de marca publicado | Sí | Sí | Sí | organización + marca |
| Crear o editar contenido | No | Sí | Sí | organización + workspace + marca |
| Crear o editar campaña | No | Sí | Sí | organización + workspace + marca |
| Aprobar contenido o campaña | No | Según permiso explícito | Sí | organización + workspace + marca |
| Gestionar conexiones | No | Según permiso explícito | Sí | organización + marca |
| Publicar en proveedor externo | No | Según permiso explícito | Sí | organización + workspace + marca |
| Gestionar configuración y políticas | No | No | Sí | organización |

### Casos negativos obligatorios

- [ ] Una organización no puede leer marcas, campañas o assets de otra organización.
- [ ] Un workspace no puede leer campañas de otro workspace de la misma organización si no existe autorización explícita.
- [ ] Una marca no puede consumir un `BrandContextSnapshot` perteneciente a otra organización.
- [ ] Un viewer no puede ejecutar comandos de creación, edición, aprobación o publicación.
- [ ] Un editor no puede ejecutar acciones reservadas a administración.
- [ ] Un contexto inválido o incompleto devuelve un error tipado, no una lista global.
- [ ] La ausencia de red no convierte fixtures en datos autoritativos de producción.

## Mapa de fixtures y escenarios offline

Este mapa se implementará después de recibir la migración oficial de contratos. Mientras tanto fija los casos de comportamiento sin inventar nombres de entidades ni esquemas alternativos.

### Contextos base

| Contexto | Organización | Marca | Workspace | Usuario | Rol |
| --- | --- | --- | --- | --- | --- |
| `vitablue-admin` | VitaBlue | VitaBlue Salud | Marketing Principal | `user-vb-admin` | admin |
| `vitablue-editor` | VitaBlue | VitaBlue Salud | Marketing Principal | `user-vb-editor` | editor |
| `vitablue-viewer` | VitaBlue | VitaBlue Salud | Marketing Principal | `user-vb-viewer` | viewer |
| `protege-admin` | Protege tu Salud | Protege Salud | Marketing Principal | `user-pts-admin` | admin |
| `protege-editor` | Protege tu Salud | Protege Salud | Marketing Principal | `user-pts-editor` | editor |
| `no-membership` | VitaBlue | VitaBlue Salud | Marketing Principal | `user-no-member` | sin membresía |
| `pending-membership` | VitaBlue | VitaBlue Salud | Marketing Principal | `user-pending` | membresía pendiente |

Cada organización tendrá al menos una segunda marca y un segundo workspace para probar que el aislamiento no depende únicamente del identificador de marca.

### Datos mínimos por contexto

- un `BrandContextSnapshot` publicado y una versión no publicada;
- una campaña en borrador y otra aprobada;
- un asset original y una variante derivada;
- una pieza pendiente de revisión;
- una conexión social simulada con estado `connected` y otra `expired`;
- una aprobación aceptada y otra rechazada;
- un evento de auditoría de lectura y otro de modificación.

### Escenarios de lectura

| Caso | Actor | Operación | Resultado esperado |
| --- | --- | --- | --- |
| Lectura propia | `vitablue-viewer` | Listar campañas del workspace activo | Devuelve solo campañas de VitaBlue y ese workspace. |
| Lectura cruzada de organización | `vitablue-viewer` | Solicitar campañas de Protege tu Salud | Rechazo tipado o colección vacía; nunca datos de la otra organización. |
| Lectura cruzada de workspace | `vitablue-editor` | Solicitar campañas de otro workspace | Rechazo si no existe scope explícito. |
| Contexto de marca ajeno | `vitablue-editor` | Obtener snapshot de marca Protege Salud | Rechazo tipado. |
| Sin membresía | `no-membership` | Abrir Marketing Studio | Estado sin acceso y ninguna lectura de datos. |
| Membresía pendiente | `pending-membership` | Abrir Campaign Orchestrator | Estado de membresía pendiente y ninguna lectura de datos. |

### Escenarios de comandos

| Caso | Actor | Comando | Resultado esperado |
| --- | --- | --- | --- |
| Crear campaña | `vitablue-editor` | Crear campaña en su workspace | Éxito, scope conservado y auditoría creada. |
| Editar campaña | `vitablue-editor` | Editar campaña propia | Éxito si permanece dentro de organización, marca y workspace autorizados. |
| Editar como viewer | `vitablue-viewer` | Cambiar nombre o estado | Rechazo de permiso sin mutación. |
| Aprobar contenido | `vitablue-editor` | Aprobar pieza | Solo éxito si el permiso de aprobación está concedido explícitamente. |
| Administrar conexión | `vitablue-editor` | Crear o revocar conexión | Rechazo si la política reserva la acción a admin. |
| Administrar conexión | `vitablue-admin` | Crear o revocar conexión simulada | Éxito, sin guardar tokens y con auditoría. |
| Mutación cruzada | `vitablue-admin` | Modificar campaña de Protege tu Salud | Rechazo aunque el payload contenga un ID válido. |

### Estados de UI que deben poder reproducirse sin red

- carga inicial;
- datos disponibles;
- colección vacía;
- error de repositorio;
- sin acceso;
- membresía pendiente;
- sesión expirada;
- comando rechazado por permisos;
- conflicto de versión;
- conexión externa expirada.

### Entrega posterior a la migración de contratos

- [ ] Sustituir los identificadores provisionales por IDs y enums de `@loopdev/contracts`.
- [ ] Implementar fixtures deterministas en el repositorio offline.
- [ ] Convertir cada fila de las tablas anteriores en un test de repositorio o servicio.
- [ ] Añadir pruebas de no mutación cuando una autorización falla.
- [ ] Añadir pruebas de auditoría para comandos aceptados y rechazados.
- [ ] Marcar como bloqueadas las pruebas de RLS real hasta CI o entorno autorizado.

## Criterios de aceptación del inventario

- [ ] Cada ruta de Marketing Studio tiene módulo, scope, estado de datos y estado de permisos documentados.
- [ ] Cada flujo heredado de VitaBlue tiene una superficie destino en LoopDev o una decisión explícita de descarte.
- [ ] Las capacidades existentes de Brand Hub y campañas se reutilizan en lugar de duplicarse.
- [ ] Las funciones nuevas consumen contratos y repositorios, no tablas directamente.
- [ ] Los estados de UI se pueden probar sin Supabase ni secretos.
- [ ] La matriz de permisos cubre navegación, lectura, comandos y futuras acciones externas.

## Plan de fases

### Fase 8A — Contratos y mapa de migración

- [ ] Inventariar las rutas, componentes, modelos y flujos de VitaBlue.
- [ ] Definir contratos Zod en `@loopdev/contracts` para Brand Hub, assets, campaigns, content, connections y approvals.
- [ ] Definir `MarketingRepository` y comandos/lecturas independientes del proveedor de persistencia.
- [ ] Implementar `InMemoryMarketingRepository` con fixtures multi-tenant deterministas.
- [ ] Implementar autorización de dominio para organización, workspace, marca y rol.
- [ ] Mapear `Campaign`, `CampaignAsset`, perfiles sociales, conexiones y generador de contenido a contratos agnósticos.
- [ ] Definir estados, comandos, lecturas y errores de cada módulo.
- [ ] Definir estrategia de importación de campañas, perfiles, assets y metadatos de VitaBlue.
- [ ] Documentar campos sin equivalente y decisiones de descarte.
- [ ] Añadir tests de aislamiento y permisos sin requerir Supabase.

**Salida:** contrato compartido y mapa de migración aprobados antes de ampliar la persistencia.

### Fase 8B — Brand Hub y contexto publicado

- [ ] Consolidar Brand Hub como fuente de verdad de identidad.
- [ ] Exponer un `BrandContextSnapshot` versionado.
- [ ] Implementar lectura y publicación contra el repositorio en memoria.
- [ ] Implementar publicación, rollback lógico e historial.
- [ ] Conectar identidad, logos, colores, tipografía, voz, claims y reglas.
- [ ] Impedir que Content Engine o Campaign Orchestrator lean JSONB disperso directamente.
- [ ] Preparar migración y políticas RLS por organización y workspace, con alcance de marca cuando corresponda.
- [ ] Validar localmente la misma frontera mediante tests negativos del repositorio.
- [ ] Migrar los casos funcionales de VitaBlue sin copiar la navegación ni el shell.

**Salida:** una marca puede publicar un contexto consumible por el resto de la suite y otra organización no puede consultarlo.

### Fase 8C — Asset Manager y Content Engine MVP

- [ ] Crear persistencia de assets, variantes, formatos, tags y colecciones.
- [ ] Definir el contrato de Storage y un proveedor local de archivos/fixtures.
- [ ] Preparar Storage privado y URLs firmadas para CI/entorno autorizado.
- [ ] Migrar el generador social inicial de VitaBlue como capacidad de exportación.
- [ ] Soportar formatos 1:1, 9:16 y banners mediante presets configurables.
- [ ] Crear briefs, piezas, copies y versiones con revisión humana.
- [ ] Conectar el contenido al `BrandContextSnapshot` publicado.
- [ ] Mantener la generación asistida sin proveedores LLM obligatorios.
- [ ] Añadir tests de contratos, permisos, exportación y límites de tamaño.

**Salida:** un editor puede crear y exportar una pieza de marca sin usar fixtures autoritativos ni exponer secretos.

### Fase 8D — Campaign Orchestrator

- [ ] Persistir campañas, objetivos, canales, contenido, assets, fechas y UTM en el repositorio local sustituible.
- [ ] Preparar el esquema persistente multi-tenant y sus constraints para integración posterior.
- [ ] Migrar las capacidades de VitaBlue de creación, edición, estados, copies y previews.
- [ ] Añadir revisión y aprobación antes de programación o publicación.
- [ ] Resolver la identidad publicada de marca por versión.
- [ ] Integrar atribución con CRM mediante contratos, sin duplicar leads.
- [ ] Preparar programación y publicación como comandos server-side idempotentes.
- [ ] Cubrir creación, edición, aprobación y aislamiento con Playwright.

**Salida:** una campaña completa puede pasar de borrador a aprobada con historial y atribución verificables.

### Fase 8E — Integrations y publicación controlada

- [ ] Migrar el contrato de conexiones OAuth de VitaBlue a servicios server-side de LoopDev.
- [ ] Implementar estados y callbacks simulados sin credenciales ni proveedores reales.
- [ ] Preparar Edge Functions, Vault y OAuth real para CI/entorno autorizado.
- [ ] Gestionar proveedores por organización, marca y workspace.
- [ ] Implementar state/PKCE, expiración, scopes, desconexión y auditoría.
- [ ] Guardar únicamente metadatos públicos y referencias a secretos server-side.
- [ ] Añadir comandos de publicación con idempotencia y estados de entrega.
- [ ] Prohibir credenciales de proveedor en el cliente y en logs.
- [ ] Probar permisos de viewer, editor y admin en cada operación.

**Salida:** una conexión puede autorizarse, renovarse y desconectarse sin exponer credenciales ni cruzar organizaciones.

### Fase 8F — Insights, Growth, Advisor y Compliance

- [ ] Crear snapshots de métricas y atribución con origen documentado.
- [ ] Implementar experimentos y variantes auditables.
- [ ] Añadir recomendaciones con evidencia y aprobación humana.
- [ ] Persistir políticas, reglas, checks, hallazgos y revisiones.
- [ ] Añadir estados de bloqueo y excepciones justificadas.
- [ ] Cubrir cada módulo con contratos, RLS, auditoría y pruebas de regresión.

**Salida:** las capacidades avanzadas pueden operar sobre datos persistentes y auditables sin acciones autónomas de impacto.

### Fase 8G — Migración, certificación y retirada del duplicado

- [ ] Preparar el plan y los scripts de migración de VitaBlue con datos anonimizados o autorizados.
- [ ] Ejecutar la migración únicamente en CI o entorno autorizado con conectividad.
- [ ] Verificar conteos, relaciones, marcas, campañas, assets y conexiones.
- [ ] Ejecutar pruebas negativas entre VitaBlue, Protege tu Salud y otras organizaciones.
- [ ] Certificar Desktop Web, Responsive Web, Mobile Web y Mobile Compact según el alcance de cada módulo.
- [ ] Mantener Mobile App fuera de esta certificación web y coordinar su integración mediante contratos.
- [ ] Definir periodo de lectura, cutover y rollback.
- [ ] Retirar la escritura de Marketing Studio en VitaBlue cuando LoopDev sea canónico.
- [ ] Actualizar documentación, matriz de permisos, runbooks y ownership.

**Salida:** LoopDev es la fuente autoritativa de Marketing Studio y VitaBlue deja de mantener una segunda escritura funcional.

## Fuera de alcance inicial

- Migración literal archivo por archivo desde VitaBlue.
- Proveedores LLM obligatorios, workers de generación o selección automática de modelos.
- Publicación masiva sin aprobación humana.
- Automatizaciones autónomas de gasto, anuncios o cambios de campaña.
- Uso de `localStorage` como persistencia principal.
- Importar `@supabase/supabase-js` desde componentes, hooks de UI o fixtures.
- Tokens de proveedores en tablas públicas o variables `VITE_*`.
- Presentar una prueba local como evidencia de RLS, Storage, OAuth o migración real.
- Mezclar WhatsApp/Communications con el modelo interno de campañas; la integración será mediante contratos.
- Certificación funcional de Mobile App dentro de los proyectos Playwright web.

## Dependencias

- Platform Core, organizaciones, membresías, roles y permisos de LoopDev.
- Brand Hub persistente y `BrandContextSnapshot`.
- Design System y `ModuleWorkspace` de Marketing Studio.
- `@loopdev/contracts` y servicios server-side.
- Supabase Storage, migraciones y RLS.
- CRM para atribución y entrada de leads.
- Fase 6C/6D de comunicaciones para cualquier integración con WhatsApp.
- CI con `front:check`, Vitest, Playwright, Axe y snapshots.

La dependencia de Supabase no bloquea las fases 8A-8F en su parte de contratos, dominio, UI, repositorio en memoria y tests locales. Solo bloquea la ejecución real de infraestructura, secretos, proveedores y migración de datos.

## Riesgos y controles

| Riesgo | Control |
| --- | --- |
| Duplicar VitaBlue y LoopDev | LoopDev es la fuente canónica; VitaBlue solo aporta origen y migración. |
| Fuga entre organizaciones o marcas | RLS, filtros server-side, permisos negativos y pruebas con dos organizaciones. |
| Publicar contenido no aprobado | Máquina de estados y comandos server-side con aprobación explícita. |
| Exponer credenciales OAuth | Vault/secret manager, Edge Functions, state/PKCE y auditoría. |
| Métricas falsas por fixtures | Fuente, timestamp, proveedor y estado de sincronización obligatorios. |
| Migración destructiva | Importación aditiva, conteos previos/posteriores, backup y rollback. |
| Alcance excesivo | Entregas 8A-8G con criterios de salida independientes. |
| Acoplamiento accidental a Supabase | Repositorios explícitos, imports prohibidos en UI y tests offline obligatorios. |
| Confundir mocks con seguridad real | Fixtures para comportamiento; RLS, Storage y OAuth real solo en CI o entorno autorizado. |

## Criterios de aceptación del track

- Marketing Studio funciona para al menos dos organizaciones sin mezclar datos.
- Una organización puede tener varias marcas y workspaces con contexto de marca separado.
- Brand Hub publica una versión consumible por contenido y campañas.
- Un editor puede crear una pieza, revisarla y exportarla en formatos sociales.
- Una campaña conserva contenido, assets, canales, UTM, aprobación e historial.
- Las conexiones OAuth no exponen secretos al navegador ni a tablas públicas.
- Viewer, editor y admin tienen permisos verificables y consistentes.
- Insights no presenta fixtures como métricas reales.
- Advisor no ejecuta acciones autónomas de impacto.
- `front:check`, typecheck, tests de contratos, RLS y Playwright pasan para las superficies entregadas.
- Las fases offline entregadas pasan tests sin red y no requieren secretos ni Supabase.
- Las evidencias de RLS, Storage, OAuth y migración están separadas y marcadas como pendientes hasta ejecutarse en CI o entorno autorizado.
- VitaBlue puede migrarse y dejar de ser fuente de escritura sin pérdida de trazabilidad.

## Evidencia de referencia

- `vitablue/marketing-studio/MarketingStudio.tsx`
- `vitablue/marketing-studio/utils/campaigns.ts`
- `vitablue/marketing-studio/utils/connections.ts`
- `vitablue/marketing-studio/SocialGenerator.tsx`
- `vitablue/conductor/tracks/2026-08-04-marketing-studio-access-and-data-security.md`
- `vitablue/supabase/01_schema.sql`
- `vitablue/supabase/06_marketing_auth_roles.sql`
- `vitablue/supabase/08_oauth_connections.sql`
