'use client';

import React from 'react';
import { LpdText, Skeleton, cn } from '@loopdev/ui';
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
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 p-5 rounded-xl border bg-background-surface transition-all text-left group",
        statusStyles[status]
      )}
    >
      <div className="flex items-center justify-between w-full">
        <LpdText size="nano" weight="bold" className="uppercase tracking-widest opacity-60 text-text-muted">
          {label}
        </LpdText>
        <span className="material-symbols-outlined text-[16px] opacity-40 group-hover:opacity-100 transition-opacity">
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
    </button>
  );
};
