'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';

export default function LiveTerminalPage() {
  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar font-mono">
      <header className="flex flex-col gap-2">
        <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic font-sans">
          Live_Execution_Terminal
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed font-sans">
          Real-time stream of engine events, order fills, and risk engine decisions.
        </LpdText>
      </header>

      <section className="flex-1 bg-slate-950 text-emerald-500 p-6 rounded-2xl border border-white/10 shadow-2xl min-h-[500px]">
        <div className="flex flex-col gap-1 text-[10px]">
          <p className="opacity-40">Quant_Core_Terminal v0.0.1</p>
          <p className="opacity-40">Connection: websocket_established</p>
          <p className="mt-4 text-white font-bold tracking-widest">[SYSTEM] Awaiting live stream data...</p>
        </div>
      </section>
    </main>
  );
}
