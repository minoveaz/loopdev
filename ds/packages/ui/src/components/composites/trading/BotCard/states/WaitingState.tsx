'use client';

import React from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { Icon } from '../../../../atoms/surfaces/Icon';
import { PulseSparkline } from '../../../../atoms/indicators/PulseSparkline';
import { NextEvalTimer } from '../../../../atoms/indicators/NextEvalTimer';
import { cn } from '../../../../../helpers/cn';
import { TacticalMetricCell } from './TacticalMetricCell';
import { BotPnlBadge } from './BotPnlBadge';
import { BotTriggerDistance } from './BotTriggerDistance';
import { BotConfluence } from './BotConfluence';

interface WaitingStateProps {
  bot: any;
}

/**
 * @component WaitingState
 * @description High-alert monitor for imminent trade execution.
 * Visual: Amber Glow & Pulsing icons.
 */
export const WaitingState = ({ bot }: WaitingStateProps) => {
  const displayAction = (bot.currentAction || 'WAITING_FOR_SIGNAL')
    .replace(/_/g, ' ')
    .toUpperCase();

  return (
    <div className="p-8 rounded-[32px] border border-amber-500/30 bg-slate-900 shadow-[inset_0_0_40px_rgba(245,158,11,0.05)] flex flex-col gap-8 relative overflow-hidden">
      {/* GLOW DE ALERTA */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px] animate-pulse" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
            <Icon name="bolt" size="sm" />
          </div>
          <div className="flex flex-col min-w-0">
            <LpdText
              size="xs"
              weight="black"
              className="uppercase tracking-[0.2em] text-amber-500 opacity-60 leading-none"
            >
              Status: HIGH_ALERT
            </LpdText>
            <LpdText
              size="sm"
              weight="black"
              className="uppercase tracking-tighter text-text-main mt-2"
            >
              {displayAction}
            </LpdText>
          </div>
        </div>

        <NextEvalTimer
          lastUpdatedAt={bot.updatedAt}
          className="self-start border-amber-500/20 bg-amber-500/5"
        />
      </div>

      {/* SESSION SCOREBOARD (POINT 4) */}
      <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4 mt-2">
        <div className="flex flex-col gap-1">
          <LpdText
            size="nano"
            weight="black"
            className="text-text-muted opacity-40 uppercase tracking-widest leading-none"
          >
            Session_Score:
          </LpdText>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-emerald-500 font-mono">
              {bot.winningTrades || 0}W
            </span>
            <div className="w-px h-2 bg-white/10" />
            <span className="text-[10px] font-black text-rose-500 font-mono">
              {bot.losingTrades || 0}L
            </span>
          </div>
        </div>

        <BotPnlBadge value={bot.avgPnlPct} />
      </div>

      <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4">
        <LpdText
          size="nano"
          weight="black"
          className="text-amber-500 font-mono italic uppercase tracking-widest animate-pulse"
        >
          Imminent_Signal_Detection...
        </LpdText>
      </div>

      {/* MARKET CONTEXT (POINT 3) */}
      {bot.logicSnapshot?.trigger_price && <BotTriggerDistance bot={bot} alert />}

      {/* TACTICAL INDICATORS SNAPSHOT (ADAPTATIVO) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Indicador 1: Principal (RSI o ATR) */}
        <TacticalMetricCell
          alert
          label={bot.logicSnapshot?.rsi !== undefined ? 'RSI_14' : 'ATR_VOL'}
          value={
            bot.logicSnapshot?.rsi !== undefined
              ? bot.logicSnapshot.rsi.toFixed(1)
              : bot.logicSnapshot?.atr_vol || bot.logicSnapshot?.atr || '--'
          }
        />

        {/* Indicador 2: Distancia (SMA_DIST o BB_DIST) */}
        <TacticalMetricCell
          alert
          label={bot.logicSnapshot?.bb_dist_up !== undefined ? 'BB_UP' : 'SMA_DIST'}
          value={
            bot.logicSnapshot?.bb_dist_up !== undefined
              ? `${bot.logicSnapshot.bb_dist_up}%`
              : bot.logicSnapshot?.sma_dist !== undefined
                ? `${bot.logicSnapshot.sma_dist}%`
                : '--'
          }
        />

        {/* Indicador 3: Estado de Mercado (VOL o BB_LOW) */}
        <TacticalMetricCell
          alert
          label={bot.logicSnapshot?.bb_dist_low !== undefined ? 'BB_LOW' : 'VOL_STAT'}
          value={
            bot.logicSnapshot?.bb_dist_low !== undefined
              ? `${bot.logicSnapshot.bb_dist_low}%`
              : bot.logicSnapshot?.vol_status || 'LOW'
          }
          valueClassName={
            bot.logicSnapshot?.vol_status === 'HIGH' ? 'text-emerald-500' : 'text-text-muted'
          }
        />

        {/* Indicador 4: Sesión/Bias */}
        <TacticalMetricCell
          alert
          label="BIAS"
          value={bot.logicSnapshot?.bias || 'STABLE'}
          valueClassName={
            bot.logicSnapshot?.bias === 'BULLISH'
              ? 'text-emerald-500'
              : bot.logicSnapshot?.bias === 'BEARISH'
                ? 'text-rose-500'
                : 'text-amber-500'
          }
        />
      </div>

      {/* SPARKLINE: Confluencia caliente */}
      <PulseSparkline data={bot.priceHistory} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <LpdText
            size="nano"
            weight="black"
            className="uppercase text-text-muted opacity-40 tracking-widest"
          >
            Signal_Proximity
          </LpdText>
          <LpdText size="sm" weight="black" className="font-mono text-amber-500">
            {bot.proximityPct || 0}%
          </LpdText>
        </div>
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000"
            style={{ width: `${bot.proximityPct || 0}%` }}
          />
        </div>

        {/* DYNAMIC CONFLUENCE (POINT 1) */}
        <BotConfluence confluence={bot.logicSnapshot?.confluence} />
      </div>
    </div>
  );
};
