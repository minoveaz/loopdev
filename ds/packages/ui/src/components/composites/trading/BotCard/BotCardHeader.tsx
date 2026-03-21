'use client';

import React from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { TechnicalStatusBadge } from '../../../atoms/indicators/TechnicalStatusBadge';
import { Icon } from '../../../atoms/surfaces/Icon';
import { cn } from '../../../../helpers/cn';

interface BotCardHeaderProps {
  name: string;
  pair: string;
  sentiment: string;
  onInspect?: () => void;
  onDelete?: () => void;
}

/**
 * @component BotCardHeader
 * @description Identity header with high-priority tactical triggers.
 */
export const BotCardHeader = ({ name, pair, sentiment, onInspect, onDelete }: BotCardHeaderProps) => {
  const isBullish = sentiment === 'bullish';
  const isBearish = sentiment === 'bearish';

  // Manejador de alta prioridad para asegurar apertura inmediata
  const handleInspect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInspect?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <LpdText size="md" weight="black" className="text-text-main font-mono tracking-tighter leading-none">
            {pair}
          </LpdText>
          <div className={cn(
            "px-2 py-0.5 rounded border text-[9px] font-black font-mono transition-all duration-500",
            isBullish && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
            isBearish && "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
            !isBullish && !isBearish && "bg-white/5 border-white/10 text-text-muted"
          )}>
            {`{ ${sentiment.toUpperCase()} }`}
          </div>
        </div>
        <LpdText size="nano" weight="black" className="text-primary uppercase italic tracking-widest opacity-60">
          {name}
        </LpdText>
      </div>

      {/* CONTROLES COMPACTOS (Trigger Directo) */}
      <div className="flex items-center gap-1">
        <button 
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-40 hover:opacity-100 active:scale-90"
        >
          <Icon name="block" size="xs" />
        </button>
        <button 
          onClick={handleInspect}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-text-main transition-all opacity-40 hover:opacity-100 active:scale-90"
        >
          <Icon name="more_vert" size="xs" />
        </button>
      </div>
    </div>
  );
};
