# Historias de Usuario: TechnicalLabel

Este átomo es el estándar tipográfico para micro-metadatos y etiquetas de clasificación técnica dentro de LoopDev OS.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** 
   - Variante `primary`: Texto en azul de marca.
   - Variante `muted`: Texto en gris sistema (60% opacidad).
   - Variante `subtle`: Texto en gris sistema (40% opacidad).
2. **Sintaxis Loop:** Compatible con el uso de brackets `{ }` para valores dinámicos.
3. **Technical Canvas:** Espaciado entre letras (tracking) extendido para máxima legibilidad en tamaños pequeños.
4. **Surface Soul:** Tipografía Inter Black (weight 900) por defecto para etiquetas de autoridad.

## Historias de Usuario
- **Historia 1 (Categorización):** Como usuario, quiero ver los nombres de los grupos de navegación con un estilo distinto al de los ítems para entender la jerarquía de la suite.
- **Historia 2 (Precisión de Sistema):** Como desarrollador, quiero una utilidad que aplique automáticamente el `uppercase` y el `tracking` oficial sin tener que escribir las clases de Tailwind manualmente.
- **Historia 3 (Legibilidad Micro):** El componente debe ser perfectamente legible a tamaño `8px` (`text-nano`) tanto en modo claro como oscuro.

## Casos de Estrés
- **Texto con Espacios:** El tracking no debe romper la lectura de frases de dos palabras (ej: "OPERACIONES CORE").
- **Modo Claro Extremo:** La variante `subtle` debe mantener el contraste mínimo AA sobre fondo blanco.
