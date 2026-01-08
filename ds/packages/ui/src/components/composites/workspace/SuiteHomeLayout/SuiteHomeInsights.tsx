'use client';

import React from 'react';
import { LpdText, StatusPulse, TechnicalSurface } from '../../../atoms';
import { SuiteHomeMetric } from './types';

interface SuiteHomeInsightsProps {
  metrics: SuiteHomeMetric[];
}

export const SuiteHomeInsights: React.FC<SuiteHomeInsightsProps> = ({ metrics }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LpdText size="sm" weight="bold" className="text-text-muted uppercase tracking-widest">
          {`// Executive Glance`}
        </LpdText>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className="flex flex-col gap-2 p-4 bg-surface-elevated border border-border-technical rounded-xl"
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
                <LpdText size="nano" className={metric.trend === 'up' ? 'text-success' : 'text-danger'}>
                  {metric.trend === 'up' ? '↑' : '↓'}
                </LpdText>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
