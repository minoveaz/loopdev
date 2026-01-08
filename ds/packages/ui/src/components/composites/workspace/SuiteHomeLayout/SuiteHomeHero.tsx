'use client';

import React from 'react';
import { LpdText, Badge, TechnicalIsotype } from '../../../atoms';

export interface SuiteHomeHeroProps {
  title: string;
  subtitle: string;
  contextLine?: string;
  icon?: string;
  tone?: 'primary' | 'energy' | 'innovation' | 'neutral';
}

/**
 * @component SuiteHomeHero
 * @description Cabecera de identidad de alta fidelidad para Suites.
 * Implementa el "Command Lockup" con Isotipo Técnico y tipografía industrial.
 */
export const SuiteHomeHero: React.FC<SuiteHomeHeroProps> = ({ 
  title, 
  subtitle, 
  contextLine, 
  icon = 'hub',
  tone = 'primary'
}) => {
  return (
    <div className="relative w-full h-[140px] flex flex-col justify-center px-8 overflow-hidden bg-transparent border-b border-border-technical">
      {/* 1. Efecto Spotlight Local (Fuerza visual sobre la grilla global) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none opacity-50 dark:opacity-100" />

      <div className="relative z-10 flex items-center gap-6">
        
        {/* A. ANCLA DE IDENTIDAD (Technical Isotype) */}
        <TechnicalIsotype icon={icon} tone={tone} size="md" />

        {/* B. BLOQUE DE TEXTO (Identidad Industrial) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <LpdText size="xl" weight="semibold" className="text-text-main tracking-tight uppercase">
              {title}
            </LpdText>
            <Badge variant="glass" className="bg-background-subtle border-border-technical text-[10px] font-bold tracking-widest text-text-muted uppercase">
              {`{ SUITE_ACTIVE }`}
            </Badge>
          </div>
          
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-snug">
            {subtitle}
          </LpdText>
          
          {contextLine && (
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <LpdText size="nano" className="text-primary font-mono opacity-80 dark:opacity-100">
                {`// ${contextLine}`}
              </LpdText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
