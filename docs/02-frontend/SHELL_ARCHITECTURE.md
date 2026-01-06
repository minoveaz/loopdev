# 🏗️ Shell Architecture — LoopDev OS (v1.1)

> **Estado:** Activo / Autoridad Técnica v1.1
> **Tipo:** Estándar de Composición de Plataforma
> **Alcance:** Apps · Suites · Módulos Operativos
> **Objetivo:** Garantizar una experiencia de usuario inmutable y escalable mediante la estandarización de los contenedores y piezas de navegación.

---

## 0️⃣ Concepto: El Chasis Dual

LoopDev OS no se construye como una colección de páginas web, sino como un **Sistema Operativo Empresarial**. Para evitar la sobrecarga cognitiva, implementamos una arquitectura de **doble capa** (Mirror Architecture):

1.  **Suite Level (Global):** El entorno de la aplicación contratada (ej: Marketing Studio). Gestionado por el `AppShell`.
2.  **Module Level (Operativo):** El taller de trabajo específico (ej: Brand Hub). Gestionado por el `ModuleWorkspace`.

---

## 1️⃣ Los 6 Componentes Estándar del Chasis

Para que cualquier suite sea idéntica en comportamiento, es obligatorio el uso de estos 6 componentes compuestos y de layout:

### A. Nivel Suite (Inyectados en `AppShell`)

| Componente | Slot | Objetivo |
| :--- | :--- | :--- |
| **`SuiteSidebar`** | `navSlot` | Navegación entre los grandes módulos de la suite. |
| **`SuiteHeader`** | `headerSlot` | Identidad de la suite, telemetría del sistema y perfil. |
| **`SuiteContextPanel`** | `contextSlot` | Información ambiental y telemetría de la suite. |

### B. Nivel Módulo (Inyectados en `ModuleWorkspace`)

| Componente | Slot | Objetivo |
| :--- | :--- | :--- |
| **`ModuleSidebar`** | `sidebarSlot` | Navegación interna por las herramientas del módulo. |
| **`ModuleToolbar`** | `toolbarSlot` | Acciones inmediatas sobre el objeto activo. |
| **`ModuleInspector`** | `inspectorSlot` | Control granular y edición de propiedades técnicas. |

---

## 2️⃣ The Sidebar Blueprint (Implementación de Referencia)

Este es el JSX oficial que debe usarse en el `layout.tsx` de cualquier suite para garantizar la consistencia.

```tsx
// En el layout.tsx de la suite
import { AppShell, SuiteSidebar, SuiteHeader, YOUR_SUITE_SCHEMA } from '@loopdev/ui';

export default function SuiteLayout({ children }) {
  // 1. Hooks de estado y navegación
  const [navMode, setNavMode] = useState('expanded');
  const activeModule = useActiveModule(); // Hook de lógica de negocio

  // 2. Renderizado del Chasis
  return (
    <AppShell
      config={{ isLeftSidebarOpen: navMode === 'expanded' }}
      onToggleLeftSidebar={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
      
      navSlot={
        <SuiteSidebar
          schema={YOUR_SUITE_SCHEMA}
          navMode={navMode}
          activeModuleId={activeModule.id}
          accessMap={usePermissions()}
          onNavigate={(route) => router.push(route)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
        />
      }
      
      headerSlot={<SuiteHeader suiteName={YOUR_SUITE_SCHEMA.suite.suiteName} />}
    >
      {children}
    </AppShell>
  );
}
```

---

## 3️⃣ Reglas No Negociables del Shell

1.  **Prioridad de Paneles:** El `ModuleInspector` siempre tiene prioridad visual sobre el `SuiteContextPanel`.
2.  **Identidad Consistente:** `SuiteHeader` y `SuiteSidebar` deben consumir la misma `SuiteIdentity` del schema.
3.  **Navegación Desacoplada:** Toda la estructura de navegación debe vivir en un `schema.ts` y no estar hardcodeada.

---
*Arquitectura de Shell - LoopDev Engineering Board*