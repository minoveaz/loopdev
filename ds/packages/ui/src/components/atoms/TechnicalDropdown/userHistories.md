# Historias de Usuario: TechnicalDropdown

Este átomo encapsula la lógica y estética oficial de los menús desplegables de LoopDev OS, basándose en Radix UI para garantizar accesibilidad de nivel Enterprise.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** 
   - Hover de items: Acento azul sutil (`bg-primary/5`).
   - Active state: Texto destacado en `primary`.
2. **Sintaxis Loop:** Soporte para separadores técnicos de 0.5px.
3. **Technical Canvas:** Menú con fondo de cristal sólido y z-index prioritario (`5000`).
4. **Surface Soul:** Bordes de precisión (`0.5px`) y sombras de profundidad industrial.

## Historias de Usuario
- **Historia 1 (Abstracción de Radix):** Como desarrollador, quiero una API simplificada para crear menús sin tener que configurar manualmente los Portals, Content y Z-index de Radix cada vez.
- **Historia 2 (Estética Inmutable):** Como diseñador, quiero asegurar que todos los dropdowns de la plataforma tengan el mismo radio de borde, desenfoque y comportamiento de animación.
- **Historia 3 (Accesibilidad Enterprise):** Como usuario con teclado, quiero navegar por las opciones del menú usando las flechas y activarlas con Enter, cumpliendo con el estándar W3C.

## Casos de Estrés
- **Contenido con Scroll:** El menú debe soportar listas largas activando el `ScrollArea` interno si es necesario.
- **Viewport Overflow:** El componente debe detectar los bordes de la pantalla y reposicionarse automáticamente (Smart Positioning).
- **Modos de Color:** El fondo debe ser `white` en claro y `background-dark` en oscuro, manteniendo siempre una opacidad alta para legibilidad.
