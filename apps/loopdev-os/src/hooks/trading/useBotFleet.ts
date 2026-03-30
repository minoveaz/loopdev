'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BotStatus } from '@loopdev/contracts';

/**
 * @hook useBotFleet
 * @description Refactored Industrial Hook. Handles BIGINT Cents -> Float conversion.
 * Zero-Mock Policy: Only real telemetry from the Quant Core is displayed.
 */
export const useBotFleet = () => {
  const queryClient = useQueryClient();

  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ['trading', 'fleet'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('quant_bots')
        .select('*, quant_strategies(name, core_id)')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      return (data || []).map((raw: any) => {
        // --- ADAPTADOR DE PRECISIÓN CENTS (BIGINT -> Float) ---
        const fromCents = (val: any) => (Number(val || 0) / 100);
        
        // Resolve joined strategy info
        const strat = raw.quant_strategies;
        const strategyInfo = Array.isArray(strat) ? strat[0] : strat;

        return {
          id: raw.id,
          name: raw.name,
          pair: raw.pair,
          exchangeId: raw.exchange_id,
          strategyId: raw.strategy_id,
          strategyName: strategyInfo?.name || 'Unknown Strategy',
          coreId: strategyInfo?.core_id || 'default',
          status: raw.status,
          updatedAt: raw.updated_at,
          trailingStopDistance: Number(raw.trailing_stop_distance || 1.0),
          currentAction: raw.current_action || 'Initializing...',
          
          // Precios Reales (Desde la migración 20260320)
          currentPrice: fromCents(raw.last_price),
          currentSma: fromCents(raw.last_sma),
          currentAtr: fromCents(raw.last_atr),
          
          // Precios de Posición (Cents -> Float)
          currentEntryPrice: fromCents(raw.current_entry_price),
          baseInvestmentUsdt: Number(raw.base_investment_usdt || 0),
          
          // PnL (Calculados en Cents por el motor, convertidos para la UI)
          currentPnlPct: Number(raw.current_pnl_pct || 0),
          currentPnlUsdt: fromCents(raw.current_pnl_usdt),
          realizedPnlUsdt: fromCents(raw.realized_pnl_usdt),
          
          // Estadísticas Reales de Sesión
          totalTrades: raw.total_trades || 0,
          winningTrades: raw.winning_trades || 0,
          losingTrades: raw.losing_trades || 0,
          avgPnlPct: Number(raw.avg_pnl_pct || 0),
          openedAt: raw.current_position_opened_at,
          
          // Objetivos de Salida (Mapeo de Snake_Case de la DB a CamelCase de la UI)
          exitTargets: raw.last_exit_targets ? {
            slPrice: fromCents(raw.last_exit_targets.sl_price),
            tpPrice: fromCents(raw.last_exit_targets.tp_price),
            bePrice: fromCents(raw.last_exit_targets.be_price)
          } : null,

          // Telemetría de Estrategia
          macroSentiment: raw.last_sentiment || 'neutral',
          priceHistory: raw.price_history_1h || [],
          logicSnapshot: raw.last_logic_snapshot || null,
          
          // Mapeos de Ejecución (Para la Barra de Progreso)
          priceTarget: fromCents(raw.last_sma || (raw.last_logic_snapshot?.trigger_price || 0)),
          atrValue: fromCents(raw.last_atr || (raw.last_logic_snapshot?.atr_vol || 0)),

          // Metadatos Proximidad (Si el motor no los envía, no los inventamos)
          proximityPct: raw.signal_strength || 0,
          lastTradePnlPct: raw.last_trade_pnl_pct || 0,
        };
      });
    },
    refetchInterval: 5000,
  });

  // --- MUTACIONES (Sin cambios, ya son reales) ---

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: BotStatus }) => {
      const { error } = await supabase.from('quant_bots').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] })
  });

  const updateBotTargets = useMutation({
    mutationFn: async ({ id, targets }: { id: string, targets: any }) => {
      const { error } = await supabase.from('quant_bots').update({ last_exit_targets: targets }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] })
  });

  const deployBot = useMutation({
    mutationFn: async (params: any) => {
      const payload = {
        name: params.name,
        exchange_id: params.exchangeId,
        pair: params.pair,
        strategy_id: params.strategyId,
        base_investment_usdt: params.baseInvestmentUsdt,
        risk_profile: params.riskProfile,
        use_initial_range_filter: params.useInitialRangeFilter,
        use_market_regime_filter: params.useMarketRegimeFilter,
        tenant_id: '00000000-0000-0000-0000-000000000000',
        status: 'paper_trading',
        current_action: 'Initializing...',
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('quant_bots').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  const updateBot = useMutation({
    mutationFn: async ({ id, params }: { id: string, params: any }) => {
      const payload = {
        name: params.name,
        exchange_id: params.exchangeId,
        pair: params.pair,
        strategy_id: params.strategyId,
        base_investment_usdt: params.baseInvestmentUsdt,
        risk_profile: params.riskProfile,
        use_initial_range_filter: params.useInitialRangeFilter,
        use_market_regime_filter: params.useMarketRegimeFilter,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('quant_bots').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  const executeCommand = useMutation({
    mutationFn: async ({ id, command }: { id: string, command: string }) => {
      const { error } = await supabase.from('quant_bots').update({ pending_command: command }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    }
  });

  const deleteBot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quant_bots').delete().eq('id', id);
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
    toggleStatus: toggleStatus.mutate,
    updateBotTargets: updateBotTargets.mutateAsync,
    deployBot: (params: any, options?: any) => deployBot.mutate(params, options),
    updateBot: (args: { id: string, params: any }, options?: any) => updateBot.mutate(args, options),
    deleteBot: (id: string, options?: any) => deleteBot.mutate(id, options),
    executeCommand: (args: { id: string, command: string }) => executeCommand.mutate(args)
  };
};
