# IdentityBar (Marcador de Identidad)

El `IdentityBar` es un átomo de señalización visual mínima. Se utiliza para inyectar el color de la suite activa en headers, sidebars o elementos de navegación sin interrumpir la jerarquía tipográfica.

## Características
- **Versatilidad de Orientación:** Soporte nativo para vertical (marcadores laterales) y horizontal (indicadores de estado).
- **ADN LoopDev:** Bordes redondeados (`rounded-full`) y precisión milimétrica.
- **Dynamic Theming:** Capacidad para recibir colores dinámicos desde la base de datos del Tenant.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `color` | `string` | `primary` | Color de la barra (token o hex). |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Disposición de la barra. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Escala industrial. |
| `withGlow` | `boolean` | `false` | Activa un resplandor técnico sutil. |

## Uso
```tsx
import { IdentityBar } from '@loopdev/ui';

// Marcador lateral de Sidebar
<IdentityBar color="var(--lpd-color-accent-marketing)" size="md" />

// Indicador horizontal
<IdentityBar orientation="horizontal" size="sm" />
```
