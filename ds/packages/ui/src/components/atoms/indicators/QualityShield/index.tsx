'use client';

import React from 'react';
import { QualityShieldProps, QualityGateStatus } from './types';

/**
 * @component QualityShield
 * @description Matriz de calidad técnica obligatoria para Storybook.
 * Visualiza el estado de los gates de QA: Unit, A11y y Visual.
 */
export const QualityShield: React.FC<QualityShieldProps> = ({ metrics, className = '' }) => {
  const getStatusColor = (status: QualityGateStatus) => {
    switch (status) {
      case 'pass': return 'text-emerald-500';
      case 'fail': return 'text-rose-500';
      case 'warn': return 'text-amber-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusBg = (status: QualityGateStatus) => {
    switch (status) {
      case 'pass': return 'bg-emerald-500/20';
      case 'fail': return 'bg-rose-500/20';
      case 'warn': return 'bg-amber-500/20';
      default: return 'bg-slate-500/20';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] flex flex-col gap-1.5 p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl pointer-events-auto select-none min-w-[180px] ${className}`}>
      {/* Header técnico */}
      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
        <span className="text-[10px] font-black font-mono text-white/40 uppercase tracking-widest">
          QA_Matrix_v1.5
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="space-y-1.5">
        {(Object.entries(metrics) as [string, any][]).map(([key, metric]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusBg(metric.status)} flex items-center justify-center`}>
                 <div className={`w-1 h-1 rounded-full ${getStatusColor(metric.status).replace('text-', 'bg-')}`} />
              </div>
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                {metric.label}:
              </span>
            </div>
            <span className={`text-[10px] font-black font-mono uppercase ${getStatusColor(metric.status)}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / Bracketing */}
      <div className="mt-1 flex justify-between items-center text-[8px] font-mono text-white/20">
        <span>[SYSTEM_STABLE]</span>
        <span className="text-amber-500/40">{"{ 🟢 }"}</span>
      </div>
    </div>
  );
};
