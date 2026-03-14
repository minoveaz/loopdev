# SuiteSwitcher (Portal de Contexto Global)

El `SuiteSwitcher` es el componente maestro de navegación de alto nivel en LoopDev OS. Permite al usuario alternar entre las diferentes suites empresariales manteniendo la coherencia visual y respetando las reglas de gobernanza del tenant.

## Características
- **Identidad Dinámica:** Muestra automáticamente el isotipo y nombre de la suite activa.
- **Gobernanza de Acceso:** Refleja en tiempo real las suites contratadas mediante el `accessMap`.
- **Navegación de Retorno:** Incluye un acceso directo al Launchpad global.
- **Accesibilidad:** Construido sobre Radix UI para un cumplimiento total de WAI-ARIA.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `currentSuite` | `SuiteIdentity` | Datos de la suite activa actualmente. |
| `availableSuites` | `SuiteIdentity[]` | Lista completa de suites a mostrar en el menú. |
| `accessMap` | `AccessMap` | Diccionario de permisos (`enabled`, `disabled`). |
| `onSuiteChange` | `function` | Callback disparado al seleccionar una nueva suite. |

## Uso
```tsx
import { SuiteSwitcher } from '@loopdev/ui';

<SuiteSwitcher
  currentSuite={marketingIdentity}
  availableSuites={[marketing, crm, finance]}
  onSuiteChange={(id) => navigateToSuite(id)}
/>
```
