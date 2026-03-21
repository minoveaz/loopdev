'use client';

import React from 'react';
import { LpdText } from '../../foundations/Typography';
import { TechnicalSurface } from '../../surfaces/TechnicalSurface';
import { cn } from '../../../../helpers/cn';

interface IndustrialMetricProps {
  label: string;
  value: string | number;
  secondaryValue?: string | number;
  valueClassName?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

/**
 * @component IndustrialMetric
 * @description Atomic unit for high-density telemetry. 
 * Optimized for legibility of primary and secondary data points.
 */
export const IndustrialMetric: React.FC<IndustrialMetricProps> = ({
  label,
  value,
  secondaryValue,
  valueClassName,
  trend,
  className
}) => {
  return (
    <TechnicalSurface 
      variant="subtle" 
      className={cn(
        "p-5 flex flex-col justify-between gap-4 rounded-2xl border border-border-technical/30 bg-white/[0.03] shadow-inner transition-all hover:bg-white/[0.06] group",
        className
      )}
    >
      <LpdText 
        size="nano" 
        weight="black" 
        className="text-text-muted uppercase opacity-50 tracking-[0.2em] font-mono leading-none"
      >
        {label}
      </LpdText>
      
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2">
          <LpdText 
            size="lg" 
            weight="black" 
            className={cn(
              "font-mono tracking-tighter leading-none",
              trend === 'up' && "text-emerald-500",
              trend === 'down' && "text-rose-500",
              !trend && "text-text-main",
              valueClassName
            )}
          >
            {value}
          </LpdText>
          
          {trend && (
            <span className={cn(
              "material-symbols-outlined text-xs font-black",
              trend === 'up' ? "text-emerald-500" : "text-rose-500"
            )}>
              {trend === 'up' ? 'arrow_upward' : 'arrow_downward'}
            </span>
          )}
        </div>
        
        {secondaryValue && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-px bg-white/20" />
            <LpdText size="xs" weight="bold" className="font-mono text-text-main/60 tracking-tight">
              {secondaryValue}
            </LpdText>
          </div>
        )}
      </div>
    </TechnicalSurface>
  );
};
