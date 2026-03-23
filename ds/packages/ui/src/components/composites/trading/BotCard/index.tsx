'use client';

import React, { useRef, useState, useEffect } from 'react';
import { BotCardProps } from './types';
import { TechnicalSurface } from '../../../atoms/surfaces/TechnicalSurface';
import { BotCardHeader } from './BotCardHeader';
import { BotCardPrice } from './BotCardPrice';
import { BotCardState } from './BotCardState';
import { BotCardMetrics } from './BotCardMetrics';
import { BotCardControls } from './BotCardControls';
import { cn } from '../../../../helpers/cn';

/**
 * @component BotCardIndustrial
 * @description Master management card. Strictly reactive price telemetry.
 */
export const BotCardIndustrial: React.FC<BotCardProps> = ({
  bot,
  onOpenDetails,
  onToggleStatus,
  onDelete,
  onMarketExit,
  onSetToBE,
  onExecuteTP,
  onUpdateTrail,
  className
}) => {
  const isActive = bot.status === 'active' || bot.status === 'paper_trading';
  const isInPosition = bot.currentEntryPrice > 0;
  
  /**
   * --- STANDARDIZED REACTIVE PRICE TELEMETRY (INDUSTRIAL STANDARD) ---
   * @logic_lock DO NOT REVERT TO DB-BASED HISTORY COMPARISON.
   * @reason DB history is often batched or delayed. For real-time UI feedback (Green/Red), 
   * we MUST compare against the previous render's state in memory (useRef) to ensure 
   * 100% reactivity to the ticker, even if the DB hasn't persisted the 'prev' tick yet.
   */
  const lastPrice = Number(bot.currentPrice || 0);
  const prevPriceRef = useRef(lastPrice);
  const [priceDir, setPriceDir] = useState<'up' | 'down'>('up');

  useEffect(() => {
    // CRITICAL: Strict Price Movement Logic (Market Truth Only)
    if (lastPrice !== prevPriceRef.current && lastPrice > 0) {
      const newDir = lastPrice > prevPriceRef.current ? 'up' : 'down';
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[BotCard:${bot.pair}] TELEMETRY_TICK: ${prevPriceRef.current} -> ${lastPrice} | DIR: ${newDir}`);
      }
      
      setPriceDir(newDir);
      prevPriceRef.current = lastPrice;
    }
  }, [lastPrice]);

  // COLOR_TRUTH: Strictly reactive to movement, ignored by sentiment/PnL for price text.
  const priceMovementColor = priceDir === 'up' ? "text-emerald-500" : "text-rose-500";

  // Resolución de sentimiento Unificada (Prioridad: Sesgo de Estrategia > Macro)
  const strategyBias = bot.logicSnapshot?.bias?.toLowerCase();
  const macroSentiment = bot.macroSentiment?.toLowerCase();
  
  const resolvedSentiment = (strategyBias && strategyBias !== 'neutral' && strategyBias !== 'stable') 
    ? strategyBias 
    : (macroSentiment || 'neutral');

  // Color de Estado (Bordes/Glow)
  const stateColorClass = isInPosition 
    ? (bot.currentPnlPct >= 0 ? "emerald" : "rose")
    : (priceDir === 'up' ? "emerald" : "rose");

  const glowColor = isActive ? (stateColorClass === "emerald" ? "bg-emerald-500" : "bg-rose-500") : "bg-amber-500";

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="raised" 
      className={cn(
        "p-10 flex flex-col gap-16 rounded-[40px] transition-all duration-700 hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] border relative overflow-hidden group select-none",
        isInPosition ? (bot.currentPnlPct >= 0 ? "border-emerald-500/20" : "border-rose-500/20") : "border-white/5",
        isActive ? "bg-slate-900" : "bg-slate-950 opacity-80",
        className
      )}
    >
      <div className={cn(
        "absolute -right-24 -top-24 w-64 h-64 rounded-full blur-[140px] opacity-10 transition-all duration-1000",
        glowColor
      )} />

      <BotCardHeader 
        name={bot.name} 
        pair={bot.pair} 
        sentiment={resolvedSentiment} 
        strategyName={bot.strategyName}
        coreId={bot.coreId}
        logicSnapshot={bot.logicSnapshot}
        onInspect={() => onOpenDetails?.(bot.id)}
        onDelete={() => onDelete?.(bot.id)}
      />

      <div className="flex flex-col gap-12 mt-4">
        <BotCardPrice 
          price={bot.currentPrice} 
          direction={priceDir}
          persistedColor={priceMovementColor}
          isPaperTrading={bot.status === 'paper_trading' || bot.status === 'active'}
        />

        <BotCardState 
          currentAction={bot.currentAction} 
          isActive={isActive}
          bot={bot}
          onMarketExit={onMarketExit ? () => onMarketExit(bot.id) : undefined}
          onSetToBE={onSetToBE ? () => onSetToBE(bot.id) : undefined}
          onExecuteTP={onExecuteTP ? () => onExecuteTP(bot.id) : undefined}
          onUpdateTrail={onUpdateTrail ? (dist) => onUpdateTrail(bot.id, dist) : undefined}
        />
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-12">
        <BotCardControls 
          status={bot.status}
          onToggle={() => onToggleStatus?.(bot.id, isActive ? 'paused' : 'active')}
        />
      </div>

    </TechnicalSurface>
  );
};
