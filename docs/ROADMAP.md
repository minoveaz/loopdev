# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo de un producto específico ("Estar Protegidos") a una plataforma SaaS multitenant, modular y agnóstico.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas en el monorepo y centralizar la interfaz de usuario bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** 
    - [x] Estructura Atómica (Atoms, Molecules, Organisms).
    - [x] **Brand Illustrations:** Migración total de 37 activos dinámicos.
    - [x] **Premium Core:** Componentes refinados contra especificaciones de diseño real (Pixel-Perfect).
- [x] **1.3. Sistema de Theming Dinámico (Design Tokens).**

---

## Fase 2: Capa de Abstracción y Multi-tenancy 🚧
**Objetivo:** Desacoplar la lógica de negocio de los datos del cliente.

- [x] **2.1. Abstracción de Identidad (Tenant Context):** Soporte para Estrategia de Marca y UI Preferences.
- [ ] **2.2. Arquitectura de Datos Agnóstica (Contracts & SDKs).**
- [ ] **2.3. Internationalization (i18n Core).**
- [ ] **2.4. Gestión de Assets Externos.**

---

## Fase 2.5: Layout Foundations & App Shell ✅
**Objetivo:** Crear el esqueleto funcional y las reglas de composición espacial.

- [x] **Layout Primitives:** `Stack`, `Inline`, `Grid`, `Box`, `Bleed`, `AspectRatio`, `SafeArea`, `Divider`, `Center`, `TwoPaneLayout`, `Sticky`, `InfiniteMarquee`.
- [x] **Advanced Headers:** `TopBar` (Global) y `PageHeader` (Contextual).
- [x] **Modular Sidebars:** `LeftSidebar` (Rail+Flyout) y `RightSidebar` (Composite Pattern).
- [x] **Sidebar Controller:** `LayoutProvider` y `SidebarToggle`.
- [x] **Footer Ecosystem:** `SaaSFooter`, `MarketingFooter` y `MobileNav`.

---

## Fase 2.6: SaaS Core Foundations (Interacción y Entrada) 🚧
**Objetivo:** Implementar los bloques de construcción para la interactividad y formularios.

- [x] **2.6.1. Overlays & Feedback:** Dialog, Drawer, Toast, Tooltip, Popover, Alert Dialog. ✅
- [x] **2.6.2. Form Foundations & Atoms:** Label, Input, TextArea, Switch, Field Wrapper, Select, Checkbox, Radio. ✅
- [ ] **2.6.3. User & Auth Context (Identity, RBAC).**

---

## Fase 2.8: Portal LoopDev & Real-world Validation 🚧
**Objetivo:** Implementar el portal oficial de LoopDev usando el código de diseño real.

- [x] **2.8.1. Premium Snippets:** 
    - [x] **Surfaces:** `MeshHero`, `TechnicalDotGrid`, `GlassCard`.
    - [x] **Marketing:** `BentoGrid`, `Hero`, `LogoCloud`, `Callout`.
- [ ] **2.8.2. App Scaffolding.**
- [ ] **2.8.3. Multi-tenant Injection.**
- [ ] **2.8.4. Site Implementation.**

---

## Principios de Desarrollo en LoopDev
1. **Atomic-Design:** Estructura 100% escalable.
2. **Layout-First:** Uso estricto de primitivos estructurales.
3. **Composite-Pattern:** Componentes complejos divididos en sub-componentes (`RightSidebar.Header`).
4. **Designer-Aligned:** Fidelidad absoluta a las proporciones y radios definidos en mockups premium.