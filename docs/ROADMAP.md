# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo de un producto específico ("Estar Protegidos") a una plataforma SaaS multitenant, modular y agnóstico.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas en el monorepo y centralizar la interfaz de usuario bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** Estructura Atómica (Atoms, Molecules, Organisms).
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
- [x] **Advanced Headers (Organisms):** `TopBar` (Global) y `PageHeader` (Contextual).
- [x] **Modular Sidebars (Organisms):** `LeftSidebar` (Rail+Flyout) y `RightSidebar` (Inspector).
- [x] **Sidebar Controller:** `LayoutProvider` y `SidebarToggle` para control manual.
- [x] **Footer Ecosystem (Organisms):** `SaaSFooter`, `MarketingFooter` y `MobileNav`.

---

## Fase 2.6: SaaS Core Foundations (Interacción y Entrada) 🚧
**Objetivo:** Implementar los bloques de construcción para la interactividad y formularios.

- [x] **2.6.1. Overlays & Feedback (Molecules/Organisms):** ✅
    - [x] **Dialog / Alert Dialog:** Ventanas de flujo crítico.
    - [x] **Drawer:** Paneles laterales táctiles.
    - [x] **Toast:** Sistema global de notificaciones.
    - [x] **Tooltip / Popover:** Ayuda contextual.
- [ ] **2.6.2. Form Foundations & Atoms:** ⏳
    - [ ] **Form Atoms:** Label, HelperText, ErrorMessage, RequiredIndicator.
    - [ ] **Field Wrapper:** Orquestador de átomos (Molecule).
    - [ ] **Agnostic Inputs (Atoms):** Text, TextArea, Number, Password.
    - [ ] **Selection Inputs (Atoms/Molecules):** Select, Checkbox, Radio, Switch.
- [ ] **2.6.3. User & Auth Context (Identity, RBAC).**

---

## Fase 2.7: UX Resiliency & Navigation ⏳
**Objetivo:** Asegurar que la app sea profesional incluso en estados de carga o error.

- [ ] **2.7.1. Systematic States (Skeleton, EmptyState, ErrorBoundary).**
- [ ] **2.7.2. Navigation & Data (Breadcrumbs, Tabs, Pagination).**
- [ ] **2.7.3. Feature Management (Capabilities Engine).**

---

## Fase 3: Re-implementación Modular (Business Logic) ⏳
**Objetivo:** Migrar la funcionalidad de MarketingStudio como módulos independientes.

- [ ] **3.1. Reconstrucción del Brand Center.**
- [ ] **3.2. Módulo de Campañas y Activos.**

---

## Principios de Desarrollo en LoopDev
1. **Atomic-Design:** Estructura 100% escalable (Atoms, Molecules, Organisms, Templates).
2. **Atomic-Agnostic:** Los componentes no conocen al cliente, solo consumen tokens y settings.
3. **Config-First:** El comportamiento visual se define en el Tenant Data.
4. **Layout-First:** Uso estricto de primitivos estructurales (cero márgenes manuales).
5. **Responsive-Native:** Componentes listos para Web Apps móviles.
