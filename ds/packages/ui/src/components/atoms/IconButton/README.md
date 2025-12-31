# IconButton (Primitive)

**Description:** Un botón interactivo diseñado exclusivamente para operar con iconos. Es la primitiva fundamental para acciones discretas en interfaces densas, asegurando alineación visual a la grilla y consistencia en el feedback de interacción.

## 🎨 Adaptabilidad (Theming)
Este componente es totalmente adaptable a la multitenancy utilizando variables CSS:
- `--comp-primary`: Color principal para las variantes `primary` y los `focus` rings.
- `--comp-primary-dark`: Color para el estado `hover` de la variante `primary`.
- `--comp-primary-soft`: Color para el fondo `hover` de las variantes `primary` y `ghost`.

Para aplicar un tema personalizado (ej. un tono de verde):
```tsx
<div style={{ 
  '--comp-primary': '#10B981', 
  '--comp-primary-dark': '#059669', 
  '--comp-primary-soft': 'rgba(16, 185, 129, 0.1)'
}}>
  <IconButton icon="save" variant="primary" tooltip="Save (Green Theme)" />
</div>
```

## ✨ Características
- **Variantes:** `neutral`, `primary`, `danger`, `success`, `ghost`.
- **Tamaños Semánticos:** `sm` (28x28px), `md` (32x32px), `lg` (36x36px) — alineados con la grilla de 4px para iconos de 12px, 16px y 20px respectivamente.
- **Iconografía:** Soporte exclusivo para iconos a través del componente `<Icon />` de Fase 0.
- **Estados:** `loading` (con spinner integrado), `disabled`, `hover`, `focus`.
- **Tooltips Nativos:** Soporte para `title` en el botón para accesibilidad y usabilidad.

## 🚀 Uso
```tsx
import { IconButton } from './index';
import { ICON_REGISTRY } from '@/components/phases/phase-0-foundations/IconRegistry';

<IconButton icon={ICON_REGISTRY.actions.edit} tooltip="Editar" onClick={() => alert('Editar!')} />
<IconButton icon={ICON_REGISTRY.actions.delete} variant="danger" tooltip="Eliminar" />
<IconButton icon={ICON_REGISTRY.actions.save} isLoading={true} tooltip="Guardando..." />
```

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `icon` | `IconName` | **Obligatorio** | Nombre del icono a mostrar (del `IconRegistry`). |
| `variant` | `IconButtonVariant` | `'neutral'` | Estilo visual del botón. |
| `size` | `IconButtonSize` | `'md'` | Tamaño predefinido del botón. |
| `tooltip` | `string` | - | Texto del tooltip nativo (se usa como `title` y `aria-label` si no se especifica `ariaLabel`). |
| `isLoading` | `boolean` | `false` | Muestra un spinner de carga y deshabilita el botón. |
| `disabled` | `boolean` | `false` | Deshabilita el botón y reduce la opacidad. |
| `className` | `string` | - | Clases CSS adicionales. |
| `onClick` | `(event) => void` | - | Handler del evento click. |
| `ariaLabel` | `string` | `tooltip || icon name` | Etiqueta accesible explícita para lectores de pantalla. Si no se provee, se usa `tooltip` o el nombre del `icon`. |

## 🧠 Lógica (useIconButton)
La lógica principal reside en `useIconButton.ts`, que genera las clases CSS dinámicas. Asegura que los estilos de color y los tamaños (`w-X h-X`) se adhieran estrictamente a las especificaciones del `VISUAL_COMPOSITION_SYSTEM v3.8` y soporten multitenancy.

## 🧩 Atomic UI (components.tsx)
`IconButtonContent` es un sub-componente que encapsula la renderización del icono, incluyendo el spinner de carga para el estado `isLoading`. Reutiliza el componente `<Icon />` de la Fase 0 para garantizar consistencia en la iconografía.

## 🛡️ Enterprise Hardening (Accesibilidad)
- **Estados de Foco:** `focus:outline-none focus:ring-2 focus:ring-offset-2` para una clara indicación del foco del teclado.
- **Estados Deshabilitados:** `disabled:opacity-50 disabled:cursor-not-allowed` para comunicar inoperabilidad.
- **`aria-label`:** Se utiliza `aria-label` para proporcionar una descripción textual al icono, esencial para usuarios de lectores de pantalla. Por defecto, usa el `tooltip` o el nombre del icono.
- **Spinner de Carga:** Se reemplaza el icono principal con `progress_activity` animado y un `aria-label` descriptivo durante el estado de carga.

## ⚠️ Integración Notes
- Depende del componente `Icon` y `IconRegistry` de la Fase 0.
- Requiere que la configuración de Tailwind CSS (`index.html`) esté extendida con los colores semánticos (`primary`, `danger`, `success`, etc.) y sus variantes (`primary-dark`, `primary-soft`, etc.) para un funcionamiento completo. Las variables CSS (`--comp-primary`, etc.) deben definirse en un nivel superior para habilitar el multitenancy.
- La `IconButton` es la base para `ActionMenu` y otras acciones discretas.