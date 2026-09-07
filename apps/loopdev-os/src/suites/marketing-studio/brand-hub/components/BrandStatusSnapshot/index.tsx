'use client';

import React from 'react';
import { Heading, LpdText, Skeleton, TechnicalStatusBadge, cn } from '@loopdev/ui';
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
      <div className="border-border-technical flex flex-col gap-4 border-b py-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-border-technical flex flex-col gap-4 border-b py-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <Heading as="h1" size="2xl" weight="bold" className="text-text-main leading-none tracking-tight">
            {brand.name}
          </Heading>
          
          {/* BRAND STATUS CLUSTER */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-background-subtle border-border-technical divide-border-technical flex items-center divide-x rounded-md border px-2 py-0.5">
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

        <div className="border-border-technical flex flex-col gap-1 border-l pl-4 md:items-end md:border-l-0 md:pl-0">
          <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-40">
            Last change
          </LpdText>
          <div className="flex items-center gap-2">
            <LpdText size="xs" weight="bold" className="text-text-main">
              {brand.lastActor}
            </LpdText>
            <div className="bg-border-technical h-1 w-1 rounded-full opacity-20" />
            <LpdText size="xs" className="text-text-muted opacity-60">
              {brand.lastUpdated}
            </LpdText>
          </div>
        </div>
      </div>
    </div>
  );
};
