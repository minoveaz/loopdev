# Historias de Usuario: CommandBarTrigger

Este átomo es el disparador central para la paleta de comandos de LoopDev OS. Actúa como el centro neurálgico de la productividad para el usuario experto.

## Bloque 0: ADN de Composición (v3.9)
1. **Trinidad Cromática:** Neutro por defecto, con acento azul (`primary`) en el estado de foco.
2. **Sintaxis Loop:** Uso de brackets `{ }` o el símbolo `⌘` para indicar el atajo de teclado.
3. **Technical Canvas:** Estilo de input técnico con bordes sutiles y texto monospaced.
4. **Surface Soul:** Animación de transición fluida al colapsar de input a icono.

## Historias de Usuario
- **Historia 1 (Comando Global):** Como usuario experto, quiero un disparador de `⌘K` siempre visible en el centro del header para acceder a cualquier acción del sistema sin usar el ratón.
- **Historia 2 (Adaptabilidad Progresiva):** Como sistema, el componente debe degradarse a un simple icono de búsqueda en layouts compactos para no sacrificar el espacio del `ContextPath`.
- **Historia 3 (Feedback de Interacción):** Al hacer clic o al pulsar `⌘K`, el componente debe mostrar una animación sutil para confirmar que la paleta de comandos se está abriendo.
- **Historia 4 (Accesibilidad de Teclado):** El componente debe ser focusable y responder a la tecla `Enter` para abrir la paleta.

## Casos de Estrés
- **Layouts < 768px:** El componente debe ser siempre un icono, nunca un input falso.
- **Cambio de Tema:** El contraste del texto placeholder y el borde deben ser impecables en ambos modos.
