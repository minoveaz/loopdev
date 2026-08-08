-- Migration: Quant Ops Certified Assets
-- Description: Establishes the authoritative source for tradable assets and pairs.

CREATE TABLE IF NOT EXISTS public.quant_assets (
    symbol TEXT PRIMARY KEY, -- Authoritative symbol (e.g., BTC/USDT, GOLD/USD)
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('crypto', 'commodity', 'forex', 'index')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with initial certified assets
INSERT INTO public.quant_assets (symbol, name, category)
VALUES 
    ('BTC/USDT', 'Bitcoin', 'crypto'),
    ('ETH/USDT', 'Ethereum', 'crypto'),
    ('SOL/USDT', 'Solana', 'crypto'),
    ('BNB/USDT', 'Binance Coin', 'crypto'),
    ('GOLD/USD', 'Gold Spot', 'commodity'),
    ('SILVER/USD', 'Silver Spot', 'commodity'),
    ('OIL/USD', 'Crude Oil', 'commodity'),
    ('EUR/USD', 'Euro / US Dollar', 'forex')
ON CONFLICT (symbol) DO NOTHING;

-- Enable RLS (Read-only for all authenticated users)
ALTER TABLE public.quant_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certified assets are viewable by all users" ON public.quant_assets FOR SELECT USING (true);

-- Comment for documentation
COMMENT ON TABLE public.quant_assets IS 'Authorized assets available for trading bot deployment.';
