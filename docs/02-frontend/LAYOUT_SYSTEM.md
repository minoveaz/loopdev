# 🧱 Layout System — LoopDev (Complete v1)

> **Estado:** Activo
> **Tipo:** Infraestructura de UX / Plataforma
> **Alcance:** Apps · Product Modules · Platform Modules
> **Objetivo:** Definir un **sistema de layouts estándar, reutilizable y gobernado** que soporte todo el ecosistema LoopDev.

---

## 0️⃣ Principio rector
> **Los layouts son infraestructura, no decoración.**
- Un layout **no contiene lógica de negocio**.
- Un layout define **zonas, responsabilidades y límites**.
- Los layouts viven en `@loopdev/ui/src/components/composites/shell`.

---

## 1️⃣ Layouts oficiales (v1)
- **App Shell (Certified v1.1):** Contenedor raíz del SaaS. Implementa comportamiento híbrido (Push en Desktop / Overlay en Mobile), gestión de estados determinista (`navMode`, `contextMode`), soporte de densidad y accesibilidad avanzada (Topmost Escape, Mobile Scroll Lock). Para la guía de implementación, ver **[SHELL_ARCHITECTURE.md](./SHELL_ARCHITECTURE.md)**.
- **Module Workspace (Certified v1.0):** Chasis operativo de 4 paneles para módulos profundos. Ver **[MODULE_WORKSPACE.md](./MODULE_WORKSPACE.md)**.
- **Unified Inspector:** Sistema de paneles de consecuencia y gobernanza. Ver **[INSPECTOR_SYSTEM.md](./INSPECTOR_SYSTEM.md)**.
- **Page:** Plantilla de página estándar (Formularios, Dashboards).
- **Split View:** Trabajo dual (Lista ↔ Inspector).
- **Settings:** Configuración y preferencias.
- **Public:** Vistas no autenticadas (Login, Landing).

---

## 🛡️ Protocolo de Certificación de Layouts (🔵🔵)

Para alcanzar el estatus **Certified v1 — Full**, un Layout debe superar los 5 Jueces Especializados:

### 1. Test de Composición (Slots) — [Vitest]
- **Validación:** El layout debe renderizar correctamente sus huecos dinámicos (Header Slot, Sidebar Slot, Content Slot).
- **Regla:** Los slots no deben romperse si se les pasa contenido nulo o vacío.

### 2. Test de Resiliencia de Contenedor — [Playwright visual]
- **Validación:** El comportamiento del scroll y las áreas fijas debe ser infalible.
- **Escenario de Estrés:** Validar historias con "Contenido Infinito" para asegurar que el Header/Sidebar permanecen estables.

### 3. Test de Adaptabilidad (Responsive) — [Playwright]
- **Validación:** El layout debe ser operativo en Desktop (1440px), Tablet (768px) y Mobile (375px).
- **Gate:** En móvil, el sidebar debe colapsar o transicionar a un menú accesible.

### 4. Test de Integridad de Superficie — [Axe-core]
- **Validación:** Los layouts definen las grandes superficies (`Deep Space`, `Surface`).
- **A11y:** El contraste en el fondo del layout debe garantizar legibilidad WCAG AA para cualquier componente hijo en ambos temas.

### 5. Test de Gestión de Estados (Topmost) — [Unit]
- **Validación:** La tecla Escape y el Backdrop deben cerrar solo el panel activo superior (priorizando Inspector sobre Nav).
- **Interacción:** El scroll del contenido principal debe bloquearse en modo overlay para evitar el "scroll bleed".

---
*Gobernanza de Layouts - LoopDev Engineering Board*
