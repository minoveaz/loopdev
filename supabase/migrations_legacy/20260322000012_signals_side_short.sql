-- Actualizar la restricción de 'side' para permitir SHORTS
ALTER TABLE public.quant_signals 
DROP CONSTRAINT IF EXISTS quant_signals_side_check;

ALTER TABLE public.quant_signals 
ADD CONSTRAINT quant_signals_side_check 
CHECK (side IN ('BUY', 'SELL', 'EXIT', 'SHORT'));

COMMENT ON COLUMN public.quant_signals.side IS 'Dirección de la señal: BUY (Long), SHORT (Venta en corto), EXIT (Cierre).';
