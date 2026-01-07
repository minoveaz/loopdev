# Historias de Usuario: SuiteSwitcher

Este componente es el portal de navegación de alto nivel que permite al usuario alternar entre las diferentes suites (Marketing, CRM, etc.) sin perder el contexto del sistema operativo.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** El ítem de la suite activa debe marcarse con azul (`primary`).
2. **Sintaxis Loop:** Uso de brackets `{ }` para mostrar atajos de teclado en el menú.
3. **Technical Canvas:** El menú desplegable debe usar la superficie de cristal técnica.
4. **Surface Soul:** Transiciones suaves de opacidad y desenfoque al abrir el menú.

## Historias de Usuario
- **Historia 1 (Selector de Identidad):** Como usuario, quiero ver el icono y nombre de la suite actual en el header para saber en qué entorno estoy operando.
- **Historia 2 (Navegación Global):** Como usuario, quiero abrir un menú que me muestre todas las suites contratadas para saltar de una a otra instantáneamente.
- **Historia 3 (Gobernanza de Acceso):** Como sistema, quiero que el switcher deshabilite las suites a las que el usuario no tiene permiso, evitando errores de acceso.
- **Historia 4 (Confirmación Visual):** Como usuario, quiero que la suite en la que estoy trabajando actualmente aparezca con un indicador de "Check" en el menú desplegable.

## Casos de Estrés
- **Cambio Rápido:** El menú debe cerrarse instantáneamente al seleccionar una nueva suite para iniciar la transición.
- **Contraste de Menú:** El dropdown debe ser perfectamente legible tanto en modo claro como oscuro sobre cualquier contenido.
