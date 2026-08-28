# TechnicalSurface (Piel Técnica)

El componente `TechnicalSurface` es el átomo de superficie oficial de LoopDev. Centraliza la lógica visual de los contenedores para asegurar consistencia en bordes, sombras y reactividad de tema.

## Características
- **Dualidad de Tema:** Cambia automáticamente de "Blanco Porcelana" a "Cristal Técnico".
- **Sistema de Profundidad:** Soporte para tres niveles de elevación (`flat`, `raised`, `overlay`).
- **Grilla Integrada:** Opción para mostrar la micro-grilla de ingeniería de 20px.

## Uso
```tsx
import { TechnicalSurface } from '@loopdev/ui';

<TechnicalSurface depth="raised" withGrid className="p-6">
  Contenido de la tarjeta...
</TechnicalSurface>
```

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `variant` | `'surface' \| 'glass' \| 'canvas'` | `'surface'` | Estética base del fondo. |
| `depth` | `'flat' \| 'raised' \| 'overlay'` | `'flat'` | Nivel de sombra y contraste de borde. |
| `withGrid` | `boolean` | `false` | Compone la capa decorativa canónica `TechnicalCanvas`; solo debe usarse en canvas, dashboards, boards técnicos o workflows inmersivos aprobados. |

`TechnicalSurface` no dibuja la grilla directamente. `withGrid` mantiene la
compatibilidad pública y compone `TechnicalCanvas` con una configuración
compacta de 20px sin subgrilla. Las recipes no deben reproducir la grilla con
CSS local.
