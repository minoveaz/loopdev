'use client';

import React from 'react';
import { Heading, LpdText } from '@loopdev/ui';

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Heading as="h2" size="2xl" weight="bold" className="text-text-main uppercase tracking-tight">
          dependencies
        </Heading>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          This is the dependencies view for the active brand.
        </LpdText>
      </header>
      <div className="h-64 border border-dashed border-border-technical rounded-2xl flex items-center justify-center opacity-20 font-mono text-micro uppercase tracking-widest">
        {'// dependencies_pending'}
      </div>
    </div>
  );
}
