# AILoader (Smart Terminal)

## Propósito
El `AILoader` es un componente de feedback textual diseñado para comunicar que el sistema está realizando tareas cognitivas o generativas (IA). Utiliza la metáfora de una terminal de comandos escribiendo en tiempo real para generar confianza técnica y transparencia en el proceso.

## Arquitectura (Brain vs Body)
- **Brain (`useAILoader.ts`)**: Implementa una máquina de estados finitos (`typing` -> `waiting` -> `deleting`) para simular la escritura humana. Gestiona los arrays de mensajes cíclicos.
- **Body (`index.tsx`)**: Estructura visual basada en la tipografía monoespaciada (`JetBrains Mono`). Utiliza los brackets en `Innovation Purple` como contenedor semántico de la lógica.

## API
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `messages` | `string[]` | `['AI Processing...']` | Array de textos a mostrar secuencialmente. |
| `speed` | `fast` \| `normal` \| `slow` | `normal` | Velocidad de escritura y borrado. |
| `showCursor` | `boolean` | `true` | Muestra el cursor de bloque parpadeante. |
| `className` | `string` | `""` | Clases adicionales. |

## Guías de Uso
### ✅ Cuándo usarlo
- **Generación de Código:** Mientras la IA escribe o refactoriza bloques de código.
- **Análisis de Datos:** "Scanning database...", "Finding patterns...".
- **Asistentes Virtuales:** Como estado de "pensando" en un chat bot.

### ❌ Cuándo NO usarlo
- **Carga de imágenes:** Usar Skeleton.
- **Guardado simple:** Usar Spinner.
- **Mensajes de error:** Usar Toast o Alert.

## Accesibilidad
- `role="status"` y `aria-live="polite"` para anunciar los cambios de mensaje a lectores de pantalla sin interrumpir agresivamente.
- El contraste del texto cumple WCAG AA en ambos modos.

---
*Certificado para Fase 2 · Feedback*
