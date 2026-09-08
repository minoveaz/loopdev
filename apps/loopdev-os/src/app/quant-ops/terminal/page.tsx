'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';

export default function LiveTerminalPage() {
  return (
    <main className="animate-in fade-in custom-scrollbar mx-auto flex h-full max-w-[1600px] flex-col gap-8 overflow-y-auto p-8 pb-32 font-mono duration-700">
      <header className="flex flex-col gap-2">
        <LpdText
          size="2xl"
          weight="bold"
          className="text-text-main font-sans uppercase italic tracking-tight"
        >
          Live_Execution_Terminal
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl font-sans leading-relaxed">
          Real-time stream of engine events, order fills, and risk engine decisions.
        </LpdText>
      </header>

      <section className="min-h-[500px] flex-1 rounded-2xl border border-white/10 bg-slate-950 p-6 text-emerald-500 shadow-2xl">
        <div className="flex flex-col gap-1 text-[10px]">
          <p className="opacity-40">Quant_Core_Terminal v0.0.1</p>
          <p className="opacity-40">Connection: websocket_established</p>
          <p className="mt-4 font-bold tracking-widest text-white">
            [SYSTEM] Awaiting live stream data...
          </p>
        </div>
      </section>
    </main>
  );
}
