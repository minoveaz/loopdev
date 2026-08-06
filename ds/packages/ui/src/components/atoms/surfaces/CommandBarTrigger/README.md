# CommandBarTrigger (Disparador de Comandos)

El `CommandBarTrigger` es el átomo central del `SuiteHeader`. Actúa como un "falso input" que invoca la paleta de comandos global de LoopDev OS, siendo el principal acelerador de productividad para el usuario experto.

## Características
- **Dualidad de Modo:** Se renderiza como un input con placeholder y atajo, o como un simple icono de búsqueda en layouts compactos.
- **Feedback Técnico:** Incluye un badge estilizado con fuente mono para el atajo de teclado, reforzando la estética de "consola".
- **Accesibilidad:** Diseñado para ser activado por clic o por el atajo de teclado `⌘K`.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `placeholder` | `string` | "Search or type..." | Texto del input falso. |
| `shortcut` | `string` | `"⌘K"` | Atajo a mostrar en el badge. |
| `mode` | `'full' \| 'icon'` | `'full'` | Controla la degradación visual. |
| `onOpen` | `function` | **Obligatorio** | Callback que abre la paleta de comandos. |

## Uso
```tsx
import { CommandBarTrigger } from '@loopdev/ui';

// Modo por defecto
<CommandBarTrigger onOpen={() => openPalette()} />

// Modo icono para layouts compactos
<CommandBarTrigger mode="icon" onOpen={() => openPalette()} />
```
