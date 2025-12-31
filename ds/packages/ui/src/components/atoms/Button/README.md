# Button (Primitive)

**Description:** El botón principal del sistema LoopDev. Proporciona una base consistente para todas las acciones interactivas, soportando diversas variantes, tamaños, iconos y estados de carga.

## 🎨 Adaptabilidad (Theming)
Este componente es completamente adaptable a la multitenancy utilizando variables CSS:
- `--comp-primary`: Color principal del botón y sus estados.
- `--comp-primary-dark`: Color para el estado `hover` del botón `primary`.
- `--comp-primary-soft`: Color para el fondo `hover` del botón `outline` y `ghost`.
- `--comp-primary-shadow`: Color para la sombra del botón `primary`.

Para aplicar un tema personalizado:
```tsx
<div style={{ 
  '--comp-primary': '#FFD025', 
  '--comp-primary-dark': '#eac026',
  '--comp-primary-soft': 'rgba(255, 208, 37, 0.1)',
  '--comp-primary-shadow': 'rgba(255, 208, 37, 0.2)'
}}>
  <Button variant="primary">Themed Button</Button>
</div>
```

## ✨ Características
- **Variantes:** `primary`, `secondary`, `outline`, `ghost`, `energy`.
- **Tamaños:** `sm` (28px de alto), `md` (40px de alto), `lg` (48px de alto) — alineados con la grilla de 4px.
- **Iconografía:** Soporte para iconos utilizando el componente `<Icon />` de Fase 0.
- **Estados:** `loading` (con spinner integrado), `disabled`, `hover`, `focus`.
- **Ancho Completo:** Prop `fullWidth` para expandir el botón al 100% del ancho del contenedor.

## 🚀 Uso
```tsx
import { Button } from './index';
import { ICON_REGISTRY } from '@/components/phases/phase-0-foundations/IconRegistry';

<Button onClick={() => alert('Clicked!')}>Submit</Button>
<Button variant="secondary" icon={ICON_REGISTRY.actions.save}>Save Draft</Button>
<Button variant="energy" isLoading={true}>Processing...</Button>
```

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | - | Contenido del botón (texto, otros elementos). |
| `variant` | `ButtonVariant` | `'primary'` | Estilo visual del botón. |
| `size` | `ButtonSize` | `'md'` | Tamaño del botón. |
| `icon` | `IconName` | - | Nombre del icono (del `IconRegistry`) para mostrar junto al texto. |
| `isLoading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón. |
| `disabled` | `boolean` | `false` | Deshabilita el botón y reduce la opacidad. |
| `fullWidth` | `boolean` | `false` | Hace que el botón ocupe el 100% del ancho disponible. |
| `className` | `string` | - | Clases CSS adicionales. |
| `onClick` | `(event) => void` | - | Handler del evento click. |

## 🧠 Lógica (useButton)
La lógica de este componente reside en `useButton.ts`, que abstrae la generación de clases CSS dinámicas basadas en las props. Se asegura de que todas las clases CSS sean generadas utilizando las variables de diseño y los tokens semánticos definidos en `VISUAL_COMPOSITION_SYSTEM v3.8`.

## 🧩 Atomic UI (components.tsx)
`ButtonContent` se encarga de la disposición del icono y el texto, incluyendo el spinner de carga. Reutiliza el componente `<Icon />` de la fase `Foundations`.

## 🛡️ Enterprise Hardening (Accesibilidad)
- **Estados de Foco:** `focus:outline-none focus:ring-2 focus:ring-offset-2` para una clara indicación del foco del teclado.
- **Estados Deshabilitados:** `disabled:opacity-50 disabled:cursor-not-allowed` para indicar la inoperabilidad.
- **Iconografía:** Los iconos se añaden semánticamente y pueden ser ignorados por lectores de pantalla si el texto ya lo describe.
- **Spinner:** Se utiliza un icono `progress_activity` para comunicar el estado de carga, y se deshabilita el botón para evitar interacciones duplicadas.

## ⚠️ Integración Notes
- Depende del componente `Icon` de la Fase 0 y de `IconRegistry`.
- Requiere que la configuración de Tailwind CSS (`index.html`) esté extendida con los colores semánticos (`primary`, `energy`, `surface`, etc.) y las variantes (`primary-dark`, `energy-hover`, etc.) para un funcionamiento completo. Asegúrate de que las variables CSS `--comp-primary`, etc., se definan en un nivel superior (`:root` o el contenedor del tema) para habilitar el multitenancy.
