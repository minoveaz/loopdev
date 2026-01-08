# Historias de Usuario: TechnicalSurface

Átomo fundamental encargado de gestionar las superficies y contenedores de la plataforma. Es la implementación física del pilar "Surface Soul".

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Adaptación a `primary` para bordes de foco.
2. **Sintaxis Loop:** Compatible con el uso de micro-grillas internas (Blueprint).
3. **Technical Canvas:** Capacidad de inyectar una textura de ingeniería.
4. **Surface Soul:** 
   - Modo Claro: Estética "Porcelana" (Blanco puro con bordes sutiles).
   - Modo Oscuro: Estética "Cristal Técnico" (Gris profundo con opacidad y blur).

## Historias de Usuario
- **Historia 1 (Abstracción de Estilos):** Como desarrollador, quiero un componente único para tarjetas y paneles que ya incluya los bordes y sombras oficiales del sistema.
- **Historia 2 (Niveles de Profundidad):** Como diseñador, quiero poder elegir entre diferentes niveles de elevación (`flat`, `raised`, `overlay`) para jerarquizar la información.
- **Historia 3 (Consistencia de Bordes):** El componente debe asegurar que los bordes sean siempre de 0.5px/1px con la opacidad correcta según el tema activo.

## Casos de Estrés
- **Contenido con Desbordamiento:** La superficie debe manejar correctamente el `overflow-hidden` por defecto para no romper el radio de los bordes.
- **Anidamiento:** Validación visual de cómo se ve una superficie sobre otra (ej: un modal sobre un panel).
