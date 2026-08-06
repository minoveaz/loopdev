-- Migration: Add is_paper flag to exchanges
-- Description: Allows distinguishing between Sandbox/Testnet and Real accounts.

ALTER TABLE public.quant_exchanges 
    ADD COLUMN IF NOT EXISTS is_paper BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.quant_exchanges.is_paper IS 'If true, the bot will use Sandbox/Testnet mode for this exchange account.';

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
