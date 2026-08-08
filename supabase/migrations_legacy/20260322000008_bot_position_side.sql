-- Añadir dirección de la posición actual (LONG o SHORT)
ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS current_position_side TEXT DEFAULT NULL;

COMMENT ON COLUMN public.quant_bots.current_position_side IS 'Indica la dirección de la operación abierta: LONG o SHORT.';
