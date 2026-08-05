'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Types
export interface Strategy {
  id: string;
  name: string;
  exchange: string;
  mode: 'paper' | 'live';
  status: 'draft' | 'active' | 'paused' | 'archived';
  tradingStyle?: 'SCALPING' | 'DAY_TRADING' | 'SWING';
  pairs: string[];
  capitalAllocated: number;
  openPositions: number;
  pnl7d: number;
  pnl30d: number;
  drawdown: number;
  riskScore: number;
  version: number;
  createdAt: string;
}

interface StrategyParams {
  name: string;
  exchangeId: string;
  mode: 'paper' | 'live';
  pairs: string[];
  sizePerTrade: number;
  maxPositions: number;
  maxExposure: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: number;
  cooldownMinutes: number;
  dailyLossLimit: number;
  description?: string;
}

interface BacktestParams {
  strategyId?: string;
  strategyName: string;
  pairs: string[];
  sizePerTrade: number;
  maxPositions: number;
  stopLoss: number;
  takeProfit: number;
  days?: number;
  initialCapital?: number;
}

interface RawStrategy {
  id: string;
  name: string;
  exchange_provider: string;
  mode: 'paper' | 'live';
  status: 'draft' | 'active' | 'paused' | 'archived';
  pairs: string[];
  version: number;
  created_at: string;
  trading_style?: Strategy['tradingStyle'];
}

interface BacktestResult {
  strategyName: string;
  backtestPeriodDays: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  initialCapital: number;
  finalCapital: number;
  trades: Array<{ entry_time: string; exit_time?: string; entry_price: number; exit_price?: number; quantity: number; pair: string; side: string; pnl?: number; pnl_pct?: number; reason?: string }>;
}

/**
 * @hook useStrategies
 * @description Manage trading strategies - creation, backtesting, execution
 */
export const useStrategies = () => {
  const queryClient = useQueryClient();

  // 1. Fetch all strategies
  const { data: strategies = [], isLoading, error } = useQuery({
    queryKey: ['trading', 'strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map raw data to Strategy interface
      return (data || []).map((raw: RawStrategy) => ({
        id: raw.id,
        name: raw.name,
        exchange: raw.exchange_provider || 'unknown',
        mode: raw.mode,
        status: raw.status,
        tradingStyle: raw.trading_style || 'DAY_TRADING',
        pairs: raw.pairs || [],
        capitalAllocated: 0, // TODO: Calculate from positions
        openPositions: 0, // TODO: Count from positions table
        pnl7d: 0, // TODO: Calculate from trades
        pnl30d: 0, // TODO: Calculate from trades
        drawdown: 0, // TODO: Get from backtest results
        riskScore: 0, // TODO: Calculate from parameters
        version: raw.version,
        createdAt: new Date(raw.created_at).toLocaleString()
      })) as Strategy[];
    }
  });

  // 2. Fetch Strategy Registry (Cores) from Python Engine
  const { data: registry = [] } = useQuery({
    queryKey: ['trading', 'strategy-registry'],
    queryFn: async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/strategies/registry');
        const data = await response.json();
        return data.success ? data.registry : [];
      } catch {
        console.warn('Quant Core Engine not reachable at 127.0.0.1:8000. Using fallback.');
        return [];
      }
    }
  });

  // 3. Create Strategy Mutation
  const createStrategy = useMutation({
    mutationFn: async (params: StrategyParams) => {
      console.debug('[createStrategy] Creating strategy:', params.name);

      const { data, error } = await supabase
        .from('quant_strategies')
        .insert([{
          tenant_id: '00000000-0000-0000-0000-000000000000', // Demo
          name: params.name,
          exchange_id: params.exchangeId,
          mode: params.mode,
          status: 'draft',
          pairs: params.pairs,
          size_per_trade: params.sizePerTrade,
          max_positions: params.maxPositions,
          max_exposure: params.maxExposure,
          stop_loss: params.stopLoss,
          take_profit: params.takeProfit,
          trailing_stop: params.trailingStop,
          cooldown_minutes: params.cooldownMinutes,
          daily_loss_limit: params.dailyLossLimit,
          description: params.description || null
        }])
        .select();

      if (error) {
        console.error('[createStrategy] Error:', error);
        throw error;
      }

      console.debug('[createStrategy] Successfully created:', data?.[0]?.id);
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'strategies'] });
    }
  });

  // 3. Run Backtest Mutation
  const runBacktest = useMutation({
    mutationFn: async (params: BacktestParams) => {
      console.debug('[runBacktest] Starting backtest:', params.strategyName);

      const response = await fetch('http://127.0.0.1:8000/strategies/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyName: params.strategyName,
          pairs: params.pairs,
          sizePerTrade: params.sizePerTrade,
          maxPositions: params.maxPositions,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
          days: params.days || 30,
          initialCapital: params.initialCapital || 10000.0
        })
      });

      const result = await response.json();
      console.debug('[runBacktest] Response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Backtest failed');
      }

      // If we have a strategyId, save backtest results
      if (params.strategyId && result.result) {
        console.debug('[runBacktest] Saving backtest results to Supabase');
        const { error: saveError } = await supabase
          .from('strategy_backtest_results')
          .insert([{
            strategy_id: params.strategyId,
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            initial_capital: result.result.initialCapital,
            final_capital: result.result.finalCapital,
            total_return: result.result.totalReturn,
            total_trades: result.result.totalTrades,
            winning_trades: result.result.winningTrades,
            losing_trades: result.result.losingTrades,
            win_rate: result.result.winRate,
            avg_win: result.result.avgWin,
            avg_loss: result.result.avgLoss,
            profit_factor: result.result.profitFactor,
            max_drawdown: result.result.maxDrawdown,
            sharpe_ratio: result.result.sharpeRatio,
            trades: result.result.trades,
            status: 'completed'
          }]);

        if (saveError) {
          console.error('[runBacktest] Error saving results:', saveError);
        }
      }

      return result.result as BacktestResult;
    }
  });

  // 4. Update Strategy Status Mutation
  const updateStrategyStatus = useMutation({
    mutationFn: async ({ strategyId, status }: { strategyId: string; status: 'draft' | 'active' | 'paused' | 'archived' }) => {
      console.debug('[updateStrategyStatus] Updating:', strategyId, status);

      const { error } = await supabase
        .from('quant_strategies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', strategyId);

      if (error) throw error;
      console.debug('[updateStrategyStatus] Successfully updated');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'strategies'] });
    }
  });

  // 5. Update Strategy Mutation
  const updateStrategy = useMutation({
    mutationFn: async ({ id, params }: { id: string; params: Partial<StrategyParams> }) => {
      console.debug('[updateStrategy] Updating:', id);

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };

      if (params.name) updatePayload.name = params.name;
      if (params.exchangeId) updatePayload.exchange_id = params.exchangeId;
      if (params.mode) updatePayload.mode = params.mode;
      if (params.pairs) updatePayload.pairs = params.pairs;
      if (params.sizePerTrade) updatePayload.size_per_trade = params.sizePerTrade;
      if (params.maxPositions) updatePayload.max_positions = params.maxPositions;
      if (params.maxExposure) updatePayload.max_exposure = params.maxExposure;
      if (params.stopLoss) updatePayload.stop_loss = params.stopLoss;
      if (params.takeProfit) updatePayload.take_profit = params.takeProfit;
      if (params.trailingStop) updatePayload.trailing_stop = params.trailingStop;
      if (params.cooldownMinutes) updatePayload.cooldown_minutes = params.cooldownMinutes;
      if (params.dailyLossLimit) updatePayload.daily_loss_limit = params.dailyLossLimit;
      if (params.description !== undefined) updatePayload.description = params.description;

      const { error } = await supabase
        .from('quant_strategies')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'strategies'] });
    }
  });

  // 6. Delete Strategy Mutation
  const deleteStrategy = useMutation({
    mutationFn: async (id: string) => {
      console.debug('[deleteStrategy] Deleting:', id);
      const { error } = await supabase
        .from('quant_strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'strategies'] });
    }
  });

  return {
    strategies,
    strategyRegistry: registry,
    isLoading,
    error,
    createStrategy: createStrategy.mutate,
    isCreating: createStrategy.isPending,
    runBacktest: runBacktest.mutate,
    isBacktesting: runBacktest.isPending,
    backtestResult: runBacktest.data,
    updateStrategyStatus: updateStrategyStatus.mutate,
    isUpdating: updateStrategyStatus.isPending,
    updateStrategy: updateStrategy.mutate,
    deleteStrategy: deleteStrategy.mutate
  };
};
