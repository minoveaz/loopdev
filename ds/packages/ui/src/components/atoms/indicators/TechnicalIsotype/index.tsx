'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { Icon } from '../../surfaces/Icon';
import { TechnicalIsotypeProps } from './types';

/**
 * @component TechnicalIsotype
 * @description Ancla visual de identidad v3.9 (Latent Life).
 * Exterior estático para estabilidad, interior con pulso lento para vida.
 */
export const TechnicalIsotype: React.FC<TechnicalIsotypeProps> = ({
  icon,
  tone = 'primary',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const toneClasses = {
    primary: 'text-primary border-primary/20',
    energy: 'text-energy-yellow border-energy-yellow/20',
    innovation: 'text-innovation-purple border-innovation-purple/20',
    neutral: 'text-text-muted border-border-technical'
  };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className)}>
      
      {/* 1. ANILLO EXTERIOR (Estabilidad: Borde 0.5px estático) */}
      <div className={cn(
        "absolute inset-0 rounded-full border-[0.5px] opacity-40",
        toneClasses[tone]
      )} />
      
      {/* 2. ANILLO INTERIOR (Vida Latente: Pulso lento 5s) */}
      <div className={cn(
        "absolute inset-[4px] rounded-full border border-border-technical bg-shell-canvas/30 dark:bg-white/5",
        "animate-[pulse_5s_ease-in-out_infinite] opacity-60"
      )} />

      {/* 3. ICONO CENTRAL (Foco de precisión) */}
      <div className="relative z-10 flex items-center justify-center transition-transform duration-700 hover:scale-110">
        <Icon 
          name={icon} 
          size={size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'md'} 
          className={cn("block drop-shadow-sm", toneClasses[tone])}
        />
      </div>
    </div>
  );
};