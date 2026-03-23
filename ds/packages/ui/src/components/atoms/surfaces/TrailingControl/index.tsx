'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { LpdText } from '../../foundations/Typography';
import { Icon } from '../Icon';
import { cn } from '../../../../helpers/cn';

interface TrailingControlProps {
  currentDistance: number;
  onUpdateDistance: (distance: number) => Promise<void>;
  disabled?: boolean;
}

/**
 * @component TrailingControl
 * @description Tactical popover to adjust Trailing Stop aggressiveness in real-time.
 */
export const TrailingControl: React.FC<TrailingControlProps> = ({ 
  currentDistance, 
  onUpdateDistance,
  disabled 
}) => {
  const presets = [
    { label: 'NORMAL', value: 1.0, icon: 'shield', color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'TIGHT', value: 0.5, icon: 'target', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'SNIPER', value: 0.2, icon: 'bolt', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          disabled={disabled}
          className={cn(
            "flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all active:scale-95 disabled:opacity-20",
            currentDistance > 0 
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
              : "bg-white/5 border-white/10 text-text-muted opacity-60 hover:bg-white/10"
          )}
        >
          <Icon name="track_changes" size="xs" className={cn(currentDistance > 0 && "animate-pulse")} />
          <LpdText size="nano" weight="black" className="uppercase tracking-widest text-[7px]">
            {currentDistance > 0 ? `Trail: ${currentDistance}%` : 'Activate Trail'}
          </LpdText>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          side="top" 
          align="center" 
          sideOffset={12}
          className="z-[100] w-48 p-3 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <LpdText size="nano" weight="black" className="text-text-muted opacity-40 uppercase tracking-widest">Select_Aggressiveness</LpdText>
              <LpdText size="nano" className="font-mono text-cyan-500">{currentDistance}%</LpdText>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onUpdateDistance(p.value)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-all hover:scale-[1.02] active:scale-95",
                    currentDistance === p.value 
                      ? `bg-white/10 border-white/20 shadow-lg` 
                      : "bg-white/5 border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center", p.bg, p.color)}>
                      <Icon name={p.icon} size="nano" />
                    </div>
                    <LpdText size="nano" weight="bold" className="text-text-main">{p.label}</LpdText>
                  </div>
                  <LpdText size="nano" className="font-mono opacity-60">{p.value}%</LpdText>
                </button>
              ))}
            </div>
          </div>
          <Popover.Arrow className="fill-slate-900 stroke-white/10" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
