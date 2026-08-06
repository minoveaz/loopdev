# Historias de Usuario: SystemStatus

Átomo diseñado para comunicar la salud del sistema y el contexto técnico del usuario.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** 
   - Verde (`success`) para estado operativo.
   - Amarillo (`energy`) para avisos o estado degradado.
   - Rojo (`danger`) para caídas del sistema.
2. **Sintaxis { }:** El ID técnico o identificador de sesión debe estar obligatoriamente entre llaves amarillas.
3. **Technical Canvas:** El fondo debe ser un cristal sutil con bordes técnicos.
4. **Surface Soul:** Tipografía dual (Inter para el estado, JetBrains Mono para el ID).

## Historias de Usuario
- **Historia 1 (Indicador de Pulso):** Como usuario, quiero ver un punto animado que parpadee sutilmente para confirmar que el sistema está "vivo" y enviando telemetría.
- **Historia 2 (Contexto Técnico):** Como desarrollador, quiero mostrar el ID de sesión o Tenant ID de forma truncada para dar una sensación de entorno de ingeniería sin saturar la UI.
- **Historia 3 (Estados Semánticos):** Como administrador, quiero que el color del indicador cambie automáticamente según la salud real de los servicios.

## Casos de Estrés
- **IDs Largos:** El componente debe truncar automáticamente el ID si el contenedor es demasiado estrecho.
- **Contraste:** Los textos deben ser legibles en modo claro sobre fondo blanco y en modo oscuro sobre fondo negro.
