'use client';

import React from 'react';
import { LpdText, TechnicalStatusBadge, TechnicalIsotype } from '../../../atoms';

export interface SuiteHomeHeroProps {
  title: string;
  subtitle: string;
  contextLine?: string;
  icon?: string;
  tone?: 'primary' | 'energy' | 'innovation' | 'neutral';
  status?: string;
}

/**
 * @component SuiteHomeHero
 * @description Cabecera de identidad v3.9 (Master Standard).
 * Implementa el flujo: Orientación -> Estabilidad -> Latent Life.
 */
export const SuiteHomeHero: React.FC<SuiteHomeHeroProps> = ({ 
  title, 
  subtitle, 
  contextLine, 
  icon = 'hub',
  tone = 'primary',
  status = 'SUITE_ACTIVE'
}) => {
  return (
    <div className="relative w-full h-[120px] flex flex-col justify-center px-10 overflow-hidden bg-transparent">
      
      {/* 1. ATMÓSFERA (Doble Spotlight sutil) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,_rgba(19,91,236,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,_rgba(19,91,236,0.03)_0%,_transparent_30%)] pointer-events-none blur-2xl" />
      
      {/* 2. MÁSCARA VERTICAL (Disuelve el Hero hacia el contenido) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-shell-canvas/20 pointer-events-none" />

      {/* 3. MICRO-TELEMETRÍA (Línea de Ticks Inferior) */}
      <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-border-technical opacity-20 flex justify-between items-end">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-[1px] h-[3px] bg-border-technical" />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-8">
        
        {/* A. IDENTIDAD (Isotype Baseline Aligned) */}
        <TechnicalIsotype icon={icon} tone={tone} size="md" className="translate-y-1" />

        {/* B. COMMAND CONTENT */}
        <div className="flex flex-col gap-0.5">
          {/* Status Badge (Sensitivo) */}
          <div className="mb-1">
            <TechnicalStatusBadge 
              label={status} 
              severity={tone === 'primary' ? 'info' : tone as any} 
              variant="ghost"
              className="p-0 border-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-medium text-text-main tracking-[-0.015em] leading-none">
              {title}
            </h1>
          </div>
          
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-[1.5] mt-1 opacity-80">
            {subtitle}
          </LpdText>
          
          {contextLine && (
            <div className="flex items-center gap-2 mt-2">
              <LpdText size="nano" className="text-primary font-mono font-bold opacity-90 dark:opacity-100">
                {`// ${contextLine.toLowerCase()}`}
              </LpdText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
