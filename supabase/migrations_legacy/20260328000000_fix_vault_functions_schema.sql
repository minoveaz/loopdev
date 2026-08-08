-- Migration: Move Vault functions to public schema
-- Description: Makes decryption functions accessible via Supabase RPC.

-- 1. Create or Replace in public schema for RPC accessibility
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_text text, secret_key text)
RETURNS text AS $$
BEGIN
    RETURN pgp_sym_decrypt(decode(encrypted_text, 'base64'), secret_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.encrypt_api_key(plaintext text, secret_key text)
RETURNS text AS $$
BEGIN
    RETURN encode(pgp_sym_encrypt(plaintext, secret_key), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Grant permissions
ALTER FUNCTION public.decrypt_api_key(text, text) OWNER TO postgres;
ALTER FUNCTION public.encrypt_api_key(text, text) OWNER TO postgres;

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
