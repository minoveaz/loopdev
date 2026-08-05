-- Añadir campos de auditoría financiera a la tabla de órdenes
ALTER TABLE public.quant_orders 
ADD COLUMN IF NOT EXISTS fee_usdt BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS pnl_pct NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.quant_orders.fee_usdt IS 'Comisión de la operación en centavos.';
COMMENT ON COLUMN public.quant_orders.pnl_pct IS 'Resultado porcentual de la operación (solo para cierres).';
