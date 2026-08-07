-- 1. Añadir columna trading_style a la tabla de estrategias
ALTER TABLE public.quant_strategies 
ADD COLUMN IF NOT EXISTS trading_style TEXT DEFAULT 'DAY_TRADING';

-- 2. Actualizar las estrategias existentes a sus perfiles correctos
UPDATE public.quant_strategies SET trading_style = 'SCALPING' WHERE core_id IN ('rsi-mean-rev-v1', 'aggressive-rsi-v1');
UPDATE public.quant_strategies SET trading_style = 'DAY_TRADING' WHERE core_id IN ('atr-breakout-v1', 'hybrid-core-v1');

-- 3. Documentación técnica
COMMENT ON COLUMN public.quant_strategies.trading_style IS 'Define el horizonte temporal y agresividad: SCALPING, DAY_TRADING, SWING.';
