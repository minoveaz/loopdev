'use client';

import React from 'react';
import { LpdText, Skeleton, TechnicalStatusBadge, cn } from '@loopdev/ui';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight leading-none">
            {brand.name}
          </LpdText>
          
          {/* BRAND STATUS CLUSTER */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-background-subtle border border-border-technical rounded-md px-2 py-0.5 divide-x divide-border-technical">
              <div className="pr-2">
                <LpdText size="nano" weight="bold" className={cn(
                  "uppercase tracking-widest",
                  brand.status === 'published' ? 'text-emerald-500' : 'text-yellow-500'
                )}>
                  {brand.status}
                </LpdText>
              </div>
              <div className="px-2">
                <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
                  {brand.mode.replace('-', ' ')}
                </LpdText>
              </div>
              <div className="pl-2">
                <LpdText size="nano" weight="bold" className="text-primary font-mono tracking-widest">
                  {brand.activeVersion}
                </LpdText>
              </div>
            </div>

            {brand.draftVersion && (
              <TechnicalStatusBadge 
                label={`DRAFT: ${brand.draftVersion}`}
                severity="warning"
                variant="glass"
                className="scale-90"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 border-l md:border-l-0 md:pl-0 pl-4 border-border-technical">
          <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-40">
            Last change
          </LpdText>
          <div className="flex items-center gap-2">
            <LpdText size="xs" weight="bold" className="text-text-main">
              {brand.lastActor}
            </LpdText>
            <div className="w-1 h-1 rounded-full bg-border-technical opacity-20" />
            <LpdText size="xs" className="text-text-muted opacity-60">
              {brand.lastUpdated}
            </LpdText>
          </div>
        </div>
      </div>
    </div>
  );
};
