# Historias de Usuario: ExitHatch

Este átomo actúa como la puerta de salida de una suite, permitiendo al usuario retornar al Launchpad global del sistema operativo.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Neutro (`text-muted`) por defecto, adquiere color de autoridad (`slate-900` / `white`) en hover.
2. **Sintaxis Loop:** Sin decoraciones, brackets o pulsos. Pureza visual.
3. **Technical Canvas:** Alineación perfecta en modo Rail (icono centrado).
4. **Surface Soul:** Animación de "retroceso" (movimiento hacia la izquierda) para denotar salida.

## Historias de Usuario
- **Historia 1 (Minimalismo de Salida):** Como usuario, quiero que el botón de salida sea claramente distinguible de los módulos operativos para evitar clics accidentales.
- **Historia 2 (Feedback de Movimiento):** Como usuario, quiero ver una micro-animación de la flecha hacia la izquierda al pasar el ratón, reforzando la idea de "volver atrás".
- **Historia 3 (Adaptabilidad Rail):** En modo Rail, el componente debe mostrar solo el icono, manteniendo la misma interactividad y centrando el elemento en los 56px.

## Casos de Estrés
- **Textos de Salida Largos:** Aunque el estándar es "Back to OS", el componente debe soportar otros labels sin romper el layout.
- **Click Rápido:** La transición de color y movimiento debe ser suave pero inmediata (momentum).
