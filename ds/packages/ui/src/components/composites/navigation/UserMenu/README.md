# UserMenu (Gestión de Sesión)

El `UserMenu` es el compuesto oficial para la Cápsula Derecha del Header. Proporciona acceso a la identidad del usuario, su rol técnico y las acciones de cuenta principales (Ajustes, Perfil, Logout).

## Características
- **Conciencia de Rol:** Muestra el rol del usuario encapsulado en brackets técnicos `{ }`.
- **Acciones Críticas:** Diferenciación visual para el cierre de sesión mediante el estándar `danger`.
- **Integración de Avatar:** Utiliza el átomo `UserAvatar` para mostrar la presencia en tiempo real.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `userName` | `string` | Nombre para visualización y avatar. |
| `userEmail` | `string` | Identificador único del usuario. |
| `userRole` | `string` | Rol técnico (ej: ADMIN). |
| `onLogout` | `function` | Acción de desconexión. |

## Uso
```tsx
import { UserMenu } from '@loopdev/ui';

<UserMenu
  userName="Miller Vega"
  userEmail="miller@loop.dev"
  userRole="Admin"
  onLogout={() => auth.signOut()}
/>
```
