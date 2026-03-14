# User Histories: SuiteHomeLayout (v2.1)

**Component:** SuiteHomeLayout
**Strategic Hierarchy:** Orientación → Acción → Control → Navegación → Memoria

## 🧬 Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Azul (Acción), Amarillo (Alerta/Gobernanza), Morado (IA/Telemetría).
2. **Surface Soul:** Tarjetas en `surface-elevated` (#181b21), bordes técnicos de 0.5px.
3. **Typography:** `Inter Bold` para jerarquía, `JetBrains Mono` para memoria (Timeline).

## 📚 Historias de Usuario

### 1. [ORIENTACIÓN] El Momento Hero
- **Confirmación Espacial:** Como usuario, al entrar, quiero ver el contexto `{ SUITE_NAME }` y mi estado de sesión para sentir seguridad inmediata.
- **Aire Arquitectónico:** Como diseñador, quiero que el Hero tenga entre 96px y 120px de alto con mucho espacio negativo para evitar el agobio visual.

### 2. [ACCIÓN] Quick Start
- **Fricción Cero:** Como usuario, quiero ver tarjetas de acción pequeñas y claramente clicables para realizar tareas comunes sin navegar por el menú.
- **Feedback de Intención:** Como usuario, quiero un efecto visual (glow azul) al pasar sobre una acción para confirmar mi intención de clic.

### 3. [CONTROL] Executive Glance
- **Vida del Sistema:** Como administrador, quiero ver métricas con `StatusPulse` para confirmar de un vistazo que el sistema está operando correctamente.
- **Intercambio de Prioridad:** Como sistema, quiero mostrar primero los Insights si el usuario es recurrente, o el QuickStart si es nuevo.

### 4. [NAVEGACIÓN] Entry Points
- **Estaciones Operativas:** Como usuario, quiero ver los módulos disponibles como tarjetas medianas con un botón de acción contextual (ej: "Continuar" si hay trabajo pendiente).

### 5. [MEMORIA] Activity Timeline
- **Continuidad Fluida:** Como usuario, quiero ver un timeline ultra-compacto en monoespaciado para saltar rápidamente a mi último asset editado.
- **Inteligencia de Grid:** Como usuario Desktop XL, quiero el timeline a la derecha para usar todo mi ancho de pantalla. Como usuario Mobile, quiero que el timeline se oculte en un accordion para priorizar la acción.

## 📐 Reglas de Grid (Layout)
- **Desktop XL:** 12 columnas (Principal 9 | Lateral 3).
- **Desktop Std:** 12 columnas (Stack vertical de bloques).
- **Tablet:** 8 columnas.
- **Mobile:** 1 columna (Lista de comandos).