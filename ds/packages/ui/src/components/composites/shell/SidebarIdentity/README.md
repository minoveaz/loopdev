# SidebarIdentity (Cabecera de Contexto)

El `SidebarIdentity` es el componente oficial para la parte superior de los paneles laterales en LoopDev OS. Unifica la identidad visual de la suite con una señal de orientación de color dinámica.

## Características
- **Dualidad de Densidad:** En modo expandido muestra Logo + Nombre + Barra de Acento. En modo Rail muestra solo el Isotipo centrado.
- **Acción Integrada:** Permite inyectar un callback de navegación (ej: volver al home de la suite).
- **ADN Técnico:** Integra los átomos `IdentityBar` y `TechnicalLabel` para mantener el estándar visual v3.8.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `logo` | `ReactNode` | Isotipo o Logo completo. |
| `name` | `string` | Nombre del contexto (ej: Marketing Studio). |
| `accentColor` | `string` | Color de la barra lateral de orientación. |
| `isRail` | `boolean` | Alterna el modo compacto. |
| `onClick` | `function` | Acción disparada al pulsar la identidad. |

## Uso
```tsx
import { SidebarIdentity, BrandLogo } from '@loopdev/ui';

<SidebarIdentity
  logo={<BrandLogo size="sm" />}
  name="Marketing Studio"
  accentColor="var(--lpd-color-brand-primary)"
  isRail={false}
  onClick={() => router.push('/marketing')}
/>
```
