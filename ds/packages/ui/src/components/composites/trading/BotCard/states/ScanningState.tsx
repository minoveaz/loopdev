'use client';

import React from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { Icon } from '../../../../atoms/surfaces/Icon';
import { PulseSparkline } from '../../../../atoms/indicators/PulseSparkline';
import { ProximityIndicator } from '../../../../atoms/indicators/ProximityIndicator';
import { NextEvalTimer } from '../../../../atoms/indicators/NextEvalTimer';
import { cn } from '../../../../../helpers/cn';
import { BotTacticalIndicators } from './BotTacticalIndicators';
import { BotPnlBadge } from './BotPnlBadge';
import { BotConfluence } from './BotConfluence';
import { BotTriggerDistance } from './BotTriggerDistance';

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

        <BotPnlBadge value={bot.avgPnlPct} />
      </div>

      {/* 2. MARKET CONTEXT (POINT 3) */}
      {bot.logicSnapshot?.trigger_price && <BotTriggerDistance bot={bot} />}

      {/* 3. TACTICAL INDICATORS SNAPSHOT (ADAPTATIVO) */}
      <div>
        <BotTacticalIndicators bot={bot} />

        {/* Indicador 2: Distancia (SMA_DIST o BB_DIST) */}

        {/* Indicador 3: Estado de Mercado (VOL o BB_LOW) */}

        {/* Indicador 4: Sesión/Bias */}
      </div>

      {/* SPARKLINE: Corazón de la estrategia */}
      <PulseSparkline data={bot.priceHistory} />

      <div className="flex flex-col gap-4">
        <ProximityIndicator value={bot.proximityPct || 0} />

        {/* 1. DYNAMIC CONFLUENCE (POINT 1) */}
        <BotConfluence confluence={bot.logicSnapshot?.confluence} />
      </div>
    </div>
  );
};
