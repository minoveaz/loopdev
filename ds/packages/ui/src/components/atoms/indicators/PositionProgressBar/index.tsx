'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';

interface PositionProgressBarProps {
  currentPrice: number;
  entryPrice: number;
  slPrice: number;
  tpPrice: number;
  bePrice?: number;
  isShort?: boolean;
  className?: string;
}

/**
 * @component PositionProgressBar
 * @deprecated Legacy trading position visualization. Do not use for generic
 * dashboard or suite progress compositions.
 * @description Refined Trade Range Bar.
 * Shows SL, TP, BE and Current Price as a glowing indicator.
 * Supports both LONG and SHORT polarities.
 */
export const PositionProgressBar: React.FC<PositionProgressBarProps> = ({
  currentPrice,
  entryPrice,
  slPrice,
  tpPrice,
  bePrice,
  isShort = false,
  className,
}) => {
  if (!slPrice || !tpPrice) return null;

  // En un corto, el rango es de arriba (SL) a abajo (TP)
  const minRange = Math.min(slPrice, tpPrice);
  const maxRange = Math.max(slPrice, tpPrice);
  const totalRange = maxRange - minRange;

  if (totalRange <= 0) return null;

  const getPos = (price: number) => {
    const pos = ((price - minRange) / totalRange) * 100;
    return Math.max(0, Math.min(100, pos));
  };

  const currentPos = getPos(currentPrice);
  const entryPos = getPos(entryPrice);
  const bePos = bePrice ? getPos(bePrice) : entryPos;

  // Invertimos la lógica de ganador según el modo
  const isInProfit = isShort ? currentPrice <= entryPrice : currentPrice >= entryPrice;

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="w-full h-1 bg-white/5 rounded-full relative">
        {/* 1. Track: Color dinámico según posición */}
        <div
          className={cn(
            'absolute h-full transition-all duration-700 rounded-full',
            isInProfit ? 'bg-emerald-500/40' : 'bg-rose-500/40',
          )}
          style={{
            left: `${Math.min(entryPos, currentPos)}%`,
            width: `${Math.abs(currentPos - entryPos)}%`,
          }}
        />

        {/* 2. Break-even Marker (Micro-marca) */}
        <div
          className="absolute top-[-2px] w-[2px] h-[8px] bg-primary z-10 shadow-[0_0_5px_var(--lpd-color-brand-primary)]"
          style={{ left: `${bePos}%` }}
          title="Break-even"
        />

        {/* 3. Entry Marker */}
        <div
          className="absolute top-[-2px] w-[1px] h-[8px] bg-white/40 z-10"
          style={{ left: `${entryPos}%` }}
        />

        {/* 4. CURRENT PRICE DOT (Glowing Indicator) */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-20 transition-all duration-1000 ease-out',
            isInProfit
              ? 'bg-[var(--lpd-color-status-success)] shadow-[0_0_10px_var(--lpd-color-status-success)]'
              : 'bg-[var(--lpd-color-status-error)] shadow-[0_0_10px_var(--lpd-color-status-error)]',
          )}
          style={{ left: `calc(${currentPos}% - 5px)` }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-inherit" />
        </div>
      </div>

      {/* Etiquetas de los extremos: Invierten posición si es SHORT */}
      <div className="flex justify-between">
        <span className="text-[7px] font-black text-rose-500/60 uppercase tracking-tighter">
          {isShort ? 'TAKE_PROFIT' : 'STOP_LOSS'}
        </span>
        <span className="text-[7px] font-black text-emerald-500/60 uppercase tracking-tighter">
          {isShort ? 'STOP_LOSS' : 'TAKE_PROFIT'}
        </span>
      </div>
    </div>
  );
};
