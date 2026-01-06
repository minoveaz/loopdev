# Historias de Usuario: SidebarFooter

Este componente compuesto actúa como el bloque de cierre semántico del sidebar, integrando la identidad del usuario y los controles de plataforma.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** Uso del azul (`primary`) para acciones activas.
2. **Sintaxis Loop:** Sin decoraciones innecesarias en modo Rail.
3. **Technical Canvas:** Micro-grilla interna reactiva opcional.
4. **Surface Soul:** 
   - Separador superior de 0.5px (`border-t`).
   - Fondo de cristal sutil (`bg-black/[0.02]`).

## Historias de Usuario
- **Historia 1 (Cierre Semántico):** Como usuario, quiero que el final del sidebar sea estático y contenga mi perfil, para saber siempre dónde están mis ajustes personales.
- **Historia 2 (Consola Unificada):** Como desarrollador, quiero agrupar los botones de "Settings" y "Collapse" en una sola pieza visual para dar una sensación de orden y congruencia técnica.
- **Historia 3 (Adaptabilidad Vertical):** En modo Rail, el componente debe apilar el avatar y los botones verticalmente, manteniendo el centrado perfecto en los 56px.

## Casos de Estrés
- **Nombres Muy Largos:** En modo expandido, el nombre y el rol del usuario deben truncarse con elipsis para no empujar los controles técnicos.
- **Cambio de Tema:** Los botones de control deben reaccionar al modo claro/oscuro manteniendo el estilo "Technical Glass".
