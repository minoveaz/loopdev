# UserAvatar (Identidad de Usuario)

El `UserAvatar` es el componente oficial para representar a los usuarios dentro de LoopDev OS. Está diseñado para ofrecer una transición fluida entre fotos reales, iniciales técnicas e iconos de respaldo.

## Características
- **Prioridad de Render:** Imagen > Iniciales > Icono de Usuario.
- **ADN LoopDev:** Fondo con gradiente de sistema y bordes técnicos de precisión.
- **Presencia:** Integración nativa con `StatusPulse` para mostrar telemetría de usuario.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `src` | `string` | - | URL de la imagen de perfil. |
| `name` | `string` | - | Nombre para generar iniciales automáticamente. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Escala industrial. |
| `withStatus` | `boolean` | `false` | Muestra el punto de pulso de presencia. |
| `status` | `'online' \| 'busy' \| 'away'` | `'online'` | Color del punto de pulso. |

## Uso
```tsx
import { UserAvatar } from '@loopdev/ui';

// Con iniciales y presencia
<UserAvatar name="Miller Vega" size="md" withStatus />

// Con imagen
<UserAvatar src="https://..." size="lg" />
```
