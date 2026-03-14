# ThemeToggle (Selector de Tema)

El `ThemeToggle` es el componente oficial de LoopDev para alternar entre el modo claro y oscuro. Utiliza una estética de "cristal técnico" para alinearse con el estándar visual v3.8.

## Características
- **Zero Hardcoding:** Basado íntegramente en variables CSS y tokens de Tailwind.
- **Micro-animaciones:** Transiciones suaves de rotación y escalado entre iconos.
- **Modos:**
  - `technical`: Estilo con bordes definidos y fondo de cristal (recomendado para headers).
  - `standard`: Estilo minimalista sin bordes.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `variant` | `'technical' \| 'standard'` | `'technical'` | Define la estética del botón. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Escala industrial del componente. |

## Uso
```tsx
import { ThemeToggle } from '@loopdev/ui';

<ThemeToggle variant="technical" size="md" />
```

## Cumplimiento Bloque 0
- [x] Acentos en azul primary en hover.
- [x] Base de cristal (Surface Soul).
- [x] Iconografía nítida (Lucide).
