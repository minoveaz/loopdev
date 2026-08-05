-- Create quant_strategies table
CREATE TABLE IF NOT EXISTS quant_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  exchange_id UUID NOT NULL REFERENCES quant_exchanges(id) ON DELETE CASCADE,
  
  -- Mode and Status
  mode VARCHAR(20) DEFAULT 'paper', -- 'paper' | 'live'
  status VARCHAR(20) DEFAULT 'draft', -- 'draft' | 'active' | 'paused' | 'archived'
  
  -- Strategy Parameters
  pairs JSONB NOT NULL DEFAULT '[]', -- ['BTC/USD', 'ETH/USD']
  size_per_trade FLOAT DEFAULT 100.0,
  max_positions INTEGER DEFAULT 5,
  max_exposure FLOAT DEFAULT 50.0, -- % of capital
  stop_loss FLOAT DEFAULT 2.0, -- % below entry
  take_profit FLOAT DEFAULT 5.0, -- % above entry
  trailing_stop FLOAT DEFAULT 1.0, -- % for trailing stops
  cooldown_minutes INTEGER DEFAULT 60,
  rebuy_policy VARCHAR(50) DEFAULT 'disabled', -- 'disabled' | 'immediate' | 'after_cooldown'
  daily_loss_limit FLOAT DEFAULT 10.0, -- % of daily capital
  
  -- Metadata
  description TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_executed_at TIMESTAMP WITH TIME ZONE,
  
  -- Backtest metadata
  last_backtest_at TIMESTAMP WITH TIME ZONE,
  last_backtest_result UUID REFERENCES strategy_backtest_results(id) ON DELETE SET NULL
);

-- Create strategy_backtest_results table
CREATE TABLE IF NOT EXISTS strategy_backtest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID NOT NULL REFERENCES quant_strategies(id) ON DELETE CASCADE,
  
  -- Time period tested
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Results
  initial_capital FLOAT,
  final_capital FLOAT,
  total_return FLOAT, -- %
  total_trades INTEGER,
  winning_trades INTEGER,
  losing_trades INTEGER,
  win_rate FLOAT, -- %
  avg_win FLOAT,
  avg_loss FLOAT,
  profit_factor FLOAT,
  max_drawdown FLOAT, -- %
  sharpe_ratio FLOAT,
  
  -- Orders executed
  trades JSONB NOT NULL DEFAULT '[]', -- Full trade history
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' -- 'pending' | 'running' | 'completed' | 'failed'
);

-- Create strategy_positions table (for live/paper trading)
CREATE TABLE IF NOT EXISTS strategy_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID NOT NULL REFERENCES quant_strategies(id) ON DELETE CASCADE,
  
  -- Position Info
  pair VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL, -- 'buy' | 'sell'
  entry_price FLOAT NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quantity FLOAT NOT NULL,
  
  -- Exit Info
  exit_price FLOAT,
  exit_time TIMESTAMP WITH TIME ZONE,
  stop_loss_price FLOAT,
  take_profit_price FLOAT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'open', -- 'open' | 'closed' | 'stopped'
  pnl FLOAT, -- Profit/Loss
  pnl_pct FLOAT, -- P&L %
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_quant_strategies_tenant_id ON quant_strategies(tenant_id);
CREATE INDEX idx_quant_strategies_exchange_id ON quant_strategies(exchange_id);
CREATE INDEX idx_quant_strategies_status ON quant_strategies(status);
CREATE INDEX idx_strategy_backtest_results_strategy_id ON strategy_backtest_results(strategy_id);
CREATE INDEX idx_strategy_positions_strategy_id ON strategy_positions(strategy_id);
CREATE INDEX idx_strategy_positions_status ON strategy_positions(status);

-- Enable RLS (Row Level Security)
ALTER TABLE quant_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_backtest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_positions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own strategies"
  ON quant_strategies FOR SELECT
  USING (tenant_id = (SELECT auth.uid() FROM auth.users));

CREATE POLICY "Users can insert their own strategies"
  ON quant_strategies FOR INSERT
  WITH CHECK (tenant_id = (SELECT auth.uid() FROM auth.users));

CREATE POLICY "Users can update their own strategies"
  ON quant_strategies FOR UPDATE
  USING (tenant_id = (SELECT auth.uid() FROM auth.users));

CREATE POLICY "Users can delete their own strategies"
  ON quant_strategies FOR DELETE
  USING (tenant_id = (SELECT auth.uid() FROM auth.users));
