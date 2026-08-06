'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BotStatus } from '@loopdev/contracts';

type JsonObject = Record<string, unknown>;

interface BotQueryRow extends JsonObject {
  id: string;
  name: string;
  pair: string;
  exchange_id: string;
  strategy_id: string;
  created_at: string;
  updated_at: string;
  status: BotStatus;
  quant_strategies?: JsonObject | JsonObject[] | null;
  risk_profile?: JsonObject | null;
  last_exit_targets?: JsonObject | null;
  last_logic_snapshot?: JsonObject | null;
}

interface BotMutationParams {
  name: string;
  exchangeId: string;
  pair: string;
  strategyId: string;
  baseInvestmentUsdt: number;
  riskProfile: JsonObject;
  useInitialRangeFilter: boolean;
  useMarketRegimeFilter: boolean;
}

const asObject = (value: unknown): JsonObject =>
  value && typeof value === 'object' ? (value as JsonObject) : {};
const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;
const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const asBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;
const asNumberArray = (value: unknown): number[] =>
  Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : [];

/**
 * @hook useBotFleet
 * @description Refactored Industrial Hook. Handles BIGINT Cents -> Float conversion.
 * Zero-Mock Policy: Only real telemetry from the Quant Core is displayed.
 */
export const useBotFleet = () => {
  const queryClient = useQueryClient();

  const {
    data: bots = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trading', 'fleet'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('quant_bots')
        .select('*, quant_strategies(name, core_id)')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      return (data || []).map((raw: BotQueryRow) => {
        // --- ADAPTADOR DE PRECISIÓN CENTS (BIGINT -> Float) ---
        const fromCents = (val: unknown) => Number(val || 0) / 100;

        // Resolve joined strategy info
        const strat = raw.quant_strategies;
        const strategyInfo = Array.isArray(strat) ? strat[0] : strat;
        const riskProfile = asObject(raw.risk_profile);
        const logicSnapshot = asObject(raw.last_logic_snapshot);
        const positionSide: 'LONG' | 'SHORT' | undefined =
          raw.current_position_side === 'LONG' || raw.current_position_side === 'SHORT'
            ? raw.current_position_side
            : undefined;

        return {
          id: raw.id,
          name: raw.name,
          pair: raw.pair,
          exchangeId: raw.exchange_id,
          strategyId: raw.strategy_id,
          createdAt: raw.created_at,
          strategyName: asString(strategyInfo?.name, 'Unknown Strategy'),
          coreId: asString(strategyInfo?.core_id, 'default'),
          status: raw.status,
          updatedAt: raw.updated_at,
          riskProfile: {
            maxDailyLossPct: Number(
              riskProfile.maxDailyLossPct ?? riskProfile.max_daily_loss_pct ?? 2,
            ),
            globalStopLossPct: Number(
              riskProfile.globalStopLossPct ?? riskProfile.global_stop_loss_pct ?? 5,
            ),
            maxRebuys: Number(riskProfile.maxRebuys ?? riskProfile.max_rebuys ?? 3),
            maxExposureUsdt: Number(
              riskProfile.maxExposureUsdt ??
                riskProfile.max_exposure_usdt ??
                raw.base_investment_usdt ??
                0,
            ),
            cooldownPeriodMinutes: Number(
              riskProfile.cooldownPeriodMinutes ?? riskProfile.cooldown_period_minutes ?? 60,
            ),
          },
          useInitialRangeFilter: asBoolean(raw.use_initial_range_filter, true),
          useMarketRegimeFilter: asBoolean(raw.use_market_regime_filter, true),
          trailingStopDistance: Number(raw.trailing_stop_distance || 1.0),
          currentAction: asString(raw.current_action, 'Initializing...'),
          currentPositionSide: positionSide,

          // Precios Reales (Desde la migración 20260320)
          currentPrice: fromCents(raw.last_price),
          currentSma: fromCents(raw.last_sma),
          currentAtr: fromCents(raw.last_atr),

          // Precios de Posición (Cents -> Float)
          currentEntryPrice: fromCents(raw.current_entry_price),
          currentQuantity: asNumber(raw.current_quantity),
          baseInvestmentUsdt: Number(raw.base_investment_usdt || 0),

          // PnL (Calculados en Cents por el motor, convertidos para la UI)
          currentPnlPct: Number(raw.current_pnl_pct || 0),
          currentPnlUsdt: fromCents(raw.current_pnl_usdt),
          realizedPnlUsdt: fromCents(raw.realized_pnl_usdt),

          // Estadísticas Reales de Sesión
          totalTrades: asNumber(raw.total_trades),
          winningTrades: asNumber(raw.winning_trades),
          losingTrades: asNumber(raw.losing_trades),
          avgPnlPct: Number(raw.avg_pnl_pct || 0),
          openedAt:
            typeof raw.current_position_opened_at === 'string'
              ? raw.current_position_opened_at
              : undefined,

          // Objetivos de Salida (Mapeo de Snake_Case de la DB a CamelCase de la UI)
          exitTargets: raw.last_exit_targets
            ? {
                slPrice: fromCents(raw.last_exit_targets.sl_price),
                tpPrice: fromCents(raw.last_exit_targets.tp_price),
                bePrice: fromCents(raw.last_exit_targets.be_price),
              }
            : null,

          // Telemetría de Estrategia
          macroSentiment: (['bullish', 'bearish', 'neutral'] as const).includes(
            asString(raw.last_sentiment, 'neutral') as 'bullish' | 'bearish' | 'neutral',
          )
            ? (asString(raw.last_sentiment, 'neutral') as 'bullish' | 'bearish' | 'neutral')
            : 'neutral',
          priceHistory: asNumberArray(raw.price_history_1h),
          logicSnapshot: Object.keys(logicSnapshot).length > 0 ? logicSnapshot : undefined,

          // Mapeos de Ejecución (Para la Barra de Progreso)
          priceTarget: fromCents(raw.last_sma || logicSnapshot.trigger_price || 0),
          atrValue: fromCents(raw.last_atr || logicSnapshot.atr_vol || 0),

          // Metadatos Proximidad (Si el motor no los envía, no los inventamos)
          proximityPct: asNumber(raw.signal_strength),
          lastTradePnlPct: asNumber(raw.last_trade_pnl_pct),
        };
      });
    },
    refetchInterval: 5000,
  });

  // --- MUTACIONES (Sin cambios, ya son reales) ---

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BotStatus }) => {
      const { error } = await supabase
        .from('quant_bots')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] }),
  });

  const updateBotTargets = useMutation({
    mutationFn: async ({ id, targets }: { id: string; targets: JsonObject }) => {
      const { error } = await supabase
        .from('quant_bots')
        .update({ last_exit_targets: targets })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] }),
  });

  const deployBot = useMutation({
    mutationFn: async (params: BotMutationParams) => {
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
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('quant_bots').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    },
  });

  const updateBot = useMutation({
    mutationFn: async ({ id, params }: { id: string; params: BotMutationParams }) => {
      const payload = {
        name: params.name,
        exchange_id: params.exchangeId,
        pair: params.pair,
        strategy_id: params.strategyId,
        base_investment_usdt: params.baseInvestmentUsdt,
        risk_profile: params.riskProfile,
        use_initial_range_filter: params.useInitialRangeFilter,
        use_market_regime_filter: params.useMarketRegimeFilter,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('quant_bots').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    },
  });

  const executeCommand = useMutation({
    mutationFn: async ({ id, command }: { id: string; command: string }) => {
      const { error } = await supabase
        .from('quant_bots')
        .update({ pending_command: command })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    },
  });

  const deleteBot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quant_bots').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
    },
  });

  return {
    bots,
    isLoading,
    error,
    toggleStatus: toggleStatus.mutate,
    updateBotTargets: updateBotTargets.mutateAsync,
    deployBot: (params: BotMutationParams, options?: Parameters<typeof deployBot.mutate>[1]) =>
      deployBot.mutate(params, options),
    updateBot: (
      args: { id: string; params: BotMutationParams },
      options?: Parameters<typeof updateBot.mutate>[1],
    ) => updateBot.mutate(args, options),
    deleteBot: (id: string, options?: Parameters<typeof deleteBot.mutate>[1]) =>
      deleteBot.mutate(id, options),
    executeCommand: (args: { id: string; command: string }) => executeCommand.mutate(args),
  };
};
