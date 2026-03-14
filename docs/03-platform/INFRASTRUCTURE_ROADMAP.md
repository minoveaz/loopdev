# LoopDev Infrastructure Roadmap

Este documento define la hoja de ruta para la evolución de los servicios de backend, persistencia y tiempo real de LoopDev OS.

## Fase 1: Auth & Tenancy (COMPLETADA)
- [x] Configuración de Supabase SSR.
- [x] Gestión de Tenants (Organizations).
- [x] Middleware de protección de rutas.

## Fase 2: Data Spine (EN PROGRESO)
- [x] Modelado de tablas base (`brands`, `profiles`).
- [ ] Implementación de `ModuleWorkspace` con datos reales.
- [ ] CRUD de Activos de Marketing.

## Fase 3: Live Ecosystem (PENDIENTE)
### 🚀 Hito: Realtime Notifications
Este hito activará la funcionalidad real del componente `NotificationCenter`.

1. **Database Persistence:**
   - Crear tabla `notifications` en Supabase.
   - Configurar Row Level Security (RLS) por `user_id` y `tenant_id`.
2. **Notification API:**
   - Crear Edge Functions para el disparo de alertas automáticas.
   - Implementar lógica de caducidad de notificaciones (Auto-purge).
3. **Custom Hook Integration:**
   - Refactorizar `useNotifications` para consumir el cliente de Supabase en lugar de Fixtures.
   - Implementar optimismo en UI (Optimistic Updates) al marcar como leído.
4. **Realtime Subscription:**
   - Conectar el hook a `supabase.channel('notifications')` para actualizaciones por WebSocket.

## Fase 4: Intelligence & Scaling
- [ ] Integración de AI Edge Functions para análisis de datos.
- [ ] Caché global con Redis para optimización de respuesta.
- [ ] Sistema de búsqueda global (⌘K) con pgvector.

---
*Gobernanza de Plataforma - LoopDev Engineering Board*
