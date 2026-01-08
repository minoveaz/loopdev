'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { Icon } from '../../surfaces/Icon';
import { TechnicalIsotypeProps } from './types';

/**
 * @component TechnicalIsotype
 * @description Ancla visual de identidad con animación técnica de alta visibilidad.
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

  // Colores de borde más intensos para modo claro
  const toneClasses = {
    primary: 'border-primary/60 dark:border-primary/30',
    energy: 'border-energy-yellow/80 dark:border-energy-yellow/30',
    innovation: 'border-innovation-purple/80 dark:border-innovation-purple/30',
    neutral: 'border-slate-400 dark:border-border-technical'
  };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className)}>
      
      {/* 1. ANILLO EXTERIOR (Dashed + Rotación) */}
      {/* Aumentamos grosor a border-2 y velocidad a 10s para que el movimiento sea obvio */}
      <div className={cn(
        "absolute inset-0 rounded-full border-dashed border-2 animate-[spin_10s_linear_infinite]",
        toneClasses[tone]
      )} />
      
      {/* 2. ANILLO INTERIOR (Guía fija de contraste) */}
      <div className="absolute inset-[4px] rounded-full border border-border-technical opacity-30 dark:opacity-20" />

      {/* 3. ICONO CENTRAL */}
      <div className="relative z-10 flex items-center justify-center">
        <Icon 
          name={icon} 
          size={size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'md'} 
          className={cn(
            "block",
            tone === 'primary' ? 'text-primary' : 
            tone === 'energy' ? 'text-energy-yellow' : 
            tone === 'innovation' ? 'text-innovation-purple' : 'text-text-muted'
          )}
        />
      </div>
    </div>
  );
};