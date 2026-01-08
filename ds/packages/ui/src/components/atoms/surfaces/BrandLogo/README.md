# BrandLogo (Identidad de Marca)

El componente `BrandLogo` es el átomo fundamental que encapsula la identidad visual de LoopDev. Está diseñado bajo el principio de **Autoridad Técnica** y utiliza el sistema de brackets `{ }` para denotar precisión algorítmica.

## Anatomía
- **Isotipo:** Cuadro azul sólido con el glifo `all_inclusive` (infinito). Incluye una textura técnica de micro-grilla.
- **Logotipo:** Texto `loop.dev` en Inter Black con brackets en Energy Yellow.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `variant` | `full` \| `isotype` \| `logotype` | `full` | Define qué partes del logo mostrar. |
| `size` | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | Escala industrial del componente. |
| `colorMode` | `light` \| `dark` | - | Forzar un tema (por defecto es reactivo). |

## Uso Básico
```tsx
import { BrandLogo } from '@loopdev/ui';

// Para el Launchpad
<BrandLogo variant="full" size="lg" />

// Para el Sidebar
<BrandLogo variant="full" size="sm" />
```

## Cumplimiento Bloque 0
- [x] Trinidad cromática (Azul/Amarillo).
- [x] Sintaxis de brackets `{ }`.
- [x] Technical Canvas (Micro-grilla en isotipo).
- [x] Surface Soul (Profundidad y bordes técnicos).
