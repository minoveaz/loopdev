'use client';

import React, { useState, useEffect } from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { Icon } from '../../../../atoms/surfaces/Icon';
import { PositionProgressBar } from '../../../../atoms/indicators/PositionProgressBar';
import { PositionQuickActions } from '../../../../atoms/indicators/PositionQuickActions';
import { cn } from '../../../../../helpers/cn';

interface InPositionStateProps {
  bot: any;
  onMarketExit?: () => Promise<void>;
  onSetToBE?: () => Promise<void>;
  onExecuteTP?: () => Promise<void>;
  onUpdateTrail?: (distance: number) => Promise<void>;
}

/**
 * @component InPositionState
 * @description Master tactical monitor for active trades. 
 * High-priority visual scale for PnL and exit targets.
 */
export const InPositionState = ({ 
  bot,
  onMarketExit,
  onSetToBE,
  onExecuteTP,
  onUpdateTrail
}: InPositionStateProps) => {
  const [elapsedTime, setElapsedTime] = useState('');

  // Cronómetro de supervivencia (Tiempo en la operación)
  useEffect(() => {
    if (!bot.openedAt) return;
    const calculateElapsed = () => {
      const start = new Date(bot.openedAt).getTime();
      const diff = Date.now() - start;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    };
    setElapsedTime(calculateElapsed());
    const timer = setInterval(() => setElapsedTime(calculateElapsed()), 1000);
    return () => clearInterval(timer);
  }, [bot.openedAt]);

  const pnlUsdt = bot.currentPnlUsdt || 0;
  const pnlPct = bot.currentPnlPct || 0;
  const isWinner = pnlPct >= 0;
  
  const slPrice = bot.exitTargets?.slPrice || 0;
  const tpPrice = bot.exitTargets?.tpPrice || 0;
  const bePrice = bot.exitTargets?.bePrice || bot.currentEntryPrice * 1.002;
  const trailingDistance = bot.trailingStopDistance || 1.0;
  
  // Logic: Can only move to BE if price is above BE AND SL is still below BE (not protected yet)
  const isAlreadyProtected = slPrice >= bePrice;
  const canMoveToBE = bot.currentPrice > bePrice && !isAlreadyProtected;

  const formatPrice = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Helper para calcular porcentajes relativos a la entrada (FRONTEND-ONLY)
  const getRelPct = (target: number) => {
    if (!bot.currentEntryPrice || bot.currentEntryPrice === 0 || target === 0) return '0.00';
    const pct = ((target / bot.currentEntryPrice) - 1) * 100;
    return (pct >= 0 ? '+' : '') + pct.toFixed(2);
  };

  // Projected USD at target
  const getRelUsd = (target: number) => {
    if (!bot.currentEntryPrice || bot.currentEntryPrice === 0 || target === 0) return '0.00';
    const pct = ((target / bot.currentEntryPrice) - 1);
    const usd = pct * (bot.baseInvestmentUsdt || 0);
    return (usd >= 0 ? '+$' : '-$') + Math.abs(usd).toFixed(2);
  };

  return (
    <div className={cn(
      "p-8 rounded-[32px] border transition-all duration-700 flex flex-col gap-8 bg-slate-900 shadow-2xl relative overflow-hidden",
      isWinner ? "border-emerald-500/20 shadow-emerald-500/5" : "border-rose-500/20 shadow-rose-500/5"
    )}>
      {/* 1. Header de Estado e Identidad del Trade */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-colors duration-500",
            isWinner ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            <Icon name="shopping_cart" size="sm" />
          </div>
          <div className="flex flex-col">
            <LpdText size="xs" weight="black" className="uppercase tracking-widest text-text-muted opacity-60 leading-none">Status: IN_POSITION</LpdText>
            <div className="flex items-baseline gap-2 mt-2">
              <LpdText size="xl" weight="black" className={cn("font-mono leading-none", isWinner ? "text-emerald-500" : "text-rose-500")}>
                {isWinner ? '+' : '-'}${Math.abs(pnlUsdt).toFixed(2)}
              </LpdText>
              <LpdText size="xs" weight="black" className={cn("font-mono opacity-80", isWinner ? "text-emerald-500" : "text-rose-500")}>
                ({isWinner ? '+' : ''}{pnlPct.toFixed(2)}%)
              </LpdText>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Telemetría de Tiempo y Capital */}
      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-4">
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Capital_Deployed</LpdText>
            <LpdText size="sm" weight="black" className="font-mono text-text-main">${Number(bot.baseInvestmentUsdt || 0).toLocaleString()}</LpdText>
          </div>
          <div className="flex flex-col gap-1">
            <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Est_Fees_RT</LpdText>
            <LpdText size="sm" weight="black" className="font-mono text-text-main/80">
              -${(Number(bot.baseInvestmentUsdt || 0) * 0.002).toFixed(2)} <span className="text-[9px] opacity-40">(0.20%)</span>
            </LpdText>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Time_In_Trade</LpdText>
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <Icon name="schedule" size="nano" className="text-primary opacity-80" />
            <LpdText size="xs" weight="black" className="font-mono text-primary animate-pulse tracking-tighter">{elapsedTime}</LpdText>
          </div>
        </div>
      </div>

      {/* 3. Visualizador de Rango de Salida */}
      <PositionProgressBar 
        currentPrice={bot.currentPrice} 
        entryPrice={bot.currentEntryPrice} 
        slPrice={slPrice} 
        tpPrice={tpPrice} 
        bePrice={bePrice} 
        isShort={bot.currentPositionSide === 'SHORT'}
      />

      {/* 4. Comandos de Acción Táctica */}
      <PositionQuickActions 
        onMarketExit={onMarketExit}
        onSetToBE={onSetToBE}
        onExecuteTP={onExecuteTP}
        onUpdateTrail={onUpdateTrail}
        canMoveToBE={canMoveToBE}
        trailingDistance={trailingDistance}
      />

      {/* 5. Grid de Precios de Seguridad (REESTRUCTURADO) */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 pt-6 border-t border-white/5">
        <div className="flex flex-col gap-2">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40 tracking-widest">Entry_Price</LpdText>
          <LpdText size="md" weight="black" className="font-mono text-text-main opacity-90">${formatPrice(bot.currentEntryPrice)}</LpdText>
          <LpdText size="nano" className="text-text-muted font-mono opacity-30 italic uppercase">Tick_Verified</LpdText>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40 tracking-widest">Break_Even</LpdText>
          <LpdText size="md" weight="black" className="font-mono text-primary opacity-90">${formatPrice(bePrice)}</LpdText>
          <LpdText size="xs" weight="black" className="text-primary opacity-80 font-mono">{getRelPct(bePrice)}% / {getRelUsd(bePrice)}</LpdText>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <LpdText 
              size="nano" 
              weight="black" 
              className={cn("uppercase tracking-widest", slPrice > bot.currentEntryPrice ? "text-emerald-500/50" : "text-rose-500/50")}
            >
              Stop_Loss
            </LpdText>
            <LpdText 
              size="xs" 
              weight="black" 
              className={cn("font-mono opacity-80", slPrice > bot.currentEntryPrice ? "text-emerald-500" : "text-rose-500")}
            >
              {getRelPct(slPrice)}% / {getRelUsd(slPrice)}
            </LpdText>
          </div>
          <LpdText 
            size="md" 
            weight="black" 
            className={cn("font-mono opacity-90", slPrice > bot.currentEntryPrice ? "text-emerald-500" : "text-rose-500")}
          >
            ${formatPrice(slPrice)}
          </LpdText>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <LpdText size="nano" weight="black" className="uppercase text-emerald-500/50 tracking-widest">Target_TP</LpdText>
          <LpdText size="md" weight="black" className="font-mono text-emerald-500 opacity-90">${formatPrice(tpPrice)}</LpdText>
          <LpdText size="xs" weight="black" className="text-emerald-500 opacity-80 font-mono">{getRelPct(tpPrice)}% / {getRelUsd(tpPrice)}</LpdText>
        </div>
      </div>
    </div>
  );
};
