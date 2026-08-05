'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { Icon } from '../../surfaces/Icon';
import { TechnicalTooltip } from '../../surfaces/TechnicalTooltip';
import { TechnicalIndicatorProps, IndicatorVariant } from './types';

/**
 * @component TechnicalIndicator
 * @description Indicador atómico estandarizado para estados de actividad y metadatos técnicos.
 * Parte del lenguaje industrial de LoopDev OS.
 */
export const TechnicalIndicator: React.FC<TechnicalIndicatorProps> = ({
  variant,
  brandMode = 'neutral',
  tooltip,
  value,
  className,
  onClick
}) => {
  const isSanitas = brandMode === 'sanitas';
  
  // Mapeo de configuraciones por variante
  const config: Record<IndicatorVariant, { icon: string; classes: string; tooltipDefault: string }> = {
    ai: {
      icon: 'auto_awesome',
      classes: isSanitas ? "bg-yellow-400/15 text-yellow-300" : "bg-yellow-400/10 text-yellow-600",
      tooltipDefault: 'Asistido por IA'
    },
    pdf: {
      icon: 'picture_as_pdf',
      classes: isSanitas ? "bg-white/15 text-white" : "bg-red-500/10 text-red-500",
      tooltipDefault: 'Documento PDF Generado'
    },
    stale: {
      icon: 'error',
      classes: isSanitas ? "bg-red-500/20 text-red-100" : "bg-red-500/10 text-red-500",
      tooltipDefault: 'Lead Estancado'
    },
    info: {
      icon: 'info',
      classes: isSanitas ? "bg-primary-light/20 text-white" : "bg-primary/10 text-primary",
      tooltipDefault: 'Información Adicional'
    },
    success: {
      icon: 'check_circle',
      classes: isSanitas ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-500/10 text-emerald-600",
      tooltipDefault: 'Completado'
    },
    counter: {
      icon: '', // No usa icono estándar
      classes: "bg-blue-600 text-white border border-white/30 shadow-lg",
      tooltipDefault: `${value} elementos`
    }
  };

  const current = config[variant];
  
  const content = (
    <div 
      onClick={onClick}
      title={tooltip || current.tooltipDefault} // Fallback title
      className={cn(
        "w-[18px] h-[18px] flex items-center justify-center rounded-full transition-all duration-300",
        onClick && "cursor-pointer active:scale-90",
        !onClick && "cursor-help",
        current.classes,
        className
      )}
    >
      {variant === 'counter' ? (
        <span className="text-[9px] font-black leading-none">{value}</span>
      ) : (
        <Icon name={current.icon as any} size="sm" className={cn("scale-75", variant === 'ai' && "fill-current")} />
      )}
    </div>
  );

  if (tooltip || current.tooltipDefault) {
    return (
      <TechnicalTooltip content={tooltip || current.tooltipDefault} side="top">
        {content}
      </TechnicalTooltip>
    );
  }

  return content;
};
