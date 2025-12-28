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

| Categoría | Qué contiene | Ejemplos Actuales |
| :--- | :--- | :--- |
| **`atoms/`** | Elementos básicos e indivisibles. | `Button`, `Input`, **`Illustrations`** (37 items). |
| **`molecules/`** | Combinación de átomos para una función simple. | `Field`, `Tooltip`, `Popover`. |
| **`organisms/`** | Secciones complejas y funcionales de la UI. | `TopBar`, `LeftSidebar`, `Dialog`, `Footers`. |
| **`layout/`** | **Foundations** (Primitivos de espacio). | `Stack`, `Grid`, `Box`, `Container`, `Center`. |
| **`templates/`** | Orquestación de la página. | `AppShell`, `BrandIdentityView`. |

---

## 2. Estándares Visuales (Ilustraciones)

Las ilustraciones se tratan como **Átomos Dinámicos**.
- **Base común:** Heredan de `IllustrationBase` para control de `stroke` y `viewBox`.
- **Theming:** No usan colores fijos; consumen `--lpd-color-brand-primary` y `secondary`.
- **Categorización:** Organizadas en carpetas por dominio (tech, home, travel, etc.).

---

## 3. Principios de Ingeniería

### 3.1. Clean Imports
Utilizar siempre el alias `@/` para imports internos. Los componentes de alto nivel (`organisms`) deben importar sus primitivos desde `@/components/layout`.

### 3.2. SaaS Logic
Cada Tenant define su estilo visual (`base` vs `brand`) en el `TENANT_DATA`. El sistema reacciona automáticamente.

---

## 4. Componentes Listos para Usar
- **Atoms**: `Button`, `Input`, `Label`, `TextArea`, `Switch`, **Full Illustration Set**.
- **Molecules**: `Field`, `Tooltip`, `Popover`.
- **Organisms**: `Dialog`, `AlertDialog`, `Drawer`, `Toaster`, `Headers`, `Sidebars`, `Footers`.
- **Templates**: `AppShell`, `BrandIdentityView`.
