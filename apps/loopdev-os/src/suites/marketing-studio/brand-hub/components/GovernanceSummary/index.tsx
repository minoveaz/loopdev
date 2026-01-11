'use client';

import React from 'react';
import { LpdText, Skeleton, TechnicalStatusBadge } from '@loopdev/ui';
import { GovernanceSummaryProps } from './types';

/**
 * @component GovernanceSummary
 * @description Summary of domain-specific governance policies.
 */
export const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  domains,
  isLoading,
  onDomainClick
}) => {
  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  const accessMapping = {
    'allowed': { label: 'ALLOWED', severity: 'success' },
    'approval-required': { label: 'APPROVAL REQ', severity: 'warning' },
    'restricted': { label: 'RESTRICTED', severity: 'critical' },
  } as const;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border-technical bg-background-surface/50">
      <div className="flex flex-col gap-1">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
          Governance Profile
        </LpdText>
        <LpdText size="sm" weight="bold" className="text-text-main">
          Enterprise · Strict
        </LpdText>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => onDomainClick?.(domain.id)}
            className="flex items-center justify-between py-2 border-b border-border-technical/30 last:border-0 hover:bg-background-subtle rounded px-2 -mx-2 transition-colors"
          >
            <LpdText size="xs" className="text-text-muted capitalize">
              {domain.label}
            </LpdText>
            <TechnicalStatusBadge 
              label={accessMapping[domain.access].label}
              severity={accessMapping[domain.access].severity}
              variant="ghost"
              className="scale-90 origin-right"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
