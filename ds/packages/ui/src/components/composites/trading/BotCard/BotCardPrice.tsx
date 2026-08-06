'use client';

import React from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { Icon } from '../../../atoms/surfaces/Icon';
import { cn } from '../../../../helpers/cn';

interface BotCardPriceProps {
  price: number;
  direction?: 'up' | 'down' | 'neutral';
  persistedColor?: string;
  isPaperTrading?: boolean;
}

/**
 * @component BotCardPrice
 * @description Technical price display. 
 * High-scale industrial design (4xl) with integrated trend feedback.
 */
export const BotCardPrice = ({ price, direction, persistedColor, isPaperTrading }: BotCardPriceProps) => {
  const isSyncing = price === 0;
  
  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const finalColor = isSyncing ? "text-text-muted opacity-20" : (persistedColor || "text-text-main");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LpdText size="nano" weight="black" className="uppercase tracking-[0.25em] text-text-muted opacity-40 font-mono">
          {isPaperTrading ? "TESTNET_INDEX_PRICE" : "LIVE_MARKET_PRICE"}
        </LpdText>
        {isPaperTrading && (
          <div className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-500 uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            PAPER_ENV
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 group/price">
        <div className="relative">
          {/* Subtle background glow for the price */}
          {!isSyncing && (
            <div className={cn(
              "absolute -inset-4 blur-2xl opacity-10 transition-all duration-1000",
              direction === 'up' ? "bg-emerald-500" : "bg-rose-500"
            )} />
          )}
          
          <LpdText 
            size="4xl" 
            weight="black" 
            className={cn(
              "relative font-mono tracking-tighter transition-all duration-700 leading-none",
              finalColor
            )}
          >
            {isSyncing ? "SYNC_WAIT..." : `$${formattedPrice}`}
          </LpdText>
        </div>
        
        {/* TREND INDICATOR (LARGE INDUSTRIAL ARROW) */}
        {!isSyncing && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-700",
            direction === 'up' 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
              : "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
          )}>
            <Icon 
              name={direction === 'up' ? "trending_up" : "trending_down"} 
              size="sm" 
              className={cn("transition-transform duration-500", direction === 'up' ? "translate-y-[-1px]" : "translate-y-[1px]")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
