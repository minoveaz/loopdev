# TechnicalLabel (Etiqueta de Autoridad)

El `TechnicalLabel` es el átomo oficial para mostrar micro-metadatos, nombres de grupos y etiquetas de sistema. Su diseño prioriza la autoridad visual mediante el uso de pesos extremos (`black`) y espaciados extendidos (`tracking-0.3em`).

## Características
- **Precisión Micro:** Optimizado para el tamaño `nano` (8px).
- **ADN LoopDev:** Implementación estricta de la tipografía dual Inter/Mono para metadatos.
- **Versatilidad Semántica:** Variantes para estados activos, mutados o sutiles.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'muted' \| 'subtle'` | `'muted'` | Estilo de color. |
| `size` | `'nano' \| 'xs'` | `'nano'` | Escala industrial. |
| `isUppercase` | `boolean` | `true` | Transforma el texto a mayúsculas. |
| `isWide` | `boolean` | `true` | Aplica tracking extendido. |

## Uso
```tsx
import { TechnicalLabel } from '@loopdev/ui';

// Etiqueta de grupo de navegación
<TechnicalLabel variant="muted">Operaciones Core</TechnicalLabel>

// Etiqueta de estatus destacada
<TechnicalLabel variant="primary" size="xs">Live</TechnicalLabel>
```
