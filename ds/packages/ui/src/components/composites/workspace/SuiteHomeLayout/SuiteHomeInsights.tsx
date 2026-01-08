'use client';

import React from 'react';
import { SuiteHomeMetric } from './types';
import { TelemetryCard } from './TelemetryCard';

interface SuiteHomeInsightsProps {
  metrics: SuiteHomeMetric[];
}

/**
 * @component SuiteHomeInsights
 * @description Panel de telemetría ejecutiva.
 * Renderiza una rejilla de tarjetas de métricas industriales.
 */
export const SuiteHomeInsights: React.FC<SuiteHomeInsightsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <TelemetryCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};