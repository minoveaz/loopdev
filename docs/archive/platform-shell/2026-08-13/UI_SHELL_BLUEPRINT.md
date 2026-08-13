# DEPRECATED: LoopDev UI Shell & Workspace Blueprint (v1.5)

> Historical shell blueprint. The current direction is `SuiteShell` +
> `SuiteCanvas` and the active shell contracts.

> **Autoridad:** LoopDev Engineering Board
> **Propósito:** Instrucciones detalladas para la replicación del sistema de chasis dual (AppShell + ModuleWorkspace).
> **Audiencia:** Desarrolladores e Inteligencia Artificial de implementación.

> **Nota normativa:** La fuente de verdad es `docs/02-frontend/SHELL_ARCHITECTURE.md`. Este blueprint
> es una guía de diseño y ejemplos; no obliga a crear un `layout.tsx` por cada módulo. El
> `ModuleWorkspace` puede compartirse desde el layout de suite cuando la composición sea común.

---

## 1. Visión General: Arquitectura de Chasis Dual

LoopDev OS utiliza una estructura de **espejo jerárquico**. No se diseñan páginas, se diseñan **entornos operativos**.

- **Nivel 1 (AppShell):** El chasis global de la aplicación (Suite). Maneja navegación entre módulos y estado global.
- **Nivel 2 (ModuleWorkspace):** El chasis operativo dentro de un módulo. Maneja la productividad profunda (Ontología, Lienzo, Consecuencia).

---

## 2. Nivel 1: El AppShell (Global Suite Chasis)

### 2.1 Estructura Física (Layout)
- **Header L1 (SuiteHeader):** H: 64px. Siempre visible.
- **Sidebar L1 (SuiteSidebar):** W: 280px. Navegación entre grandes áreas del sistema.
- **Context Panel:** Panel derecho opcional para notificaciones o perfil global.

### 2.2 Instrucciones de Implementación para IA:
1.  **Cimientos:** Usar un contenedor `flex h-screen w-full overflow-hidden`.
2.  **Semantic Canvas:** Fondo mapeado al token `bg-shell-canvas` (#0d121b en oscuro).
3.  **SuiteHeader (3-Capsule Design):**
    -   *Izquierda:* SuiteSwitcher (Logo + Switcher) + ContextPath (Breadcrumbs globales).
    -   *Centro:* CommandBarTrigger (Input estético para ⌘K).
    -   *Derecha:* Telemetría (SystemStatus) + UserMenu.
4.  **Sidebar Behavior:** Debe soportar modo "Full" y modo "Rail" (iconos solamente) mediante clases de Tailwind dinámicas.

---

## 3. Nivel 2: El ModuleWorkspace (Operational Chasis)

Este es el corazón del SaaS. Vive dentro del `AppShell.children`.

### 3.1 El Patrón de 4 Paneles (4-Pane OS)
1.  **Sidebar (Ontology):** Árbol de navegación del módulo.
2.  **Flyout (Meaning):** Panel que se abre al lado del sidebar para explicar o previsualizar.
3.  **Canvas (Definition):** El área de trabajo principal (Grid, Form, Graph).
4.  **Inspector (Consequence):** Panel derecho para metadatos, impacto y gobernanza.

### 3.2 Instrucciones de Implementación para IA:
1.  **ModuleHeader (Context Anchor):** Altura 56px. Muestra "En qué parte del módulo estoy".
2.  **ModuleToolbar (Intent Plane):** Altura 44px. Botones de acción (`Create`, `Save`, `Impact Analysis`).
3.  **Pane Logic (The Push System):** 
    -   En Desktop, los paneles deben "empujar" el canvas (resizable).
    -   En Tablet/Mobile, los paneles deben ser `Overlay` (usando Radix UI Dialog).
4.  **Z-Index Hierarchy:** 
    -   Header: 10
    -   Sidebars: 5
    -   Canvas: 0
    -   Inspector Overlays: 100+

---

## 4. El Sistema de Inspector (The Brain)

El Inspector no es una simple barra lateral de detalles; es el motor de **Gobernanza**.

### 4.1 Componentes del Inspector:
-   **Header:** Nombre de la entidad + Badge de Estado (`LOCKED`, `DRAFT`).
-   **Content (Standard Tabs):**
    -   `Context`: Metadatos técnicos (ID, Creado por, Versión).
    -   `Impact`: Qué otros módulos se verán afectados por un cambio.
    -   `Governance`: Quién debe aprobar este cambio.
-   **Footer (The Confirmation Zone):** Botones de alto impacto (Danger/Success) protegidos por estados de carga.

---

## 5. Tokens y Estética (Industrial Design Language)

Para replicar la calidad visual de LoopDev, la IA debe seguir estas reglas:

1.  **Technical Borders:** Usar bordes de 0.5px o 1px con opacidad baja (`border-white/5` o `border-black/5`).
2.  **Monospace Priority:** Todos los metadatos técnicos (IDs, Fechas, Latencia) deben usar fuentes mono-espaciadas.
3.  **Micro-interacciones:** 
    -   Hover en tarjetas: Elevar sutilmente el brillo.
    -   Estado activo: Usar `animate-pulse` suave en indicadores de latencia o conexión.
4.  **Container Queries:** Usar `@container` en lugar de media queries estándar para que los componentes se adapten al espacio del panel que los contiene.

---

## 6. Ejemplo de Composición (Código de Referencia)

```tsx
<AppShell headerSlot={<SuiteHeader ... />} navSlot={<SuiteSidebar ... />}>
  <ModuleWorkspace 
    moduleId="trading-ops"
    headerSlot={<ModuleHeader title="Bot_Fleet" />}
    toolbarSlot={<ModuleToolbar actions={[...]} />}
    sidebarSlot={<ModuleSidebar ... />}
    inspectorSlot={<UnifiedInspector ... />}
  >
    {/* El contenido real (Canvas) va aquí */}
    <BotGrid />
  </ModuleWorkspace>
</AppShell>
```

---

## 7. Flujo de Datos y Contexto (Los Nervios)

Para que los paneles sean reactivos, la IA debe implementar este flujo de comunicación:

1.  **State Hoisting:** El estado de los paneles (`isOpen`, `activeTab`) debe vivir en un `Context` que envuelva a todo el Shell.
2.  **Hooks Compuestos:** 
    -   `useAppShell()`: Controla Sidebars globales y Overlays.
    -   `useModuleWorkspace()`: Controla los 4 paneles internos y el modo inmersivo.
    -   `useInspector()`: El hook más importante. Permite abrir el panel derecho desde cualquier tarjeta o fila de tabla pasando el objeto de la entidad.
3.  **Command Execution:** Los botones de la `Toolbar` no ejecutan lógica directa; llaman al `Inspector` y le pasan el "Intento" (e.g., `openInspector(entity, 'impact')`).

## 8. Arquitectura de Archivos Next.js (El Mapa)

Cuando un módulo necesita una composición propia, puede seguir este esquema de anidamiento de
`layout.tsx`. Es una opción de composición, no un requisito para todas las suites:

```text
/app
  ├── (suite)
  │     ├── layout.tsx        <-- Aquí vive el AppShell (L1)
  │     ├── page.tsx          <-- Home de la suite (Dashboard global)
  │     └── [module]
  │           ├── layout.tsx  <-- Aquí vive el ModuleWorkspace (L2)
  │           └── page.tsx    <-- El Canvas del módulo
```

Si los módulos comparten el mismo chrome operativo, el layout de la suite puede montar directamente
un único `ModuleWorkspace` alrededor de sus páginas hijas.

## 9. Reglas de Oro para la IA de Implementación

1.  **Strict Props Policy:** Los componentes `Shell` no deben manejar lógica de negocio. Solo slots (`headerSlot`, `navSlot`, `children`).
2.  **Z-Index Management:** Usar variables CSS para los Z-index (`--app-shell-z-nav`, etc.) para evitar "guerras de capas" entre el chasis y los modales.
3.  **Skeleton States:** Todos los paneles deben soportar un estado de `Loading` (Skeleton) que respete la geometría del chasis para evitar saltos visuales (Layout Shift).

---
*Fin del Blueprint v1.6 - Documento Maestro de Arquitectura LoopDev*
