# Especificación: ModuleWorkspace (Layout Phase 2)

## 1. Propósito
El `ModuleWorkspace` es el **chasis interno** para la ejecución de un módulo específico dentro de LoopDev OS (ej. Brand Hub). Mientras el `AppShell` gobierna el contexto global de la suite, el `ModuleWorkspace` orquesta el área operativa. Gestiona el layout interno, la jerarquía de foco (Normal/Focus/Immersive) y coordina el estado con el `LayoutContext` global para asegurar una experiencia industrial y escalable.

## 2. Arquitectura

### Patrón
-   **Composite Component**
-   **Separación Estricta Brain/Body**:
    -   Lógica: `useModuleWorkspace`
    -   Render: `ModuleWorkspace`

### Ubicación
`ds/packages/ui/src/components/composites/ModuleWorkspace/`

### Dependencias
-   `useLayoutContext` (Integración con AppShell)
-   Radix UI (Dialog/Drawer para overlays móviles)

## 3. Zonas del Layout (Slots Oficiales)

### 3.1 Nivel Suite (Contexto Externo)
Gobernado por `AppShell`, pero el `ModuleWorkspace` puede solicitar cambios de estado vía `LayoutContext`.
-   **SuiteHeader** (Superior Global)
-   **SuiteSidebar** (Izquierda Global)
-   **ContextSidebar** (Derecha Global)

### 3.2 Nivel Módulo (Gestionado por ModuleWorkspace)

#### A. ModuleHeader (`headerSlot`)
-   **Rol:** Orientación y contexto.
-   **Contenido:** Nombre del módulo, breadcrumbs internos, estado del dominio (Draft/Live), toggle del ModuleSidebar.
-   **Reglas:** Vive debajo del `SuiteHeader`. Visible en modos `normal` y `focus`. No contiene acciones operativas del contenido.

#### B. Toolbar (`toolbarSlot`)
-   **Rol:** Control operativo del Canvas.
-   **Contenido:** Filtros de contenido, toggles de vista (list/grid), acciones en masa, toggles de Inspector.
-   **Reglas:** Opcional. **No debe renderizarse si no aporta valor operativo directo al Canvas.** No hace scroll.

#### C. ModuleSidebar (`sidebarSlot`)
-   **Rol:** Navegación interna del módulo.
-   **Comportamiento:** Layout Push (desktop), Drawer Overlay (<1024px), Colapsable.

#### D. Canvas (`children`)
-   **Rol:** Núcleo operativo.
-   **Comportamiento:** Siempre existe. Único dueño del scroll principal. Totalmente funcional sin paneles laterales.

#### E. Inspector (`inspectorSlot`)
-   **Rol:** Propiedades, contexto profundo, asistencia de IA.
-   **Comportamiento:** Colapsado por defecto. Push (desktop) / Drawer Overlay (mobile). No bloquea el canvas.

## 4. Modos de Interacción (Jerarquía de Foco)

### 4.1 Normal (Default)
-   **Visible:** SuiteHeader, ModuleHeader, ModuleSidebar, Canvas.
-   **Colapsado:** SuiteSidebar (**Solicitado vía LayoutContext al entrar al módulo**), ContextSidebar, Inspector.
-   **Layout:** Vista operativa estándar de 3 paneles (o 2 paneles).

### 4.2 Focus
-   **Objetivo:** Maximizar el Canvas sin perder orientación.
-   **Visible:** SuiteHeader, ModuleHeader, Canvas.
-   **Colapsado/Oculto:** ModuleSidebar, Inspector, SuiteSidebar, ContextSidebar.

### 4.3 Immersive / Zen
-   **Objetivo:** Foco absoluto en el contenido.
-   **Visible:** Canvas.
-   **Oculto:** TODO el chrome (SuiteHeader, SuiteSidebar, ModuleHeader, ModuleSidebar, Inspector).
-   **Mecanismo:** `ModuleWorkspace` debe notificar al `LayoutContext` para ocultar el chrome global.

## 5. Comportamiento Responsive
-   **Breakpoint:** `<1024px`
-   **Comportamiento:** ModuleSidebar e Inspector se renderizan como **Drawers/Dialogs** (Radix UI) con backdrop obligatorio y focus trap. El scroll del body se bloquea.
-   **Regla de Precedencia:** En móviles (<1024px), el comportamiento responsive tiene prioridad sobre el comportamiento "push", pero respeta las reglas de visibilidad del modo activo.

## 6. Styling & Tokens
-   **Dimensiones:**
    -   Ancho Sidebar: `--lpd-workspace-sidebar-w`
    -   Ancho Inspector: `--lpd-workspace-inspector-w`
-   **Colores:**
    -   Fondo: `bg-shell-canvas` (Token Semántico)
    -   Bordes: `border-border-technical` (0.5px)
-   **Z-Index (Jerarquía Correcta):**
    `Canvas < Workspace Overlays < Global Toasts`

## 7. Interfaz de Props
```typescript
interface ModuleWorkspaceProps {
  moduleId: string;

  // Slots
  headerSlot?: React.ReactNode;
  sidebarSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  inspectorSlot?: React.ReactNode;
  children: React.ReactNode;

  // State (Controlado o No Controlado)
  // Nota: Si no se proveen, el componente gestiona su propio estado interno con los defaults documentados.
  sidebarOpen?: boolean;
  inspectorOpen?: boolean;
  onSidebarChange?: (open: boolean) => void;
  onInspectorChange?: (open: boolean) => void;

  // Configuration
  mode?: 'normal' | 'focus' | 'immersive';
}
```

## 8. Criterios de Aceptación
- [ ] El Canvas siempre se renderiza y es dueño del scroll principal.
- [ ] Sidebar e Inspector colapsan con transiciones CSS suaves (usando tokens del sistema).
- [ ] `mode="immersive"` coordina correctamente el ocultamiento del AppShell + paneles del ModuleWorkspace.
- [ ] El comportamiento móvil (<1024px) implementa correctamente overlays con focus trap.
- [ ] Pasa todos los chequeos de Accesibilidad (Axe) y Vitest.
- [ ] El Toolbar no ocupa espacio si no tiene contenido.
