'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText, StatusPulse, TechnicalCard } from '../../../atoms';
import { SuiteHomeMetric } from './types';
import { BadgeSeverity } from '../../../atoms/indicators/TechnicalStatusBadge/types';

interface TelemetryCardProps {
  metric: SuiteHomeMetric;
}

/**
 * @component TelemetryCard
 * @description Tarjeta de métrica industrial limpia.
 * Prioriza la legibilidad del dato: Valor Monoespaciado + Unidad Sutil.
 */
export const TelemetryCard: React.FC<TelemetryCardProps> = ({ metric }) => {
  // Extraer valor y unidad
  const valueString = metric.value.toString();
  const hasUnit = valueString.includes('%') || valueString.includes('k');
  const mainValue = hasUnit ? valueString.replace(/[%k]/g, '') : valueString;
  const unit = hasUnit ? valueString.replace(/[\d\.]/g, '') : null;

  return (
    <TechnicalCard 
      variant="interactive"
      className="flex flex-col justify-between p-5 min-h-[140px] group relative overflow-hidden"
    >
      {/* Fondo de Grilla Sutil */}
      <div className="absolute inset-0 bg-grid-20 opacity-[0.05] pointer-events-none" />
      
      {/* Header: Label + Status */}
      <div className="flex items-center justify-between relative z-10">
        <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest opacity-80">
          {metric.label}
        </LpdText>
        <StatusPulse status={(metric.tone === 'neutral' ? 'neutral' : metric.tone) as any} size="sm" isAnimated />
      </div>

      {/* Body: Clean Metric */}
      <div className="flex items-baseline gap-0.5 mt-2 relative z-10">
        <span className="text-4xl font-mono font-bold text-text-main tracking-tight leading-none">
          {mainValue}
        </span>
        {unit && (
          <span className="text-xl font-sans font-medium text-text-muted opacity-60">
            {unit}
          </span>
        )}
      </div>

      {/* Footer: Trend / Context */}
      <div className="mt-auto pt-3 border-t border-border-technical/50 flex items-center gap-2 relative z-10">
        {metric.trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
            metric.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : 
            metric.trend === 'down' ? "bg-rose-500/10 text-rose-500" : "bg-slate-500/10 text-slate-500"
          )}>
            <span>{metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}</span>
            <span>{metric.trend === 'up' ? '12%' : metric.trend === 'down' ? '2.4%' : '0%'}</span>
          </div>
        )}
        <span className="text-[9px] text-text-muted opacity-50 font-mono">
          vs last week
        </span>
      </div>
    </TechnicalCard>
  );
};
