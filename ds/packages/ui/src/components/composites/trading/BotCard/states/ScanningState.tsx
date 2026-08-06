'use client';

import React from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { Icon } from '../../../../atoms/surfaces/Icon';
import { PulseSparkline } from '../../../../atoms/indicators/PulseSparkline';
import { ProximityIndicator } from '../../../../atoms/indicators/ProximityIndicator';
import { NextEvalTimer } from '../../../../atoms/indicators/NextEvalTimer';
import { cn } from '../../../../../helpers/cn';
import { TacticalMetricCell } from './TacticalMetricCell';

interface ScanningStateProps {
  bot: any;
  isActive: boolean;
}

/**
 * @component ScanningState
 * @description Idle monitor for market surveillance.
 */
export const ScanningState = ({ bot, isActive }: ScanningStateProps) => {
  const displayAction = (bot.currentAction || 'SCANNING_MARKET').replace(/_/g, ' ').toUpperCase();

  return (
    <div
      className={cn(
        'p-8 rounded-[32px] border transition-all duration-700 flex flex-col gap-8',
        isActive
          ? 'bg-slate-900/40 border-primary/10 shadow-inner'
          : 'bg-background-subtle border-white/5 opacity-40 grayscale',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-text-muted flex items-center justify-center shrink-0 border border-white/5">
            <Icon name="search" size="sm" />
          </div>
          <div className="flex flex-col min-w-0">
            <LpdText
              size="xs"
              weight="black"
              className="uppercase tracking-[0.2em] text-text-muted opacity-60 leading-none"
            >
              Status
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

        {isActive && <NextEvalTimer lastUpdatedAt={bot.updatedAt} className="self-start" />}
      </div>

      {/* 3. SESSION SCOREBOARD (POINT 4) */}
      <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1">
          <LpdText
            size="nano"
            weight="black"
            className="text-text-muted opacity-40 italic uppercase tracking-widest leading-none"
          >
            Session_Scoreboard:
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

      {/* 2. MARKET CONTEXT (POINT 3) */}
      {bot.logicSnapshot?.trigger_price && (
        <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <LpdText
              size="nano"
              weight="black"
              className="text-text-muted opacity-40 uppercase tracking-widest"
            >
              Distance_To_Trigger
            </LpdText>
            <LpdText size="nano" className="text-primary font-mono">
              ESTIMATED
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
              <LpdText size="nano" className="text-text-muted opacity-40 uppercase font-bold">
                Target_Price
              </LpdText>
              <LpdText size="xs" weight="black" className="font-mono text-text-muted">
                $
                {Number(bot.logicSnapshot.trigger_price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </LpdText>
            </div>
          </div>
        </div>
      )}

      {/* 3. TACTICAL INDICATORS SNAPSHOT (ADAPTATIVO) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Indicador 1: Principal (RSI o ATR) */}
        <TacticalMetricCell
          label={bot.logicSnapshot?.rsi !== undefined ? 'RSI_14' : 'ATR_VOL'}
          value={
            bot.logicSnapshot?.rsi !== undefined
              ? bot.logicSnapshot.rsi.toFixed(1)
              : bot.logicSnapshot?.atr_vol || bot.logicSnapshot?.atr || '--'
          }
        />

        {/* Indicador 2: Distancia (SMA_DIST o BB_DIST) */}
        <TacticalMetricCell
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

      {/* SPARKLINE: Corazón de la estrategia */}
      <PulseSparkline data={bot.priceHistory} />

      <div className="flex flex-col gap-4">
        <ProximityIndicator value={bot.proximityPct || 0} />

        {/* 1. DYNAMIC CONFLUENCE (POINT 1) */}
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
