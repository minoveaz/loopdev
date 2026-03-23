'use client';

import React, { useMemo } from 'react';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface PulseSparklineProps {
  data?: number[];
  logicSnapshot?: any;
  className?: string;
  color?: 'primary' | 'success' | 'danger';
}

/**
 * @component PulseSparkline
 * @description Advanced activity monitor. Fixed for industrial visibility.
 */
export const PulseSparkline: React.FC<PulseSparklineProps> = ({ 
  data = [], 
  logicSnapshot,
  className,
  color = 'primary'
}) => {
  const hasHistory = Array.isArray(data) && data.length > 5;
  const hasLogic = logicSnapshot && typeof logicSnapshot === 'object';

  // 1. MODO GRÁFICO REAL (Si hay historial de precios)
  const points = data.slice(-25);
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min;

  return (
    <div className={cn("h-16 w-full bg-slate-950/40 rounded-xl flex items-end gap-1 p-3 border border-white/5 overflow-hidden relative group/spark", className)}>
      {points.length > 0 ? (
        points.map((val, i) => {
          const height = range === 0 ? 50 : ((val - min) / range) * 70 + 20;
          return (
            <div 
              key={i} 
              className="flex-1 bg-primary/20 rounded-t-[1px] transition-all duration-500 group-hover/spark:bg-primary/40" 
              style={{ height: `${height}%` }} 
            />
          );
        })
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <LpdText size="nano" className="text-text-muted opacity-20 uppercase tracking-[0.3em] italic">Waiting_For_Market_Data...</LpdText>
        </div>
      )}
      
      {/* Neural Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent -translate-x-full animate-shimmer pointer-events-none" />
    </div>
  );
};
