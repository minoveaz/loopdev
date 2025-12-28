# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo de un producto específico ("Estar Protegidos") a una plataforma SaaS multitenant, modular y agnóstico.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas en el monorepo y centralizar la interfaz de usuario bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** Estructura Atómica.
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

- [x] **Layout Primitives (Foundations):** `Stack`, `Inline`, `Grid`, `Box`, `Bleed`, `AspectRatio`, `SafeArea`, `Divider`, `Center`, `TwoPaneLayout`, `Sticky`.
- [x] **Advanced Headers:** `TopBar` (Global) y `PageHeader` (Contextual).
- [x] **Modular Sidebars:** `LeftSidebar` (Rail+Flyout) y `RightSidebar` (Inspector).
- [x] **Sidebar Controller:** `LayoutProvider` y `SidebarToggle`.
- [x] **Footer Ecosystem:** `SaaSFooter`, `MarketingFooter` y `MobileNav`.

---

## Fase 2.6: SaaS Core Foundations (Interacción y Entrada) 🚧
**Objetivo:** Implementar los bloques de construcción para la interactividad y formularios.

- [x] **2.6.1. Overlays & Feedback:** Dialog, Drawer, Toast, Tooltip, Popover. ✅
- [x] **2.6.2. Form Foundations & Atoms:** Label, Input, TextArea, Switch, Field Wrapper. ✅ (Init)
- [ ] **2.6.3. User & Auth Context (Identity, RBAC).**

---

## Fase 2.8: Portal LoopDev & Real-world Validation 🚀 (NUEVO)
**Objetivo:** Implementar el portal oficial de LoopDev usando el código de diseño real para validar el DS.

- [ ] **2.8.1. Code Analysis & Atomization:** Identificar y extraer nuevos átomos y moléculas del diseño real.
- [ ] **2.8.2. App Scaffolding:** Crear `apps/loopdev-portal` dentro del monorepo.
- [ ] **2.8.3. Multi-tenant Injection:** Vincular logos y colores al `TenantProvider`.
- [ ] **2.8.4. Site Implementation:** Construir la landing y páginas estáticas usando el 100% de `@loopdev/ui`.

---

## Fase 3: Re-implementación Modular (Business Logic) ⏳
**Objetivo:** Migrar la funcionalidad de MarketingStudio como módulos independientes.

- [ ] **3.1. Reconstrucción del Brand Center.**
- [ ] **3.2. Módulo de Campañas y Activos.**
- [ ] **3.3. Módulo de IA (Intelligence).**

---

## Principios de Desarrollo en LoopDev
1. **Atomic-Design:** Estructura 100% escalable.
2. **Atomic-Agnostic:** Componentes orientados a tokens y settings.
3. **Responsive-Native:** Mobile-ready por defecto.
4. **Validation-Driven:** El DS evoluciona respondiendo a necesidades reales de producto (Portal LoopDev).
