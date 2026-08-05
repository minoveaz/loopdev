-- Migration: Add support for SHORT Trailing Stop
-- Description: Adds current_position_min_price column to track price floors during shorts.
-- Created: 2026-03-26

-- Add min price tracking column (stored in cents for BIGINT consistency)
ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_position_min_price BIGINT DEFAULT 0;

-- Documentation
COMMENT ON COLUMN public.quant_bots.current_position_min_price IS 'Tracks the lowest price reached during a SHORT position for trailing stop calculations.';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
