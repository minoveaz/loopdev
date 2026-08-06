# Historias de Usuario: TechnicalTooltip

Este átomo sustituye la funcionalidad nativa de "title" por un dispositivo de información de alta precisión, garantizando que los metadatos técnicos sean legibles y estéticos.

## Bloque 0: ADN de Composición
1. **Trinidad Cromática:** 
   - Fondo: Negro profundo (`background-dark`).
   - Borde: Acento azul sutil (`primary/30`) o neutro técnico.
2. **Sintaxis Loop:** Soporte para envolver estados técnicos entre llaves `{ }`.
3. **Technical Canvas:** Micro-bordes de 0.5px.
4. **Surface Soul:** Efecto de cristal con `backdrop-blur` y tipografía JetBrains Mono para datos.

## Historias de Usuario
- **Historia 1 (Feedback Inmediato):** Como usuario, quiero que el tooltip aparezca con un delay mínimo (200ms) para no interrumpir mi flujo de trabajo rápido.
- **Historia 2 (Jerarquía Técnica):** Como desarrollador, quiero mostrar el nombre del módulo y su estado (ej: [Status: ACTIVE]) con un estilo de terminal para reforzar la autoridad del sistema.
- **Historia 3 (Accesibilidad Pro):** Como usuario con lector de pantalla, quiero que el tooltip cumpla con el estándar WAI-ARIA, vinculando correctamente el trigger con su descripción.

## Casos de Estrés
- **Contenido Multilínea:** El tooltip debe expandirse verticalmente sin perder la micro-grilla o el radio de los bordes.
- **Posicionamiento en Bordes:** Debe detectar automáticamente si está cerca del borde de la pantalla para reposicionarse sin cortarse (Smart Positioning).
- **Modo Claro:** En modo claro, el tooltip mantiene su fondo oscuro (estética de terminal) para asegurar el contraste máximo sobre la superficie porcelana.
