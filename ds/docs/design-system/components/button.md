# [COMP-001] Button

## 0) Snapshot
- **ID:** COMP-001
- **Nivel:** Primitive
- **Estado:** Approved
- **Owners:** Design=@design-team | Tech=@frontend-team
- **Alcance:** Global
- **Aplica en:** Todos los productos y journeys
- **Figma:** (pendiente de enlace)
- **Storybook:** [Ver en Storybook](http://localhost:6006/?path=/docs/components-button--docs)
- **Código:** `packages/ui/src/components/button/button.tsx`

## 1) Objetivo
Permitir al usuario realizar acciones, navegar o confirmar decisiones. Es el elemento interactivo fundamental del sistema, garantizando consistencia visual y de comportamiento en todas las llamadas a la acción (CTAs).

## 2) Cuándo usar / cuándo NO usar
### ✅ Usar cuando
- Se requiere una acción principal (Guardar, Enviar, Comprar).
- Se necesita una acción secundaria o terciaria (Cancelar, Volver).
- Se necesita un enlace que visualmente parezca un botón (usando `asChild`).

### ❌ No usar cuando
- Se trata de un enlace dentro de un párrafo de texto (usar componente `Link` o estilo de texto base).
- La acción es meramente decorativa y no interactiva.

## 3) Anatomía
El botón se compone de:
- **Contenedor:** Define el área interactiva, color de fondo y borde. Incluye micro-animación de escala (`active:scale-[0.98]`).
- **Label (Texto):** Describe la acción de forma concisa.
- **Iconos (Slot Izquierdo/Derecho):** Para reforzar el significado visual.
- **Spinner (Loading):** Reemplaza o acompaña a los iconos durante procesos asíncronos.

## 4) Variantes
Alineadas con `class-variance-authority` (CVA) en el código:

| Variante | Uso |
| :--- | :--- |
| `primary` | **Acción Principal.** El CTA más importante de la vista. |
| `secondary` | **Acción Secundaria.** Acompaña al principal o para acciones menos prioritarias. |
| `outline` | **Acción Terciaria.** Acciones de bajo peso visual o filtros con borde definido. |
| `ghost` | **Acción Sutil.** El fondo solo aparece al hover. Ideal para Toolbars. |
| `destructive` | **Acción Peligrosa (Rojo).** Eliminar, Borrar, Salir. |
| `link` | **Apariencia de Enlace.** Se comporta como botón pero parece un link. |

| Tamaño | Uso |
| :--- | :--- |
| `default` | (h-10) Estándar (px-5 py-2.5). |
| `sm` | (h-9) Compacto (px-3 py-1.5). |
| `lg` | (h-12) Grande y destacado (px-8 py-3.5). |
| `icon` | (h-10 w-10) Cuadrado para iconos solitarios. |

## 5) Estados y Animación
- **Micro-interacción:** Implementa una escala de `0.98` al presionar, proporcionando feedback táctil/visual de "pulsación".
- **Hover:** Transición suave (200ms) de brillo (`brightness-110`) para indicar interactividad.
- **Loading:** Deshabilita el botón automáticamente y muestra un spinner animado (`Loader2`).

## 6) Accesibilidad (A11y)
- **Polimorfismo:** Soporta `asChild` mediante `@radix-ui/react-slot`.
- **Contraste:** Texto forzado a blanco (`text-white`) en variantes oscuras (`primary`, `destructive`) para cumplir WCAG AA.

## 7) API (React)

### Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'primary'` | Estilo visual. |
| `size` | `string` | `'default'` | Tamaño del componente. |
| `isLoading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón. |
| `leftIcon` | `ReactNode` | `-` | Icono a la izquierda del texto. |
| `rightIcon` | `ReactNode` | `-` | Icono a la derecha del texto. |
| `asChild` | `boolean` | `false` | Para renderizado polimórfico (ej: Next Link). |

## 8) Ejemplos

### Con Iconos y Carga
```tsx
<Button 
  variant="primary" 
  leftIcon={<Mail size={16} />} 
  isLoading={isSubmitting}
>
  Enviar
</Button>
```

### Como Enlace Externo
```tsx
<Button asChild variant="outline">
  <a href="https://google.com">Visitar Web</a>
</Button>
```