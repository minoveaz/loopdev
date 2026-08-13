# Guía de Composición Visual loop.dev

## **Version 3.9 — High Fidelity Standard**

> **Status:** Active / Production Ready
> **Owner:** LoopDev Design System
> **Audience:** Design · Frontend · Component Assembly · SaaS Governance
> **Scope:** UI Components · UX Patterns · Visual System Contracts

---

## Prefacio

Este documento es la **fuente única de la verdad** para el diseño y ensamblaje visual de la plataforma SaaS **loop.dev**.

* **v3.7** define los **fundamentos visuales inmutables**.
* **v3.8** define cómo esos fundamentos se **operacionalizan** para construir producto real.

> Este documento **no redefine la identidad visual**.
> Define **contratos visuales y de comportamiento** que permiten construir componentes sin reinterpretación.

---

## Tabla de Contenidos

1. Principios No Negociables
2. Fundamentos de Color (The Palette)
3. Superficies y Profundidad (Depth Architecture)
4. Tipografía Dual
5. Grid, Layout y Densidad
6. Movimiento y Momentum
7. Patrones Fundamentales LoopDev
8. Estados Globales del Sistema
9. Feedback System (Micro-feedback)
10. Empty, Zero & Error States
11. Responsiveness Semántico
12. Modelo de Atención y Foco
13. Selection Patterns
14. Iconografía como Lenguaje
15. Data Visualization Rules
16. Taxonomía de Errores
17. Loading Strategy
18. Content Tone & Microcopy
19. Accesibilidad Avanzada
20. Sello de Certificación (Engineering Seal)
21. Visual QA Protocol
22. Reglas de Uso para Desarrollo de Componentes

---

## 1. Principios No Negociables

1. **Color = Rol, no decoración**
2. **Grid = estructura (base 4px)**
3. **Profundidad = superficies + bordes, no sombras negras**
4. **Tipografía dual = autoridad (Inter) + precisión (JetBrains Mono)**
5. **Movimiento = feedback funcional, no ornamento**
6. **{ } = operadores estructurales, no decoración.** La firma oficial de estado se implementa mediante el componente `TechnicalStatusBadge`.
7. **Todo componente debe ser multitenant-ready**

> Si un componente se ve "correcto" pero rompe estas reglas, **no es aceptado**.

---

## 2. Fundamentos de Color (The Palette)

### Azul Estructural (Core)

* Primary Blue: `#135BEC` → `--color-primary`
* Light: `#4F85F0`
* Dark: `#0B46BE`

Uso: estructura, foco, CTAs primarios.

### Amarillo Energía (Signal)

* Energy Yellow: `#FFD025` → `--color-energy`

Uso: datos vivos, IA, micro-indicadores.
Regla: nunca para texto largo.

### IA & Innovación

* IA Purple: `#9333EA`
* Soft IA: `rgba(147,51,234,0.1)`
* Electric Violet: `#A855F7`
* Deep Indigo: `#4338CA`

### Estados Semánticos

* Success: `#10B981`
* Danger: `#EF4444`
* Operational: `#0D9488`

---

## 3. Superficies y Profundidad (Depth Architecture)

### 3.1 Niveles de Superficie (Jerarquía de Contraste)
El sistema utiliza una escala de profundidad de 3 niveles para garantizar el contraste en interfaces densas:
1.  **Deep Space (Background Base):** `#0d121b` (Azul noche profundo). Uso: fondo de aplicación.
2.  **Elevated Surface:** `#181b21` (Gris carbón). Uso: Dropdowns, Modales, Popovers. Permite que el componente destaque sobre el fondo.
3.  **Technical Canvas:** `#ffffff` (Claro) / `#0d121b` (Oscuro). Uso: Sidebars y Headers integrados en el chasis.

### 3.2 Bordes de Alta Definición (Technical Borders)
La precisión se comunica mediante líneas casi invisibles:
-   **Standard Border:** 1px sólido (border-slate-200 / border-white/10).
-   **Technical Border:** 0.5px de grosor (rgba(0,0,0,0.05) / rgba(255,255,255,0.05)). Uso: separadores internos de menús y breadcrumbs.

### 3.3 Texturas Técnicas (The Grid Policy)
Las superficies de LoopDev no son planas; usan "texturas de ingeniería" para denotar precisión:
1.  **Blueprint Grid (Líneas 40px/8px):** Uso en Cards, Modals y Layouts. Simboliza arquitectura.
2.  **Neural Grid (Puntos 24px):** Uso exclusivo en componentes de IA, Generative Previews y Dashboards. Simboliza datos vivos.
*Regla de opacidad:* Siempre entre 3% y 12% para no competir con el contenido.

---

## 4. Tipografía Dual

### Inter (Sans)
- **Display:** weight 900, tracking -0.05em.
- **UI Labels (Technical):** weight 700, 10px (`text-technical`). Uso: títulos de grupo en menús.
- **UI Labels (Micro):** weight 700, 9px (`text-micro`). Uso: marcas de estado.

### JetBrains Mono
- **Uso:** IDs, logs, timestamps, shortcuts, breadcrumbs jerárquicos.
- **Regla:** datos vivos en `font-bold`.

---

## 5. Grid, Layout y Densidad

* Unidad base: **4px**
* Todo spacing debe respetarla

### Densidad

* High Density (Engineering): `p-2 / p-3`
* Low Density (Marketing): `p-8+`

---

## 6. Movimiento y Momentum

* Curva estándar: `cubic-bezier(0.25, 0.1, 0.25, 1.0)`
* Hover: ~150ms
* Entradas: ~300ms
* IA loops: 3–8s

Animación siempre comunica estado.

---

## 7. Patrones Fundamentales LoopDev

Incluyen:

* Laboratory Canvas
* Threading
* Timeline / Feed
* AI Ghost
* Bracketing Pattern `{ }`

Estos patrones son obligatorios cuando el contexto aplica.

---

## 8. Estados Globales del Sistema

| Estado      | Icono        | Token       | Naturaleza  |
| ----------- | ------------ | ----------- | ----------- |
| Saving      | sync         | primary     | Soft        |
| Syncing     | cloud_sync   | operational | Persistente |
| AI Thinking | auto_awesome | ia          | Ghost       |
| Offline     | cloud_off    | danger      | Blocking    |
| Unsaved     | dot          | energy      | Micro       |

---

## 9. Feedback System

* Success → Toast (3s)
* In Progress → Inline
* Undo → Toast con acción (6s)
* System Auto → Activity Feed

Feedback requiere decisión → no usar toast.

---

## 10. Empty, Zero & Error States

* Zero: primera vez → CTA + onboarding
* Empty: borrado → CTA crear
* Filtered: sin resultados → limpiar filtros
* Error: fallo técnico → retry

---

## 11. Responsiveness Semántico

* Kanban <768px → Stack vertical
* Tables <1024px → columnas colapsan
* Sidebars <1280px → icon-only

Nunca perder funcionalidad crítica.

---

## 12. Modelo de Atención y Foco

1. Critical Alerts (blocking)
2. Modals / Drawers (focus trap)
3. AI Suggestions (sin robo de foco)

Focus Ring:

* Teclado: primary 2px
* IA: ia + pulse

---

## 13. Selection Patterns

* Multi-select con checkboxes
* Bulk Actions Bar flotante
* Active: fondo primary/5
* Cancelar: Esc

---

## 14. Iconografía como Lenguaje

* Icon-only: acciones universales
* Icon + label: negocio
* Tamaños: 16 / 20 / 24
* Estilo: Outline por defecto

---

## 15. Data Visualization Rules

* Máx. 6 series por gráfico
* Hover aumenta grosor
* Tooltips en glass
* Paleta progresiva

---

## 16. Taxonomía de Errores

| Tipo       | Visual  | Tono         |
| ---------- | ------- | ------------ |
| User       | Inline  | Guía         |
| Validation | Toast   | Técnico      |
| Permission | Overlay | Autoritativo |
| System     | Top Bar | Disculpa     |

---

## 17. Loading Strategy

* **> 1s:** Uso obligatorio de **Skeletons** (Ghost UI).
* **Acción local:** Uso de **Spinner** (Atomic).
* **IA Process:** Uso de **GenerativePreviewSkeleton** (Aura púrpura) o **AILoader**.
* **Estructura del Skeleton:**
    *   **Shimmer:** Animación de barrido para superficies pequeñas/medianas.
    *   **Pulse:** Animación de opacidad para superficies grandes o tablas masivas (Rendimiento).
    *   **A11y:** Respetar `prefers-reduced-motion` desactivando animaciones automáticamente.

---

## 18. Content Tone & Microcopy

* Botones: imperativo
* Estados: descriptivo
* IA: `{ }` para variables
* Labels: máx. 2 palabras

---

## 19. Accesibilidad Avanzada

* `.reduce-motion`
* High contrast mode
* Shortcuts visibles `{ ⌘K }`

---

## 20. Evidencia de madurez visual

La madurez visual se comunica mediante evidencia verificable en el track, el
registro canónico y las pruebas Playwright. No se requiere un sello de branding
en Storybook o en el código de producción.

### 20.1 Evidencia requerida
*   **Track:** Alcance, decisiones, riesgos y validaciones.
*   **Registry:** Capacidades y estado del componente.
*   **Playwright:** Flujo, accesibilidad y regresión visual revisados.

### 20.2 Semántica de Estados
*   **Certified:** Componente verificado y respaldado por la evidencia requerida.
*   **Audit:** Componente funcional con deuda técnica o visual pendiente.
*   **Experimental:** Prototipo fuera del camino de producción.

---

## 21. Visual QA Protocol

1. Grid 4px
2. Contraste AA
3. Empty state definido
4. Legible en Deep Space
5. **Evidencia de validación vinculada al track.**

---

## 22. Reglas de Uso para Desarrollo de Componentes

* Prohibido hex hardcodeado
* Prohibido CSS global
* Prohibido inline styles productivos
* Tokens semánticos obligatorios
* Brain vs Body obligatorio
* La evidencia visual debe ser reproducible con Playwright.

---

**Fin del documento — VISUAL_COMPOSITION_SYSTEM v3.8**
