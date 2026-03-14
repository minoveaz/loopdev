# SuiteSidebar (Context Controller)

El `SuiteSidebar` es el componente maestro de navegación para las suites de LoopDev OS. Actúa como un dispositivo de orientación cognitiva que permite al usuario alternar entre módulos manteniendo el foco en el contexto de la suite activa.

## Características
- **Arquitectura de Chasis:** Diseñado para ser inyectado en el `navSlot` del `AppShell`.
- **Modos de Densidad:** Soporte nativo para modo expandido y modo Rail (56px).
- **ADN LoopDev:** Incluye el punto de pulso en Amarillo Energía para denotar el contexto vivo.
- **Multitenant Ready:** Procesa un mapa de acceso para ocultar o bloquear módulos según permisos.

## Estructura de Datos
El componente se alimenta del `NavigationSchema` definido en el paquete de contratos.

```tsx
import { SuiteSidebar, marketingStudioSchema } from '@loopdev/ui';

<SuiteSidebar
  schema={marketingStudioSchema}
  navMode="expanded"
  activeModuleId="brand-hub"
  accessMap={{ 'brand-hub': 'enabled', 'content-engine': 'disabled' }}
  onExitToOS={() => router.push('/launchpad')}
  onNavigate={(route) => router.push(route.routeId)}
  onToggleNavMode={() => setNavMode('rail')}
/>
```

## Propiedades (API)
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `schema` | `NavigationSchema` | Definición de identidad, grupos y módulos. |
| `navMode` | `'expanded' \| 'rail'` | Densidad visual del sidebar. |
| `activeModuleId` | `string` | ID del módulo que tendrá el indicador de actividad. |
| `accessMap` | `AccessMap` | Diccionario de permisos (`enabled`, `disabled`, `hidden`). |
| `telemetry` | `TelemetryMap` | Mapa de badges para notificaciones. |
| `onExitToOS` | `function` | Acción del botón "Back to OS". |

## Estándares Visuales (v3.8)
- **Superficie:** Usa `TechnicalSurface` variante `canvas`.
- **Separadores:** Líneas de 0.5px con opacidad del 50%.
- **Iconografía:** Lucide React (vectorial puro).
