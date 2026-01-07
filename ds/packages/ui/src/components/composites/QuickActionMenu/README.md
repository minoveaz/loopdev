# QuickActionMenu (Creación Universal)

El `QuickActionMenu` es el dispositivo oficial de LoopDev OS para la creación rápida de activos. Actúa como un atajo universal desde el header, permitiendo al usuario iniciar flujos de trabajo sin navegar.

## Características
- **Feedback de Apertura:** Micro-animación de rotación de 45° en el icono disparador.
- **Jerarquía Contextual:** Soporte para múltiples grupos de acciones técnicas.
- **Atajos Integrados:** Muestra hints de teclado para educar al usuario experto.

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `groups` | `QuickActionGroup[]` | Lista de grupos y acciones a mostrar. |

## Uso
```tsx
import { QuickActionMenu } from '@loopdev/ui';

const groups = [
  {
    label: 'Marketing',
    actions: [
      { id: '1', label: 'Nueva Campaña', icon: 'Megaphone', shortcut: 'N' }
    ]
  }
];

<QuickActionMenu groups={groups} />
```
