-- Migration: Market Data Schema (Industrial Precision)
-- Description: Creates or updates the market history table to support high-precision trading data.

-- 1. Table: quant_market_history
CREATE TABLE IF NOT EXISTS public.quant_market_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair TEXT NOT NULL,
    environment TEXT NOT NULL, -- production, testnet
    timeframe TEXT NOT NULL, -- 1m, 5m, 1h, etc.
    open DECIMAL NOT NULL,
    high DECIMAL NOT NULL,
    low DECIMAL NOT NULL,
    close DECIMAL NOT NULL,
    volume DECIMAL NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraint to prevent duplicates
    UNIQUE(pair, environment, timeframe, timestamp)
);

-- 2. Indexes for high-performance strategy calculation
CREATE INDEX IF NOT EXISTS idx_market_history_pair_ts ON public.quant_market_history (pair, timeframe, timestamp DESC);

-- 3. Table: quant_market_config (Active Tickers)
CREATE TABLE IF NOT EXISTS public.quant_market_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    min_notional DECIMAL,
    price_precision INTEGER,
    qty_precision INTEGER,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Realtime for live updates in Dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.quant_market_history;

-- 5. RLS Policies
ALTER TABLE public.quant_market_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for market data" ON public.quant_market_history FOR SELECT USING (true);
