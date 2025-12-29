# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo en una plataforma SaaS multitenant, modular y altamente reutilizable.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas y la interfaz de usuario bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** Estructura Atómica.
- [x] **1.3. Sistema de Theming Dinámico (Design Tokens).**

---

## Fase 2: Arquitectura Modular y Multi-tenancy 🚧
**Objetivo:** Desacoplar la lógica de negocio de la UI y los datos del cliente.

- [x] **2.1. Abstracción de Identidad (Tenant Context).**
- [x] **2.2. Layout Foundations:** Shell, Sidebars, Footers y Primitivos.
- [x] **2.3. Interactive Overlays:** Dialogs, Drawers, Toasts.
- [x] **2.4. Form Foundations:** Atoms y Field Molecule.
- [ ] **2.5. Root Monorepo Evolution:** Reubicar el workspace a la raíz para soportar `/apps` y `/modules`.

---

## Fase 3: LoopDev Auditor Module (`mod-auditor`) 🏗️ (NUEVO)
**Objetivo:** Crear un módulo funcional reutilizable para auditar y migrar diseños a producción.

- [ ] **3.1. Infrastructure:** Crear `loopdev/modules/mod-auditor` con soporte para `@loopdev/ui`.
- [ ] **3.2. Migration Engine:** Motor que compara Blueprints (mockups) vs Componentes Atómicos.
- [ ] **3.3. Approval Workflow:** Interfaz de validación A/B con manifest de aprobación JSON.
- [ ] **3.4. Automation Bridge:** Integración del script de conversión inteligente.

---

## Fase 4: Portal LoopDev & Real-world Validation 🚀
**Objetivo:** Lanzar el primer producto oficial usando la nueva arquitectura modular.

- [ ] **4.1. App Scaffolding:** Crear `loopdev/apps/loopdev-portal`.
- [ ] **4.2. Functional Porting:** Migrar la landing del diseñador usando el `mod-auditor`.
- [ ] **4.3. Multi-tenant Validation:** Validar que el portal reacciona a diferentes marcas.

---

## Fase 5: Re-implementación de Módulos Core ⏳
**Objetivo:** Portar los módulos pesados de MarketingStudio.

- [ ] **5.1. Módulo de Brand Center.**
- [ ] **5.2. Módulo de Campañas y Activos.**
- [ ] **5.3. Módulo de Inteligencia IA.**

---

## Principios de Arquitectura LoopDev
1. **Three-Layer-Reuse:** UI (Librería) > Módulos (Lógica) > Apps (Productos).
2. **Atomic-Agnostic:** Componentes y lógica que no conocen al cliente final.
3. **Audit-Driven-Development:** Todo componente nuevo debe pasar por el módulo de auditoría.
4. **Config-First:** El comportamiento se define en el Tenant Data.