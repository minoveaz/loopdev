'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BotConfig, BotStatus } from '@loopdev/contracts';
import { toast } from '@loopdev/ui';

/**
 * @hook useBotFleet
 * @description Industrial hook for managing the trading bot fleet via Supabase.
 * Supports real-time polling for live operational state.
 */
export const useBotFleet = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Fleet
  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ['trading', 'fleet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bots:', error);
        throw error;
      }
      
      // Industrial Mapping: snake_case (DB) -> camelCase (Contracts)
      return data.map((raw: any) => {
        const exitTargets = raw.last_exit_targets;

        return {
          id: raw.id,
          name: raw.name,
          pair: raw.pair,
          exchangeId: raw.exchange_id,
          strategyId: raw.strategy_id,
          baseInvestmentUsdt: Number(raw.base_investment_usdt),
          status: raw.status,
          currentAction: raw.current_action,
          currentAction: raw.current_action,
          currentPnlPct: Number(raw.current_pnl_pct || 0),
          currentPnlUsdt: Number(raw.current_pnl_usdt || 0),
          currentEntryPrice: Number(raw.current_entry_price || 0),
          currentQuantity: Number(raw.current_quantity || 0),
          macroSentiment: raw.macro_sentiment || 'neutral',
          priceHistory: raw.price_history_1h || [],
          openedAt: raw.current_position_opened_at,
          logicSnapshot: raw.last_logic_snapshot,
          exitTargets: raw.last_exit_targets ? {
            slPrice: Number(raw.last_exit_targets.sl_price),
            tpPrice: Number(raw.last_exit_targets.tp_price),
            bePrice: Number(raw.last_exit_targets.be_price || 0)
          } : undefined,
          riskProfile: raw.risk_profile,
          useInitialRangeFilter: raw.use_initial_range_filter,
          useMarketRegimeFilter: raw.use_market_regime_filter,
          createdAt: raw.created_at,
          updatedAt: raw.updated_at
        };
      }) as any[];
    },
    refetchInterval: 5000, // Real-time polling every 5 seconds
  });

  // 2. Deploy Bot Mutation
  const deployBot = useMutation({
    mutationFn: async (newBot: any) => {
      const payload = {
        name: newBot.name,
        pair: newBot.pair,
        strategy_id: newBot.strategyId,
        base_investment_usdt: newBot.baseInvestmentUsdt,
        risk_profile: newBot.riskProfile,
        use_initial_range_filter: newBot.useInitialRangeFilter,
        use_market_regime_filter: newBot.useMarketRegimeFilter,
        tenant_id: '00000000-0000-0000-0000-000000000000', // Demo tenant
        status: 'paper_trading'
      };

      const { data, error } = await supabase
        .from('quant_bots')
        .insert([payload])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  // 3. Toggle Status Mutation
  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: BotStatus }) => {
      const { error } = await supabase
        .from('quant_bots')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  // 4. Update Bot Mutation
  const updateBot = useMutation({
    mutationFn: async ({ id, params }: { id: string; params: Partial<BotConfig> }) => {
      const updatePayload: any = {
        updated_at: new Date().toISOString()
      };

      if (params.name) updatePayload.name = params.name;
      if (params.pair) updatePayload.pair = params.pair;
      if (params.strategyId) updatePayload.strategy_id = params.strategyId;
      if (params.baseInvestmentUsdt) updatePayload.base_investment_usdt = params.baseInvestmentUsdt;
      if (params.riskProfile) updatePayload.risk_profile = params.riskProfile;
      if (params.useInitialRangeFilter !== undefined) updatePayload.use_initial_range_filter = params.useInitialRangeFilter;
      if (params.useMarketRegimeFilter !== undefined) updatePayload.use_market_regime_filter = params.useMarketRegimeFilter;

      const { error } = await supabase
        .from('quant_bots')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  // 5. Delete Bot Mutation
  const deleteBot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quant_bots')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  return {
    bots,
    isLoading,
    error,
    deployBot: deployBot.mutate,
    isDeploying: deployBot.isPending,
    toggleStatus: toggleStatus.mutate,
    updateBot: updateBot.mutate,
    deleteBot: deleteBot.mutate
  };
};
