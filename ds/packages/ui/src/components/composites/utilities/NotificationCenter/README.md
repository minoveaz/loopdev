# NotificationCenter (Centro de Alertas)

El `NotificationCenter` es el componente oficial de LoopDev OS para la gestión rápida de notificaciones. Proporciona una señal visual inmediata mediante badges y un resumen contextual a través de un popover técnico.

## Características
- **Badge Inteligente:** Muestra el conteo de no leídas con truncamiento automático (+99).
- **Semántica de Alerta:** Diferenciación por colores (Rojo, Amarillo, Azul) según la gravedad.
- **ADN v3.9:** Marcas temporales envueltas en brackets azules.
- **Acceso a Historial:** Botón integrado para navegar al detalle completo.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `notifications` | `NotificationItem[]` | Array de objetos de notificación. |
| `unreadCount` | `number` | Contador de alertas no leídas. |
| `onViewAll` | `function` | Acción para ver el historial completo. |

## Uso
```tsx
import { NotificationCenter } from '@loopdev/ui';

<NotificationCenter
  notifications={myNotifications}
  unreadCount={5}
  onViewAll={() => router.push('/notifications')}
/>
```
