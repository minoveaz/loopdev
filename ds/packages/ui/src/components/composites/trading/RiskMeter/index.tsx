'use client';

import React from 'react';
import { RiskMeterProps } from './types';
import { LpdText, Heading, TechnicalSurface } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component RiskMeter
 * @description Official LoopDev composite for risk and limit visualization.
 * Implements Section 22.6 of the Blueprint UX.
 */
export const RiskMeter: React.FC<RiskMeterProps> = ({
  value,
  maxValue,
  valueLabel,
  maxLabel,
  title,
  subtitle,
  withGlow = true,
  className
}) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  // Semantic Color Logic
  const isDanger = percentage >= 85;
  const isWarning = percentage >= 60 && percentage < 85;
  
  const barColor = isDanger 
    ? 'bg-rose-500' 
    : isWarning 
    ? 'bg-amber-500' 
    : 'bg-emerald-500';

  const glowColor = isDanger 
    ? 'shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
    : isWarning 
    ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
    : 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <Heading size="xs" weight="bold" className="uppercase tracking-tight opacity-40">
          {title}
        </Heading>
        {subtitle && (
          <LpdText size="nano" className={cn(
            "font-mono italic uppercase tracking-widest",
            isDanger ? "text-rose-500" : isWarning ? "text-amber-500" : "text-emerald-500"
          )}>
            {subtitle}
          </LpdText>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-1">
          <span className="text-text-main dark:text-white">{valueLabel || value}</span>
          <span className="text-text-muted">{maxLabel || `/ ${maxValue}`}</span>
        </div>
        
        <div className="w-full h-1.5 bg-background-subtle dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              barColor,
              withGlow && glowColor
            )}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
