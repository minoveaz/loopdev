# COMPONENT_COMPOSITION_PROTOCOL

**Single Source of Truth (SSOT) para Diseño → Ingeniería → Calidad → SaaS**
**Producto:** LoopDev / LoopSaaS
**Versión:** 1.1 (Enterprise Ready - Complete Edition)
**Estado:** Activo
**Owner:** Design Systems Lead + Frontend Platform Lead
**Aplica a:** Todos los componentes UI/UX del ecosistema SaaS

---

## Prefacio · Jerarquía del Sistema

Este protocolo **opera sobre** y **depende explícitamente de**:

* **VISUAL_COMPOSITION_SYSTEM v3.8** (fundamentos visuales)
* **COMPONENT_TESTING_PROTOCOL v1.0** (estándares de calidad)
* **COMPONENT_WORKFLOW v1.2** (gestión ágil y persistencia de datos)

---

## 0) Propósito y principio rector

Este documento define el protocolo único para construir componentes en LoopDev. La meta es pasar de un "Blueprint" a un "Componente Productivo" con un proceso industrial: **Indestructible, Accesible y Plenamente Personalizable vía Data.**

---

## 1) Equipos y Responsabilidades (Ciclo Ágil)

### 1.1 Equipos
* **Equipo A — Diseño:** Define estructura, tokens y contratos visuales (DoR).
* **Equipo B — Ingeniería:** Implementa el patrón Brain/Body y la suite de tests.
* **Equipo C — Gobernanza:** Audita la integración con la base de datos y certifica el DoD.

### 1.2 El Ciclo de Vida (DoR & DoD)
Nadie inicia un componente sin el **Definition of Readiness** (Blueprint validado + User Story). Nadie cierra un componente sin el **Definition of Done** (Tests en verde + Registry en Firestore).

---

## 2) Lenguaje del sistema visual (autoridad)

Todo componente **debe cumplir** el **VISUAL_COMPOSITION_SYSTEM v3.8**:
* Tipografía dual (Inter / JetBrains Mono).
* Grid base de 4px.
* Profundidad (Deep Space, Surface, Canvas, Glass).
* Brackets `{}` como operadores estructurales.

---

## 3) Taxonomía oficial de componentes

Todo componente debe pertenecer a **una única categoría**:
* **Foundations** — Tokens, typography, spacing helpers.
* **Primitives** — Button, Badge, Input, Icon, Spinner.
* **Composites** — DataTable, KanbanBoard, SearchPanel.
* **Layouts** — PageShell, Sidebar, SplitPane.
* **Patterns** — AI Ghost blocks, Threading.

---

## 4) Proceso de Desarrollo (Pipeline)

### 4.1 Fase B1 — Ensamblaje (Engineering)
* Arquitectura **Brain vs Body (MVVM)**.
* Soporte nativo para **Dark / Light mode**.
* Cero HEX hardcodeados.
* `Example.tsx` con demostración de overrides.

### 4.2 Fase Q1 — Calidad (Quality Guard)
* **Unit Tests:** Cobertura de renderizado y lógica de variantes con Vitest.
* **A11y:** Navegación por teclado y roles ARIA.

### 4.3 Fase D1 — Persistencia (Data Awareness)
* Integración con el **DynamicThemeProvider**.
* Registro de metadatos en la base de datos (Component Registry).

---

## 5) Estructura estándar del componente

```
components/functional/<ComponentName>/
├── index.tsx           (The Body: JSX Puro)
├── use<ComponentName>.ts (The Brain: ViewModel/Lógica)
├── components.tsx      (Sub-componentes internos)
├── types.ts            (Interfaces TS)
├── fixtures.ts         (Datos de prueba realistas)
├── Example.tsx         (Escenario de validación)
├── README.md           (Documentación técnica y UX)
└── <ComponentName>.test.tsx (Suite de pruebas obligatoria)
```

---

## 6) Contrato de metadata (Indexer Ready)

```tsx
/**
 * @component ComponentName
 * @description Propósito claro y contexto de uso.
 * @category Primitives | Composites | Layouts | Patterns
 * @status stable | beta | experimental
 * @version 1.x.x
 */
```

---

## 7) Tokens y Multitenancy (Dynamic Theming)

* Los componentes deben ser **"Theme Aware"**.
* **Zero Hardcoding Policy:** 
    * Prohibido usar HEX incluso en historias de ejemplo. Usar escala estándar de Tailwind (w-1, w-2...).
    * Prohibido realizar cálculos geométricos en JS. Usar propiedades CSS como `aspect-ratio`.
* Se deben usar variables CSS de componente (`--comp-*`) que hereden de los tokens globales (`--lpd-*`).

---

## 8) Brain vs Body (MVVM LoopDev)

* **Brain:** Solo lógica, estados (`useState`, `useEffect`), y cálculos de clases.
* **Body:** Solo renderizado. Recibe el "ViewModel" del Brain.
* **components.tsx:** UI pura y piezas presentacionales.

---

## 9) Accesibilidad (Bloqueante)

* `focus-visible` obligatorio para navegación por teclado.
* Contraste WCAG AA en ambos temas.
* Atributos `aria-*` dinámicos (ej. `aria-busy` durante carga).

---

## 10) Testing Protocol (Vitest)

Todo componente de producción debe pasar:
1. **Render Test:** ¿Se muestra el contenido?
2. **Variant Test:** ¿Cambia la clase CSS al cambiar la prop?
3. **Action Test:** ¿El `onClick` se dispara? ¿El `disabled` bloquea?
4. **Icon Test:** Verificación de glifos de Material Symbols.

---

## 11) Motion — Loop Momentum

* Animaciones sincronizadas con `MOTION` tokens.
* Duraciones estándar: standard (250ms), fast (150ms), slow (400ms).
* Curvas de aceleración: standard, emphasize, decelerate.

---

## 12) IA — AI Augmentation

El `README.md` y las `fixtures.ts` deben estar diseñados para ser consumidos por una IA:
* Explicar la "intención" del componente.
* Proporcionar datos de ejemplo complejos que simulen respuestas de un LLM.

---

## 13) Excepciones

Cualquier excepción requiere comentario en código con razón + alternativa intentada + ticket de seguimiento.

---

## 14) Convenciones de nombres y exports

- **Carpeta y export principal:** ComponentName (PascalCase)
- **Hook:** useComponentName
- **Subcomponentes:** ComponentNamePart
- **Tipos:** ComponentNameProps

---

## 15) Checklists Finales (Definition of Done)

Un componente está **Done** si y solo si:
* [ ] **Assembly:** cumple B1 + demo + fixtures + README.
* [ ] **SaaS-ready:** B1 + C1 + tests + versionado.
* [ ] **Certification:** Sello `Loopdev.lab` visible en Storybook.
* [ ] **Stable:** adopción real + cero violaciones + docs maduras.

---

# Reglas de Dependencia entre Fases (Phase Dependency Rules)

> **Cada fase de desarrollo SOLO puede consumir componentes definidos en fases anteriores.**

1. ✅ **DEBE** reutilizar componentes previos (ej. Button usa Icon).
2. ❌ **NO PUEDE** redefinir fundamentos existentes.
3. ❌ **NO PUEDE** crear variantes paralelas de componentes base.

---

# Compatibilidad de Modo Claro y Oscuro (Theme Mode)

> **Dark-first, pero Light-mode obligatorio.**

* Prohibido asumir un único color de fondo.
* Prohibido depender de contrastes válidos solo en un modo.
* Todos los colores deben derivar de tokens semánticos.

---

**Fin del documento — COMPONENT_COMPOSITION_PROTOCOL v1.1 (Complete Edition)**