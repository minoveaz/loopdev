# Registro de Deuda Técnica (Quant Ops Suite)

Este archivo documenta las mejoras, refactorizaciones y funcionalidades pendientes que han sido pospuestas para priorizar la estabilidad del núcleo de trading.

## 🔴 Arquitectura & Telemetría
- **[STRAT-01] Visualización de Audit Trail en UI**: Implementar una pestaña o sección en el `BotInspector` que lea el archivo `STRATEGY_CHANGELOG.md` (o una tabla equivalente) para mostrar al usuario la evolución de la lógica que está corriendo su bot.
    - *Razón:* Transparencia total sobre cambios de parámetros (ej: ajuste de sensibilidad ATR v1.1.0).
    - *Prioridad:* Media.

## 🟡 Frontend & UX
- **[UI-01] Gráficos Real-time (PulseSparkline)**: Vincular los sparklines de las tarjetas a la tabla `quant_market_history` en lugar de usar datos estáticos o de polling directo.
- **[UI-02] Logs de Ejecución Detallados**: Crear un componente de terminal en el dashboard que muestre el stream de logs del motor Python filtrado por Bot ID.

## 🟢 Infraestructura
- **[INF-01] Multi-Exchange Ingestor**: El ingestor actual está optimizado para pares específicos. Falta automatizar la activación de nuevos pares en el Sentinel basado en el despliegue de nuevos bots.
