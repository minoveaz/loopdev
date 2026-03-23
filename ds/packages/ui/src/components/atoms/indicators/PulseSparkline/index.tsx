'use client';

import React, { useMemo, useState } from 'react';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface PulseSparklineProps {
  data?: number[];
  className?: string;
}

/**
 * @component PulseSparkline
 * @description Clean Industrial Activity Monitor. 
 * Minimalist high-density visualization for professional trading.
 */
export const PulseSparkline: React.FC<PulseSparklineProps> = ({ 
  data = [], 
  className 
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const points = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    return source
      .map(v => Number(v))
      .filter(v => !isNaN(v) && v > 0)
      .slice(-30);
  }, [data]);

  const hoveredPrice = hoveredIdx !== null ? points[hoveredIdx] : null;
  const isHoveredUp = hoveredIdx !== null && (hoveredIdx === 0 || points[hoveredIdx] >= points[hoveredIdx - 1]);

  const { max, min, range } = useMemo(() => {
    if (points.length === 0) return { max: 0, min: 0, range: 0 };
    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    return { max: maxVal, min: minVal, range: maxVal - minVal || 1 };
  }, [points]);

  return (
    <div 
      className={cn(
        "h-28 w-full bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden relative group/spark flex flex-col p-3", 
        className
      )}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* CABECERA TÉCNICA LIMPIA */}
      <div className="flex justify-between items-center mb-2 px-1 relative z-20 min-h-[24px]">
        <LpdText size="nano" weight="black" className="text-[8px] text-text-muted opacity-40 font-mono tracking-tighter">HI: ${max.toLocaleString()}</LpdText>
        
        {hoveredPrice !== null && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full border animate-in zoom-in-95 duration-200 shadow-lg",
            isHoveredUp ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-rose-500/10 border-rose-500/30 text-rose-500"
          )}>
            <div className={cn("w-1 h-1 rounded-full animate-pulse", isHoveredUp ? "bg-emerald-500" : "bg-rose-500")} />
            <LpdText size="xs" weight="black" className="font-mono uppercase tracking-widest">
              SCAN: ${hoveredPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </LpdText>
          </div>
        )}

        <div className="w-10" /> {/* Spacer para mantener equilibrio visual */}
      </div>

      {points.length > 1 ? (
        <div className="flex-1 flex items-end gap-[2px] relative">
          {/* BARRAS DE DATOS PURAS */}
          {points.map((val, i) => {
            const height = ((val - min) / range) * 85 + 10;
            const isLast = i === points.length - 1;
            const isUp = i === 0 || val >= points[i-1];
            const isCurrentHover = hoveredIdx === i;

            return (
              <div 
                key={`${i}-${val}`}
                className="flex-1 h-full flex items-end group/bar cursor-crosshair z-10"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <div 
                  className={cn(
                    "w-full rounded-t-[1px] transition-all duration-300",
                    isLast 
                      ? "bg-primary shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20" 
                      : isUp 
                        ? (isCurrentHover ? "bg-emerald-400 scale-x-110 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-emerald-500 opacity-60") 
                        : (isCurrentHover ? "bg-rose-400 scale-x-110 shadow-[0_0_10px_rgba(244,63,94,0.4)]" : "bg-rose-500 opacity-60")
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <LpdText size="nano" weight="black" className="text-text-muted opacity-10 uppercase tracking-[0.4em] italic">
            Market_Silence
          </LpdText>
        </div>
      )}

      {/* PIE TÉCNICO LIMPIO */}
      <div className="flex justify-between items-end mt-2 px-1 relative z-20">
        <LpdText size="nano" weight="black" className="text-[8px] text-text-muted opacity-40 font-mono tracking-tighter">LO: ${min.toLocaleString()}</LpdText>
        <LpdText size="nano" className="text-[7px] text-text-muted opacity-20 font-mono uppercase">TF: 1M / 30P</LpdText>
      </div>
      
      {/* Neural Scanline Effect (Sutil) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent -translate-x-full animate-shimmer pointer-events-none" />
    </div>
  );
};
