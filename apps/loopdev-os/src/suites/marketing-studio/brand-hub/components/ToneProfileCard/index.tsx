'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { ToneProfileCardProps } from './types';

/**
 * @component ToneProfileCard
 * @description Card visualizing a tone profile with examples.
 */
export const ToneProfileCard: React.FC<ToneProfileCardProps> = ({
  profile,
  onClick,
  className
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col gap-6 p-6 rounded-2xl border border-border-technical bg-background-surface hover:border-primary/20 transition-all cursor-pointer group",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <LpdText size="sm" weight="bold" className="text-text-main group-hover:text-primary transition-colors">
          {profile.name}
        </LpdText>
        <LpdText size="xs" className="text-text-muted opacity-60 leading-relaxed">
          {profile.description}
        </LpdText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-technical/30">
        {/* DO SECTION */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
            <LpdText size="nano" weight="bold" className="text-emerald-500 uppercase tracking-widest">Do</LpdText>
          </div>
          <div className="flex flex-col gap-2">
            {profile.examples.do.map((ex, i) => (
              <LpdText key={i} size="xs" className="text-text-main font-mono p-2 bg-emerald-500/5 rounded border border-emerald-500/10">
                "{ex}"
              </LpdText>
            ))}
          </div>
        </div>

        {/* DON'T SECTION */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-red-500">cancel</span>
            <LpdText size="nano" weight="bold" className="text-red-500 uppercase tracking-widest">Don't</LpdText>
          </div>
          <div className="flex flex-col gap-2">
            {profile.examples.dont.map((ex, i) => (
              <LpdText key={i} size="xs" className="text-text-muted font-mono p-2 bg-red-500/5 rounded border border-red-500/10 opacity-60">
                "{ex}"
              </LpdText>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
