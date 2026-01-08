# Z-Index Scale (Foundation)

Define el protocolo de apilamiento vertical de `loop.dev`. Previene conflictos de capas (layering) mediante una escala predecible de base 100.

## 🪜 Escala de Capas
1. `base (0)`: Contenido estándar.
2. `dropdown (1000)`: Elementos flotantes locales.
3. `overlay (1300)`: Backdrops para modales y drawers.
4. `modal (1500)`: Diálogos críticos de interrupción.
5. `tooltip (1700)`: Información contextual de último nivel.
6. `priority (9999)`: Alertas globales de sistema (offline, errores críticos).

## ⚠️ Regla de Oro
Nunca hardcodear valores de `z-index` fuera de esta escala. Si un componente necesita una capa intermedia, debe ser discutido con Arquitectura de Diseño.
