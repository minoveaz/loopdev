-- Migration: Bot Real-time PnL Columns
-- Description: Adds dedicated columns for PnL percentage and value for cleaner UI access.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_pnl_pct DECIMAL DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS current_pnl_usdt DECIMAL DEFAULT 0.0;

COMMENT ON COLUMN public.quant_bots.current_pnl_pct IS 'Latest calculated PnL percentage for the active position.';
COMMENT ON COLUMN public.quant_bots.current_pnl_usdt IS 'Latest calculated PnL value in USDT for the active position.';

NOTIFY pgrst, 'reload schema';
