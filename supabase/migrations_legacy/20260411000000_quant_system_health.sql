-- 2026-04-11: Implementación de monitoreo de salud industrial
-- Propósito: Tracking de latidos (heartbeats) para Ingestor y Motores de Señales.

-- 1. Crear la tabla de salud del sistema
CREATE TABLE IF NOT EXISTS public.quant_system_health (
    component_id TEXT PRIMARY KEY,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'ONLINE',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Habilitar permisos de lectura/escritura (Realtime)
-- Esto permite que el frontend reciba actualizaciones instantáneas del estado del motor
ALTER TABLE public.quant_system_health REPLICA IDENTITY FULL;

-- 3. Insertar el registro inicial para el Ingestor Sentinel
INSERT INTO public.quant_system_health (component_id, status, metadata)
VALUES ('INGESTOR_SENTINEL', 'ONLINE', '{"version": "3.2.1-Hardened"}'::jsonb)
ON CONFLICT (component_id) DO UPDATE SET status = 'ONLINE', last_heartbeat = NOW();
