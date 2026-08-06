# User Histories: System Notice Rail

**Component:** SystemNoticeRail
**Strategic Goal:** Operational Awareness without friction.

## 🧬 Bloque 0: ADN Industrial
1. **Infrastructure Feel:** El componente no debe parecer una "alerta de bootstrap". Debe sentirse como una parte integral del chasis (`bg-shell-canvas` + alpha).
2. **Technical Contrast:** Uso de tipografía `Inter Medium` para el título y `JetBrains Mono` (opcional) para descripciones técnicas.

## 📚 Historias de Usuario

### A. Conciencia de Estado (Status Awareness)
1. **Claridad de Riesgo:** Como administrador, quiero que el color del rail cambie según la severidad del aviso para saber instantáneamente la urgencia de la tarea.
2. **Contexto de Origen:** Como usuario, quiero ver el icono del ámbito (ej: una pieza de puzzle para una integración caída) para saber exactamente qué parte del sistema necesita atención.

### B. Acción y Gobernanza (Actionable Governance)
1. **Resolución Inmediata:** Como usuario, quiero un botón de acción directa dentro del rail para solucionar el problema sin tener que buscar en el menú.
2. **Limpieza de Espacio:** Como usuario, quiero poder cerrar avisos informativos que ya he leído para mantener mi espacio de trabajo limpio.

### C. Inteligencia de Sistema (System Intelligence)
1. **Autogestión de Prioridad:** Como sistema, si hay varios avisos, quiero mostrar siempre el de mayor peligro (`danger`) para proteger la integridad operativa.
2. **Adaptabilidad de Pantalla:** Como usuario móvil, quiero que el rail sea compacto pero legible, ocultando la descripción si el espacio es crítico.

## 📐 Criterios de Aceptación Técnicos
- [ ] Soporte para `maxVisible: 1`.
- [ ] Las acciones deben ser del tipo "link-button técnico" (minimalistas).
- [ ] Los bordes deben ser de 0.5px.
