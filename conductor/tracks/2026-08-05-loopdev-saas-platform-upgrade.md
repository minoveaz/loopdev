# Track: Evolución de LoopDev hacia una plataforma SaaS multiempresa de alta calidad

**Fecha:** 2026-08-05  
**Estado:** En curso — Fase 5C
**Objetivo:** convertir `loopdev-os` en la plataforma SaaS multi-tenant del grupo LoopDev y de sus clientes, trasladando el backoffice de VitaBlue a LoopDev, reutilizando sus capacidades de marketing, CRM, operaciones y WhatsApp, y manteniendo las webs públicas de cada marca desacopladas.

## Contexto y decisión principal

LoopDev ya contiene la base técnica más adecuada para convertirse en el SaaS común:

- monorepo con pnpm y Turbo;
- aplicación Next.js con App Router;
- Design System compartido en `@loopdev/ui`;
- contratos compartidos en `@loopdev/contracts`;
- Supabase con migraciones y autenticación SSR;
- suites de Marketing Studio, Brand Hub, Sales CRM y Health OS;
- CLI de Supabase para migraciones y CLI de Render para despliegues.

VitaBlue contiene conocimiento de negocio y activos que deben incorporarse como dominio vertical, no como una segunda aplicación de backoffice:

- catálogo de seguros;
- elegibilidad y ranking de productos;
- wizard de cotización;
- páginas públicas, blog y SEO;
- campañas y conexiones sociales;
- requisitos detallados de WhatsApp Business inbound;
- consentimiento, atribución y fuentes de leads.

La decisión es construir un **monolito modular SaaS** en LoopDev, no iniciar una migración a microservicios ni copiar el backoffice de VitaBlue archivo por archivo.

Las webs públicas de VitaBlue y Protege tu Salud pueden seguir alojadas en Hostinger durante la transición. El backoffice común se ejecutará en LoopDev y se desplegará en Render.

## Checkpoint de implementación — 2026-08-08

La rama actual `feature/loopdev-saas-platform-fase-5c` parte de `develop` actualizado (`origin/develop`, commit `ee71133`). El trabajo de Platform Core, tenancy, contratos, tipos Supabase y la base persistente/RLS de Marketing Studio ya está integrado en `develop`. La Fase 5C aún no está cerrada: queda migrar el comportamiento funcional de VitaBlue a los servicios persistentes de LoopDev y retirar `localStorage` como fuente autoritativa.

### Hecho

- Fases 0, 1, 1B y 1C: inventario, saneamiento, calidad estática y retirada de Storybook.
- Fase 2: Platform Core, organizaciones, membresías, roles/permisos, marcas, workspaces, administradores de plataforma, RLS y transición de Quant.
- Fase 3: contexto de autenticación, organización, marca, workspace y permisos; Launchpad y rutas protegidas por suite.
- Fase 4 y 4B: contratos compartidos, servicios server-side, tipos Supabase generados desde Dev y typecheck validado.
- Fase 5A: contratos y mapa de migración de Marketing Studio.
- Fase 5B: migraciones aditivas de tenancy para Marketing, campañas canónicas, links/publicaciones, grants, índices, políticas RLS y pruebas de aislamiento. La validación remota se ejecutó con `supabase db push --linked --dry-run` y `supabase db push --linked`.
- Calidad de frontend: el paquete de tests está integrado; la validación local actual alcanza `110` archivos de test y `389` tests exitosos.
- CI: se corrigió el hydration mismatch de `TransitionOverlay` y se configuró la raíz de Turbopack para el monorepo.

### Pendiente inmediato

- Fase 5C: migrar campañas, copias, assets y Meta OAuth al modelo persistente y a servicios server-side.
- Eliminar `localStorage` como fuente autoritativa y conservarlo, si se necesita, únicamente como caché.
- Completar pruebas de servicio, OAuth, publicación y aislamiento entre VitaBlue y Protege tu Salud.
- Crear el PR de la rama 5C y validar CI/Supabase en GitHub.

Las capacidades avanzadas de Marketing Studio (Content Engine, Insights, Growth, Advisor y Compliance) permanecen en Fase 5E y no deben considerarse parte del cierre de 5C.

### Decisión: integraciones LLM como fase futura

La conexión con APIs de modelos LLM queda explícitamente fuera de Fase 5C y de la fundación actual de Content Engine. No se implementarán todavía proveedores, workers, generación automática ni selección de modelos.

Queda registrada como deuda técnica futura:

- diseñar un gateway server-side común para proveedores LLM;
- implementar cada integración módulo por módulo, empezando por Content Engine;
- mantener los secretos exclusivamente en servidor;
- validar y versionar los prompts y contratos de entrada/salida;
- registrar `brand_version_id` y los parámetros de contexto utilizados;
- crear jobs idempotentes mediante `input_hash`;
- controlar costes, límites, reintentos, timeouts y errores de proveedor;
- exigir revisión humana antes de publicar contenido o ejecutar acciones;
- añadir pruebas específicas por módulo y proveedor antes de activar cada conexión.

La tabla `content_generation_jobs` y las conexiones de modelos no se consideran requisito de cierre de esta fase. Se retomarán en una fase futura de integraciones LLM, módulo por módulo.

### Dependencia de Brand Hub para generación y campañas

Brand Hub es la fuente de verdad de marca para el resto de Marketing Studio, no únicamente una superficie de configuración:

- **Content Engine** consumirá identidad, logos, colores, tipografías, voz, tono, claims y reglas para elaborar piezas visuales y textos.
- **Campaign Orchestrator** consumirá la configuración activa de marca, restricciones, canales y assets autorizados para crear y validar campañas.

Por ello, antes de exponer Brand Hub a estos módulos se debe garantizar:

- contratos de lectura estables y versionados para el contexto de marca;
- resolución explícita de la versión publicada, no una lectura ambigua del JSON actual;
- assets con metadatos, permisos y referencias de Storage;
- reglas y claims distinguibles entre borrador, aprobados y publicados;
- auditoría de cambios y trazabilidad de qué versión utilizó cada pieza o campaña;
- separación entre configuración editable y snapshot inmutable consumido por una generación o campaña.

La primera implementación puede conservar `identity`, `palette`, `typography`, `logos` y `rules_engine` como JSONB en `brands`, pero debe exponer un contrato de lectura único. No se deben crear integraciones directas de Content Engine o Campaign Orchestrator contra columnas JSONB dispersas. La normalización a tablas de versiones, assets, claims y reglas se hará cuando el flujo de aprobación y publicación lo requiera.

## Arquitectura objetivo

```text
Web pública VitaBlue / Protege tu Salud / futuras marcas
        |
        | formularios, cotizador, enlaces referidos, Click to WhatsApp
        v
SaaS LoopDev (Next.js / loopdev-os)
        |
        +--> Launchpad y shell autenticado
        +--> Marketing Studio
        +--> Sales CRM
        +--> Operations
        +--> WhatsApp Inbox
        +--> Health OS
        +--> configuración, permisos y auditoría
        |
        +--> servicios server-side y workers
        |       - OAuth
        |       - webhooks
        |       - documentos
        |       - procesos asíncronos
        |
        v
Supabase
        +--> Auth
        +--> PostgreSQL
        +--> RLS
        +--> Storage
        +--> Realtime
        +--> Edge Functions
```

### Jerarquía multiempresa

```text
SaaS LoopDev
├── Organización: Grupo Estar Protegidos
│   ├── Marca: VitaBlue
│   └── Marca: Protege tu Salud
│
└── Organización: Zona Médica
    └── Suite habilitada: Health OS
```

Una organización representa al cliente del SaaS. Una marca representa una identidad comercial dentro de la organización. Un usuario puede tener membresías en una o varias organizaciones y permisos distintos por workspace o marca.

### Capas de la plataforma

1. **Platform Core:** organizaciones, membresías, roles, permisos, marcas, workspaces, auditoría, configuración, notificaciones y archivos.
2. **Suites:** Marketing Studio, Sales CRM, Operations, WhatsApp Inbox y Health OS.
3. **Verticales:** seguros, cotización, pólizas, onboarding y procesos clínicos u operativos.
4. **Public sites:** webs públicas y experiencias de captación configurables por marca.

## Estado actual y brechas

### Fortalezas existentes

- Next.js 16 y React 19 ya son la base de `loopdev-os`.
- El monorepo permite compartir UI, contratos y herramientas.
- Existe un Design System con jerarquía de átomos, composites y layouts.
- Existe una primera tabla `tenants` y una tabla `brands`.
- Supabase CLI, migraciones y `config.toml` ya están presentes en el repositorio.
- Sales CRM tiene navegación y superficies visuales aprovechables.
- Brand Hub tiene contratos, migraciones y componentes avanzados.
- VitaBlue ofrece dominio de seguros y requisitos de adquisición que deben reutilizarse.

### Brechas que deben cerrarse

- No existe un modelo completo de `organizations` y `memberships`.
- Las políticas RLS actuales son provisionales en varias áreas.
- Algunas políticas usan `tenant_id = auth.uid()`, que no modela membresías reales.
- El CRM usa datos mock y estado en memoria.
- Marketing Studio en VitaBlue utiliza `localStorage` como fallback relevante.
- Las tablas de marketing de VitaBlue no tienen aislamiento por organización y marca.
- `@loopdev/contracts` todavía no cubre CRM, operaciones, WhatsApp ni seguros.
- No existe un contexto frontend formal de organización, marca, workspace y permisos.
- Falta una separación operativa completa entre dev, staging y producción.
- No existe todavía un pipeline automatizado de migraciones Supabase y despliegue Render.
- Hay datos de demostración y migraciones experimentales que deben auditarse antes de producción.

## Alcance funcional

### Incluido

- Core SaaS multi-tenant con aislamiento de datos.
- Gestión de organizaciones, usuarios, membresías, marcas y workspaces.
- RBAC y permisos por suite y acción.
- Marketing Studio reutilizable para múltiples organizaciones y marcas.
- Sales CRM persistente con contactos, leads, oportunidades, actividades y tareas.
- Dominio de seguros de VitaBlue como módulo vertical.
- Cotizador, productos, ranking y elegibilidad reutilizables.
- Operations para onboarding, documentos, estados y emisión.
- WhatsApp Business Cloud API inbound-first.
- Auditoría de cambios y acciones sensibles.
- Observabilidad, CI/CD y despliegue en Render.
- Entornos separados de desarrollo, staging y producción.
- Aplicación preparada para clientes que usen solo una suite, como Zona Médica con Health OS.

### Fuera de la primera versión

- Microservicios distribuidos para cada suite.
- Billing completo del SaaS.
- Marketplace público de módulos.
- Campañas masivas de WhatsApp iniciadas por el sistema.
- Automatización de WhatsApp Web o librerías no oficiales.
- IA autónoma que decida coberturas, precios o recomendaciones sin supervisión.
- Multi-región activa desde el primer lanzamiento.
- Migración inmediata de todas las webs públicas al monorepo.

## Modelo de datos objetivo

### Plataforma

#### `organizations`

- `id`, `name`, `slug`, `status`;
- configuración regional, zona horaria y país;
- plan, límites y estado de facturación futuro;
- `created_at`, `updated_at`.

#### `organization_memberships`

- `organization_id`, `user_id`;
- estado de membresía;
- rol base y fechas de alta/baja;
- restricciones o scopes opcionales.

#### `roles`, `permissions`, `role_permissions`, `membership_roles`

- permisos atómicos por suite y acción;
- roles de organización, marca y workspace;
- revocación y auditoría de cambios.

#### `brands`

- `organization_id`, `name`, `slug`, `status`;
- identidad, paleta, tipografías, logos y reglas;
- dominios y configuración pública;
- `created_by`, `created_at`, `updated_at`.

#### `workspaces`

- `organization_id`, `brand_id` opcional;
- `suite_key` y configuración de módulo;
- estado, límites y preferencias.

### Marketing

- `marketing_campaigns` con `organization_id`, `brand_id`, `workspace_id`;
- `campaign_assets`, `campaign_copies`, `campaign_events`;
- `social_profiles` por organización y marca;
- `oauth_connections` con secretos exclusivamente server-side;
- fuentes, campañas UTM y referidos.

### CRM

- `crm_contacts` como identidad de contacto de la organización;
- `crm_leads` vinculados a contacto, marca, fuente y producto;
- `crm_opportunities` con pipeline configurable;
- `crm_activities`, `crm_tasks`, `crm_notes`;
- `crm_assignments`, etiquetas y estados;
- `crm_audit_events`.

### Seguros y operaciones

- catálogo y aseguradoras;
- productos, coberturas, exclusiones y reglas de elegibilidad;
- cotizaciones y versiones de cotización;
- onboarding, documentos y verificaciones;
- solicitudes, pólizas, renovaciones y estados de emisión;
- vínculos con lead, contacto, marca y agente.

### WhatsApp

- `whatsapp_accounts` por organización y marca;
- `whatsapp_contacts` vinculados a `crm_contacts`;
- `whatsapp_conversations`;
- `whatsapp_messages`;
- `whatsapp_events` o `webhook_deliveries` para idempotencia;
- asignación, etiquetas, ventana de atención y auditoría.

### Health OS

- entidades específicas de cada cliente, siempre con aislamiento organizacional;
- separar datos clínicos o especialmente sensibles del CRM comercial cuando corresponda;
- revisar una base Supabase dedicada para clientes sanitarios antes de producción regulada.

## Seguridad y autorización

### Reglas obligatorias

- Todas las tablas de negocio nuevas incluyen `organization_id`.
- Las tablas de marca incluyen `brand_id` cuando el dato pertenezca a una marca.
- RLS habilitada en todas las tablas expuestas.
- Ninguna política se basa únicamente en `auth.uid() = tenant_id`.
- Las políticas consultan membresías y permisos mediante funciones SQL seguras.
- Los tokens y secretos nunca llegan al navegador ni se guardan en `VITE_*` o `NEXT_PUBLIC_*`.
- Las Edge Functions validan usuario, organización, permiso y payload.
- Los webhooks son idempotentes, verifican origen y no bloquean la respuesta del proveedor.
- Los documentos privados se sirven mediante URLs firmadas y expirables.
- Las operaciones de exportación, borrado y cambios de permisos quedan auditadas.

### Funciones SQL de autorización

El core deberá ofrecer funciones reutilizables, por ejemplo:

```sql
is_organization_member(auth.uid(), organization_id)
has_organization_permission(auth.uid(), organization_id, 'crm.leads.read')
has_brand_permission(auth.uid(), organization_id, brand_id, 'marketing.campaigns.publish')
```

Las funciones deben ser `SECURITY DEFINER` únicamente cuando sea necesario, con `search_path` controlado y permisos revocados para `PUBLIC`.

### Roles iniciales

- `platform_owner`;
- `organization_owner`;
- `organization_admin`;
- `brand_manager`;
- `sales_manager`;
- `sales_agent`;
- `operations_manager`;
- `operations_agent`;
- `health_operator`;
- `marketing_editor`;
- `viewer`.

Los roles son una forma de asignar permisos, no un sustituto de los permisos atómicos.

## Arquitectura de frontend y código

### Shell SaaS

`apps/loopdev-os` será el único shell autenticado del backoffice. Debe resolver al inicio de cada sesión:

```text
AuthContext
  -> OrganizationContext
    -> BrandContext
      -> WorkspaceContext
        -> PermissionContext
          -> Suite routes
```

El layout no debe cargar datos de una organización usando valores mock o un `tenant_id` implícito.

### Estructura objetivo de la aplicación

```text
apps/loopdev-os/src/
├── app/
│   ├── login/
│   ├── launchpad/
│   ├── marketing-studio/
│   ├── sales-crm/
│   ├── operations/
│   ├── whatsapp/
│   ├── health-os/
│   └── settings/
├── core/
│   ├── auth/
│   ├── tenancy/
│   ├── permissions/
│   ├── audit/
│   └── navigation/
├── services/
├── hooks/
└── lib/
```

Cada suite debe separar:

- componentes de presentación;
- contratos y tipos;
- servicios de datos;
- hooks de server state;
- permisos requeridos;
- pruebas unitarias e integración.

### Contratos compartidos

Ampliar `packages/contracts` con esquemas Zod y tipos para:

- `Organization`, `Membership`, `Brand`, `Workspace`;
- `Role`, `Permission`;
- `Contact`, `Lead`, `Opportunity`, `Activity`, `Task`;
- `Campaign`, `SocialConnection`;
- `Quote`, `InsuranceProduct`, `EligibilityResult`;
- `Onboarding`, `Document`, `Policy`;
- `WhatsAppAccount`, `Conversation`, `Message`;
- entidades específicas de Health OS.

El frontend y las funciones server-side deben consumir estos contratos, evitando tipos duplicados por suite.

## Infraestructura objetivo

### Repositorios y ramas

```text
feature/*
    ↓ pull request
develop
    ↓ validación de staging
main
    ↓ despliegue protegido
producción
```

### Render

Crear un proyecto Render `loopdev-saas` con dos entornos:

```text
Render Project: loopdev-saas
├── Staging
│   ├── rama: develop
│   ├── servicio: loopdev-os-staging
│   ├── Supabase: loopdev-dev
│   └── dominio: staging.loopdev.dev
│
└── Production
    ├── rama: main
    ├── servicio: loopdev-os-production
    ├── Supabase: loopdev-prod
    └── dominio: app.loopdev.dev
```

Servicios futuros:

```text
loopdev-os
whatsapp-worker
document-worker
integration-worker
scheduled-jobs
```

El servicio web ejecuta Next.js. Los procesos largos o con reintentos no deben depender de una request de Next.js.

### Variables de entorno

Staging y producción deben tener grupos de variables separados:

- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- secretos server-side de Supabase;
- tokens de Meta y WhatsApp;
- secretos OAuth;
- claves de proveedores de IA;
- URLs de webhooks;
- configuración de observabilidad.

Nunca copiar automáticamente secretos de producción a previews o staging.

### Supabase

Al inicio puede existir un proyecto gratuito de desarrollo y crear producción más adelante. La producción deberá nacer limpia a partir de migraciones revisadas, no de una copia de la base de datos experimental.

```text
Git migrations
    ↓
Supabase local
    ↓
Supabase dev
    ↓
Supabase prod
```

La CLI se usará para:

```bash
supabase login
supabase link --project-ref <dev-project-ref>
supabase db reset
supabase db push --dry-run
supabase db push
supabase gen types typescript --linked
supabase functions deploy <function>
```

El proyecto de producción deberá enlazarse y desplegarse desde CI o desde una sesión expresamente protegida.

### Render CLI

La CLI de Render se usará para tareas reproducibles:

```bash
render workspace set <workspace>
render services
render deploys create <service-id> --commit <sha> --wait
render logs <service-id>
render blueprints validate render.yaml
```

La configuración de infraestructura deberá vivir en `render.yaml` cuando la topología esté estabilizada.

## Fases de implementación

### Fase 0 — Decisiones, inventario y congelación de alcance

- [x] Confirmar que LoopDev es el repositorio base del SaaS.
- [x] Confirmar que VitaBlue y Protege tu Salud son marcas de Estar Protegidos.
- [x] Confirmar que Zona Médica usará únicamente Health OS en la primera etapa.
- [x] Inventariar rutas, módulos, tablas, funciones y secretos existentes en LoopDev; ver `conductor/inventory-loopdev.md`.
- [x] Inventariar las capacidades que deben migrarse desde VitaBlue; las capacidades conocidas y los módulos aún desconocidos están clasificados en la matriz de capacidades.
- [x] Identificar datos demo, tablas Quant Ops y migraciones experimentales; los límites y riesgos quedan documentados en `conductor/inventory-loopdev.md`.
- [x] Definir qué partes de VitaBlue seguirán siendo web pública: landing, SEO, blog, formularios/wizard y captación permanecen en VitaBlue; el backoffice se traslada a LoopDev.
- [x] Crear un registro de decisiones arquitectónicas y riesgos en este track y en `conductor/inventory-loopdev.md`.

**Salida:** mapa de capacidades, alcance aprobado, responsables y lista de riesgos.

#### Inventario inicial de capacidades VitaBlue → LoopDev

| Capacidad | Decisión actual | Responsable / siguiente paso |
|---|---|---|
| CRM | LoopDev será la fuente de verdad. La implementación de CRM de VitaBlue se desechará cuando el otro equipo complete la versión de LoopDev. | Otro equipo; validar contrato y modelo final en Fase 4/6. |
| Marketing Studio | Se trasladará la implementación más avanzada de VitaBlue a LoopDev, conservando LoopDev como plataforma SaaS. | Otro equipo; comparar módulos y migrar por contrato. |
| Operaciones | Pendiente de inventario. Incluye normalmente onboarding, verificación, emisión, renovaciones, tareas y estados postventa. | Inventariar VitaBlue antes de diseñar el módulo. |
| Cotizaciones | Pendiente de inventario. Incluye solicitudes, cálculo/comparación de aseguradoras, versiones y estado de la oportunidad. | Inventariar wizard y lógica existente de VitaBlue. |
| WhatsApp/comunicaciones | Se integrará posteriormente mediante la base que desarrolla el otro equipo. LoopDev deberá consumir contratos/eventos estables, no acoplarse a su implementación interna. | Otro equipo; definir contrato de integración en Fase 4/8. |
| Documentos y seguimiento | Pendiente de inventario. Incluye archivos del cliente, OCR/verificación, timeline, notas, tareas y recordatorios. | Inventariar componentes y flujos existentes antes de construirlo. |

### Fase 1 — Auditoría y saneamiento del repositorio

- [x] Revisar encoding UTF-8 de código y documentación; la deuda de mojibake heredada queda identificada.
- [x] Ejecutar typecheck, lint y tests del monorepo; todos pasan en la línea base actual.
- [x] Detectar imports cruzados entre suites; no se encontraron dependencias internas entre dominios.
- [x] Separar datos mock de servicios de producción; los mocks restantes están localizados y no son fuente de verdad.
- [x] Marcar componentes experimentales y rutas de Quant Ops como módulo independiente.
- [x] Definir convenciones de nombres, carpetas y contratos.
- [x] Documentar cualquier cambio necesario en `conductor/tech-stack.md`.

**Criterio:** el repositorio tiene una línea base reproducible y las áreas problemáticas están enumeradas.

#### Resultado de auditoría de Fase 1 (2026-08-06)

- Las suites se mantienen aisladas por rutas y layouts; la reutilización compartida pasa por `components/layout`, `@loopdev/contracts` o `@loopdev/ui`.
- Los datos demo/mock están identificados y no son fuente de verdad. La migración de CRM y Marketing a servicios Supabase queda planificada en las fases 5 y 6.
- Quant Ops permanece como módulo independiente, con UI, contexto y `modules/mod-quant-core` separados.
- `conductor/tech-stack.md` recoge los límites de arquitectura, convenciones y comandos de calidad.

### Fase 1B — Calidad estática y buenas prácticas de codificación

Esta fase refuerza la línea base antes de modificar el modelo multiempresa. Las comprobaciones deben ejecutarse igual en local y en GitHub Actions.

- [x] Configurar Prettier y comprobar formato sin modificar archivos en CI.
- [x] Activar reglas ESLint para imports, variables, hooks y accesibilidad.
- [x] Activar reglas Tailwind para orden y clases contradictorias.
- [x] Detectar clases Tailwind repetidas dentro de un mismo `className` estático.
- [x] Medir duplicación de código con `jscpd` y fijar un umbral explícito.
- [x] Detectar exports, ficheros y dependencias no utilizados con `knip`.
- [x] Definir excepciones documentadas para Storybook, fixtures y código experimental.
- [x] Añadir un comando único `pnpm quality:static` para todas las comprobaciones.
- [x] Ejecutar `quality:static` en cada Pull Request y en `develop`/`main`.
- [x] Registrar la deuda existente sin ocultar nuevos errores.

**Criterio:** una contribución nueva no puede introducir formato inconsistente, clases Tailwind contradictorias o repetidas, duplicación por encima del umbral ni dependencias sin uso.

#### Herramientas de cierre de Fase 1 e inicio de Fase 2

- Adoptar `dependency-cruiser` como primera herramienta de límites arquitectónicos cuando CI migre a Node 22+; con Node 20 queda diferido para no romper el entorno actual. No añadir `eslint-plugin-boundaries` en paralelo.
- Añadir CodeQL y secret scanning en GitHub Actions antes de incorporar múltiples scanners locales. CodeQL queda configurado en `.github/workflows/codeql.yml` y Dependabot en `.github/dependabot.yml`.
- Documentar contratos y límites de suites en `conductor/tech-stack.md` y `@loopdev/contracts`.
- Mantener Storybook y Chromatic fuera del proyecto.

### Fase 1C — Retirada de Storybook y limpieza de deuda heredada

- [x] Retirar Storybook del arranque local y del flujo principal del SaaS.
- [x] Eliminar el workflow de despliegue de Storybook.
- [x] Quitar dependencias y scripts de Storybook de los workspaces.
- [x] Eliminar las stories existentes y mantener los tests Vitest/React Testing Library.
- [x] Eliminar la app de documentación que solo contenía Storybook.
- [x] Actualizar documentación y configuración para no exigir Storybook.
- [x] Revisar y eliminar los archivos `.legacy` por grupos funcionales; no quedan componentes legacy versionados en el Design System.
- [x] Revisar los resultados de Knip y eliminar únicamente código confirmado como muerto; el baseline final queda documentado sin borrar falsos positivos.
- [x] Revisar clones de jscpd y extraer únicamente duplicaciones con semántica compartida; no se realizan extracciones mecánicas sin validación.
- [x] Recalcular el baseline de deuda después de la retirada.

**Criterio:** Storybook no forma parte de la instalación, el arranque ni CI; la validación de componentes se realiza con tests y la deuda restante está clasificada antes de eliminarla.

### Fase 2 — Platform Core y tenancy real

#### Herramientas y controles

- Incorporar Supabase CLI para migraciones reproducibles y validación de esquema.
- Usar Docker únicamente en los runners de GitHub Actions para bases efímeras de CI; no se requiere Docker ni Supabase local para el desarrollo diario.
- Añadir tests RLS para organizaciones, memberships, roles y aislamiento entre tenants.
- Usar Zod para contratos de entrada/salida y validación de servicios.
- Ejecutar CodeQL dentro de GitHub Actions.
- Priorizar Supabase efímero/RLS en CI antes de activar datos multiempresa reales.
- El workflow `.github/workflows/supabase.yml` levanta Supabase temporalmente solo ante cambios en `supabase/**`, en pushes de `develop`/`main` y en la ejecución nocturna; el CI general no se ralentiza en cada push de código.
- Estado actual: Supabase CLI `2.111.0` está instalado. La migración fundacional `20260806000000_platform_core_foundation.sql` está preparada como cambio aditivo y se validará exclusivamente en el workflow de GitHub Actions.

- [x] Crear migraciones para `organizations` y `organization_memberships`.
- [x] Añadir `roles`, `permissions`, `role_permissions` y scopes como catálogo/matriz aditiva; la asignación continúa viviendo en `organization_memberships.role`.
- [x] Evolucionar `brands` para que dependa formalmente de `organization_id`; conserva `tenant_id` solo como enlace heredado durante la transición, con backfill determinista y RLS por permiso de Marketing.
- [x] Crear `workspaces` y configuración de suites habilitadas; `workspace_brands` permite alcance de organización completa o de varias marcas sin convertir submarcas en tenants.
- [x] Crear funciones SQL de membresía y autorización.
- [x] Añadir administradores globales de LoopDev separados de las membresías de organización; `platform owner` puede administrar el core y su acceso queda cubierto por RLS y pruebas.
- [x] Añadir índices y constraints de organización y marca para Brand Hub (`brands.organization_id` con FK e índice).
- [x] Activar RLS con políticas verificables.
- [x] Conceder privilegios SQL explícitos a `authenticated` para las tablas Platform Core; la autorización efectiva sigue siendo exclusivamente RLS.
- [x] Crear pruebas de matriz RLS: aislamiento entre organizaciones, owner, admin, agent, viewer y usuario externo.
- [x] Eliminar políticas públicas heredadas de `brands` y sustituirlas por políticas de lectura/gestión basadas en permisos de la organización.

#### Cierre inmediato de exposición pública heredada (2026-08-07)

- [x] Preparar `20260813000000_platform_core_internal_quant_access.sql` para retirar las lecturas públicas de `tenants`, `quant_assets`, `quant_market_config` y `quant_market_history`.
- [x] Restringir `tenants` a la membresía de la organización vinculada por `legacy_tenant_id`; un administrador global de LoopDev conserva el acceso operativo.
- [x] Restringir los datos internos de referencia Quant a usuarios con `quant.read` en al menos una organización, o a administradores globales de LoopDev.
- [x] Añadir pruebas negativas para un usuario autenticado sin membresía y pruebas positivas para un miembro autorizado.
- [x] Validar la migración y la matriz RLS en la base efímera del workflow Supabase antes de aplicarla a Dev (PR #8: `Migrations and CI RLS baseline` en verde).

Este cierre no migra todavía las tablas Quant que conservan `tenant_id`; esa evolución estructural a `organization_id` requiere inventario, backfill y una migración de dominio independiente.

#### Transición estructural de Quant a organizaciones (en curso)

- [x] Inventariar los registros Quant ligados a `tenant_id`, incluidos bots, exchanges, estrategias, órdenes, posiciones, señales, riesgo, auditoría y resultados de backtest.
- [x] Preparar la migración aditiva `20260814000000_quant_organization_tenancy.sql`: añade `organization_id`, realiza el backfill desde `legacy_tenant_id`, falla explícitamente ante registros sin correspondencia y conserva `tenant_id` de forma temporal.
- [x] Sustituir las políticas legacy basadas en `tenant_id = auth.uid()` por RLS de `quant.read` y `quant.manage` por organización, incluido el aislamiento de auditoría y backtests.
- [x] Adaptar las escrituras directas de bots, estrategias, riesgo y exchanges al contexto activo de organización; las cachés de React Query ya incluyen `organization_id`.
- [x] Validar la migración y la matriz RLS en la base efímera de CI antes de aplicarla a Dev (PR #9: `Migrations and CI RLS baseline` en verde tras reintento del runner).
- [x] Mover la gestión de `quant_exchanges` a rutas server-side protegidas: el navegador ya no consulta ni escribe la tabla y solo recibe metadatos saneados; `SUPABASE_SERVICE_ROLE_KEY` y `QUANT_CORE_URL` permanecen exclusivamente en servidor.
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` y `QUANT_CORE_URL` en staging/Render antes de activar el vault en usuarios reales (Fase 10).

Runbook preparado en `docs/quant-vault-environment.md`; el pendiente se cierra únicamente después de cargar y verificar los secretos en los entornos correspondientes.

**Criterio:** ningún usuario puede consultar o modificar datos de otra organización aunque manipule la request.

### Fase 3 — Auth, contexto y shell multiempresa

#### Herramientas y controles

- Mantener Zod y `@loopdev/contracts` como fuente de contratos de auth, organización, marca y workspace.
- Añadir tests de autorización y routing por rol y suite.
- Aplicar reglas más estrictas de `dependency-cruiser`.
- Incorporar Playwright para login, navegación, permisos y estados de acceso multiempresa.

- [x] Refactorizar `AuthProvider` para cargar membresías tipadas; mantiene fallback vacío hasta desplegar Platform Core en Supabase remoto.
- [x] Crear `OrganizationProvider` con organización activa persistida y selección limitada a memberships autorizadas.
- [x] Crear `BrandProvider`; resuelve automáticamente 0/1 marca y exige selección solo con varias marcas, siempre dentro de la organización activa.
- [x] Crear `WorkspaceProvider`; carga únicamente suites activas autorizadas de la organización, mantiene la selección válida por organización y expone si una suite está habilitada.
- [x] Crear `PermissionProvider` y helpers client: resuelve el catálogo de permisos una vez por organización y los guards/Launchpad consumen una única fuente de verdad.
- [x] Aplicar permisos al Launchpad y navegación de las suites existentes (CRM, Marketing Studio, Health OS y Quant Ops); Financial Ops queda pendiente de ruta real.
- [x] Bloquear rutas y Launchpad de suites no habilitadas para la organización; el acceso exige permiso y workspace activo para la suite.
- [x] Añadir estados de organización sin acceso, membresía pendiente y sesión expirada.
- [x] Añadir pruebas de routing y autorización.

**Criterio:** una misma cuenta puede pertenecer a varias organizaciones y ver solo los módulos y datos autorizados.

#### Estado tras PR #11 (2026-08-07)

- [x] Fusionar `PermissionProvider` y los helpers de permisos en `develop` (PR #11, merge commit `79a83ad`).
- [x] Mantener una única fuente de verdad de permisos para Launchpad, navegación y guards de suites.
- [x] Añadir estados de organización sin acceso, membresía pendiente y sesión expirada.
- [x] Añadir pruebas de routing y autorización, incluyendo cambio de organización y suite no habilitada.

#### Cierre de estados de acceso (2026-08-07)

- [x] Las membresías ahora tienen ciclo de vida explícito (`pending`, `active`, `suspended`, `revoked`) y solo `active` autoriza funciones SQL, RLS, organizaciones, permisos y workspaces.
- [x] El shell muestra estados dedicados para sesión expirada, membresía pendiente y ausencia de acceso organizacional; las rutas de suite redirigen de forma segura al Launchpad cuando corresponde.
- [x] Las pruebas unitarias cubren el decisor de routing para carga, sesión expirada, sin acceso, membresía pendiente, activa, suspendida y revocada; el test de base comprueba la columna y el requisito de estado activo en el helper de permisos.

El siguiente bloque de Fase 3 son los estados de sesión/autorización y las pruebas de routing. La integración de Communications/WhatsApp queda fuera de este bloque y se retomará posteriormente mediante contratos y endpoints server-side estables.

### Fase 4 — Contracts y capa de servicios

#### Herramientas y controles

- Consolidar contratos Zod en `@loopdev/contracts`.
- Validar servicios server-side con tests de integración.
- Generar y revisar tipos Supabase antes de exponerlos a las suites.
- Mantener `dependency-cruiser` como gate arquitectónico.

- [x] Ampliar `@loopdev/contracts` con Zod y tipos de Platform Core (organizaciones, memberships, roles y permisos).
- [x] Definir contratos de CRM y actividades.
- [x] Definir contratos de Marketing Studio.
- [x] Definir contratos de seguros, cotizaciones y operaciones.
- [x] Diferir contratos de WhatsApp a Fase 8, hasta disponer de contratos de POC y endpoints server-side estables.
- [x] Diferir contratos de Health OS a Fase 9, después de definir el modelo clínico, la clasificación de datos y la retención.
- [x] Crear servicios server-side para operaciones sensibles; el vault de Quant centraliza autorización, lectura, alta y prueba de conexiones fuera de los Route Handlers.
- [x] Centralizar mapeos snake_case/camelCase para CRM; los siguientes servicios reutilizarán este límite validado.
- [x] Diferir generación de tipos de Supabase a Fase 4B, que requiere acceso autenticado al proyecto Dev o un secret de CI.
- [x] Prohibir tipos locales duplicados en módulos nuevos mediante `contracts:ownership:check`, integrado en `quality:static` sin depender de Docker.

**Criterio:** cada entidad compartida disponible tiene un contrato único y validación de entrada/salida; WhatsApp y Health OS permanecen explícitamente diferidos a sus fases de dominio.

### Fase 4B — Integración de esquema Supabase

Esta fase se ejecutará desde una máquina con acceso autenticado al proyecto Supabase Dev o desde CI; no requiere Docker local.

- [x] Enlazar explícitamente Supabase CLI con el proyecto Dev.
- [x] Generar los tipos TypeScript desde el esquema remoto.
- [x] Versionar los tipos generados en el paquete o capa de datos correspondiente.
- [x] Comprobar que el diff de tipos coincide con migraciones revisadas.
- [x] Ejecutar typecheck después de sustituir los tipos manuales de filas de base de datos.

#### Cierre de Fase 4B (2026-08-08)

La integración se completó contra el proyecto Supabase Dev enlazado. Los tipos generados viven en `apps/loopdev-os/src/types/database.types.ts`, los clientes Supabase usan `Database` como tipo raíz y se sustituyeron los tipos manuales de filas. La comprobación remota se realizó con `supabase db push --linked --dry-run` y `supabase db push --linked`; no se requirió Docker local. `pnpm typecheck` pasa correctamente.

**Criterio:** el código que consulta Supabase utiliza tipos generados reproducibles y el esquema remoto no introduce diferencias silenciosas.

### Fase 5 — Migración de Marketing Studio

#### Herramientas y controles

- Contratos Zod y tipos compartidos para marcas, campañas, assets y plataformas.
- Migraciones Supabase con `organization_id`, `brand_id` y `workspace_id`.
- RLS y tests de aislamiento entre VitaBlue y Protege tu Salud.
- Tests de servicios OAuth server-side.
- Playwright para crear, editar, publicar y proteger campañas.

#### Alcance de producto y fuente de migración (2026-08-08)

Marketing Studio no se limita a campañas. El sidebar de LoopDev define once módulos: Suite Dashboard, Brand Hub, Asset Manager, Content Engine, Campaign Orchestrator, Insights & Intel, Growth Ops, Advisor System, Compliance, Integrations y Suite Settings.

VitaBlue aporta una implementación funcional de campañas, perfiles sociales, copies, assets, OAuth y Vault. Es la fuente de requisitos y comportamiento para la migración, pero sus tablas y código no se copian directamente: son mono-marca, usan roles aislados y mantienen `localStorage` como fallback autoritativo.

| Módulo | Alcance de dominio | Estado de origen |
|---|---|---|
| Brand Hub | identidad, logos, color, tipografía, voz, reglas, claims, versiones y publicación | UI parcial en LoopDev; persistencia por consolidar |
| Asset Manager | activos en Storage, metadatos, tags, colecciones, variantes, derechos y enlaces reutilizables | pendiente; VitaBlue conserva assets JSON dentro de campañas |
| Content Engine | briefs, piezas, versiones, plantillas, generación IA, revisión y aprobación | generador social funcional en VitaBlue; pendiente de servicios SaaS |
| Campaign Orchestrator | campañas, canales, contenidos, activos, calendario, presupuesto, UTM y entregas | gestor funcional en VitaBlue; pendiente de modelo multi-tenant |
| Integrations | conexiones sociales, cuentas externas, OAuth, Vault, sincronizaciones y webhooks | Meta OAuth y Vault funcionales en VitaBlue; el resto de proveedores no tiene intercambio server-side completo |
| Insights & Intel | snapshots de métricas, atribución, embudos e insights | pendiente |
| Growth Ops | hipótesis, experimentos, variantes, métricas, iniciativas y tareas | pendiente |
| Advisor System | recomendaciones con evidencia, feedback y aprobación humana | pendiente; no ejecuta acciones autónomas |
| Compliance | políticas, reglas, checks, hallazgos, revisiones y aprobaciones | reglas de Brand Hub existentes; persistencia de workflow pendiente |
| Suite Settings y Dashboard | configuración de workspace, locales, proveedores, límites, notificaciones y agregados operativos | pendiente; el dashboard actual usa fixtures |

#### Modelo multi-tenant obligatorio

Todas las entidades de negocio nuevas incluyen `organization_id`, `created_at`, `updated_at`, `created_by` y `updated_by`. Las entidades de marca incluyen `brand_id`; los flujos operativos de la suite incluyen `workspace_id`. RLS se resuelve por organización y permisos atómicos, no por la tabla mono-marca `user_roles` de VitaBlue.

El modelo se organizará en estos agregados, normalizando los JSONB de VitaBlue cuando haga falta versionado, búsqueda, aprobación o reutilización:

```text
Brand Hub: brands, brand_identity_versions, brand_logo_variants,
           brand_color_tokens, brand_typography_tokens, brand_voice_profiles,
           brand_claim_rules, brand_publish_releases, brand_audit_events

Assets:    marketing_assets, marketing_asset_variants, marketing_asset_metadata,
           marketing_tags, marketing_asset_tags, marketing_asset_collections,
           marketing_asset_links

Content:   content_briefs, content_items, content_versions, content_templates,
           content_generation_jobs, content_generation_outputs,
           content_review_requests, content_approvals

Campaigns: marketing_campaigns, campaign_channels, campaign_content_items,
           campaign_assets, campaign_schedules, campaign_budgets,
           campaign_delivery_jobs, campaign_delivery_events, campaign_utm_links

Integrations: social_connections, social_connection_accounts,
              oauth_authorization_states, integration_credentials_refs,
              integration_sync_runs, integration_webhook_deliveries

Insights:  marketing_metric_snapshots, campaign_metric_snapshots,
           channel_metric_snapshots, attribution_events, attribution_touchpoints,
           marketing_insights

Growth:    growth_hypotheses, growth_experiments, growth_experiment_variants,
           growth_experiment_metrics, growth_initiatives, growth_tasks

Advisor:   advisor_runs, advisor_recommendations, advisor_evidence,
           advisor_feedback, advisor_actions

Compliance: compliance_policies, compliance_rules, compliance_checks,
            compliance_findings, compliance_review_requests, compliance_approvals

Settings:  marketing_workspace_settings, marketing_locales,
           marketing_provider_settings, marketing_notification_preferences,
           marketing_dashboard_preferences
```

Los secretos y tokens permanecen fuera de estas tablas: `integration_credentials_refs` solo guarda una referencia a Vault, y OAuth, publicación, sincronización y webhooks se ejecutan exclusivamente en servicios server-side.

#### Contratos, permisos y entregas

`packages/contracts/src/marketing/marketing.ts` es la primera base para campañas, assets, copies y conexiones. Evolucionará a contratos por agregado (`scope`, `campaign`, `asset`, `content`, `integrations`, `analytics`, `growth`, `advisor`, `compliance` y `settings`) con entidades de lectura, comandos validados y eventos. No se expondrán referencias a secretos, payloads crudos de proveedor ni rutas de Storage sin autorización.

Los permisos se desglosarán progresivamente en `marketing.brands.*`, `marketing.assets.*`, `marketing.content.*`, `marketing.campaigns.*`, `marketing.integrations.*`, `marketing.analytics.read/export`, `marketing.growth.*`, `marketing.advisor.*`, `marketing.compliance.*` y `marketing.settings.manage`.

La entrega se divide para no bloquear al equipo visual:

1. **5A — Contratos y mapa de migración:** modelar los agregados y documentar VitaBlue → LoopDev, sin modificar componentes visuales. **Completada el 2026-08-08:** los contratos Zod se separan por alcance, campañas, assets, contenido, integraciones, inteligencia, governance y ajustes; sus invariantes se cubren con tests.
2. **5B — Persistencia y RLS:** migraciones, índices, políticas y servicios para Brand Hub, Assets, Campaigns e Integrations; la validación remota se ejecuta en CI o en un entorno Supabase autenticado.
3. **5C — Migración funcional:** adaptar campañas, copies, assets y Meta OAuth de VitaBlue a los servicios de LoopDev; eliminar `localStorage` como fuente de verdad.
4. **5D — Integración de interfaz:** frontend consume los servicios nuevos preservando la arquitectura `AppShell` + `ModuleWorkspace` existente.
5. **5E — Capacidades avanzadas:** Content Engine, Insights, Growth, Advisor y Compliance se entregan por incrementos, siempre con aprobación humana para acciones de impacto.

#### Handoff operativo — equipo con Mac y acceso a Supabase Dev

El equipo del Mac ejecutará 4B, 5B y 5C en este orden, partiendo de la rama que contiene 5A. No debe modificar layouts, componentes visuales ni tokens del frontend; esos cambios permanecen en el flujo del equipo frontend.

1. **Preparar acceso y comprobar el estado remoto.** Ejecutar `supabase login`, enlazar únicamente el proyecto Dev y comprobar `supabase migration list`. Ejecutar `pnpm supabase:migrations:check` antes de cualquier operación de Supabase. No enlazar producción, no usar secretos de producción y no aplicar cambios automáticos.
2. **Completar Fase 4B.** Generar los tipos TypeScript desde Dev (`supabase gen types typescript --linked`), versionarlos en la capa de datos acordada, comparar el diff con las migraciones revisadas y ejecutar typecheck. Si aparecen diferencias remotas no representadas en Git, detenerse y documentarlas antes de modificar código o base de datos.
3. **Auditar el legado de Marketing antes de migrar.** Inventariar estructura, constraints, políticas RLS, índices y conteos no sensibles de `marketing_campaigns`, `social_profiles`, `oauth_connections` y `oauth_states`. Confirmar los mapeos de organización, marca y workspace para cada fila. Las tablas heredadas de VitaBlue son mono-marca: `marketing_campaigns.id` es texto, `social_profiles.platform` y la combinación OAuth son globales; no asumir compatibilidad ni eliminar datos.
4. **Implementar Fase 5B con migraciones aditivas y revisables.** Crear el modelo multi-tenant para Brand Hub, Assets, Campaigns e Integrations. Añadir `organization_id`, `brand_id` y `workspace_id` solo después de un backfill determinista; mantener las columnas legacy y los JSONB como compatibilidad temporal. Añadir foreign keys, constraints, índices y RLS por organización, con excepción explícita para `platform_administrators`. No ejecutar `DROP`, `TRUNCATE`, borrados masivos ni cambios de tipo irreversibles.
5. **Validar 5B antes de aplicar.** Ejecutar `supabase db push --dry-run`, `supabase db reset` y los tests RLS en el entorno autorizado/CI. Probar como mínimo: platform administrator, usuario de VitaBlue, usuario de Protege tu Salud, usuario sin membresía y membresía pendiente/revocada. Verificar que un workspace de Marketing solo consulta marcas, campañas, assets y conexiones de su organización.
6. **Implementar 5C después de 5B verde.** Adaptar los servicios de VitaBlue a los contratos de LoopDev: campañas, copies, assets, canales y Meta OAuth. El navegador solo recibe metadatos autorizados; los tokens se quedan en Vault y los callbacks, refresh, publicación, sincronización y desconexión se ejecutan server-side. Sustituir `localStorage` por servicios persistentes; solo podrá quedar como caché no autoritativa. LinkedIn, YouTube, X y TikTok permanecen sin activar hasta tener intercambio OAuth server-side completo y probado.
7. **Entregar evidencia.** Incluir en el PR el listado de migraciones, resultado de dry-run/reset/RLS, tipos generados, tests de servicios y los pasos de rollback compatibles. No fusionar si hay diferencias no explicadas entre Dev y Git o si una prueba de aislamiento falla.

- [ ] Elegir la implementación de LoopDev como fuente de verdad.
- [ ] Migrar Brand Hub de VitaBlue al contrato genérico de marca.
- [ ] Migrar campañas, assets, copias y plataformas.
- [ ] Migrar conexiones OAuth a servicios server-side.
- [ ] Añadir `organization_id`, `brand_id` y `workspace_id`.
- [ ] Eliminar dependencia de `localStorage` para datos persistentes.
- [ ] Mantener cache local solo como optimización no autoritativa.
- [ ] Añadir publicación, borrado y edición protegidos por permisos.
- [ ] Crear pruebas de aislamiento entre VitaBlue y Protege tu Salud.

**Criterio:** dos marcas de una misma organización pueden trabajar en Marketing Studio sin mezclar datos, perfiles ni campañas.

### Fase 6 — CRM persistente

#### Herramientas y controles

- Supabase CLI para tablas, índices, constraints y migraciones CRM.
- Zod y `@loopdev/contracts` para contactos, leads, oportunidades, actividades y tareas.
- Tests de integración, concurrencia y RLS por organización/workspace.
- Vitest para reglas de pipeline y deduplicación de contactos.
- Playwright para el flujo del agente y la actualización de etapas.

- [ ] Convertir el contexto mock de Sales CRM en servicios Supabase.
- [ ] Crear tablas de contactos, leads, oportunidades, actividades y tareas.
- [ ] Migrar pipeline y estados a configuración de workspace.
- [ ] Implementar asignación de agentes.
- [ ] Implementar timeline y auditoría.
- [ ] Implementar notas internas separadas de mensajes al cliente.
- [ ] Implementar búsqueda, filtros e índices.
- [ ] Integrar fuente, campaña, UTM, marca y producto.
- [ ] Integrar lead del wizard público sin duplicar contactos.
- [ ] Añadir pruebas de concurrencia y actualización de etapa.

**Criterio:** el CRM funciona con datos persistentes, permisos reales y sin datos demo en flujos productivos.

### Fase 7 — Vertical de seguros y Operations

#### Herramientas y controles

- Contratos Zod para productos, coberturas, cotizaciones y pólizas.
- Servicios server-side testeables para ranking, elegibilidad y versionado de cotizaciones.
- Migraciones Supabase para operaciones, documentos, verificaciones y tareas.
- Tests de dominio independientes de componentes visuales.
- Playwright para onboarding, carga documental y seguimiento operativo.

- [ ] Migrar catálogo de VitaBlue a contratos de dominio.
- [ ] Separar productos, aseguradoras, coberturas y reglas de elegibilidad.
- [ ] Migrar ranking y recomendación a servicios testeables.
- [ ] Crear cotizaciones versionadas.
- [ ] Crear onboarding por etapas.
- [ ] Crear documentos, estados de verificación y trazabilidad.
- [ ] Crear tareas operativas por lead, cotización o póliza.
- [ ] Preparar emisión, renovación y seguimiento.
- [ ] Mantener reglas de negocio independientes de componentes visuales.

**Criterio:** un lead puede pasar de captación a cotización y onboarding con historial completo.

### Fase 8 — WhatsApp Business inbound-first

#### Herramientas y controles

- Tests unitarios e integración de webhooks.
- Idempotencia por identificador del proveedor.
- Reintentos controlados y estados de entrega.
- Validación Zod de payloads externos.
- Playwright únicamente para la bandeja CRM y los flujos del agente.

- [ ] Crear cuenta WhatsApp por organización y marca.
- [ ] Crear Edge Function de verificación y webhook.
- [ ] Validar origen, cuenta, firma y estructura de eventos.
- [ ] Normalizar teléfono en formato E.164.
- [ ] Deduplicar eventos y mensajes por identificador del proveedor.
- [ ] Crear o actualizar contacto y conversación.
- [ ] Capturar fuente de anuncio, referido y campaña.
- [ ] Crear bandeja protegida en CRM.
- [ ] Añadir asignación, etiquetas, estados y notas.
- [ ] Crear función server-side de respuesta.
- [ ] Respetar ventana de atención y plantillas autorizadas.
- [ ] Añadir estados `sent`, `delivered`, `read` y `failed`.
- [ ] Probar mensajes de texto, imagen, documento, audio y ubicación.

La POC `crm-communications-poc` permanece temporalmente desacoplada. No se incorporan todavía sus migraciones ni su esquema CRM a LoopDev; la integración se retomará como una fase posterior mediante contratos y endpoints server-side.

**Criterio:** un mensaje duplicado no duplica entidades y un agente autorizado puede responder sin exponer credenciales.

### Fase 9 — Health OS y clientes de suite única

- [ ] Aislar Health OS como suite habilitable por organización.
- [ ] Definir qué datos son clínicos, operativos o comerciales.
- [ ] Aplicar permisos específicos para datos sensibles.
- [ ] Probar organización Zona Médica con solo Health OS visible.
- [ ] Verificar que Zona Médica no puede consultar Marketing, CRM o datos de Estar Protegidos.
- [ ] Evaluar proyecto Supabase dedicado cuando existan datos sanitarios reales.
- [ ] Añadir auditoría reforzada y retención definida.

**Criterio:** una organización puede contratar una sola suite sin recibir acceso a módulos o datos ajenos.

### Fase 10 — Entornos, CI/CD y Render staging

#### Herramientas y controles

- Render Staging conectado a `develop`.
- Render Production conectado a `main`.
- Migraciones Supabase controladas y revisables.
- Health checks y smoke checks post-deploy.
- Rollback de aplicación y migraciones compatibles.
- Variables de entorno y secretos separados por entorno.

#### Flujo de calidad objetivo

```text
Editor
  ↓ Prettier + ESLint + typecheck
Vitest + jscpd + Knip
  ↓
GitHub Actions
  ↓ CodeQL + Dependabot + build
Supabase efímero + RLS
  ↓
Playwright
  ↓
Render Staging
  ↓
Producción
```

- [ ] Crear proyecto Render `loopdev-saas`.
- [ ] Crear entornos `Staging` y `Production`.
- [ ] Vincular `develop` con staging y `main` con producción.
- [ ] Configurar Supabase dev en staging.
- [ ] Reservar Supabase prod para una base limpia futura.
- [ ] Configurar variables y grupos de secretos por entorno.
- [ ] Crear health check de Next.js.
- [ ] Crear `render.yaml` cuando los servicios estén definidos.
- [ ] Configurar deploy automático de staging.
- [ ] Configurar producción protegida y deploy manual o por aprobación.
- [ ] Añadir pipeline de migraciones Supabase con `--dry-run` y revisión.
- [ ] Añadir logs, alertas y comprobaciones post-deploy.
- [ ] Probar rollback de aplicación y migración compatible.

**Criterio:** un commit en `develop` despliega staging con Supabase dev y un release aprobado puede desplegar producción sin tocar staging.

### Fase 11 — Preparación de producción

- [ ] Crear Supabase prod limpio.
- [ ] Aplicar solo migraciones revisadas.
- [ ] Configurar Auth, Storage, Edge Functions y secretos.
- [ ] Crear organización inicial de Estar Protegidos.
- [ ] Crear VitaBlue y Protege tu Salud como marcas.
- [ ] Crear roles y usuarios operativos.
- [ ] Importar solo datos validados y necesarios.
- [ ] Configurar backups y recuperación.
- [ ] Revisar RLS con matriz automatizada.
- [ ] Ejecutar pruebas de carga básicas.
- [ ] Validar dominios, cookies, sesiones y expiración.
- [ ] Hacer piloto interno antes de clientes externos.

**Criterio:** producción está limpia, reproducible, auditada y lista para el primer cliente real.

## Flujo de desarrollo y calidad

Cada fase seguirá el workflow de LoopDev:

1. seleccionar tarea en el plan;
2. marcarla en progreso;
3. escribir pruebas fallidas;
4. implementar la mínima solución;
5. ejecutar pruebas y refactorizar;
6. revisar cobertura y seguridad;
7. actualizar documentación;
8. crear commit y nota de trabajo;
9. registrar checkpoint de fase.

## Estrategia completa de testing

La calidad del SaaS no se validará únicamente comprobando que las páginas renderizan. Cada cambio debe cubrir comportamiento, autorización, datos, integraciones, despliegue y regresiones.

### Pirámide de pruebas

#### Unitarias

- [ ] Reglas de elegibilidad y ranking de seguros.
- [ ] Normalización de teléfonos E.164.
- [ ] Cálculo de ventanas de WhatsApp.
- [ ] Resolución de organización, marca y workspace.
- [ ] Evaluación de permisos.
- [ ] Validación de contratos Zod.
- [ ] Mapeos de Postgres a modelos de dominio.
- [ ] Formateadores, fechas, moneda y timezone.
- [ ] Estados de componentes y reducers.
- [ ] Utilidades de generación de campañas y assets.

#### Componentes y UI

- [ ] Render de estados loading, empty, error y success.
- [ ] Formularios con validación, errores y reintentos.
- [ ] Kanban y cambio de etapa.
- [ ] Inspector de lead y timeline.
- [ ] Bandeja de conversaciones.
- [ ] Selector de organización, marca y workspace.
- [ ] Navegación condicionada por permisos.
- [ ] Modal, drawer, tabla, filtros y paginación.
- [ ] Accesibilidad de teclado y lectores de pantalla.
- [ ] Responsive en viewport móvil, tablet y escritorio.

#### Integración

- [ ] Auth SSR y renovación de sesión.
- [ ] Carga de membresías y permisos.
- [ ] CRUD de marcas y campañas con RLS.
- [ ] Persistencia CRM completa.
- [ ] Cotización y elegibilidad contra el catálogo.
- [ ] Subida y descarga firmada de documentos.
- [ ] Webhook de WhatsApp con payloads válidos e inválidos.
- [ ] OAuth con proveedores sociales usando funciones server-side.
- [ ] Reintentos, timeouts y errores de proveedores externos.
- [ ] Generación de tipos a partir de Supabase.

#### Seguridad y RLS

Cada tabla multi-tenant debe tener pruebas negativas y positivas:

- [ ] usuario sin sesión no puede leer datos privados;
- [ ] usuario de organización A no puede leer organización B;
- [ ] usuario de la marca A no puede modificar marca B si no tiene scope;
- [ ] viewer no puede crear, actualizar ni borrar;
- [ ] agente solo puede modificar los recursos permitidos;
- [ ] administrador puede gestionar membresías según su alcance;
- [ ] usuario sin suite habilitada no puede acceder a sus rutas;
- [ ] service role solo se usa en funciones server-side justificadas;
- [ ] documentos y mensajes no son accesibles por URL pública;
- [ ] logs y errores no contienen secretos ni datos sensibles.

La matriz RLS debe ejecutarse contra una base Supabase efímera de integración en GitHub Actions con usuarios y organizaciones ficticias. Los tests deben verificar tanto llamadas directas a PostgREST como llamadas desde la aplicación.

#### End-to-end

Crear una suite Playwright o equivalente para los flujos críticos:

- [ ] login, logout y expiración de sesión;
- [ ] selección de organización y marca;
- [ ] acceso restringido a una suite;
- [ ] creación de campaña;
- [ ] creación y avance de lead en pipeline;
- [ ] creación de cotización;
- [ ] carga de documento;
- [ ] recepción de webhook y aparición de conversación;
- [ ] respuesta de agente por WhatsApp en entorno de prueba;
- [ ] usuario de Zona Médica viendo únicamente Health OS;
- [ ] navegación móvil de los workspaces principales.

Los tests E2E nunca deben usar producción ni números reales de WhatsApp. Deben utilizar datos seed anonimizados y un proyecto Supabase de integración.

#### Contratos y APIs

- [ ] Validar request y response de cada Route Handler.
- [ ] Probar compatibilidad hacia atrás de contratos compartidos.
- [ ] Probar idempotencia de webhooks y jobs.
- [ ] Probar códigos HTTP, rate limit y payloads demasiado grandes.
- [ ] Probar errores de proveedores y respuestas parciales.
- [ ] Versionar contratos que puedan consumir webs públicas o clientes externos.

#### Rendimiento y resiliencia

- [ ] Pruebas de carga de login y navegación del shell.
- [ ] Pruebas de listas CRM de 1.000, 10.000 y 100.000 contactos.
- [ ] Índices y `EXPLAIN` para filtros y búsquedas.
- [ ] Pruebas de concurrencia al actualizar un lead.
- [ ] Pruebas de duplicados y reintentos de webhook.
- [ ] Timeouts para APIs externas.
- [ ] Circuit breaker o backoff en integraciones críticas.
- [ ] Límites de tamaño para archivos y payloads.
- [ ] Verificación de cold start aceptable en Render y Edge Functions.

#### Migraciones y recuperación

- [ ] `supabase db reset` sobre una base limpia en el runner de CI.
- [ ] Aplicación completa de migraciones en staging.
- [ ] `supabase db push --dry-run` antes de cada despliegue.
- [ ] Verificación de que no existen cambios manuales sin migración.
- [ ] Prueba de rollback de aplicación con migración compatible.
- [ ] Restauración de backup en entorno de prueba.
- [ ] Comprobación de seed sin datos reales.

### Datos de prueba

- [ ] Seeds deterministas para organizaciones, usuarios, roles, marcas y módulos.
- [ ] Datos anonimizados de seguros y CRM.
- [ ] Payloads reales anonimizados de WhatsApp.
- [ ] Fixtures de errores y casos límite.
- [ ] Ningún email, teléfono o documento real en tests automatizados.

## GitHub Actions y automatización CI/CD

El repositorio usa workflows pequeños y auditables para calidad y despliegue del SaaS, evitando un único workflow monolítico.

### `.github/workflows/ci.yml`

Ejecutar en cada pull request y push a `develop` y `main`:

- [ ] checkout del repositorio;
- [ ] Node.js 20 fijado;
- [ ] pnpm 9 fijado;
- [ ] cache de pnpm y Turbo;
- [ ] `pnpm install --frozen-lockfile`;
- [ ] `pnpm lint`;
- [ ] `pnpm typecheck`;
- [ ] `pnpm test -- --coverage`;
- [ ] publicar reporte de cobertura;
- [ ] `pnpm build`;
- [ ] guardar artefactos de logs y cobertura en caso de fallo.

El workflow debe usar permisos mínimos (`contents: read`) y concurrencia por rama para cancelar ejecuciones obsoletas.

### `.github/workflows/supabase-validate.yml`

Ejecutar en pull requests que modifiquen `supabase/**`, contratos o servicios de datos:

- [ ] instalar versión fijada de Supabase CLI;
- [ ] validar `supabase/config.toml`;
- [ ] comprobar nombres y orden de migraciones;
- [ ] iniciar Supabase efímero en GitHub Actions;
- [ ] ejecutar `supabase db reset` en CI;
- [ ] ejecutar tests de RLS y funciones;
- [ ] generar tipos y comprobar que no hay diff inesperado;
- [ ] verificar `supabase db push --dry-run`;
- [ ] publicar resumen de migraciones en el PR.

### `.github/workflows/supabase-staging.yml`

Ejecutar tras mergear a `develop`:

- [ ] autenticar con un token de proyecto almacenado como secret;
- [ ] enlazar explícitamente el proyecto dev;
- [ ] ejecutar migraciones pendientes;
- [ ] desplegar Edge Functions modificadas;
- [ ] ejecutar smoke tests contra staging;
- [ ] detener el pipeline si falla una migración;
- [ ] publicar URL y commit desplegado.

### `.github/workflows/deploy-staging.yml`

Ejecutar tras pasar CI en `develop`:

- [ ] disparar deploy de `loopdev-os-staging` mediante Render CLI/API;
- [ ] esperar estado healthy;
- [ ] verificar `/api/health`;
- [ ] ejecutar smoke E2E contra staging;
- [ ] registrar commit, versión y migración aplicada.

### `.github/workflows/deploy-production.yml`

Ejecutar únicamente desde `main` protegido y con aprobación del environment `production`:

- [ ] exigir CI verde y revisión aprobada;
- [ ] generar changelog y artefactos de release;
- [ ] ejecutar `supabase db push --dry-run` contra producción;
- [ ] crear backup o verificar backup reciente;
- [ ] aplicar migraciones compatibles;
- [ ] desplegar Edge Functions;
- [ ] desplegar servicio Render de producción;
- [ ] esperar health check y smoke tests;
- [ ] publicar release y commit desplegado;
- [ ] activar rollback si falla la verificación post-deploy.

Nunca se deben ejecutar migraciones destructivas automáticamente sin una aprobación explícita y un plan de recuperación.

### `.github/workflows/e2e.yml`

- [ ] levantar la aplicación con configuración de integración;
- [ ] ejecutar Playwright en navegadores principales;
- [ ] guardar screenshots, traces y vídeos en fallo;
- [ ] usar seed y usuarios de prueba;
- [ ] separar pruebas públicas, backoffice y permisos;
- [ ] ejecutar smoke en staging después del deploy.

### `.github/workflows/security.yml`

- [ ] CodeQL para TypeScript/JavaScript;
- [ ] Dependency Review en pull requests;
- [ ] `pnpm audit` con política de severidad documentada;
- [ ] secret scanning y detección de tokens;
- [ ] escaneo de imágenes Docker cuando existan;
- [ ] comprobación de archivos `.env`, claves y certificados;
- [ ] escaneo de migraciones en busca de políticas públicas accidentales;
- [ ] comprobación de dependencias desactualizadas en una tarea programada.

### `.github/workflows/performance.yml`

Ejecutar en `main` o de forma programada:

- [ ] Lighthouse sobre rutas públicas;
- [ ] medición de Web Vitals;
- [ ] presupuesto de JavaScript por suite;
- [ ] comprobación de tamaño de imágenes;
- [ ] smoke de tiempos de respuesta de APIs;
- [ ] alertar si una regresión supera los límites definidos.

### `.github/workflows/dependency-review.yml` y Dependabot

- [ ] habilitar Dependabot para npm/pnpm y GitHub Actions;
- [ ] agrupar actualizaciones menores;
- [ ] exigir revisión para Next.js, Supabase, Auth y acciones de CI;
- [ ] revisar cambios mayores en una rama dedicada;
- [ ] mantener acciones fijadas por versión o SHA cuando el riesgo lo justifique.

### Protección del repositorio

- [ ] proteger `main`;
- [ ] exigir pull request y al menos una revisión;
- [ ] exigir `ci`, seguridad y migraciones verdes;
- [ ] impedir push directo;
- [ ] proteger environment `production`;
- [ ] restringir secrets a los workflows necesarios;
- [ ] usar OIDC cuando el proveedor lo soporte;
- [ ] revisar colaboradores y tokens trimestralmente.

## Pruebas de despliegue y operación

Después de cada despliegue:

- [ ] comprobar endpoint de salud;
- [ ] comprobar login y refresh de sesión;
- [ ] comprobar lectura de organización actual;
- [ ] comprobar una consulta protegida por RLS;
- [ ] comprobar una ruta de suite habilitada;
- [ ] comprobar que una suite no habilitada devuelve acceso denegado;
- [ ] comprobar que no hay errores JavaScript en el navegador;
- [ ] comprobar logs de Render y Supabase;
- [ ] comprobar webhook y Edge Functions si están modificados;
- [ ] comprobar métricas y alertas.

## SLOs iniciales y métricas

Definir antes del piloto:

- disponibilidad objetivo del backoffice;
- tiempo máximo de respuesta de login;
- tiempo de carga inicial del shell;
- latencia objetivo de búsquedas CRM;
- tiempo máximo de aceptación de webhook;
- porcentaje máximo de errores de envío WhatsApp;
- tiempo de recuperación ante fallo;
- tiempo máximo para revocar un usuario o secreto.

Crear dashboards y alertas para:

- errores 5xx;
- errores de Auth;
- fallos RLS;
- migraciones fallidas;
- webhooks rechazados o duplicados;
- jobs atrasados;
- consumo de Render y Supabase;
- espacio de Storage;
- rendimiento de consultas.

### Quality gates

- [ ] `pnpm lint` sin errores.
- [ ] `pnpm typecheck` sin errores.
- [ ] `pnpm test` sin errores.
- [ ] Cobertura superior al 80% en código nuevo.
- [ ] Matriz RLS automatizada en verde.
- [ ] Ningún secreto en el bundle o repositorio.
- [ ] Migraciones ejecutables desde una base limpia.
- [ ] Rutas protegidas y navegación por permisos.
- [ ] Pruebas de aislamiento entre organizaciones.
- [ ] Pruebas de webhook e idempotencia.
- [ ] Pruebas responsive de los workspaces principales.
- [ ] Logs y errores sin datos sensibles.
- [ ] Rollback documentado.

## Estrategia de migración desde VitaBlue

### Se traslada a LoopDev

- Marketing Studio.
- campañas, assets y copias;
- conexiones sociales y OAuth;
- CRM y seguimiento comercial;
- catálogo de seguros;
- elegibilidad, ranking y cotización;
- operaciones, documentos y onboarding;
- requisitos de WhatsApp Business;
- consentimiento y atribución.

### Permanece inicialmente en VitaBlue

- landing pages;
- blog y SEO;
- web pública;
- formularios y wizard público mientras se estabiliza la API;
- identidad visual pública de VitaBlue.

### Regla de migración

No se fusionarán repositorios copiando carpetas completas. Cada capacidad se migrará a un módulo de LoopDev con:

- contrato compartido;
- persistencia multi-tenant;
- permisos;
- pruebas;
- documentación;
- observabilidad.

## Observabilidad y operación

- logs estructurados con `organization_id`, `brand_id`, `request_id` y actor;
- no registrar tokens, payloads sensibles ni documentos completos;
- alertas para errores de webhook, fallos OAuth y acumulación de tareas;
- métricas de latencia, errores, conversaciones, leads y conversiones;
- auditoría de acciones administrativas;
- runbooks para incidentes, rotación de secretos y restauración;
- revisión mensual de costes de Render y Supabase.

## Riesgos y mitigaciones

### Fuga entre organizaciones

**Riesgo:** una consulta sin filtro permite ver datos ajenos.  
**Mitigación:** RLS por membresía, tests negativos y prohibición de confiar solo en el frontend.

### Migrar la base sucia a producción

**Riesgo:** arrastrar tablas, políticas o datos experimentales.  
**Mitigación:** producción limpia generada desde migraciones aprobadas.

### Duplicación de Marketing Studio

**Riesgo:** dos fuentes de verdad divergen.  
**Mitigación:** LoopDev es la implementación canónica; VitaBlue aporta dominio y datos.

### Exceso de alcance

**Riesgo:** intentar CRM, WhatsApp, Operations y Health OS simultáneamente.  
**Mitigación:** completar Platform Core primero y entregar una suite vertical por incrementos.

### Dependencia de mocks

**Riesgo:** una demo oculta errores de red o autorización.  
**Mitigación:** mocks solo en fixtures y tests, nunca como fallback silencioso en producción.

### Costes de infraestructura

**Riesgo:** crear múltiples servicios o previews sin control.  
**Mitigación:** un servicio web inicial, staging pequeño, límites de gasto y previews solo cuando aporten valor.

## Criterios de aceptación finales

- Una organización puede tener varias marcas sin mezclar datos.
- Un usuario puede pertenecer a varias organizaciones con permisos distintos.
- Una organización puede habilitar solo Health OS.
- VitaBlue y Protege tu Salud comparten plataforma, pero conservan identidad y datos separados.
- Marketing Studio funciona sin duplicar implementaciones.
- CRM, cotizaciones y operaciones son persistentes y auditables.
- WhatsApp inbound crea una conversación y un lead sin duplicados.
- Ningún secreto se expone al navegador.
- Las políticas RLS impiden accesos cruzados incluso mediante API directa.
- Staging usa Supabase dev y producción usa Supabase prod.
- Render despliega `develop` en staging y `main` en producción.
- El esquema de producción puede reconstruirse desde Git.
- Existe rollback, backup, observabilidad y documentación operativa.
- El equipo puede incorporar una nueva empresa sin copiar la aplicación ni crear un fork.

## Herramientas de planificación y operación del desarrollo

La gestión del upgrade se realizará inicialmente dentro de GitHub, evitando duplicar el trabajo entre Jira y GitHub mientras el equipo sea reducido.

- **Conductor track:** fuente de verdad estratégica para arquitectura, fases, decisiones, riesgos y criterios de aceptación.
- **GitHub Projects:** roadmap y tablero operativo del proyecto `LoopDev SaaS Upgrade`.
- **GitHub Issues:** tareas ejecutables, bugs, deuda técnica, decisiones y trabajos de infraestructura.
- **Pull Requests:** implementación revisable, siempre enlazada a una Issue mediante `Closes #...`.
- **GitHub Actions:** linting, tests, seguridad, migraciones, E2E, builds y gates de despliegue.
- **GitHub CLI (`gh`):** herramienta oficial instalada y autenticada para gestionar repositorios, Issues, Pull Requests, Projects y Actions desde terminal.

La cuenta operativa actual es `minoveaz`; la autenticación se verificó mediante `gh auth status` y una llamada real a `gh api user`. Los permisos actuales incluyen `repo`, `workflow`, `read:org` y `gist`. No se deben incluir tokens en el repositorio, logs ni documentación.

Comandos base documentados para el equipo:

```powershell
gh auth status
gh project list --owner minoveaz
gh project view <PROJECT_NUMBER> --owner minoveaz --web
gh issue create --repo minoveaz/loopdev --title "..." --body "..."
gh project item-add <PROJECT_NUMBER> --owner minoveaz --url <ISSUE_OR_PR_URL>
```

Jira o una herramienta equivalente se evaluarán cuando existan varios equipos, soporte operativo, SLAs, auditoría formal o flujos de atención a clientes. En ese caso, Jira podrá cubrir operaciones y soporte, mientras GitHub seguirá siendo la fuente de verdad del código, PRs y CI/CD.

## Estado de la base local de calidad

Antes de activar los gates obligatorios se ha instalado el monorepo con Node 20 y pnpm 9.0.0, y se han ejecutado los comandos definidos para el equipo.

- La configuración Vitest se migró de `defineWorkspace` a `test.projects`, formato compatible con Vitest 4.
- La suite actual descubre 205 tests: 190 pasan y 15 fallan en componentes UI existentes; esos fallos deben convertirse en Issues y no ocultarse.
- ESLint 9 tiene configuración flat compartida en la raíz y los scripts ya no silencian errores con `|| echo`; quedan errores heredados en `loopdev-os` que deben resolverse antes de exigir CI verde.
- TypeScript detecta dependencias y tipos heredados pendientes en Design System y workspaces auxiliares.
- El build de Next.js compila cuando se habilitan los certificados TLS del sistema; cada app usa un único router (App Router) y los workspaces de aplicación deben tener una implementación real.
- El build de `loopdev-os` todavía requiere sanear contratos de Quant Ops (`useBotFleet`, `BotCardItem`, inspectores y formularios) antes de poder exigir el build productivo como gate.
- El workflow CI ya está creado para ejecutar instalación congelada, lint, typecheck, tests con cobertura y build en Pull Requests y en `develop`/`main`. No se debe activar la protección definitiva de ramas hasta cerrar este baseline.

### Cierre de Fase 1C — baseline de deuda heredada (2026-08-06)

Storybook queda fuera del producto, del arranque local y de CI. Los 164 archivos legacy sin consumidores activos fueron eliminados del Design System; no quedan componentes legacy versionados en las superficies de producto.

El baseline final de Knip queda registrado con 169 archivos no usados, 2 dependencias, 1 devDependency, 14 dependencias no listadas, 2 imports no resueltos, 8 exports, 36 tipos exportados y 4 exports duplicados. El baseline final de jscpd queda en 111 clones, 1.529 lineas duplicadas (1,86%) y 9.572 tokens duplicados (2,06%). Son deuda preexistente clasificada; no se realizan eliminaciones o extracciones mecanicas sin validacion semantica.

Con esta clasificacion, la Fase 1C queda cerrada y la siguiente fase es Platform Core y tenancy real.

## Arranque local reproducible

Los aliases personales de cada ordenador no son la fuente de verdad. El repositorio incluye `scripts/dev/start-loopdev.mjs` y comandos pnpm compartidos:

```powershell
pnpm start:loopdev
pnpm start:loopdev:full
pnpm start:loopdev:ui
```

El arranque estándar levanta LoopDev OS usando el proyecto remoto Supabase de desarrollo configurado en `.env.local`; no requiere Docker. La validación de migraciones y RLS se ejecuta exclusivamente en GitHub Actions mediante el workflow de Supabase. Cualquier nuevo servicio local debe documentarse en `CONTRIBUTING.md`.

### Fase 1D — Eliminacion total de deuda estatica

Esta fase es obligatoria antes de iniciar Platform Core. Su objetivo es que la deuda detectada por Knip, jscpd y los chequeos de dependencias quede a cero o tenga una justificacion tecnica explicita aprobada.

- [x] Ejecutar Knip por workspace y clasificar cada archivo no usado.
- [x] Eliminar archivos confirmados como muertos y registrar excepciones justificadas.
- [x] Resolver los imports no encontrados y dependencias no listadas.
- [x] Eliminar dependencias y devDependencies sin uso confirmado.
- [x] Revisar exports y tipos exportados no consumidos; conservar solo APIs publicas documentadas.
- [x] Resolver exports duplicados y entradas duplicadas de barril.
- [x] Revisar los clones de jscpd por porcentaje y tamano, extrayendo solo semantica realmente compartida.
- [x] Repetir la auditoria hasta obtener Knip limpio y jscpd dentro del umbral acordado.
- [x] Actualizar `quality:static`, CI y el track con baseline cero.
- [x] Ejecutar typecheck, lint, tests, build y quality gates completos.

**Criterio de salida:** Knip no reporta archivos, dependencias, imports ni exports no justificados; jscpd no reporta duplicacion evitable; todos los quality gates pasan y la deuda restante, si existe, esta documentada como API publica o excepcion tecnica.

#### Estado de ejecucion (2026-08-06)

- [x] Knip ejecutado sobre el monorepo: 0 archivos no usados, 0 dependencias no usadas, 0 imports no resueltos, 0 exports/tipos sin consumidor y 0 duplicados reportados.
- [x] Eliminados Storybook residual, `mod-architect` sin consumidores, fixtures historicos, helpers duplicados, modulos Supabase/API muertos y dependencias sin uso.
- [x] Verificados `typecheck`, tests (51 archivos / 205 tests), lint y build de `loopdev-os`.
- [x] Formato, clases y auditoria estatica pasan en `quality:static`.
- [x] jscpd queda en 24 clones despues de extraer las abstracciones semánticas de CRM, BotCard, layouts, tablas y payloads de bots. Los clones restantes son shells de suites, tablas con columnas distintas, indicadores visuales con modelos propios y scripts Python con flujos independientes.

La Fase 1D queda cerrada: la matriz final de 24 excepciones técnicas está registrada en `conductor/jscpd-exceptions.md`; no quedan clones TypeScript consolidables sin revisar.

#### Clasificacion de clones jscpd (2026-08-06)

- **Consolidables ya resueltos:** wrappers y cabeceras de layouts; variantes de `BotCard`; estados de tablas; indicadores tácticos; `BotMetricsDashboard`; `useBotFleet`; `LeadDetailContext`; regla de leads estancados y payloads de bots.
- **Excepciones técnicas restantes (24 clones):** shells de layouts por suite, filas/columnas específicas de tablas, `CertificationStamp`/`InfraStamp`, `UserMenu`/`QuickActionMenu`, estrategias y analizadores Quant, y los dos ingestors.
- **Criterio de aceptación:** los 24 clones restantes no comparten un contrato semántico seguro; se mantienen visibles en jscpd y quedan sujetos a revisión cuando cambie su dominio.
- **Criterio:** solo se marca como resuelto un clone cuando existe una abstracción compartida con nombres y props claros; no se sube el umbral de jscpd ni se ignoran archivos para maquillar el resultado.
- **Excepciones revisadas:** `UserMenu` y `QuickActionMenu` son superficies de interacción distintas; `CertificationStamp` e `InfraStamp` representan estados de marca distintos; `aggressive_rsi` e `hybrid_core` son estrategias independientes; los dos ingestors tienen ciclos operativos distintos; las tarjetas LONG/SHORT y los layouts de suite conservan diferencias de dominio.

## Decisiones pendientes

- Confirmar el nombre definitivo del tenant de Estar Protegidos.
- Definir si `organization` y `tenant` serán sinónimos en contratos y base de datos.
- Definir los roles exactos del primer equipo operativo.
- Confirmar si Zona Médica tendrá proyecto Supabase separado desde el inicio de Health OS.
- Confirmar el proveedor de documentos y OCR.
- Confirmar las colas o workers necesarios para WhatsApp y documentos.
- Definir dominios definitivos de staging y producción.
- Definir política de retención y borrado de datos.
- Definir backups y plan de recuperación antes de activar clientes.
- Definir el primer vertical que se llevará a producción después del Platform Core.
