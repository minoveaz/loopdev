# Definition of Done — Component (Approved)

Un componente puede pasar a estado **Approved** solo si cumple:

## Implementación
- Existe en `packages/ui`
- Exportado desde `packages/ui/src/components/index.ts`
- Variantes definidas con `cva` (o equivalente)
- No hay hardcodes de color/typography/spacing (solo tokens via Tailwind preset)

## Documentación (SoT)
- Tiene doc en `/docs/design-system/components/<component>.md`
- Está listado en `/docs/design-system/components.index.md`
- Incluye: propósito, cuándo usar/no, variantes, estados, a11y, API, ejemplos

## Storybook (ejecutable)
- Tiene stories para:
  - variantes principales
  - tamaños (si aplica)
  - estados (disabled/loading/error si aplica)
  - casos con icono/slot (si aplica)

## Accesibilidad (mínimo)
- Focus visible correcto
- Navegación por teclado funcional
- Semántica HTML correcta (`button`, `a`, `input`, etc.)
- Labels/aria donde aplique

## Calidad técnica
- API consistente con el sistema
- Sin duplicación innecesaria
- Dependencias justificadas

## Estado final
- `Estado: Approved` en la doc del componente
