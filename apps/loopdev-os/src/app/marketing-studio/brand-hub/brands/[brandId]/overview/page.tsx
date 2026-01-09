'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LpdText } from '@loopdev/ui';

/**
 * @page BrandOverview
 * @description Vista principal de una marca específica.
 */
export default function BrandOverviewPage() {
  const params = useParams();
  const brandId = params.brandId as string;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter">
            Brand Overview
          </h2>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold border border-primary/20">
            {`ID: ${brandId}`}
          </span>
        </div>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          View the health status, active rules, and recent governance activity for this brand identity.
        </LpdText>
      </header>

      {/* Placeholder de contenido */}
      <div className="h-64 border border-dashed border-border-technical rounded-2xl flex items-center justify-center opacity-20 font-mono text-micro uppercase tracking-widest">
        // brand_dashboard_pending
      </div>
    </div>
  );
}
