# SidebarFooter (Consola de Control)

El `SidebarFooter` es el bloque de cierre semántico oficial para los paneles laterales de LoopDev OS. Integra la identidad personal del usuario con los controles de nivel de plataforma (Configuración, Colapso).

## Características
- **Arquitectura Dual:** Adapta su layout de horizontal a vertical automáticamente según el estado del sidebar.
- **Consola Técnica:** Agrupa botones de control en un contenedor de cristal unificado.
- **Identidad:** Integración nativa con `UserAvatar` y `TechnicalLabel`.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `userName` | `string` | Nombre para el avatar y etiqueta. |
| `userRole` | `string` | Descripción del rol (ej: Tenant_Admin). |
| `isRail` | `boolean` | Alterna el modo compacto. |
| `onToggleRail` | `function` | Handler para el botón de colapso. |
| `onSettingsClick` | `function` | Handler para ajustes. |

## Uso
```tsx
import { SidebarFooter } from '@loopdev/ui';

<SidebarFooter
  userName="Miller Vega"
  userRole="Platform Architect"
  onToggleRail={() => toggle()}
/>
```
