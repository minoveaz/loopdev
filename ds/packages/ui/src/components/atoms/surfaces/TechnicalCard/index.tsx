'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { TechnicalCardProps } from './types';

/**
 * @component TechnicalCard
 * @description Átomo de superficie universal para LoopDev OS.
 * Implementa bordes de 0.5px, radio de 2xl y estados interactivos industriales.
 */
export const TechnicalCard: React.FC<TechnicalCardProps> = ({
  variant = 'flat',
  children,
  className,
  ...props
}) => {
  const baseClasses = "rounded-2xl border border-border-technical transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    flat: "bg-surface-elevated",
    interactive: "bg-surface-elevated cursor-pointer hover:border-primary/40 hover:shadow-[0_0_20px_rgba(19,91,236,0.15)] hover:scale-[1.01] active:scale-[0.99]",
    warning: "bg-surface-elevated border-energy-yellow/30 shadow-[0_0_15px_rgba(250,204,21,0.05)]",
    disabled: "bg-surface-elevated opacity-50 grayscale cursor-not-allowed pointer-events-none"
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
