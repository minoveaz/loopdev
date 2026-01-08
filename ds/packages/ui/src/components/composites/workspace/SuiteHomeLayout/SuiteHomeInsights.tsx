'use client';

import React from 'react';
import { LpdText, StatusPulse, TechnicalCard } from '../../../atoms';
import { SuiteHomeMetric } from './types';

interface SuiteHomeInsightsProps {
  metrics: SuiteHomeMetric[];
}

/**
 * @component SuiteHomeInsights
 * @description Panel de telemetría ejecutiva. El título lo gestiona el layout padre.
 */
export const SuiteHomeInsights: React.FC<SuiteHomeInsightsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <TechnicalCard 
          key={metric.id}
          variant="interactive"
          className="flex flex-col gap-2 p-4"
        >
          <div className="flex items-center gap-2">
            <StatusPulse status={metric.tone || 'neutral'} size="sm" />
            <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-tighter">
              {metric.label}
            </LpdText>
          </div>
          
          <div className="flex items-baseline gap-2 mt-1">
            <LpdText size="2xl" weight="bold" className="text-text-main font-mono leading-none">
              {metric.value}
            </LpdText>
            {metric.trend && (
              <LpdText size="nano" className={metric.trend === 'up' ? 'text-emerald-500' : 'text-danger'}>
                {metric.trend === 'up' ? '↑' : '↓'}
              </LpdText>
            )}
          </div>
        </TechnicalCard>
      ))}
    </div>
  );
};
