'use client';

import React from 'react';
import { LpdText, Heading, TechnicalSurface } from '@loopdev/ui';

export default function RiskControlPage() {
  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      <header className="flex flex-col gap-2">
        <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic">
          Risk_Control_Center
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          Global safety parameters, exposure limits, and emergency kill-switch protocols.
        </LpdText>
      </header>

      <section className="flex flex-col items-center justify-center p-24 border border-dashed border-border-technical/50 rounded-[2.5rem] bg-background-surface shadow-sm">
        <LpdText size="sm" className="font-mono uppercase tracking-widest opacity-40 text-amber-500">
          // risk_guard_operational_active
        </LpdText>
      </section>
    </main>
  );
}
