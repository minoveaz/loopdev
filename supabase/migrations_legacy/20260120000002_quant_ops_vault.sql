-- Migration: Quant Ops Security Vault (Corrected)
-- Description: Enables encryption for API Keys using pgcrypto without colliding with Supabase internal vault.

-- 1. Enable pgcrypto extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Define a dedicated security schema for trading
CREATE SCHEMA IF NOT EXISTS quant_security;

-- 3. Utility functions for Transparent Encryption
-- These are stored in quant_security to avoid permission issues with internal schemas.

CREATE OR REPLACE FUNCTION quant_security.encrypt_api_key(plaintext text, secret_key text)
RETURNS text AS $$
BEGIN
    RETURN encode(pgp_sym_encrypt(plaintext, secret_key), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION quant_security.decrypt_api_key(encrypted_text text, secret_key text)
RETURNS text AS $$
BEGIN
    RETURN pgp_sym_decrypt(decode(encrypted_text, 'base64'), secret_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update quant_exchanges to enforce a check or hint
COMMENT ON COLUMN public.quant_exchanges.api_key IS 'Store only base64 encoded pgcrypto strings encrypted via quant_security functions.';
COMMENT ON COLUMN public.quant_exchanges.api_secret IS 'Store only base64 encoded pgcrypto strings encrypted via quant_security functions.';
