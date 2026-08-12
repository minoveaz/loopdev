---
id: loopdev-frontend-quality-system
title: LoopDev Frontend Quality System
status: active
created: 2026-08-08
updated: 2026-08-12
owner: governance
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/2026-08-08-loopdev-frontend-quality-system.md
lead: null
branches: [feature/frontend-work3]
phase: 1
pull_requests: []
issues: []
packages: []
release: not-required
---

# LoopDev Frontend Quality System

## Outcome

Track existente consolidado. El outcome operativo se conserva en la especificación migrada y debe formalizarse en la próxima actualización del track.

## Branch strategy

El sistema de calidad se ejecuta por oleadas de certificación. Las ramas de cada oleada se registran en `branches` y la fase correspondiente conserva su evidencia.

## Fases

Las fases, checkpoints y tareas existentes se preservan en la especificación migrada.

## Criterios de cierre

- [ ] Formalizar criterios de cierre verificables durante la próxima actualización.
- [ ] Obtener aprobación explícita del usuario antes de mover el track a `closed`.

## Especificación migrada

**Fecha:** 2026-08-08  
**Estado:** En progreso
**Objetivo:** convertir los principios visuales de LoopDev en reglas ejecutables y pruebas repetibles para que todas las suites mantengan una identidad coherente en desktop, móvil, modo claro y modo oscuro.

## Avance registrado — 2026-08-08

### Completado

- Auditor frontend operativo en `scripts/front-audit.mjs`.
- Filtros focalizados por `--file` y `--rule`.
- Salida JSON con resumen por regla y archivo mediante `findingsByFile`.
- Deduplicación de hallazgos.
- Modo estricto opcional con `--fail-on-findings`.
- Baseline documentado en `docs/04-governance/FRONTEND_AUDIT_BASELINE_2026-08-08.md`.
- Migración visual de la deuda inicial: de 169 hallazgos a 0.
- Regla `shellArchitecture` para proteger la separación `AppShell` / `ModuleWorkspace`.
- `ModuleWorkspace` explícito en Marketing Studio, Sales CRM, Quant Ops y Health OS.
- Eliminación de `SuiteContentFrame` como wrapper visual alternativo.
- Consolidación normativa en `docs/02-frontend/SHELL_ARCHITECTURE.md` y aclaración del workspace compartido.
- Validaciones realizadas: auditor completo en cero, `git diff --check` y build de `loopdev-os` correcto.
- Trabajo de Fase 1 ejecutado en la rama `feature/frontend-work3`: `TechnicalText`, `SectionHeader`, normalización de estados vacíos, iconografía aprobada, headings semánticos, `IconButton` y protección de overflow en `ModuleToolbar`.
- Tests focalizados de primitives compartidos y typecheck de `loopdev-os` validados.
- Fase 1 cerrada: añadidos `PageHeader`, `ContextBar`, `ResponsiveTable` y `LoadingState`, con contratos tipados, exports públicos, documentación breve y tests de semántica, slots, estados vacíos y responsive.
- Fase 2 iniciada: creado `pnpm front:check` como gate compuesto estricto y conectado al workflow de CI; `front:audit --fail-on-findings` queda validado con 0 hallazgos.
- Baseline de Fase 2 versionado en `config/frontend-audit-baseline.json`; `front:check` diferencia deuda aceptada de regresiones nuevas mediante `--fail-on-new-findings`.
- Matriz de certificación versionada en `docs/04-governance/FRONTEND_CERTIFICATION_MATRIX_2026-08-08.md` con el resultado de `front:check` por suite y las dimensiones aún pendientes.
- Fase 2 cerrada: constitución visual corta creada, `shellArchitecture` endurecida contra layouts operativos sin `ModuleWorkspace` y wrappers de shell no registrados, y `pnpm front:check` validado con 0 hallazgos nuevos.

### Pendiente

- Mantener la constitución visual corta de consulta diaria en `docs/02-frontend/LOOPDEV_FRONTEND_CONSTITUTION.md`.
- Mantener la matriz versionada de certificación por suite y actualizarla con evidencia de Fase 3 y posteriores.
- Añadir pruebas Playwright de shell, responsive, temas y overflow; esta tarea pertenece a la Fase 4, no a la Fase 1.
- Revisar visualmente las cuatro suites en desktop, mobile, light y dark.
- Implementar el flujo de certificación frontend por capas: `front:audit` → Vitest + Testing Library → Playwright → Axe integrado en Playwright → snapshots visuales.
- Mantener `shellArchitecture` con excepciones explícitas y detección de wrappers no registrados.
- Revisar periódicamente las excepciones del baseline y actualizar la matriz con evidencia de las fases posteriores.
- Completar la cobertura de componentes y Axe para primitives compartidos; esto corresponde a la Fase 3.
- Ejecutar Playwright, Axe y snapshots en GitHub Actions con reportes y checks de PR; esto corresponde a la Fase 4.1.
- Registrar las excepciones y la deuda residual por suite.

### Estado actual

- **Fase 0 — Inventario y línea base:** completada.
- **Fase 1 — Primitives y contratos visuales:** completada en esta iteración.
- **Fase 2 — Quality Gate automático:** completada en esta iteración.
- **Fase 3 — Pruebas de componentes:** completada; cobertura de componentes compartidos, navegación, indicators, surfaces e composites complejos validada con Vitest/Testing Library y Axe donde el montaje es estable.
- **Fase 4 — Pruebas reales de aplicación:** completada; las suites prioritarias tienen cobertura Playwright separada por Desktop Web, Mobile Web y Mobile Compact, con checks de navegación, responsive, overflow y accesibilidad según su alcance.
- **Fase 4.1 — Flujo de certificación frontend:** completada; el flujo `front:audit` → Vitest/Testing Library → Playwright → Axe → snapshots visuales está integrado en CI y cuenta con evidencia versionada.
- **Fase 5 — Migración por suite:** completada; Launchpad, Marketing Studio, Sales CRM, Health OS y Quant Ops fueron revisadas con auditoría, build y certificación de aplicación light/dark. Health OS queda certificado en alcance shell/responsive y Quant Ops en Desktop Web-only.

La ejecución de checks en GitHub Actions no constituye una fase independiente. Los checks estáticos y `front:check` se incorporan en la Fase 2; Playwright, Axe, snapshots y los checks requeridos de Pull Request se incorporan en la Fase 4.1.

La Fase 5 queda cerrada con la evidencia registrada en la matriz. GitHub Actions E2E, Axe de navegador y snapshots se ejecutan en sus proyectos definidos, mientras que las suites sin versión móvil permanecen fuera de los proyectos mobile.

### Evidencia de separación Playwright

La configuración actual lista `19` tests en `desktop`, `12` tests en `mobile` y `12` tests en `mobile-compact`. `authenticated.application.spec.mjs`, incluidos Sales CRM y Quant Ops, se ejecuta únicamente en desktop; `authenticated.mobile.spec.mjs` se ejecuta únicamente en los dos proyectos mobile. Quant Ops queda fuera de mobile por decisión de producto. Health OS conserva únicamente cobertura de shell/responsive en mobile, no certificación funcional de sus módulos internos.

El scan Axe desktop cubre login, launchpad y Sales Pipeline sin violaciones críticas o serias. Sales Pipeline queda certificado en accesibilidad de navegador para desktop; el resto de suites mantiene el alcance indicado en la matriz.

### Evidencia de cierre de Fase 5

`e2e/phase5.certification.spec.mjs` valida las cinco suites en light y dark con sesión E2E, contenido principal visible, ausencia de overflow horizontal y ausencia de errores de navegador no conocidos: 10 tests PASS. `front:audit --file` devuelve 0 hallazgos para cada suite y `pnpm --filter loopdev-os build` pasa con el bypass E2E de CI.

### Nomenclatura de superficies

- **Desktop Web:** aplicación web en viewport de escritorio; proyecto Playwright `desktop`.
- **Responsive Web:** comportamiento adaptable de la aplicación web, validado mediante Mobile Web y Mobile Compact.
- **Mobile Web:** aplicación web en viewport móvil; proyecto Playwright `mobile`.
- **Mobile Compact:** viewport móvil extremo de `320x800`; proyecto Playwright `mobile-compact`.
- **Mobile App:** aplicación instalada de `apps/loopdev-mobile`, independiente de los proyectos Playwright web.

## 1. Contexto

LoopDev ya dispone de una base sólida:

- monorepo con pnpm y Turbo;
- `loopdev-os` sobre Next.js, React y TypeScript estricto;
- Design System compartido en `@loopdev/ui`;
- tokens en `@loopdev/tokens`;
- contratos en `@loopdev/contracts`;
- documentación de composición, accesibilidad, testing y certificación;
- Vitest, React Testing Library, ESLint y Playwright disponibles o previstos en la arquitectura.

Sin embargo, las reglas actuales son principalmente documentales. El frontend permite que cada suite introduzca variaciones sin una señal automática clara:

- tipografía de telemetría usada en títulos o contenido normal;
- headings y párrafos construidos directamente con Tailwind;
- colores, tamaños y fuentes hardcodeados;
- layouts que fuerzan dark mode desde una suite;
- iconos funcionales mezclados entre Lucide, Material Symbols y nombres abstractos;
- componentes manuales duplicados fuera de `@loopdev/ui`;
- responsive validado visualmente de forma irregular;
- ausencia de una matriz de certificación ejecutable por suite.

El problema no es la falta de documentación. Es la falta de una autoridad ejecutable que detecte las desviaciones durante el desarrollo y antes del merge.

## 2. Decisiones

### 2.1 No volver a Storybook como centro del proceso

Storybook puede conservarse como documentación si sigue siendo útil, pero no será el mecanismo principal de calidad. La validación se apoyará en:

- ESLint y reglas AST;
- checks de tokens y composición;
- Vitest y React Testing Library;
- Axe en pruebas de componentes y navegador;
- Playwright para responsive, interacción y screenshots;
- una matriz de certificación por suite.

### 2.2 `@loopdev/ui` es la API visual pública

Las suites podrán usar Tailwind para layout, spacing, grid, flex, posicionamiento y responsive. La tipografía, superficies, botones, estados, iconos e interacción común deben utilizar componentes y tokens aprobados de `@loopdev/ui`.

### 2.3 La base de datos no forma parte de este track

Este track no modifica:

- Supabase;
- migraciones;
- RLS;
- autenticación;
- secretos;
- persistencia SaaS;
- contratos de dominio salvo que una incompatibilidad visual lo requiera explícitamente.

## 3. Constitución visual ejecutable

Crear `docs/02-frontend/LOOPDEV_FRONTEND_CONSTITUTION.md` como documento corto de consulta diaria. Debe ser la referencia operativa, no otra recopilación extensa.

### 3.1 Tipografía

Definir tres niveles semánticos:

| Componente      | Fuente          | Uso permitido                                                |
| --------------- | --------------- | ------------------------------------------------------------ |
| `Heading`       | sans/display    | títulos de página, secciones y entidades                     |
| `Text`          | sans/body       | párrafos, ayudas, descripciones y contenido                  |
| `TechnicalText` | mono/telemetría | IDs, timestamps, estados, labels técnicos y datos operativos |

Reglas:

- la fuente mono no se usa para títulos de página ni párrafos;
- los headings deben renderizar elementos semánticos `h1`-`h6`;
- no se usan clases tipográficas arbitrarias para sustituir la jerarquía del Design System;
- la escala tipográfica procede de tokens;
- las excepciones, como el editor de escalas tipográficas, deben estar documentadas.

### 3.2 Color y superficie

- cero colores HEX en las suites y componentes de producto;
- colores derivados de `@loopdev/tokens` o de `DynamicThemeProvider`;
- ningún layout de suite fuerza `dark` ni sobrescribe variables globales sin una API oficial;
- cada componente debe probar contraste en light y dark;
- las superficies se eligen de la taxonomía oficial: canvas, surface, glass y technical.

### 3.3 Iconografía

Política inicial:

- Lucide es la fuente preferida para iconos funcionales;
- se crea un adaptador oficial `@loopdev/ui` para iconos aprobados;
- Material Symbols solo se mantiene para casos documentados y no duplicados por Lucide;
- no se crean SVG funcionales manuales cuando existe un icono aprobado;
- todo icono interactivo debe tener nombre accesible y tooltip cuando el significado no sea obvio;
- ilustraciones de dominio pueden ser custom, pero no sustituyen iconos de acción.

### 3.4 Responsive

Todas las vistas de suite deben funcionar, como mínimo, en:

- 320 x 800;
- 390 x 844;
- 768 x 1024;
- 1280 x 800;
- 1440 x 900.

Criterios:

- sin overflow horizontal no intencionado;
- headers y sidebars no colisionan;
- tablas tienen estrategia explícita de scroll o adaptación;
- textos, botones y badges no se solapan ni desbordan;
- el menú móvil es operable por teclado y touch;
- los estados de carga y error también son responsive.

## 4. Alcance técnico

### Fase 0 — Inventario y línea base

**Objetivo:** medir la deuda actual sin bloquear todavía el desarrollo.

Entregables:

- `pnpm front:audit`;
- reporte por archivo y suite;
- inventario de fuentes, colores, iconos, componentes manuales y layouts forzados;
- matriz inicial de certificación;
- lista de excepciones justificadas.

Categorías mínimas del reporte:

- tipografía incorrecta;
- colores hardcodeados;
- valores arbitrarios de tamaño/spacing;
- dark mode forzado;
- iconos no aprobados;
- elementos interactivos manuales;
- componentes sin test;
- rutas sin cobertura responsive;
- imports directos de componentes legacy.

El primer reporte será informativo. No se intentará limpiar todo el repositorio en un solo cambio.

### Fase 1 — Primitives y contratos visuales

**Objetivo:** cerrar las APIs que las suites deben utilizar.

Revisar o crear en `@loopdev/ui`:

- `Heading`;
- `Text`;
- `TechnicalText`;
- `PageHeader`;
- `SectionHeader`;
- `ContextBar`;
- `SuiteHeader`;
- `IconButton`;
- `ResponsiveTable`;
- `LoadingState`;
- `EmptyState`;
- adaptador de iconos aprobados.

Cada primitive debe tener:

- contrato de props tipado;
- soporte light/dark;
- estados disabled/loading/error cuando aplique;
- semántica HTML correcta;
- focus visible;
- test de renderizado y variantes;
- test de accesibilidad;
- documentación breve de uso y no uso.

No crear primitives por duplicación accidental. Antes de añadir uno, responder:

1. ¿Existe ya una API equivalente?
2. ¿Se repite en más de una suite?
3. ¿Es visual o contiene lógica de dominio?
4. ¿La variante pertenece al Design System o a una sola suite?

### Fase 2 — Quality Gate automático

**Objetivo:** convertir la constitución visual en checks.

Crear reglas ESLint o checks AST para detectar:

- HEX en `apps/**`, `modules/**` y componentes de producto;
- `font-mono` aplicado a headings o bloques de contenido;
- `fontFamily`, `fontSize` o `fontWeight` inline fuera de excepciones;
- headings con clases de tipografía en lugar de primitives aprobados;
- `<button>` manual fuera de componentes autorizados;
- iconos no aprobados;
- `dark` forzado en layouts de suite;
- `document.documentElement.style.setProperty` desde páginas o layouts;
- clases arbitrarias de color, tipografía o escala sin justificación.

Crear comandos:

```bash
pnpm front:audit
pnpm classes:check
pnpm lint:ui
pnpm front:check
```

Política de adopción:

1. primera ejecución: reporte informativo;
2. segunda etapa: warnings para archivos modificados;
3. tercera etapa: error bloqueante para código nuevo;
4. deuda antigua controlada mediante baseline versionado, nunca mediante silenciamiento global.

Mensajes de error esperados:

```text
LOOPDEV_UI_001: Use Heading for semantic page or section titles.
LOOPDEV_UI_002: Telemetry typography cannot be used for editorial content.
LOOPDEV_UI_003: Hardcoded color detected. Use a LoopDev token.
LOOPDEV_UI_004: Suite layouts cannot force a color mode.
LOOPDEV_UI_005: Use the approved icon adapter.
```

### Fase 3 — Pruebas de componentes

**Objetivo:** asegurar que los primitives no regresen.

Vitest y React Testing Library deben cubrir:

- renderizado básico;
- variantes y estados;
- semántica y roles;
- keyboard navigation;
- loading, empty y error;
- tema claro y oscuro cuando el componente cambie visualmente;
- reduced motion cuando existan animaciones.

Axe debe ser bloqueante para componentes compartidos.

Los tests deben vivir junto al componente. No se exigirá una historia de Storybook como condición de merge.

### Fase 4 — Pruebas reales de aplicación

**Objetivo:** detectar fallos que JSDOM no puede ver.

Crear pruebas Playwright contra la aplicación real para:

- Launchpad;
- Marketing Studio;
- Sales CRM;
- Health OS;
- Quant Ops.

El primer vertical slice del flujo será Marketing Studio / Brand Hub y Sales CRM /
Pipeline, porque cubren respectivamente directorio, edición, inspector, filtros,
vistas y Kanban.
Cada suite debe probar:

- navegación principal;
- carga, error y empty state;
- theme toggle;
- viewport móvil y desktop;
- ausencia de overflow horizontal;
- nombre accesible de botones e iconos;
- visibilidad de headers, sidebars y contenido principal;
- screenshots de referencia light/dark tras revisión humana.

Evidencia inicial validada el 2026-08-09:

- `pnpm exec playwright test e2e/authenticated.mobile.spec.mjs --project=mobile-compact --grep "brand-hub|sales-pipeline" --workers=1`: 2 tests passed.
- `pnpm --filter @loopdev/ui exec vitest run src/components/composites/shell/AppShell`: 8 tests passed.
- Se corrigió el estado inicial del sidebar interno de Brand Hub para que no abra un Dialog modal en movil y oculte el shell global.

Checks estructurales mínimos:

```ts
expect(
  await page.locator('body').evaluate((element) => element.scrollWidth <= element.clientWidth),
).toBe(true);
```

Los screenshots serán evidencia de regresión, no el único criterio de aprobación.

### Fase 4.1 — Flujo de certificación frontend

**Objetivo:** establecer una secuencia reproducible que combine checks estáticos,
contratos de componentes, comportamiento real, accesibilidad y regresión visual.

El orden oficial de ejecución será:

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

Cada etapa tiene una responsabilidad distinta y no sustituye a la siguiente:

1. **`front:audit`:** detecta desviaciones estáticas de arquitectura, tokens,
   tipografía, primitives, navegación y composición `AppShell` / `ModuleWorkspace`.
2. **Vitest + Testing Library:** verifica contratos de `ModuleHeader`,
   `ModuleToolbar`, `ModuleWorkspace`, estados, callbacks, roles y keyboard flows.
3. **Playwright:** valida la aplicación real en rutas representativas, navegación,
   responsive, tema, scroll y comportamiento de sidebar/inspector.
4. **Axe en Playwright:** ejecuta la auditoría de accesibilidad sobre las vistas
   reales y sus estados interactivos, no solo sobre componentes aislados.
5. **Snapshots visuales:** compara light/dark y desktop/mobile después de que las
   capas funcionales y de accesibilidad estén verdes. Requieren revisión humana
   inicial y actualización deliberada cuando cambia el contrato visual.

Para `ModuleWorkspace`, la certificación mínima debe demostrar:

- una fila `ModuleHeader` para orientación;
- una fila `ModuleToolbar` solo cuando la vista tenga operaciones;
- canvas debajo de ambas filas y con scroll principal estable;
- inspector y sidebar operables en desktop y como overlay en viewport reducido;
- acciones primarias en la toolbar, no en el header global ni en breadcrumbs;
- ausencia de overflow horizontal en 320, 390, 768, 1280 y 1440 px;
- contraste y foco visibles en light y dark;
- ausencia de acciones placeholder o estados decorativos.

La evidencia de cada suite se registrará en la matriz de certificación con el
comando ejecutado, viewport, tema, ruta y resultado. Ningún snapshot verde puede
compensar un fallo de composición, interacción o accesibilidad.

### Fase 5 — Migración por suite

Orden propuesto:

1. Launchpad y shell global;
2. Marketing Studio;
3. Sales CRM;
4. Health OS;
5. Quant Ops.

Para cada suite:

- retirar dark mode forzado;
- sustituir colores hardcodeados;
- migrar headings y body text a primitives;
- migrar botones e iconos;
- normalizar superficies y spacing;
- comprobar light/dark;
- cubrir móvil;
- añadir estados de carga, error y vacío;
- documentar excepciones;
- completar la matriz de certificación.

Marketing Studio será la suite piloto porque contiene Brand Hub, tipografía, identidad visual y varios patrones reutilizables.

## 5. Matriz de certificación

Crear una matriz versionada por suite:

| Suite            |     Light |      Dark |    Mobile |    Tokens |      A11y | Typography |     Icons |     Tests | Estado      |
| ---------------- | --------: | --------: | --------: | --------: | --------: | ---------: | --------: | --------: | ----------- |
| Launchpad        | pendiente | pendiente | pendiente | pendiente | pendiente |  pendiente | pendiente | pendiente | Front_Audit |
| Marketing Studio | pendiente | pendiente | pendiente | pendiente | pendiente |  pendiente | pendiente | pendiente | Front_Audit |
| Sales CRM        | pendiente | pendiente | pendiente | pendiente | pendiente |  pendiente | pendiente | pendiente | Front_Audit |
| Health OS        | pendiente | pendiente | pendiente | pendiente | pendiente |  pendiente | pendiente | pendiente | Front_Audit |
| Quant Ops        | pendiente | pendiente | pendiente | pendiente | pendiente |  pendiente | pendiente | pendiente | Front_Audit |

Estados:

- `Front_Lab`: experimental;
- `Front_Audit`: usable, pero con deuda conocida;
- `Front_Certified`: cumple los gates definidos.

Una suite no puede marcarse como `Front_Certified` si tiene fallos bloqueantes en accesibilidad, responsive, tokens, tema o build.

## 6. Comandos de calidad objetivo

El gate final del frontend será:

```bash
pnpm format:check
pnpm classes:check
pnpm duplication:check
pnpm lint:ui
pnpm typecheck
pnpm test
pnpm test:a11y
pnpm test:responsive
pnpm test:visual
pnpm build
```

Crear un comando compuesto:

```bash
pnpm front:check
```

El comando debe:

- informar qué etapa está ejecutando;
- fallar con mensajes accionables;
- distinguir deuda baseline de regresiones nuevas;
- ser ejecutable localmente y en CI;
- no requerir acceso a producción ni modificar datos reales.

## 7. Definition of Ready

Una tarea frontend puede comenzar cuando:

- la suite y ruta afectadas están identificadas;
- existe un objetivo visual o referencia aprobada;
- se ha elegido el primitive de `@loopdev/ui` o se ha justificado uno nuevo;
- están definidos estados loading, empty, error y success;
- están definidos light/dark y mobile/desktop;
- no requiere cambios ocultos de persistencia para validar la interfaz.

## 8. Definition of Done

Una tarea frontend está terminada cuando:

- usa primitives y tokens oficiales o documenta una excepción;
- no introduce HEX ni fuentes arbitrarias;
- no fuerza un tema desde una suite;
- usa iconos aprobados;
- funciona en viewport móvil y desktop;
- funciona en light y dark;
- tiene semántica y focus accesible;
- tiene tests adecuados a su riesgo;
- pasa `pnpm front:check` o deja explícitamente registrada una deuda existente;
- actualiza la matriz de certificación si afecta una suite.

## 9. Riesgos y controles

### Riesgo: el lint produce demasiado ruido

Control: comenzar como auditoría, generar baseline y bloquear solo código nuevo.

### Riesgo: crear demasiados primitives

Control: exigir decisión de reutilización y prueba de repetición antes de añadir componentes.

### Riesgo: snapshots frágiles

Control: priorizar checks estructurales, limitar screenshots a rutas críticas y revisar cambios visuales intencionados.

### Riesgo: el tema dinámico modifica variables globales de forma inesperada

Control: centralizar theme ownership en providers oficiales y añadir pruebas de restauración al cambiar de suite.

### Riesgo: mezclar datos reales con pruebas visuales

Control: usar fixtures o datos de prueba explícitos; nunca sembrar ni borrar datos Supabase desde Playwright.

## 10. Entregables del track

1. Constitución visual frontend.
2. Auditoría inicial del repositorio.
3. Quality Gate con baseline.
4. Primitives tipográficos y de contexto revisados.
5. Política y adaptador de iconos.
6. Suite piloto certificada.
7. Tests responsive y de accesibilidad en Playwright.
8. Matriz de certificación de todas las suites.
9. `pnpm front:check` integrado en CI.
10. Documentación de excepciones y deuda residual.

## 11. Primeros pasos recomendados

1. Crear la constitución visual corta.
2. Implementar `front:audit` en modo informativo.
3. Obtener el inventario real de violaciones.
4. Revisar `@loopdev/ui` y cerrar la API de tipografía.
5. Migrar Launchpad y Marketing Studio como referencia.
6. Añadir Playwright para light/dark y mobile.
7. Convertir las reglas nuevas en bloqueantes.
8. Continuar con CRM, Health OS y Quant Ops.

## 12. Criterio de éxito

El track se considera completado cuando un cambio frontend nuevo puede responder automáticamente:

- qué primitive visual utiliza;
- qué token controla su apariencia;
- qué fuente corresponde a cada texto;
- cómo se comporta en light/dark;
- cómo se comporta en móvil;
- qué prueba lo protege;
- qué suite queda certificada o qué deuda queda registrada.

La meta no es que todas las pantallas sean idénticas. La meta es que todas hablen el mismo lenguaje visual y que las desviaciones sean visibles, explicables y controlables antes de llegar a producción.

## Registro de migración

- Consolidado en el sistema de tracks de un archivo el 2026-08-12.
- El estado y owner iniciales fueron asignados por la política de migración aprobada.
