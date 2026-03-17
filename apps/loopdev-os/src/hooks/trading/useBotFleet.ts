'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BotConfig, BotStatus } from '@loopdev/contracts';
import { toast } from '@loopdev/ui';

/**
 * @hook useBotFleet
 * @description Industrial hook for managing the trading bot fleet via Supabase.
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
      return data.map((raw: any) => ({
        id: raw.id,
        name: raw.name,
        pair: raw.pair,
        exchangeId: raw.exchange_id,
        strategyId: raw.strategy_id,
        baseInvestmentUsdt: Number(raw.base_investment_usdt),
        status: raw.status,
        riskProfile: raw.risk_profile,
        useInitialRangeFilter: raw.use_initial_range_filter,
        useMarketRegimeFilter: raw.use_market_regime_filter,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at
      })) as BotConfig[];
    }
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

      console.log('Deploying bot with payload:', payload);

      const { data, error } = await supabase
        .from('quant_bots')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase error during deploy:', error);
        throw error;
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    },
    onError: (err) => {
      console.error('Mutation failed:', err);
    }
  });

  // 3. Toggle Status Mutation
  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: BotStatus }) => {
      console.log(`Updating bot ${id} status to ${status}`);
      const { error } = await supabase
        .from('quant_bots')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase error during status toggle:', error);
        throw error;
      }
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
    toggleStatus: toggleStatus.mutate
  };
};
