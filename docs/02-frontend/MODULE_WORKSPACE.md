# 🏗️ Module Workspace Architecture — LoopDev OS (v1.0)

> **Estado:** Activo / Autoridad Técnica v1.0
> **Tipo:** Estándar de Composición de Módulo
> **Alcance:** Todos los Módulos Operativos (Brand Hub, CRM, DAM...)
> **Objetivo:** Definir el chasis de trabajo de 4 paneles que garantiza la operatividad profunda.

---

## 0️⃣ Concepto: The 4-Pane Operating System

A diferencia de una página web plana, un Módulo LoopDev es una estación de trabajo multidimensional. Se compone de 4 paneles orquestados por el layout `ModuleWorkspace`:

1.  **Ontology (Sidebar):** Navegación estructural y árbol de entidades.
2.  **Meaning (Flyout):** Capa explicativa y de aprendizaje ("Qué es esto").
3.  **Definition (Canvas):** El área de trabajo principal (Grid, Form, Graph).
4.  **Consequence (Inspector):** El cerebro de impacto, gobernanza y validación.

---

## 1️⃣ Layout Físico & Slots

El `ModuleWorkspace` gestiona la geometría de la pantalla mediante slots estrictos:

```tsx
<ModuleWorkspace
  headerSlot={<ModuleHeader ... />}   // H: 56px Fixed
  toolbarSlot={<ModuleToolbar ... />} // H: 44px Fixed
  sidebarSlot={<ModuleSidebar ... />} // W: 280px Resizable
  flyoutSlot={<SidebarFlyout ... />}  // W: 320px Collapsible
  inspectorSlot={<UnifiedInspector ... />} // W: 420px Docked/Overlay
>
  {/* Canvas Content */}
  {children}
</ModuleWorkspace>
```

### Reglas de Geometría
- **Header + Toolbar:** Ocupan siempre los primeros 100px verticales.
- **Sidebar:** Colapsable a modo "Rail" para foco.
- **Inspector:** Modo "Docked" (empuja el canvas) en pantallas grandes, "Overlay" en pequeñas.

---

## 2️⃣ La Máquina de Estados de Paneles

El workspace no es estático; reacciona a la intención del usuario:

| Estado | Sidebar | Flyout | Inspector | Canvas |
| :--- | :--- | :--- | :--- | :--- |
| **Default** | Open | Closed | Closed | Full Width |
| **Navigating** | Open | Open | Closed | Compressed |
| **Focus** | Rail | Closed | Closed | Max Width |
| **Inspecting** | Open | Closed | Open | Compressed |

---

## 3️⃣ Componentes del Sistema

### 3.1 ModuleHeader
Ancla de contexto. Muestra breadcrumbs (`Suite / Module / Entity`) y estatus global (`LIVE`, `DRAFT`).
*   **Altura:** 56px.
*   **Responsabilidad:** "Dónde estoy".

### 3.2 ModuleToolbar
Plano de intención. Muestra acciones contextuales (`Create`, `Save`, `Impact`).
*   **Altura:** 44px.
*   **Responsabilidad:** "Qué quiero hacer".
*   **Regla de Oro:** Solo propone acciones; la confirmación vive en el Inspector.

### 3.3 ModuleSidebar
Espina dorsal de navegación. Soporta dos modos:
*   **Directory Mode:** Lista plana de entidades con búsqueda.
*   **Brand Mode:** Árbol semántico de una entidad específica.

### 3.4 SidebarFlyout
Panel de significado "Learn & Navigate". Explica la sección antes de entrar en ella. Ideal para onboarding progresivo.

---

## 4️⃣ Integración con AppShell

El `ModuleWorkspace` vive **dentro** del slot `children` del `AppShell` global. Esto crea la arquitectura de doble marco:

```
[ AppShell (Suite Context) ]
  └── [ ModuleWorkspace (Operational Context) ]
        ├── Sidebar
        ├── Canvas
        └── Inspector
```

---
*Arquitectura de Workspace - LoopDev Engineering Board*
