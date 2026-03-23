-- Añadir columna para historial de precios rápido (Sparkline)
ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS price_history_1h JSONB DEFAULT '[]';

COMMENT ON COLUMN public.quant_bots.price_history_1h IS 'Array de los últimos 20-30 precios de cierre para el gráfico Sparkline de la UI.';
