# 🏗️ Module Workspace Architecture — LoopDev OS (v1.0)

> **Estado:** Activo / Autoridad Técnica v1.0
> **Tipo:** Estándar de Composición de Módulo
> **Alcance:** Todos los Módulos Operativos (Brand Hub, CRM, DAM...)
> **Objetivo:** Definir el chasis de trabajo de 4 paneles que garantiza la operatividad profunda.

> **Relación con el shell:** `SHELL_ARCHITECTURE.md` es el contrato normativo de niveles y routing.
> Este documento define únicamente el primitive `ModuleWorkspace` y sus slots. El workspace puede
> vivir en un layout hijo de módulo o compartirse desde el layout de suite cuando la composición
> operativa sea común.

> **Compatibilidad:** `ModuleWorkspace` es el primitive implementado actualmente para el
> contrato objetivo `SuiteCanvas`. No se deben crear nuevos wrappers ni presentar este
> nombre como una segunda arquitectura de shell; cualquier migración de API debe mantener
> los mismos slots, navegación y pruebas de interacción.

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

### Contrato de las dos filas

El workspace operativo se compone de dos filas superiores con responsabilidades
separadas. No deben mezclarse navegación y operaciones de contenido.

| Fila | Primitive | Pregunta que responde | Contenido permitido |
| :--- | :--- | :--- | :--- |
| 1 | `ModuleHeader` | "¿Dónde estoy?" | Toggle del sidebar, breadcrumbs, contexto de entidad y apertura del inspector |
| 2 | `ModuleToolbar` | "¿Qué puedo hacer?" | Búsqueda, filtros, tabs, vistas, selección y acciones de la vista activa |

Reglas:

- `ModuleHeader` no contiene filtros, búsqueda, tabs, vistas ni acciones CRUD de una colección.
- `ModuleToolbar` no duplica breadcrumbs, títulos de navegación ni el contexto global de la suite.
- Una acción primaria como `Create Brand` o `New Lead` pertenece a la toolbar de la vista que la ejecuta.
- Un estado solo aparece en `ModuleHeader` si representa contexto real de la entidad o del workflow (`DRAFT`, `PUBLISHED`, `READ ONLY`); no se usan indicadores genéricos como `SYSTEM ACTIVE`.
- Las acciones del header deben tener comportamiento real. Acciones futuras o sin callback no se renderizan.

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
  └── [ ModuleWorkspace (Operational Context, compartido o específico) ]
        ├── Sidebar
        ├── Canvas
        └── Inspector

      ### Cuándo compartir o separar el workspace

      Usa un único `ModuleWorkspace` en el layout de suite cuando los módulos comparten header,
      navegación interna, toolbar, overlays e inspector. Crea un layout de módulo separado únicamente
      cuando esas piezas o su estado deban ser diferentes. En ambos casos se usa el mismo primitive;
      no se permite duplicar su geometría en un wrapper propio.
```

---
*Arquitectura de Workspace - LoopDev Engineering Board*
