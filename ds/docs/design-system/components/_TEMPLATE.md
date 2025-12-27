# [COMP-XXX] Nombre del componente

## 0) Snapshot
- **ID:** COMP-XXX
- **Nivel:** Primitive | Composite | Pattern
- **Estado:** Draft | Approved | Deprecated
- **Owners:** Design=@  | Tech=@
- **Alcance:** Global | Cliente-X | Proyecto-X
- **Aplica en:** (journeys / tipos de páginas / productos)
- **Figma:** (link)
- **Storybook:** (link)
- **Código:** packages/ui/src/components/<...>

## 1) Objetivo
Qué problema resuelve, qué garantiza, qué NO intenta cubrir.

## 2) Cuándo usar / cuándo NO usar
### ✅ Usar cuando
- …

### ❌ No usar cuando
- …

### Alternativas
- …

## 3) Anatomía
Partes/slots del componente:
- Root
- Label (opcional)
- Icon (opcional)
- etc.

## 4) Variantes
Lista o tabla de variantes (alineadas con `cva`):
- `variant`: primary | secondary | ghost | …
- `size`: sm | md | lg | …
- `tone`: default | danger | success | … (si aplica)

## 5) Estados
- Default
- Hover / Focus / Active
- Disabled
- Loading (si aplica)
- Error/Invalid (si aplica)

## 6) Comportamiento
- Reglas de interacción (teclado, click, submit, navegación)
- Reglas de jerarquía (ej: solo 1 primary CTA por vista, si aplica)

## 7) Accesibilidad (A11y)
- Semántica (button/a)
- Focus visible
- Teclado
- ARIA (si aplica)
- Contraste (vía tokens)

## 8) Reglas de contenido (si aplica)
- Longitud recomendada de label
- Iconografía permitida
- Idiomas (si aplica)

## 9) Responsive
- Comportamiento en mobile/tablet/desktop
- Reglas de wrapping/stacking

## 10) API (React)
### Props
- `variant?: ...`
- `size?: ...`
- `loading?: boolean`
- `disabled?: boolean`
- `asChild?: boolean` (si usas Slot)
- …

### Eventos (si aplica)
- `onClick`
- Tracking/data attributes

## 11) Dependencias
- Tokens usados
- Componentes que compone
- Radix/shadcn (si aplica)

## 12) Ejemplos
### Ejemplo mínimo
### Ejemplos por contexto
- Proyecto A: …
- Proyecto B: …
- Edge cases: …

## 13) Notas y decisiones
- Decisiones de diseño
- Trade-offs
- Backwards compatibility
