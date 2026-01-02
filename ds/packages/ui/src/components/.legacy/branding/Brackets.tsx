import React from 'react';
import { cn } from '../../../helpers/cn';

export interface BracketsProps {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'energy' | 'muted';
}

/**
 * Brackets Support Atom
 * Used to frame technical or strategic content with { } symbols.
 */
export const Brackets: React.FC<BracketsProps> = ({ 
  children, 
  className,
  color = 'primary'
}) => {
  const colorMap = {
    primary: 'text-[var(--lpd-color-brand-primary)]',
    energy: 'text-[var(--lpd-color-brand-secondary)]',
    muted: 'text-[var(--lpd-color-text-muted)]',
  };

  return (
    <div className={cn("inline-flex items-center font-mono font-bold tracking-tighter", className)}>
      <span className={cn("text-2xl md:text-4xl transition-transform duration-500", colorMap[color])}>{`{`}</span>
      <div className="px-4">
        {children}
      </div>
      <span className={cn("text-2xl md:text-4xl transition-transform duration-500", colorMap[color])}>{`}`}</span>
    </div>
  );
};
