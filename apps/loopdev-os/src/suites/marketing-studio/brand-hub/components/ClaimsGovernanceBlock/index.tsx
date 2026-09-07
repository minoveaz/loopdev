'use client';

import React from 'react';
import { LpdText, Skeleton } from '@loopdev/ui';
import { ClaimList } from '../ClaimList';
import { ClaimsGovernanceBlockProps } from './types';

/**
 * @component ClaimsGovernanceBlock
 * @description Orchestrator for forbidden language and regulated claims.
 */
export const ClaimsGovernanceBlock: React.FC<ClaimsGovernanceBlockProps> = ({
  forbidden,
  regulated,
  isLoading,
  onClaimClick,
  onForbiddenClick
}) => {
  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  return (
    <div className="border-border-technical bg-background-surface/50 flex flex-col gap-8 rounded-2xl border p-8">
      <div className="border-border-technical/30 flex items-center gap-2 border-b pb-4">
        <LpdText size="sm" weight="bold" className="text-text-main uppercase tracking-tight">
          Compliance & Regulated Claims
        </LpdText>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* FORBIDDEN SECTION */}
        <div className="flex flex-col gap-6">
          <ClaimList
            title="Forbidden Language"
            items={forbidden}
            type="forbidden"
            onItemClick={onForbiddenClick}
          />
          <LpdText size="nano" className="text-text-muted italic opacity-40">
            * Use of these terms triggers immediate BLOCK severity in campaign preflight.
          </LpdText>
        </div>

        {/* REGULATED SECTION */}
        <div className="flex flex-col gap-6">
          <ClaimList
            title="Regulated Claims"
            items={regulated}
            type="regulated"
            onItemClick={(id) => {
              const claim = regulated.find(c => c.id === id);
              if (claim) onClaimClick?.(claim);
            }}
          />
        </div>
      </div>
    </div>
  );
};
