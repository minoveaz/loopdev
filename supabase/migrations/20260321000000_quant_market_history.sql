-- 1. Definir el ENUM de entornos de trading si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trading_environment') THEN
        CREATE TYPE trading_environment AS ENUM ('testnet', 'production');
    END IF;
END $$;

-- 2. Crear tabla de Histórico de Mercado (OHLCV)
CREATE TABLE IF NOT EXISTS public.quant_market_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pair VARCHAR(20) NOT NULL, -- Ej: 'BTC/USDT'
    environment trading_environment NOT NULL DEFAULT 'testnet',
    timeframe VARCHAR(5) NOT NULL, -- Ej: '1m', '5m', '1h'
    open NUMERIC NOT NULL,
    high NUMERIC NOT NULL,
    low NUMERIC NOT NULL,
    close NUMERIC NOT NULL,
    volume NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    provider VARCHAR(20) DEFAULT 'binance',
    created_at TIMESTAMPTZ DEFAULT now(),

    -- Restricción de unicidad para evitar duplicados en el mismo tick
    CONSTRAINT unique_market_tick UNIQUE(pair, environment, timeframe, timestamp)
);

-- 3. Índices de alta velocidad para motores de estrategia
-- Buscamos casi siempre por par + entorno + tiempo para calcular RSI/SMA
CREATE INDEX IF NOT EXISTS idx_market_history_query 
ON public.quant_market_history (pair, environment, timeframe, timestamp DESC);

-- 4. Habilitar RLS (Seguridad)
ALTER TABLE public.quant_market_history ENABLE ROW LEVEL SECURITY;

-- 5. Política de lectura (Pública para lectura técnica, restringida por Tenant si fuera necesario en el futuro)
CREATE POLICY "Allow public read access to market history" 
ON public.quant_market_history FOR SELECT 
USING (true);

-- 6. Comentarios técnicos
COMMENT ON TABLE public.quant_market_history IS 'Unified time-series storage for market candles (Testnet & Production).';
COMMENT ON COLUMN public.quant_market_history.environment IS 'Separates simulation data from real market data to prevent strategy contamination.';
