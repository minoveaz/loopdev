'use client';

import React from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { Icon } from '../../../../atoms/surfaces/Icon';
import { PulseSparkline } from '../../../../atoms/indicators/PulseSparkline';
import { NextEvalTimer } from '../../../../atoms/indicators/NextEvalTimer';
import { cn } from '../../../../../helpers/cn';
import { TacticalMetricCell } from './TacticalMetricCell';

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

        <div className="flex flex-col items-end gap-1">
          <LpdText size="nano" className="text-text-muted opacity-40 uppercase font-bold">
            Avg_PnL
          </LpdText>
          <div
            className={cn(
              'px-2 py-0.5 rounded-md border text-[10px] font-black font-mono',
              (bot.avgPnlPct || 0) >= 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500',
            )}
          >
            {(bot.avgPnlPct || 0) >= 0 ? '+' : ''}
            {(bot.avgPnlPct || 0).toFixed(2)}%
          </div>
        </div>
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
      {bot.logicSnapshot?.trigger_price && (
        <div className="flex flex-col gap-2 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
          <div className="flex items-center justify-between">
            <LpdText
              size="nano"
              weight="black"
              className="text-amber-500 opacity-40 uppercase tracking-widest"
            >
              Target_Nexus
            </LpdText>
            <LpdText size="nano" className="text-amber-500 animate-pulse font-mono font-bold">
              CRITICAL_GAP
            </LpdText>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <LpdText size="lg" weight="black" className="font-mono text-text-main">
                ${Math.abs(bot.currentPrice - bot.logicSnapshot.trigger_price).toFixed(2)}
              </LpdText>
              <LpdText size="xs" weight="bold" className="text-amber-500 font-mono">
                (
                {(Math.abs(bot.currentPrice / bot.logicSnapshot.trigger_price - 1) * 100).toFixed(
                  2,
                )}
                %)
              </LpdText>
            </div>
            <div className="flex flex-col items-end">
              <LpdText size="nano" className="text-amber-500 opacity-40 uppercase font-bold">
                Target_Price
              </LpdText>
              <LpdText size="xs" weight="black" className="font-mono text-text-main opacity-80">
                $
                {Number(bot.logicSnapshot.trigger_price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </LpdText>
            </div>
          </div>
        </div>
      )}

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
        {bot.logicSnapshot?.confluence && (
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(bot.logicSnapshot.confluence).map(([key, value]) => (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest transition-all duration-500',
                  value
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'bg-white/5 border-white/10 text-text-muted opacity-40',
                )}
              >
                <div
                  className={cn(
                    'w-1 h-1 rounded-full',
                    value ? 'bg-emerald-500 animate-pulse' : 'bg-text-muted',
                  )}
                />
                {key.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
