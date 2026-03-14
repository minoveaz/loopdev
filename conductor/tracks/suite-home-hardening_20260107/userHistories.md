# User Histories: Suite Home Hardening

**Track:** suite-home-hardening_20260107
**Version:** 3.9 (High-Fidelity Refactor)

## 🧬 Bloque 0: ADN de Composición
- **Trinidad Cromática:** Azul (Acción), Amarillo (Estado), Morado (Telemetría).
- **Superficie Soul:** Gris Carbón (#181b21) en dark, Blanco Hueso (Slate 100) en light.
- **Grilla:** Técnica de 40px visible en todo el lienzo.

## 📚 Historias por Componente

### 1. [TechnicalCard] - La Unidad Base
- **HU:** Como desarrollador, quiero un componente que garantice que el padding y el radio de borde son idénticos en toda la suite para eliminar el desorden visual.
- **HU:** Como usuario, quiero feedback visual inmediato (Glow Azul) al pasar sobre una tarjeta interactiva para confirmar mi intención de acción.

### 2. [SuiteHomeHero] - El Anclaje
- **HU:** Como usuario, quiero confirmar mi suite mediante un **Ancla Visual de Identidad** (`TechnicalIsotype`) imponente que se vea "lab-ready".
- **HU:** Como usuario, quiero ver mi contexto activo en tipografía `JetBrains Mono` para sentir precisión técnica y control.

### 3. [QuickStart] - El Launcher
- **HU:** Como usuario, quiero encontrar mis "Power Actions" en tarjetas compactas y densas que no me obliguen a realizar scroll innecesario.
- **HU:** Como usuario, quiero que el icono de la acción sea el protagonista visual del launcher.

### 4. [Insights] - La Telemetría
- **HU:** Como administrador, quiero ver el pulso de la suite con etiquetas de sincronización (`[ LIVE ]`) en tipografía micro para confirmar la frescura de los datos.

### 5. [Activity] - La Memoria
- **HU:** Como usuario, quiero que la actividad sea sutil (bajo contraste) y no compita por mi atención con las áreas de acción principal.

### 🧠 [SuiteHomeLayout] - Comportamiento de Sistema
- **HU:** Como sistema, quiero que el orden y visibilidad de bloques se adapten al estado de la suite (ej: ocultar Insights si el estado es `empty`).
- **HU:** Como sistema, quiero que el layout funcione sin conocer la semántica del dominio (agnosticismo total entre Marketing, CRM, etc).
