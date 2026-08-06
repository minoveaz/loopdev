# 🏗️ Shell Architecture — LoopDev OS (v1.2)

> **Estado:** Activo / Autoridad Técnica v1.2
> **Tipo:** Estándar de Composición de Plataforma
> **Alcance:** Apps · Suites · Módulos Operativos
> **Objetivo:** Garantizar una experiencia de usuario inmutable y escalable mediante la estandarización de los contenedores y piezas de navegación.

---

## 0️⃣ Concepto: El Chasis Dual

LoopDev OS no se construye como una colección de páginas web, sino como un **Sistema Operativo Empresarial**. Para evitar la sobrecarga cognitiva, implementamos una arquitectura de **doble capa** (Mirror Architecture):

1.  **Suite Level (Global):** El entorno de la aplicación contratada (ej: Marketing Studio). Gestionado por el `AppShell`.
2.  **Module Level (Operativo):** El taller de trabajo específico (ej: Brand Hub). Gestionado por el `ModuleWorkspace`.

---

## 1️⃣ El Chasis del Header (3 Cápsulas de Control)

El `SuiteHeader` es el dispositivo de comando principal. No es una barra de navegación genérica; se organiza en 3 cápsulas de responsabilidad única:

1.  **Cápsula Izquierda (Orientación):** Contiene el `SuiteSwitcher` (identidad de app) y el `ContextPath` (ubicación jerárquica).
2.  **Cápsula Central (Comando):** Reservada para el `CommandBarTrigger` (⌘K). Es el motor de productividad del OS.
3.  **Cápsula Derecha (Estado):** Agrupa telemetría de sistema (`SystemStatus`), centro de notificaciones, acciones de creación (`+`) y menú de usuario.

### 🛡️ Seguridad Cognitiva (Overlay Safety)
Cuando un componente de overlay (como el buscador global o un modal) está activo, el `SuiteHeader` debe:
- Volverse inerte (`pointer-events-none`).
- Deshabilitar efectos de hover.
- Opcional: reducir sutilmente el brillo de sus elementos internos.

---

## 2️⃣ Cimientos de Color (Semantic Canvas)

Para garantizar la coherencia entre el Header y el Sidebar, el shell utiliza una **Estrategia Semántica**:
- **Token:** `bg-shell-canvas` (mapeado a `--lpd-shell-canvas`).
- **Comportamiento:** Cambia automáticamente de blanco puro a negro profundo (#0d121b) sin necesidad de prefijos `dark:`.
- **Bordes:** Uso obligatorio de `border-border-technical` (0.5px) para delimitar el chasis con precisión microscópica.

---

## 3️⃣ The Sidebar Blueprint (Implementación de Referencia)

Este es el JSX oficial que debe usarse en el `layout.tsx` de cualquier suite para garantizar la consistencia.

```tsx
// En el layout.tsx de la suite
import { 
  AppShell, 
  SuiteSidebar, 
  SuiteHeader, 
  SuiteSwitcher, 
  ContextPath,
  YOUR_SUITE_SCHEMA 
} from '@loopdev/ui';

export default function SuiteLayout({ children }) {
  return (
    <AppShell
      headerSlot={
        <SuiteHeader 
          leftSlot={<><SuiteSwitcher ... /><ContextPath ... /></>}
          centerSlot={<CommandBarTrigger ... />}
          rightSlot={<UserMenu ... />}
        />
      }
      navSlot={<SuiteSidebar schema={YOUR_SUITE_SCHEMA} />}
    >
      {children}
    </AppShell>
  );
}
```

---

## 4️⃣ Reglas No Negociables del Shell

1.  **Prioridad de Paneles:** El `ModuleInspector` siempre tiene prioridad visual sobre el `SuiteContextPanel`.
2.  **Identidad Consistente:** `SuiteHeader` y `SuiteSidebar` deben consumir la misma `SuiteIdentity` del schema y el mismo fondo sólido.
3.  **Navegación Desacoplada:** Toda la estructura de navegación debe vivir en un `schema.ts` y no estar hardcodeada.
4.  **Skip-Link de Accesibilidad:** El primer elemento del DOM en el `AppShell` debe ser el link oculto "Skip to content" apuntando al ID `#main-content`.

---
*Arquitectura de Shell - LoopDev Engineering Board*