# NavSidebarItem (Controlador Modular)

El `NavSidebarItem` es el átomo oficial de navegación para el sidebar de LoopDev OS. Gestiona la identidad de los módulos, el gobierno de acceso y proporciona feedback de contexto mediante el sistema de Momentum.

## Características
- **Dualidad Estética:** Soporte nativo para modo expandido y modo Rail (56px).
- **Indicadores de Momentum:** Integra el `StatusPulse` amarillo para el foco activo.
- **Jerarquía de Gobierno:** Diferenciación visual entre módulos habilitados, bloqueados y en desarrollo.
- **Accesibilidad:** Cumple con estándares de navegación por teclado y roles ARIA.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `icon` | `string` | Nombre del icono Lucide. |
| `label` | `string` | Nombre del módulo. |
| `status` | `'enabled' \| 'disabled' \| 'coming-soon'` | Estado de acceso. |
| `isActive` | `boolean` | Define si es el contexto actual. |
| `isRail` | `boolean` | Activa el modo compacto. |
| `accentColor` | `string` | Color de la barra de acento lateral. |

## Uso
```tsx
import { NavSidebarItem } from '@loopdev/ui';

<NavSidebarItem
  icon="Sparkles"
  label="Content Engine"
  status="enabled"
  isActive={true}
  onNavigate={(route) => console.log(route)}
/>
```
