# Guía de Implementación: Ecosistema SaaS LoopDev

Este documento define los estándares técnicos, la arquitectura y los pasos para escalar el ecosistema LoopDev, utilizando **MarketingStudio** como base funcional y transformándolo en un producto SaaS multitenant y agnóstico.

---

## 🚩 Estado Actual del Proyecto

| Fase | Descripción | Estado |
| :--- | :--- | :--- |
| **Fase 1** | Cimentación y Design System (Foundations) | ✅ Completado |
| **Fase 2** | Arquitectura de Multitenencia (TenantProvider) | ✅ Completado |
| **Fase 2.5** | Layout Foundations & App Shell | ✅ Completado |
| **Fase 2.6** | SaaS Core Foundations (Atómica) | 🚧 En Desarrollo |

---

## 1. Organización del Design System (Atomic Design)

Para garantizar la escalabilidad al 100%, todos los componentes deben clasificarse en uno de estos niveles:

| Categoría | Qué contiene | Ejemplos Actuales |
| :--- | :--- | :--- |
| **`atoms/`** | Elementos básicos e indivisibles. | `Button`, `Input` (base), `Label`. |
| **`molecules/`** | Combinación de átomos para una función simple. | `Tooltip`, `Popover`, `Divider`. |
| **`organisms/`** | Secciones complejas y funcionales de la UI. | `TopBar`, `LeftSidebar`, `Dialog`, `Footers`. |
| **`layout/`** | **Foundations** (Primitivos de espacio). | `Stack`, `Grid`, `Box`, `Container`, `Center`. |
| **`templates/`** | Orquestación de la página. | `AppShell`, `BrandIdentityView`. |

---

## 2. Estándares de Composición

### 2.1. Primitivos de Composición
- **`Stack` / `Inline` / `Grid`**: Gestionan toda la distribución espacial.
- **`Box`**: El átomo para paddings y fondos controlados.
- **`Center` / `TwoPaneLayout`**: Patrones comunes de alineación y datos.

### 2.2. Patrones de Navegación SaaS
- **`AppShell`**: Orquestador de 3 columnas (Left | Main | Right) compatible con mobile Safe Areas.
- **`Contextual Headers`**: Nivel 1 (Identidad Global) y Nivel 2 (Navegación de Página).

---

## 3. Principios de Ingeniería

### 3.1. Clean Imports
Utilizar siempre el alias `@/` para imports internos. Los componentes de alto nivel (`organisms`) deben importar sus primitivos desde `@/components/layout`.

### 3.2. SaaS Logic
Cada Tenant define su estilo visual (`base` vs `brand`) y comportamiento inicial (ej. sidebar colapsado) en el `TENANT_DATA`. El sistema reacciona automáticamente.

---

## 4. Componentes Listos para Usar
- **Atoms**: `Button`.
- **Molecules**: `Tooltip`, `Popover`.
- **Organisms**: `Dialog`, `AlertDialog`, `Drawer`, `Toaster`, `Headers`, `Sidebars`, `Footers`.
- **Templates**: `AppShell`, `BrandIdentityView`.
