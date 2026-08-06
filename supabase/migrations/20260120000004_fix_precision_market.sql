-- FIX: Ensure High Precision for Market Data
-- Run this in Supabase SQL Editor

ALTER TABLE public.quant_market_history 
  ALTER COLUMN open TYPE DECIMAL USING open::decimal,
  ALTER COLUMN high TYPE DECIMAL USING high::decimal,
  ALTER COLUMN low TYPE DECIMAL USING low::decimal,
  ALTER COLUMN close TYPE DECIMAL USING close::decimal,
  ALTER COLUMN volume TYPE DECIMAL USING volume::decimal;

-- Verify with a comment
COMMENT ON TABLE public.quant_market_history IS 'Refactored to DECIMAL for high precision trading.';
