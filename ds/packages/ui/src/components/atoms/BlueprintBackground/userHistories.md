# Historias de Usuario: BlueprintBackground

Componente de utilidad encargado de renderizar la atmósfera técnica oficial de LoopDev.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Adaptación automática a los colores de fondo (`background-dark` / `white`).
2. **Sintaxis Loop:** Soporte para rejillas de ingeniería (Blueprint) y de datos (Neural).
3. **Technical Canvas:** Integración nativa del componente `TechnicalCanvas`.
4. **Surface Soul:** Implementación del efecto `Scanline` para denotar un sistema vivo.

## Historias de Usuario
- **Historia 1 (Abstracción):** Como desarrollador, quiero invocar el fondo completo con una sola línea de código para evitar duplicar capas de divs y configuraciones de opacidad manuales.
- **Historia 2 (Intensidad Dinámica):** Como diseñador, quiero ajustar la visibilidad de la rejilla (`low`, `medium`, `high`) según la densidad de información de la página.
- **Historia 3 (Movimiento):** Como usuario, quiero ver un efecto de barrido casi invisible (`Scanline`) que refuerce la estética de terminal de alta tecnología.

## Casos de Estrés
- **Cambio de Tema:** La opacidad de la rejilla debe ajustarse automáticamente al pasar de modo claro a oscuro para mantener el contraste AA.
- **Rendimiento:** La animación del scanline debe ser extremadamente ligera para no afectar el scroll en páginas largas.
