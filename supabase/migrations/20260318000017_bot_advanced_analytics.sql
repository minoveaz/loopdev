-- Migration: Bot Advanced Analytics
-- Description: Adds columns for inventory, macro sentiment, and price history for sparklines.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_quantity DECIMAL DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS macro_sentiment TEXT DEFAULT 'neutral', -- bullish, bearish, neutral
    ADD COLUMN IF NOT EXISTS price_history_1h JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.quant_bots.current_quantity IS 'Exact amount of the asset currently held in the position.';
COMMENT ON COLUMN public.quant_bots.macro_sentiment IS 'Trend sentiment based on 4h/1d timeframe analysis.';
COMMENT ON COLUMN public.quant_bots.price_history_1h IS 'Latest 60 price points (1m interval) for sparkline visualization.';

NOTIFY pgrst, 'reload schema';
