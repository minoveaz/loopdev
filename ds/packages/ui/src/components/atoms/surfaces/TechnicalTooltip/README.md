# TechnicalTooltip (Información de Precisión)

El `TechnicalTooltip` sustituye al atributo `title` nativo, proporcionando una interfaz de información alineada con la estética de ingeniería de LoopDev OS. Su diseño imita una mini-terminal con brackets de color azul.

## Características
- **Accesibilidad Enterprise:** Implementado sobre **Radix UI**, garantizando cumplimiento WAI-ARIA.
- **ADN LoopDev:** Uso de brackets `{ }` en color `primary-light` para envolver los metadatos.
- **Contexto Inmune:** El tooltip es siempre oscuro para mantener la autoridad visual independientemente del tema de la aplicación.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `content` | `ReactNode` | **Obligatorio** | Texto o JSX a mostrar. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Lado de aparición. |
| `delayDuration` | `number` | `200` | Tiempo de espera en ms. |

## Uso
```tsx
import { TechnicalTooltip } from '@loopdev/ui';

<TechnicalTooltip content="Configuración de Sistema">
  <button>Icono</button>
</TechnicalTooltip>
```
