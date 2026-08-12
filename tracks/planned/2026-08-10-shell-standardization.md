---
id: shell-standardization
title: Estandarización del shell de LoopDev OS
status: planned
created: 2026-08-10
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/2026-08-10-shell-standardization.md
---

# Estandarización del shell de LoopDev OS

## Outcome

Track existente consolidado. El outcome operativo se conserva en la especificación migrada y debe formalizarse en la próxima actualización del track.

## Fases

Las fases, checkpoints y tareas existentes se preservan en la especificación migrada.

## Criterios de cierre

- [ ] Formalizar criterios de cierre verificables durante la próxima actualización.
- [ ] Obtener aprobación explícita del usuario antes de mover el track a `closed`.

## Especificación migrada

**Fecha:** 2026-08-10
**Estado:** Propuesto
**Rama:** `feature/shell-standardization`
**Dependencia:** `2026-08-05-loopdev-saas-platform-upgrade.md`
**Ámbito:** todas las suites y módulos protegidos de `apps/loopdev-os`

## Objetivo

Establecer una arquitectura de shell común para todas las suites y módulos de LoopDev OS. Las páginas actuales y futuras deben compartir una estructura reconocible para navegación, contexto de tenant, permisos, responsive behavior y estados estructurales, sin impedir las necesidades específicas de cada dominio.

El objetivo no es hacer que Marketing, CRM, Health OS y Quant parezcan la misma aplicación. La consistencia debe estar en la composición y en los contratos del shell; el contenido y las herramientas pueden variar por dominio.

El track también establecerá un `Shell Showcase` permanente y visible que funcione como referencia
ejecutable del esqueleto común. El Showcase no será una suite de producto ni la fuente de
implementación: consumirá los mismos contratos y primitives que las suites, mientras que
`@loopdev/ui` seguirá siendo la fuente compartida de `AppShell`, `SuiteShell`, `ModuleShell`,
`ModuleWorkspace` y sus estados.

La superficie de referencia podrá exponerse como `/shell-showcase` o como una ruta interna
equivalente. Debe permanecer disponible para inspección visual, validación responsive y pruebas de
contrato durante la evolución del producto.

### Dirección visual de referencia

Las capturas de la interfaz de Supabase (`supabase_interface.png` y
`supabase_interface_2.png`) establecen la dirección visual objetivo para LoopDev OS. No se trata de
copiar la marca ni la apariencia exacta de Supabase, sino de adoptar su modelo de herramienta
operativa: una superficie densa, estable y orientada a inspeccionar recursos reales.

La composición objetivo debe comunicar de forma simultánea:

```text
Barra de plataforma
├── identidad de producto
├── proyecto / workspace / entorno activo
├── rama o contexto de despliegue
├── acción primaria de conexión
└── búsqueda y controles globales

Rail de plataforma
└── áreas principales de LoopDev OS

Workspace operativo
├── breadcrumbs y recurso actual
├── título, endpoint o contexto del recurso
├── tabs de trabajo
├── filtros y toolbar
├── visualización principal: tabla, canvas, editor o dashboard
└── inspector contextual derecho
  ├── detalles
  ├── vista raw o técnica
  ├── metadata
  └── acciones de cierre, copia y operación
```

El rail y el inspector son superficies distintas. El rail debe permanecer compacto y estable,
mientras que el inspector debe ocupar el lado derecho del workspace sin convertir el contenido en
un modal cuando exista espacio de escritorio. En tablet y móvil, el inspector puede transformarse
en overlay o drawer, conservando el mismo contrato y contexto.

La barra superior no debe confundirse con el header de una suite. La barra de plataforma comunica
el contexto global de LoopDev OS; `SuiteHeader` comunica la identidad y los controles de una suite;
`ModuleHeader` comunica el recurso o módulo actual. Esta separación evita que cada suite tenga que
reconstruir el contexto de proyecto, workspace, entorno y recurso dentro de su layout.

### Regla del header persistente

El comportamiento observado en la referencia de Supabase debe ser el comportamiento del header
persistente de LoopDev OS: la barra superior mantiene su posición, altura, jerarquía y controles
globales mientras cambia el rail, la suite, el módulo, la tab de recurso o el panel contextual.

En el código actual, `AppShell.headerSlot` ya ocupa el lugar técnico correcto para esta superficie,
pero `SuiteShell` le entrega actualmente un `SuiteHeader`. La evolución debe corregir la
responsabilidad sin duplicar barras:

```text
AppShell.headerSlot
└── PlatformHeader / OSHeader persistente
  ├── identidad LoopDev
  ├── organización, proyecto o workspace
  ├── entorno y rama
  ├── conexión y estado operativo
  ├── búsqueda global
  └── ayuda, notificaciones, preferencias y perfil

AppShell.navSlot
└── SuiteSidebar / rail de la suite

ModuleWorkspace.headerSlot
└── ModuleHeader contextual
  ├── breadcrumbs
  ├── identidad del módulo o recurso
  ├── tabs de recursos
  └── acciones específicas
```

`SuiteHeader` no debe seguir siendo la barra global definitiva si su contenido representa solo una
suite. Puede conservarse como adaptador temporal durante la migración o convertirse en una
composición de contenido dentro del `PlatformHeader`, pero no debe crear una segunda barra superior
que compita visualmente con ella.

El header persistente debe permanecer estable al navegar entre CRM, Marketing Studio, Health OS y
Quant Ops. Solo deben cambiar los elementos que expresamente representan el contexto activo, como
el nombre de suite, proyecto, entorno o permisos disponibles. Las tabs de recurso y los controles
del módulo deben vivir debajo, en `ModuleHeader`, para que el cambio de módulo no desplace ni
reconstruya la barra de plataforma.

El contrato inicial de `PlatformHeader` queda definido así:

```ts
type PlatformHeaderProps = {
  identitySlot: React.ReactNode;
  contextSlot?: React.ReactNode;
  environmentSlot?: React.ReactNode;
  primaryActionSlot?: React.ReactNode;
  searchSlot?: React.ReactNode;
  controlsSlot?: React.ReactNode;
  profileSlot?: React.ReactNode;
  context?: LayoutContext;
  isInert?: boolean;
  className?: string;
};
```

La superficie ocupa la altura ya reservada por `AppShell`: `56px` en densidad normal y el token
compacto del shell cuando corresponda. `PlatformHeader` debe usar `h-full`, no declarar una nueva
altura estructural ni crear una segunda fila. En escritorio ocupa el ancho disponible a la derecha
del rail; en móvil ocupa el ancho completo del viewport y oculta de forma controlada los slots
secundarios que no puedan convivir sin overflow.

Los slots no son equivalentes: `identitySlot`, `contextSlot` y `environmentSlot` orientan; `primaryActionSlot`
y `searchSlot` operan globalmente; `controlsSlot` y `profileSlot` contienen controles persistentes.
Las tabs, filtros y acciones de un recurso pertenecen a `ModuleHeader` o al workspace del módulo.

### Patrones de interacción que debemos estandarizar

Las nuevas referencias de Table Editor muestran que la interfaz necesita más que un shell de
navegación. También necesita una gramática para trabajar con recursos sin perder el contexto:

#### 1. Tabs de recursos en el header del módulo

Las tabs visibles en `supabase_interface_3.png` representan recursos abiertos o contextos de trabajo
del mismo módulo, por ejemplo tablas, conversaciones, documentos o ejecuciones. No son tabs de
navegación global ni deben reemplazar la navegación del rail.

El contrato debe permitir:

- identificar cada recurso con un `resourceId`, tipo, label e icono;
- activar, cerrar y crear tabs sin abandonar el módulo;
- conservar el estado mínimo de cada recurso cuando el usuario cambia de tab;
- indicar cambios no guardados, estados de carga, error o solo lectura;
- evitar overflow horizontal mediante scroll controlado o menú de recursos;
- abrir el recurso en una URL estable cuando sea necesario compartir o recuperar el contexto.

#### 2. Panel lateral de operación contextual

`supabase_interface_4.png` muestra el patrón para crear una tabla: el workspace queda visible y
atenuado mientras un panel derecho presenta un formulario completo. El panel tiene identidad clara,
secciones, controles específicos del recurso, scroll independiente y acciones persistentes al fondo.

Este patrón debe usarse para operaciones como crear, editar, configurar o importar un recurso. No
debe modelarse como un simple tooltip ni como un modal pequeño. El contrato debe contemplar:

- título y contexto del recurso afectado;
- secciones de formulario con validación local;
- estados de `dirty`, guardado, error y éxito;
- acciones primarias y secundarias persistentes;
- cierre explícito y confirmación cuando existan cambios no guardados;
- modo drawer en móvil, manteniendo el mismo contenido y contrato.

#### 3. Inspector contextual de selección

El inspector derecho persistente corresponde a la inspección de un recurso o selección existente.
Puede mostrar `Details`, `Raw`, metadata, relaciones, historial o acciones. Aunque comparte
posición y comportamiento responsive con el panel de operación, su intención es diferente: leer,
entender y actuar sobre una selección, no completar un flujo largo de creación.

El shell debe distinguir ambos casos para que un módulo pueda declarar si el panel es:

```ts
type ContextPanelKind = 'inspector' | 'operation';
```

No se debe forzar una única implementación visual si eso hace que un inspector de lectura parezca un
formulario de creación o que un formulario complejo parezca una tarjeta secundaria.

### Aplicación al CRM: Customer 360

El futuro `Customer 360` de Sales CRM debe tratarse como un workspace de recurso dedicado, no como
un inspector genérico de lead añadido al dashboard. La ficha del cliente debe conservar una
identidad fuerte y proporcionar una superficie completa para entender y operar sobre esa persona o
cuenta.

La composición prevista es:

```text
CRM / Customers
└── Customer 360
  ├── identidad del cliente y estado comercial
  ├── acciones primarias: editar, contactar, asignar, crear actividad
  ├── tabs del recurso
  │   ├── Overview
  │   ├── Timeline
  │   ├── Opportunities
  │   ├── Communications
  │   ├── Documents
  │   └── Related records
  ├── contenido principal de la tab activa
  └── panel contextual derecho cuando una acción lo requiera
    ├── detalles de actividad o relación seleccionada
    ├── formulario para crear o editar
    └── metadata y acciones
```

Las tabs del Customer 360 son tabs de navegación del recurso cliente y deben conservarse mientras
el usuario trabaja dentro de esa ficha. Un formulario para crear una actividad, editar datos o
registrar una interacción debe abrirse como panel de operación contextual, sin reemplazar la
identidad ni la navegación del Customer 360. Si el usuario selecciona una actividad existente,
puede abrirse un inspector contextual de lectura y acciones.

Esto establece tres niveles de contexto que no debemos mezclar:

```text
Rail y barra de plataforma → dónde estoy en LoopDev OS
Tabs del módulo/recurso    → qué recurso o vista de trabajo tengo abierta
Panel contextual           → qué operación o selección estoy atendiendo ahora
```

Antes de migrar Sales CRM debemos validar este modelo con un fixture agnóstico de negocio en el
Showcase y definir sus contratos compartidos en `@loopdev/contracts`.

## Problema actual

LoopDev OS ya dispone de varias piezas válidas, pero su composición no está estandarizada:

- `AppShell` para la navegación global y de suite.
- `SuiteSidebar` y `SuiteHeader` para las suites principales.
- `ModuleWorkspace` para módulos complejos.
- `ModuleSidebar`, `ModuleHeader`, `SidebarFlyout` y `UnifiedInspector` para módulos como Brand Hub y DAM.
- una superficie de inspector derecho contextual, aunque hoy solo aparece cuando un módulo aporta
  explícitamente `inspectorSlot`;
- layouts con lógica propia para breadcrumbs, viewport, permisos, navegación móvil e identificación de la ruta activa.

Esta variedad permite que cada módulo resuelva de forma distinta problemas que deberían ser comunes. También dificulta incorporar módulos nuevos sin repetir decisiones de layout y comportamiento.

## Matriz de inventario inicial

La matriz identifica la composición actual, la responsabilidad que debe consolidarse y el destino
de cada superficie. Se actualizará durante la auditoría de layouts y servirá como contrato de
migración, no como un compromiso de reescritura inmediata.

| Superficie       | Composición actual                                                                                                               | Duplicaciones o riesgos                                                                                           | Destino                                                         | Estado                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------- |
| OS global        | `AppShell` + providers globales                                                                                                  | Verificar guards, tenancy, overlays y contexto común                                                              | `AppShell`                                                      | Por auditar            |
| Marketing Studio | `SuitePermissionGuard` + `AppShell` + `SuiteSidebar` + `SuiteHeader` + `MobileSuiteNav`                                          | Módulo activo, viewport, overlays, permisos y navegación resueltos en el layout                                   | `AppShell` + `SuiteShell`                                       | Referencia de suite    |
| Brand Hub        | Provider propio + `ModuleWorkspace` + `ModuleSidebar` + `ModuleHeader` + flyout + inspector                                      | Datos de marca, breadcrumbs, permisos, navegación interna y estado de paneles mezclados con la composición visual | `SuiteShell` + `ModuleShell` + `ModuleWorkspace`                | Referencia de módulo   |
| DAM              | Provider propio + `ModuleWorkspace` + `ModuleSidebar` + `ModuleHeader` + toolbar + inspector                                     | Selección de asset, offline-first, toolbar, navegación y estados estructurales requieren contrato común           | `SuiteShell` + `ModuleShell` + `ModuleWorkspace`                | Referencia offline     |
| Campaigns        | Ruta y layout de Marketing Studio por auditar                                                                                    | Navegación y estados pueden divergir del resto de Marketing Studio                                                | `SuiteShell` + `ModuleShell`                                    | Pendiente de auditoría |
| Content Engine   | Ruta prevista en la navegación, superficie por auditar                                                                           | Disponibilidad y estado `disabled` deben tener representación común                                               | `SuiteShell` + `ModuleShell`                                    | Pendiente de auditoría |
| Sales CRM        | `SalesCrmProvider` + `SuitePermissionGuard` + `AppShell` + `SuiteSidebar` + `SuiteHeader` + `ModuleWorkspace`                    | Suite, módulo, notificaciones, inspector de leads y permisos están acoplados                                      | `SuiteShell` + `ModuleShell` + `ModuleWorkspace` cuando aplique | Migración posterior    |
| Health OS        | `SuitePermissionGuard` + `AppShell` + `SuiteSidebar` + `SuiteHeader` + `MobileSuiteNav` + `ModuleWorkspace`                      | Identidad de suite, permisos, responsive, tenant y composición de módulo están mezclados                          | `SuiteShell` + `ModuleShell`                                    | Migración posterior    |
| Quant Ops        | `QuantOpsProvider` + `SuitePermissionGuard` + `AppShell` + `SuiteSidebar` + `SuiteHeader` + `MobileSuiteNav` + `ModuleWorkspace` | Navegación, permisos, responsive, tenant y estado del inspector de bots están mezclados                           | `SuiteShell` + `ModuleShell`                                    | Migración posterior    |

La auditoría deberá usar únicamente archivos fuente rastreados, principalmente `src`, y excluir
`.next`, `.turbo`, `node_modules`, `test-results` y otros artefactos generados.

### Hallazgos de la auditoría de layouts

- `apps/loopdev-os/src/app/layout.tsx` ya concentra providers de autenticación, organización,
  permisos, marca, workspace, query y tema. Esta composición pertenece al nivel `AppShell` y no
  debe repetirse dentro de las suites.
- Marketing Studio, Sales CRM, Health OS y Quant Ops repiten la composición
  `SuitePermissionGuard` + `AppShell` + `SuiteSidebar` + `SuiteHeader` + navegación móvil.
- Las suites repiten también la resolución de `pathname`, módulo activo, `navMode`, overlays y
  rutas de salida al Launchpad. Esa lógica es el principal candidato para `SuiteShell`.
- Brand Hub y DAM ya usan `ModuleWorkspace`, pero sus layouts mezclan providers de dominio,
  breadcrumbs, navegación interna, selección de entidades, permisos, inspector, flyout y estados
  de paneles. Esa coordinación es el principal candidato para `ModuleShell`.
- Sales CRM, Health OS y Quant Ops usan `ModuleWorkspace` como contenedor interno incluso cuando
  todavía no tienen una navegación de módulo compleja. El contrato debe permitir un workspace
  mínimo sin obligar a activar sidebar, flyout o inspector.
- `ModuleWorkspace` ya ofrece `headerSlot`, `toolbarSlot`, `sidebarSlot`, `flyoutSlot` e
  `inspectorSlot`, además de responsive, accesibilidad y estado de paneles. `ModuleShell` no debe
  volver a declarar esos slots ni reemplazar su configuración visual.
- Las diferencias observadas son de contenido, providers de dominio, permisos y necesidades del
  inspector; no justifican una suite shell distinta para cada producto.

### Decisiones para la extracción

1. Extraer primero `SuiteShell` desde la composición repetida de las cuatro suites.
2. Mantener `AppShell` y `ModuleWorkspace` como primitives existentes y estables.
3. Extraer `ModuleShell` como una capa delgada de contexto estructural alrededor de
   `ModuleWorkspace`.
4. Mantener los providers de dominio (`BrandHubProvider`, `AssetManagerProvider`,
   `SalesCrmProvider` y `QuantOpsProvider`) fuera de los contratos genéricos del shell.
5. Recibir la navegación de suite como el `NavigationSchema` existente y derivar el módulo activo
   mediante un adaptador central, no mediante una nueva implementación por layout.
6. Permitir que un módulo aporte slots de `ModuleWorkspace` sin convertirlos en props duplicadas de
   `ModuleShell`.
7. Migrar primero Marketing Studio, Brand Hub y DAM; usar Sales CRM, Health OS y Quant Ops como
   comprobación de compatibilidad antes de retirar los layouts duplicados.
8. Crear el `Shell Showcase` como superficie visible y agnóstica de suite antes de migrar las
   superficies de referencia.
9. Hacer que el Showcase consuma directamente los primitives compartidos y no crear una variante de
   shell exclusiva para la demo.
10. Propagar los cambios comunes mediante `@loopdev/ui`; las suites migradas deben consumir los
    mismos contratos para recibir las mejoras del esqueleto.

## Jerarquía oficial

La composición objetivo será:

```text
OS Shell
└── Suite Shell
    └── Module Shell
        └── Module Workspace
            └── Page Content
```

En la implementación de LoopDev OS, esta jerarquía se representará mediante:

```text
AppShell
└── SuiteShell
    └── ModuleShell
        └── ModuleWorkspace
            └── Page Content
```

`AppShell` y `ModuleWorkspace` ya existen como primitives de `@loopdev/ui`. `SuiteShell` y
`ModuleShell` son composiciones objetivo que todavía deben extraerse de los layouts actuales.
No se debe renombrar `ModuleWorkspace` a `ModuleShell`: el workspace es el chasis operativo
interno del módulo, mientras que el module shell coordina identidad, navegación, breadcrumbs,
permisos, estados estructurales y la integración del workspace.

### OS Shell

Responsabilidades:

- autenticación y guardas globales;
- organización activa;
- workspace y marca activa;
- tema y preferencias generales;
- overlays globales;
- navegación de vuelta a Launchpad;
- contexto común de tenancy.
- barra de plataforma con proyecto, workspace, entorno, rama, conexión, búsqueda y controles
  globales;
- rail persistente de áreas principales de LoopDev OS.

### Suite Shell

Responsabilidades:

- identidad de la suite;
- sidebar principal de la suite;
- navegación entre módulos;
- permisos de suite y disponibilidad de módulos;
- suite header;
- command bar, notificaciones y menú de usuario;
- navegación móvil de la suite;
- transición entre la suite y Launchpad.

### Module Shell

Responsabilidades:

- identificación del módulo;
- breadcrumbs;
- sidebar y navegación interna;
- flyout;
- toolbar;
- inspector;
- acciones y permisos del módulo;
- comportamiento responsive del workspace;
- estados estructurales compartidos.
- composición del inspector derecho contextual cuando el módulo lo requiera, sin confundirlo con
  el `contextSlot` global de `AppShell`.

El `ModuleShell` envolverá a `ModuleWorkspace`, pero no lo sustituirá. `ModuleWorkspace` seguirá
siendo responsable de la composición visual del área operativa: sidebar interna, flyout, canvas e
inspector. El `ModuleShell` será responsable del contrato de integración del módulo con la suite.

### Page Content

Responsabilidades:

- datos y operaciones de la página;
- tablas, formularios, cards y visualizaciones;
- loading, error, empty y contenido específico del dominio;
- no debe montar de nuevo la navegación global, el shell de suite ni el shell de módulo.

## Invariantes

Toda página protegida nueva debe:

1. pertenecer explícitamente a una suite y, cuando aplique, a un módulo;
2. montarse dentro del shell correspondiente;
3. declarar o heredar permisos de acceso;
4. proporcionar breadcrumbs coherentes con la ruta;
5. definir comportamiento móvil y de viewport;
6. distinguir loading, error, acceso denegado, vacío, read-only y offline;
7. usar primitives de `@loopdev/ui` para controles y estructura compartida;
8. poder volver a la suite y al Launchpad sin navegación ad hoc;
9. consumir el contexto de organización, workspace y marca desde los providers canónicos;
10. evitar importar directamente detalles de persistencia o tenancy en componentes de layout.

Una excepción debe documentarse en el track o en el código del shell y justificar qué necesidad de dominio no cubre el contrato común.

## Contratos propuestos

Los contratos deben declarar la composición del shell sin duplicar la mecánica visual de
`ModuleWorkspace` ni mezclar estado de página con configuración de navegación. Se apoyarán en los
tipos existentes de `@loopdev/contracts` (`NavigationSchema`, `SuiteIdentity`, `AccessMap`,
`ModuleAccessState` y `NavRouteRef`).

### Contrato de `SuiteShell`

`SuiteShell` agrupa la identidad, navegación y permisos de una suite. No debe conocer datos de
dominio de sus módulos.

```ts
type SuiteShellConfig = {
  identity: SuiteIdentity;
  navigation: NavigationSchema;
  accessMap: AccessMap;
  permission: string;
  navMode?: NavMode;
  mobileNavigation?: MobileNavigationConfig;
};

type SuiteShellProps = SuiteShellConfig & {
  children: React.ReactNode;
};
```

`navigation` reutiliza el esquema universal actual. `accessMap` debe derivarse del acceso efectivo
y debe soportar al menos `enabled`, `disabled`, `hidden` y `coming-soon`. `SuiteShell` puede
recibir callbacks de navegación, pero no debe resolver permisos consultando directamente datos de
persistencia.

### Contrato de `ModuleShell`

`ModuleShell` integra un módulo dentro de una suite y envuelve a `ModuleWorkspace`. Es responsable
del contexto estructural, no de la implementación del canvas ni de los paneles internos.

```ts
type BreadcrumbItem = {
  id: string;
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type ModuleNavigationConfig = {
  groups: NavGroup[];
  activeRouteId?: string;
  onNavigate?: (route: NavRouteRef) => void;
};

type ModulePermissionConfig = {
  required: string[];
  readOnly?: boolean;
  accessState: ModuleAccessState;
};

type ModuleShellConfig = {
  suiteId: string;
  moduleId: string;
  breadcrumbs: BreadcrumbItem[];
  navigation: ModuleNavigationConfig;
  permissions: ModulePermissionConfig;
  toolbar?: React.ReactNode;
  mobileNavigation?: MobileNavigationConfig;
};

type ModuleShellProps = ModuleShellConfig & {
  children: React.ReactNode;
};
```

`ModuleShell` no replica `sidebarSlot`, `flyoutSlot`, `inspectorSlot`, `sidebarOpen` ni las
configuraciones de paneles que ya pertenecen a `ModuleWorkspaceProps`. El toolbar puede ser
coordinado por el shell, pero su contenido sigue siendo propiedad del módulo.

### Estados estructurales

Los estados del shell deben estar separados de los estados de datos de cada página:

```ts
type ShellStructuralState =
  | 'loading'
  | 'error'
  | 'forbidden'
  | 'no-tenant-context'
  | 'module-disabled'
  | 'empty'
  | 'read-only'
  | 'offline';

type ShellState = {
  structuralState: ShellStructuralState;
  message?: string;
  retry?: () => void;
};
```

Una página puede tener además estados de dominio, pero no debe usar esos estados para reconstruir
la navegación o cambiar arbitrariamente la composición del shell.

### Contrato de composición

La API recomendada deberá separar configuración declarativa, estado estructural y contenido:

```tsx
<AppShell>
  <SuiteShell {...suiteConfig}>
    <ModuleShell {...moduleConfig}>
      <ModuleWorkspace
        moduleId={moduleConfig.moduleId}
        headerSlot={<ModuleHeader segments={moduleConfig.breadcrumbs} />}
        toolbarSlot={moduleConfig.toolbar}
      >
        <PageContent />
      </ModuleWorkspace>
    </ModuleShell>
  </SuiteShell>
</AppShell>
```

La API final deberá validarse contra Marketing Studio, Brand Hub y DAM antes de migrar las demás
suites. Si un módulo necesita una responsabilidad que estos contratos no cubren, la excepción debe
documentarse antes de añadir una prop específica.

## Shell Showcase permanente

El Showcase será una aplicación de referencia del esqueleto, no una suite adicional. Su objetivo es
hacer visible y ejecutable el contrato común en un contexto sin datos de negocio.

### Composición

```tsx
<ShellShowcasePage>
  <AppShell>
    <SuiteShell {...suiteFixture}>
      <ModuleShell {...moduleFixture}>
        <ModuleWorkspace {...workspaceFixture}>
          <ShowcasePageContent />
        </ModuleWorkspace>
      </ModuleShell>
    </SuiteShell>
  </AppShell>
</ShellShowcasePage>
```

### Escenarios mínimos

El Showcase deberá permitir inspeccionar fixtures para:

- desktop, tablet y móvil;
- sidebar expandida, rail y navegación móvil;
- flyout, inspector y toolbar;
- breadcrumbs y navegación entre suite, módulo y Launchpad;
- loading, error, forbidden, empty, read-only y offline;
- tenant no seleccionado y módulo deshabilitado;
- permisos y estados de acceso diferentes;
- ausencia de overflow y comportamiento accesible de overlays.

El Showcase no debe importar providers ni datos específicos de Marketing Studio, Brand Hub, DAM,
Sales CRM, Health OS o Quant Ops. Los fixtures deben ser estables, explícitos y reutilizables en
tests.

### Regla de propagación

Los cambios estructurales deben realizarse en los primitives o contratos compartidos:

```text
Cambio en @loopdev/ui
        ↓
Shell Showcase actualizado
        ↓
Tests de contrato y validación visual
        ↓
Todas las suites migradas reciben el cambio
```

Las suites no deben importar `ShellShowcasePage`. Deben importar directamente los primitives y
contratos compartidos para que el Showcase siga siendo una referencia fiel de producción.

La composición objetivo será equivalente a:

```tsx
<AppShell>
  <SuiteShell suiteId="marketing-studio" navigation={suiteNavigation}>
    <ModuleShell
      suiteId="marketing-studio"
      moduleId="brand-hub"
      breadcrumbs={breadcrumbs}
      navigation={moduleNavigation}
      permissions={permissions}
    >
      <ModuleWorkspace sidebar={sidebar} flyout={flyout} inspector={inspector}>
        <PageContent />
      </ModuleWorkspace>
    </ModuleShell>
  </SuiteShell>
</AppShell>
```

## Estrategia de migración

La migración será incremental y conservará compatibilidad durante todo el proceso. No se
reescribirán todas las suites en una sola fase ni se introducirán nuevos mecanismos de navegación
o tenancy.

### Paso 1: inventario y contrato

- inventariar rutas protegidas, layouts, suites, módulos y primitives utilizadas;
- clasificar cada responsabilidad como `AppShell`, `SuiteShell`, `ModuleShell`,
  `ModuleWorkspace` o contenido de página;
- documentar duplicaciones de breadcrumbs, viewport, permisos, navegación y contexto;
- definir los contratos de `SuiteShell` y `ModuleShell`;
- crear una matriz de migración con excepciones justificadas;
- excluir artefactos generados como `.next`, `.turbo` y `test-results` del inventario fuente.

### Paso 2: crear el `Shell Showcase`

- crear una ruta visible y agnóstica de suite para el esqueleto común;
- montar `AppShell`, `SuiteShell`, `ModuleShell` y `ModuleWorkspace` con fixtures estables;
- exponer controles para viewport, navegación y estados estructurales;
- probar desktop, tablet, móvil, overlays, breadcrumbs, inspector y toolbar;
- usar el Showcase como referencia visual y de contrato, no como dependencia de producción.

### Paso 3: extraer `SuiteShell`

- reutilizar `AppShell`, `SuiteSidebar` y `SuiteHeader` existentes;
- trasladar a `SuiteShell` la composición común de identidad, navegación, permisos y responsive;
- mantener adaptadores temporales para layouts que todavía no puedan migrarse;
- añadir tests de contrato para navegación, permisos y estados de suite;
- no introducir lógica de datos de dominio en el shell.

### Paso 4: extraer `ModuleShell`

- reutilizar `ModuleHeader`, breadcrumbs, navegación, permisos y estados existentes;
- hacer que `ModuleShell` envuelva a `ModuleWorkspace`;
- mantener `ModuleWorkspace` como primitive visual del área operativa;
- centralizar viewport, flyout, inspector y toolbar donde exista comportamiento compartido;
- permitir extensiones declarativas por módulo sin props booleanas acumulativas;
- añadir tests de contrato para estados loading, error, empty, forbidden, read-only y offline.

### Paso 5: migrar superficies de referencia

- migrar Marketing Studio como primera `SuiteShell`;
- migrar Brand Hub como primer `ModuleShell` con inspector y flyout;
- migrar DAM como segundo `ModuleShell`, validando el comportamiento offline-first;
- comparar visualmente desktop, tablet y móvil;
- documentar cualquier excepción que no pueda cubrir el contrato común.

### Paso 6: migrar suites restantes

- migrar Sales CRM;
- migrar Health OS;
- migrar Quant Ops;
- verificar deep links, permisos, tenancy, breadcrumbs y navegación móvil;
- retirar gradualmente composición duplicada de los layouts antiguos.

### Paso 7: guardrails y cierre

- añadir checklist de shell para módulos nuevos;
- detectar layouts protegidos que no utilicen la composición aprobada;
- detectar duplicación de headers, sidebars, breadcrumbs y navegación;
- detectar controles estructurales fuera de `@loopdev/ui`;
- actualizar documentación de arquitectura y contribución;
- exigir lint, typecheck, tests, auditoría frontend y E2E aplicables en CI.

## Estados estructurales comunes

El shell y sus primitives deben contemplar de forma consistente:

- loading;
- error recuperable;
- acceso denegado;
- organización, workspace o marca no seleccionados;
- módulo deshabilitado o no disponible;
- lista o entidad vacía;
- entidad inexistente;
- modo read-only;
- datos offline, fixtures locales o servicio no disponible.

Los estados offline deben distinguir entre ausencia de datos, ausencia de conexión, permisos insuficientes y funcionalidad todavía no disponible.

## Responsive y mobile

El contrato debe estandarizar:

- transformación de sidebar expandida a rail o navegación móvil;
- navegación inferior en viewport móvil;
- apertura del flyout;
- inspector como panel adaptable en móvil;
- overflow de acciones y toolbar;
- breadcrumbs sin desbordamiento horizontal;
- preservación del contexto de organización, workspace y marca.

La detección de viewport y las reglas de transición deben centralizarse en primitives o hooks compartidos cuando la evidencia de los módulos actuales lo permita.

## Permisos y navegación

La navegación debe derivarse del acceso efectivo y no mostrar rutas que posteriormente fallen de forma inesperada. El contrato debe soportar estados como:

- `enabled`;
- `disabled`;
- `hidden`;
- `read-only`;
- `unavailable`;
- `forbidden`.

El shell debe recibir o resolver de forma canónica el contexto de suite, módulo, organización, workspace, marca y permisos. No se debe duplicar la lógica de `usePathname` para reconstruir navegación en cada layout.

## Plan de trabajo

### Fase 1: inventario y contrato

- [ ] inventariar rutas protegidas, suites, módulos y layouts actuales;
- [ ] clasificar cada superficie por `OS Shell`, `Suite Shell`, `Module Shell` y contenido;
- [ ] documentar divergencias, excepciones y duplicaciones;
- [ ] definir invariantes de shell y contrato inicial;
- [ ] crear matriz de migración por suite y módulo.

### Fase 2: referencia visual y técnica

- [ ] crear fixtures de shell para desktop, tablet y móvil;
- [ ] crear y mantener la ruta visible del `Shell Showcase`;
- [ ] garantizar que el Showcase use los mismos primitives que producción;
- [ ] fijar estados de loading, error, empty, forbidden, read-only y offline;
- [ ] probar navegación, breadcrumbs, overlays, inspector y toolbar;
- [ ] validar accesibilidad y ausencia de overflow;
- [ ] representar la barra de plataforma con contexto de proyecto, workspace y entorno;
- [ ] representar un workspace denso con tabs, filtros, tabla o canvas y acciones;
- [ ] representar tabs de recursos con activación, cierre, creación y estado no guardado;
- [ ] representar un panel de operación con formulario, validación, scroll y acciones persistentes;
- [ ] representar un inspector derecho contextual con detalles, vista raw y metadata;
- [ ] validar la relación rail fijo + workspace + inspector en desktop, tablet y móvil.

### Fase 3: extracción de primitives

- [ ] evaluar qué responsabilidades deben vivir en `AppShell`;
- [ ] definir la API común de `SuiteShell`;
- [ ] definir la API común de `ModuleShell`;
- [ ] conectar el Showcase a los contratos finales;
- [ ] extraer hooks de viewport, navegación y contexto cuando proceda;
- [ ] preservar compatibilidad durante la migración incremental;
- [ ] añadir tests unitarios y de contrato para las piezas compartidas.

### Fase 4: migración de referencia

- [ ] migrar Marketing Studio al contrato objetivo;
- [ ] migrar Brand Hub como módulo de referencia con inspector y flyout;
- [ ] migrar DAM como módulo de referencia offline-first;
- [ ] eliminar lógica duplicada de viewport, breadcrumbs y navegación;
- [ ] documentar las excepciones legítimas.

### Fase 5: migración de suites restantes

- [ ] auditar y migrar Sales CRM;
- [ ] definir y validar el workspace `Customer 360` con tabs de recurso y paneles contextuales;
- [ ] auditar y migrar Health OS;
- [ ] auditar y migrar Quant Ops;
- [ ] verificar que las rutas internas mantienen permisos, tenancy y navegación;
- [ ] revisar la experiencia móvil de cada suite.

### Fase 6: guardrails para trabajo futuro

- [ ] añadir checklist de shell para módulos nuevos;
- [ ] detectar layouts protegidos que no usan el shell aprobado;
- [ ] detectar duplicación de headers, sidebars y navegación;
- [ ] detectar controles estructurales fuera de `@loopdev/ui`;
- [ ] actualizar documentación de arquitectura y guías de contribución.

## Matriz inicial de migración

| Suite            | Superficie      | Situación inicial            | Objetivo                                   |
| ---------------- | --------------- | ---------------------------- | ------------------------------------------ |
| Marketing Studio | Suite layout    | `AppShell` con lógica propia | `SuiteShell` común                         |
| Marketing Studio | Brand Hub       | `ModuleWorkspace` custom     | `ModuleShell` común con inspector y flyout |
| Marketing Studio | DAM             | `ModuleWorkspace` custom     | `ModuleShell` común offline-first          |
| Marketing Studio | Campaigns       | auditar                      | `ModuleShell` común                        |
| Marketing Studio | Content Engine  | auditar                      | `ModuleShell` común                        |
| Sales CRM        | Suite y módulos | auditar                      | `SuiteShell` + `ModuleShell`               |
| Health OS        | Suite y módulos | `AppShell` custom            | `SuiteShell` + `ModuleShell`               |
| Quant Ops        | Suite y módulos | `AppShell` custom            | `SuiteShell` + `ModuleShell`               |

## Validación y criterios de aceptación

El track se considerará completo cuando:

- las suites y módulos migrados usen una composición de shell documentada;
- exista un `Shell Showcase` permanente que represente la composición oficial con fixtures;
- el Showcase y las suites migradas consuman los mismos primitives y contratos compartidos;
- las páginas nuevas tengan una ruta clara de integración sin crear layouts paralelos;
- navegación, breadcrumbs, permisos y contexto de tenancy sean consistentes;
- desktop y mobile tengan comportamiento definido y probado;
- los estados estructurales sean reconocibles y accesibles;
- existan tests de contrato para las primitives comunes;
- las excepciones de dominio estén justificadas;
- los guardrails eviten regresiones en módulos futuros;
- el lint, typecheck, tests, auditoría frontend y E2E aplicables pasen.

## Restricciones

- no reescribir todas las suites en una sola fase;
- no mezclar este track con un rediseño visual completo;
- no introducir microfrontends ni una nueva plataforma de navegación;
- mantener los contratos de tenancy y permisos existentes;
- reutilizar `@loopdev/ui`, `@loopdev/contracts` y providers canónicos;
- conservar compatibilidad durante la migración;
- no convertir el shell en fuente de datos de dominio.
- no convertir el `Shell Showcase` en una suite de producto ni en una dependencia de las suites;
- no mantener una implementación visual exclusiva del Showcase que diverja de `@loopdev/ui`.

## Riesgos

- abstraer antes de comprender las diferencias reales entre suites;
- ocultar necesidades específicas detrás de props booleanas difíciles de mantener;
- romper deep links o navegación móvil durante la migración;
- duplicar estado entre suite shell y module shell;
- introducir acoplamiento entre shell y datos de negocio;
- hacer que el contrato común limite módulos operacionales legítimamente distintos.
- hacer que el Showcase se convierta en un layout paralelo en lugar de una validación de los
  primitives compartidos.

## Primera entrega recomendada

La primera entrega debe producir el inventario de rutas y layouts, el contrato de arquitectura, la
matriz de migración, una propuesta de API para `SuiteShell` y `ModuleShell` y el `Shell Showcase`
visible. El Showcase debe validar la composición completa, sus estados y su comportamiento
responsive sin depender de datos de negocio. Después se migrarán Marketing Studio, Brand Hub y DAM
como referencias de producción, sin exigir todavía la migración completa de todas las suites.

## Registro de migración

- Consolidado en el sistema de tracks de un archivo el 2026-08-12.
- El estado y owner iniciales fueron asignados por la política de migración aprobada.
