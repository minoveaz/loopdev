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
| `withGrid` | `boolean` | `false` | Activa la textura de micro-grilla Blueprint. |
