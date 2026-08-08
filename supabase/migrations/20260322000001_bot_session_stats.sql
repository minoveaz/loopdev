-- 1. Añadir columnas de estadísticas de sesión a la tabla quant_bots
-- Permite el rastreo de Social Proof y rendimiento histórico por bot.

ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS winning_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS losing_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_pnl_pct NUMERIC DEFAULT 0;

-- 2. Comentarios técnicos para PostgREST/UI
COMMENT ON COLUMN public.quant_bots.total_trades IS 'Contador de operaciones cerradas en la sesión actual.';
COMMENT ON COLUMN public.quant_bots.winning_trades IS 'Operaciones cerradas con PnL > 0.';
COMMENT ON COLUMN public.quant_bots.losing_trades IS 'Operaciones cerradas con PnL <= 0.';
COMMENT ON COLUMN public.quant_bots.avg_pnl_pct IS 'Promedio de beneficio porcentual de la sesión activa.';
