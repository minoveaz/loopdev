-- Migration: Setup Binance Testnet with Secure Vault
-- Description: Configures the exchange account to use Testnet mode and encrypts the keys.
-- INSTRUCTIONS: Replace 'TU_API_KEY' and 'TU_API_SECRET' with your real Binance Testnet keys.

-- 1. Ensure the is_paper flag exists in the schema
ALTER TABLE public.quant_exchanges 
    ADD COLUMN IF NOT EXISTS is_paper BOOLEAN DEFAULT FALSE;

-- 2. Configure the account for Testnet and encrypt credentials
-- Note: Uses the default vault secret 'loopdev-default-vault-secret-2026'
UPDATE public.quant_exchanges 
SET 
    api_key = public.encrypt_api_key('TU_API_KEY', 'loopdev-default-vault-secret-2026'),
    api_secret = public.encrypt_api_key('TU_API_SECRET', 'loopdev-default-vault-secret-2026'),
    is_paper = true,
    last_error_message = NULL,
    last_verified_at = NOW()
WHERE name = 'Binance_Testnet_Industrial' 
   OR exchange_provider = 'binance';

-- 3. Notify PostgREST to refresh the schema cache
NOTIFY pgrst, 'reload schema';
