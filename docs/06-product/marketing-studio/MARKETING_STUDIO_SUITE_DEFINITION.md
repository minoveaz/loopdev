---
suite_id: marketing-studio
title: Marketing Studio
status: proposed
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
lead: null
branch: docs/suite-definition-alignment
implementation_branch: null
---

# Marketing Studio

## Intent

### Problem

Las organizaciones necesitan convertir una intención de marketing en una experiencia de marca,
contenido y campaña coherentes, medibles y aprobables. Las herramientas existentes suelen separar
la identidad de marca, la creación, la planificación, la publicación y la relación con resultados
comerciales.

Marketing Studio propone un espacio de trabajo para gobernar ese ciclo sin convertirse en un CRM,
un editor multimedia obligatorio ni una colección de integraciones acopladas a proveedores.

### Target users

- Marketing managers que planifican campañas y resultados.
- Brand managers que gobiernan identidad, reglas y recursos aprobados.
- Creativos que producen piezas de imagen, vídeo y plantillas.
- Content managers que redactan, versionan y coordinan aprobaciones.
- Reviewers y stakeholders que revisan contenido sin necesitar permisos de edición.
- Administradores que gestionan acceso, políticas, conexiones y auditoría.

### Value and success signal

El valor es permitir que un equipo pase de contexto de marca a contenido aprobado y campaña
trazable con menos duplicación y menos publicación no autorizada.

La señal inicial de éxito será que organizaciones piloto puedan completar un flujo documentado de
marca, creación, revisión y planificación de campaña, con aislamiento tenant-aware, auditoría y
trazabilidad hacia CRM cuando exista una conversión.

## Product context

Marketing Studio es una propuesta futura. El Marketing Studio legacy fue archivado y eliminado del
producto activo. Esta definición no reactiva ni migra la implementación anterior.

El producto vigente prioriza Sales & CRM. Quant Ops permanece como experiencia experimental/lab.
Marketing Studio puede reabrirse como una suite futura después de los gates de producto y capacidad
establecidos por el roadmap de ejecución.

## Evidence from VitaBlue

VitaBlue es una fuente de evidencia funcional para diseñar los primeros verticales, no una fuente
autoritativa de contratos, tenancy, seguridad o composición de LoopDev. La revisión del repositorio
privado `minoveaz/vitablue` en su rama `main` identificó:

### Image Studio

- Editor visual basado en canvas/Konva con capas, selección, inspector, panel de capas y edición de
  texto inline.
- Catálogos de elementos, bloques de marketing, formas, logos, plantillas, layouts, media, brand
  kit y diseños guardados.
- Proyectos con presets y formatos, historial, validación, exportación y bridge hacia vídeo.
- Tests de editor, sistema visual, snapping, bloques y catálogos.

### Video Studio

- Stage de vídeo, timeline, escenas, capas, inspector, toolbar, controles de transporte y edición
  contextual.
- Subtítulos, audio, timing por frames, animaciones, transiciones, safe zones y formatos vertical,
  square y landscape.
- Paquete `packages/video-studio` con dominio de proyectos/storyboards, plantillas, motion kit,
  composiciones Remotion, render jobs y almacenamiento de artefactos.
- Tests de storyboard, motion kit, validación de escenas y snapshots visuales desktop/mobile.

### Reglas de reutilización

La evidencia de VitaBlue se utilizará para recuperar journeys, capacidades y riesgos ya explorados.
La migración a LoopDev deberá rediseñar los contratos sobre Platform Core, usar las fronteras de
`AppShell`/`SuiteShell`/`SuiteCanvas`, resolver tenancy y permisos server-side y separar proyectos
editables, assets exportados, contenidos aprobados y artefactos renderizados. No se copiarán
automáticamente `BackofficeShell`, rutas, `localStorage`, contratos, providers ni decisiones de
persistencia de VitaBlue.

## Domain boundary

### Included

- Contexto e identidad de marca publicada.
- Recursos digitales gobernados y reutilizables.
- Proyectos y piezas creativas.
- Contenido editorial y sus versiones.
- Campañas, objetivos, calendario y relaciones con contenido.
- Flujos de revisión y aprobación específicos de marketing.
- Publicación e integraciones mediante adapters explícitos.
- Métricas de marketing y eventos atribuibles con evidencia.
- Automatizaciones de marketing cuando exista un contrato durable de ejecución.

### Excluded

- Contactos, leads, oportunidades y revenue como entidades propietarias de Marketing Studio.
- CRM general, pipeline comercial y Customer 360.
- Email transport y conversaciones como infraestructura propietaria.
- Infraestructura de IA compartida, modelos o secretos de proveedores.
- Identity/auth, memberships, permisos base, billing y entitlements de plataforma.
- Editor multimedia completo como requisito de la primera fase.
- Publicación multicanal, social inbox, social listening y atribución financiera avanzada en la
  primera entrega.
- Reactivación, reutilización autoritativa o migración automática del Marketing Studio legacy.

### Adjacent suites and ownership

| Capability | Owning suite | Boundary |
| --- | --- | --- |
| Contacts, leads, opportunities, revenue | Sales & CRM | CRM owns commercial entities; Marketing consumes approved references and returns marketing events or attribution evidence. |
| Email delivery and conversations | Communications | Communications owns transport, delivery, consent enforcement and conversation state. |
| Auth, memberships, permissions, audit base | Platform Core | Marketing adds domain policies without duplicating platform authorization. |
| AI models, provider gateway and budget controls | AI Platform | Marketing defines creative use cases and approval rules; AI Platform owns execution infrastructure. |
| Durable jobs and workflow execution | Workflow / Platform Core | Marketing declares job intent and idempotency; shared infrastructure owns workers, retries and recovery. |
| Generic analytics and event transport | Analytics Platform | Marketing owns semantic marketing events and interpretation of campaign metrics. |
| External channels and provider credentials | Integration Hub | Provider adapters, OAuth secrets and connection health are server-side responsibilities. |

## Module map

### Conceptual suite map

```text
Marketing Studio
├── Brand Hub
├── Creative Studio
│   ├── Image Studio
│   ├── Video Studio
│   ├── Template Studio
│   ├── Brand Composer
│   └── AI Creative Assistant
├── Asset Library
├── Content Engine
├── Campaign Orchestrator
├── Publishing & Integrations
├── Marketing Insights
├── Marketing Automation
└── Compliance & Governance
```

Creative Studio y Asset Library son módulos hermanos. Creative Studio crea proyectos y piezas;
Asset Library gobierna recursos, versiones, permisos y reutilización. Un proyecto editable, un
asset exportado, un contenido aprobado y una publicación son objetos distintos.

### Initial modules and first verticals

| Module | Purpose | Priority | Dependency | Definition status |
| --- | --- | --- | --- | --- |
| Brand Hub | Publicar contexto, identidad y reglas de marca | Foundation | Platform Core | Proposed |
| Asset Library | Gobernar recursos digitales reutilizables | Foundation | Brand Hub, Storage | Proposed |
| Creative Studio | Coordinar experiencias especializadas de creación | Container | Brand Hub, Asset Library | Proposed |
| Image Studio | Crear y versionar piezas estáticas | P0 first vertical | Creative Studio, Asset Library | Proposed |
| Video Studio | Crear y versionar piezas audiovisuales | P0 first vertical | Creative Studio, Asset Library | Proposed |
| Content Engine | Redactar, versionar y revisar contenido | P1 | Brand Hub, Asset Library | Proposed |
| Campaign Orchestrator | Coordinar objetivos, contenido y calendario | P1 | Content Engine, CRM references | Proposed |

Template Studio, Brand Composer y AI Creative Assistant permanecen como capacidades conceptuales
posteriores de Creative Studio hasta que cada una tenga alcance, dependencia, contrato y criterio
de valor propios. Creative Studio es el contenedor funcional; Image Studio y Video Studio son sus
primeros verticales implementables y conservarán autonomía para evolucionar internamente.

### Internal evolution model for Image Studio and Video Studio

Image Studio y Video Studio no se tratarán como productos cerrados con un catálogo de funcionalidades
fijado por esta definición. Sus equipos podrán experimentar y mejorar de forma continua sus editores,
flujos, automatizaciones, asistencia de IA, plantillas, presets, formatos, renderizado y mecanismos
de reutilización, siempre orientados a generar assets de alta calidad con la menor fricción y el menor
tiempo posible.

La suite solo fija los límites que deben permanecer estables entre iteraciones:

- Cada vertical mantiene su propio roadmap interno, hipótesis, prototipos y criterios de aprendizaje.
- Las mejoras pueden avanzar dentro del vertical sin requerir una nueva definición de suite por cada
  funcionalidad.
- Las integraciones externas deben pasar por contratos y adapters aprobados; no se acoplan directamente
  a providers, secretos ni infraestructura de otra suite.
- Persisten las fronteras de Platform Shell, tenancy, autorización server-side, auditoría, observabilidad,
  accesibilidad y separación entre proyectos, assets, contenidos aprobados y artefactos renderizados.
- Las capacidades que se conviertan en contratos compartidos o que creen dependencia con otro módulo
  requieren una revisión de impacto antes de promoverse fuera del vertical.

El objetivo de readiness no es demostrar que el diseño funcional está terminado. Es demostrar que cada
vertical puede evolucionar con seguridad, medir sus resultados y entregar una primera experiencia
coherente de generación rápida y eficiente de assets.

### Future modules

| Module | Reason to defer | Dependency or gate |
| --- | --- | --- |
| Publishing & Integrations | Requiere proveedor inicial, OAuth server-side, permisos, retries e idempotencia | Integration Hub, secretos autorizados y contrato del proveedor |
| Marketing Insights | Métricas y atribución requieren eventos confiables y definiciones comunes | Analytics Platform y contrato de atribución con CRM |
| Marketing Automation | Requiere ejecución durable, consentimiento, límites y recuperación | Workflow, Communications y reglas de compliance |
| Compliance & Governance | Parte de sus capacidades es transversal y debe evitar duplicar Platform Core | Matriz de ownership, políticas de marketing y auditoría aprobadas |

## Recommended sequence

```text
Brand Hub
    ↓
Asset Library <-> Creative Studio
    ↓
Content Engine
    ↓
Campaign Orchestrator
    ↓
Publishing & Integrations
    ↓
Marketing Insights
    ↓
Marketing Automation
```

Compliance & Governance opera transversalmente sobre el flujo. Publishing, Insights y Automation no
se consideran autorizados para implementación solo por aparecer en el mapa conceptual.

## Suite experience

### Entry point

La suite tendrá una entrada propia en Launchpad solo cuando exista una definición aprobada, un
primer módulo implementable y un gate explícito de activación. Mientras esté propuesta, debe
permanecer fuera de las suites activas del producto.

### Navigation and global context

La experiencia futura usará `AppShell`, `SuiteShell`, `SuiteRuntime`, `SuiteCanvas` y los esquemas
de navegación de Platform. El contexto global podrá incluir organización, workspace, marca activa y
estado de permisos. No se crearán headers, sidebars o rails paralelos.

La navegación inicial propuesta es:

```text
Brand Hub → Asset Library → Creative Studio → Image Studio / Video Studio → Content Engine → Campaign Orchestrator
```

Las áreas de publicación, insights, automatización y governance se habilitarán cuando sus gates se
cumplan.

### Primary workspaces

- `overview`: entrada y resumen de trabajo pendiente.
- `data`: bibliotecas, contenidos y campañas listables.
- `record`: detalle de marca, asset, contenido o campaña.
- `split`: lista con inspector para revisión y selección.
- `focus`: creación o edición concentrada.
- `board`: planificación visual de campaña cuando el contrato lo justifique.

La receta se elegirá por flujo y no por nombre del módulo.

### States and transitions

Cada vista debe definir estados `loading`, `empty`, `error`, `forbidden` y `success`. Las
mutaciones sensibles deben mostrar confirmación, error trazable y resultado idempotente cuando
corresponda.

El flujo de contenido propuesto es:

```text
Draft → In Review → Changes Requested → Approved → Scheduled → Published
                                      ↘ Failed / Archived
```

Un cambio posterior a la aprobación debe invalidar la aprobación de la versión anterior.

## Contracts and security

### Canonical entities and ownership

Las entidades candidatas son:

- `Brand` y `BrandVersion`: Brand Hub.
- `Asset` y `AssetVariant`: Asset Library.
- `CreativeProject` y `CreativeVersion`: Creative Studio.
- `ContentItem` y `ContentVersion`: Content Engine.
- `Campaign` y `CampaignItem`: Campaign Orchestrator.
- `Approval` y `ReviewComment`: governance de marketing.
- `ChannelConnection` y `Publication`: Publishing & Integrations.
- `MarketingEvent` y `AttributionRecord`: Insights, con referencias hacia CRM.

Estas son entidades de diseño, no contratos aprobados ni instrucciones para crear schema.

### Tenancy and isolation

Cada módulo deberá documentar su ámbito real entre organización, workspace, marca y usuario. No se
asumirá que todas las entidades requieren los mismos identificadores ni que `brandId` siempre sea
obligatorio. Las consultas y mutaciones resolverán el ámbito autorizado server-side y las
referencias cross-tenant serán imposibles por contrato, validación y RLS cuando exista persistencia.

### Roles and permissions

Los roles iniciales a validar son:

- Admin: configuración, acceso, conexiones y políticas.
- Marketer: campañas, contenido y programación autorizada.
- Creative: proyectos y piezas creativas.
- Reviewer: comentarios y aprobaciones permitidas.
- Viewer: lectura sin mutaciones.

Son roles conceptuales. Los permisos canónicos se definirán por módulo y acción antes de crear
cualquier implementación.

### Events and integrations

Los eventos de marketing deben ser tipados, idempotentes y auditables. CRM conserva la propiedad
de contactos, leads, oportunidades y conversiones. Los proveedores externos se integran mediante
adapters server-side; sus versiones, cuotas y capacidades se validarán contra documentación oficial
antes de convertirse en decisiones permanentes.

### Audit and retention

Se debe registrar quién creó, revisó, aprobó, publicó, archivó o modificó cada versión relevante.
Los assets con derechos o expiración requieren política de retención y bloqueo de uso. Consentimiento,
preferencias de comunicación y datos personales permanecen bajo las capacidades propietarias
correspondientes.

## Component reuse and impact

### Existing components

La futura implementación deberá auditar y reutilizar primitives y composiciones existentes de
`@loopdev/ui`, especialmente `SuiteRuntime`, `SuiteCanvas`, `ModuleWorkspace`, headers, toolbars,
inspectors, tablas, filtros, formularios, estados y dialogs accesibles.

### New components justified

Solo se justificarán componentes de suite cuando el flujo de marketing tenga necesidades que no
puedan componerse con el Design System. La promoción a `@loopdev/ui` requerirá un segundo consumidor
real y evidencia de certificación.

### Duplicate risks

- Reactivar componentes o rutas del Marketing Studio legacy por similitud de nombre.
- Duplicar Storage, OAuth, permisos, auditoría, jobs o analytics de Platform Core.
- Convertir Creative Studio en dueño del lifecycle de assets.
- Convertir Content Engine en dueño de publicación o transporte.
- Crear un sidebar propio para la suite.

### Package, registry, migration, and operational impact

Estado actual de la propuesta:

```text
Contracts: planned
Schema: planned
RLS: planned
Storage: planned
Secrets/providers: planned
AI: planned
Billing/entitlements: planned
Observability: planned
Rollout/rollback: planned
```

No se crean paquetes de código, registros de suite, migraciones, buckets, secretos ni rutas como
parte de esta definición conceptual.

## Module-definition evidence

Pendiente. Los módulos iniciales requieren el paquete de cinco documentos antes de cualquier
handoff de implementación:

- UX specification: pending
- Component audit: pending
- Domain contract: pending
- Impact assessment: pending
- Implementation handoff: pending

## Phases and readiness

| Phase | Objective | Deliverables | Validation | Exit criteria |
| --- | --- | --- | --- | --- |
| Definition | Acordar frontera y mapa de suite | Este documento, README, decisiones y riesgos | Revisión Product Owner/Tech Lead, links y track validation | Alcance y mapa aprobados |
| Foundation | Definir Brand Hub, Asset Library y el contenedor Creative Studio | Paquetes documentales de foundation y Creative Studio | UX, component, contract, impact y security reviews | Foundations Ready |
| First vertical | Habilitar la evolución autónoma de Image Studio y Video Studio y validar su primera experiencia | Paquetes de módulos, fixtures sintéticos y journeys UAT | Contratos, aislamiento, estados UX, capacidad de medición y evidencia VitaBlue | Ambos verticales pueden iterar con seguridad y generar assets de forma rápida y eficiente |
| Integrations | Añadir publicación y CRM attribution controladas | Adapter contract, events y runbooks | Provider, security, idempotency y observability checks | Un proveedor y atribución verificables |
| Readiness | Preparar activación futura | Issue, Project, rollout, rollback y evidencia | Checklist de suite completa | Aprobación explícita antes de código |

## Decisions, risks, and dependencies

### Approved decisions

Ninguna aprobación de implementación. La estructura conceptual queda propuesta para revisión; el
Marketing Studio legacy no es una dependencia ni una fuente autoritativa.

### Risks and blockers

| Risk or blocker | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Alcance demasiado amplio | Retrasa el primer vertical | Limitar módulos iniciales y diferir integraciones | Product | Open |
| Confusión con el legacy archivado | Reactiva decisiones obsoletas | Mantener esta propuesta separada y sin migración automática | Platform | Controlled |
| Duplicación de capacidades compartidas | Coste y contratos inconsistentes | Definir ownership antes de cada módulo | Platform/Product | Open |
| Proveedores externos cambiantes | Contratos frágiles y retrasos | Validar capacidades por adapter y evidencia oficial | Integrations | Open |
| Atribución ambigua con CRM | Métricas no confiables | Definir eventos y ownership con CRM antes de Insights | CRM/Marketing | Open |

### Dependencies

- CRM estable como suite vigente y propietario de entidades comerciales.
- Platform Shell y navigation contracts.
- Platform Core para tenancy, permisos, audit y entitlements.
- Storage, Integration Hub, Workflow, Communications, Analytics y AI Platform cuando sus gates se
  activen.
- Aprobación explícita del mapa de suite y sus módulos iniciales.

## Implementation handoff

- **Implementation branch:** null; no autorizada en estado `proposed`.
- **Starting condition:** suite definition aprobada y módulos iniciales con Definition of Ready.
- **First concrete action:** revisar este documento contra el roadmap de ejecución y aprobar o ajustar
  el mapa de módulos.
- **Required validation:** documentación, links, suite checklist y track validation; no ejecutar
  validaciones de frontend o backend durante esta fase.
- **Deferred scope:** publicación externa, automatización durable, insights avanzados, social inbox,
  social listening, IA autónoma, billing específico y paridad mobile.
- **Release or rollout constraints:** no activar Marketing Studio en Launchpad ni cargar datos reales
  hasta completar seguridad, tenancy, contratos, observabilidad, rollback y aprobación de release.

## Approval gate

Estado actual: `proposed`.

- [ ] Intención, usuarios, valor y señal de éxito aprobados.
- [ ] Responsabilidades incluidas y excluidas aprobadas.
- [ ] Ownership con CRM y capacidades compartidas aprobado.
- [ ] Mapa y secuencia de módulos aprobados.
- [ ] Experiencia, navegación, estados y transiciones aprobados.
- [ ] Tenancy, permisos, contratos, integraciones y auditoría definidos.
- [ ] Impacto técnico, seguridad, operaciones y rollout revisados.
- [ ] Paquetes de módulos iniciales completados.
- [ ] Aprobación explícita de Product Owner y Tech Lead registrada.
