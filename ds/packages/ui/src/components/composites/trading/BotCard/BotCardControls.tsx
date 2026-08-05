'use client';

import React from 'react';
import { Icon } from '../../../atoms/surfaces/Icon';
import { cn } from '../../../../helpers/cn';

interface BotCardControlsProps {
  status: string;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

/**
 * @component BotCardControls
 * @description Simplified technical activator with human-centric labeling.
 */
export const BotCardControls: React.FC<BotCardControlsProps> = ({
  status,
  onToggle,
  className
}) => {
  const isActive = status === 'active' || status === 'paper_trading';

  return (
    <div className={cn("w-full", className)}>
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(e); }}
        className={cn(
          "w-full h-14 rounded-2xl flex items-center justify-center gap-3 border transition-all active:scale-[0.98] group",
          isActive 
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5" 
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5"
        )}
      >
        <Icon name={isActive ? "pause" : "play_arrow"} size="sm" className="group-hover:scale-110 transition-transform" />
        <span className="uppercase tracking-[0.2em] font-black text-[11px]">
          {isActive ? "Pause Bot" : "Start Bot"}
        </span>
      </button>
    </div>
  );
};
