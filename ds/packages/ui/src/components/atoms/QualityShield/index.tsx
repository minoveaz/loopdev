import React from 'react';
import { QualityShieldProps, QAStatus } from './types';
import { Icon } from '../Icon';

const StatusIcon = ({ status }: { status: QAStatus }) => {
  switch (status) {
    case 'pass': return <Icon name="check_circle" size="sm" className="text-green-500" />;
    case 'fail': return <Icon name="cancel" size="sm" className="text-red-500" />;
    case 'warning': return <Icon name="report_problem" size="sm" className="text-yellow-500" />;
    default: return <Icon name="pending" size="sm" className="text-slate-500 animate-pulse" />;
  }
};

/**
 * @component QualityShield
 * @description Matriz lateral de certificación de QA. Visualiza el estado de los gates automáticos.
 * @category Governance
 */
export const QualityShield: React.FC<QualityShieldProps> = ({ metrics, className = '' }) => {
  return (
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-3 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 font-mono select-none group hover:bg-slate-900/60 transition-all ${className}`}>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
        <Icon name="verified_user" size="sm" className="text-blue-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">QA Matrix</span>
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([key, metric]) => (
          <div key={key} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] uppercase font-bold text-slate-500">{metric.label}</span>
              <StatusIcon status={metric.status} />
            </div>
            {metric.value && (
              <span className="text-[8px] text-blue-400/60 text-right uppercase">{metric.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-[8px] text-slate-600 italic">
          <span>Shield Active</span>
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
