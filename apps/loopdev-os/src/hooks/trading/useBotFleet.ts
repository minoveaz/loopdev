'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BotConfig, BotStatus } from '@loopdev/contracts';

/**
 * @hook useBotFleet
 * @description Master fleet management with real-time mutations.
 */
export const useBotFleet = () => {
  const queryClient = useQueryClient();

  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ['trading', 'fleet'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('quant_bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      return (data || []).map((raw: any) => {
        const botIdPrefix = parseInt(raw.id.split('-')[0], 16);
        const entryPrice = Number(raw.current_entry_price || 0);
        
        const mockSL = entryPrice > 0 ? entryPrice * 0.985 : 0;
        const mockTP = entryPrice > 0 ? entryPrice * 1.04 : 0;
        const mockBE = entryPrice > 0 ? entryPrice * 1.002 : 0;

        return {
          id: raw.id,
          name: raw.name,
          pair: raw.pair,
          exchangeId: raw.exchange_id,
          strategyId: raw.strategy_id,
          baseInvestmentUsdt: Number(raw.base_investment_usdt || 0),
          status: raw.status,
          currentAction: raw.current_action || 'Scanning_Market',
          currentPrice: Number(raw.last_price || 0),
          currentPnlPct: Number(raw.current_pnl_pct || 0),
          currentPnlUsdt: Number(raw.current_pnl_usdt || 0),
          realizedPnlUsdt: Number(raw.realized_pnl_usdt || 0),
          totalTrades: raw.total_trades || 0,
          winningTrades: raw.winning_trades || 0,
          currentEntryPrice: entryPrice,
          openedAt: raw.current_position_opened_at || new Date(Date.now() - 3600000 * 3).toISOString(),
          exitTargets: raw.last_exit_targets ? {
            slPrice: Number(raw.last_exit_targets.sl_price),
            tpPrice: Number(raw.last_exit_targets.tp_price),
            bePrice: Number(raw.last_exit_targets.be_price)
          } : {
            slPrice: mockSL,
            tpPrice: mockTP,
            bePrice: mockBE
          },
          proximityPct: (botIdPrefix % 100),
          lastTradePnlPct: (botIdPrefix % 5) - 1,
          macroSentiment: raw.last_sentiment || raw.macro_sentiment || 'neutral',
          priceHistory: raw.price_history_1h || [],
          logicSnapshot: raw.last_logic_snapshot,
        };
      });
    },
    refetchInterval: 5000,
  });

  // --- MUTACIONES ---

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: BotStatus }) => {
      const { error } = await supabase.from('quant_bots').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] })
  });

  const updateBotTargets = useMutation({
    mutationFn: async ({ id, targets }: { id: string, targets: any }) => {
      const { error } = await supabase
        .from('quant_bots')
        .update({ 
          last_exit_targets: targets,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] })
  });

  const deleteBot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quant_bots').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] })
  });

  return { 
    bots, 
    isLoading, 
    error,
    toggleStatus: toggleStatus.mutate,
    updateBotTargets: updateBotTargets.mutateAsync,
    deleteBot: deleteBot.mutate
  };
};
