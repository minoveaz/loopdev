# BlueprintBackground (Utilidad de Atmósfera)

El componente `BlueprintBackground` centraliza la lógica visual de los fondos técnicos en LoopDev OS. Combina el lienzo de ingeniería con micro-animaciones ambientales.

## Características
- **Implementación Simple:** Sustituye múltiples capas de divs decorativos.
- **ADN LoopDev:** Integración nativa de `TechnicalCanvas`.
- **Modos de Intensidad:** Soporte para tres niveles de visibilidad (`low`, `medium`, `high`).

## Uso
```tsx
import { BlueprintBackground } from '@loopdev/ui';

// En el layout o página raíz
<BlueprintBackground intensity="low" withScanline />
```

## Propiedades
| Prop | Tipo | Defecto | Descripción |
| --- | --- | --- | --- |
| `intensity` | `'low' \| 'medium' \| 'high'` | `'low'` | Nivel de presencia visual de la rejilla. |
| `withScanline` | `boolean` | `true` | Habilita el efecto de barrido técnico. |
| `variant` | `'blueprint' \| 'neural'` | `'blueprint'` | Estilo de la rejilla técnica. |
