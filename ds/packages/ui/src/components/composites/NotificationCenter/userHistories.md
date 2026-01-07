# Historias de Usuario: NotificationCenter

Este componente compuesto gestiona las alertas y eventos del sistema, permitiendo al usuario estar al tanto de cambios críticos, aprobaciones y menciones de equipo.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** 
   - Notificaciones críticas: Rojo (`danger`).
   - Notificaciones de sistema: Azul (`primary`).
2. **Sintaxis Loop:** Uso de brackets para marcas temporales (ej: { 10m }).
3. **Technical Canvas:** Alineación perfecta en la Cápsula Derecha del Header.
4. **Surface Soul:** Popover de cristal con efecto blur y sombras industriales.

## Historias de Usuario
- **Historia 1 (Señal de Alerta):** Como usuario, quiero ver un contador sobre el icono de la campana para saber cuántas notificaciones tengo pendientes sin abrir el menú.
- **Historia 2 (Resumen Rápido):** Como usuario, quiero ver una vista previa de las últimas 3 notificaciones al hacer clic en el header, para decidir si algo requiere mi atención inmediata.
- **Historia 3 (Navegación Detallada):** Como usuario, quiero tener un acceso a "Ver Todo" que abra el panel lateral derecho (`SuiteContextPanel`) para gestionar mi historial completo.
- **Historia 4 (Prioridad Crítica):** Como sistema, quiero que las notificaciones de fallo o seguridad se destaquen visualmente del resto.

## Casos de Estrés
- **Contenido Multilínea:** Los mensajes de notificación deben soportar hasta 2 líneas antes de truncarse.
- **Sin Notificaciones:** El componente debe mostrar un "Zero State" elegante indicando que el sistema está al día.
