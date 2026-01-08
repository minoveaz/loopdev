# User Histories: SuiteHomeLayout

**Component:** SuiteHomeLayout
**Version:** 2.0
**Taxonomía:** Composite (Chassis Level 2.5)

## 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)
1. **Trinidad Cromática:** Azul para acciones (`QuickStart`), Amarillo para gobernanza/alertas (`Notices`), Morado para telemetría de IA.
2. **Sintaxis { }:** Utilizada en badges de estado de módulos y contadores de métricas.
3. **Technical Canvas:** Uso de `BlueprintBackground` sutil en el Hero. Bordes de 0.5px en todas las tarjetas.
4. **Surface Soul:** Fondo `bg-shell-canvas`. Tarjetas en `surface-elevated` (#181b21).

## 📚 Historias de Usuario

### A. Historias de Orientación (Hero)
1. **Confirmación de Lugar:** Como usuario, quiero ver claramente el nombre de la Suite y su estado (`ACTIVE`) para confirmar mi contexto operativo.
2. **Personalización del Espacio:** Como usuario, quiero ver mi nombre y la marca activa para sentir que el sistema conoce mi flujo de trabajo.

### B. Historias de Activación (QuickStart vs Insights)
1. **Arranque en Frío (New User):** Como usuario nuevo, quiero que el sistema me priorice las "Acciones Rápidas" (`QuickStart`) para saber por dónde empezar.
2. **Pulso de Negocio (Returning User):** Como usuario recurrente, quiero que el sistema me priorice las "Métricas" (`Insights`) para saber si hay algo que requiera mi atención antes de operar.

### C. Historias de Continuidad (Timeline)
1. **Retorno al Trabajo:** Como usuario, quiero ver mis últimas 3-5 acciones para poder continuar exactamente donde lo dejé mediante un deep link.
2. **Ubicuidad Responsiva:** Como usuario móvil, quiero que mi historial de actividad esté disponible pero colapsado para no saturar mi pantalla pequeña.

### D. Historias de Gobernanza (Notices)
1. **Atención de Alertas:** Como administrador, quiero ver avisos críticos (ej: "Créditos IA agotándose") justo debajo del Hero para evitar interrupciones en el servicio.

## 📐 Criterios de Aceptación Técnicos
- [ ] El layout cambia el orden de `QuickStart` e `Insights` mediante una prop `userState: 'new' | 'active'`.
- [ ] La columna de actividad se mueve dinámicamente según el breakpoint:
    - `> 1440px`: Columna lateral derecha.
    - `1024px - 1440px`: Bloque horizontal antes del footer.
    - `< 1024px`: Accordion colapsable.
- [ ] Los cards de módulos consumen telemetría real (StatusPulse).
