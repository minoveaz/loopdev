-- Añadir memoria de precio pico para gestión de Trailing Stop
ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS current_position_max_price BIGINT DEFAULT 0;

COMMENT ON COLUMN public.quant_bots.current_position_max_price IS 'El precio más alto (en centavos) alcanzado por el par desde que se abrió la posición actual.';
