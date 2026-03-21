'use client';

import React from 'react';
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
 * @description Master management card. Binary coloring (Green/Red) with trend persistence.
 */
export const BotCardIndustrial: React.FC<BotCardProps> = ({
  bot,
  onOpenDetails,
  onToggleStatus,
  onDelete,
  onMarketExit,
  onSetToBE,
  onExecuteTP,
  className
}) => {
  const isActive = bot.status === 'active' || bot.status === 'paper_trading';
  const isInPosition = bot.currentEntryPrice > 0;
  
  // --- LÓGICA DE TENDENCIA BINARIA ---
  const lastPrice = Number(bot.currentPrice || 0);
  let prevPrice = lastPrice;

  // Buscamos hacia atrás en el historial el primer precio que sea diferente al actual
  if (bot.priceHistory?.length) {
    for (let i = bot.priceHistory.length - 1; i >= 0; i--) {
      const histPrice = Number(bot.priceHistory[i]);
      if (histPrice !== lastPrice) {
        prevPrice = histPrice;
        break;
      }
    }
  }
  
  // Determinamos dirección (Si son iguales por falta de historial, usamos el sentimiento como base)
  let priceDir: 'up' | 'down' = lastPrice >= prevPrice ? 'up' : 'down';
  if (lastPrice === prevPrice && bot.macroSentiment === 'bearish') priceDir = 'down';

  // Color Final: Siempre Esmeralda o Rose. Nunca blanco/gris.
  const finalColor = isInPosition 
    ? (bot.currentPnlPct >= 0 ? "text-emerald-500" : "text-rose-500")
    : (priceDir === 'up' ? "text-emerald-500" : "text-rose-500");

  const glowColor = isInPosition
    ? (bot.currentPnlPct >= 0 ? "bg-emerald-500" : "bg-rose-500")
    : (isActive ? "bg-primary" : "bg-amber-500");

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="raised" 
      className={cn(
        "p-10 flex flex-col gap-14 rounded-[40px] transition-all duration-700 hover:shadow-[0_0_60px_rgba(0,0,0,0.5)] border relative overflow-hidden group select-none",
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
        sentiment={bot.macroSentiment} 
        onInspect={() => onOpenDetails?.(bot.id)}
        onDelete={() => onDelete?.(bot.id)}
      />

      <div className="flex flex-col gap-12">
        <BotCardPrice 
          price={bot.currentPrice} 
          direction={priceDir}
          persistedColor={finalColor}
          isPaperTrading={bot.status === 'paper_trading' || bot.status === 'active'}
        />

        <BotCardState 
          currentAction={bot.currentAction} 
          isActive={isActive}
          bot={bot}
          onMarketExit={onMarketExit ? () => onMarketExit(bot.id) : undefined}
          onSetToBE={onSetToBE ? () => onSetToBE(bot.id) : undefined}
          onExecuteTP={onExecuteTP ? () => onExecuteTP(bot.id) : undefined}
        />
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-12">
        <BotCardMetrics 
          sma={bot.logicSnapshot?.sma_20}
          atr={bot.logicSnapshot?.atr_volatility}
          persistedSmaColor="text-primary"
          persistedAtrColor="text-emerald-500"
        />

        <BotCardControls 
          status={bot.status}
          onToggle={() => onToggleStatus?.(bot.id, isActive ? 'paused' : 'active')}
        />
      </div>

    </TechnicalSurface>
  );
};
