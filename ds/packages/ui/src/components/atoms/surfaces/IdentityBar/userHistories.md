# Historias de Usuario: IdentityBar

Este átomo actúa como un marcador visual minimalista que inyecta el color de identidad de la suite activa para orientar al usuario.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Uso del `accentColor` de la marca como protagonista.
2. **Sintaxis Loop:** Debe poder alinearse con bloques de texto técnicos.
3. **Technical Canvas:** La barra debe ser una línea de precisión (0.5px a 2px según escala).
4. **Surface Soul:** Bordes redondeados perfectos (`rounded-full`) y resplandor sutil.

## Historias de Usuario
- **Historia 1 (Orientación de Suite):** Como usuario, quiero ver una pequeña barra vertical del color de mi suite junto al título para confirmar visualmente en qué entorno estoy.
- **Historia 2 (Versatilidad de Orientación):** Como desarrollador, quiero poder usar la barra tanto en vertical (sidebars) como en horizontal (tabs o footers) manteniendo la misma estética.
- **Historia 3 (Consistencia de Marca):** El componente debe ser capaz de consumir tanto tokens del sistema (`primary`) como colores dinámicos inyectados por el tenant.

## Casos de Estrés
- **Colores muy Claros:** En modo claro, si el color de acento es casi blanco, la barra debe mantener un borde mínimo para ser visible.
- **Escalado:** La barra no debe pixelarse ni perder sus extremos redondeados al cambiar de tamaño.
