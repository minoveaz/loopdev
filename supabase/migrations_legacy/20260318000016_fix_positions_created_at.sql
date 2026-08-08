-- Migration: Fix quant_positions missing created_at
-- Description: Adds created_at column to quant_positions to track the exact trade start time.

ALTER TABLE public.quant_positions 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

COMMENT ON COLUMN public.quant_positions.created_at IS 'The timestamp when the position was first opened.';

NOTIFY pgrst, 'reload schema';
