'use client';

import React, { useMemo } from 'react';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface PulseSparklineProps {
  data: number[];
  logicSnapshot?: any;
  className?: string;
}

/**
 * @component PulseSparkline
 * @description Transformed from decoration to Strategy Confluence Monitor.
 * Handles missing telemetry gracefully without fake data.
 */
export const PulseSparkline: React.FC<PulseSparklineProps> = ({ 
  data = [], 
  logicSnapshot,
  className
}) => {
  const hasHistory = Array.isArray(data) && data.length > 5;
  const hasLogic = logicSnapshot && Object.keys(logicSnapshot).length > 0;

  // 1. MODO GRÁFICO REAL (Si hay historial)
  if (hasHistory) {
    const points = data.slice(-20);
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min;

    return (
      <div className={cn("h-16 w-full bg-slate-950/40 rounded-xl flex items-end gap-1 p-2 border border-white/5 overflow-hidden relative", className)}>
        <div className="absolute top-2 left-3 opacity-20 uppercase font-black text-[6px] tracking-widest text-white">Price_Action_1H</div>
        {points.map((val, i) => {
          const height = range === 0 ? 50 : ((val - min) / range) * 70 + 20;
          return (
            <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${height}%` }} />
          );
        })}
      </div>
    );
  }

  // 2. MODO CONFLUENCIA (Información Táctica)
  if (hasLogic) {
    const indicators = [
      { label: 'RSI_14', val: logicSnapshot.rsi ?? '--', status: (logicSnapshot.rsi > 70 || logicSnapshot.rsi < 30) ? 'ready' : 'wait' },
      { label: 'SMA_DIST', val: `${logicSnapshot.sma_dist ?? '--'}%`, status: 'wait' },
      { label: 'VOL_STATUS', val: logicSnapshot.vol_status ?? '--', status: logicSnapshot.vol_status === 'HIGH' ? 'ready' : 'wait' },
      { label: 'BIAS', val: logicSnapshot.bias?.toUpperCase() ?? '--', status: 'neutral' }
    ];

    return (
      <div className={cn("h-16 w-full bg-slate-950/60 rounded-xl grid grid-cols-4 gap-2 p-2 border border-white/10 relative overflow-hidden", className)}>
        {indicators.map((ind, i) => (
          <div key={i} className="flex flex-col justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
            <LpdText size="nano" weight="black" className="text-[5px] text-text-muted opacity-40 uppercase truncate">{ind.label}</LpdText>
            <div className="flex flex-col gap-0.5">
              <LpdText size="nano" weight="black" className={cn(
                "text-[8px] font-mono",
                ind.status === 'ready' ? "text-emerald-500" : "text-primary"
              )}>{ind.val}</LpdText>
              <div className={cn("h-1 w-full rounded-full", ind.status === 'ready' ? "bg-emerald-500/20" : "bg-white/5")}>
                <div className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  ind.status === 'ready' ? "bg-emerald-500 w-full" : "bg-primary w-1/3 animate-pulse"
                )} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. ESTADO DE ESPERA (Si no hay nada)
  return (
    <div className={cn("h-16 w-full bg-slate-950/40 rounded-xl flex flex-col items-center justify-center border border-dashed border-white/10 gap-2", className)}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
        <LpdText size="nano" weight="black" className="text-white/20 uppercase tracking-[0.3em] text-[6px]">Awaiting_Engine_Telemetry</LpdText>
      </div>
      <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
};
