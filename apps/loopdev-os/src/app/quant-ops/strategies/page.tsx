'use client';

import React from 'react';
import { LpdText, Heading, TechnicalSurface } from '@loopdev/ui';

export default function StrategyLabPage() {
  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      <header className="flex flex-col gap-2">
        <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic">
          Strategy_Lab
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          Define algorithmic logic, test against historical data, and optimize performance parameters.
        </LpdText>
      </header>

      <section className="flex flex-col items-center justify-center p-24 border border-dashed border-border-technical/50 rounded-[2.5rem] bg-background-surface shadow-sm">
        <LpdText size="sm" className="font-mono uppercase tracking-widest opacity-40">
          // lab_environment_under_construction
        </LpdText>
      </section>
    </main>
  );
}
