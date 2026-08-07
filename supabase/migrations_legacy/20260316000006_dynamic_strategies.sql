-- Migration: Dynamic Strategy Parameters
-- Description: Adds flexibility to store core identifiers and custom parameter blocks.

ALTER TABLE public.quant_strategies 
    ADD COLUMN IF NOT EXISTS core_id TEXT NOT NULL DEFAULT 'atr-breakout-v1',
    ADD COLUMN IF NOT EXISTS parameters JSONB DEFAULT '{}'::jsonb;

-- Update existing records if any
UPDATE public.quant_strategies 
SET core_id = 'atr-breakout-v1' 
WHERE core_id IS NULL;

-- Comment for documentation
COMMENT ON COLUMN public.quant_strategies.core_id IS 'Identifier of the Python logic engine to execute.';
COMMENT ON COLUMN public.quant_strategies.parameters IS 'Strategy-specific settings (e.g., RSI periods, multiplier values).';
