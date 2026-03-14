# LogoSpinner (Generative System Loader)

## Propósito
El `LogoSpinner` es el indicador de carga de marca de alta fidelidad para el ecosistema LoopDev. A diferencia del `Spinner` atómico estándar, esta pieza utiliza la geometría del logo de infinito para comunicar procesos generativos, evolución de datos y ciclos de Inteligencia Artificial.

## Arquitectura (Brain vs Body)
- **Brain (`useLogoSpinner.ts`)**: Gestiona los cálculos de escalado (aspect ratio del infinito), las duraciones de animación basadas en el momentum técnico y la gestión de estados de velocidad.
- **Body (`index.tsx`)**: Orquestador visual que implementa el contenedor reactivo y el trazado SVG.
- **Components (`components.tsx`)**: Contiene la definición geométrica del `InfinityPath` y los filtros de brillo (glow) y gradientes semánticos.

## API
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `size` | `sm` \| `md` \| `lg` \| `xl` \| `2xl` \| `number` | `lg` | Tamaño del componente. |
| `speed` | `fast` \| `normal` \| `slow` | `normal` | Velocidad del flujo de la animación. |
| `isStatic` | `boolean` | `false` | Si es true, muestra el logo sin animación. |
| `className` | `string` | `""` | Clases adicionales para posicionamiento. |

## Guías de Uso (UX Patterns)

El `LogoSpinner` es un **elemento de branding activo**, no un simple loader. Debe usarse con intencionalidad.

### ✅ Escenarios Canónicos
1.  **System Boot (Carga Inicial):** Al abrir la aplicación o recargar el sistema. Ubicación central (`w-screen h-screen`), preferiblemente en modo oscuro.
2.  **Generative AI Actions:** Cuando el sistema está "creando" contenido (ej. generando reportes, optimizando código). El gradiente amarillo comunica "Inteligencia".
3.  **Heavy Lifting:** Procesos que bloquean la interfaz por más de 2 segundos (ej. sincronización de bases de datos, compilación).

### ❌ Anti-patrones (Dónde NO usarlo)
*   **Botones pequeños:** No usar dentro de botones de acción (ej. "Guardar"). Usar `Spinner` atómico.
*   **Micro-interacciones:** Validaciones de input, pull-to-refresh, carga de imágenes pequeñas.
*   **Alta frecuencia:** Si la acción ocurre muchas veces por minuto, la animación compleja puede fatigar visualmente.

### Matriz de Decisión
| Componente | Cuándo usarlo | Metáfora Visual |
| :--- | :--- | :--- |
| **Atomic Spinner** (Círculo) | Acciones < 2s, botones, inputs. | "Esperando respuesta..." |
| **LogoSpinner** (Infinito) | Carga inicial, AI, Procesos > 2s. | "El sistema está generando..." |

## Estados Visuales
- **Technical Trace**: Un trazado fantasma de fondo (`white/5`) sirve como guía estructural.
- **Momentum Flow**: Una "cometa" de luz con gradiente de `--lpd-color-brand-primary` a `--lpd-color-brand-energy`.
- **Glow Pulse**: Efecto de resplandor sutil que se activa durante el movimiento para denotar actividad del sistema.

## Notas de Accesibilidad
- Implementa `role="status"`.
- Utiliza `aria-label="LoopDev Generative System Processing"` para lectores de pantalla.
- Respeta la reducción de movimiento (`prefers-reduced-motion`) mediante la lógica de CSS.

---
*Certificado para Fase 2 · Feedback*