# Button (Primitive)

**Description:** El botón principal del sistema LoopDev. Proporciona una base consistente para todas las acciones interactivas, soportando diversas variantes, tamaños, posicionamiento dual de iconos y estados de carga de marca.

## 🎨 Adaptabilidad & Dynamic Theming
Este componente está totalmente integrado con el `DynamicThemeProvider`. Reacciona en tiempo real a los cambios de la base de datos (SaaS Multitenant).

### Variables de Componente (CSS Tokens)
- `--comp-primary`: Color principal del botón (mapeado a la DB).
- `--comp-primary-dark`: Color para el estado `hover`.
- `--comp-primary-soft`: Color para fondos sutiles (Ghost/Outline).
- `--comp-primary-shadow`: Color para la elevación y sombras.

## ✨ Características
- **Variantes:** `primary`, `secondary`, `outline`, `ghost`, `energy` (AI-driven).
- **Tamaños:** `sm`, `md`, `lg` — alineados con el Stacking Protocol.
- **Dual Icon Support:** Soporta iconos independientes a la izquierda (`startIcon`) y derecha (`endIcon`).
- **Estados de Marca:** `loading` integrado con el spinner de sistema, `disabled`, `focus-visible`.
- **Ancho Completo:** Prop `fullWidth` para expansión responsiva.

## 🚀 Uso Profesional
```tsx
import { Button } from '@loopdev/ui';

// Con icono dual
<Button 
  startIcon="add" 
  endIcon="arrow_forward" 
  variant="primary"
>
  Siguiente paso
</Button>

// Estado de carga (reemplaza automáticamente el startIcon)
<Button isLoading variant="energy">
  Generando con IA...
</Button>
```

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | - | Contenido del botón. |
| `variant` | `'primary'\|'secondary'\|'outline'\|'ghost'\|'energy'` | `'primary'` | Estilo visual alineado a tokens. |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Escala del botón. |
| `startIcon` | `string` | - | Icono a la izquierda del texto. Se oculta si `isLoading` es true. |
| `endIcon` | `string` | - | Icono a la derecha del texto. Siempre visible. |
| `isLoading` | `boolean` | `false` | Activa el spinner y deshabilita el botón. |
| `disabled` | `boolean` | `false` | Deshabilita la interacción. |
| `fullWidth` | `boolean` | `false` | Expande al 100% del contenedor. |
| `onClick` | `function` | - | Evento de interacción. |

## 🧠 Arquitectura (Brain/Body)
- **Brain (`useButton.ts`)**: Abstrae la lógica de estados. Es el encargado de determinar si el botón debe estar deshabilitado basándose en `isLoading` o `disabled`.
- **Body (`index.tsx`)**: Orquestador visual que limpia las props para evitar warnings de atributos DOM inválidos.
- **Atomic UI (`components.tsx`)**: Gestiona la composición interna del texto y los iconos.

## 🛡️ Estabilidad & Calidad
### Unit Testing (Vitest)
Este componente cuenta con una suite de pruebas automatizadas que validan:
- Renderizado correcto de variantes.
- Aplicación de tokens de marca.
- Lógica de estados de carga y deshabilitado.
- Presencia de glifos de Material Symbols.

Para ejecutar los tests:
```bash
npm run test --filter @loopdev/ui
```

---
*Certificado para Fase 1 — Producción LoopSaaS*