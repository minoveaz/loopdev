# Historias de Usuario: SidebarIdentity

Este componente compuesto es la cabecera oficial para paneles laterales, unificando la identidad de marca con la orientación de la suite activa.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Integración del `accentColor` mediante el átomo `IdentityBar`.
2. **Sintaxis Loop:** Soporte para tipografía técnica `nano black`.
3. **Technical Canvas:** Espaciado industrial reactivo al modo Rail.
4. **Surface Soul:** Alineación de precisión y transiciones fluidas de densidad.

## Historias de Usuario
- **Historia 1 (Branding & Navigation):** Como usuario, quiero ver el logo de la suite y su nombre claramente arriba para saber en qué entorno estoy trabajando.
- **Historia 2 (Identidad Compacta):** En modo Rail, el componente debe mostrar solo el isotipo centrado para mantener el minimalismo del modo experto.
- **Historia 3 (Retorno Contextual):** Como usuario, quiero que al hacer clic en la cabecera se active una acción de navegación (volver al inicio de la suite).

## Casos de Estrés
- **Nombres de Suite Largos:** El texto debe truncarse correctamente en contenedores expandidos.
- **Ajuste de Padding:** El componente debe cambiar su padding interno automáticamente al pasar de expanded a rail para no romper el layout de 56px.
