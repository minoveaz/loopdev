# SystemStatus (Salud del Sistema)

El componente `SystemStatus` es un átomo de monitoreo que comunica la estabilidad de la plataforma y el contexto de sesión del usuario.

## Características
- **Feedback Vivo:** Indicador circular con animación de pulso.
- **ADN LoopDev:** Uso estricto de brackets `{ }` amarillos para IDs técnicos.
- **Multitenant Ready:** Basado en tokens semánticos de modo claro y oscuro.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `state` | `SystemStatusState` | `'operational'` | Salud de los servicios (`operational`, `degraded`, `outage`). |
| `id` | `string` | - | Identificador técnico a mostrar. |
| `label` | `string` | `'ID'` | Etiqueta que acompaña al identificador. |

## Uso
```tsx
import { SystemStatus } from '@loopdev/ui';

<SystemStatus state="operational" id="USR-12345" label="SESSION" />
```

## Cumplimiento Bloque 0
- [x] Trinidad cromática (Verde/Amarillo/Rojo).
- [x] Sintaxis de brackets `{ }` para IDs.
- [x] Tipografía dual (Inter/Mono).
