'use client';

import React from 'react';
import { LpdText, Skeleton, TechnicalStatusBadge } from '@loopdev/ui';
import { BrandStatusSnapshotProps } from './types';

/**
 * @component BrandStatusSnapshot
 * @description Operational anchor for the brand canvas.
 */
export const BrandStatusSnapshot: React.FC<BrandStatusSnapshotProps> = ({
  brand,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-6 border-b border-border-technical">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-8 border-b border-border-technical">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight">
              {brand.name}
            </LpdText>
            <TechnicalStatusBadge 
              label={brand.status.toUpperCase()} 
              severity={brand.status === 'published' ? 'success' : 'warning'} 
              variant="glass"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <TechnicalStatusBadge 
              label={brand.mode.replace('-', ' ').toUpperCase()} 
              severity={brand.mode === 'read-only' ? 'neutral' : 'warning'} 
              variant="ghost"
            />
            <div className="w-1 h-1 rounded-full bg-border-technical opacity-20" />
            <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-60">
              Active Baseline: {brand.activeVersion}
            </LpdText>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-40">
            Last updated
          </LpdText>
          <div className="flex items-center gap-2">
            <LpdText size="xs" weight="bold" className="text-text-main">
              {brand.lastActor}
            </LpdText>
            <LpdText size="xs" className="text-text-muted opacity-60">
              {brand.lastUpdated}
            </LpdText>
          </div>
        </div>
      </div>
    </div>
  );
};
