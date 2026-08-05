-- 1. Convertir columnas de precio y PnL en quant_bots a BIGINT (Cents)
-- Esto unifica la precisión en toda la arquitectura industrial.

ALTER TABLE public.quant_bots 
    ALTER COLUMN last_price TYPE BIGINT USING (last_price * 100)::BIGINT,
    ALTER COLUMN current_entry_price TYPE BIGINT USING (current_entry_price * 100)::BIGINT,
    ALTER COLUMN current_pnl_usdt TYPE BIGINT USING (current_pnl_usdt * 100)::BIGINT,
    ALTER COLUMN realized_pnl_usdt TYPE BIGINT USING (realized_pnl_usdt * 100)::BIGINT;

-- Nota: base_investment_usdt se mantiene como NUMERIC para permitir montos exactos de inversión,
-- pero los resultados operativos (precios y beneficios) siempre serán Cents.

COMMENT ON COLUMN public.quant_bots.last_price IS 'Current market price in Cents.';
COMMENT ON COLUMN public.quant_bots.current_entry_price IS 'Entry price of active position in Cents.';
