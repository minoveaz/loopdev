-- Añadir configuración de agresividad para el Trailing Stop
ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS trailing_stop_distance NUMERIC DEFAULT 1.0;

COMMENT ON COLUMN public.quant_bots.trailing_stop_distance IS 'Distancia porcentual (Callback Rate) para el Trailing Stop. Ej: 1.0 = 1% de distancia del pico máximo.';
