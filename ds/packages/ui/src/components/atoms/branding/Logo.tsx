import React from 'react';
import { cn } from '@/helpers/cn';

export interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'isotype';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  color?: 'primary' | 'white' | 'current';
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
  xl: 'h-16',
  auto: 'h-full w-auto',
};

const colorClasses = {
  primary: 'text-[var(--lpd-color-brand-primary)]',
  white: 'text-white',
  current: 'text-current',
};

/**
 * LoopDev Official Logo Atom
 * Uses the exact "all_inclusive" Material Symbol geometry for the isotype.
 */
export const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  className,
  size = 'md',
  color = 'primary'
}) => {
  const Isotype = (
    <svg 
      viewBox="0 0 48 48" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", sizeClasses[size], colorClasses[color])}
    >
      <path d="M10.5 35.4q-4.35 0-7.425-3.075Q0 29.25 0 24.9q0-4.35 3.075-7.425Q6.15 14.4 10.5 14.4q2.2 0 4.25.825t3.65 2.375l2.4 2.45-2.4 2.45q-1.3-1.3-2.85-1.975-1.55-.675-3.2-.675-3.1 0-5.3 2.2-2.2 2.2-2.2 5.3 0 3.1 2.2 5.3 2.2 2.2 5.3 2.2 1.65 0 3.2-.675 1.55-.675 2.85-1.975l2.4 2.45-2.4 2.45q-1.6 1.55-3.65 2.375t-4.25.825Zm13.5-9.05-2.4-2.45 2.4-2.45 2.4 2.45-2.4 2.45ZM37.5 35.4q-2.2 0-4.25-.825t-3.65-2.375l-2.4-2.45 2.4-2.45q1.3 1.3 2.85 1.975 1.55.675 3.2.675 3.1 0 5.3-2.2 2.2-2.2 2.2-5.3 0-3.1-2.2-5.3-2.2-2.2-5.3-2.2-1.65 0-3.2.675-1.55.675-2.85 1.975l-2.4-2.45 2.4-2.45q1.6-1.55 3.65-2.375t4.25-.825q4.35 0 7.425 3.075Q48 20.55 48 24.9q0 4.35-3.075 7.425Q41.85 35.4 37.5 35.4Z" />
    </svg>
  );

  const BrandName = (
    <span className={cn(
      "font-black tracking-tighter leading-none select-none",
      colorClasses[color],
      size === 'sm' ? 'text-lg pt-0.5' : size === 'md' ? 'text-2xl pt-1' : size === 'lg' ? 'text-4xl pt-1.5' : 'text-5xl pt-2'
    )}>
      loop.dev
    </span>
  );

  if (variant === 'isotype') return Isotype;

  if (variant === 'vertical') {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {Isotype}
        {BrandName}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Isotype}
      {BrandName}
    </div>
  );
};