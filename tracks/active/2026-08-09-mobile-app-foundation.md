---
id: mobile-app-foundation
title: Fundación de la aplicación móvil de LoopDev
status: active
created: 2026-08-09
updated: 2026-08-12
owner: mobile
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/2026-08-09-mobile-app-foundation.md
---

# Fundación de la aplicación móvil de LoopDev

## Outcome

Track existente consolidado. El outcome operativo se conserva en la especificación migrada y debe formalizarse en la próxima actualización del track.

## Fases

Las fases, checkpoints y tareas existentes se preservan en la especificación migrada.

## Criterios de cierre

- [ ] Formalizar criterios de cierre verificables durante la próxima actualización.
- [ ] Obtener aprobación explícita del usuario antes de mover el track a `closed`.

## Especificación migrada

**Fecha:** 2026-08-09  
**Estado:** En progreso — Launchpad multi-suite integrado; pendiente igualar comportamiento con desktop y cerrar validaciones de plataforma
**Objetivo:** consolidar la base de una aplicación móvil iOS/Android para LoopDev con autenticación Supabase, contexto multi-organización, una entrada Launchpad multi-suite y una experiencia UI/UX móvil propia. CRM y comunicaciones se construirán como una suite posterior, no como la entrada global de la aplicación.

## Estado actual — 2026-08-10

La fundación inicial fue implementada en `apps/loopdev-mobile` y fusionada en `develop` mediante el PR #32. Los checks de CI, CodeQL, typecheck, lint, tests y frontend terminaron correctamente.

### Completado

- Aplicación Expo/React Native con ejecución web, Android preparado y ruta de prueba para iOS mediante Expo Go.
- Login, logout y restauración de sesión con Supabase Auth.
- Persistencia de sesión en SecureStore para native y localStorage para web.
- Carga real de organizaciones, membresías, roles, permisos, estado y conteos desde Supabase/RLS.
- Filtrado explícito de organizaciones por membresías del usuario.
- Persistencia y restauración de la organización activa.
- Selector de organización reutilizable con cambio interactivo y rol visible.
- Contratos de datos separados de fixtures y adaptadores.
- Suite móvil aislada de los tests del escritorio.
- Checks móviles y guardas estructurales integrados en CI.

### Completado desde la integración inicial

- Launchpad móvil con suites reales filtradas por organización activa.
- Catálogo de plataforma de LoopDev para `Marketing Studio`, `Sales CRM`, `Quant Ops`, `Financial Ops` y `Health OS`.
- Estados `ready` y `disabled` según disponibilidad de la suite.
- Cambio de organización validado en runtime y cubierto por una prueba de integración del shell.
- Tests de loader, presentación y shell para selección de organización y suites.

### Pendiente inmediato

- Estandarizar el Login móvil visualmente con el acceso desktop usando componentes nativos.
- Comparar el Launchpad móvil con el Launchpad desktop remoto y alinear catálogo, estados, permisos y navegación.
- Mantener la composición móvil nativa: no copiar el layout desktop ni convertir el Launchpad en una pantalla web comprimida.
- Crear el shell independiente de cada suite; CRM será la primera suite funcional y alojará comunicaciones/WhatsApp.
- Completar validación Android/iOS y estados UX offline, permisos insuficientes y sesión expirada.
- Cerrar la cobertura específica de permisos y navegación de suites cuando existan shells reales.

La selección de suite será el primer destino después del login:

```text
Login -> Launchpad -> organización activa -> suite autorizada -> shell de suite
```

## Contexto y decisión principal

LoopDev dispone de una aplicación web SaaS en `apps/loopdev-os`, un monorepo con pnpm y Turbo, un Design System web en `@loopdev/ui`, contratos compartidos en `@loopdev/contracts` y Supabase como plataforma de autenticación, persistencia, RLS, Storage y Realtime.

Todavía no existe una aplicación móvil en el repositorio ni una integración con Expo, React Native o Capacitor. El despliegue de LoopDev en Render será responsabilidad de otro equipo y no debe bloquear el trabajo inicial de la aplicación móvil.

La decisión inicial es:

- crear una aplicación independiente en `apps/loopdev-mobile`;
- utilizar Expo, React Native y TypeScript; la navegación actual parte de un shell React Native controlado por `AppRoot` y evolucionará a stacks/tabs explícitos al implementar el Launchpad;
- reutilizar contratos, dominio, permisos y tokens conceptuales, pero no copiar componentes web literalmente;
- trabajar inicialmente con fixtures y/o Supabase local o de desarrollo;
- preparar desde el inicio una frontera de API compatible con el futuro backend desplegado en Render;
- priorizar una experiencia móvil propia, no una versión reducida del AppShell de escritorio;
- posponer el desarrollo funcional profundo del CRM hasta cerrar el Launchpad multi-suite y los criterios de calidad de la fundación.

## Resultado esperado del track

Al cerrar este track inicial debe existir una base móvil capaz de:

- arrancar localmente con instrucciones documentadas;
- ejecutarse en Android y quedar preparada para iOS;
- tener navegación pública y autenticada;
- representar correctamente loading, error, vacío, offline y sesión expirada;
- ofrecer un sistema visual móvil consistente con LoopDev;
- incluir componentes y patrones UI/UX reutilizables;
- tener una estrategia de datos configurable entre fixtures, Supabase y futura API de Render;
- contar con pruebas locales automatizadas;
- contar con validaciones integradas en CI sin depender de Render;
- permitir iniciar después el módulo CRM sobre una base estable.

## Fuera de alcance inicial

No forman parte de este track:

- completar todas las suites de LoopDev en móvil;
- replicar el escritorio panel por panel;
- implementar el CRM completo;
- integrar WhatsApp o proveedores externos;
- implementar trading operativo desde el dispositivo;
- publicar todavía en App Store o Google Play;
- configurar Render;
- introducir claves secretas en la aplicación;
- crear microservicios o duplicar el backend existente.

El CRM aparece al final como siguiente track o fase de transición, no como parte del primer incremento funcional de este track.

## Arquitectura objetivo

```text
apps/loopdev-mobile
        |
        +--> Expo Router / pantallas móviles
        +--> componentes nativos y tokens móviles
        +--> TanStack Query / estado remoto
        +--> Supabase Auth y lecturas protegidas
        +--> cliente API configurable
                        |
                        +--> fixtures locales durante UI/UX
                        +--> Supabase local/dev durante integración
                        +--> Render API cuando esté disponible

Supabase
        +--> Auth
        +--> PostgreSQL + RLS
        +--> Storage
        +--> Realtime

Render futuro
        +--> APIs server-side
        +--> webhooks
        +--> workers
        +--> operaciones con secretos
```

### Design System multiplataforma

```text
ds/packages/
        design-tokens       valores y roles semánticos compartidos
        design-contracts    estados, variantes y contratos compartidos
        ui                  implementación web
        ui-native           implementación React Native

apps/loopdev-os     -> @loopdev/ui        -> tokens + contracts
apps/loopdev-mobile -> @loopdev/ui-native -> tokens + contracts
```

La web no se migra mediante un cambio masivo de rutas o imports. `@loopdev/ui` se conserva como API pública de `loopdev-os`; primero se añaden los paquetes compartidos, después se conectan gradualmente a web y móvil. La arquitectura, el mapeo de componentes y las reglas de composición están documentados en `docs/02-frontend/MULTIPLATFORM_DESIGN_SYSTEM_ARCHITECTURE.md`.

## Estructura inicial propuesta

```text
apps/loopdev-mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── organization-select.tsx
│   └── (tabs)/
│       ├── home.tsx
│       ├── activity.tsx
│       ├── notifications.tsx
│       └── profile.tsx
├── src/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── navigation/
│   │   └── notifications/
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── environment.ts
│   │   ├── query-client.ts
│   │   ├── storage.ts
│   │   └── supabase.ts
│   ├── providers/
│   ├── theme/
│   └── types/
├── assets/
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

La estructura es orientativa. No se deben crear carpetas vacías o abstracciones sin una necesidad concreta.

## Fases de desarrollo

### Fase 0 — Decisiones de producto, alcance y contrato de trabajo

**Propósito:** cerrar las decisiones mínimas antes de escribir pantallas para evitar construir una app genérica sin usuario ni flujo principal.

**Decisión inicial:** el usuario principal de esta primera versión móvil será un usuario autenticado de LoopDev, con identidad, membresías, roles y permisos provenientes de Supabase. `superdev` puede servir como usuario de validación, pero no debe estar codificado como identidad ni conceder acceso implícito a todas las organizaciones.

El primer flujo móvil será:

1. iniciar sesión con Supabase Auth;
2. acceder al Launchpad móvil de LoopDev;
3. seleccionar una organización válida según sus membresías;
4. consultar las suites habilitadas para esa organización;
5. entrar al shell de una suite autorizada;
6. cerrar sesión y volver al flujo público.

El acceso global del usuario `superdev` es una capacidad de producto, no una razón para omitir controles. La UI, los adaptadores de datos y las futuras APIs deben seguir expresando permisos, organización activa y trazabilidad para que el modelo pueda extenderse a otros perfiles sin rehacer el shell.

**Estrategia inicial de datos:** las organizaciones, los usuarios, las membresías y los permisos se conectarán a los datos reales ya disponibles en backend y base de datos. La actividad reciente, las notificaciones pendientes y el estado general de la plataforma se representarán inicialmente mediante fixtures locales con contratos estables. Los accesos rápidos del Home serán acciones de navegación y no requerirán persistencia propia. Ningún fixture será fuente autoritativa de persistencia.

**Tareas:**

- validar que `superdev` es el usuario principal de la primera versión móvil;
- confirmar que el primer shell será general de LoopDev y no estará orientado todavía a un CRM completo;
- documentar las acciones móviles de mayor valor;
- definir qué operaciones quedan exclusivamente en escritorio;
- elegir dispositivos objetivo iniciales: Android compacto, Android grande, iPhone compacto y iPhone grande;
- definir soporte inicial de orientación, idioma, zona horaria y accesibilidad;
- acordar el límite entre Supabase directo y futura API de Render;
- acordar nombres de entornos: local, development/staging y production;
- identificar las tablas, consultas y contratos existentes para organizaciones, usuarios, membresías y permisos;
- definir modelos de fixture para actividad, notificaciones y resumen global sin presentarlos como datos persistidos;
- documentar decisiones en este mismo track durante las revisiones.

**Entregables:**

- mapa de navegación inicial;
- inventario de pantallas del MVP de fundación;
- lista de estados por pantalla;
- decisión de plataforma y versiones mínimas;
- matriz de responsabilidades entre equipo móvil, backend y Render.

**Criterios de aceptación:**

- no quedan pantallas prioritarias sin usuario o propósito;
- cada flujo tiene entrada, salida y estados de error definidos;
- se identifica qué puede probarse sin Render;
- se separan explícitamente los datos reales de los fixtures y de las acciones de navegación;
- el alcance de CRM está explícitamente separado.

### Fase 1 — Instalación y arranque local reproducible

**Propósito:** lograr que cualquier desarrollador pueda instalar y ejecutar la app móvil localmente antes de construir UI/UX.

**Tareas:**

- crear `apps/loopdev-mobile` dentro del workspace pnpm;
- instalar Expo, React Native, TypeScript y Expo Router;
- integrar los scripts con las convenciones del monorepo;
- definir comandos de desarrollo, typecheck, lint y test;
- configurar variables de entorno por entorno sin introducir secretos;
- configurar Expo Secure Store para la futura sesión;
- configurar el cliente Supabase móvil sin APIs exclusivas del navegador;
- crear providers base: navigation, query, theme y environment;
- crear una pantalla de arranque mínima y una pantalla de error fatal;
- documentar instalación de Node, pnpm, Expo Go/emulador Android y requisitos de iOS;
- verificar que el proyecto puede arrancar con fixtures aunque Supabase no esté disponible;
- preparar configuración inicial de EAS sin publicar builds todavía.

**Comandos objetivo:**

```text
pnpm install
pnpm --filter loopdev-mobile dev
pnpm --filter loopdev-mobile typecheck
pnpm --filter loopdev-mobile lint
pnpm --filter loopdev-mobile test
```

**Criterios de aceptación:**

- una persona nueva puede arrancar la app siguiendo la documentación;
- la app se abre en Android local o Expo Go;
- el arranque no requiere Render;
- no se imprimen secretos en logs;
- los scripts del paquete funcionan desde la raíz y desde la aplicación;
- el typecheck y lint inicial pasan en local.

### Fase 2 — Fundaciones UI/UX móvil

**Propósito:** diseñar y construir el lenguaje visual y los patrones de interacción móviles antes de implementar CRM.

**Decisión de design system:** la implementación móvil vivirá en `@loopdev/ui-native`. No se copiará `@loopdev/ui` dentro de `apps/loopdev-mobile`; ambas implementaciones consumirán tokens y contratos compartidos.

**Principio:** la interfaz móvil no será una copia comprimida del escritorio. El AppShell y el ModuleWorkspace web se transformarán en navegación, stacks, tabs, drawers y bottom sheets apropiados para interacción táctil.

**Tareas de experiencia:**

- definir Mobile Shell;
- definir navegación principal y navegación de detalle;
- decidir qué acciones viven en tab bar, header, menú o bottom sheet;
- definir jerarquía de información para pantallas pequeñas;
- diseñar estados de loading, error, vacío, offline, éxito y permisos insuficientes;
- diseñar formularios con teclado, foco, validación y recuperación ante error;
- establecer touch targets mínimos y comportamiento de scroll;
- definir accesibilidad: labels, orden de foco, contraste y tamaños de texto;
- definir comportamiento ante notch, safe areas y teclado virtual;
- definir feedback táctil solo para acciones significativas;
- preparar navegación por deep link como capacidad futura, sin acoplarla a una suite concreta.
- definir la frontera `design-tokens` / `design-contracts` / `@loopdev/ui` / `@loopdev/ui-native`;
- documentar el mapeo entre componentes web y composiciones nativas;
- sustituir los colores locales por roles semánticos compartidos;
- validar que la extracción de tokens no cambia los imports ni rompe `loopdev-os`.

**Tareas de implementación:**

- crear tokens móviles de color, tipografía, espaciado, radios, elevación y estados;
- crear componentes base: `Screen`, `Stack`, `Text`, `Button`, `IconButton`, `Input`, `Card`, `Badge`, `Avatar`, `ListItem`, `Divider`, `EmptyState`, `LoadingState`, `ErrorState`, `BottomSheet` y `ConfirmationDialog`;
- crear variantes accesibles y estados disabled/loading/pressed;
- crear componentes de navegación: header, tab bar, back action, menu y breadcrumbs móviles cuando proceda;
- crear fixtures visuales para validar componentes sin backend;
- probar componentes en tamaños de pantalla compactos y grandes;
- mantener una separación clara entre componentes de presentación y datos.

**Criterios de aceptación:**

- las pantallas no generan overflow horizontal;
- los textos no se cortan ni se superponen;
- las acciones principales son alcanzables con una mano cuando sea razonable;
- todos los componentes interactivos tienen estados pressed, disabled y loading cuando aplique;
- cada estado vacío explica la acción siguiente sin depender de texto técnico;
- los componentes soportan contenido largo y errores de validación;
- los patrones visuales están documentados mediante ejemplos o fixtures;
- la UI se valida en Android compacto, Android grande, iPhone compacto y iPhone grande.

### Fase 3 — Navegación y shell funcional

**Propósito:** convertir las fundaciones visuales en un shell navegable y comprobable.

**Tareas:**

- implementar rutas públicas y autenticadas;
- implementar splash/loading inicial;
- implementar navegación tabular principal;
- implementar navegación de detalle y retorno;
- implementar modal/bottom sheet para acciones secundarias;
- preservar correctamente el estado al cambiar de pantalla;
- gestionar back button de Android;
- definir rutas desconocidas y recuperación de navegación;
- preparar deep links con una ruta de prueba;
- mostrar menú de organización y perfil sin conectar todavía todas las acciones de negocio.

**Criterios de aceptación:**

- una persona puede recorrer el shell sin quedarse atrapada en una pantalla;
- el botón back de Android se comporta de forma predecible;
- los estados de navegación se conservan al volver;
- la app abre correctamente una ruta inicial y una ruta autenticada;
- las rutas protegidas no muestran contenido privado sin sesión.

### Fase 4 — Datos, autenticación y estados reales

**Propósito:** sustituir gradualmente los fixtures por datos reales de desarrollo sin bloquear el trabajo UI/UX.

**Tareas:**

- implementar login y logout mediante Supabase Auth;
- persistir sesión mediante almacenamiento seguro;
- implementar renovación y sesión expirada;
- cargar organizaciones y membresías del usuario;
- implementar selección de organización activa;
- aplicar permisos a navegación y acciones visibles;
- crear `api-client` con base URL configurable;
- soportar adaptadores `fixtures`, `supabase` y `render-api` sin mezclar responsabilidades;
- validar contratos con `@loopdev/contracts` cuando existan esquemas aplicables;
- crear manejo común de errores y `traceId` para futuras APIs;
- implementar refresh, retry controlado y cancelación de consultas.

**Criterios de aceptación:**

- la sesión sobrevive al cierre y reapertura de la app;
- logout limpia la sesión local y devuelve al login;
- [x] usuarios sin membresía reciben un estado claro.
- una organización no puede consultar datos de otra por el cliente móvil;
- [x] una operación sin permiso no aparece o se bloquea con feedback comprensible;
- cambiar de fixture a Supabase no requiere modificar componentes de presentación;
- cambiar la URL futura hacia Render no requiere reescribir las pantallas.

### Fase 5 — Calidad, pruebas y preparación de CI

**Propósito:** convertir la calidad móvil en una condición permanente del repositorio, no en una revisión manual al final.

**Pruebas locales obligatorias:**

- typecheck de la app y contratos;
- lint de la app;
- tests unitarios de utilidades, adaptadores y permisos;
- tests de componentes con React Native Testing Library;
- tests de navegación y protección de rutas;
- tests de estados de carga, error y vacío;
- tests de formularios y validación;
- tests de persistencia y recuperación de sesión con almacenamiento mock;
- tests de cambio de organización;
- tests de API client con respuestas exitosas y errores estándar;
- pruebas de accesibilidad de componentes críticos;
- smoke test de arranque en un dispositivo o emulador cuando esté disponible.

**Pruebas de integración posteriores:**

- autenticación contra Supabase local/dev;
- lectura de organizaciones y membresías;
- RLS y aislamiento entre organizaciones;
- actualización de sesión;
- comportamiento ante red intermitente;
- integración con API staging cuando Render esté disponible.

**CI de GitHub:**

- instalar Node y pnpm con versiones fijadas;
- ejecutar `pnpm install --frozen-lockfile`;
- ejecutar lint móvil;
- ejecutar typecheck móvil;
- ejecutar tests móviles en modo no interactivo;
- ejecutar build/check de contratos cuando sea necesario;
- conservar cobertura y resultados como artifacts;
- evitar que CI dependa de un dispositivo físico;
- separar checks unitarios deterministas de checks que requieran Supabase o secretos;
- añadir una job de integración con Supabase local solo cuando sea estable en CI;
- añadir builds EAS como job separado y protegido, no como requisito de cada PR inicial.

**Criterios de aceptación:**

- un PR con fallo de lint, typecheck o tests móviles queda bloqueado;
- los tests no dependen de datos personales ni producción;
- los errores de CI identifican el paquete y la prueba afectada;
- la cobertura se publica de manera reproducible;
- existe una prueba de regresión para cada bug móvil corregido;
- la matriz de CI distingue checks rápidos de checks de integración.

### Fase 6 — Revisión de fundación y handoff hacia CRM

**Propósito:** comprobar que la base está suficientemente madura antes de construir funcionalidades CRM.

**Checklist de salida:**

- [x] Instalación local documentada y verificada en el worktree móvil.
- [x] Expo app arranca sin Render.
- [ ] Android local validado en emulador o dispositivo físico.
- [ ] Preparación de iOS documentada, aunque el desarrollo inicial se haga en Windows.
- [x] Shell móvil aprobado funcionalmente como Launchpad multi-suite.
- [ ] Paridad funcional del Launchpad móvil con desktop remoto validada.
- [x] Tokens y componentes base aprobados.
- [ ] Estados de UX definidos para las pantallas prioritarias.
- [x] Navegación pública, Launchpad y suites cubierta por tests.
- [x] Auth y persistencia de sesión implementadas y cubiertas por tests base.
- [x] Sesión expirada presentada al usuario y cubierta por test de pantalla.
- [x] Organización activa, membresías, permisos y selección de suite cubiertos por tests.
- [x] Cliente de datos desacoplado de la UI.
- [x] Fixtures y datos reales separados.
- [x] CI ejecuta checks móviles de forma estable.
- [x] No existen secretos móviles en el repositorio.
- [x] Dependencias con Render documentadas para el siguiente equipo.
- [ ] Decisión explícita sobre el primer flujo CRM.

Solo después de completar esta checklist se iniciará el siguiente track o la fase CRM.

## Estrategia de integración con Render

Render no es dependencia de las primeras fases. La app debe funcionar con una URL configurable:

```text
local/mock       -> fixtures o servidor local
supabase-dev     -> Supabase de desarrollo
staging          -> https://staging.loopdev.dev/api/v1
production       -> https://app.loopdev.dev/api/v1
```

Las futuras APIs móviles deberán cumplir el estándar existente:

- `Authorization: Bearer <supabase-access-token>`;
- respuestas `{ data, meta }`;
- errores `{ error: { code, message, details, traceId } }`;
- versionado `/api/v1`;
- paginación definida;
- validación de organización y permisos server-side;
- secretos exclusivamente en Render o Supabase server-side.

La aplicación no debe contener `SUPABASE_SERVICE_ROLE_KEY`, credenciales de proveedores, claves de Binance ni secretos OAuth.

## Criterios técnicos transversales

- TypeScript estricto.
- Sin dependencia de APIs del navegador dentro del cliente móvil.
- Sin duplicar tipos de dominio si pueden vivir en `@loopdev/contracts`.
- Sin lógica de negocio sensible exclusivamente en el teléfono.
- Sin consultas que omitan organización, marca o permiso cuando sean necesarios.
- Sin usar fixtures como fuente autoritativa de persistencia.
- Estados de carga, error, vacío y offline definidos desde la primera pantalla.
- Componentes nativos con touch targets y accesibilidad adecuados.
- Dependencias fijadas y compatibles con pnpm/Turbo.
- Ningún cambio a Supabase, RLS o persistencia real sin revisión explícita.
- Mantener los cambios móviles aislados del shell web salvo contratos o tokens compartidos necesarios.

## Riesgos y mitigaciones

### Construir una copia reducida del escritorio

**Riesgo:** una interfaz con sidebars, paneles e inspectores simultáneos no se adapta bien al teléfono.  
**Mitigación:** definir navegación móvil propia con tabs, stacks, drawers y bottom sheets.

### Avanzar con mocks sin contrato

**Riesgo:** las pantallas funcionan con fixtures pero no con datos reales.  
**Mitigación:** fixtures con la misma forma de respuesta que Supabase/API y validación mediante contratos.

### Esperar a Render para iniciar

**Riesgo:** se retrasa UI/UX y se mezclan problemas de infraestructura con problemas de interfaz.  
**Mitigación:** cliente de datos configurable y adapters locales desde la primera fase.

### Subestimar iOS desde Windows

**Riesgo:** no se valida el comportamiento final de iOS durante el desarrollo local.  
**Mitigación:** Android y Expo Go como feedback inicial, documentación de requisitos iOS y builds EAS/TestFlight cuando exista un equipo Apple.

### Tests ejecutados solo al final

**Riesgo:** regresiones de navegación y estados difíciles de localizar.  
**Mitigación:** tests de componentes y navegación junto con cada incremento de UI.

## Secuencia de revisión del track

1. Revisar y aprobar el alcance de la Fase 0.
2. Crear la aplicación Expo y validar la Fase 1.
3. Revisar el primer mapa de navegación y tokens UI/UX.
4. Construir componentes y estados de la Fase 2.
5. Validar el shell y la navegación de la Fase 3.
6. Integrar Auth/Supabase de desarrollo en la Fase 4.
7. Activar y endurecer CI en la Fase 5.
8. Ejecutar la checklist de la Fase 6.
9. Abrir el track específico del módulo CRM.

## Próxima acción propuesta

La siguiente implementación será estandarizar el acceso móvil y reemplazar la entrada directa al Home por un Launchpad multi-suite:

1. alinear visualmente `LoginScreen` con el login desktop usando componentes nativos;
2. crear `LaunchpadScreen` con la organización activa y cards de suites;
3. cargar suites disponibles desde membresías, permisos y workspaces habilitados;
4. navegar a un shell inicial de `Sales & CRM` como primera suite funcional;
5. mantener CRM/WhatsApp detrás de ese shell y no como entrada global de la aplicación.

## Registro de migración

- Consolidado en el sistema de tracks de un archivo el 2026-08-12.
- El estado y owner iniciales fueron asignados por la política de migración aprobada.
