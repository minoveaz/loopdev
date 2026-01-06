# Historias de Usuario: UserAvatar

Este átomo gestiona la representación visual del usuario (Foto, Iniciales o Icono) garantizando consistencia de marca y autoridad técnica.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** 
   - Fondo por defecto: Gradiente de `primary` (Azul) a `accent-purple` (IA).
   - Indicadores de estado: Verde (`success`), Amarillo (`energy`).
2. **Sintaxis Loop:** Compatible con el uso de llaves `{ }` en tooltips asociados.
3. **Technical Canvas:** El avatar debe ser un círculo perfecto con un borde técnico de alta precisión.
4. **Surface Soul:** Efecto de profundidad mediante sombra interna (`shadow-inner`) y borde sutil.

## Historias de Usuario
- **Historia 1 (Prioridad de Visualización):** Como sistema, quiero mostrar la imagen del usuario si está disponible; si no, sus iniciales; y como último recurso, un icono genérico de Lucide.
- **Historia 2 (Escalabilidad):** Como desarrollador, quiero poder elegir entre 4 tamaños estándar (`xs`, `sm`, `md`, `lg`) para usar el avatar en diferentes contextos (sidebar, header, feeds).
- **Historia 3 (Telemetría de Presencia):** Como usuario, quiero ver un punto de estado (StatusPulse) integrado en el avatar para saber si un colega está online.

## Casos de Estrés
- **Iniciales Largas:** El componente debe manejar nombres compuestos (ej: "Juan Pérez" -> "JP") sin deformar la tipografía.
- **Imágenes Rotas:** Si la URL de la imagen falla, el sistema debe caer automáticamente al modo "Iniciales" sin romper la UI.
- **Modo Claro:** El gradiente debe mantener su viveza sin ensuciar la superficie blanca.
