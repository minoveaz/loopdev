-- Migration: Asset to Provider Mapping
-- Description: Links certified assets to specific exchange providers to prevent invalid bot deployments.

ALTER TABLE public.quant_assets ADD COLUMN IF NOT EXISTS providers TEXT[] DEFAULT '{binance}';

-- Update mapping for existing assets
UPDATE public.quant_assets SET providers = '{binance}' WHERE symbol IN ('BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'PAXG/USDT');
UPDATE public.quant_assets SET providers = '{ibkr, metatrader}' WHERE symbol IN ('GOLD/USD', 'SILVER/USD', 'OIL/USD', 'EUR/USD');

-- Add Paxos Gold (Physical Gold backed crypto) for Binance users
INSERT INTO public.quant_assets (symbol, name, category, providers)
VALUES ('PAXG/USDT', 'Paxos Gold', 'crypto', '{binance}')
ON CONFLICT (symbol) DO UPDATE SET providers = '{binance}';

COMMENT ON COLUMN public.quant_assets.providers IS 'List of exchange providers that support this specific asset symbol.';
