# StatusPulse (Telemetría Visual)

El `StatusPulse` es la unidad mínima de actividad en LoopDev OS. Proporciona feedback visual sobre la salud del sistema y el contexto activo mediante animaciones de pulso y resplandores técnicos (Glow).

## Características
- **Identidad LoopDev:** Uso del pulso Amarillo Energía para indicar el Momentum.
- **Zero Hardcoding:** Basado en tokens semánticos y variables CSS.
- **Accesibilidad:** Soporta `prefers-reduced-motion`.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `variant` | `'success' \| 'energy' \| 'danger' \| 'primary' \| 'info'` | `'success'` | Significado semántico del punto. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Tamaño industrial. |
| `isAnimated` | `boolean` | `true` | Activa el efecto de pulso. |

## Uso
```tsx
import { StatusPulse } from '@loopdev/ui';

// Indicador operativo
<StatusPulse variant="success" />

// Indicador de contexto activo (Momentum)
<StatusPulse variant="energy" size="sm" />
```
