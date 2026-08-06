# Historias de Usuario: TechnicalMenuItem

Este átomo define la unidad mínima de interacción dentro de un menú (Dropdown, Popover, ContextMenu). Garantiza que todas las opciones de la plataforma compartan la misma estructura y feedback visual.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** 
   - Hover: Acento azul sutil (`bg-primary/5`).
   - Variante `danger`: Rojo de estado (`danger`) para acciones destructivas.
2. **Sintaxis Loop:** Soporte para atajos de teclado envueltos en brackets `{ }`.
3. **Technical Canvas:** Alineación de precisión entre el icono y el texto.
4. **Surface Soul:** Transición suave de color de fondo al hacer hover.

## Historias de Usuario
- **Historia 1 (Estructura Estándar):** Como usuario, quiero ver un icono descriptivo a la izquierda del texto para identificar rápidamente la acción.
- **Historia 2 (Hints Técnicos):** Como desarrollador, quiero mostrar atajos de teclado (`⌘K`) a la derecha del ítem para educar al usuario experto.
- **Historia 3 (Acciones Críticas):** Como usuario, quiero que acciones como "Cerrar Sesión" o "Eliminar" se destaquen en rojo para evitar ejecuciones accidentales.
- **Historia 4 (Estado Activo):** Como sistema, quiero marcar el ítem seleccionado con un indicador visual claro (Check o color primary) para confirmar la selección actual.

## Casos de Estrés
- **Labels Muy Largos:** El texto debe truncarse con puntos suspensivos si el menú es estrecho.
- **Icono Ausente:** Si no se proporciona icono, el texto debe alinearse correctamente para mantener el ritmo visual con los ítems que sí lo tienen.
