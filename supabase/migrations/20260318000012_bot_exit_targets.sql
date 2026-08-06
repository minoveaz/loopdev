-- Migration: Bot Exit Targets Tracking
-- Description: Adds a column to store current SL/TP prices for UI visualization.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS last_exit_targets JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.quant_bots.last_exit_targets IS 'Current Stop Loss and Take Profit price targets for the open position.';
