'use client';

import React, { useEffect, useState, useRef } from 'react';
import { LivePriceLabelProps } from './types';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

/**
 * @component LivePriceLabel
 * @description Real-time price streaming atom. 
 * Connects directly to Binance public WebSocket for low-latency updates.
 */
export const LivePriceLabel: React.FC<LivePriceLabelProps> = ({
  pair,
  size = 'sm',
  showChange = false,
  className
}) => {
  const [price, setPrice] = useState<string | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const lastPrice = useRef<number>(0);

  useEffect(() => {
    // Standardize pair for Binance WS (e.g. btcusdt)
    const streamSymbol = pair.replace('/', '').toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.c);
      
      if (newPrice > lastPrice.current) setTrend('up');
      else if (newPrice < lastPrice.current) setTrend('down');
      
      setPrice(newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      lastPrice.current = newPrice;

      // Reset trend color after a brief flash
      setTimeout(() => setTrend('neutral'), 500);
    };

    return () => ws.close();
  }, [pair]);

  const typographySize = size === 'md' ? 'base' : size;

  return (
    <div className={cn("flex items-center gap-2 font-mono", className)}>
      <LpdText 
        size={typographySize}
        weight="bold"
        className={cn(
          "transition-colors duration-300 tracking-tighter",
          trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-text-main"
        )}
      >
        {price ? `$${price}` : '---.--'}
      </LpdText>
      
      <span className="text-[8px] font-black uppercase text-text-muted opacity-30 tracking-widest">
        LIVE
      </span>
    </div>
  );
};
