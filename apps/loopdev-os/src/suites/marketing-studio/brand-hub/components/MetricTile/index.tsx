'use client';

import React from 'react';
import { LpdText, Button, Skeleton, cn } from '@loopdev/ui';
import { MetricTileProps } from './types';

/**
 * @component MetricTile
 * @description Standard card for operational metrics with health status.
 */
export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  status,
  meta,
  onClick,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  const statusStyles = {
    ok: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-500',
    warn: 'border-yellow-500/20 hover:border-yellow-500/40 text-yellow-500',
    block: 'border-red-500/20 hover:border-red-500/40 text-red-500',
  };

  const statusIcon = {
    ok: 'check_circle',
    warn: 'warning',
    block: 'error',
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 p-5 rounded-xl border bg-background-surface transition-all text-left group",
        statusStyles[status]
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
            {label}
          </LpdText>
          <div className="bg-current/10 border-current/20 rounded-sm border px-1.5 py-0.5">
            <LpdText size="nano" weight="bold" className="inherit-color text-[8px] uppercase tracking-[0.2em]">
              {`STATUS: ${status}`}
            </LpdText>
          </div>
        </div>
        <span className="material-symbols-outlined text-[16px] opacity-40 transition-opacity group-hover:opacity-100">
          {statusIcon[status]}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <LpdText size="lg" weight="bold" className="text-text-main leading-none">
          {value}
        </LpdText>
        {meta && (
          <LpdText size="xs" className="text-text-muted opacity-60">
            {meta}
          </LpdText>
        )}
      </div>
    </Button>
  );
};
