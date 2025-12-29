import React from 'react';
import { cn } from '../../helpers/cn';

export interface BrandTextProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  color?: 'primary' | 'white' | 'current';
}

const sizeClasses = {
  sm: 'text-lg tracking-tight',
  md: 'text-2xl tracking-tight',
  lg: 'text-4xl tracking-tighter',
  xl: 'text-5xl tracking-tighter',
  auto: 'text-[1em] tracking-tight',
};

const colorClasses = {
  primary: 'text-[var(--lpd-color-brand-primary)]',
  white: 'text-white',
  current: 'text-current',
};

/**
 * @atom BrandText
 * @description The official typography for "loop.dev".
 * Matches the designer's specs: font-bold, tracking-tight, and specific leading.
 */
export const BrandText: React.FC<BrandTextProps> = ({ 
  className,
  size = 'md',
  color = 'primary'
}) => {
  return (
    <span className={cn(
      "font-[var(--lpd-font-weight-bold)] font-[var(--lpd-font-sans)] select-none leading-none inline-block",
      sizeClasses[size],
      colorClasses[color],
      className
    )}>
      loop.dev
    </span>
  );
};
