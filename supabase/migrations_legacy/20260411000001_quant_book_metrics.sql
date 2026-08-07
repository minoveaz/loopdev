-- 2026-04-11: Implementación de métricas de Order Book (L2)
-- Propósito: Almacenar snapshots de presión de mercado, desequilibrio de órdenes y liquidez.

-- 1. Crear la tabla de métricas del libro
CREATE TABLE IF NOT EXISTS public.quant_book_metrics (
    pair TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    imbalance_pct FLOAT NOT NULL, -- Ratio de presión: +1.0 (Compradores), -1.0 (Vendedores)
    spread_pct FLOAT NOT NULL,    -- Diferencia porcentual entre Bid y Ask
    mid_price BIGINT NOT NULL,    -- Precio medio en cents (fuente de verdad instantánea)
    depth_usdt FLOAT NOT NULL,    -- Volumen total en USDT detectado en el Top 20
    metadata JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (pair, timestamp)
);

-- 2. Habilitar Realtime
-- Esto permitirá que el frontend muestre la "barra de presión" moviéndose en vivo
ALTER TABLE public.quant_book_metrics REPLICA IDENTITY FULL;

-- 3. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_book_metrics_timestamp ON public.quant_book_metrics (timestamp DESC);

-- 4. Registrar el nuevo componente en la tabla de salud
INSERT INTO public.quant_system_health (component_id, status, metadata)
VALUES ('BOOK_INGESTOR', 'OFFLINE', '{"version": "1.0.0", "description": "L2 Order Flow Engine"}'::jsonb)
ON CONFLICT (component_id) DO UPDATE SET status = 'OFFLINE';
