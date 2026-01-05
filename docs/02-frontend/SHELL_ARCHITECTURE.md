# 🏗️ Shell Architecture — LoopDev OS (v1.0)

> **Estado:** Activo / Autoridad Técnica
> **Tipo:** Estándar de Composición de Plataforma
> **Alcance:** Apps · Suites · Módulos Operativos
> **Objetivo:** Garantizar una experiencia de usuario inmutable y escalable mediante la estandarización de los contenedores y piezas de navegación.

---

## 0️⃣ Concepto: El Chasis Dual

LoopDev OS no se construye como una colección de páginas web, sino como un **Sistema Operativo Empresarial**. Para evitar la sobrecarga cognitiva, implementamos una arquitectura de **doble capa** (Mirror Architecture):

1.  **Suite Level (Global):** El entorno de la aplicación contratada (ej: Marketing Studio). Gestionado por el `AppShell`.
2.  **Module Level (Operativo):** El taller de trabajo específico (ej: Brand Hub). Gestionado por el `ModuleWorkspace`.

---

## 1️⃣ Los 6 Componentes Estándar

Para que cualquier suite (Marketing, CRM, Finanzas) sea idéntica en comportamiento, es obligatorio el uso de estos 6 componentes compuestos:

### A. Nivel Suite (Inyectados en `AppShell`)

| Componente | Slot | Objetivo |
| :--- | :--- | :--- |
| **`SuiteSidebar`** | `navSlot` | Navegación entre los grandes módulos de la suite. |
| **`SuiteHeader`** | `headerSlot` | Identidad de la suite, telemetría del sistema y perfil. |
| **`SuiteContextPanel`** | `contextSlot` | Información ambiental (Actividad global, créditos, equipo). |

### B. Nivel Módulo (Inyectados en `ModuleWorkspace`)

| Componente | Slot | Objetivo |
| :--- | :--- | :--- |
| **`ModuleSidebar`** | `sidebarSlot` | Navegación interna por las herramientas del módulo. |
| **`ModuleToolbar`** | `toolbarSlot` | Acciones inmediatas sobre el objeto activo (Save, Historial). |
| **`ModuleInspector`** | `inspectorSlot` | Control granular y edición de propiedades técnicas. |

---

## 2️⃣ Matriz de Responsabilidades de Slots

| Slot | Suite Level (AppShell) | Module Level (Workspace) |
| :--- | :--- | :--- |
| **Izquierda** | **Foco:** Cambio de Módulo. | **Foco:** Cambio de Herramienta. |
| **Superior** | **Foco:** "¿Dónde estoy y quién soy?". | **Foco:** "¿Qué puedo hacer ahora?". |
| **Derecha** | **Foco:** "¿Qué está pasando?". | **Foco:** "¿Cómo es este objeto?". |
| **Centro** | Renderiza el `ModuleWorkspace`. | Renderiza el `Lienzo de Trabajo`. |

---

## 3️⃣ Guía de Implementación: "Patrón de Suite"

Para crear una nueva suite (ej: `CRM`), el equipo de ingeniería debe seguir estos pasos:

### 1. Definir la Configuración de Suite
Crear un objeto de datos que contenga los módulos, iconos y rutas. Este objeto alimentará al `SuiteSidebar`.

### 2. Implementar el Suite Layout
En el `layout.tsx` de la suite, invocar el `AppShell` inyectando los componentes `SuiteSidebar` y `SuiteHeader`.

```tsx
// Ejemplo estándar
<AppShell
  navSlot={<SuiteSidebar config={CRM_CONFIG} />}
  headerSlot={<SuiteHeader title="Sales & CRM" />}
>
  {children}
</AppShell>
```

### 3. Implementar el Module Layout (opcional)
Si la página es un módulo operativo, inyectar el `ModuleWorkspace` dentro del `AppShell`.

---

## 4️⃣ Reglas No Negociables

1.  **Prioridad de Paneles:** El `ModuleInspector` siempre tiene prioridad visual sobre el `SuiteContextPanel`. Nunca deben estar abiertos ambos simultáneamente.
2.  **Identidad:** El `SuiteHeader` debe mostrar siempre el `SystemStatus` oficial.
3.  **Navegación:** Todo `SuiteSidebar` debe incluir obligatoriamente el botón "Back to OS" (retorno al Launchpad).
4.  **Zero Hardcoding:** Estos componentes deben consumir exclusivamente tokens del Design System para asegurar la paridad entre suites.

---
*Arquitectura de Shell - LoopDev Engineering Board*
