'use client';

import React from 'react';
import { MetricCardProps } from './types';
import { TechnicalSurface, LpdText, Skeleton } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component MetricCard
 * @description Official LoopDev component for displaying KPIs and real-time metrics.
 * Implements the technical hierarchy from Blueprint UX v1.0.
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  trend,
  icon,
  colorClassName,
  isLoading = false,
  children,
  className
}) => {
  
  // Trend Auto-coloring
  const trendClasses = cn(
    "text-[10px] font-bold",
    trend === 'up' && "text-emerald-500",
    trend === 'down' && "text-rose-500",
    trend === 'neutral' && "text-slate-400",
    !trend && "opacity-50"
  );

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn("p-4 flex flex-col gap-1 border-border-technical/30 group hover:border-border-technical/60 transition-all", className)}
    >
      <div className="flex items-center justify-between mb-1">
        <LpdText size="nano" className="text-text-muted uppercase font-black tracking-widest truncate">
          {label}
        </LpdText>
        {icon && (
          <span className={cn("material-symbols-outlined text-sm opacity-40 group-hover:opacity-100 transition-opacity", colorClassName)}>
            {icon}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2 mt-1">
          <Skeleton className="h-7 w-2/3 rounded-lg" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
        </div>
      ) : (
        <>
          <div className={cn("text-xl font-black font-mono tracking-tighter text-text-main", colorClassName)}>
            {value}
          </div>
          
          {(delta || trend) && (
            <div className={trendClasses}>
              {delta}
            </div>
          )}
        </>
      )}

      {children && <div className="mt-4">{children}</div>}
    </TechnicalSurface>
  );
};
