import React from 'react';
import { cn } from '@/helpers/cn';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ 
  orientation = 'horizontal', 
  label,
  className 
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn("inline-block w-px self-stretch bg-[var(--lpd-color-border-subtle)] min-h-[1em]", className)} />
    );
  }

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <div className="flex-1 border-t border-[var(--lpd-color-border-subtle)]" />
      {label && (
        <span className="px-3 text-[10px] font-black uppercase tracking-widest text-[var(--lpd-color-text-muted)]">
          {label}
        </span>
      )}
      {label && <div className="flex-1 border-t border-[var(--lpd-color-border-subtle)]" />}
    </div>
  );
};
