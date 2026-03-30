-- Añadir columna de latencia al historial de mercado
ALTER TABLE public.quant_market_history 
ADD COLUMN IF NOT EXISTS latency_ms INT DEFAULT 0;

COMMENT ON COLUMN public.quant_market_history.latency_ms IS 'Tiempo de respuesta del exchange en milisegundos.';
