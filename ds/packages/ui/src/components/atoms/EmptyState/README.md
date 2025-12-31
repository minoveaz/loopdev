# EmptyState (Primitive)

**Description:** Pantalla de estado vacío con estética técnica de laboratorio. Diseñada para comunicar ausencia de datos, errores de red o estados de inicialización del sistema, con soporte nativo para procesos de IA.

## ✨ Características
- **Technical Blueprint:** Fondo de grilla técnica reactiva al color de marca.
- **AI Integration:** Modo especial púrpura con integración de `AILoader` y llaves estructurales `{ }`.
- **Icon Focus:** Contenedor de icono con corchetes de enfoque y micro-grilla.
- **SaaS Ready:** 100% reactivo al `DynamicThemeProvider`.
- **Resiliencia:** Truncado automático de texto y protección de iconos (`shrink-0`).

## 🚀 Uso
```tsx
import { EmptyState, Button } from '@loopdev/ui';

// Caso estándar: Búsqueda
<EmptyState 
  icon="manage_search"
  title="Sin resultados"
  description="Intenta ajustar tus filtros."
  action={<Button size="sm">Limpiar</Button>}
/>

// Caso IA: Procesando
<EmptyState 
  isLoading={true}
  title="Generando Layout"
  loadingMessages={['Analizando...', 'Estructurando...']}
/>
```

## ⚙️ API & Props
| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | - | Título principal. |
| `description` | `ReactNode` | - | Texto secundario. Se oculta si `isLoading` es true. |
| `icon` | `string` | `'search_off'` | Icono de Material Symbols. |
| `iconBadge` | `string` | - | Pequeña etiqueta sobre el icono. |
| `isLoading` | `boolean` | `false` | Activa el modo IA y el `AILoader`. |
| `loadingMessages` | `string[]` | - | Mensajes para el modo IA. |
| `variant` | `'card'\|'ghost'\|'ai'` | `'card'` | Estilo visual del contenedor. |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Escala del componente. |
| `action` | `ReactNode` | - | Slot para botones de acción. |

## 🛡️ Calidad (DoD)
- **Tests:** Vitest suite cubre renderizado, variantes y estados de carga.
- **Stress:** Validado contra desbordamientos de texto.
- **A11y:** Implementa `role="status"` y anuncios de ARIA dinámicos.

## 🧠 Design Rationale (LoopDev Standards)
### Functional Animation
El uso de `animate-bounce` en el `iconBadge` no es ornamental. Funciona como una **Guía de Atención (Attention Guide)**:
1.  **Reducción de Carga Cognitiva:** En un entorno vacío, el usuario puede sentirse desorientado. El movimiento sutil rompe la estática y dirige el ojo hacia el punto de interacción.
2.  **Affordance de Acción:** El rebote comunica que el sistema está "esperando" una entrada para inicializar el contexto.

### Categorización
Aunque técnicamente es un **Atomo** por su naturaleza indivisible, funcionalmente pertenece a la categoría de **Feedback**, ya que su propósito principal es comunicar el estado del sistema (ausencia de datos o procesamiento activo).

---
*Certified for Production - LoopDev.lab*
