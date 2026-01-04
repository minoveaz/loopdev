# Historias de Usuario: BrandLogo

Este componente es la autoridad máxima de identidad visual de LoopDev.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Isotipo en azul (`primary`), acentos de actividad en amarillo (`energy-yellow`).
2. **Sintaxis Loop:** El logotipo `loop.dev` es una marca limpia y autoritaria (sin decoración).
3. **Technical Canvas:** El cuadro del isotipo debe tener una micro-grilla interna de 4px.
4. **Surface Soul:** Bordes técnicos de 0.5px y sombras de profundidad industrial.

## Historias de Usuario (Funcionales)
- **Historia 1 (Identidad Completa):** Como sistema, quiero mostrar el isotipo azul y el texto con brackets para identificar la plataforma en el Launchpad.
- **Historia 2 (Solo Isotipo):** Como sidebar colapsado, quiero mostrar solo el cuadro azul con el infinito para ahorrar espacio.
- **Historia 3 (Reactividad de Tema):** Como usuario, quiero que el texto `loop.dev` cambie entre negro (modo claro) y blanco (modo oscuro) automáticamente para mantener la legibilidad.

## Casos de Estrés
- **Contenedor Estrecho:** El logo debe mantener su proporción incluso en headers pequeños.
- **Contraste Extremo:** Validación de que el amarillo energía sea visible sobre blanco puro y sobre el fondo más oscuro (`background-dark`).
- **Escalado Técnico:** El isotipo debe verse nítido desde 24px hasta 128px.
