import React from 'react';
import { cn } from '../../helpers/cn';

interface StatusBadgeProps {
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

/**
 * @component StatusBadge
 * @description High-fidelity badge from the Overview design.
 * Includes a pulse animation dot and specialized typography.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  children, 
  className,
  pulse = true 
}) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lpd-color-brand-primary)]/10 border border-[var(--lpd-color-brand-primary)]/20 w-fit",
      className
    )}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lpd-color-brand-primary)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lpd-color-brand-primary)]"></span>
        </span>
      )}
      <span className="text-[10px] font-bold text-[var(--lpd-color-brand-primary)] tracking-widest uppercase">
        {children}
      </span>
    </div>
  );
};
