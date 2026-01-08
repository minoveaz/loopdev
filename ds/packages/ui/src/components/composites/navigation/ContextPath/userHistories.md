# Historias de Usuario: ContextPath

Este componente compuesto es el dispositivo de orientación jerárquica de LoopDev OS. Proporciona claridad sobre la ubicación del usuario dentro de la estructura Suite > Módulo > Vista.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** El segmento final (activo) debe tener mayor peso visual y autoridad.
2. **Sintaxis Loop:** Los separadores entre niveles deben ser técnicos y de 0.5px.
3. **Technical Canvas:** El componente debe colapsar niveles intermedios de forma inteligente en contenedores estrechos.
4. **Surface Soul:** Tipografía técnica `TechnicalLabel` para niveles superiores.

## Historias de Usuario
- **Historia 1 (Orientación Jerárquica):** Como usuario, quiero ver la ruta completa de mi ubicación actual para entender la jerarquía de la suite.
- **Historia 2 (Navegación de Retorno):** Como usuario, quiero poder hacer clic en cualquier nivel superior de la ruta para volver rápidamente a ese contexto.
- **Historia 3 (Adaptabilidad Progresiva):** Como sistema, el componente debe mostrar solo el primer nivel y el nivel actual (ej: Marketing / ... / Logos) si el ancho del header es limitado.
- **Historia 4 (Identidad Técnica):** El separador debe ser una barra `/` o un chevron sutil que mantenga el estilo aeroespacial de la plataforma.

## Casos de Estrés
- **Rutas Profundas:** Si la jerarquía supera los 4 niveles, el componente debe usar el patrón de elipsis `...` para los niveles intermedios.
- **Cambio de Tema:** Los colores de los links inactivos deben mantener el contraste AA en ambos modos.
