'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText, Icon, TechnicalCard } from '../../../atoms';
import { SuiteHomeAction } from './types';

interface QuickActionCardProps extends SuiteHomeAction {
  className?: string;
}

/**
 * @component QuickActionCard
 * @description Disparador de flujo de alta densidad.
 * Icono protagonista, layout vertical compacto.
 */
export const QuickActionCard: React.FC<QuickActionCardProps> = (props) => {
  const { label, description, icon, onClick, className } = props;

  return (
    <TechnicalCard
      variant="interactive"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-5 gap-3 h-full aspect-[4/3] text-center group",
        className
      )}
    >
      {/* 1. Icono Protagonista (Anclaje visual) */}
      <div className="p-3 rounded-xl bg-background-subtle border border-border-technical group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
        <Icon 
          name={icon} 
          size="lg" // 24px-28px aprox
          className="text-text-muted group-hover:text-primary transition-colors" 
        />
      </div>

      {/* 2. Label Corto */}
      <div className="flex flex-col gap-1">
        <LpdText 
          size="sm" 
          weight="bold" 
          className="text-text-main group-hover:text-primary transition-colors leading-tight"
        >
          {label}
        </LpdText>
        
        {/* 3. Subtexto Opcional (Micro) */}
        {description && (
          <LpdText size="nano" className="text-text-muted opacity-60 font-medium leading-tight">
            {description}
          </LpdText>
        )}
      </div>
    </TechnicalCard>
  );
};
