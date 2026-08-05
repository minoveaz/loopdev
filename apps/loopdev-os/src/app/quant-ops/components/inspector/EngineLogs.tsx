'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';

interface EngineLogsProps {
  bot: any;
}

export const EngineLogs: React.FC<EngineLogsProps> = ({ bot }) => {
  const isBullish = bot.macroSentiment === 'bullish';
  const formatPrice = (val: number) => 
    val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="flex flex-col gap-4">
      <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40 px-1">Logic_Decision_Logs</LpdText>
      <div className="bg-slate-950 rounded-2xl p-6 font-mono text-[11px] border border-border-technical/30 shadow-inner">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <span className="text-blue-500 font-black opacity-60">[INFO]</span>
            <p className="text-text-main leading-relaxed">
              {isBullish 
                ? "Macro trend alignment verified. Scanning liquidity clusters." 
                : "Macro regime transition detected. All signal generators restricted."}
            </p>
          </div>
          <div className="flex gap-3 border-t border-white/5 pt-4 items-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-500 font-black opacity-60">[LIVE]</span>
            <p className="text-white font-bold">$ {formatPrice(bot.currentPrice)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
