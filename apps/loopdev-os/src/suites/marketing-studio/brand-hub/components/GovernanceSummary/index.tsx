'use client';

import React from 'react';
import { LpdText, Button, Skeleton, TechnicalStatusBadge } from '@loopdev/ui';
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
    'restricted': { label: 'RESTRICTED', severity: 'danger' },
  } as const;

  return (
    <div className="border-border-technical bg-background-surface/50 flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-1">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
          Governance Profile
        </LpdText>
        <LpdText size="sm" weight="bold" className="text-text-main">
          Enterprise · Strict
        </LpdText>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {domains.map((domain) => (
          <Button
            key={domain.id}
            variant="ghost"
            onClick={() => onDomainClick?.(domain.id)}
            className="border-border-technical/30 hover:bg-background-subtle -mx-2 flex items-center justify-between rounded border-b px-2 py-2 transition-colors last:border-0"
          >
            <LpdText size="xs" className="text-text-muted capitalize">
              {domain.label}
            </LpdText>
            <TechnicalStatusBadge 
              label={accessMapping[domain.access].label}
              severity={accessMapping[domain.access].severity}
              variant="ghost"
              className="origin-right scale-90"
            />
          </Button>
        ))}
      </div>
    </div>
  );
};
