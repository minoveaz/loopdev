-- Migration: Bot Position Clock
-- Description: Adds a column to track the exact moment a position was opened for duration analysis.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_position_opened_at TIMESTAMPTZ;

COMMENT ON COLUMN public.quant_bots.current_position_opened_at IS 'The exact timestamp when the current active position was opened.';

NOTIFY pgrst, 'reload schema';
