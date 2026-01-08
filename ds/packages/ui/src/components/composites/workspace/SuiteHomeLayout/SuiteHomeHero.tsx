'use client';

import React from 'react';
import { LpdText, Badge } from '../../../atoms';

export interface SuiteHomeHeroProps {
  title: string;
  subtitle: string;
  contextLine?: string;
}

export const SuiteHomeHero: React.FC<SuiteHomeHeroProps> = ({ title, subtitle, contextLine }) => {
  return (
    <div className="relative w-full h-[120px] flex flex-col justify-center px-8 overflow-hidden bg-transparent border-b border-white/5">
      {/* 1. Efecto Spotlight Local (Mejora contraste sobre la grilla global) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Badge variant="glass" className="bg-white/5 border-white/10 text-[10px] font-bold tracking-tighter text-white/80">
            {`{ SUITE_ACTIVE }`}
          </Badge>
          <LpdText size="xl" weight="bold" className="text-white tracking-tight uppercase">
            {title}
          </LpdText>
        </div>
        
        <LpdText size="sm" className="text-slate-400 max-w-2xl">
          {subtitle}
        </LpdText>
        
        {contextLine && (
          <LpdText size="nano" className="text-primary font-mono mt-1 italic">
            {`// ${contextLine}`}
          </LpdText>
        )}
      </div>
    </div>
  );
};
