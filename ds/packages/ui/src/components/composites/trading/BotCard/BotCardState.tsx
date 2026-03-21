'use client';

import React, { useState, useEffect } from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { Icon } from '../../../atoms/surfaces/Icon';
import { PositionProgressBar } from '../../../atoms/indicators/PositionProgressBar';
import { ProximityIndicator } from '../../../atoms/indicators/ProximityIndicator';
import { PositionQuickActions } from '../../../atoms/indicators/PositionQuickActions';
import { PulseSparkline } from '../../../atoms/indicators/PulseSparkline';
import { cn } from '../../../../helpers/cn';

interface BotCardStateProps {
  currentAction: string;
  isActive: boolean;
  bot: any;
  onMarketExit?: () => Promise<void>;
  onSetToBE?: () => Promise<void>;
  onExecuteTP?: () => Promise<void>;
}

/**
 * @component BotCardState
 * @description Master tactical state monitor. 100% Atomic & Modular.
 */
export const BotCardState = ({ 
  currentAction, 
  isActive, 
  bot,
  onMarketExit,
  onSetToBE,
  onExecuteTP
}: BotCardStateProps) => {
  const isInPosition = bot.currentEntryPrice > 0;
  const displayAction = currentAction.replace(/_/g, ' ').toUpperCase();
  
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    if (!isInPosition || !bot.openedAt) return;
    const calculateElapsed = () => {
      const start = new Date(bot.openedAt).getTime();
      const diff = Date.now() - start;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${Math.floor((diff % 60000) / 1000)}s`;
    };
    setElapsedTime(calculateElapsed());
    const timer = setInterval(() => setElapsedTime(calculateElapsed()), 1000);
    return () => clearInterval(timer);
  }, [isInPosition, bot.openedAt]);

  const formatPrice = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 1. MONITOR DE BÚSQUEDA (Con Pulse_Sparkline Atómico)
  if (!isInPosition) {
    return (
      <div className={cn("p-8 rounded-[24px] border transition-all duration-500 flex flex-col gap-6", isActive ? "bg-slate-900/40 border-primary/10 shadow-inner" : "bg-background-subtle border-white/5 opacity-40")}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-lg"><Icon name="search" size="sm" /></div>
          <div className="flex flex-col min-w-0">
            <LpdText size="xs" weight="black" className="uppercase tracking-widest text-text-main">{displayAction}</LpdText>
            <div className="flex items-center gap-2 mt-1">
              <LpdText size="nano" className="text-text-muted opacity-40 italic uppercase tracking-tighter font-bold">Last Trade:</LpdText>
              <div className={cn("px-1.5 py-0.5 rounded bg-white/5 border border-white/5", bot.lastTradePnlPct >= 0 ? "text-emerald-500" : "text-rose-500")}><LpdText size="nano" weight="black" className="font-mono">{bot.lastTradePnlPct >= 0 ? '+' : ''}{bot.lastTradePnlPct}%</LpdText></div>
            </div>
          </div>
        </div>

        {/* SPARKLINE ATÓMICO (Con modo Confluencia Táctica) */}
        <PulseSparkline 
          data={bot.priceHistory} 
          logicSnapshot={bot.logicSnapshot} 
        />

        <ProximityIndicator value={bot.proximityPct || 0} />
      </div>
    );
  }

  // 2. MONITOR DE POSICIÓN (Con Salvaguarda de BE)
  const pnlUsdt = bot.currentPnlUsdt || 0;
  const pnlColor = bot.currentPnlPct >= 0 ? "text-emerald-500" : "text-rose-500";
  const slPrice = bot.exitTargets?.slPrice || 0;
  const tpPrice = bot.exitTargets?.tpPrice || 0;
  const bePrice = bot.exitTargets?.bePrice || bot.currentEntryPrice * 1.002;
  
  const canMoveToBE = bot.currentPrice > bePrice;
  
  return (
    <div className={cn("p-8 rounded-[24px] border transition-all duration-500 flex flex-col gap-6 bg-slate-900 shadow-2xl relative overflow-hidden", bot.currentPnlPct >= 0 ? "border-emerald-500/20" : "border-rose-500/20")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-xl", bot.currentPnlPct >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}><Icon name="shopping_cart" size="sm" /></div>
          <div className="flex flex-col">
            <LpdText size="xs" weight="black" className="uppercase tracking-tighter text-text-main leading-none">IN_POSITION</LpdText>
            <LpdText size="xs" weight="black" className={cn("font-mono mt-1", pnlColor)}>{pnlUsdt >= 0 ? '+' : '-'}${Math.abs(pnlUsdt).toFixed(2)} USD</LpdText>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Entry_Time:</LpdText>
          <LpdText size="nano" weight="black" className="font-mono text-text-main opacity-80">{new Date(bot.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</LpdText>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="schedule" size="nano" className="text-primary opacity-60" />
          <LpdText size="nano" weight="black" className="font-mono text-primary animate-pulse">{elapsedTime}</LpdText>
        </div>
      </div>

      <PositionProgressBar 
        currentPrice={bot.currentPrice} 
        entryPrice={bot.currentEntryPrice} 
        slPrice={slPrice} 
        tpPrice={tpPrice} 
        bePrice={bePrice} 
      />

      <PositionQuickActions 
        onMarketExit={onMarketExit}
        onSetToBE={onSetToBE}
        onExecuteTP={onExecuteTP}
        canMoveToBE={canMoveToBE}
      />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 pt-4 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Entry_Price</LpdText>
          <LpdText size="xs" weight="bold" className="font-mono text-text-main opacity-80">${formatPrice(bot.currentEntryPrice)}</LpdText>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Break_Even</LpdText>
          <LpdText size="xs" weight="bold" className="font-mono text-primary/80">${formatPrice(bePrice)}</LpdText>
        </div>
        <div className="flex flex-col gap-1">
          <LpdText size="nano" weight="black" className="uppercase text-rose-500/40">Stop_Loss</LpdText>
          <LpdText size="xs" weight="bold" className="font-mono text-rose-500/80">${formatPrice(slPrice)}</LpdText>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <LpdText size="nano" weight="black" className="uppercase text-emerald-500/40">Target_TP</LpdText>
          <LpdText size="xs" weight="black" className="font-mono text-emerald-500/80">${formatPrice(tpPrice)}</LpdText>
        </div>
      </div>
    </div>
  );
};
