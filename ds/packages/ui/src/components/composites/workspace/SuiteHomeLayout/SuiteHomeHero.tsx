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
    <div className="relative w-full h-[120px] flex flex-col justify-center px-10 overflow-hidden border-b border-primary/15 bg-shell-surface shadow-[0_10px_30px_-24px_rgba(19,91,236,0.65)]">

      {/* Base opaca: evita que la grilla global atraviese el hero. */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.12] via-blue-500/[0.08] to-indigo-500/[0.12] dark:from-primary/[0.18] dark:via-blue-500/[0.12] dark:to-indigo-500/[0.18] pointer-events-none" />
      
      {/* 1. ATMÓSFERA (Azul -> índigo + spotlights suaves) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_50%,_rgba(19,91,236,0.18)_0%,_transparent_52%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,_rgba(99,102,241,0.12)_0%,_transparent_42%)] pointer-events-none" />

      {/* 2. PATRÓN TÉCNICO (deliberadamente secundario al contenido) */}
      <div
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(19,91,236,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(19,91,236,0.28) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      />

      {/* 3. MÁSCARA VERTICAL (separa el hero del contenido) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-shell-canvas/35 pointer-events-none" />

      {/* 4. MICRO-TELEMETRÍA (Línea de Ticks Inferior) */}
      <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-primary/25 opacity-60 flex justify-between items-end">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-[1px] h-[3px] bg-primary/50" />
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
