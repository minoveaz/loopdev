# Historias de Usuario: QuickActionMenu

Este componente compuesto es el punto de entrada universal para la creación de nuevos activos y la ejecución de acciones rápidas, adaptándose dinámicamente al contexto de la suite actual.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** Botón disparador con acento azul (`primary`) sutil.
2. **Sintaxis Loop:** Soporte para atajos de teclado rápidos (ej: { N }).
3. **Technical Canvas:** Menú desplegable con superficie de cristal y z-index `5000`.
4. **Surface Soul:** Micro-animación de rotación en el icono "+" al abrir el menú.

## Historias de Usuario
- **Historia 1 (Creación Universal):** Como usuario, quiero un botón "+" siempre visible en el header para iniciar la creación de cualquier elemento sin navegar a un módulo específico.
- **Historia 2 (Contextualidad Inteligente):** Como usuario de Marketing Studio, quiero que las primeras opciones del menú sean "Crear Campaña" o "Subir Asset", optimizando mi flujo de trabajo.
- **Historia 3 (Atajos de Teclado):** Como usuario experto, quiero descubrir los atajos de teclado para cada acción de creación mediante hints técnicos en el menú.
- **Historia 4 (Identidad Visual):** El menú debe utilizar el átomo `TechnicalDropdown` y los ítems `TechnicalMenuItem` para mantener la paridad visual con el resto del chasis.

## Casos de Estrés
- **Muchas Acciones:** Si una suite tiene más de 8 acciones de creación, el componente debe agruparlas por categorías para evitar la saturación visual.
- **Acceso Restringido:** Las acciones para las que el usuario no tiene permisos deben aparecer deshabilitadas.
