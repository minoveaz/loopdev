---
id: module-workspace
title: ModuleWorkspace Implementation
status: closed
created: 2026-01-07
updated: 2026-08-12
owner: platform
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/module-workspace_20260107
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# ModuleWorkspace Implementation

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

# Plan: ModuleWorkspace Implementation

## Phase 1: Ideation & Contract (DoR)
- [ ] Task: Create component directory `ds/packages/ui/src/components/composites/ModuleWorkspace/`.
- [ ] Task: Create `userHistories.md` defining the stories (Basic, Stress, Multitenancy) and validating "Block 0" (Chromatic Trinity, Syntax, Canvas, Surface).
- [ ] Task: Register session start in `ENGINEERING_LOG.md`.
- [ ] Task: Create `types.ts` defining the contract (Props, Slots, Modes).
- [ ] Task: Conductor - User Manual Verification 'Definition of Readiness' (Protocol in workflow.md)

## Phase 2: Development & Hardening
- [ ] Task: Implement the "Brain" (`useModuleWorkspace.ts`) handling layout logic, focus modes, and responsiveness.
- [ ] Task: Implement the "Body" (`index.tsx`) rendering the 3-pane layout and integrating with `useLayoutContext`.
- [ ] Task: Implement `components.tsx` for internal sub-components (if needed) and style integration.
- [ ] Task: Create `fixtures.ts` with high-fidelity data for tests and stories.
- [ ] Task: Write `ModuleWorkspace.test.tsx` using Vitest to validate every story in `userHistories.md`.
- [ ] Task: Create `ModuleWorkspace.stories.tsx` including "Stress" stories (Extreme content, Narrow widths).
- [ ] Task: Conductor - User Manual Verification 'Development & Hardening' (Protocol in workflow.md)

## Phase 3: External Audit
- [ ] Task: Execute `AUDIT_UI_PROMPT` logic to verify code against `userHistories.md` and "Block 0" compliance.
- [ ] Task: Verify Accessibility (Axe-core) and Responsive behavior.
- [ ] Task: Conductor - User Manual Verification 'Audit Passed' (Protocol in workflow.md)

## Phase 4: Persistence & Certification (DoD)
- [ ] Task: Apply `CertificationStamp` to the Storybook stories.
- [ ] Task: Register the component in `COMPONENT_REGISTRY.json`.
- [ ] Task: Export the component in `ds/packages/ui/src/components/composites/index.ts`.
- [ ] Task: Update `ENGINEERING_LOG.md` with the milestone completion.
- [ ] Task: Conductor - User Manual Verification 'Definition of Done' (Protocol in workflow.md)

---

### spec.md

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


---

### metadata.json

```json
{
  "track_id": "module-workspace_20260107",
  "type": "feature",
  "status": "new",
  "created_at": "2026-01-07T14:30:00Z",
  "updated_at": "2026-01-07T14:30:00Z",
  "description": "Implement ModuleWorkspace (Layout Phase 2) for internal module layouts."
}
```
