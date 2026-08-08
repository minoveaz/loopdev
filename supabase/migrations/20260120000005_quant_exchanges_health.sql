-- Migration: Quant Exchanges Health Monitoring
-- Description: Adds columns to track real-time connectivity status and error messages from brokers.

ALTER TABLE public.quant_exchanges
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_error_message TEXT;

COMMENT ON COLUMN public.quant_exchanges.last_verified_at IS 'The last time the credentials were successfully or unsuccessfully tested against the exchange API.';
COMMENT ON COLUMN public.quant_exchanges.last_error_message IS 'Stores the last error response from the broker (e.g., "Invalid API Key").';
