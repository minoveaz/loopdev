'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter">
          publish
        </h2>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          This is the publish view for the active brand.
        </LpdText>
      </header>
      <div className="h-64 border border-dashed border-border-technical rounded-2xl flex items-center justify-center opacity-20 font-mono text-micro uppercase tracking-widest">
        // publish_pending
      </div>
    </div>
  );
}
