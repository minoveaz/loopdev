'use client';

import React from 'react';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface ProximityIndicatorProps {
  value: number; // 0 to 100
  className?: string;
}

/**
 * @component ProximityIndicator
 * @description Technical bar showing how close the strategy is to firing a signal.
 */
export const ProximityIndicator: React.FC<ProximityIndicatorProps> = ({ value, className }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center px-1">
        <LpdText size="nano" weight="black" className="uppercase text-text-muted opacity-40">Signal_Proximity</LpdText>
        <LpdText size="nano" weight="black" className="font-mono text-primary">{clampedValue}%</LpdText>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary shadow-[0_0_8px_var(--lpd-color-brand-primary)] transition-all duration-1000 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
