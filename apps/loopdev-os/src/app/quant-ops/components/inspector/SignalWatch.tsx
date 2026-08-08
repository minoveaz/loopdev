'use client';

import React, { useState, useEffect } from 'react';
import { LpdText, TechnicalSurface, cn } from '@loopdev/ui';

interface SignalWatchProps {
  bot: { macroSentiment?: string };
  confluence: number;
}

export const SignalWatch: React.FC<SignalWatchProps> = ({ bot, confluence }) => {
  const [secondsLeft, setSecondsLeft] = useState(512);
  const isBullish = bot.macroSentiment === 'bullish';

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft(prev => (prev > 0 ? prev - 1 : 600)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-end px-1">
        <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40">Entry_Watch_Protocol</LpdText>
        <div className="flex flex-col items-end gap-1.5">
          <LpdText size="nano" className="text-primary opacity-60 uppercase font-mono text-[8px]">Next_Evaluation</LpdText>
          <div className="flex items-center gap-3">
            <LpdText size="sm" weight="black" className="text-primary font-mono tabular-nums leading-none">{formatTime(secondsLeft)}</LpdText>
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${(secondsLeft/600)*100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <TechnicalSurface variant="surface" className="p-6 border border-border-technical/40 rounded-3xl space-y-6 bg-slate-950/60 shadow-2xl">
        <div className="flex justify-between items-center">
          <LpdText size="xs" weight="black" className="text-text-main uppercase tracking-tighter opacity-60">Confluence_Index</LpdText>
          <LpdText size="2xl" weight="black" className={cn("font-mono", confluence === 0 ? "text-rose-500" : "text-emerald-500")}>
            {confluence}%
          </LpdText>
        </div>

        <div className="w-full h-3 flex gap-1.5">
          {[1,2,3].map(i => (
            <div key={i} className={cn("flex-1 h-full rounded-md transition-all duration-700", confluence >= i*33 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white/5")} />
          ))}
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn("w-2.5 h-2.5 rounded-full shadow-lg", isBullish ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
              <LpdText size="xs" weight="bold" className="text-text-main">Regime: <span className="uppercase text-primary">{bot.macroSentiment}</span></LpdText>
            </div>
            {!isBullish && <LpdText size="nano" className="text-rose-500 font-black uppercase italic tracking-widest">[ABORT_LONG]</LpdText>}
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success shadow-md" />
            <LpdText size="xs" weight="bold" className="text-text-main">Spread_Health: <span className="uppercase text-emerald-500">0.02%_LOW</span></LpdText>
          </div>
        </div>
      </TechnicalSurface>
    </section>
  );
};
