# ModuleWorkspace (Inner Chassis)

El `ModuleWorkspace` es el chasis de Nivel 2 diseñado para gestionar el área operativa de un módulo individual. Implementa el patrón de 3 paneles (Sidebar, Canvas, Inspector) y se coordina con el `AppShell` global.

## Características
- **Jerarquía de Foco:** Soporta modos Normal, Focus e Immersive (Zen).
- **Responsive Industrial:** Cambio automático a modo Overlay (Radix Dialog) en resoluciones menores a 1024px.
- **Brain/Body Split:** Lógica desacoplada en el hook `useModuleWorkspace`.
- **Zero Hardcoding:** Basado íntegramente en tokens semánticos y variables CSS.

## Uso Básico

```tsx
import { ModuleWorkspace } from '@loopdev/ui';

<ModuleWorkspace 
  moduleId="leads"
  sidebarSlot={<LeadsFilters />}
  toolbarSlot={<LeadsToolbar />}
  inspectorSlot={<LeadDetails />}
>
  <LeadsGrid />
</ModuleWorkspace>
```

## Props
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `moduleId` | `string` | Identificador único del módulo. |
| `mode` | `'normal' \| 'focus' | 'immersive'` | Controla la visibilidad del chrome. |
| `sidebarSlot` | `ReactNode` | Navegación lateral izquierda. |
| `inspectorSlot` | `ReactNode` | Panel de propiedades derecho. |
| `toolbarSlot` | `ReactNode` | Acciones contextuales sobre el canvas. |
| `headerSlot` | `ReactNode` | Título y breadcrumbs del módulo. |
