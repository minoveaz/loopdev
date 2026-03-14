# SuiteHeader (Chasis de Comando y Contexto)

Este documento detalla el inventario de componentes necesarios para ensamblar el `SuiteHeader` oficial de LoopDev OS, siguiendo las directivas del contrato de historias de usuario v1.1.

---

## 1. Componentes Nuevos a Crear

Estos componentes serán promovidos al Design System como parte del hito de construcción del `SuiteHeader`.

| Componente | Tipo | Responsabilidad |
| :--- | :--- | :--- |
| **`SuiteHeader`** | Composite | El chasis principal de 56px con 3 slots. |
| **`SuiteSwitcher`** | Composite | Selector de suites (Marketing, CRM, etc.). |
| **`ContextPath`** | Composite | Breadcrumb técnico de ubicación. |
| **`CommandBarTrigger`** | Átomo | Disparador de la paleta de comandos (`⌘K`). |
| **`UserMenu`** | Composite | Menú de perfil y sesión. |

---

## 2. Componentes Existentes a Utilizar

Estos componentes ya están certificados y serán consumidos por el `SuiteHeader` y sus hijos.

| Componente | Tipo | Propósito en el Header |
| :--- | :--- | :--- |
| `SystemStatus` | Átomo | Indicador de conectividad y estado del sistema. |
| `ThemeToggle` | Átomo | Selector de tema claro/oscuro. |
| `IconButton` | Átomo | Botones de acción genéricos (Crear, Notificaciones). |
| `UserAvatar` | Átomo | Identidad visual dentro del `UserMenu`. |
| `TechnicalTooltip` | Átomo | Información técnica para todos los iconos. |
| `BrandLogo` | Átomo | Identidad de marca dentro del `SuiteSwitcher`. |

---

## 3. Estrategia de Implementación

El desarrollo se realizará de forma incremental, siguiendo el plan de 10 pasos para cada nuevo componente, empezando por el **`CommandBarTrigger`** para definir el corazón funcional del header.
