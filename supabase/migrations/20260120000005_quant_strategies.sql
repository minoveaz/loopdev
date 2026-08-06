-- Migration: Quant Ops Strategies & Backtesting
-- Description: Tables for defining trading logic and storing simulation performance.

-- 1. Table: quant_strategies (The Blueprint)
CREATE TABLE IF NOT EXISTS public.quant_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    exchange_id UUID REFERENCES public.quant_exchanges(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    mode TEXT NOT NULL CHECK (mode IN ('paper', 'live')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    
    -- Assets Targeted
    pairs TEXT[] DEFAULT '{}',
    
    -- Core Parameters
    size_per_trade DECIMAL NOT NULL DEFAULT 100,
    max_positions INTEGER NOT NULL DEFAULT 5,
    max_exposure DECIMAL NOT NULL DEFAULT 1000,
    
    -- Risk Guard
    stop_loss DECIMAL NOT NULL DEFAULT 2.0,
    take_profit DECIMAL NOT NULL DEFAULT 5.0,
    trailing_stop DECIMAL DEFAULT 0.0,
    cooldown_minutes INTEGER DEFAULT 60,
    daily_loss_limit DECIMAL DEFAULT 5.0,
    
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table: strategy_backtest_results (Performance History)
CREATE TABLE IF NOT EXISTS public.strategy_backtest_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES public.quant_strategies(id) ON DELETE CASCADE,
    
    -- Simulation Context
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'completed',
    
    -- Financial Performance
    initial_capital DECIMAL NOT NULL,
    final_capital DECIMAL NOT NULL,
    total_return DECIMAL NOT NULL,
    total_trades INTEGER NOT NULL,
    winning_trades INTEGER NOT NULL,
    losing_trades INTEGER NOT NULL,
    win_rate DECIMAL NOT NULL,
    
    -- Risk Metrics
    max_drawdown DECIMAL NOT NULL,
    profit_factor DECIMAL NOT NULL,
    sharpe_ratio DECIMAL,
    avg_win DECIMAL,
    avg_loss DECIMAL,
    
    -- Detailed Data (Audit Trail)
    trades JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- --- SECURITY: Row Level Security (RLS) ---

ALTER TABLE public.quant_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_backtest_results ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Tenant Isolation)
CREATE POLICY "Users can only view their tenant's strategies" ON public.quant_strategies FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Users can only view results of their strategies" ON public.strategy_backtest_results FOR ALL USING (
    strategy_id IN (SELECT id FROM public.quant_strategies WHERE tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000')
);

-- --- TRIGGERS ---
CREATE TRIGGER update_quant_strategies_modtime BEFORE UPDATE ON public.quant_strategies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- --- COMMENTS ---
COMMENT ON TABLE public.quant_strategies IS 'Trading logic definitions and risk parameters.';
COMMENT ON TABLE public.strategy_backtest_results IS 'Historical performance data for strategy simulations.';
