-- Migration: Bot Real-time Metrics Columns
-- Description: Adds dedicated columns for real-time bot metrics (price, SMA, ATR) to enable efficient dashboard updates.
-- Metrics are updated every 60 seconds by the backend strategy manager and polled by frontend every 5 seconds.

-- Add metrics columns
ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS last_price DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_sma DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_atr DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_sentiment VARCHAR(50),
    ADD COLUMN IF NOT EXISTS last_metrics_update TIMESTAMPTZ;

-- Add column comments for documentation
COMMENT ON COLUMN public.quant_bots.last_price IS 'The most recent price fetched from the exchange for this trading pair.';
COMMENT ON COLUMN public.quant_bots.last_sma IS 'The Simple Moving Average (20 periods) calculated from the last 60 candles.';
COMMENT ON COLUMN public.quant_bots.last_atr IS 'The Average True Range (14 periods) for volatility measurement.';
COMMENT ON COLUMN public.quant_bots.last_sentiment IS 'Market sentiment derived from macro analysis or market regime detection (bullish/bearish/neutral).';
COMMENT ON COLUMN public.quant_bots.last_metrics_update IS 'Timestamp when these metrics were last updated by the backend strategy manager.';

-- Create index for efficient metric queries and filtering
CREATE INDEX IF NOT EXISTS idx_quant_bots_metrics_update 
    ON public.quant_bots(last_metrics_update DESC);

CREATE INDEX IF NOT EXISTS idx_quant_bots_last_price 
    ON public.quant_bots(last_price);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
