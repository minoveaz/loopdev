'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText, Icon, Badge, TechnicalCard } from '../../../atoms';
import { ModuleCardProps } from './types';

/**
 * @component ModuleCard
 * @description Tarjeta con título inteligente: Primera palabra normal, el resto con degradado.
 */
export const ModuleCard: React.FC<ModuleCardProps> = (props) => {
  const {
    statusBadge,
    statusTone = 'energy',
    title,
    footerContent,
    onClick,
    className
  } = props;

  // Lógica para dividir el título (Ej: "Brand Hub" -> "Brand" y "Hub")
  const titleString = typeof title === 'string' ? title : '';
  const words = titleString.split(' ');
  const firstPart = words[0];
  const secondPart = words.slice(1).join(' ');

  return (
    <TechnicalCard
      variant="interactive"
      onClick={onClick}
      className={cn("relative overflow-hidden group", className)}
    >
      <div className="absolute inset-0 bg-grid-20 opacity-[0.08] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(19,91,236,0.08)_0%,_transparent_60%)] group-hover:bg-[radial-gradient(circle_at_100%_0%,_rgba(19,91,236,0.15)_0%,_transparent_60%)] transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between p-6 aspect-square h-full">
        <div className="flex flex-col items-start">
          <Badge 
            variant="glass" 
            status={statusTone} 
            className="bg-white/5 backdrop-blur-md border-white/10 mb-4 px-2 py-0.5 text-[10px]"
          >
            {statusBadge}
          </Badge>

          {/* Título dinámico con degradado en la segunda parte */}
          <h3 className="text-2xl font-semibold leading-tight tracking-tight">
            <span className="text-text-main dark:text-white block">
              {firstPart}
            </span>
            {secondPart && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                {secondPart}
              </span>
            )}
          </h3>
        </div>

        <div className="relative z-10 flex justify-between items-end pt-4 border-t border-border-technical">
          <div className="flex flex-col min-w-0 pr-4">
            {footerContent}
          </div>
          
          <div className="w-9 h-9 shrink-0 rounded-full bg-white text-[#0f1115] flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md border border-white/10">
            <span 
              className="material-symbols-outlined text-[20px]" 
              style={{ fontVariationSettings: "'wght' 300, 'opsz' 24" }}
            >
              arrow_right_alt
            </span>
          </div>
        </div>
      </div>
    </TechnicalCard>
  );
};
