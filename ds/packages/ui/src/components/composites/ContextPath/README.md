# ContextPath (Orientación Técnica)

El `ContextPath` es el dispositivo oficial de LoopDev OS para mostrar la ubicación jerárquica del usuario. A diferencia de un breadcrumb tradicional, está diseñado para manejar rutas profundas mediante un algoritmo de colapso inteligente y una estética de terminal.

## Características
- **Colapso Progresivo:** Trunca automáticamente los niveles intermedios si superan el límite de visibilidad.
- **Autoridad Visual:** El último segmento (ubicación actual) destaca en peso y color.
- **Interactividad de Retorno:** Permite saltar rápidamente a niveles superiores.

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `segments` | `PathSegment[]` | **Obligatorio** | Array de niveles de la ruta. |
| `maxVisible` | `number` | `3` | Límite de ítems antes de colapsar. |
| `separator` | `'slash' \| 'chevron'` | `'slash'` | Estilo del divisor. |
| `onNavigate` | `function` | - | Callback de navegación. |

## Uso
```tsx
import { ContextPath } from '@loopdev/ui';

const segments = [
  { id: 'ms', label: 'Marketing Studio', href: '/marketing' },
  { id: 'bh', label: 'Brand Hub', href: '/marketing/brands' },
  { id: 'logos', label: 'Logotipos', isActive: true }
];

<ContextPath segments={segments} />
```
