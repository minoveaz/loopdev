# Guía de Implementación: Ecosistema SaaS LoopDev

Este documento define los estándares técnicos, la arquitectura y los pasos para escalar el ecosistema LoopDev, utilizando **MarketingStudio** como base funcional y transformándolo en un producto SaaS multitenant y agnóstico.

---

## 🚩 Estado Actual del Proyecto

| Fase | Descripción | Estado |
| :--- | :--- | :--- |
| **Fase 1** | Cimentación y Design System (Foundations) | ✅ Completado |
| **Fase 2** | Arquitectura de Multitenencia (TenantProvider) | ✅ Completado |
| **Fase 2.5** | Layout Foundations & App Shell | ✅ Completado |
| **Fase 2.6** | SaaS Core Foundations (Atómica) | ✅ Completado |
| **Fase 2.8** | Premium Snippets & Portal | 🚧 En Desarrollo |

---

## 1. Organización del Design System (Atomic Design)

| Categoría | Qué contiene | Ejemplos Actuales |
| :--- | :--- | :--- |
| **`atoms/`** | Elementos básicos e indivisibles. | `Button`, `Input`, `Badge`, `Avatar`, **`Illustrations`**. |
| **`molecules/`** | Combinación de átomos para una función simple. | `Field`, `Tooltip`, `Popover`, `Divider`. |
| **`organisms/`** | Secciones complejas y funcionales de la UI. | `TopBar`, `LeftSidebar`, `RightSidebar`, `Dialog`, `Footers`, `Hero`, `BentoGrid`. |
| **`layout/`** | **Foundations** (Primitivos de espacio). | `Stack`, `Grid`, `Box`, `Container`, `Center`, `InfiniteMarquee`. |
| **`templates/`** | Orquestación de la página. | `AppShell`, `BrandIdentityView`. |

---

## 2. Patrones de Diseño Avanzados

### 2.1. Composite Pattern (Sidebars)
Los componentes de alta densidad como el `RightSidebar` utilizan el patrón de composición por puntos:
```tsx
<RightSidebar>
  <RightSidebar.Header title="Activity" status="online" />
  <RightSidebar.Body>...</RightSidebar.Body>
  <RightSidebar.Footer>...</RightSidebar.Footer>
</RightSidebar>
```

### 2.2. Estandarización de Grids
- **Bento Grid**: Filas de 180px, radios de 40px (2.5rem).
- **Logo Cloud**: Ticker infinito con degradados laterales de desvanecimiento.

### 2.3. Ilustraciones Dinámicas
Las ilustraciones son átomos SVG reactivos. No deben usar colores fijos, sino `--lpd-color-brand-primary` y `secondary`.

---

## 3. Principios de Ingeniería

### 3.1. Clean Imports
Utilizar siempre el alias `@/` para imports internos. Los componentes de alto nivel (`organisms`) deben importar sus primitivos desde `@/components/layout`.

### 3.2. SaaS Logic
Cada Tenant define su estilo visual (`base` vs `brand`) y comportamiento inicial (ej. sidebar colapsado) en el `TENANT_DATA`. El sistema reacciona automáticamente.

---

## 4. Componentes Listos para Usar
- **Atoms**: `Button`, `Input`, `Label`, `TextArea`, `Switch`, `Badge`, `Avatar`, **Full Illustration Set**.
- **Molecules**: `Field`, `Tooltip`, `Popover`, `LogoCloud`, `Callout`.
- **Organisms**: `Dialog`, `AlertDialog`, `Drawer`, `Toaster`, `Headers`, `Sidebars`, `Footers`, `Hero`, `BentoGrid`.
- **Templates**: `AppShell`, `BrandIdentityView`.
