'use client';

import React from 'react';
import { LpdText, Skeleton } from '@loopdev/ui';
import { MetricTile } from '../MetricTile';
import { BrandHealthPanelProps } from './types';

/**
 * @component BrandHealthPanel
 * @description Orchestrator for brand health metric tiles.
 */
export const BrandHealthPanel: React.FC<BrandHealthPanelProps> = ({
  health,
  isLoading,
  onMetricClick
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  const metrics = [
    health.compliance,
    health.approvals,
    health.overrides,
    health.dependencies
  ];

  return (
    <div className="flex flex-col gap-4">
      <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
        System Health
      </LpdText>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <MetricTile
            key={metric.id}
            label={metric.label}
            value={metric.value}
            status={metric.status}
            meta={metric.meta}
            onClick={() => onMetricClick?.(metric.id)}
          />
        ))}
      </div>
    </div>
  );
};
