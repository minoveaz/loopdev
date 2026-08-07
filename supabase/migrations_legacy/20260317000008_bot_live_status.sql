-- Migration: Bot Live Status Tracking
-- Description: Adds a column to track the real-time activity of each bot.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_action TEXT DEFAULT 'Engine_Idle';

COMMENT ON COLUMN public.quant_bots.current_action IS 'Narrative of what the bot is doing in its current loop (e.g., Scanning Market, Awaiting Signal).';
