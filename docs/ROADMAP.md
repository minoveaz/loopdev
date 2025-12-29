# Roadmap de Transformación SaaS: De MarketingStudio a LoopDev

Este documento detalla la ruta estratégica para reconstruir MarketingStudio bajo los estándares de **loopdev**, transformándolo en una plataforma SaaS multitenant y modular.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas y la interfaz bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** Estructura Atómica y Activos.
- [x] **1.3. Sistema de Theming Dinámico (Design Tokens).**

---

## Fase 2: Arquitectura Modular y Multi-tenancy ✅
**Objetivo:** Desacoplar la lógica de negocio de la UI y configurar el monorepo maestro.

- [x] **2.1. Root Monorepo Evolution:** Workspace reubicado a la raíz para soportar `/apps` y `/modules`.
- [x] **2.2. Folder Standards:** Estructura de 3 capas (UI > Modules > Apps) y 3 niveles de Admin.
- [x] **2.3. Layout Foundations:** AppShell, Sidebars, Footers y Primitivos responsivos.
- [x] **2.4. SaaS Core Foundations:** Overlays (Radix), Toasts (Sonner) y Form Atoms.

---

## Fase 1: Cimentación y Estandarización (Core & DS) ✅
**Objetivo:** Establecer las bases técnicas y la interfaz bajo el estándar de **Atomic Design**.

- [x] **1.1. Configuración de Monorepo (Turbo/PNPM).**
- [x] **1.2. Evolución del Design System (loopdev/ds):** Estructura Atómica y Activos.
- [x] **1.3. Sistema de Theming Dinámico (Design Tokens).**
- [x] **1.4. LoopDev Developer Manifesto:** Definición de estándares de ingeniería (MVVM/Hooks, No Hardcoding, Docs-First). ✅ (HOY)
- [x] **1.5. AI-Context Protocol:** Creación de guías de contexto para agentes de IA. ✅ (HOY)

---

## Fase 2: Arquitectura Modular y Multi-tenancy ✅
**Objetivo:** Desacoplar la lógica de negocio de la UI y configurar el monorepo maestro.

- [x] **2.1. Root Monorepo Evolution:** Workspace reubicado a la raíz.
- [x] **2.2. Folder Standards:** Estructura de 3 capas (UI > Modules > Apps).
- [x] **2.3. Layout Foundations:** AppShell, Sidebars, Footers y Primitivos responsivos.
- [x] **2.4. SaaS Core Foundations:** Overlays (Radix), Toasts (Sonner) y Form Atoms.

---

## Fase 3: LoopDev Architect Module (`mod-architect`) 🏗️
**Objetivo:** Implementar la lógica del Architect para automatizar la migración del Portal.

- [x] **3.1. Core Implementation:** Definición de tipos y arquitectura interna (Model/Brain/Body). ✅ (HOY)
- [x] **3.2. Workbench UI:** Implementación del `SplitPane` (Lienzo Dividido) para comparación A/B. ✅ (HOY)
- [ ] **3.3. Blueprint Indexer:** Lógica para leer los archivos de `mock-loopdev` como fuentes de datos reales.
- [ ] **3.4. AI-Transformation Engine:** Integración de lógica para proponer cambios atómicos.

---

## Fase 4: Portal LoopDev-OS 🚀
**Objetivo:** Lanzar la primera versión funcional del Sistema Operativo de LoopDev.

- [x] **4.1. App Scaffolding:** Inicialización de `apps/loopdev-os` con Vite y React Router. ✅ (HOY)
- [x] **4.2. Routing Architecture:** Configuración de rutas `/`, `/admin` y `/:tenantId`. ✅ (HOY)
- [x] **4.3. Studio Layout Integration:** Implementación del Shell Inmersivo (Header + RightSidebar) usando el Design System. ✅ (HOY)
- [ ] **4.4. Porting Designer Landing:** Implementar la página principal usando los nuevos Snippets.
- [ ] **4.5. Navigation Engine:** Sidebar dinámico basado en registro de módulos.

---

## Principios de Arquitectura LoopDev
1. **Three-Layer-Reuse:** UI (Librería) > Módulos (Lógica) > Apps (Productos).
2. **Atomic-Agnostic:** Componentes orientados a tokens y settings.
3. **Audit-Driven-Development:** Todo diseño externo pasa por el `mod-auditor`.
4. **Branding-in-Code:** Identidad dinámica y escalable.
