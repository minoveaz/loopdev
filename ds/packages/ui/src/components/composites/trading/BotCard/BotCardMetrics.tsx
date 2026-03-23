'use client';

import { LpdText } from '../../../atoms/foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface BotCardMetricsProps {
  sma?: number;
  atr?: number;
  logicSnapshot?: Record<string, any>;
  smaDirection?: 'up' | 'down';
  atrDirection?: 'up' | 'down';
  persistedSmaColor: string;
  persistedAtrColor: string;
}

/**
 * @component BotCardMetrics
 * @description Strategy heartbeat metrics (SMA/ATR/RSI) with directionality.
 */
export const BotCardMetrics = ({
  sma,
  atr,
  logicSnapshot,
  smaDirection,
  atrDirection,
  persistedSmaColor,
  persistedAtrColor,
}: BotCardMetricsProps) => {
  if (!sma && !atr && !logicSnapshot) return null;

  // Resolve dynamic values from snapshot if available
  const rsi = logicSnapshot?.rsi;
  const smaVal = sma || logicSnapshot?.sma20;
  const atrVal = atr || logicSnapshot?.atr_vol || logicSnapshot?.atr;

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-border-technical/10">
      <div className="flex items-center justify-between">
        <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40 font-mono">Strategy_Heartbeat</LpdText>
        <LpdText size="nano" className="text-primary font-mono opacity-60">LIVE_DATA</LpdText>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: RSI (High priority) or SMA */}
        {(rsi !== undefined || smaVal !== undefined) && (
          <div className="bg-background-subtle/30 dark:bg-white/5 rounded-lg p-3 border border-border-technical/20">
            <LpdText size="nano" className="text-text-muted uppercase font-bold text-[9px] mb-1">
              {rsi !== undefined ? "RSI_14" : "SMA_20"}
            </LpdText>
            <div className="flex items-center gap-2">
              <LpdText size="sm" weight="black" className={cn("font-mono", persistedSmaColor)}>
                {rsi !== undefined 
                  ? Number(rsi).toFixed(2)
                  : `$${Number(smaVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
              </LpdText>
              {smaDirection && (
                <span className={cn("text-base font-black transition-all", smaDirection === 'up' ? 'text-emerald-500' : 'text-rose-500')}>
                  {smaDirection === 'up' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Metric 2: ATR (Volatility focus) */}
        {atrVal !== undefined && (
          <div className="bg-background-subtle/30 dark:bg-white/5 rounded-lg p-3 border border-border-technical/20">
            <LpdText size="nano" className="text-text-muted uppercase font-bold text-[9px] mb-1">ATR_Volatility</LpdText>
            <div className="flex items-center gap-2">
              <LpdText size="sm" weight="black" className={cn("font-mono", persistedAtrColor)}>
                {Number(atrVal).toFixed(Number(atrVal) < 1 ? 4 : 2)}
              </LpdText>
              {atrDirection && (
                <span className={cn("text-base font-black transition-all", atrDirection === 'up' ? 'text-emerald-500' : 'text-rose-500')}>
                  {atrDirection === 'up' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
