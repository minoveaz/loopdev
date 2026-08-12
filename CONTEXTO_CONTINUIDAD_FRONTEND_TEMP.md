# Contexto temporal de continuidad — LoopDev Frontend

> Documento temporal para transferir contexto a otro agente de IA.
> Repositorio: `/Users/minoveaz/Documents/Proyectos/loopdev`
> Rama actual: `feature/loopdev-frontend-work`
> Rama base: `main`
> No crear commits ni ramas nuevas durante esta continuidad.

## Objetivo general

Estandarizar visualmente LoopDev usando `@loopdev/ui`, tokens oficiales y la arquitectura:

```text
AppShell         -> contexto global de suite
ModuleWorkspace  -> contexto operativo del módulo
```

Mantener intactos:

- Supabase
- RLS
- autenticación
- persistencia
- migraciones
- contratos de datos
- secretos

## Arquitectura vigente

### Header global

El `AppShell` controla:

- suite;
- workspace/organización;
- command bar;
- notificaciones;
- tema;
- usuario/perfil.

No debe contener acciones de negocio específicas de una suite, como `Create Brand`, `New Lead`, filtros, acciones de Pipeline o acciones de clientes.

### ModuleWorkspace

Cada módulo operativo usa:

```text
ModuleWorkspace
├── ModuleHeader
├── ModuleSidebar
├── SidebarFlyout opcional
├── ModuleToolbar opcional
├── Canvas
└── Inspector opcional
```

El workspace tiene dos filas superiores:

```text
Fila 1: ModuleHeader
Fila 2: ModuleToolbar
```

### ModuleHeader

Responde: **¿Dónde estoy?**

Contenido permitido:

- toggle del sidebar del módulo;
- breadcrumbs;
- contexto de entidad;
- apertura del inspector;
- estados contextuales reales como `DRAFT`, `PUBLISHED` o `READ ONLY`.

No debe contener:

- filtros;
- búsqueda;
- tabs;
- selector grid/list;
- acciones CRUD;
- acciones ficticias;
- telemetría genérica como `SYSTEM ACTIVE`.

### ModuleToolbar

Responde: **¿Qué puedo hacer?**

Contenido permitido:

- búsqueda;
- filtros;
- tabs internos;
- selector de vista;
- selección múltiple;
- acciones de workflow;
- acciones primarias de la vista.

Ejemplos:

- `Create Brand` va en la toolbar de Brand Hub;
- `New Lead` va en la toolbar de Pipeline;
- `Save`, `Publish` y `Create Draft` van en la toolbar contextual de una marca.

No crear wrappers visuales alternativos ni duplicar la geometría de `ModuleWorkspace`.

## Trabajo ya realizado

- Auditor frontend reducido de 169 hallazgos a 0.
- Arquitectura `AppShell` + `ModuleWorkspace` aplicada.
- Eliminado `SuiteContentFrame`.
- Auth multi-tab corregida parcialmente con `multiTabAuth` y sincronización por focus/visibility.
- Tema persistente entre suites y pestañas.
- Autofill blanco de Chrome corregido.
- Logout centralizado en `UserMenu`.
- `SystemStatus` y acciones globales decorativas retiradas del header global.
- Inter establecida como fuente de interfaz.
- JetBrains Mono reservado para IDs, timestamps, logs, comandos, shortcuts, precios, payloads y otros datos técnicos.
- Estados de Brand Hub convertidos a badges legibles.
- Usuario/avatar duplicado retirado del sidebar.
- En Brand Hub se retiraron `SYSTEM ACTIVE` y `Share` del header del módulo.
- `Create Brand` permanece en `BrandToolbar`, dentro de `toolbarSlot`.

## Documentación actualizada

Estos documentos contienen la arquitectura normativa:

- `docs/02-frontend/MODULE_WORKSPACE.md`
- `docs/02-frontend/SHELL_ARCHITECTURE.md`
- `docs/02-frontend/LAYOUT_SYSTEM.md`
- `docs/02-frontend/DESIGN_TOKENS_USAGE.md`
- `docs/02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md`
- `docs/04-governance/FRONTEND_AUDIT_BASELINE_2026-08-08.md`
- `tracks/active/2026-08-08-loopdev-frontend-quality-system.md`

`MODULE_WORKSPACE.md` y `SHELL_ARCHITECTURE.md` documentan explícitamente:

```text
ModuleHeader  -> orientación y contexto
ModuleToolbar -> operaciones de la vista
```

El track de calidad contiene el flujo oficial:

```text
front:audit
    ↓
Vitest + Testing Library
    ↓
Playwright
    ↓
Axe integrado en Playwright
    ↓
Snapshots visuales
```

El primer vertical slice de este flujo será:

- Marketing Studio / Brand Hub;
- Sales CRM / Pipeline.

## Brand Hub: estado actual

Archivo principal:

`apps/loopdev-os/src/app/marketing-studio/brand-hub/layout.tsx`

Usa:

- `ModuleWorkspace`;
- `ModuleHeader`;
- `BrandToolbar`;
- sidebar;
- flyout;
- inspector.

Composición esperada:

```text
Header:
[menu sidebar] Marketing / Brand Hub / entidad              [inspector]

Toolbar:
[filtros] [vistas]                                      [Create Brand]

Canvas:
contenido de marcas
```

Archivos relacionados:

- `apps/loopdev-os/src/app/marketing-studio/brand-hub/page.tsx`
- `apps/loopdev-os/src/app/marketing-studio/brand-hub/brands/page.tsx`
- `apps/loopdev-os/src/suites/marketing-studio/brand-hub/components/BrandToolbar.tsx`

Revisar posibles duplicaciones entre páginas y layout antes de editar.

## Sales CRM: siguiente superficie de trabajo

Archivos principales:

- `apps/loopdev-os/src/app/sales-crm/layout.tsx`
- `apps/loopdev-os/src/app/sales-crm/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/pipeline/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/customers/page.tsx`
- `apps/loopdev-os/src/app/sales-crm/components/PipelineFilters.tsx`
- `apps/loopdev-os/src/app/sales-crm/context.tsx`

### Pipeline

Composición esperada:

```text
Header:
[menu] Sales & CRM / Deals & Pipeline                    [inspector]

Toolbar:
[Pipeline] [Historial] [filtros]                          [Nuevo Lead]

Canvas:
Kanban

Inspector:
Lead seleccionado
```

Actualmente `pipeline/page.tsx` tiene un panel grande propio con título y botón `Nuevo Lead`, además de tabs y filtros. Ese panel probablemente duplica `ModuleHeader`/`ModuleToolbar`. El siguiente trabajo recomendado es migrar esa composición al shell oficial de forma incremental.

### Clientes

Composición esperada:

```text
Header:
[menu] Sales & CRM / Directorio Clientes                 [inspector]

Toolbar:
[búsqueda] [filtros] [ordenación] [grid/list]             [Nuevo Cliente]

Canvas:
métricas y directorio

Inspector:
detalle del cliente
```

No añadir `Nuevo Cliente` si todavía no existe un flujo real de creación.

### Dashboard CRM

Puede no necesitar segunda fila:

```text
Header:
[menu] Sales & CRM / Dashboard CRM

Canvas:
métricas, gráficos y accesos a Pipeline / Clientes
```

## APIs y componentes relevantes

`ModuleWorkspace` soporta:

- `headerSlot`;
- `toolbarSlot`;
- `sidebarSlot`;
- `flyoutSlot`;
- `inspectorSlot`.

`ModuleHeader` soporta:

- breadcrumbs;
- `sidebarToggle`;
- `statusLabel`;
- `rightSlot`.

`ModuleToolbar` organiza:

- `left`;
- `center`;
- `right`.

## Flujo de testing frontend

El flujo oficial no debe concentrarse en una sola herramienta:

1. `front:audit`
   - arquitectura, tokens, tipografía, primitives, navegación y `AppShell`/`ModuleWorkspace`.
2. Vitest + Testing Library
   - contratos de `ModuleHeader`, `ModuleToolbar`, `ModuleWorkspace`, estados, callbacks, roles y teclado.
3. Playwright
   - aplicación real, rutas, navegación, responsive, tema, scroll, sidebar e inspector.
4. Axe integrado en Playwright
   - accesibilidad sobre vistas reales y estados interactivos.
5. Snapshots visuales
   - regresión light/dark y desktop/mobile, con revisión humana.

Para `ModuleWorkspace`, comprobar:

- una fila `ModuleHeader` para orientación;
- una fila `ModuleToolbar` solo cuando existan operaciones;
- canvas debajo de ambas filas y con scroll principal estable;
- sidebar e inspector en desktop y como overlay en viewport reducido;
- acciones primarias en la toolbar;
- ausencia de overflow horizontal en 320, 390, 768, 1280 y 1440 px;
- contraste y focus visible en light y dark;
- ausencia de acciones placeholder o estados decorativos.

## Checks disponibles

Ejecutar desde el root del repositorio:

```bash
cd /Users/minoveaz/Documents/Proyectos/loopdev
corepack pnpm front:audit --json
corepack pnpm --filter loopdev-os build
git diff --check
```

Checks generales disponibles:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm quality:static
corepack pnpm validate
```

Resultado conocido reciente:

- `front:audit --json`: `totalFindings: 0`.
- build de `loopdev-os`: correcto, 25 rutas generadas.
- `git diff --check`: correcto.

## Restricciones de trabajo

- No tocar Supabase, RLS, auth, persistencia, migraciones ni secretos.
- No crear commits.
- No crear ramas.
- No revertir cambios de usuario o de otros agentes.
- Mantener Inter para interfaz y JetBrains Mono solo para datos técnicos.
- Usar primitives de `@loopdev/ui` y tokens oficiales.
- Preferir cambios pequeños, locales y reversibles.
- Después de cada edición ejecutar un check enfocado.
- Responder en español.

## Procedimiento recomendado para el siguiente agente

1. Ejecutar:

   ```bash
   cd /Users/minoveaz/Documents/Proyectos/loopdev
   git status --short
   ```

2. Leer este documento y después los archivos normativos de `docs/02-frontend`.
3. Leer el archivo concreto que controla la composición a modificar.
4. Formular una hipótesis local antes de editar.
5. Aplicar el cambio mínimo.
6. Ejecutar inmediatamente una validación enfocada.
7. Ejecutar build/auditoría si el cambio afecta al shell o a una suite.
8. No reabrir decisiones ya cerradas salvo que el código contradiga explícitamente la arquitectura.

## Próximo trabajo sugerido

Migrar gradualmente `apps/loopdev-os/src/app/sales-crm/pipeline/page.tsx` para que:

- desaparezca su panel de header duplicado;
- `Nuevo Lead` viva en `toolbarSlot`;
- tabs y filtros vivan en la toolbar contextual;
- el Kanban sea el canvas principal;
- el inspector de lead permanezca contextual;
- se mantengan intactos los flujos de datos y negocio.
