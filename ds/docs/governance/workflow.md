# Workflow — How we add/update components

Este flujo aplica a cualquier componente/tokens/patrón del sistema compartido.

## Principios
- **No inventar:** si no existe en la librería, se propone (Request) antes de crear.
- **Preferir variantes:** antes de crear nuevos componentes, evaluar si basta con una variante.
- **SoT + Ejecución:** Markdown define reglas; Storybook muestra la implementación real.

## Roles (mínimos)
- **Owner Design:** valida intención, variantes, jerarquía, uso correcto.
- **Owner Tech:** valida API, consistencia, tokens, accesibilidad y mantenibilidad.
- (Opcional) **Content/SEO:** valida reglas de copy si el componente las afecta.

## Flujo (end-to-end)
### 1) Request
Se crea un issue “Component Request” con:
- objetivo
- contextos donde se usará (proyectos/clientes)
- variantes necesarias
- estados necesarios
- notas de accesibilidad
- referencia visual (Figma o screenshot)

### 2) Spec (mínimo)
Se define:
- `ID` del componente (COMP-XXX)
- nivel: Primitive | Composite | Pattern
- tokens que usará (sin hardcodes)
- API esperada (props)

### 3) Implement
En `packages/ui`:
- componente con `cva` para variantes
- uso de tokens (via Tailwind preset + CSS vars)
- stories en Storybook (estados/variantes)

### 4) Document
Se crea/actualiza doc en:
- `/docs/design-system/components/<component>.md`
y se añade al índice:
- `/docs/design-system/components.index.md`

### 5) Review (gate)
Checklist:
- variantes correctas y mínimas
- no hay hardcodes
- a11y base ok (focus, teclado, labels)
- stories cubren estados
- doc completa y consistente

### 6) Release
- changeset (semver)
- publish del paquete `@tuempresa/ui` (si aplica)
- deploy Storybook (si aplica)

## Regla de compatibilidad
Cambios “breaking” deben:
- estar marcados como `BREAKING`
- incluir guía de migración
- bump de versión mayor
