# TechnicalDropdown (Sistema de Menús)

El `TechnicalDropdown` es el átomo oficial para la creación de menús desplegables en LoopDev OS. Provee una capa de abstracción sobre **Radix UI**, inyectando automáticamente el estilo de "Lujo Industrial", el z-index de plataforma y la accesibilidad WAI-ARIA.

## Características
- **Consistencia de Chasis:** Fondo de cristal esmerilado con z-index `5000` (Overlay).
- **Sub-componentes Integrados:** Incluye `Item`, `Separator` y `Group` con tipografía técnica.
- **Posicionamiento Inteligente:** Soporte nativo para `align` y `sideOffset`.

## Uso
```tsx
import { TechnicalDropdown, TechnicalDropdownItem } from '@loopdev/ui';

<TechnicalDropdown trigger={<button>Abrir</button>}>
  <TechnicalDropdownItem onClick={() => console.log('Action')}>
    Opción 1
  </TechnicalDropdownItem>
</TechnicalDropdown>
```

## Propiedades
| Prop | Tipo | Descripción |
| --- | --- | --- |
| `trigger` | `ReactNode` | Elemento que dispara el menú. |
| `align` | `'start' \| 'center' \| 'end'` | Alineación del globo. |
| `sideOffset` | `number` | Separación del trigger. |
