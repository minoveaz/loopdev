'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';

/**
 * @page BrandHubOverview
 * @description Tablero operativo global del módulo Brand Hub.
 */
export default function BrandHubOverview() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">
          Module_Overview
        </h2>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          Welcome to the Brand Oracle. Here you can monitor the health of your brand identities, 
          manage global settings, and audit consistency across all operational channels.
        </LpdText>
      </header>

      {/* Grid de placeholders para métricas de módulo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 border border-dashed border-border-technical rounded-2xl flex items-center justify-center opacity-20 font-mono text-micro uppercase tracking-widest">
            // telemetry_block_0{i}
          </div>
        ))}
      </div>
    </div>
  );
}
