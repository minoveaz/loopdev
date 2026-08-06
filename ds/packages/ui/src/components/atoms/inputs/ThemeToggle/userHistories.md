# Historias de Usuario: ThemeToggle

Componente diseñado para la alternancia de temas (Claro/Oscuro) con estética de alta precisión técnica.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** 
   - Acento en azul (`primary`) cuando el botón está activo o en hover.
2. **Sintaxis { }:** No aplica directamente a este átomo, pero debe ser compatible con contenedores que usen brackets.
3. **Technical Canvas:** El botón debe tener una base de cristal esmerilado sutil.
4. **Surface Soul:** Bordes técnicos de 0.5px que reaccionan al modo oscuro.

## Historias de Usuario
- **Historia 1 (Feedback Visual):** Como usuario, quiero ver un icono de Sol en modo oscuro y un icono de Luna en modo claro para entender qué tema se activará al hacer clic.
- **Historia 2 (Momentum):** Como usuario, quiero una micro-animación de transición suave al cambiar de tema para sentir la modernidad de la plataforma.
- **Historia 3 (Persistencia):** Como sistema, quiero que el tema elegido se mantenga al recargar la página o navegar entre suites.

## Casos de Estrés
- **Clics Rápidos:** La lógica de cambio de clase en el `document` debe ser robusta ante múltiples clics seguidos.
- **Contraste:** El botón debe ser perfectamente visible tanto sobre blanco porcelana como sobre gris industrial profundo.
