# TechnicalMenuItem (Unidad Operativa de Menú)

El `TechnicalMenuItem` es el átomo base para cualquier entrada interactiva dentro de los menús desplegables de LoopDev OS. Provee una estructura fija de `Icono + Label + Atajo` con feedback visual industrial.

## Características
- **Variante de Peligro:** Soporte para acciones destructivas (`variant="danger"`).
- **Hints de Atajos:** Integración con `TechnicalLabel` para mostrar comandos de teclado.
- **Estado de Gobierno:** Maneja automáticamente opacidades y bloqueos mediante `isDisabled`.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `icon` | `string` | Nombre del icono de Lucide. |
| `label` | `string` | Texto de la acción. |
| `shortcut` | `string` | Texto del atajo (ej: ⌘P). |
| `variant` | `'default' \| 'danger'` | Semántica de la acción. |
| `isActive` | `boolean` | Marca el ítem como seleccionado. |

## Uso
```tsx
import { TechnicalMenuItem } from '@loopdev/ui';

<TechnicalMenuItem 
  icon="User" 
  label="Ver Perfil" 
  shortcut="⌘P" 
  onClick={() => navigate()} 
/>
```
