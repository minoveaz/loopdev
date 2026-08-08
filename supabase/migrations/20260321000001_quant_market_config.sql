-- 1. Crear tabla de Configuración de Ingesta de Mercado
CREATE TABLE IF NOT EXISTS public.quant_market_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pair VARCHAR(20) NOT NULL UNIQUE, -- Ej: 'BTC/USDT'
    is_active BOOLEAN DEFAULT true,
    retention_days INTEGER DEFAULT 30, -- Cuántos días de historia 1m guardamos
    fetch_interval VARCHAR(5) DEFAULT '1m', -- Granularidad base
    last_backfill_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE public.quant_market_config ENABLE ROW LEVEL SECURITY;

-- 3. Política de lectura/escritura (Solo administradores del sistema o lectura pública técnica)
CREATE POLICY "Allow read access to market config" 
ON public.quant_market_config FOR SELECT 
USING (true);

-- 4. Insertar los pares "Core" solicitados
INSERT INTO public.quant_market_config (pair, is_active, retention_days)
VALUES 
    ('BTC/USDT', true, 30),
    ('ETH/USDT', true, 30),
    ('XRP/USDT', true, 30)
ON CONFLICT (pair) DO UPDATE 
SET is_active = EXCLUDED.is_active;

-- 5. Trigger para actualizar updated_at
CREATE TRIGGER update_quant_market_config_modtime 
    BEFORE UPDATE ON public.quant_market_config 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. Comentarios técnicos
COMMENT ON TABLE public.quant_market_config IS 'Control panel for the Market Ingestor service. Defines which pairs to monitor 24/7.';
COMMENT ON COLUMN public.quant_market_config.pair IS 'Trading pair identifier (Binance Standard).';
