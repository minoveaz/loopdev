'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';

interface EngineLogsProps {
  bot: { macroSentiment?: string; currentPrice: number };
}

export const EngineLogs: React.FC<EngineLogsProps> = ({ bot }) => {
  const isBullish = bot.macroSentiment === 'bullish';
  const formatPrice = (val: number) =>
    val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="flex flex-col gap-4">
      <LpdText
        size="nano"
        weight="black"
        className="text-text-muted px-1 uppercase tracking-[0.2em] opacity-40"
      >
        Logic_Decision_Logs
      </LpdText>
      <div className="border-border-technical/30 rounded-2xl border bg-slate-950 p-6 font-mono text-[11px] shadow-inner">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <span className="font-black text-status-info opacity-60">[INFO]</span>
            <p className="text-text-main leading-relaxed">
              {isBullish
                ? 'Macro trend alignment verified. Scanning liquidity clusters.'
                : 'Macro regime transition detected. All signal generators restricted.'}
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-white/5 pt-4">
            <span className="relative flex h-2 w-2">
              <span className="bg-status-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-black text-status-success opacity-60">[LIVE]</span>
            <p className="font-bold text-white">$ {formatPrice(bot.currentPrice)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
