'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText } from '../../foundations/Typography';
import { StatusPulse } from '../StatusPulse';
import { TechnicalStatusBadgeProps, BracketColor, BadgeSeverity } from './types';

/**
 * @component TechnicalStatusBadge
 * @description El guardián de la sintaxis técnica.
 * Implementa la firma oficial de estado { STATUS } con reactividad industrial.
 */
export const TechnicalStatusBadge: React.FC<TechnicalStatusBadgeProps> = ({
  label,
  severity = 'info',
  bracketColor,
  variant = 'glass',
  withPulse = false,
  className
}) => {
  
  // 1. Mapeo de colores para los Brackets { }
  // Si no se define bracketColor, se deriva de la severidad
  const activeBracketColor = bracketColor || (
    severity === 'warning' ? 'yellow' : 
    severity === 'innovation' ? 'purple' : 'blue'
  );

  const bracketColors: Record<BracketColor, string> = {
    blue: 'text-primary',
    yellow: 'text-energy-yellow',
    purple: 'text-innovation-purple',
    neutral: 'text-text-muted opacity-40'
  };

  // 2. Mapeo de severidades para el texto y aura
  const severityClasses: Record<BadgeSeverity, string> = {
    info: 'text-primary/80',
    primary: 'text-primary',
    warning: 'text-energy-yellow',
    danger: 'text-danger',
    success: 'text-emerald-500',
    innovation: 'text-innovation-purple',
    neutral: 'text-text-muted opacity-60'
  };

  const containerClasses = cn(
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-border-technical transition-all duration-500 group overflow-hidden",
    variant === 'glass' && "bg-white/5 backdrop-blur-md dark:bg-white/5",
    variant === 'outline' && "bg-transparent",
    variant === 'ghost' && "bg-transparent border-transparent",
    className
  );

  return (
    <div className={containerClasses}>
      {/* Efecto Shimmer sutil (ADN Lab) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Bracket Apertura */}
      <span className={cn("text-xs font-mono font-bold select-none", bracketColors[activeBracketColor as BracketColor])}>
        {`{`}
      </span>

      {/* Contenido Central: Pulse + Label */}
      <div className="flex items-center gap-1.5 px-0.5">
        {withPulse && (
          <StatusPulse 
            status={severity as any} 
            size="xs" 
            className="animate-pulse"
          />
        )}
        <LpdText 
          size="nano" 
          weight="bold" 
          className={cn("uppercase tracking-[0.15em] whitespace-nowrap", severityClasses[severity])}
        >
          {label}
        </LpdText>
      </div>

      {/* Bracket Cierre */}
      <span className={cn("text-xs font-mono font-bold select-none", bracketColors[activeBracketColor as BracketColor])}>
        {`}`}
      </span>
    </div>
  );
};
