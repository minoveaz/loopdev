import React from 'react';
import { cn } from '../../helpers/cn';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = false,
  size = 'md',
  className,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-end mb-1">
          {label && <span className="text-[10px] font-black uppercase tracking-widest text-[var(--lpd-color-text-muted)]">{label}</span>}
          {showValue && <span className="text-xs font-bold text-[var(--lpd-color-brand-primary)]">{percentage}%</span>}
        </div>
      )}
      <div className={cn(
        "w-full bg-[var(--lpd-color-bg-subtle)] rounded-full overflow-hidden border border-[var(--lpd-color-border-subtle)]",
        sizeClasses[size]
      )}>
        <div 
          className="h-full bg-[var(--lpd-color-brand-primary)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
