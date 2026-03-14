# ExitHatch (Navegación de Retorno)

El `ExitHatch` es un átomo especializado para permitir la salida de un contexto operativo (Suite) hacia el nivel superior (OS/Launchpad). Su diseño prioriza la claridad y el minimalismo para no competir con los módulos de trabajo.

## Características
- **Feedback de Retroceso:** Animación sutil de desplazamiento a la izquierda en hover.
- **Modo Rail:** Centrado automático del icono en espacios de 56px.
- **Tipografía OS:** Uso del estándar `nano black` para etiquetas de sistema.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `label` | `string` | **Obligatorio** | Texto descriptivo (ej: "Back to OS"). |
| `icon` | `string` | `'ArrowLeft'` | Icono de Lucide para la acción. |
| `isRail` | `boolean` | `false` | Activa el modo compacto. |
| `onClick` | `function` | **Obligatorio** | Acción a ejecutar. |

## Uso
```tsx
import { ExitHatch } from '@loopdev/ui';

<ExitHatch 
  label="Back to OS" 
  icon="ArrowLeft" 
  onClick={() => console.log('Exit')} 
/>
```
