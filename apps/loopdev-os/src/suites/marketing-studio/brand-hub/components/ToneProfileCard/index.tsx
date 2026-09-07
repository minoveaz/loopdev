'use client';

import React from 'react';
import { Heading, LpdText, cn } from '@loopdev/ui';
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
        <Heading as="h3" size="sm" weight="bold" className="text-text-main group-hover:text-primary transition-colors">
          {profile.name}
        </Heading>
        <LpdText size="xs" className="text-text-muted leading-relaxed opacity-60">
          {profile.description}
        </LpdText>
      </div>

      <div className="border-border-technical/30 grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
        {/* DO SECTION */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
            <LpdText size="nano" weight="bold" className="uppercase tracking-widest text-emerald-500">Do</LpdText>
          </div>
          <div className="flex flex-col gap-2">
            {profile.examples.do.map((ex, i) => (
              <LpdText key={i} size="xs" className="text-text-main rounded border border-emerald-500/10 bg-emerald-500/5 p-2 font-mono">
                &quot;{ex}&quot;
              </LpdText>
            ))}
          </div>
        </div>

        {/* DON'T SECTION */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-red-500">cancel</span>
            <LpdText size="nano" weight="bold" className="uppercase tracking-widest text-red-500">Don&apos;t</LpdText>
          </div>
          <div className="flex flex-col gap-2">
            {profile.examples.dont.map((ex, i) => (
              <LpdText key={i} size="xs" className="text-text-muted rounded border border-red-500/10 bg-red-500/5 p-2 font-mono opacity-60">
                &quot;{ex}&quot;
              </LpdText>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
