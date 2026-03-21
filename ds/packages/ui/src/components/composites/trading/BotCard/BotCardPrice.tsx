'use client';

import React from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface BotCardPriceProps {
  price: number;
  direction?: 'up' | 'down' | 'neutral';
  persistedColor?: string;
  isPaperTrading?: boolean;
}

/**
 * @component BotCardPrice
 * @description Technical price display. Ensures arrow and text color are always synchronized.
 */
export const BotCardPrice = ({ price, direction, persistedColor, isPaperTrading }: BotCardPriceProps) => {
  const isSyncing = price === 0;
  const hasMovement = direction === 'up' || direction === 'down';
  
  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40">
          {isPaperTrading ? "Testnet_Index_Price" : "Live_Market_Price"}
        </LpdText>
        {isPaperTrading && (
          <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-[7px] font-black text-amber-500 uppercase tracking-tighter">
            Paper_Env
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <LpdText 
          size="2xl" 
          weight="black" 
          className={cn(
            "font-mono tracking-tighter transition-all duration-500",
            isSyncing ? "text-text-muted opacity-20 animate-pulse" : (persistedColor || "text-text-main")
          )}
        >
          {isSyncing ? "SYNC_WAIT..." : `$${formattedPrice}`}
        </LpdText>
        
        {/* LA FLECHA SIEMPRE APARECE PARA REFORZAR EL COLOR */}
        {!isSyncing && (
          <span className={cn(
            "material-symbols-outlined text-sm font-black transition-all duration-500",
            direction === 'up' ? "text-emerald-500" : "text-rose-500"
          )}>
            {direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        )}
      </div>
    </div>
  );
};
