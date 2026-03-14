# Especificación: Module Essentials Kit (v0.1)

## 1. Propósito
Este kit estandariza los componentes "mueble" que se insertan en los slots del `ModuleWorkspace`. El objetivo es garantizar una experiencia de usuario industrial, consistente y de alta densidad en todos los módulos de la plataforma.

## 2. Reglas Globales (ADN LoopDev)
- **Zero Hardcoding:** Uso obligatorio de tokens `--lpd-workspace-*`, `bg-shell-canvas` y `border-border-technical` (0.5px).
- **Jerarquía de Scroll:** El Canvas es el dueño del scroll principal. Sidebar e Inspector tienen scroll interno vía `ScrollArea`. Header y Toolbar son estáticos.
- **Tipografía:** Títulos en `Inter Bold` (700). Metadatos en `JetBrains Mono`.
- **A11y:** `aria-label` obligatorio para acciones icon-only. Orden de tabulación lógico.

## 3. Componentes

### 3.1 ModuleHeader (`headerSlot`)
- **Función:** Orientación y contexto jerárquico.
- **Visual:** Altura fija (token), fondo con `backdrop-blur-md`, borde inferior de 0.5px.
- **Zonas:**
    - **Left:** Botón Back (opcional) + Título + Breadcrumbs jerárquicos.
    - **Center:** Tabs o controles de vista de alto nivel (opcional).
    - **Right:** Pill de estado (`{ DRAFT }`) + Acciones de orientación.

### 3.2 ModuleToolbar (`toolbarSlot`)
- **Función:** Control operativo del Canvas.
- **Comportamiento:** Situacional (no se renderiza si está vacío). No scrollea.
- **Zonas:**
    - **Left:** Búsqueda local y filtros primarios.
    - **Center:** Toggles de vista (List/Grid/Kanban).
    - **Right:** Acciones en masa (Bulk) y toggles de paneles laterales.

### 3.3 ModuleSidebar (`sidebarSlot`)
- **Función:** Contenedor de navegación interna.
- **Visual:** Fondo sólido `bg-shell-canvas`, sin bordes externos (los gestiona el chasis).
- **Contenido:** Búsqueda local, árbol de navegación (NavGroups) y links secundarios.

### 3.4 InspectorPanel (`inspectorSlot`)
- **Función:** Contexto profundo y propiedades.
- **Visual:** Cabecera estándar con título y botón de cierre único.
- **Contenido:** Secciones de metadatos, auditoría y asistentes de IA.

## 4. Requerimientos Técnicos
- **Patrón:** Composite Components en `ds/packages/ui`.
- **Arquitectura:** Separación estricta Brain/Body.
- **Responsive:** Soporte nativo para modo Overlay (Mobile < 1024px).

## 5. Criterios de Aceptación
- [ ] Los 4 componentes respetan las alturas y anchos definidos por tokens de CSS.
- [ ] El `ModuleHeader` muestra breadcrumbs con truncamiento inteligente.
- [ ] El `ModuleToolbar` desaparece visualmente si no tiene slots hijos.
- [ ] El `InspectorPanel` gestiona su propio cierre mediante un botón certificado.
- [ ] 100% de cumplimiento con el "Bloque 0" (ADN visual v3.9).
