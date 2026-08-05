-- Migration: Encrypt existing API keys
-- Description: Converts plaintext API keys to encrypted format using the vault secret.
-- Note: This uses the default secret 'loopdev-default-vault-secret-2026'. 
-- If you changed QUANT_VAULT_SECRET, update this script accordingly.

UPDATE public.quant_exchanges 
SET 
    api_key = public.encrypt_api_key(api_key, 'loopdev-default-vault-secret-2026'),
    api_secret = public.encrypt_api_key(api_secret, 'loopdev-default-vault-secret-2026')
WHERE 
    -- Security filter: only update if not already encrypted (heuristic)
    api_key NOT LIKE 'wy4%';

-- Documentation update
COMMENT ON TABLE public.quant_exchanges IS 'Stores exchange credentials. API Keys are encrypted via public.encrypt_api_key.';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
