-- Migration: Bot Entry Price Column
-- Description: Adds a column to store the entry price of the current position for UI visualization.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS current_entry_price DECIMAL DEFAULT 0.0;

COMMENT ON COLUMN public.quant_bots.current_entry_price IS 'The price at which the bot opened the current active position.';

NOTIFY pgrst, 'reload schema';
