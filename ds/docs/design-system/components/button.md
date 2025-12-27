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

### Alternativas
- **Link:** Para navegación pura dentro de bloques de texto.
- **IconButton:** Cuando el espacio es muy reducido y el icono es universalmente reconocible (aunque nuestro Button soporta variante `icon`).

## 3) Anatomía
El botón se compone de:
- **Contenedor:** Define el área interactiva, color de fondo y borde.
- **Label (Texto):** Describe la acción de forma concisa.
- **Icono (Opcional):** Puede acompañar al texto (izquierda/derecha) o ir solo (variante `size="icon"`).

## 4) Variantes
Alineadas con `class-variance-authority` (CVA) en el código:

| Variante | Uso |
| :--- | :--- |
| `default` | **Acción Principal.** El CTA más importante de la vista. |
| `secondary` | **Acción Secundaria.** Acompaña al principal o para acciones menos prioritarias. |
| `outline` | **Acción Terciaria.** Acciones de bajo peso visual o filtros. |
| `ghost` | **Acción Sutil.** Botones en barras de herramientas o menús donde el fondo solo aparece al hover. |
| `destructive` | **Acción Peligrosa.** Eliminar, Borrar, Salir. Señaliza irreversibilidad o precaución. |
| `link` | **Apariencia de Enlace.** Se comporta como botón pero parece un link (sin padding/fondo evidente). |

| Tamaño | Uso |
| :--- | :--- |
| `default` | (h-10) Tamaño estándar para la mayoría de interfaces. |
| `sm` | (h-9) Para espacios reducidos, tablas o tarjetas compactas. |
| `lg` | (h-11) Para landing pages o CTAs de marketing destacados. |
| `icon` | (h-10 w-10) Cuadrado perfecto para botones que solo contienen un icono. |

## 5) Estados
- **Default:** Estado de reposo.
- **Hover:** Ligero cambio de opacidad o fondo para indicar interactividad (`hover:bg-primary/90`, etc.).
- **Focus:** Anillo visible (`ring-2`) para navegación por teclado.
- **Active:** Efecto de pulsación (implementado nativamente).
- **Disabled:** Opacidad reducida (`opacity-50`) y puntero bloqueado (`pointer-events-none`).

## 6) Comportamiento
- El ancho del botón se ajusta al contenido por defecto (`inline-flex`).
- Puede forzarse a ancho completo mediante clases utilitarias (`w-full`) si el contenedor lo requiere.
- Solo debe haber **un** botón `variant="default"` (Principal) por sección visual para no competir por la atención.

## 7) Accesibilidad (A11y)
- **Polimorfismo:** Usa `@radix-ui/react-slot`. Si el botón navega a otra URL, usa `asChild` para renderizar un tag `<a>` real manteniendo la semántica y SEO correctos.
- **Teclado:** Enfocable mediante `Tab`. Activación con `Enter` o `Space`.
- **Focus Ring:** Indicador visual de foco (`focus-visible`) que nunca debe eliminarse sin reemplazo.
- **Contraste:** Todas las variantes cumplen con WCAG AA/AAA gracias a los tokens de color.

## 8) Reglas de contenido
- Usar verbos de acción en infinitivo o imperativo (ej: "Guardar", "Crear cuenta").
- Texto corto y directo (idealmente < 3 palabras).
- Capitalización: *Sentence case* (ej: "Guardar cambios") o *Title Case* según la guía de estilo general (actualmente mixta, definir en Governance).

## 9) Responsive
- En dispositivos móviles, considerar usar `w-full` para zonas de toque más fáciles (thumb zone).
- El tamaño `lg` es recomendable para "dedos gordos" en pantallas táctiles.

## 10) API (React)

Extiende `React.ButtonHTMLAttributes<HTMLButtonElement>` y `VariantProps`.

### Props Principales

| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Estilo visual del botón. |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Tamaño del componente. |
| `asChild` | `boolean` | `false` | Si es `true`, fusiona sus props con el hijo inmediato (patrón Radix Slot). Útil para `next/link`. |
| `className` | `string` | `-` | Clases adicionales de Tailwind (se fusionan inteligentemente con `cn`). |

### Eventos
Soporta todos los eventos nativos de HTMLButtonElement:
- `onClick`
- `onFocus`
- `onBlur`
- etc.

## 11) Dependencias
- **Paquetes:** `@radix-ui/react-slot`, `class-variance-authority`.
- **Utilidades:** `cn` (clsx + tailwind-merge).
- **Tokens:** Usa variables CSS de Tailwind (ej: `bg-primary`, `text-primary-foreground`).

## 12) Ejemplos

### Uso Básico
```tsx
import { Button } from "@loopdev/ui";

export const Example = () => (
  <Button variant="default" onClick={() => console.log("Click")}>
    Guardar Cambios
  </Button>
);
```

### Como Enlace (Polimorfismo)
```tsx
import { Button } from "@loopdev/ui";
import Link from "next/link";

export const NavigationButton = () => (
  <Button asChild variant="outline">
    <Link href="/dashboard">Ir al Dashboard</Link>
  </Button>
);
```

### Solo Icono
```tsx
import { Button } from "@loopdev/ui";
import { PlusIcon } from "lucide-react";

export const AddButton = () => (
  <Button variant="ghost" size="icon" aria-label="Añadir nuevo">
    <PlusIcon />
  </Button>
);
```

## 13) Notas y decisiones
- **Migración v1:** Se migró de una implementación HTML pura a Radix Slot para soportar mejor la navegación en frameworks como Next.js sin romper la semántica.
- **Nombrado:** Se adoptaron los nombres estándar de shadcn (`destructive` en lugar de `error`) para facilitar la interoperabilidad con otras librerías del ecosistema.
