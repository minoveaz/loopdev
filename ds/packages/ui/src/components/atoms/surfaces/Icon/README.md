# Icon (Foundation)

/**
 * @component Icon
 * @description Wrapper universal para la iconografía del ecosistema LoopDev.
 * @category Foundations
 * @status stable
 */

Wrapper universal para la iconografía de `loop.dev`. Este componente garantiza que toda la iconografía respete la grilla base de 4px y utilice los pesos de renderizado correctos.

## 🏛️ Gobernanza y Registro
Para evitar la **deriva sistémica de iconografía**, no se deben importar glifos arbitrarios. Todos los iconos utilizados en producción deben estar declarados en el `IconRegistry`. 

Si necesitas un nuevo icono:
1. Verifica su disponibilidad en **Material Symbols Outlined**.
2. Regístralo en `@loopdev/ui/atoms/IconRegistry`.
3. Consúmelo mediante este componente.

## 🤖 AI Prompt Context
- **Intent:** Component for rendering consistent technical and UI icons.
- **Grids:** Mapped to 4px base (sm:12px, md:16px, lg:20px, xl:24px).
- **Accessibility:** Uses `aria-label` for semantic meaning when no label is present.

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Required** | Registered glyph name. |
| `size` | `sm \| md \| lg \| xl` | `md` | Semantic size scale. |
| `variant` | `standard \| boxed` | `standard` | Standard glyph or Lab-style boxed icon. |
| `color` | `string` | `currentColor` | CSS variable or hex. |

## 🚀 Usage
```tsx
import { Icon } from '@loopdev/ui';

<Icon name="bolt" size="lg" color="var(--lpd-color-brand-energy)" />
```