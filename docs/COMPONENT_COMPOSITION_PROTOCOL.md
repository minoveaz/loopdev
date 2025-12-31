# COMPONENT_COMPOSITION_PROTOCOL.md

Single Source of Truth (SSOT) para Diseño → Ensamblaje → Revisión → Migración a SaaS (LoopDev / loop.dev)
Versión: 1.0 (Oficial)
Estado: Activo
Owner: Design Systems Lead + Frontend Platform Lead
Aplica a: Todos los componentes UI/UX y componentes funcionales React que se publican en el ecosistema SaaS (multitenant)

---

## 0) Propósito y principio rector

Este documento define el protocolo único para construir componentes en LoopDev desde el diseño hasta su publicación en el SaaS.

**Meta principal (no negociable):**
Pasar de “Blueprint / Mockup” a “Componente Productivo” debe ser copy/paste + configuración, sin refactors tardíos, sin hardcoding, sin sorpresas visuales.

**Tres pilares:**
1. **Coherencia Sistémica:** todo componente “se siente LoopDev”.
2. **Portabilidad Real:** se puede extraer/reusar en otros productos sin dependencias invisibles.
3. **Multitenancy Ready:** el componente se adapta a marca/tenant sin tocar código fuente.

---

## 1) Equipos, responsabilidades y handoff

### 1.1 Equipos
- **Equipo A — Diseño (Design System / UI):** define estructura, estados, tokens, reglas visuales y contratos de interacción.
- **Equipo B — Ensamblaje (Component Assembly):** implementa el componente React encapsulado siguiendo el patrón LoopDev (Brain/Body + overrides + fixtures + Example).
- **Equipo C — Revisión & Migración a SaaS (SaaS Integrators / Governance):** audita, normaliza, indexa y publica en el repositorio SaaS.

### 1.2 Regla crítica
Nadie “interpreta” el diseño. Si hay ambigüedad, se corrige en Diseño y se actualiza el contrato. Lo contrario genera divergencia y deuda técnica.

### 1.3 Entregables por fase (obligatorios)

**Diseño entrega:**
- Spec de componente (anatomía + layout)
- Estados (default/hover/active/disabled/loading/empty/error/success)
- Tokens y roles semánticos (color/typography/spacing/radius)
- A11y spec (focus order, roles, labels, keyboard interactions)
- Motion spec (duraciones/curvas/props animadas)
- Reglas de densidad (high/low density si aplica)

**Ensamblaje entrega:**
- Carpeta autocontenida con estructura estándar
- Example.tsx funcional con overrides de marca
- Fixtures tipados + README + metadata indexer block
- Cumplimiento Visual Logic (v3.7) + tokens + dark/light
- Tests mínimos (según categoría)

**Revisión/Migración entrega:**
- Validación con checklist y auditoría automática (Architect)
- Normalización (nombres, categorías, metadata, compatibilidad)
- Registro en índice del SaaS + versión + notas de release

---

## 2) Lenguaje del sistema: “Visual Logic v3.7” como ley

Antes de escribir una línea de código, el componente debe cumplir:
- Tokens de color y superficies (sin hex hardcodeado)
- Tipografía dual (Inter / JetBrains Mono) por contexto
- Grid & spacing (unidad base 4px)
- Depth Architecture (Deep Space / Laboratory Canvas / Surface)
- Brackets como operadores ({} como estructura, no adorno)
- AI Ghost para features de IA (bordes/gradientes/estados)

**Regla de aceptación:** si el componente “se ve correcto” pero rompe el sistema (ej. sombras arbitrarias, spacing fuera de grid, color directo), se rechaza.

---

## 3) Taxonomía oficial de componentes (para evitar caos)

Todo componente debe pertenecer a una categoría (y solo una):
- **Foundations:** tokens, typography, surfaces, spacing helpers.
- **Primitives:** Button, Badge, Input, Tooltip…
- **Composites:** DataTable, KanbanBoard, FiltersPanel…
- **Layouts:** PageShell, SidebarLayout, SplitPane…
- **Patterns:** Threading, Timeline, AI Ghost blocks…
- **Pages:** solo si es una pantalla completa reutilizable.

**Prohibido:** “componentes híbridos” sin categoría. Si mezcla demasiadas responsabilidades → se divide.

---

## 4) Proceso end-to-end (pipeline oficial)

### 4.1 Fase D0 — Diseño (Definition of Ready)
Un componente entra a desarrollo solo si tiene su Checklist D0 completo:
- Anatomía definida (slots / regiones / jerarquía)
- Estados definidos (incluye empty/loading/error)
- Responsive definido (al menos 2 breakpoints si aplica)
- A11y definido (teclado + focus + roles)
- Tokens mapeados (no colores “visuales”, sino roles)
- Motion definido (duración + easing)
- Densidad definida (high density vs low density si aplica)
- Uso de {} y patrones LoopDev si aplica

### 4.2 Fase B1 — Ensamblaje (Implementation Standard)
- Brain/Body separado (MVVM)
- Zero hardcoding de hex (ni uno)
- Soporta dark y light
- Example.tsx demuestra override de marca
- Fixtures tipados (sin mocks improvisados)
- README con API, props, estados y notas para LLM (Fase AI)
- Metadata indexer block en archivo raíz
- A11y mínimo: keyboard navigation + focus visible + labels

### 4.3 Fase C1 — Revisión (Governance & Indexing)
- Pasa auditoría automática (Architect) sin violaciones críticas
- No inline styles (style={{…}}) excepto casos aprobados
- No accesos globales (window/document) sin guards
- No dependencias ocultas (CSS global, assets no declarados)
- Metadata completa: @component, @description, @category
- API estable + tipado estricto
- Compatibilidad multitenant verificada

### 4.4 Fase S1 — Publicación a SaaS (Release)
- Se asigna versión (semver)
- Se registra en el índice del SaaS
- Se incluyen notas de release
- Se etiqueta compatibilidad (tenants / themes)

---

## 5) Estructura estándar del componente (carpeta autocontenida)

Ubicación recomendada: `components/functional/<ComponentName>/`

- `index.tsx` → **The Body** (JSX + composición, sin lógica compleja)
- `use<ComponentName>.ts` → **The Brain** (estado, efectos, handlers)
- `components.tsx` → subcomponentes internos (solo uso local)
- `types.ts` → contratos TypeScript (exportados si aplica)
- `utils.ts` → helpers puros (sin side-effects)
- `fixtures.ts` → datos mock tipados
- `Example.tsx` → demo local tipo story + pruebas de overrides
- `README.md` → documentación técnica + contexto AI
- `(opcional) styles.css` → solo si es CSS module/local y justificado

---

## 6) Contrato de metadata (Indexer Ready)

Cada archivo raíz público (normalmente index.tsx) debe abrir con:

```tsx
/**
 * @component ComponentName
 * @description Breve explicación de qué hace y cuándo usarlo
 * @category Primitives | Composites | Layouts | Patterns | Pages
 * @status stable | beta | experimental
 */
```

---

## 7) Tokens y multitenancy

- Prohibición total de Hex en JSX/CSS.
- Fuente de verdad: Tokens LoopDev + Overrides locales por componente (--comp-prefix).

### 7.1 Mapeo de Tokens Semánticos Oficiales (v1.0)
Todo diseño y ensamblaje debe usar exclusivamente estos roles:

| Token Semántico | Color Hex | Propósito |
| :--- | :--- | :--- |
| `primary` | `#135BEC` | Botones principales, enlaces, branding activo. |
| `primary-dark` | `#0B46BE` | Estados hover de elementos primarios. |
| `energy` | `#FFD025` | Highlights técnicos, alertas, puntos de estado IA. |
| `background-light`| `#F8F9FC` | Fondo base de aplicaciones en modo claro. |
| `background-dark` | `#0F1115` | Fondo base de aplicaciones en modo oscuro. |
| `surface-dark` | `#181B21` | Tarjetas y paneles sobre el fondo oscuro. |
| `border-dark` | `#2D3442` | Líneas de división y bordes en modo oscuro. |
| `text-main` | `#0F172A` | Texto principal en modo claro / Títulos. |
| `text-muted` | `#64748B` | Texto secundario, descripciones o captions. |

---

## 8) Brain vs Body (MVVM LoopDev)

### 8.1 Objetivo
Testear y mantener el componente sin que la UI esconda estado.
- **Brain (useX):** estado + handlers + side-effects controlados.
- **Body (index):** render + composición + wiring de handlers.
- **components.tsx:** piezas presentacionales (pure UI).

### 8.2 Reglas
- El Brain retorna un ViewModel (estado derivado + callbacks).
- El Body no calcula reglas complejas: solo “consume ViewModel”.

---

## 9) Accesibilidad (A11y) como estándar de salida

Bloqueante para SaaS (mínimo):
- Navegación por teclado completa
- Focus visible y consistente
- Roles correctos (buttons, dialogs, menus, lists)
- Labels accesibles (aria-label, aria-labelledby)
- Contraste suficiente (especialmente en dark mode)
- Estados disabled y loading comunicados

---

## 10) Estados obligatorios y comportamiento consistente

Todo componente debe contemplar: default, hover/active, focus, disabled, loading, empty, error.
**Regla crítica:** Los estados no se “inventan” en QA. Se definen en Diseño (D0).

---

## 11) Motion: “Loop Momentum”

- **hover:** ~150ms
- **overlays/drawers:** ~300ms
- **AI gradients:** 3s–8s (loop continuo)
- **Curvas:** `cubic-bezier(0.25, 0.1, 0.25, 1.0)` (base)

---

## 12) Iconografía, tipografía, assets

- **Iconos:** lucide-react o Material Symbols Outlined (solo).
- **Fuentes:** font-sans (Inter) y font-mono (JetBrains Mono).
- **SVGs:** Prohibido inline SVGs gigantes (usar assets).

---

## 13) IA: estándar “AI Augmentation” (Fase 3)

El README debe incluir:
- Intención del componente (para qué existe).
- Props principales y ejemplos.
- “Prompt context” (cómo describirlo para herramientas/LLMs).
- Fixtures representativos (realistas).

---

## 14) Testing mínimo (no negociable)

- **Primitives:** render básico + interacción base (click/focus).
- **Composites:** al menos 1 test de comportamiento (state -> UI).
- **Layouts:** test smoke + routing/slots.

---

## 15) Excepciones

Cualquier excepción requiere comentario en código con razón + alternativa intentada + ticket de seguimiento.

---

## 16) Checklists finales (para pegar en PR)

### 16.1 Checklist de Ensamblaje (B1)
- [ ] Carpeta autocontenida con estructura SSOT
- [ ] Brain/Body separado
- [ ] Example.tsx con override de marca
- [ ] Fixtures.ts tipado y útil
- [ ] README completo (API + estados + notas IA)
- [ ] Dark/light ok
- [ ] A11y mínimo ok

### 16.2 Checklist de Migración SaaS (C1)
- [ ] Metadata indexer completa
- [ ] Taxonomía correcta
- [ ] Auditoría Architect sin críticos
- [ ] API estable + tipos estrictos
- [ ] Override multitenant validado

---

## 17) Convenciones de nombres y exports

- **Carpeta y export principal:** ComponentName (PascalCase)
- **Hook:** useComponentName
- **Subcomponentes:** ComponentNamePart
- **Tipos:** ComponentNameProps

---

## 18) Definición de “Done” (DoD)

- **Done (Assembly):** cumple B1 + demo + fixtures + README.
- **Done (SaaS-ready):** cumple B1 + C1 + tests + versionado.
- **Done (Stable):** adopción real + cero violaciones + docs maduras.

---

## 19) Apéndice: unificación de guías previas

Este protocolo sustituye y unifica: Portabilidad + Atomic Loop, Visual Composition v3.7, LoopDev Ready Standard y AI Augmentation.

---

## 20) Plantillas (recomendadas)

### 20.1 Plantilla README (mínima)
- Qué es / cuándo usarlo
- API (props + tipos)
- Estados (loading/empty/error)
- Theming / Overrides
- Notas IA

### 20.2 Plantilla Example.tsx (mínima)
- Render default con fixtures
- Render con overrides de marca
- Toggle de estados (loading/empty/error)