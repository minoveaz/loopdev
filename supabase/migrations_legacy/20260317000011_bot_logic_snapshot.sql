-- Migration: Bot Logic Snapshot
-- Description: Adds a column to store the latest technical calculations for audit/UI.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS last_logic_snapshot JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.quant_bots.last_logic_snapshot IS 'Real-time indicators and strategy math (SMA, ATR, RSI, etc.) for UI visualization.';
