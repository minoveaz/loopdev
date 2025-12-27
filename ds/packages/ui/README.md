# @loopdev/ui

UI Core package for Loop.dev monorepo.

## Objetivo
Componentes reutilizables (ej: Button) y helpers (cn, cva) para todos los proyectos.

## Estructura
- `src/helpers/cn.ts`: Concatenador de clases.
- `src/helpers/cva.ts`: Helper para variantes de clases.
- `src/Button.tsx`: Primer componente Button.
- `src/index.ts`: Exporta los componentes principales.

## Uso
Importa el Button y úsalo en cualquier app del monorepo:

```tsx
import { Button } from '@loopdev/ui';

<Button variant="secondary" size="lg">Click me</Button>
```

## Roadmap
- Más componentes (Input, Card, etc.)
- Integración con shadcn y Radix UI
