-- Migration: Quant Ops Suite Initial Schema
-- Description: Sets up the industrial-grade tables for trading bots, exchanges, and orders.

-- 1. Table: quant_exchanges (Encrypted Credentials)
CREATE TABLE IF NOT EXISTS public.quant_exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Binance Main', 'Binance Paper'
    exchange_provider TEXT NOT NULL DEFAULT 'binance',
    api_key TEXT NOT NULL, -- To be encrypted/decrypted via app-level vault
    api_secret TEXT NOT NULL, -- To be encrypted/decrypted
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table: quant_bots (Bot Configuration)
CREATE TABLE IF NOT EXISTS public.quant_bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    exchange_id UUID REFERENCES public.quant_exchanges(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    pair TEXT NOT NULL, -- e.g., 'BTC/USDT'
    strategy_id TEXT NOT NULL, -- e.g., 'intraday-atr-v1'
    status TEXT NOT NULL DEFAULT 'paper_trading', -- active, paused, emergency_stop, paper_trading
    
    -- Investment & Risk Configuration
    base_investment_usdt DECIMAL NOT NULL,
    risk_profile JSONB NOT NULL DEFAULT '{
        "maxDailyLossPct": 2,
        "globalStopLossPct": 5,
        "maxRebuys": 3,
        "maxExposureUsdt": 100
    }'::jsonb,
    
    -- Legacy Rescued Flags
    use_initial_range_filter BOOLEAN DEFAULT true,
    use_market_regime_filter BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table: quant_orders (Execution Audit Trail)
CREATE TABLE IF NOT EXISTS public.quant_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    bot_id UUID REFERENCES public.quant_bots(id) ON DELETE CASCADE,
    exchange_order_id TEXT, -- ID from Binance/ccxt
    side TEXT NOT NULL, -- buy, sell
    type TEXT NOT NULL, -- market, limit, etc.
    status TEXT NOT NULL, -- open, filled, canceled, failed
    quantity DECIMAL NOT NULL,
    price DECIMAL,
    filled_quantity DECIMAL DEFAULT 0,
    average_fill_price DECIMAL,
    fee_amount DECIMAL,
    fee_currency TEXT,
    signal_source TEXT, -- Why was this order created?
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table: quant_positions (Real-time Portfolio State)
CREATE TABLE IF NOT EXISTS public.quant_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    bot_id UUID UNIQUE REFERENCES public.quant_bots(id) ON DELETE CASCADE,
    pair TEXT NOT NULL,
    entry_price DECIMAL NOT NULL,
    average_price DECIMAL NOT NULL,
    total_quantity DECIMAL NOT NULL,
    total_invested_usdt DECIMAL NOT NULL,
    rebuys_count INTEGER DEFAULT 0,
    unrealized_pnl_usdt DECIMAL DEFAULT 0,
    unrealized_pnl_pct DECIMAL DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- --- SECURITY: Row Level Security (RLS) ---

ALTER TABLE public.quant_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_positions ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Tenant Isolation)
CREATE POLICY "Users can only view their tenant's exchanges" ON public.quant_exchanges FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Users can only view their tenant's bots" ON public.quant_bots FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Users can only view their tenant's orders" ON public.quant_orders FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Users can only view their tenant's positions" ON public.quant_positions FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');

-- --- TRIGGERS for updated_at ---
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quant_exchanges_modtime BEFORE UPDATE ON public.quant_exchanges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quant_bots_modtime BEFORE UPDATE ON public.quant_bots FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- --- COMMENTS ---
COMMENT ON TABLE public.quant_exchanges IS 'Stores exchange API credentials for bots. Credentials must be encrypted.';
COMMENT ON TABLE public.quant_bots IS 'Main configuration table for trading bots.';
COMMENT ON TABLE public.quant_orders IS 'Full history of orders sent to exchanges.';
COMMENT ON TABLE public.quant_positions IS 'Dynamic state of active trading positions for real-time monitoring.';
