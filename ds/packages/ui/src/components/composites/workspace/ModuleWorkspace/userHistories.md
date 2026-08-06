# Historias de Usuario: ModuleWorkspace (Layout Phase 2)

**Componente:** ModuleWorkspace
**Versión:** 1.0 (Enterprise Ready)
**Taxonomía:** Composite

Este documento define el contrato de comportamiento y calidad para el `ModuleWorkspace`, el chasis interno de los módulos de LoopDev OS.

---

### 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)

*   **Trinidad Cromática:**
    *   **Azul (Estructura):** Bordes técnicos y estados activos de navegación.
    *   **Amarillo (Actividad):** Indicadores de cambios no guardados o foco en el canvas.
    *   **Morado (IA):** Asistente contextual en el Inspector.
*   **Sintaxis `{ }`:** El Header del módulo debe usar brackets para mostrar el estado técnico (ej. `{ DRAFT }`).
*   **Technical Canvas:** El fondo debe usar el token `bg-shell-canvas` para garantizar paridad con el Sidebar global.
*   **Surface Soul:** Las transiciones de colapso deben usar curvas de aceleración estándar (`duration-300`).

---

### 📚 Historias de Usuario

#### A. Historias Básicas (Core Functionality)

1.  **Renderizado Estructural (3-Pane):**
    *   **Como** usuario, **quiero** ver tres áreas claras (Sidebar, Canvas, Inspector), **para** poder navegar y editar propiedades sin perder el contexto.
    *   *Criterio:* El Canvas siempre es visible. Sidebar e Inspector se renderizan en sus slots correspondientes.

2.  **Jerarquía de Foco (Modos):**
    *   **Como** usuario experto, **quiero** cambiar entre modos Normal, Focus e Immersive, **para** ajustar la interfaz a mi nivel de concentración.
    *   *Criterio (Focus):* Sidebar e Inspector se colapsan.
    *   *Criterio (Immersive):* Todo el chrome desaparece (incluyendo AppShell).

3.  **Comportamiento Responsivo (Overlay):**
    *   **Como** usuario móvil, **quiero** que los paneles laterales sean overlays, **para** que no aplasten el contenido de trabajo.
    *   *Criterio:* En `<1024px`, los paneles usan `Dialog/Drawer` de Radix con backdrop.

#### B. Historias de Estrés (Robustez Técnica)

4.  **Contenido Extremo (Scroll Isolation):**
    *   **Como** desarrollador, **quiero** cargar listas infinitas en el Sidebar y el Canvas, **para** verificar que el scroll es independiente en cada zona.
    *   *Test:* Sidebar con 100 items, Canvas con 5000px de altura. El scroll del body nunca debe activarse.

5.  **Cambio Rápido de Estado (Flicker Test):**
    *   **Como** usuario, **quiero** abrir y cerrar paneles rápidamente, **para** verificar que las animaciones son fluidas y no hay saltos de layout.
    *   *Test:* Togglear `sidebarOpen` 10 veces en 2 segundos.

#### C. Multitenancy (Theming)

6.  **Adaptabilidad de Marca:**
    *   **Como** administrador de tenant, **quiero** que el workspace respete mis colores corporativos en los bordes activos y selección.
    *   *Criterio:* Uso estricto de variables CSS `--comp-*` derivadas de `--lpd-brand-*`.

---
*Gobernanza de Componentes - LoopDev*
