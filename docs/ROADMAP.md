# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo de un producto específico ("Estar Protegidos") a una plataforma SaaS multitenant, modular y agnóstico.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas en el monorepo y centralizar la interfaz de usuario.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM):**
    - Definir espacios de trabajo para `apps/*`, `packages/shared/*` y `packages/modules/*`.
- [x] **1.2. Evolución del Design System (loopdev/ds):**
    - Implementar **Design Tokens** (Colores, Tipografía, Spacing) usando CSS Variables.
- [x] **1.3. Sistema de Theming Dinámico:**
    - Motor de temas que inyecta identidad visual mediante clases `.theme-tenant` y `data-subbrand`.

---

## Fase 2: Capa de Abstracción y Multi-tenancy 🚧
**Objetivo:** Desacoplar la lógica de negocio de los datos del cliente.

- [x] **2.1. Abstracción de Identidad (Tenant Context):**
    - `TenantProvider` implementado con soporte para Estrategia de Marca (Propósito, Promesa, Personalidad).
- [ ] **2.2. Arquitectura de Datos Agnóstica:**
    - Definir Interfaces (Contracts) para los servicios de Backend.
- [ ] **2.3. Internationalization (i18n):**
    - Sistema de traducciones configurable por cliente o región.
- [ ] **2.4. Gestión de Assets Externos:**
    - Recuperación dinámica de assets mediante referencias basadas en el `tenantId`.

---

## Fase 2.5: Layout Foundations & App Shell ✅
**Objetivo:** Crear el esqueleto funcional y las reglas de composición espacial.

- [x] **Layout Primitives:** Implementación de `Stack`, `Inline`, `Grid`, `Box`, `Bleed`, `AspectRatio`.
- [x] **Mobile Ready:** Primitivo `SafeArea` para soporte nativo de Notch y Gesture Bar.
- [x] **App Shell:** Estructura de `TopBar`, `Sidebar` y `MainContent` agnóstica y responsive.

---

## Fase 2.6: SaaS Core Foundations (Interactividad y Datos) ⏳
**Objetivo:** Implementar los bloques de construcción para la entrada de datos y el feedback del sistema.

- [ ] **2.6.1. Overlays & Feedback:**
    - Modales y Drawers accesibles (Radix UI).
    - Sistema global de Toasts y Notificaciones.
    - Tooltips y Popovers para ayuda contextual.
- [ ] **2.6.2. Form Foundations:**
    - Wrapper de campo (`Field`) con manejo automático de Labels y Errores.
    - Set de inputs agnósticos: `Text`, `Select`, `Checkbox`, `Switch`.
    - Integración con controladores de formulario (ej. React Hook Form).
- [ ] **2.6.3. User & Auth Context:**
    - Gestión de perfiles, preferencias de usuario (DarkMode) y permisos (RBAC).

---

## Fase 2.7: UX Resiliency & Navigation ⏳
**Objetivo:** Asegurar que la app sea profesional incluso en estados de carga o error.

- [ ] **2.7.1. States (Loading & Empty):**
    - `Skeleton` primitivo para pantallas de carga que respetan el Layout.
    - Componente `EmptyState` estandarizado para listas vacías.
    - `ErrorBoundary` a nivel de componente y de página.
- [ ] **2.7.2. Advanced Navigation:**
    - `Tabs` y `Breadcrumbs` para navegación profunda en módulos.
    - Paginación y Infinite Scroll para listas masivas.
- [ ] **2.7.3. Feature Management:**
    - Engine para habilitar/deshabilitar módulos según el contrato del Tenant (Capabilities).

---

## Fase 3: Re-implementación Modular (Business Logic) ⏳
**Objetivo:** Migrar la funcionalidad de MarketingStudio como módulos independientes y reutilizables.

- [ ] **3.1. Reconstrucción del Brand Center:**
    - Portado de `PhilosophyView`, `IdentityView` y `VoiceAndTone`.
- [ ] **3.2. Módulo de Campañas y Activos:**
    - Convertir el `campaign-orchestrator` y `asset-manager` en paquetes `@loopdev/mod-campaigns`.

---

## Fase 4: Despliegue y Orquestación SaaS ⏳
**Objetivo:** Lanzar la aplicación "cascarón" que consume los módulos.

- [ ] **4.1. Creación de la Main App.**
- [ ] **4.2. Dashboard de Administración (LoopDev Ops).**
- [ ] **4.3. Estrategia de Migración de "Estar Protegidos".**
