'use client';

import React from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { Icon } from '../../../atoms/surfaces/Icon';
import { cn } from '../../../../helpers/cn';

interface BotCardHeaderProps {
  name: string;
  pair: string;
  sentiment: string;
  strategyName?: string;
  coreId?: string;
  logicSnapshot?: Record<string, any>;
  onInspect?: () => void;
  onDelete?: () => void;
}

/**
 * @component BotCardHeader
 * @description Identity header with high-priority tactical triggers.
 * Stability Update: Removed unstable transitions that caused 'vibration' and fixed click event propagation.
 */
export const BotCardHeader = ({ 
  name, 
  pair, 
  sentiment, 
  strategyName, 
  coreId, 
  logicSnapshot,
  onInspect, 
  onDelete 
}: BotCardHeaderProps) => {
  const isBullish = sentiment?.toLowerCase() === 'bullish';
  const isBearish = sentiment?.toLowerCase() === 'bearish';

  // Manejador de alta prioridad para asegurar apertura inmediata del inspector
  const handleInspect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[BotCardHeader] Inspect Triggered:', { pair, onInspect: !!onInspect });
    if (onInspect) onInspect();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[BotCardHeader] Delete Triggered:', { pair, onDelete: !!onDelete });
    if (onDelete) onDelete();
  };

  return (
    <div className="flex items-start justify-between w-full group/header relative z-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <LpdText size="xl" weight="black" className="text-text-main font-mono tracking-tighter leading-none uppercase select-none">
            {pair}
          </LpdText>
          
          {/* SENTIMENT BADGE (ROBUSTO) */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black font-mono transition-colors duration-500",
            isBullish && "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
            isBearish && "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]",
            (!isBullish && !isBearish) && "bg-white/5 border-white/10 text-text-muted opacity-60"
          )}>
            <Icon 
              name={isBullish ? "trending_up" : isBearish ? "trending_down" : "drag_handle"} 
              size="sm"
              className="scale-90"
            />
            <span className="tracking-widest uppercase">
              {isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'NEUTRAL_CORE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <LpdText size="xs" weight="black" className="text-primary uppercase italic tracking-[0.15em] opacity-80">
            {name}
          </LpdText>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </div>
            <LpdText size="nano" className="text-text-muted font-mono opacity-40 uppercase tracking-tighter">
              NODE_ACTIVE
            </LpdText>
            {logicSnapshot?.node_latency !== undefined && (
              <LpdText size="nano" className="text-emerald-500/40 font-mono text-[8px] ml-1">
                {logicSnapshot.node_latency}ms
              </LpdText>
            )}
          </div>
        </div>

        {strategyName && (
          <div className="flex items-center gap-2 mt-1 px-1.5 py-0.5 rounded-md bg-amber-500/5 border border-amber-500/10 w-fit">
            <span className="w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.15em] text-amber-500/80 italic">
              {strategyName}
            </LpdText>
            {coreId && (
              <>
                <div className="w-px h-2 bg-amber-500/20" />
                <LpdText size="nano" className="text-amber-500/40 font-mono uppercase tracking-tighter">
                  {coreId}
                </LpdText>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTROLES ESTABLES (Z-INDEX SUPERIOR) */}
      <div className="flex items-center gap-1 relative z-30">
        <button 
          onClick={handleDelete}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-rose-500/10 hover:text-rose-500 transition-colors duration-200"
          title="STOP_BOT"
        >
          <Icon name="block" size="sm" className="opacity-40 group-hover/header:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={handleInspect}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-text-main transition-colors duration-200"
          title="INSPECT_DETAILS"
        >
          <Icon name="more_vert" size="sm" className="opacity-60 group-hover/header:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};
